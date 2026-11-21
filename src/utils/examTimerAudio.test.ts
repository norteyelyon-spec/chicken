import test from 'node:test';
import assert from 'node:assert/strict';
import {
  evaluateExamTick,
  FINAL_FIVE_MINUTES_SECONDS,
  FINAL_MINUTE_SECONDS,
} from './examTimerAudio';

test('evaluateExamTick stays silent and normal above 5 minutes or in study mode', () => {
  const aboveFiveMin = evaluateExamTick({
    mode: 'exam',
    remainingSeconds: FINAL_FIVE_MINUTES_SECONDS + 1,
    isCompleted: false,
    isMuted: false,
  });
  assert.equal(aboveFiveMin.shouldTick, false);
  assert.equal(aboveFiveMin.isFinalFiveMinutes, false);
  assert.equal(aboveFiveMin.urgencyLevel, 'normal');

  const studyMode = evaluateExamTick({
    mode: 'study',
    remainingSeconds: 120,
    isCompleted: false,
    isMuted: false,
  });
  assert.equal(studyMode.shouldTick, false);
  assert.equal(studyMode.isFinalFiveMinutes, false);
  assert.equal(studyMode.urgencyLevel, 'normal');
});

test('evaluateExamTick activates subtle ticking and warning/critical urgency in final 5 minutes', () => {
  const atFiveMin = evaluateExamTick({
    mode: 'exam',
    remainingSeconds: FINAL_FIVE_MINUTES_SECONDS,
    isCompleted: false,
    isMuted: false,
  });
  assert.equal(atFiveMin.shouldTick, true);
  assert.equal(atFiveMin.isFinalFiveMinutes, true);
  assert.equal(atFiveMin.isFinalMinute, false);
  assert.equal(atFiveMin.urgencyLevel, 'warning');
  assert.equal(atFiveMin.accent, true);
  assert.ok(atFiveMin.gain > 0 && atFiveMin.gain < 0.1);

  const regularSecond = evaluateExamTick({
    mode: 'exam',
    remainingSeconds: 175,
    isCompleted: false,
    isMuted: false,
  });
  assert.equal(regularSecond.shouldTick, true);
  assert.equal(regularSecond.urgencyLevel, 'warning');
  assert.equal(regularSecond.accent, false);

  const finalMinute = evaluateExamTick({
    mode: 'exam',
    remainingSeconds: FINAL_MINUTE_SECONDS,
    isCompleted: false,
    isMuted: false,
  });
  assert.equal(finalMinute.shouldTick, true);
  assert.equal(finalMinute.isFinalMinute, true);
  assert.equal(finalMinute.urgencyLevel, 'critical');
  assert.equal(finalMinute.accent, true);
  assert.ok(finalMinute.frequencyHz > regularSecond.frequencyHz);
});

test('evaluateExamTick respects mute toggle, completion state, and zero seconds', () => {
  const muted = evaluateExamTick({
    mode: 'exam',
    remainingSeconds: 90,
    isCompleted: false,
    isMuted: true,
  });
  assert.equal(muted.isFinalFiveMinutes, true);
  assert.equal(muted.urgencyLevel, 'warning');
  assert.equal(muted.shouldTick, false);

  const submitted = evaluateExamTick({
    mode: 'exam',
    remainingSeconds: 90,
    isCompleted: true,
    isMuted: false,
  });
  assert.equal(submitted.isFinalFiveMinutes, false);
  assert.equal(submitted.urgencyLevel, 'normal');
  assert.equal(submitted.shouldTick, false);

  const expired = evaluateExamTick({
    mode: 'exam',
    remainingSeconds: 0,
    isCompleted: false,
    isMuted: false,
  });
  assert.equal(expired.isFinalFiveMinutes, false);
  assert.equal(expired.urgencyLevel, 'normal');
  assert.equal(expired.shouldTick, false);
});
