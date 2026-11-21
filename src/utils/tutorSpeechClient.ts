import type { LiveVoiceName } from './liveAudio.ts';
import { safeParseResponseJson } from './safeFetchJson.ts';

export interface FetchTutorSpeechResult {
  dataUrl: string | null;
  fallbackToBrowser: boolean;
  voiceName: LiveVoiceName;
}

const speechAudioCache = new Map<string, string>();
const inflightSpeechFetches = new Map<string, Promise<FetchTutorSpeechResult>>();

// When Gemini TTS hits quota or is cooling down, short-circuit cloud calls for 5 minutes
// so AI video lessons and interactive teaching transition instantaneously to browser voice synthesis.
let ttsQuotaCooldownUntil = 0;

function makeCacheKey(text: string, voiceName: LiveVoiceName): string {
  return `${voiceName}::${text.trim()}`;
}

export function isTtsQuotaCoolingDown(): boolean {
  return Date.now() < ttsQuotaCooldownUntil;
}

export function resetTtsQuotaCooldown(): void {
  ttsQuotaCooldownUntil = 0;
}

export function decodeBase64ToObjectUrl(base64Audio: string, mimeType: string): string {
  const binary = atob(base64Audio);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  const blob = new Blob([bytes], { type: mimeType || 'audio/wav' });
  return URL.createObjectURL(blob);
}

export async function fetchTutorSpeechAudio(params: {
  text: string;
  voiceName: LiveVoiceName;
  style?: string;
  signal?: AbortSignal;
}): Promise<FetchTutorSpeechResult> {
  const cleanText = params.text.trim();
  if (!cleanText) {
    return { dataUrl: null, fallbackToBrowser: true, voiceName: params.voiceName };
  }

  const key = makeCacheKey(cleanText, params.voiceName);
  const cached = speechAudioCache.get(key);
  if (cached) {
    return { dataUrl: cached, fallbackToBrowser: false, voiceName: params.voiceName };
  }

  if (isTtsQuotaCoolingDown()) {
    return { dataUrl: null, fallbackToBrowser: true, voiceName: params.voiceName };
  }

  const existingInflight = inflightSpeechFetches.get(key);
  if (existingInflight && !params.signal) {
    return existingInflight;
  }

  const runFetch = (async (): Promise<FetchTutorSpeechResult> => {
    try {
      const response = await fetch('/api/tutor/speak', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: cleanText,
          voiceName: params.voiceName,
          style: params.style,
        }),
        signal: params.signal,
      });

      if (response.status === 429) {
        ttsQuotaCooldownUntil = Date.now() + 5 * 60 * 1000;
        return { dataUrl: null, fallbackToBrowser: true, voiceName: params.voiceName };
      }

      const parsed = await safeParseResponseJson<{
        audioBase64?: string;
        mimeType?: string;
        fallbackToBrowserSpeech?: boolean;
        reason?: string;
        error?: string;
      }>(response);

      if (!parsed.ok) {
        if (/quota|429|RESOURCE_EXHAUSTED/i.test(parsed.errorMessage || '')) {
          ttsQuotaCooldownUntil = Date.now() + 5 * 60 * 1000;
        }
        return { dataUrl: null, fallbackToBrowser: true, voiceName: params.voiceName };
      }

      const payload = parsed.data;
      if (payload?.fallbackToBrowserSpeech || !payload?.audioBase64) {
        if (payload?.reason === 'quota') {
          ttsQuotaCooldownUntil = Date.now() + 5 * 60 * 1000;
        }
        return { dataUrl: null, fallbackToBrowser: true, voiceName: params.voiceName };
      }

      const mime = payload.mimeType || 'audio/wav';
      const objectUrl = decodeBase64ToObjectUrl(payload.audioBase64, mime);

      if (speechAudioCache.size >= 40) {
        const firstKey = speechAudioCache.keys().next().value;
        if (firstKey) {
          const oldUrl = speechAudioCache.get(firstKey);
          if (oldUrl && oldUrl.startsWith('blob:')) {
            URL.revokeObjectURL(oldUrl);
          }
          speechAudioCache.delete(firstKey);
        }
      }
      speechAudioCache.set(key, objectUrl);

      return { dataUrl: objectUrl, fallbackToBrowser: false, voiceName: params.voiceName };
    } catch (err) {
      if ((err as Error)?.name === 'AbortError') {
        throw err;
      }
      return { dataUrl: null, fallbackToBrowser: true, voiceName: params.voiceName };
    }
  })();

  if (!params.signal) {
    inflightSpeechFetches.set(key, runFetch);
    void runFetch.finally(() => {
      inflightSpeechFetches.delete(key);
    });
  }

  return runFetch;
}

