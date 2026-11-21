import test from 'node:test';
import assert from 'node:assert/strict';
import {
  clampUtf8String,
  getUtf8ByteLength,
  sanitizeEmailAddress,
  sanitizeFirestoreId,
} from './firestoreSanitize';

test('clampUtf8String clamps multi-byte Unicode text within exact UTF-8 byte limits', () => {
  const mathContent = 'α → β × γ − δ '.repeat(20);
  const clamped = clampUtf8String(mathContent, 40);
  assert.ok(getUtf8ByteLength(clamped) <= 40);
  assert.ok(clamped.length > 0);
  assert.equal(clampUtf8String('   ', 40, 'Fallback'), 'Fallback');
});

test('sanitizeFirestoreId normalizes invalid IDs, strips colons by default, and supports flashcard colons', () => {
  assert.equal(sanitizeFirestoreId('note-phys-dimensions'), 'note-phys-dimensions');
  assert.equal(sanitizeFirestoreId('fc:chem:q1'), 'fc_chem_q1');
  assert.equal(sanitizeFirestoreId('fc:chem:q1', 'card', true), 'fc:chem:q1');
  assert.equal(sanitizeFirestoreId('../bad id!'), '___bad_id_');
  assert.ok(sanitizeFirestoreId('a'.repeat(200)).length <= 128);
});

test('sanitizeEmailAddress validates RFC-like format and falls back safely', () => {
  assert.equal(sanitizeEmailAddress('kwame@ug.edu.gh'), 'kwame@ug.edu.gh');
  assert.equal(sanitizeEmailAddress('invalid-email'), 'student@wassce.edu.gh');
  assert.equal(sanitizeEmailAddress(''), 'student@wassce.edu.gh');
});

