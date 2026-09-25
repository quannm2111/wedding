import { addDoc, collection, documentId, getDocs, limit, orderBy, query, serverTimestamp, startAfter } from 'firebase/firestore';
import { db } from './firebase/firebaseConfig';
import { AVATAR_COLORS, validateWish } from './guestbook';
const guestBook = () => {
  if (!db) throw new Error('Sổ lời chúc chưa được kết nối.');
  return collection(db, 'guest_book');
};
export async function getGuestCommentFireBase(cursor = null) {
  const constraints = [orderBy('create_date', 'desc'), orderBy(documentId(), 'desc')];
  if (cursor) constraints.push(startAfter(cursor));
  const snapshot = await getDocs(query(guestBook(), ...constraints, limit(50)));
  return { items: snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id })), cursor: snapshot.docs.at(-1) || null, hasMore: snapshot.size === 50 };
}
export async function addGuestCommentFireBase(input) {
  const payload = validateWish(input.guest_name, input.message);
  return addDoc(guestBook(), { ...payload, create_date: serverTimestamp(), avatar_color: AVATAR_COLORS[Math.floor(Math.random() * AVATAR_COLORS.length)] });
}
