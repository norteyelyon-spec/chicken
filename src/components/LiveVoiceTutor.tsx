import React, { useEffect, useRef, useState } from 'react';
import {
  AlertCircle,
  Mic,
  MicOff,
  PhoneCall,
  PhoneOff,
  Send,
  Volume2,
  Waves,
} from 'lucide-react';
import { loadAllSyllabusNotes, loadMcqsForSubjects } from '../data/curriculumLoader';
import type { TutorQuestionContext, TutorStudentContextPayload } from '../types';
import {
  buildLiveWebSocketUrl,
  clampMicGain,
  computeRmsLevel,
  DEFAULT_MIC_GAIN,
  float32ToPcm16Base64,
  LIVE_VOICE_OPTIONS,
  MAX_MIC_GAIN,
  MIN_MIC_GAIN,
  pcm16Base64ToFloat32,
  resampleFloat32,
  type LiveVoiceName,
} from '../utils/liveAudio';
import { buildLocalVoiceReply } from '../utils/localTeachingFallback';
import { safeParseResponseJson } from '../utils/safeFetchJson';
import { extractTutorErrorMessage } from '../utils/tutorContext';
import {
  fetchTutorSpeechAudio,
  speakWithBrowserSpeech,
  transcribeSpokenAnswer,
  type BrowserSpeechPlaybackHandle,
} from '../utils/tutorSpeechClient';

type LiveSessionStatus = 'idle' | 'connecting' | 'live';
type VoiceTransportMode = 'none' | 'gemini-live' | 'browser-voice';

interface LiveTranscriptItem {
  id: string;
  speaker: 'student' | 'tutor';
  text: string;
}

interface SpeechRecognitionAlternativeLike {
  transcript: string;
}

interface SpeechRecognitionResultLike {
  isFinal: boolean;
  0: SpeechRecognitionAlternativeLike;
}

interface SpeechRecognitionEventLike {
  results: ArrayLike<SpeechRecognitionResultLike>;
  resultIndex: number;
}

interface SpeechRecognitionLike {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  onresult: ((ev: SpeechRecognitionEventLike) => void) | null;
  onerror: ((ev: { error?: string }) => void) | null;
  onend: (() => void) | null;
  start: () => void;
  stop: () => void;
}

interface LiveVoiceTutorProps {
  studentContext: TutorStudentContextPayload;
  activeQuestion: TutorQuestionContext | null;
  compact?: boolean;
  initialVoiceName?: LiveVoiceName;
  lessonContext?: {
    topicTitle: string;
    stageTitle?: string;
    explanation?: string;
  } | null;
  onClearLessonContext?: () => void;
}

const QUICK_VOICE_TOPICS = [
  {
    label: 'Quiz me aloud on weak topic',
    text: 'Ask me one WASSCE Paper 1 oral check question on my weakest syllabus topic right now and wait for my answer.',
  },
  {
    label: 'Explain my pending mistakes',
    text: 'Briefly walk me through my pending Mistake Bank concepts and test me on one.',
  },
  {
    label: 'Paper 3 Practical viva drill',
    text: 'Run a quick WASSCE Paper 3 oral drill on precautions and error sources in Physics or Chemistry practicals.',
  },
];