export function prefetchTutorSpeechAudio(params: {
  text: string;
  voiceName: LiveVoiceName;
  style?: string;
}): void {
  const cleanText = params.text.trim();
  if (!cleanText || isTtsQuotaCoolingDown()) return;
  const key = makeCacheKey(cleanText, params.voiceName);
  if (speechAudioCache.has(key) || inflightSpeechFetches.has(key)) return;
  void fetchTutorSpeechAudio(params).catch(() => {
    // Ignore background prefetch errors
  });
}

/**
 * Splits long scripts into natural sentence chunks under ~180 characters
 * so browser speechSynthesis never stalls and fires chunk progress callbacks accurately.
 */
export function splitSpeechChunks(text: string, maxChunkLen = 150): string[] {
  const normalized = text.replace(/\s+/g, ' ').trim();
  if (!normalized) return [];
  const sentences = normalized.match(/[^.!?]+[.!?]*/g) ?? [normalized];
  const chunks: string[] = [];
  let buffer = '';

  for (const s of sentences) {
    const clean = s.trim();
    if (!clean) continue;
    if ((buffer + ' ' + clean).trim().length <= maxChunkLen) {
      buffer = buffer ? `${buffer} ${clean}` : clean;
    } else {
      if (buffer) chunks.push(buffer);
      if (clean.length <= maxChunkLen) {
        buffer = clean;
      } else {
        const words = clean.split(' ');
        let sub = '';
        for (const w of words) {
          if ((sub + ' ' + w).trim().length <= maxChunkLen) {
            sub = sub ? `${sub} ${w}` : w;
          } else {
            if (sub) chunks.push(sub);
            sub = w;
          }
        }
        buffer = sub;
      }
    }
  }
  if (buffer) chunks.push(buffer);
  return chunks;
}

function pickBestEnglishVoice(): SpeechSynthesisVoice | null {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) return null;
  const voices = window.speechSynthesis.getVoices();
  if (!voices.length) return null;
  return (
    voices.find((v) => /en[-_]GH|en[-_]NG|en[-_]GB/i.test(v.lang) && /natural|google|samantha|daniel/i.test(v.name)) ??
    voices.find((v) => v.lang.startsWith('en') && /natural|google/i.test(v.name)) ??
    voices.find((v) => v.lang.startsWith('en')) ??
    voices[0]
  );
}

export interface BrowserSpeechPlaybackHandle {
  cancel: () => void;
}

// Keep strong references to live SpeechSynthesisUtterance objects so Chromium GC cannot drop them mid-lesson
const pinnedUtterances = new Set<SpeechSynthesisUtterance>();

