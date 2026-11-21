import test from 'node:test';
import assert from 'node:assert/strict';
import { evaluateWorkingsExpression } from './workingsMath.ts';
import { extractTutorErrorMessage } from './tutorContext.ts';

test('evaluateWorkingsExpression computes standard arithmetic, powers, and Unicode math operators', () => {
  const res1 = evaluateWorkingsExpression('(24 - 6) ÷ 3 × 2^3');
  assert.equal(res1.ok, true);
  if (res1.ok) {
    assert.equal(res1.value, 48);
    assert.equal(res1.formatted, '48');
  }

  const res2 = evaluateWorkingsExpression('√(144) + 3²');
  assert.equal(res2.ok, true);
  if (res2.ok) {
    assert.equal(res2.value, 21);
  }
});

test('evaluateWorkingsExpression supports trig in degrees/radians, logs, and constants', () => {
  const degSin = evaluateWorkingsExpression('sin(30) * 100', 'deg');
  assert.equal(degSin.ok, true);
  if (degSin.ok) {
    assert.ok(Math.abs(degSin.value - 50) < 1e-9);
    assert.equal(degSin.formatted, '50');
  }

  const radCos = evaluateWorkingsExpression('cos(pi)', 'rad');
  assert.equal(radCos.ok, true);
  if (radCos.ok) {
    assert.ok(Math.abs(radCos.value + 1) < 1e-9);
  }

  const logVal = evaluateWorkingsExpression('log(1000) + ln(e)');
  assert.equal(logVal.ok, true);
  if (logVal.ok) {
    assert.ok(Math.abs(logVal.value - 4) < 1e-9);
  }
});

test('evaluateWorkingsExpression returns explicit errors on division by zero or invalid syntax', () => {
  const divZero = evaluateWorkingsExpression('45 / (3 - 3)');
  assert.equal(divZero.ok, false);
  if (!divZero.ok) {
    assert.match(divZero.error, /Division by zero/i);
  }

  const badSyntax = evaluateWorkingsExpression('(2 + 3');
  assert.equal(badSyntax.ok, false);
  if (!badSyntax.ok) {
    assert.match(badSyntax.error, /parenthesis/i);
  }
});

test('extractTutorErrorMessage converts raw HTML/DOCTYPE JSON errors into friendly guidance', () => {
  const friendly = extractTutorErrorMessage(
    500,
    'Unexpected token \'<\', "<!doctype "... is not valid JSON'
  );
  assert.doesNotMatch(friendly, /Unexpected token/i);
  assert.match(friendly, /HTML response instead of JSON/i);
});
