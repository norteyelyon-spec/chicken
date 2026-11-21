import type { TutorStudentContextPayload } from '../types/index.ts';
import { buildTutorSystemInstruction } from './tutorContext.ts';

export type LiveVoiceName = 'Zephyr' | 'Kore' | 'Puck' | 'Charon' | 'Fenrir';

export const LIVE_VOICE_OPTIONS: { id: LiveVoiceName; label: string; tone: string }[] = [
  { id: 'Zephyr', label: 'Zephyr', tone: 'Warm & encouraging' },
  { id: 'Kore', label: 'Kore', tone: 'Clear & structured' },
  { id: 'Puck', label: 'Puck', tone: 'Upbeat & conversational' },
  { id: 'Charon', label: 'Charon', tone: 'Calm & analytical' },
  { id: 'Fenrir', label: 'Fenrir', tone: 'Focused & brisk' },
];

export function isValidLiveVoice(value: unknown): value is LiveVoiceName {
  return (
    typeof value === 'string' &&
    LIVE_VOICE_OPTIONS.some((option) => option.id === value)
  );
}

/**
 * Resample mono Float32 audio between arbitrary sample rates using linear interpolation.
 * Ensures 16kHz PCM input even on browsers that ignore AudioContext({ sampleRate: 16000 }).
 */
export function resampleFloat32(
  samples: Float32Array,
  sourceRate: number,
  targetRate: number
): Float32Array {
  if (samples.length === 0 || sourceRate <= 0 || targetRate <= 0 || sourceRate === targetRate) {
    return samples;
  }
  const ratio = sourceRate / targetRate;
  const targetLength = Math.max(1, Math.round(samples.length / ratio));
  const out = new Float32Array(targetLength);
  for (let i = 0; i < targetLength; i++) {
    const srcPos = i * ratio;
    const idx = Math.floor(srcPos);
    const frac = srcPos - idx;
    const s0 = samples[Math.min(idx, samples.length - 1)] ?? 0;
    const s1 = samples[Math.min(idx + 1, samples.length - 1)] ?? s0;
    out[i] = s0 + (s1 - s0) * frac;
  }
  return out;
}

/**
 * Encode mono Float32 [-1, 1] PCM samples to base64-encoded 16-bit little-endian PCM.
 */
export function float32ToPcm16Base64(samples: Float32Array): string {
  const bytes = new Uint8Array(samples.length * 2);
  const view = new DataView(bytes.buffer);
  for (let i = 0; i < samples.length; i++) {
    const clamped = Math.max(-1, Math.min(1, samples[i] ?? 0));
    const int16 = clamped < 0 ? Math.round(clamped * 0x8000) : Math.round(clamped * 0x7fff);
    view.setInt16(i * 2, int16, true);
  }

  if (typeof globalThis.btoa === 'function') {
    let binary = '';
    const chunkSize = 0x8000;
    for (let offset = 0; offset < bytes.length; offset += chunkSize) {
      const slice = bytes.subarray(offset, offset + chunkSize);
      binary += String.fromCharCode(...slice);
    }
    return globalThis.btoa(binary);
  }
  return Buffer.from(bytes).toString('base64');
}

/**
 * Decode base64-encoded 16-bit little-endian PCM into normalized Float32 [-1, 1] samples.
 */
export function pcm16Base64ToFloat32(base64: string): Float32Array {
  if (!base64) return new Float32Array(0);
  let bytes: Uint8Array;
  if (typeof globalThis.atob === 'function') {
    const binary = globalThis.atob(base64);
    bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) {
      bytes[i] = binary.charCodeAt(i);
    }
  } else {
    bytes = new Uint8Array(Buffer.from(base64, 'base64'));
  }

  const sampleCount = Math.floor(bytes.byteLength / 2);
  const out = new Float32Array(sampleCount);
  const view = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);
  for (let i = 0; i < sampleCount; i++) {
    const int16 = view.getInt16(i * 2, true);
    out[i] = int16 / 32768;
  }
  return out;
}

export const MIN_MIC_GAIN = 1.0;
export const MAX_MIC_GAIN = 4.0;
export const DEFAULT_MIC_GAIN = 2.4;

export function clampMicGain(gain: number): number {
  if (!Number.isFinite(gain)) return DEFAULT_MIC_GAIN;
  return Math.max(MIN_MIC_GAIN, Math.min(MAX_MIC_GAIN, Math.round(gain * 10) / 10));
}

/**
 * Apply bounded software microphone boost cleanly in [-1, 1] without sample wraparound.
 */
export function applyMicGain(samples: Float32Array, gain = DEFAULT_MIC_GAIN): Float32Array {
  const safeGain = clampMicGain(gain);
  if (samples.length === 0 || safeGain === 1) return samples;
  const out = new Float32Array(samples.length);
  for (let i = 0; i < samples.length; i++) {
    const amplified = (samples[i] ?? 0) * safeGain;
    out[i] = Math.max(-1, Math.min(1, amplified));
  }
  return out;
}

/**
 * Compute normalized [0, 1] RMS energy for live audio level meters.
 * Uses responsive 5.5x perceptual scaling so natural speech reads clearly.
 */
export function computeRmsLevel(samples: Float32Array, sensitivity = 5.5): number {
  if (samples.length === 0) return 0;
  let sumSq = 0;
  for (let i = 0; i < samples.length; i++) {
    const s = samples[i] ?? 0;
    sumSq += s * s;
  }
  const rms = Math.sqrt(sumSq / samples.length);
  return Math.min(1, rms * sensitivity);
}

export function buildLiveWebSocketUrl(loc: { protocol: string; host: string }): string {
  const wsProtocol = loc.protocol === 'https:' ? 'wss:' : 'ws:';
  return `${wsProtocol}//${loc.host}/api/tutor/live`;
}

export function buildLiveTutorInstruction(
  ctx: TutorStudentContextPayload,
  lessonContext?: { topicTitle: string; stageTitle?: string; explanation?: string } | null
): string {
  const lessonBlock = lessonContext
    ? `\nACTIVE INTERACTIVE LESSON IN PROGRESS:
- Topic: ${lessonContext.topicTitle}
${lessonContext.stageTitle ? `- Current Stage: ${lessonContext.stageTitle}` : ''}
${lessonContext.explanation ? `- Stage Focus: ${lessonContext.explanation.slice(0, 400)}` : ''}
Continue coaching ${ctx.preferredName} aloud on this exact stage and ask a check question.`
    : '';

  return `${buildTutorSystemInstruction(ctx)}${lessonBlock}

REAL-TIME VOICE CONVERSATION RULES:
- You are speaking live with ${ctx.preferredName} over a real-time voice conversation using natural, clear Ghanaian Senior High School teaching tone.
- Keep spoken turns crisp and conversational (typically 2 to 4 sentences per turn unless the student asks for a deeper walkthrough), pausing cleanly so the student can interrupt or answer Socratic check questions.
- Verbalize equations and symbols naturally instead of reading raw LaTeX delimiters aloud (for example, say "F equals m times a" or "x squared plus 2x" instead of "dollar sign").
- When relevant, connect explanations to ${ctx.preferredName}'s pending Mistake Bank topics and WASSCE Paper 1, 2, or 3 exam traps.`;
}

