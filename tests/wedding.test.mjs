import test from 'node:test';
import assert from 'node:assert/strict';
import { calendarDays, getCountdown, dateLabel, timeLabel } from '../src/wedding.js';
import { validateWish } from '../src/guestbook.js';

test('emoji wishes preserve Unicode and enforce character limits', () => {
  const emoji = '\u{1f496}';
  assert.equal(validateWish('Mai', emoji.repeat(1000)).message, emoji.repeat(1000));
  assert.throws(() => validateWish('Mai', emoji.repeat(1001)));
});

test('October calendar starts on Thursday and wedding is Sunday', () => {
  const { cells } = calendarDays();
  assert.equal(cells.indexOf(1), 3);
  assert.equal(cells.indexOf(25) % 7, 6);
  assert.equal(cells.filter(Boolean).length, 31);
  assert.equal(dateLabel, '25/10/2026');
  assert.equal(timeLabel, '11:00');
});
test('countdown uses Vietnam time, stops at ceremony and distinguishes the following day', () => {
  assert.equal(getCountdown(Date.parse('2026-10-25T03:59:59Z')).seconds, 1);
  assert.equal(getCountdown(Date.parse('2026-10-25T04:00:00Z')).done, true);
  assert.equal(getCountdown(Date.parse('2026-10-25T16:59:59Z')).isWeddingDay, true);
  assert.equal(getCountdown(Date.parse('2026-10-25T17:00:00Z')).isWeddingDay, false);
  assert.equal(getCountdown(Date.parse('2026-10-26T04:00:00Z')).seconds, 0);
});
test('wishes trim input and reject blank or excessive content', () => {
  assert.deepEqual(validateWish('  Mai  ', ' Chúc hạnh phúc! '), { guest_name: 'Mai', message: 'Chúc hạnh phúc!' });
  for (const [name, message] of [[' ', 'Hi'], ['Mai', '\n '], ['a'.repeat(81), 'Hi'], ['Mai', 'a'.repeat(1001)]]) assert.throws(() => validateWish(name, message));
  assert.doesNotThrow(() => validateWish('a'.repeat(80), 'a'.repeat(1000)));
});
