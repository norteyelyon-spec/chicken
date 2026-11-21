import type { TestMode } from '../types';

export const FINAL_FIVE_MINUTES_SECONDS = 300;
export const FINAL_MINUTE_SECONDS = 60;

export type TimerUrgencyLevel = 'normal' | 'warning' | 'critical';

export interface ExamTickSpec {
  shouldTick: boolean;
  isFinalFiveMinutes: boolean;
  isFinalMinute: boolean;
  urgencyLevel: TimerUrgencyLevel;
  accent: boolean;
  frequencyHz: number;
  gain: number;
}

export interface EvaluateExamTickInput {
  mode: TestMode;
  remainingSeconds: number;
  isCompleted: boolean;
  isMuted: boolean;
}

/**
 * Pure decision helper determining timer urgency styling and whether
 * the subtle chronograph tick sound should fire for the current second.
 */
export function evaluateExamTick({
  mode,
  remainingSeconds,
  isCompleted,
  isMuted,
}: EvaluateExamTickInput): ExamTickSpec {
  const safeRemaining = Math.max(0, Math.floor(remainingSeconds));
  const isActiveExam = mode === 'exam' && !isCompleted && safeRemaining > 0;
  const isFinalFiveMinutes = isActiveExam && safeRemaining <= FINAL_FIVE_MINUTES_SECONDS;
  const isFinalMinute = isActiveExam && safeRemaining <= FINAL_MINUTE_SECONDS;

  let urgencyLevel: TimerUrgencyLevel = 'normal';
  if (isFinalMinute) {
    urgencyLevel = 'critical';
  } else if (isFinalFiveMinutes) {
    urgencyLevel = 'warning';
  }

  // Slight accent on every minute boundary or throughout the final minute
  const isMinuteMark = safeRemaining % 60 === 0;
  const accent = isFinalFiveMinutes && (isFinalMinute || isMinuteMark);

  return {
    shouldTick: isFinalFiveMinutes && !isMuted,
    isFinalFiveMinutes,
    isFinalMinute,
    urgencyLevel,
    accent,
    frequencyHz: isFinalMinute ? 1320 : isMinuteMark ? 1240 : 1040,
    gain: isFinalMinute ? 0.065 : isMinuteMark ? 0.06 : 0.042,
  };
}

let sharedAudioCtx: AudioContext | null = null;
let sharedNoiseBuffer: AudioBuffer | null = null;

function getAudioContextConstructor(): typeof AudioContext | null {
  if (typeof window === 'undefined') return null;
  const win = window as Window & {
    AudioContext?: typeof AudioContext;
    webkitAudioContext?: typeof AudioContext;
  };
  return win.AudioContext ?? win.webkitAudioContext ?? null;
}

/**
 * Creates or resumes a shared Web Audio API AudioContext inside a user gesture
 * so later timer ticks play cleanly without browser autoplay blocks.
 */
export function unlockExamAudioContext(): AudioContext | null {
  const AudioCtx = getAudioContextConstructor();
  if (!AudioCtx) return null;

  try {
    if (!sharedAudioCtx || sharedAudioCtx.state === 'closed') {
      sharedAudioCtx = new AudioCtx();
      sharedNoiseBuffer = null;
    }
    if (sharedAudioCtx.state === 'suspended') {
      void sharedAudioCtx.resume().catch(() => {});
    }
    return sharedAudioCtx;
  } catch {
    return null;
  }
}

function getShortClickNoiseBuffer(ctx: AudioContext): AudioBuffer {
  if (sharedNoiseBuffer && sharedNoiseBuffer.sampleRate === ctx.sampleRate) {
    return sharedNoiseBuffer;
  }
  const length = Math.max(1, Math.floor(ctx.sampleRate * 0.014));
  const buffer = ctx.createBuffer(1, length, ctx.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < length; i++) {
    const decay = Math.pow(1 - i / length, 2.4);
    data[i] = (Math.random() * 2 - 1) * decay;
  }
  sharedNoiseBuffer = buffer;
  return buffer;
}

/**
 * Synthesizes a subtle, understated analog-chronograph tick (~24ms envelope)
 * with zero external audio assets.
 */
export function playSubtleExamTick(spec: ExamTickSpec): boolean {
  if (!spec.shouldTick) return false;
  const ctx = unlockExamAudioContext();
  if (!ctx || ctx.state !== 'running') return false;

  try {
    const now = ctx.currentTime;

    // 1. Crisp wooden/quartz body impulse
    const osc = ctx.createOscillator();
    const oscGain = ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(spec.frequencyHz, now);
    osc.frequency.exponentialRampToValueAtTime(spec.frequencyHz * 0.45, now + 0.022);

    oscGain.gain.setValueAtTime(0.0001, now);
    oscGain.gain.linearRampToValueAtTime(spec.gain, now + 0.002);
    oscGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.024);

    osc.connect(oscGain);
    oscGain.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 0.026);

    // 2. Soft high-pass transient for authentic mechanical escapement click
    const noise = ctx.createBufferSource();
    noise.buffer = getShortClickNoiseBuffer(ctx);

    const filter = ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(spec.accent ? 3200 : 2500, now);
    filter.Q.setValueAtTime(1.8, now);

    const noiseGain = ctx.createGain();
    noiseGain.gain.setValueAtTime(spec.gain * 0.55, now);
    noiseGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.014);

    noise.connect(filter);
    filter.connect(noiseGain);
    noiseGain.connect(ctx.destination);
    noise.start(now);
    noise.stop(now + 0.015);

    return true;
  } catch {
    return false;
  }
}

/**
 * Plays a gentle two-note chime when the exam countdown reaches 00:00.
 */
export function playExamTimeUpChime(): boolean {
  const ctx = unlockExamAudioContext();
  if (!ctx || ctx.state !== 'running') return false;

  try {
    const now = ctx.currentTime;
    const notes = [880, 659.25];
    notes.forEach((freq, idx) => {
      const start = now + idx * 0.14;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, start);

      gain.gain.setValueAtTime(0.0001, start);
      gain.gain.linearRampToValueAtTime(0.06, start + 0.015);
      gain.gain.exponentialRampToValueAtTime(0.0001, start + 0.28);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(start);
      osc.stop(start + 0.3);
    });
    return true;
  } catch {
    return false;
  }
}
