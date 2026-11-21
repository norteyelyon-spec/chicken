import test from 'node:test';
import assert from 'node:assert/strict';
import {
  applyMicGain,
  buildLiveTutorInstruction,
  buildLiveWebSocketUrl,
  clampMicGain,
  computeRmsLevel,
  DEFAULT_MIC_GAIN,
  float32ToPcm16Base64,
  isValidLiveVoice,
  pcm16Base64ToFloat32,
  resampleFloat32,
} from './liveAudio.ts';
import type { TutorStudentContextPayload } from '../types/index.ts';

test('liveAudio PCM16 round-trip & resampling', async (t) => {
  await t.test('round-trips Float32 samples through 16-bit little-endian PCM base64 accurately', () => {
    const input = new Float32Array([0, 0.5, -0.5, 1, -1, 0.25, -0.75]);
    const encoded = float32ToPcm16Base64(input);
    assert.ok(encoded.length > 0);
    const decoded = pcm16Base64ToFloat32(encoded);
    assert.equal(decoded.length, input.length);
    for (let i = 0; i < input.length; i++) {
      assert.ok(
        Math.abs(decoded[i] - input[i]) < 0.001,
        `Sample ${i} mismatch: got ${decoded[i]}, expected ${input[i]}`
      );
    }
  });

  await t.test('clamps out-of-range samples before encoding to PCM16', () => {
    const input = new Float32Array([2.5, -3.1]);
    const decoded = pcm16Base64ToFloat32(float32ToPcm16Base64(input));
    assert.ok(decoded[0] <= 1 && decoded[0] > 0.99);
    assert.equal(decoded[1], -1);
  });

  await t.test('resamples 48kHz audio cleanly down to 16kHz (1/3 length)', () => {
    const input = new Float32Array(480);
    for (let i = 0; i < input.length; i++) {
      input[i] = Math.sin((2 * Math.PI * i) / 48);
    }
    const resampled = resampleFloat32(input, 48000, 16000);
    assert.equal(resampled.length, 160);
  });

  await t.test('computes RMS audio energy level bounded to [0, 1] and amplifies mic gain cleanly', () => {
    assert.equal(computeRmsLevel(new Float32Array([0, 0, 0])), 0);
    const loud = computeRmsLevel(new Float32Array([0.9, -0.9, 0.9, -0.9]));
    assert.equal(loud, 1);
    const softSamples = new Float32Array([0.08, -0.08, 0.08, -0.08]);
    const soft = computeRmsLevel(softSamples);
    assert.ok(soft > 0.4 && soft < 1);

    assert.equal(clampMicGain(0.2), 1.0);
    assert.equal(clampMicGain(9.0), 4.0);
    assert.equal(clampMicGain(Number.NaN), DEFAULT_MIC_GAIN);

    const boosted = applyMicGain(softSamples, 2.5);
    assert.ok(Math.abs(boosted[0] - 0.2) < 1e-6);
    assert.ok(computeRmsLevel(boosted) > soft);

    const clipped = applyMicGain(new Float32Array([0.8, -0.8]), 3.0);
    assert.equal(clipped[0], 1);
    assert.equal(clipped[1], -1);
  });

  await t.test('validates prebuilt Live API voice names and constructs ws/wss URLs', () => {
    assert.equal(isValidLiveVoice('Zephyr'), true);
    assert.equal(isValidLiveVoice('Kore'), true);
    assert.equal(isValidLiveVoice('InvalidVoice'), false);
    assert.equal(
      buildLiveWebSocketUrl({ protocol: 'https:', host: 'example.com' }),
      'wss://example.com/api/tutor/live'
    );
    assert.equal(
      buildLiveWebSocketUrl({ protocol: 'http:', host: 'localhost:3000' }),
      'ws://localhost:3000/api/tutor/live'
    );
  });

  await t.test('builds spoken Live Tutor system instruction grounded in student context', () => {
    const ctx: TutorStudentContextPayload = {
      preferredName: 'Kwame',
      gradeLevel: 'SHS3',
      targetYear: 2026,
      schoolName: 'Prempeh College',
      subjects: ['physics', 'chemistry'],
      overallAccuracy: 74,
      totalQuestionsSolved: 42,
      currentStreak: 5,
      subjectMastery: [
        {
          subject: 'physics',
          averagePercentage: 70,
          questionsSolved: 20,
          byGrade: { SHS1: 72, SHS2: 68, SHS3: 70 },
        },
      ],
      pendingMistakes: [],
      recentNoteTitles: ['Atomic Theory'],
      recommendedTopics: [],
      activeQuestion: null,
    };
    const prompt = buildLiveTutorInstruction(ctx);
    assert.match(prompt, /Kwame/);
    assert.match(prompt, /REAL-TIME VOICE CONVERSATION RULES/);
    assert.match(prompt, /Verbalize equations/);
  });
});
