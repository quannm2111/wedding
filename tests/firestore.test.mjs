import { readFileSync } from 'node:fs';
import test, { after, before } from 'node:test';
import assert from 'node:assert/strict';
import { initializeTestEnvironment, assertFails, assertSucceeds } from '@firebase/rules-unit-testing';
import { collection, doc, setDoc, getDocs, query, limit, orderBy, documentId, startAfter, deleteDoc, updateDoc, serverTimestamp, Timestamp } from 'firebase/firestore';

let env;
let db;
const valid = () => ({ guest_name: 'Khách mời', message: 'Chúc hai bạn hạnh phúc!\nYêu thương nhiều.', create_date: serverTimestamp(), avatar_color: '#a64e6b' });
before(async () => {
  env = await initializeTestEnvironment({ projectId: 'demo-quan-huong', firestore: { host: '127.0.0.1', port: 8080, rules: readFileSync('firestore.rules', 'utf8') } });
  db = env.unauthenticatedContext().firestore();
});
after(async () => { await env?.cleanup(); });
test('public guests can create and read valid wishes but cannot edit or delete', async () => {
  const ref = doc(db, 'guest_book', 'valid');
  await assertSucceeds(setDoc(ref, valid()));
  await assertSucceeds(getDocs(query(collection(db, 'guest_book'), limit(50))));
  await assertFails(updateDoc(ref, { message: 'changed' }));
  await assertFails(deleteDoc(ref));
});
test('reject invalid fields, lengths, timestamps, avatar colors and unrelated collections', async () => {
  const invalid = [{ guest_name: '' }, { guest_name: '   ' }, { guest_name: 'a'.repeat(81) }, { message: '\n  ' }, { message: '' }, { message: 'a'.repeat(1001) }, { avatar_color: 'red' }, { create_date: Timestamp.fromMillis(0) }, { extra: true }];
  for (const [i, fields] of invalid.entries()) await assertFails(setDoc(doc(db, 'guest_book', `invalid-${i}`), { ...valid(), ...fields }));
  await assertFails(setDoc(doc(db, 'private', 'test'), valid()));
  await assertFails(getDocs(collection(db, 'guest_book')));
  await assertFails(getDocs(query(collection(db, 'guest_book'), limit(51))));
});
test('pagination returns latest 50 then older records without overlap', async () => {
  await env.clearFirestore();
  await env.withSecurityRulesDisabled(async context => {
    const admin = context.firestore();
    await Promise.all(Array.from({ length: 55 }, (_, i) => setDoc(doc(admin, 'guest_book', `seed-${i}`), { ...valid(), create_date: Timestamp.fromMillis(1700000000000 + i * 1000) })));
  });
  const ordered = [orderBy('create_date', 'desc'), orderBy(documentId(), 'desc')];
  const first = await getDocs(query(collection(db, 'guest_book'), ...ordered, limit(50)));
  const second = await getDocs(query(collection(db, 'guest_book'), ...ordered, startAfter(first.docs.at(-1)), limit(50)));
  assert.equal(first.size, 50); assert.equal(second.size, 5);
  assert.equal(first.docs[0].id, 'seed-54');
  assert.equal(new Set([...first.docs, ...second.docs].map(item => item.id)).size, 55);
});