export function speakWithBrowserSpeech(params: {
  text: string;
  rate?: number;
  onStart?: () => void;
  onChunkStart?: (chunkIndex: number, totalChunks: number, chunkText: string) => void;
  onEnd?: () => void;
  onError?: () => void;
}): BrowserSpeechPlaybackHandle {
  let cancelled = false;
  let watchdogTimer: number | null = null;
  let chunkFallbackTimer: number | null = null;
  let keepAliveTimer: number | null = null;
  let currentUtter: SpeechSynthesisUtterance | null = null;

  const clearTimers = () => {
    if (watchdogTimer !== null) {
      window.clearTimeout(watchdogTimer);
      watchdogTimer = null;
    }
    if (chunkFallbackTimer !== null) {
      window.clearTimeout(chunkFallbackTimer);
      chunkFallbackTimer = null;
    }
  };

  const clearKeepAlive = () => {
    if (keepAliveTimer !== null) {
      window.clearInterval(keepAliveTimer);
      keepAliveTimer = null;
    }
  };

  const hasSpeechApi = typeof window !== 'undefined' && 'speechSynthesis' in window;

  if (hasSpeechApi) {
    try {
      window.speechSynthesis.cancel();
    } catch {
      // ignore
    }
  }

  const chunks = splitSpeechChunks(params.text, 150);
  if (chunks.length === 0) {
    params.onEnd?.();
    return { cancel: () => {} };
  }

  if (hasSpeechApi) {
    keepAliveTimer = window.setInterval(() => {
      if (cancelled) return;
      try {
        if (window.speechSynthesis.paused) {
          window.speechSynthesis.resume();
        }
      } catch {
        // ignore
      }
    }, 2200);
  }

  const rate = Math.max(0.75, Math.min(1.6, params.rate ?? 1));
  const voice = hasSpeechApi ? pickBestEnglishVoice() : null;
  let index = 0;
  let started = false;

  const speakNext = () => {
    clearTimers();
    if (cancelled) return;
    if (index >= chunks.length) {
      clearKeepAlive();
      params.onEnd?.();
      return;
    }

    const chunkIdx = index;
    const chunkText = chunks[chunkIdx];
    const wordCount = Math.max(2, chunkText.split(/\s+/).filter(Boolean).length);
    const estimatedMs = Math.max(1800, Math.round((wordCount / 2.25) * 1000 / rate) + 450);

    const notifyChunkActive = () => {
      if (cancelled) return;
      if (!started) {
        started = true;
        params.onStart?.();
      }
      params.onChunkStart?.(chunkIdx, chunks.length, chunkText);
    };

    if (!hasSpeechApi) {
      notifyChunkActive();
      chunkFallbackTimer = window.setTimeout(() => {
        index++;
        speakNext();
      }, estimatedMs);
      return;
    }

    const utter = new SpeechSynthesisUtterance(chunkText);
    currentUtter = utter;
    pinnedUtterances.add(utter);
    if (voice) utter.voice = voice;
    utter.lang = voice?.lang || 'en-GB';
    utter.rate = rate;
    utter.pitch = 1.02;

    let nativeStarted = false;
    let finishedChunk = false;

    const advanceOnce = () => {
      pinnedUtterances.delete(utter);
      if (currentUtter === utter) currentUtter = null;
      if (finishedChunk || cancelled) return;
      finishedChunk = true;
      clearTimers();
      index++;
      speakNext();
    };

    utter.onstart = () => {
      nativeStarted = true;
      if (chunkFallbackTimer !== null) {
        window.clearTimeout(chunkFallbackTimer);
        chunkFallbackTimer = null;
      }
      notifyChunkActive();
      watchdogTimer = window.setTimeout(advanceOnce, estimatedMs * 2 + 4500);
    };

    utter.onend = advanceOnce;
    utter.onerror = advanceOnce;

    // Headless / silent-device safety: if onstart doesn't fire within 550ms, drive chunk cadence cleanly
    chunkFallbackTimer = window.setTimeout(() => {
      if (cancelled || finishedChunk || nativeStarted) return;
      notifyChunkActive();
      watchdogTimer = window.setTimeout(advanceOnce, estimatedMs);
    }, 550);

    try {
      notifyChunkActive();
      if (window.speechSynthesis.paused) {
        window.speechSynthesis.resume();
      }
      window.speechSynthesis.speak(utter);
    } catch {
      watchdogTimer = window.setTimeout(advanceOnce, estimatedMs);
    }
  };

  speakNext();

  return {
    cancel: () => {
      cancelled = true;
      clearTimers();
      clearKeepAlive();
      if (currentUtter) {
        pinnedUtterances.delete(currentUtter);
        currentUtter = null;
      }
      if (hasSpeechApi) {
        try {
          window.speechSynthesis.cancel();
        } catch {
          // ignore
        }
      }
    },
  };
}

export function blobToBase64(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const result = typeof reader.result === 'string' ? reader.result : '';
      const commaIdx = result.indexOf(',');
      if (commaIdx === -1) {
        reject(new Error('Failed to encode recorded audio.'));
        return;
      }
      resolve(result.slice(commaIdx + 1));
    };
    reader.onerror = () => reject(new Error('Failed to read recorded audio.'));
    reader.readAsDataURL(blob);
  });
}

export async function transcribeSpokenAnswer(params: {
  blob: Blob;
  signal?: AbortSignal;
}): Promise<string> {
  const audioBase64 = await blobToBase64(params.blob);
  const mimeType = params.blob.type || 'audio/webm';

  const response = await fetch('/api/tutor/transcribe', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      audioBase64,
      mimeType,
    }),
    signal: params.signal,
  });

  const parsed = await safeParseResponseJson<{
    text?: string;
    fallbackToBrowserRecognition?: boolean;
    error?: string;
  }>(response);
  if (!parsed.ok) {
    throw new Error(parsed.errorMessage || 'Unable to transcribe recorded answer.');
  }

  return (parsed.data?.text ?? '').trim();
}