export const LiveVoiceTutor: React.FC<LiveVoiceTutorProps> = ({
  studentContext,
  activeQuestion,
  compact = false,
  initialVoiceName,
  lessonContext,
  onClearLessonContext,
}) => {
  const [voiceName, setVoiceName] = useState<LiveVoiceName>(initialVoiceName ?? 'Zephyr');
  const [status, setStatus] = useState<LiveSessionStatus>('idle');
  const [transportMode, setTransportMode] = useState<VoiceTransportMode>('none');
  const [hasMicInput, setHasMicInput] = useState(false);
  const [micDiagnostic, setMicDiagnostic] = useState<string | null>(null);
  const [isRetryingMic, setIsRetryingMic] = useState(false);
  const [isRecordingClip, setIsRecordingClip] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isModelSpeaking, setIsModelSpeaking] = useState(false);
  const [micLevel, setMicLevel] = useState(0);
  const [micGain, setMicGain] = useState(DEFAULT_MIC_GAIN);
  const [infoNotice, setInfoNotice] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [transcripts, setTranscripts] = useState<LiveTranscriptItem[]>([]);
  const [textDraft, setTextDraft] = useState('');
  const [isFallbackBusy, setIsFallbackBusy] = useState(false);

  const ttsAudioRef = useRef<HTMLAudioElement | null>(null);
  const browserSpeechRef = useRef<BrowserSpeechPlaybackHandle | null>(null);
  const recognitionRef = useRef<SpeechRecognitionLike | null>(null);
  const clipRecorderRef = useRef<MediaRecorder | null>(null);
  const clipChunksRef = useRef<Blob[]>([]);

  const wsRef = useRef<WebSocket | null>(null);
  const isMutedRef = useRef(false);
  const micGainRef = useRef(DEFAULT_MIC_GAIN);
  const isModelSpeakingRef = useRef(false);
  const statusRef = useRef<LiveSessionStatus>('idle');
  const transportModeRef = useRef<VoiceTransportMode>('none');
  const inputCtxRef = useRef<AudioContext | null>(null);
  const outputCtxRef = useRef<AudioContext | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const processorRef = useRef<ScriptProcessorNode | null>(null);
  const sourceNodeRef = useRef<MediaStreamAudioSourceNode | null>(null);
  const gainNodeRef = useRef<GainNode | null>(null);
  const silentSinkRef = useRef<GainNode | null>(null);
  const boostedDestRef = useRef<MediaStreamAudioDestinationNode | null>(null);
  const micAnalyserTimerRef = useRef<number | null>(null);
  const nextStartTimeRef = useRef(0);
  const activeSourcesRef = useRef<Set<AudioBufferSourceNode>>(new Set());
  const transcriptEndRef = useRef<HTMLDivElement | null>(null);
  const speakingTimerRef = useRef<number | null>(null);
  const liveReadyReceivedRef = useRef(false);
  const connectTimeoutRef = useRef<number | null>(null);

  useEffect(() => {
    if (initialVoiceName && statusRef.current === 'idle') {
      setVoiceName(initialVoiceName);
    }
  }, [initialVoiceName]);

  useEffect(() => {
    isMutedRef.current = isMuted;
    if (transportModeRef.current === 'browser-voice') {
      if (isMuted) {
        try {
          recognitionRef.current?.stop();
        } catch {
          // ignore
        }
      } else if (!isModelSpeakingRef.current) {
        try {
          recognitionRef.current?.start();
        } catch {
          // ignore if already running
        }
      }
    }
  }, [isMuted]);

  useEffect(() => {
    isModelSpeakingRef.current = isModelSpeaking;
    if (transportModeRef.current !== 'browser-voice' || !recognitionRef.current) return;
    if (isModelSpeaking) {
      try {
        recognitionRef.current.stop();
      } catch {
        // ignore
      }
      return;
    }
    const resumeTimer = window.setTimeout(() => {
      if (
        statusRef.current === 'live' &&
        transportModeRef.current === 'browser-voice' &&
        !isMutedRef.current &&
        !isModelSpeakingRef.current
      ) {
        try {
          recognitionRef.current?.start();
        } catch {
          // ignore
        }
      }
    }, 260);
    return () => window.clearTimeout(resumeTimer);
  }, [isModelSpeaking]);

  useEffect(() => {
    const clamped = clampMicGain(micGain);
    micGainRef.current = clamped;
    if (gainNodeRef.current && inputCtxRef.current) {
      try {
        gainNodeRef.current.gain.setTargetAtTime(clamped, inputCtxRef.current.currentTime, 0.02);
      } catch {
        gainNodeRef.current.gain.value = clamped;
      }
    }
  }, [micGain]);

  useEffect(() => {
    statusRef.current = status;
  }, [status]);

  useEffect(() => {
    transportModeRef.current = transportMode;
  }, [transportMode]);

  useEffect(() => {
    transcriptEndRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }, [transcripts]);

  const stopQueuedOutputAudio = () => {
    for (const node of activeSourcesRef.current) {
      try {
        node.stop();
        node.disconnect();
      } catch {
        // Ignore already-stopped nodes
      }
    }
    activeSourcesRef.current.clear();
    nextStartTimeRef.current = 0;

    if (browserSpeechRef.current) {
      browserSpeechRef.current.cancel();
      browserSpeechRef.current = null;
    }
    if (ttsAudioRef.current) {
      try {
        ttsAudioRef.current.pause();
        ttsAudioRef.current.currentTime = 0;
      } catch {
        // ignore
      }
      ttsAudioRef.current = null;
    }
    setIsModelSpeaking(false);
  };

  const stopLiveWebSocketOnly = () => {
    if (connectTimeoutRef.current !== null) {
      window.clearTimeout(connectTimeoutRef.current);
      connectTimeoutRef.current = null;
    }
    if (wsRef.current) {
      const ws = wsRef.current;
      wsRef.current = null;
      try {
        if (ws.readyState === WebSocket.OPEN) {
          ws.send(JSON.stringify({ type: 'stop' }));
        }
        ws.close();
      } catch {
        // ignore
      }
    }
  };

  const cleanupResources = (keepError = false) => {
    if (speakingTimerRef.current !== null) {
      window.clearTimeout(speakingTimerRef.current);
      speakingTimerRef.current = null;
    }
    if (micAnalyserTimerRef.current !== null) {
      window.clearInterval(micAnalyserTimerRef.current);
      micAnalyserTimerRef.current = null;
    }

    stopQueuedOutputAudio();
    stopLiveWebSocketOnly();

    if (recognitionRef.current) {
      try {
        recognitionRef.current.onend = null;
        recognitionRef.current.stop();
      } catch {
        // ignore
      }
      recognitionRef.current = null;
    }

    if (processorRef.current) {
      try {
        processorRef.current.onaudioprocess = null;
        processorRef.current.disconnect();
      } catch {
        // ignore
      }
      processorRef.current = null;
    }

    if (silentSinkRef.current) {
      try {
        silentSinkRef.current.disconnect();
      } catch {
        // ignore
      }
      silentSinkRef.current = null;
    }

    if (gainNodeRef.current) {
      try {
        gainNodeRef.current.disconnect();
      } catch {
        // ignore
      }
      gainNodeRef.current = null;
    }

    boostedDestRef.current = null;

    if (sourceNodeRef.current) {
      try {
        sourceNodeRef.current.disconnect();
      } catch {
        // ignore
      }
      sourceNodeRef.current = null;
    }

    if (mediaStreamRef.current) {
      for (const track of mediaStreamRef.current.getTracks()) {
        track.stop();
      }
      mediaStreamRef.current = null;
    }

    if (inputCtxRef.current) {
      void inputCtxRef.current.close().catch(() => {});
      inputCtxRef.current = null;
    }

    if (outputCtxRef.current) {
      void outputCtxRef.current.close().catch(() => {});
      outputCtxRef.current = null;
    }

    if (clipRecorderRef.current && clipRecorderRef.current.state !== 'inactive') {
      try {
        clipRecorderRef.current.stop();
      } catch {
        // ignore
      }
    }
    clipRecorderRef.current = null;
    setIsRecordingClip(false);

    liveReadyReceivedRef.current = false;
    setHasMicInput(false);
    setMicDiagnostic(null);
    setMicLevel(0);
    setIsMuted(false);
    isMutedRef.current = false;
    setStatus('idle');
    statusRef.current = 'idle';
    setTransportMode('none');
    transportModeRef.current = 'none';
    setInfoNotice(null);
    if (!keepError) {
      setErrorMessage(null);
    }
  };

  useEffect(() => {
    return () => {
      cleanupResources(true);
    };
  }, []);

  const appendTranscriptChunk = (speaker: 'student' | 'tutor', chunk: string, forceNewBubble = false) => {
    const clean = chunk;
    if (!clean) return;
    setTranscripts((prev) => {
      const last = prev[prev.length - 1];
      if (!forceNewBubble && last && last.speaker === speaker) {
        const updated = [...prev];
        updated[updated.length - 1] = {
          ...last,
          text: `${last.text}${clean}`,
        };
        return updated;
      }
      return [
        ...prev.slice(-24),
        {
          id: `${speaker}-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
          speaker,
          text: clean,
        },
      ];
    });
  };

  const speakTeacherAloud = async (text: string) => {
    stopQueuedOutputAudio();
    setIsModelSpeaking(true);
    try {
      const { dataUrl, fallbackToBrowser } = await fetchTutorSpeechAudio({ text, voiceName });
      if (fallbackToBrowser || !dataUrl) {
        browserSpeechRef.current = speakWithBrowserSpeech({
          text,
          onStart: () => setIsModelSpeaking(true),
          onEnd: () => setIsModelSpeaking(false),
          onError: () => setIsModelSpeaking(false),
        });
        return;
      }

      const audio = new Audio(dataUrl);
      ttsAudioRef.current = audio;
      audio.onended = () => {
        if (ttsAudioRef.current === audio) {
          ttsAudioRef.current = null;
          setIsModelSpeaking(false);
        }
      };
      audio.onerror = () => {
        if (ttsAudioRef.current === audio) {
          ttsAudioRef.current = null;
          browserSpeechRef.current = speakWithBrowserSpeech({
            text,
            onEnd: () => setIsModelSpeaking(false),
            onError: () => setIsModelSpeaking(false),
          });
        }
      };
      await audio.play();
    } catch {
      browserSpeechRef.current = speakWithBrowserSpeech({
        text,
        onStart: () => setIsModelSpeaking(true),
        onEnd: () => setIsModelSpeaking(false),
        onError: () => setIsModelSpeaking(false),
      });
    }
  };

  const acquireMicrophoneStream = async (): Promise<{
    stream: MediaStream | null;
    diagnostic: string | null;
  }> => {
    if (typeof window === 'undefined' || !navigator.mediaDevices?.getUserMedia) {
      return {
        stream: null,
        diagnostic:
          'Microphone capture requires a modern HTTPS/localhost browser with MediaDevices enabled. You can type or tap oral drill prompts below.',
      };
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          channelCount: 1,
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
        },
      });
      return { stream, diagnostic: null };
    } catch (primaryErr) {
      const name = (primaryErr as Error)?.name || '';
      const msg = (primaryErr as Error)?.message || '';
      if (name === 'NotAllowedError' || name === 'PermissionDeniedError' || /denied|permission/i.test(msg)) {
        return {
          stream: null,
          diagnostic:
            'Microphone permission was denied. Click the lock/mic icon in your browser address bar, allow Microphone access, then click "Retry Mic".',
        };
      }

      // Retry with unconstrained { audio: true } for drivers that reject sample/DSP constraints
      try {
        const fallbackStream = await navigator.mediaDevices.getUserMedia({ audio: true });
        return { stream: fallbackStream, diagnostic: null };
      } catch (secondaryErr) {
        const secName = (secondaryErr as Error)?.name || '';
        const secMsg = (secondaryErr as Error)?.message || '';
        if (secName === 'NotAllowedError' || secName === 'PermissionDeniedError' || /denied|permission/i.test(secMsg)) {
          return {
            stream: null,
            diagnostic:
              'Microphone permission was denied. Allow Microphone access in browser site settings and click "Retry Mic".',
          };
        }
        return {
          stream: null,
          diagnostic:
            'No active microphone input detected on this device yet. Connect a microphone or headset and click "Retry Mic", or continue in Speaker + Text mode.',
        };
      }
    }
  };

  const attachMicLevelMeter = (stream: MediaStream) => {
    const AudioCtx =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!AudioCtx) return;

    try {
      const ctx = inputCtxRef.current ?? new AudioCtx({ sampleRate: 16000 });
      if (ctx.state === 'suspended') {
        void ctx.resume().catch(() => {});
      }
      inputCtxRef.current = ctx;

      if (processorRef.current) {
        try {
          processorRef.current.disconnect();
        } catch {
          // ignore
        }
      }
      if (sourceNodeRef.current) {
        try {
          sourceNodeRef.current.disconnect();
        } catch {
          // ignore
        }
      }

      if (gainNodeRef.current) {
        try {
          gainNodeRef.current.disconnect();
        } catch {
          // ignore
        }
      }
      if (silentSinkRef.current) {
        try {
          silentSinkRef.current.disconnect();
        } catch {
          // ignore
        }
      }

      const source = ctx.createMediaStreamSource(stream);
      const gainNode = ctx.createGain();
      gainNode.gain.value = micGainRef.current;

      const processor = ctx.createScriptProcessor(4096, 1, 1);
      const silentSink = ctx.createGain();
      silentSink.gain.value = 0;

      sourceNodeRef.current = source;
      gainNodeRef.current = gainNode;
      processorRef.current = processor;
      silentSinkRef.current = silentSink;

      if (typeof ctx.createMediaStreamDestination === 'function') {
        const dest = ctx.createMediaStreamDestination();
        gainNode.connect(dest);
        boostedDestRef.current = dest;
      }

      processor.onaudioprocess = (audioEvent) => {
        if (isMutedRef.current) {
          setMicLevel(0);
          return;
        }
        const raw = audioEvent.inputBuffer.getChannelData(0);
        setMicLevel(computeRmsLevel(raw));

        const activeWs = wsRef.current;
        if (
          transportModeRef.current === 'gemini-live' &&
          activeWs &&
          activeWs.readyState === WebSocket.OPEN &&
          statusRef.current === 'live'
        ) {
          const resampled = resampleFloat32(raw, ctx.sampleRate, 16000);
          const base64 = float32ToPcm16Base64(resampled);
          activeWs.send(JSON.stringify({ type: 'audio', data: base64 }));
        }
      };

      source.connect(gainNode);
      gainNode.connect(processor);
      processor.connect(silentSink);
      silentSink.connect(ctx.destination);
    } catch {
      // Non-fatal meter error
    }
  };

  const startBrowserRecognitionIfSupported = () => {
    if (typeof window === 'undefined') return;
    const SpeechRecCtor =
      (window as unknown as { SpeechRecognition?: new () => SpeechRecognitionLike }).SpeechRecognition ||
      (window as unknown as { webkitSpeechRecognition?: new () => SpeechRecognitionLike })
        .webkitSpeechRecognition;

    if (!SpeechRecCtor || !mediaStreamRef.current) return;

    try {
      const recognition = new SpeechRecCtor();
      recognition.continuous = true;
      recognition.interimResults = false;
      recognition.lang = 'en-GB';
      recognition.onresult = (event) => {
        if (isModelSpeakingRef.current || isMutedRef.current) return;
        for (let i = event.resultIndex; i < event.results.length; i++) {
          const res = event.results[i];
          if (res.isFinal) {
            const spoken = res[0]?.transcript?.trim();
            if (spoken) {
              void handleSendTextToLive(spoken);
            }
          }
        }
      };
      recognition.onerror = () => {
        // Non-fatal; student can always record a clip, type, or tap oral prompts
      };
      recognition.onend = () => {
        if (
          statusRef.current === 'live' &&
          transportModeRef.current === 'browser-voice' &&
          !isMutedRef.current &&
          !isModelSpeakingRef.current
        ) {
          try {
            recognition.start();
          } catch {
            // ignore restart throttling
          }
        }
      };
      recognitionRef.current = recognition;
      if (!isModelSpeakingRef.current && !isMutedRef.current) {
        recognition.start();
      }
    } catch {
      // SpeechRecognition optional
    }
  };

  const handleRetryMicrophone = async () => {
    if (isRetryingMic) return;
    setIsRetryingMic(true);
    setMicDiagnostic(null);
    const { stream, diagnostic } = await acquireMicrophoneStream();
    setIsRetryingMic(false);

    if (!stream) {
      setHasMicInput(false);
      setMicDiagnostic(diagnostic);
      return;
    }

    if (mediaStreamRef.current) {
      for (const t of mediaStreamRef.current.getTracks()) t.stop();
    }
    mediaStreamRef.current = stream;
    setHasMicInput(true);
    setMicDiagnostic(null);
    attachMicLevelMeter(stream);
    if (transportModeRef.current === 'browser-voice') {
      startBrowserRecognitionIfSupported();
    }
    setInfoNotice('Microphone connected cleanly! Speak naturally or mute anytime.');
  };

  const enterBrowserVoiceMode = (reason?: string) => {
    stopLiveWebSocketOnly();
    setStatus('live');
    statusRef.current = 'live';
    setTransportMode('browser-voice');
    transportModeRef.current = 'browser-voice';
    setErrorMessage(null);

    if (reason) {
      setInfoNotice(reason);
    } else if (!mediaStreamRef.current) {
      setInfoNotice(
        'Voice session active in Speaker + Chat mode. Connect a microphone anytime with "Retry Mic", or tap an oral drill below.'
      );
    } else {
      setInfoNotice('Interactive AI Voice Teacher is live! Speak or type below.');
    }

    if (mediaStreamRef.current) {
      startBrowserRecognitionIfSupported();
    }

    const greeting = lessonContext?.topicTitle
      ? `Hello ${studentContext.preferredName}! I am ready to coach you live on ${lessonContext.topicTitle}. Ask any question or tap a drill below.`
      : activeQuestion
        ? `Hello ${studentContext.preferredName}! Let us talk through ${activeQuestion.topicTitle} together. Tell me your reasoning or ask for a step-by-step clue.`
        : `Hello ${studentContext.preferredName}! Your ${studentContext.gradeLevel} AI Voice Tutor is live. Ask a Science, Maths, or ICT question or tap Quiz me aloud below.`;

    if (transcripts.length === 0) {
      appendTranscriptChunk('tutor', greeting, true);
    }
    void speakTeacherAloud(greeting);
  };

  const playPcm24kChunk = (base64Pcm: string) => {
    const ctx = outputCtxRef.current;
    if (!ctx) return;

    const floatSamples = pcm16Base64ToFloat32(base64Pcm);
    if (floatSamples.length === 0) return;

    const audioBuffer = ctx.createBuffer(1, floatSamples.length, 24000);
    audioBuffer.getChannelData(0).set(floatSamples);

    const source = ctx.createBufferSource();
    source.buffer = audioBuffer;
    source.connect(ctx.destination);

    const startAt = Math.max(ctx.currentTime + 0.015, nextStartTimeRef.current);
    source.start(startAt);
    nextStartTimeRef.current = startAt + audioBuffer.duration;

    activeSourcesRef.current.add(source);
    setIsModelSpeaking(true);

    source.onended = () => {
      activeSourcesRef.current.delete(source);
      if (activeSourcesRef.current.size === 0) {
        if (speakingTimerRef.current !== null) {
          window.clearTimeout(speakingTimerRef.current);
        }
        speakingTimerRef.current = window.setTimeout(() => {
          if (activeSourcesRef.current.size === 0) {
            setIsModelSpeaking(false);
          }
        }, 180);
      }
    };
  };

  const handleStartSession = async () => {
    if (statusRef.current !== 'idle') return;
    setErrorMessage(null);
    setInfoNotice(null);
    setMicDiagnostic(null);
    setStatus('connecting');
    statusRef.current = 'connecting';
    liveReadyReceivedRef.current = false;

    // 1. Acquire microphone with automatic relaxed-constraint fallback
    const { stream: acquiredStream, diagnostic } = await acquireMicrophoneStream();
    mediaStreamRef.current = acquiredStream;
    setHasMicInput(Boolean(acquiredStream));
    setMicDiagnostic(diagnostic);

    const AudioCtx =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;

    if (!acquiredStream || !AudioCtx) {
      enterBrowserVoiceMode(
        'Voice session active in Speaker + Chat mode — tap any drill, type below, or use Retry Mic anytime.'
      );
      return;
    }

    try {
      const inputCtx = new AudioCtx({ sampleRate: 16000 });
      const outputCtx = new AudioCtx({ sampleRate: 24000 });
      if (inputCtx.state === 'suspended') await inputCtx.resume();
      if (outputCtx.state === 'suspended') await outputCtx.resume();
      inputCtxRef.current = inputCtx;
      outputCtxRef.current = outputCtx;

      // Setup live mic RMS level meter regardless of Gemini vs Browser Voice transport
      attachMicLevelMeter(acquiredStream);

      const wsUrl = buildLiveWebSocketUrl(window.location);
      const ws = new WebSocket(wsUrl);
      wsRef.current = ws;

      // Fallback automatically to Browser Voice if Gemini Live takes >4.5s or quota hits 429
      connectTimeoutRef.current = window.setTimeout(() => {
        if (!liveReadyReceivedRef.current && statusRef.current === 'connecting') {
          enterBrowserVoiceMode(
            'Gemini Live audio stream timed out — switched smoothly to Interactive AI Voice Teacher.'
          );
        }
      }, 4500);

      ws.onopen = () => {
        ws.send(
          JSON.stringify({
            type: 'start',
            voiceName,
            studentContext,
            lessonContext: lessonContext ?? null,
          })
        );
      };

      ws.onmessage = (event) => {
        let msg: {
          type?: string;
          data?: string;
          text?: string;
          message?: string;
          status?: number;
        };
        try {
          msg = JSON.parse(String(event.data));
        } catch {
          return;
        }

        if (msg.type === 'ready') {
          liveReadyReceivedRef.current = true;
          if (connectTimeoutRef.current !== null) {
            window.clearTimeout(connectTimeoutRef.current);
            connectTimeoutRef.current = null;
          }
          setStatus('live');
          statusRef.current = 'live';
          setTransportMode('gemini-live');
          transportModeRef.current = 'gemini-live';
          setInfoNotice('Gemini Live Real-Time Audio Connected — speak naturally anytime!');
          return;
        }

        if (msg.type === 'audio' && msg.data) {
          playPcm24kChunk(msg.data);
          return;
        }

        if (msg.type === 'inputTranscript' && msg.text) {
          appendTranscriptChunk('student', msg.text);
          return;
        }

        if (msg.type === 'outputTranscript' && msg.text) {
          appendTranscriptChunk('tutor', msg.text);
          return;
        }

        if (msg.type === 'interrupted') {
          stopQueuedOutputAudio();
          return;
        }

        if (msg.type === 'error') {
          if (connectTimeoutRef.current !== null) {
            window.clearTimeout(connectTimeoutRef.current);
            connectTimeoutRef.current = null;
          }
          // Seamless failover to interactive browser voice session instead of killing the call!
          enterBrowserVoiceMode(
            msg.status === 429
              ? 'Cloud Live Voice quota reached — switched smoothly to Interactive AI Voice Teacher with speech output.'
              : 'Live WebSocket unavailable — switched smoothly to Interactive AI Voice Teacher.'
          );
        }
      };

      ws.onerror = () => {
        if (statusRef.current !== 'idle' && transportModeRef.current !== 'browser-voice') {
          enterBrowserVoiceMode(
            'Switched smoothly to Interactive AI Voice Teacher (speech + live coaching).'
          );
        }
      };

      ws.onclose = () => {
        if (statusRef.current === 'connecting' && !liveReadyReceivedRef.current) {
          enterBrowserVoiceMode(
            'Switched smoothly to Interactive AI Voice Teacher (speech + live coaching).'
          );
        }
      };
    } catch {
      enterBrowserVoiceMode(
        'Switched smoothly to Interactive AI Voice Teacher with speaker narration.'
      );
    }
  };

  const handleToggleVoiceClip = async () => {
    if (isRecordingClip) {
      if (clipRecorderRef.current && clipRecorderRef.current.state !== 'inactive') {
        clipRecorderRef.current.stop();
      }
      setIsRecordingClip(false);
      return;
    }

    let stream = mediaStreamRef.current;
    if (!stream) {
      const acquired = await acquireMicrophoneStream();
      if (!acquired.stream) {
        setMicDiagnostic(acquired.diagnostic);
        return;
      }
      stream = acquired.stream;
      mediaStreamRef.current = stream;
      setHasMicInput(true);
      setMicDiagnostic(null);
      attachMicLevelMeter(stream);
    }

    if (typeof MediaRecorder === 'undefined') {
      setInfoNotice('Voice clip recording is not supported in this browser — type or use continuous speech.');
      return;
    }

    try {
      stopQueuedOutputAudio();
      clipChunksRef.current = [];
      const recordTargetStream = boostedDestRef.current?.stream ?? stream;
      const recorder = new MediaRecorder(recordTargetStream);
      clipRecorderRef.current = recorder;

      recorder.ondataavailable = (ev) => {
        if (ev.data.size > 0) clipChunksRef.current.push(ev.data);
      };
      recorder.onstop = async () => {
        const chunks = clipChunksRef.current;
        if (!chunks.length) return;
        const blob = new Blob(chunks, { type: recorder.mimeType || 'audio/webm' });
        setIsFallbackBusy(true);
        try {
          const text = await transcribeSpokenAnswer({ blob });
          if (text) {
            await handleSendTextToLive(text);
          } else {
            setInfoNotice('No clear voice detected in the clip — please speak closer to the mic or type below.');
          }
        } catch {
          setInfoNotice('Could not transcribe clip — please speak directly or type below.');
        } finally {
          setIsFallbackBusy(false);
        }
      };
      recorder.start();
      setIsRecordingClip(true);
    } catch {
      setMicDiagnostic('Unable to start microphone recorder. Click Retry Mic or type your question.');
    }
  };

  const handleSendTextToLive = async (textToSend: string) => {
    const trimmed = textToSend.trim();
    if (!trimmed) return;
    const ws = wsRef.current;
    if (
      ws &&
      ws.readyState === WebSocket.OPEN &&
      statusRef.current === 'live' &&
      transportModeRef.current === 'gemini-live'
    ) {
      ws.send(JSON.stringify({ type: 'text', text: trimmed }));
      appendTranscriptChunk('student', trimmed, true);
      setTextDraft('');
      return;
    }

    if (isFallbackBusy) return;
    setErrorMessage(null);
    setIsFallbackBusy(true);
    setTextDraft('');
    appendTranscriptChunk('student', trimmed, true);

    if (statusRef.current === 'idle') {
      setStatus('live');
      statusRef.current = 'live';
      setTransportMode('browser-voice');
      transportModeRef.current = 'browser-voice';
    }

    let replyText = '';
    try {
      const chatRes = await fetch('/api/tutor/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          stream: false,
          studentContext,
          messages: [
            ...transcripts.slice(-6).map((t) => ({
              role: t.speaker === 'student' ? ('user' as const) : ('assistant' as const),
              content: t.text,
            })),
            {
              role: 'user',
              content: lessonContext
                ? `[Lesson: ${lessonContext.topicTitle}${lessonContext.stageTitle ? ` - ${lessonContext.stageTitle}` : ''}] ${trimmed}`
                : trimmed,
            },
          ],
        }),
      });
      const parsed = await safeParseResponseJson<{ text?: string; error?: string }>(chatRes);
      if (parsed.ok && parsed.data?.text) {
        replyText = parsed.data.text.trim();
      }
    } catch {
      // Fall back locally below
    }

    if (!replyText) {
      const [notesPool, mcqPool] = await Promise.all([
        loadAllSyllabusNotes().catch(() => undefined),
        loadMcqsForSubjects(studentContext.subjects.slice(0, 3)).catch(() => undefined),
      ]);
      replyText = buildLocalVoiceReply({
        prompt: trimmed,
        studentContext,
        lessonContext,
        notes: notesPool,
        mcqPool,
      });
    }

    appendTranscriptChunk('tutor', replyText, true);
    await speakTeacherAloud(replyText);
    setIsFallbackBusy(false);
  };

  const statusBadgeText =
    status === 'connecting'
      ? 'Connecting Voice Tutor...'
      : status === 'live'
        ? isModelSpeaking
          ? `Tutor Speaking (${voiceName})`
          : transportMode === 'gemini-live'
            ? isMuted
              ? 'Microphone Muted (Gemini Live)'
              : 'Listening Live (16 kHz Gemini Audio)'
            : hasMicInput && !isMuted
              ? 'Interactive Voice Live (Mic + Speaker Ready)'
              : 'Interactive Voice Live (Speaker Ready)'
        : 'Voice Session Ready';

  return (
    <div
      data-testid="live-voice-tutor"
      className="flex-1 flex flex-col min-h-0 overflow-hidden"
    >
      {/* Voice Session Control Deck */}
      <div className="p-4 sm:p-5 border-b border-slate-800/80 bg-slate-950/60 space-y-4 shrink-0">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div
              className={`w-10 h-10 rounded-xl border flex items-center justify-center transition-colors shrink-0 ${
                status === 'live'
                  ? isModelSpeaking
                    ? 'bg-emerald-500/20 border-emerald-400/50 text-emerald-300'
                    : 'bg-cyan-500/20 border-cyan-400/50 text-cyan-300'
                  : 'bg-slate-900 border-slate-800 text-slate-300'
              }`}
            >
              {status === 'live' && isModelSpeaking ? (
                <Volume2 className="w-5 h-5" />
              ) : (
                <Waves className="w-5 h-5" />
              )}
            </div>
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5">
                <span className="font-display text-sm font-bold text-white whitespace-nowrap">
                  Real-Time Voice Tutor
                </span>
                <span className="text-[11px] font-mono text-slate-400 whitespace-nowrap">
                  · {transportMode === 'browser-voice' ? 'Interactive Voice' : 'gemini-3.8-live'}
                </span>
              </div>
              <div className="text-xs text-slate-400 flex items-center gap-2 mt-0.5">
                {status === 'live' && (
                  <span
                    className={`w-2 h-2 rounded-full ${
                      isModelSpeaking ? 'bg-emerald-400 animate-pulse' : 'bg-cyan-400 animate-pulse'
                    }`}
                    aria-hidden="true"
                  />
                )}
                <span data-testid="live-voice-status">{statusBadgeText}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {status === 'live' && !hasMicInput && (
              <button
                type="button"
                disabled={isRetryingMic}
                onClick={() => void handleRetryMicrophone()}
                data-testid="retry-mic-btn"
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border border-amber-500/40 bg-amber-500/15 hover:bg-amber-500/25 text-amber-200 text-xs font-semibold transition-colors whitespace-nowrap disabled:opacity-50"
              >
                <Mic className="w-3.5 h-3.5" />
                <span>{isRetryingMic ? 'Checking Mic...' : 'Retry Mic'}</span>
              </button>
            )}

            {status === 'live' && hasMicInput && (
              <button
                type="button"
                onClick={() => setIsMuted((prev) => !prev)}
                aria-pressed={isMuted}
                aria-label={isMuted ? 'Unmute microphone' : 'Mute microphone'}
                className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border text-xs font-semibold transition-colors whitespace-nowrap ${
                  isMuted
                    ? 'bg-amber-500/15 border-amber-500/40 text-amber-300'
                    : 'bg-slate-900 hover:bg-slate-800 border-slate-700 text-slate-200'
                }`}
              >
                {isMuted ? <MicOff className="w-3.5 h-3.5" /> : <Mic className="w-3.5 h-3.5" />}
                <span>{isMuted ? 'Unmute' : 'Mute'}</span>
              </button>
            )}

            {status === 'idle' ? (
              <button
                type="button"
                onClick={() => void handleStartSession()}
                data-testid="start-voice-session-btn"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-semibold text-xs transition-colors whitespace-nowrap shrink-0"
              >
                <PhoneCall className="w-3.5 h-3.5" />
                <span>Start Voice Session</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={() => cleanupResources(false)}
                data-testid="end-voice-session-btn"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-rose-500 hover:bg-rose-400 text-white font-semibold text-xs transition-colors whitespace-nowrap shrink-0"
              >
                <PhoneOff className="w-3.5 h-3.5" />
                <span>End Session</span>
              </button>
            )}
          </div>
        </div>

        {/* Voice Persona Selector + Live Microphone Input Meter */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-1.5" role="group" aria-label="Tutor voice persona">
            <span className="text-[11px] font-medium text-slate-400 mr-1">Voice:</span>
            {LIVE_VOICE_OPTIONS.map((voice) => {
              const selected = voiceName === voice.id;
              return (
                <button
                  key={voice.id}
                  type="button"
                  disabled={status !== 'idle'}
                  onClick={() => setVoiceName(voice.id)}
                  aria-pressed={selected}
                  title={voice.tone}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold border transition-colors disabled:opacity-60 ${
                    selected
                      ? 'bg-cyan-500/20 border-cyan-500/45 text-cyan-300'
                      : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {voice.label}
                </button>
              );
            })}
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2 min-w-[165px]">
              <span className="text-[11px] text-slate-400 whitespace-nowrap">Mic Level</span>
              <div
                className="flex-1 h-2.5 rounded-full bg-slate-900 border border-slate-800 overflow-hidden"
                aria-label="Live microphone input level"
              >
                <div
                  className={`h-full transition-[width] duration-75 ${
                    isMuted ? 'bg-slate-600' : micLevel > 0.78 ? 'bg-emerald-400' : 'bg-cyan-400'
                  }`}
                  style={{ width: `${Math.round(micLevel * 100)}%` }}
                />
              </div>
              <span
                data-testid="mic-level-percent"
                className="text-[10px] font-mono text-slate-400 w-8 text-right tabular-nums"
              >
                {isMuted ? '0%' : `${Math.round(micLevel * 100)}%`}
              </span>
            </div>

            <label className="flex items-center gap-2 text-[11px] text-slate-400">
              <span className="whitespace-nowrap">Mic Boost</span>
              <input
                type="range"
                min={MIN_MIC_GAIN}
                max={MAX_MIC_GAIN}
                step={0.2}
                value={micGain}
                onChange={(e) => setMicGain(clampMicGain(Number(e.target.value)))}
                aria-label="Microphone input boost"
                data-testid="mic-boost-slider"
                className="w-20 accent-cyan-400 cursor-pointer"
              />
              <span data-testid="mic-boost-value" className="font-mono text-cyan-300 w-7 text-right">
                {micGain.toFixed(1)}×
              </span>
            </label>
          </div>
        </div>
      </div>

      {/* Live Transcript Stream */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-3" aria-live="polite">
        {infoNotice && (
          <div className="p-3 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-200 text-xs flex items-center justify-between gap-2">
            <span>{infoNotice}</span>
            <button
              type="button"
              onClick={() => setInfoNotice(null)}
              className="text-cyan-400 hover:text-white font-semibold shrink-0"
            >
              Dismiss
            </button>
          </div>
        )}

        {micDiagnostic && !hasMicInput && (
          <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-200 text-xs flex flex-wrap items-center justify-between gap-2">
            <span>{micDiagnostic}</span>
            <button
              type="button"
              disabled={isRetryingMic}
              onClick={() => void handleRetryMicrophone()}
              className="px-2.5 py-1 rounded-lg bg-amber-500 text-slate-950 font-bold text-[11px] shrink-0"
            >
              {isRetryingMic ? 'Checking...' : 'Retry Mic'}
            </button>
          </div>
        )}

        {errorMessage && (
          <div
            role="alert"
            className="p-3.5 rounded-xl bg-rose-500/12 border border-rose-500/35 text-rose-200 text-xs flex items-start gap-2.5"
          >
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-400" />
            <span>{errorMessage}</span>
          </div>
        )}

        {lessonContext && (
          <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-xs flex items-start justify-between gap-2">
            <div className="space-y-0.5">
              <div className="font-semibold text-emerald-300">
                Continuing AI Teacher Lesson Live: {lessonContext.topicTitle}
              </div>
              {lessonContext.stageTitle && (
                <div className="text-slate-300">Current Stage: {lessonContext.stageTitle}</div>
              )}
            </div>
            {onClearLessonContext && status === 'idle' && (
              <button
                type="button"
                onClick={onClearLessonContext}
                className="text-[11px] font-semibold text-slate-400 hover:text-white shrink-0"
              >
                Clear
              </button>
            )}
          </div>
        )}

        {transcripts.length === 0 ? (
          <div className="max-w-lg mx-auto py-4 space-y-4 text-center">
            <div className="space-y-1.5">
              <h4 className="font-display text-sm sm:text-base font-bold text-white">
                {lessonContext
                  ? `Speak live about ${lessonContext.topicTitle}`
                  : activeQuestion
                    ? `Talk through ${activeQuestion.topicTitle} live`
                    : `Speak naturally with your ${studentContext.gradeLevel} WASSCE Tutor`}
              </h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Start a live voice conversation with your AI Teacher. Works seamlessly with your microphone or via quick spoken prompts and voice playback.
              </p>
            </div>

            {!compact && (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-left">
                {QUICK_VOICE_TOPICS.map((item) => (
                  <button
                    key={item.label}
                    type="button"
                    onClick={() => void handleSendTextToLive(item.text)}
                    className="p-3 rounded-xl bg-slate-950/75 hover:bg-slate-900 border border-slate-800 hover:border-cyan-500/40 text-[11px] space-y-1 text-left transition-colors"
                  >
                    <div className="font-semibold text-cyan-300">{item.label}</div>
                    <p className="text-slate-400 leading-relaxed">{item.text}</p>
                  </button>
                ))}
              </div>
            )}
          </div>
        ) : (
          transcripts.map((item) => (
            <div
              key={item.id}
              className={`flex flex-col ${item.speaker === 'student' ? 'items-end' : 'items-start'}`}
            >
              <div
                className={`max-w-[90%] rounded-2xl px-3.5 py-2.5 text-xs sm:text-sm leading-relaxed ${
                  item.speaker === 'student'
                    ? 'bg-cyan-500/15 border border-cyan-500/30 text-slate-100'
                    : 'bg-slate-950/85 border border-slate-800 text-slate-200'
                }`}
              >
                <div className="text-[10px] font-semibold text-slate-400 mb-1">
                  {item.speaker === 'student' ? studentContext.preferredName : `AI Tutor (${voiceName})`}
                </div>
                <p className="whitespace-pre-wrap">{item.text}</p>
              </div>
            </div>
          ))
        )}
        <div ref={transcriptEndRef} />
      </div>

      {/* Mid-session & Spoken Q&A prompt bar */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          void handleSendTextToLive(textDraft);
        }}
        className="p-3 sm:p-4 border-t border-slate-800 bg-slate-950/80 space-y-2 shrink-0"
      >
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
          {QUICK_VOICE_TOPICS.map((chip) => (
            <button
              key={chip.label}
              type="button"
              disabled={isFallbackBusy}
              onClick={() => void handleSendTextToLive(chip.text)}
              className="px-2.5 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 text-[11px] text-slate-300 whitespace-nowrap shrink-0 transition-colors disabled:opacity-50"
            >
              {chip.label}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-2">
          <label htmlFor="live-voice-text-input" className="sr-only">
            Ask a question aloud with voice response
          </label>
          <input
            id="live-voice-text-input"
            type="text"
            disabled={isFallbackBusy}
            value={textDraft}
            onChange={(e) => setTextDraft(e.target.value)}
            placeholder={
              status === 'live'
                ? 'Type or speak an equation or follow-up question...'
                : 'Type a question for the AI Teacher to answer & speak aloud...'
            }
            className="flex-1 min-w-0 px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs sm:text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-cyan-500 disabled:opacity-50"
          />
          <button
            type="button"
            disabled={isFallbackBusy}
            onClick={() => void handleToggleVoiceClip()}
            aria-label={isRecordingClip ? 'Stop recording voice clip' : 'Record voice question'}
            className={`px-3 py-2 rounded-xl border text-xs font-semibold inline-flex items-center gap-1.5 transition-colors shrink-0 whitespace-nowrap disabled:opacity-40 ${
              isRecordingClip
                ? 'bg-rose-500 border-rose-400 text-white'
                : 'bg-slate-900 hover:bg-slate-800 border-slate-700 text-slate-200'
            }`}
          >
            {isRecordingClip ? <MicOff className="w-3.5 h-3.5" /> : <Mic className="w-3.5 h-3.5 text-cyan-400" />}
            <span>{isRecordingClip ? 'Send Clip' : 'Speak'}</span>
          </button>
          <button
            type="submit"
            disabled={isFallbackBusy || !textDraft.trim()}
            aria-label="Send prompt to voice tutor"
            className="px-3.5 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 disabled:opacity-40 text-slate-950 font-semibold text-xs inline-flex items-center gap-1.5 transition-colors shrink-0 whitespace-nowrap"
          >
            <Send className="w-3.5 h-3.5" />
            <span>{isFallbackBusy ? 'Speaking...' : 'Ask Aloud'}</span>
          </button>
        </div>
      </form>
    </div>
  );
};
