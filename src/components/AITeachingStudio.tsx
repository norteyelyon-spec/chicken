import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  AlertCircle,
  ArrowLeft,
  ArrowRight,
  BookmarkPlus,
  CheckCircle2,
  GraduationCap,
  HelpCircle,
  Lightbulb,
  Loader2,
  Mic,
  MicOff,
  PhoneCall,
  Play,
  RotateCcw,
  Send,
  Sparkles,
  Square,
  Volume2,
  VolumeX,
} from 'lucide-react';
import { loadAllSyllabusNotes, loadMcqsForSubject } from '../data/curriculumLoader';
import { SUBJECTS, SUBJECT_LIST, SYLLABUS_TOPICS } from '../data/subjects';
import type {
  GradeLevel,
  StudyNote,
  SubjectId,
  TeachingActionKind,
  TeachingInteractionFeedback,
  TeachingLaunchTarget,
  TeachingLessonPlan,
  TeachingStyle,
  TeachingTurnEntry,
  TutorStudentContextPayload,
} from '../types';
import {
  computeTeachingMasterySummary,
  lessonPlanToMarkdownNote,
  TEACHING_STYLE_META,
} from '../utils/aiTeaching';
import { LIVE_VOICE_OPTIONS, type LiveVoiceName } from '../utils/liveAudio';
import {
  buildLocalCurriculumLessonPlan,
  evaluateLocalTeachingInteraction,
} from '../utils/localTeachingFallback';
import { safeParseResponseJson } from '../utils/safeFetchJson';
import {
  fetchTutorSpeechAudio,
  prefetchTutorSpeechAudio,
  speakWithBrowserSpeech,
  splitSpeechChunks,
  type BrowserSpeechPlaybackHandle,
  transcribeSpokenAnswer,
} from '../utils/tutorSpeechClient';
import { MarkdownPreview, MathText } from './MathText';

interface AITeachingStudioProps {
  variant: 'full' | 'drawer';
  studentContext: TutorStudentContextPayload;
  launchTarget?: TeachingLaunchTarget | null;
  onConsumeLaunchTarget?: () => void;
  onSwitchToLiveVoice: (lessonContext: {
    topicTitle: string;
    stageTitle?: string;
    explanation?: string;
    voiceName?: LiveVoiceName;
  }) => void;
  onSaveLessonAsNote?: (note: StudyNote) => void;
  onPracticeTopic: (subject: SubjectId, grade: GradeLevel, topicId: string) => void;
}

const GRADES: GradeLevel[] = ['SHS1', 'SHS2', 'SHS3'];

export const AITeachingStudio: React.FC<AITeachingStudioProps> = ({
  variant,
  studentContext,
  launchTarget,
  onConsumeLaunchTarget,
  onSwitchToLiveVoice,
  onSaveLessonAsNote,
  onPracticeTopic,
}) => {
  const defaultRec = studentContext.recommendedTopics[0];
  const [selectedSubject, setSelectedSubject] = useState<SubjectId>(
    launchTarget?.subject ?? defaultRec?.subject ?? studentContext.subjects[0] ?? 'physics'
  );
  const [selectedGrade, setSelectedGrade] = useState<GradeLevel>(
    launchTarget?.grade ?? defaultRec?.grade ?? studentContext.gradeLevel ?? 'SHS2'
  );
  const [topicInput, setTopicInput] = useState<string>(
    launchTarget?.topicTitle ?? defaultRec?.title ?? 'Atomic Structure & Electron Configuration'
  );
  const [teachingStyle, setTeachingStyle] = useState<TeachingStyle>('socratic');
  const [voiceName, setVoiceName] = useState<LiveVoiceName>('Zephyr');
  const [autoSpeak, setAutoSpeak] = useState<boolean>(true);
  const [continuousWalkthrough, setContinuousWalkthrough] = useState<boolean>(true);
  const continuousWalkthroughRef = useRef<boolean>(true);
  continuousWalkthroughRef.current = continuousWalkthrough;
  const advanceFromStepEndRef = useRef<(finishedKey: string) => void>(() => {});

  // Active lesson session state
  const [lesson, setLesson] = useState<TeachingLessonPlan | null>(null);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const [correctCheckSteps, setCorrectCheckSteps] = useState<number[]>([]);
  const [selectedChoices, setSelectedChoices] = useState<Record<number, number>>({});
  const [turns, setTurns] = useState<TeachingTurnEntry[]>([]);

  const [isGeneratingLesson, setIsGeneratingLesson] = useState(false);
  const [isInteracting, setIsInteracting] = useState(false);
  const [errorBanner, setErrorBanner] = useState<string | null>(null);
  const [savedNoteConfirmation, setSavedNoteConfirmation] = useState<string | null>(null);
  const [studentReplyDraft, setStudentReplyDraft] = useState('');

  // Gemini TTS voice playback state + 1:1 read-along sync state
  const [speakingKey, setSpeakingKey] = useState<string | null>(null);
  const [activeSpeechSync, setActiveSpeechSync] = useState<{
    key: string;
    chunkIndex: number;
    totalChunks: number;
    chunkText: string;
  } | null>(null);
  const [isSynthesizingAudio, setIsSynthesizingAudio] = useState(false);
  const [voiceError, setVoiceError] = useState<string | null>(null);
  const [pendingReplay, setPendingReplay] = useState<{ key: string; url: string; label: string } | null>(null);
  const audioElRef = useRef<HTMLAudioElement | null>(null);
  const browserSpeechRef = useRef<BrowserSpeechPlaybackHandle | null>(null);

  // Voice answer dictation state (Web SpeechRecognition or MediaRecorder -> /api/tutor/transcribe)
  const [isRecordingAnswer, setIsRecordingAnswer] = useState(false);
  const [isTranscribingAnswer, setIsTranscribingAnswer] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const recordedChunksRef = useRef<Blob[]>([]);
  const micStreamRef = useRef<MediaStream | null>(null);
  const speechRecRef = useRef<{ stop: () => void } | null>(null);

  const matchingTopics = useMemo(() => {
    const exact = SYLLABUS_TOPICS.filter(
      (t) => t.subject === selectedSubject && t.grade === selectedGrade
    );
    return exact.length > 0
      ? exact
      : SYLLABUS_TOPICS.filter((t) => t.subject === selectedSubject).slice(0, 6);
  }, [selectedSubject, selectedGrade]);

  const stopAudioPlayback = () => {
    if (browserSpeechRef.current) {
      browserSpeechRef.current.cancel();
      browserSpeechRef.current = null;
    }
    if (audioElRef.current) {
      try {
        audioElRef.current.pause();
        audioElRef.current.currentTime = 0;
      } catch {
        // ignore
      }
      audioElRef.current = null;
    }
    setSpeakingKey(null);
    setActiveSpeechSync(null);
    setIsSynthesizingAudio(false);
  };

  const stopVoiceRecordingCleanup = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      try {
        mediaRecorderRef.current.stop();
      } catch {
        // ignore
      }
    }
    if (micStreamRef.current) {
      for (const t of micStreamRef.current.getTracks()) {
        t.stop();
      }
      micStreamRef.current = null;
    }
    setIsRecordingAnswer(false);
  };

  useEffect(() => {
    return () => {
      stopAudioPlayback();
      stopVoiceRecordingCleanup();
    };
  }, []);

  const playAudioUrl = async (key: string, audioUrl: string, label: string, scriptText = '') => {
    stopAudioPlayback();
    setVoiceError(null);
    setPendingReplay(null);
    const chunks = splitSpeechChunks(scriptText);
    const audio = new Audio(audioUrl);
    audioElRef.current = audio;
    setSpeakingKey(key);
    if (chunks.length > 0) {
      setActiveSpeechSync({
        key,
        chunkIndex: 0,
        totalChunks: chunks.length,
        chunkText: chunks[0],
      });
    }
    audio.ontimeupdate = () => {
      if (!audio.duration || chunks.length === 0) return;
      const frac = Math.min(0.999, Math.max(0, audio.currentTime / audio.duration));
      const idx = Math.min(chunks.length - 1, Math.floor(frac * chunks.length));
      setActiveSpeechSync({
        key,
        chunkIndex: idx,
        totalChunks: chunks.length,
        chunkText: chunks[idx],
      });
    };
    audio.onended = () => {
      if (audioElRef.current === audio) {
        audioElRef.current = null;
        setSpeakingKey(null);
        setActiveSpeechSync(null);
        advanceFromStepEndRef.current(key);
      }
    };
    audio.onerror = () => {
      if (audioElRef.current === audio) {
        audioElRef.current = null;
        setSpeakingKey(null);
        setActiveSpeechSync(null);
        setVoiceError('Unable to play synthesized audio in this browser.');
      }
    };
    try {
      await audio.play();
    } catch (err) {
      if (audioElRef.current === audio) {
        audioElRef.current = null;
      }
      setSpeakingKey(null);
      setActiveSpeechSync(null);
      if ((err as Error)?.name === 'NotAllowedError') {
        setPendingReplay({ key, url: audioUrl, label });
      } else {
        setVoiceError((err as Error).message || 'Unable to start audio playback.');
      }
    }
  };

  const speakWithGeminiTTS = async (key: string, textToSpeak: string, label = 'Lesson Audio') => {
    if (speakingKey === key) {
      stopAudioPlayback();
      return;
    }
    stopAudioPlayback();
    setVoiceError(null);
    setPendingReplay(null);
    setIsSynthesizingAudio(true);
    setSpeakingKey(key);

    try {
      const { dataUrl, fallbackToBrowser } = await fetchTutorSpeechAudio({
        text: textToSpeak,
        voiceName,
      });

      setIsSynthesizingAudio(false);
      if (!fallbackToBrowser && dataUrl) {
        await playAudioUrl(key, dataUrl, label, textToSpeak);
        return;
      }
    } catch {
      setIsSynthesizingAudio(false);
    }

    browserSpeechRef.current = speakWithBrowserSpeech({
      text: textToSpeak,
      onStart: () => setSpeakingKey(key),
      onChunkStart: (chunkIndex, totalChunks, chunkText) => {
        setSpeakingKey(key);
        setActiveSpeechSync({ key, chunkIndex, totalChunks, chunkText });
      },
      onEnd: () => {
        browserSpeechRef.current = null;
        setSpeakingKey(null);
        setActiveSpeechSync(null);
        advanceFromStepEndRef.current(key);
      },
      onError: () => {
        browserSpeechRef.current = null;
        setSpeakingKey(null);
        setActiveSpeechSync(null);
      },
    });
  };

  const applyLessonToStudio = (nextLesson: TeachingLessonPlan) => {
    setLesson(nextLesson);
    setCurrentStepIndex(0);
    setCompletedSteps([1]);
    setCorrectCheckSteps([]);
    setSelectedChoices({});
    setTurns([]);
    setStudentReplyDraft('');
    setPendingReplay(null);

    if (nextLesson.steps[1]?.spokenScript) {
      prefetchTutorSpeechAudio({ text: nextLesson.steps[1].spokenScript, voiceName });
    }

    const firstStep = nextLesson.steps[0];
    if (autoSpeak && firstStep?.spokenScript) {
      void speakWithGeminiTTS(
        `step-${firstStep.stepNumber}`,
        firstStep.spokenScript,
        `Stage ${firstStep.stepNumber} Voiceover`
      );
    }
  };

  const startInteractiveLesson = async (overrideTarget?: {
    subject: SubjectId;
    grade: GradeLevel;
    topicTitle: string;
    topicSummary?: string;
    keyFormulas?: string[];
  }) => {
    const sub = overrideTarget?.subject ?? selectedSubject;
    const gr = overrideTarget?.grade ?? selectedGrade;
    const title = (overrideTarget?.topicTitle ?? topicInput).trim();
    if (!title || isGeneratingLesson) return;

    stopAudioPlayback();
    setErrorBanner(null);
    setVoiceError(null);
    setSavedNoteConfirmation(null);
    setIsGeneratingLesson(true);

    const matchedSyllabus = SYLLABUS_TOPICS.find(
      (t) =>
        t.subject === sub &&
        t.grade === gr &&
        t.title.toLowerCase() === title.toLowerCase()
    );

    const topicSummary = overrideTarget?.topicSummary ?? matchedSyllabus?.summary;
    const keyFormulas = overrideTarget?.keyFormulas ?? matchedSyllabus?.keyFormulas;

    try {
      const response = await fetch('/api/tutor/teach-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          subject: sub,
          grade: gr,
          topicTitle: title,
          style: teachingStyle,
          topicSummary,
          keyFormulas,
          studentContext,
        }),
      });

      const parsed = await safeParseResponseJson<{ lesson?: TeachingLessonPlan; error?: string }>(
        response
      );
      if (parsed.ok && parsed.data?.lesson) {
        applyLessonToStudio(parsed.data.lesson);
        return;
      }

      // Seamless curriculum-grounded fallback when API quota/limit applies
      const [mcqPool, notesPool] = await Promise.all([
        loadMcqsForSubject(sub).catch(() => undefined),
        loadAllSyllabusNotes().catch(() => undefined),
      ]);
      const localLesson = buildLocalCurriculumLessonPlan({
        subject: sub,
        grade: gr,
        topicTitle: title,
        style: teachingStyle,
        topicSummary,
        keyFormulas,
        notes: notesPool,
        mcqPool,
      });
      applyLessonToStudio(localLesson);
    } catch {
      const [mcqPool, notesPool] = await Promise.all([
        loadMcqsForSubject(sub).catch(() => undefined),
        loadAllSyllabusNotes().catch(() => undefined),
      ]);
      const localLesson = buildLocalCurriculumLessonPlan({
        subject: sub,
        grade: gr,
        topicTitle: title,
        style: teachingStyle,
        topicSummary,
        keyFormulas,
        notes: notesPool,
        mcqPool,
      });
      applyLessonToStudio(localLesson);
    } finally {
      setIsGeneratingLesson(false);
    }
  };

  useEffect(() => {
    if (!launchTarget) return;
    setSelectedSubject(launchTarget.subject);
    setSelectedGrade(launchTarget.grade);
    setTopicInput(launchTarget.topicTitle);
    if (launchTarget.autoStart) {
      void startInteractiveLesson({
        subject: launchTarget.subject,
        grade: launchTarget.grade,
        topicTitle: launchTarget.topicTitle,
        topicSummary: launchTarget.topicSummary,
        keyFormulas: launchTarget.keyFormulas,
      });
    }
    onConsumeLaunchTarget?.();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [launchTarget]);

  const activeStep = lesson?.steps[currentStepIndex] ?? null;

  const submitTeachingInteraction = async (params: {
    actionKind: TeachingActionKind;
    studentInput: string;
    selectedOptionIndex?: number | null;
  }) => {
    if (!lesson || !activeStep || isInteracting) return;

    setErrorBanner(null);
    setIsInteracting(true);

    if (
      params.actionKind === 'answer-mcq' &&
      typeof params.selectedOptionIndex === 'number'
    ) {
      setSelectedChoices((prev) => ({
        ...prev,
        [activeStep.stepNumber]: params.selectedOptionIndex!,
      }));
      if (params.selectedOptionIndex === activeStep.correctOptionIndex) {
        setCorrectCheckSteps((prev) =>
          prev.includes(activeStep.stepNumber) ? prev : [...prev, activeStep.stepNumber]
        );
        setCompletedSteps((prev) =>
          prev.includes(activeStep.stepNumber) ? prev : [...prev, activeStep.stepNumber]
        );
      }
    }

    const applyInteractionFeedback = (fb: TeachingInteractionFeedback) => {
      if (fb.verdict === 'correct' || fb.readyToAdvance) {
        setCorrectCheckSteps((prev) =>
          prev.includes(activeStep.stepNumber) ? prev : [...prev, activeStep.stepNumber]
        );
        setCompletedSteps((prev) =>
          prev.includes(activeStep.stepNumber) ? prev : [...prev, activeStep.stepNumber]
        );
      }

      const entryId = `turn-${Date.now()}`;
      const newTurn: TeachingTurnEntry = {
        id: entryId,
        stepNumber: activeStep.stepNumber,
        actionKind: params.actionKind,
        studentInput: params.studentInput,
        verdict: fb.verdict,
        feedback: fb.feedback,
        misconceptionOrNote: fb.misconceptionOrNote,
        followUpPrompt: fb.followUpPrompt,
        spokenFeedback: fb.spokenFeedback,
        createdAt: new Date().toISOString(),
      };
      setTurns((prev) => [...prev, newTurn]);

      if (params.actionKind === 'answer-open' || params.actionKind === 'ask-question') {
        setStudentReplyDraft('');
      }

      if (autoSpeak && fb.spokenFeedback) {
        void speakWithGeminiTTS(entryId, fb.spokenFeedback, 'Teacher Feedback Audio');
      }
    };

    try {
      const response = await fetch('/api/tutor/teach-interact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          lesson: {
            subject: lesson.subject,
            grade: lesson.grade,
            topicTitle: lesson.topicTitle,
            style: lesson.style,
          },
          step: {
            stepNumber: activeStep.stepNumber,
            stageTitle: activeStep.stageTitle,
            explanation: activeStep.explanation,
            checkPrompt: activeStep.checkPrompt,
            checkOptions: activeStep.checkOptions,
            correctOptionIndex: activeStep.correctOptionIndex,
            hint: activeStep.hint,
          },
          actionKind: params.actionKind,
          studentInput: params.studentInput,
          selectedOptionIndex: params.selectedOptionIndex ?? null,
          studentName: studentContext.preferredName,
        }),
      });

      const parsed = await safeParseResponseJson<{
        interaction?: TeachingInteractionFeedback;
        error?: string;
      }>(response);
      if (parsed.ok && parsed.data?.interaction) {
        applyInteractionFeedback(parsed.data.interaction);
        return;
      }

      applyInteractionFeedback(
        evaluateLocalTeachingInteraction({
          lesson,
          step: activeStep,
          actionKind: params.actionKind,
          studentInput: params.studentInput,
          selectedOptionIndex: params.selectedOptionIndex ?? null,
          studentName: studentContext.preferredName,
        })
      );
    } catch {
      applyInteractionFeedback(
        evaluateLocalTeachingInteraction({
          lesson,
          step: activeStep,
          actionKind: params.actionKind,
          studentInput: params.studentInput,
          selectedOptionIndex: params.selectedOptionIndex ?? null,
          studentName: studentContext.preferredName,
        })
      );
    } finally {
      setIsInteracting(false);
    }
  };

  const handleToggleVoiceDictation = async () => {
    if (isRecordingAnswer) {
      if (speechRecRef.current) {
        try {
          speechRecRef.current.stop();
        } catch {
          // ignore
        }
        speechRecRef.current = null;
      }
      if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
        mediaRecorderRef.current.stop();
      }
      setIsRecordingAnswer(false);
      return;
    }

    setVoiceError(null);
    if (!navigator.mediaDevices?.getUserMedia) {
      setVoiceError('Microphone access is unavailable in this browser. Type your response below or switch to Live Call.');
      return;
    }

    // Prefer native browser SpeechRecognition when available (zero latency, works offline/quota-free)
    const SpeechRecCtor =
      (window as unknown as {
        SpeechRecognition?: new () => {
          continuous: boolean;
          interimResults: boolean;
          lang: string;
          onresult: ((ev: { results: ArrayLike<{ isFinal: boolean; 0: { transcript: string } }>; resultIndex: number }) => void) | null;
          onerror: (() => void) | null;
          onend: (() => void) | null;
          start: () => void;
          stop: () => void;
        };
      }).SpeechRecognition ||
      (window as unknown as {
        webkitSpeechRecognition?: new () => {
          continuous: boolean;
          interimResults: boolean;
          lang: string;
          onresult: ((ev: { results: ArrayLike<{ isFinal: boolean; 0: { transcript: string } }>; resultIndex: number }) => void) | null;
          onerror: (() => void) | null;
          onend: (() => void) | null;
          start: () => void;
          stop: () => void;
        };
      }).webkitSpeechRecognition;

    if (SpeechRecCtor) {
      try {
        const rec = new SpeechRecCtor();
        rec.continuous = true;
        rec.interimResults = false;
        rec.lang = 'en-GB';
        rec.onresult = (ev) => {
          for (let i = ev.resultIndex; i < ev.results.length; i++) {
            const item = ev.results[i];
            if (item.isFinal) {
              const phrase = item[0]?.transcript?.trim();
              if (phrase) {
                setStudentReplyDraft((prev) => (prev.trim() ? `${prev.trim()} ${phrase}` : phrase));
              }
            }
          }
        };
        rec.onerror = () => {
          setIsRecordingAnswer(false);
        };
        rec.onend = () => {
          setIsRecordingAnswer(false);
        };
        speechRecRef.current = rec;
        rec.start();
        setIsRecordingAnswer(true);
        return;
      } catch {
        // fall through to MediaRecorder
      }
    }

    if (typeof MediaRecorder === 'undefined') {
      setVoiceError('Audio recording is not supported in this browser. Type your answer or use Live Voice Call.');
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      micStreamRef.current = stream;
      recordedChunksRef.current = [];
      const recorder = new MediaRecorder(stream);
      mediaRecorderRef.current = recorder;

      recorder.ondataavailable = (ev) => {
        if (ev.data.size > 0) {
          recordedChunksRef.current.push(ev.data);
        }
      };

      recorder.onstop = async () => {
        for (const t of stream.getTracks()) t.stop();
        micStreamRef.current = null;
        const chunks = recordedChunksRef.current;
        if (chunks.length === 0) return;

        const blob = new Blob(chunks, { type: recorder.mimeType || 'audio/webm' });
        setIsTranscribingAnswer(true);
        try {
          const transcript = await transcribeSpokenAnswer({ blob });
          if (transcript) {
            setStudentReplyDraft((prev) => (prev.trim() ? `${prev.trim()} ${transcript}` : transcript));
          } else {
            setVoiceError('No clear speech detected in the recording. Please try speaking again or type your answer.');
          }
        } catch (err) {
          setVoiceError((err as Error).message || 'Could not transcribe recorded speech.');
        } finally {
          setIsTranscribingAnswer(false);
        }
      };

      recorder.start();
      setIsRecordingAnswer(true);
    } catch (err) {
      setVoiceError(
        err instanceof Error && /Permission|NotAllowedError|denied/i.test(err.message)
          ? 'Microphone permission was denied. Allow mic access in your browser bar or type your response below.'
          : 'No microphone detected on this device. Connect a mic or type responses while listening to AI Teacher voice.'
      );
      stopVoiceRecordingCleanup();
    }
  };

  const handleNavigateStep = (nextIndex: number) => {
    if (!lesson) return;
    const bounded = Math.max(0, Math.min(lesson.steps.length - 1, nextIndex));
    stopAudioPlayback();
    setCurrentStepIndex(bounded);
    const nextStep = lesson.steps[bounded];
    const lookAheadStep = lesson.steps[bounded + 1];
    if (lookAheadStep?.spokenScript) {
      prefetchTutorSpeechAudio({ text: lookAheadStep.spokenScript, voiceName });
    }
    if (nextStep) {
      setCompletedSteps((prev) =>
        prev.includes(nextStep.stepNumber) ? prev : [...prev, nextStep.stepNumber]
      );
      if (autoSpeak && nextStep.spokenScript) {
        void speakWithGeminiTTS(`step-${nextStep.stepNumber}`, nextStep.spokenScript);
      }
    }
  };

  advanceFromStepEndRef.current = (finishedKey: string) => {
    if (!continuousWalkthroughRef.current || !lesson || !autoSpeak) return;
    const expectedKey = `step-${lesson.steps[currentStepIndex]?.stepNumber}`;
    if (finishedKey !== expectedKey) return;
    if (currentStepIndex < lesson.steps.length - 1) {
      handleNavigateStep(currentStepIndex + 1);
    }
  };

  const handleSaveToNotes = () => {
    if (!lesson || !onSaveLessonAsNote) return;
    const now = new Date().toISOString();
    const note: StudyNote = {
      id: `note-ai-${Date.now()}`,
      title: `${lesson.topicTitle} (AI Guided Lesson)`,
      subject: lesson.subject,
      grade: lesson.grade,
      tags: [lesson.grade, 'AI-Lesson'],
      content: lessonPlanToMarkdownNote(lesson),
      createdAt: now,
      updatedAt: now,
    };
    onSaveLessonAsNote(note);
    setSavedNoteConfirmation('Saved interactive lesson summary to Study Notes.');
  };

  const masterySummary = useMemo(() => {
    if (!lesson) return null;
    return computeTeachingMasterySummary({
      completedStepNumbers: completedSteps,
      totalSteps: lesson.steps.length,
      correctCheckStepNumbers: correctCheckSteps,
    });
  }, [lesson, completedSteps, correctCheckSteps]);

  const stepTurns = useMemo(() => {
    if (!activeStep) return [];
    return turns.filter((t) => t.stepNumber === activeStep.stepNumber);
  }, [turns, activeStep]);

  const handlePracticeMatchedTopic = () => {
    if (!lesson) return;
    const match = SYLLABUS_TOPICS.find(
      (t) =>
        t.subject === lesson.subject &&
        t.title.toLowerCase().includes(lesson.topicTitle.toLowerCase().slice(0, 14))
    );
    onPracticeTopic(lesson.subject, lesson.grade, match?.id ?? '');
  };

  return (
    <div
      data-testid="ai-teaching-studio"
      className="flex-1 flex flex-col min-h-0 overflow-y-auto p-4 sm:p-5 space-y-5"
    >
      {errorBanner && (
        <div
          role="alert"
          className="p-3.5 rounded-xl bg-rose-500/12 border border-rose-500/35 text-rose-200 text-xs flex items-start gap-2.5"
        >
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-400" />
          <span>{errorBanner}</span>
        </div>
      )}

      {voiceError && (
        <div
          role="alert"
          className="p-3 rounded-xl bg-amber-500/12 border border-amber-500/35 text-amber-200 text-xs flex items-start justify-between gap-2.5"
        >
          <div className="flex items-start gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-amber-400" />
            <span>{voiceError}</span>
          </div>
          <button
            type="button"
            onClick={() => setVoiceError(null)}
            className="text-amber-300 hover:text-white font-semibold shrink-0"
          >
            Dismiss
          </button>
        </div>
      )}

      {!lesson ? (
        /* Interactive Lesson Configuration Launcher */
        <div className="max-w-2xl mx-auto w-full space-y-5 py-1">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-300 shrink-0">
              <GraduationCap className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-display text-base sm:text-lg font-bold text-white">
                Interactive AI Teacher Studio
              </h3>
              <p className="text-xs sm:text-sm text-slate-400 mt-0.5 leading-relaxed">
                Step-by-step guided WASSCE lessons where you answer checkpoints, explain concepts
                in your own words or by voice, ask questions mid-lesson, and hear the AI Teacher speak aloud.
              </p>
            </div>
          </div>

          <div className="rounded-2xl bg-slate-950/80 border border-slate-800 p-4 sm:p-5 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label htmlFor={`teach-subject-${variant}`} className="text-xs font-semibold text-slate-300">
                  GES Subject
                </label>
                <select
                  id={`teach-subject-${variant}`}
                  value={selectedSubject}
                  onChange={(e) => {
                    const nextSub = e.target.value as SubjectId;
                    setSelectedSubject(nextSub);
                    const firstTopic = SYLLABUS_TOPICS.find(
                      (t) => t.subject === nextSub && t.grade === selectedGrade
                    ) ?? SYLLABUS_TOPICS.find((t) => t.subject === nextSub);
                    if (firstTopic) setTopicInput(firstTopic.title);
                  }}
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs sm:text-sm text-white focus:outline-none focus:border-cyan-500"
                >
                  {SUBJECT_LIST.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1.5">
                <span className="text-xs font-semibold text-slate-300 block">Grade Level</span>
                <div className="grid grid-cols-3 gap-1.5" role="group" aria-label="Select SHS Grade">
                  {GRADES.map((g) => (
                    <button
                      key={g}
                      type="button"
                      onClick={() => setSelectedGrade(g)}
                      aria-pressed={selectedGrade === g}
                      className={`py-2 rounded-xl border text-xs font-semibold transition-colors whitespace-nowrap ${
                        selectedGrade === g
                          ? 'bg-cyan-500/20 border-cyan-500/50 text-cyan-200'
                          : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
                      }`}
                    >
                      {g}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="space-y-1.5">
              <label htmlFor={`teach-topic-${variant}`} className="text-xs font-semibold text-slate-300">
                Topic or Concept to Learn
              </label>
              <input
                id={`teach-topic-${variant}`}
                type="text"
                value={topicInput}
                onChange={(e) => setTopicInput(e.target.value)}
                placeholder="e.g. Rutherford Gold Foil Experiment, Ohm's Law, SQL JOINs..."
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-cyan-500"
              />
              {matchingTopics.length > 0 && (
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {matchingTopics.slice(0, 4).map((t) => (
                    <button
                      key={t.id}
                      type="button"
                      onClick={() => setTopicInput(t.title)}
                      className={`px-2.5 py-1 rounded-lg border text-[11px] font-medium transition-colors text-left ${
                        topicInput.toLowerCase() === t.title.toLowerCase()
                          ? 'bg-emerald-500/15 border-emerald-500/45 text-emerald-200'
                          : 'bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-700'
                      }`}
                    >
                      {t.unitNumber}: {t.title}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Teaching Style Selector */}
            <div className="space-y-1.5">
              <span className="text-xs font-semibold text-slate-300 block">Teaching Approach</span>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                {(['socratic', 'step-by-step', 'exam-drill'] as TeachingStyle[]).map((styleKey) => {
                  const meta = TEACHING_STYLE_META[styleKey];
                  const active = teachingStyle === styleKey;
                  return (
                    <button
                      key={styleKey}
                      type="button"
                      onClick={() => setTeachingStyle(styleKey)}
                      aria-pressed={active}
                      className={`p-3 rounded-xl border text-left transition-colors space-y-1 ${
                        active
                          ? 'bg-cyan-500/12 border-cyan-500/50 text-white'
                          : 'bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-700'
                      }`}
                    >
                      <div className="text-xs font-bold text-cyan-300">{meta.label}</div>
                      <div className="text-[11px] text-slate-400 leading-snug">{meta.summary}</div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* AI Teacher Voice Settings */}
            <div className="pt-2 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <Volume2 className="w-4 h-4 text-cyan-400 shrink-0" />
                <label htmlFor={`teach-voice-${variant}`} className="text-xs font-medium text-slate-300">
                  Teacher Voice:
                </label>
                <select
                  id={`teach-voice-${variant}`}
                  value={voiceName}
                  onChange={(e) => setVoiceName(e.target.value as LiveVoiceName)}
                  className="px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs text-white focus:outline-none focus:border-cyan-500"
                >
                  {LIVE_VOICE_OPTIONS.map((v) => (
                    <option key={v.id} value={v.id}>
                      {v.label} — {v.tone}
                    </option>
                  ))}
                </select>
              </div>

              <label className="inline-flex items-center gap-2 text-xs text-slate-300 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={autoSpeak}
                  onChange={(e) => setAutoSpeak(e.target.checked)}
                  className="rounded border-slate-700 bg-slate-900 accent-cyan-400"
                />
                <span>Auto-read each step aloud</span>
              </label>
            </div>

            <div className="flex flex-wrap items-center gap-2.5 pt-1">
              <button
                type="button"
                onClick={() => void startInteractiveLesson()}
                disabled={!topicInput.trim() || isGeneratingLesson}
                className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 disabled:opacity-50 text-slate-950 font-bold text-xs sm:text-sm transition-colors whitespace-nowrap shrink-0"
              >
                {isGeneratingLesson ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Building Interactive Lesson...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    <span>Start Interactive AI Lesson</span>
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={() =>
                  onSwitchToLiveVoice({
                    topicTitle: topicInput.trim() || 'WASSCE Science & ICT Revision',
                    voiceName,
                  })
                }
                className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-200 text-xs font-semibold transition-colors whitespace-nowrap shrink-0"
              >
                <PhoneCall className="w-3.5 h-3.5 text-emerald-400" />
                <span>Talk Live Instead</span>
              </button>
            </div>
          </div>
        </div>
      ) : (
        /* Active Multi-Step Interactive AI Teaching Workspace */
        <div className="space-y-4">
          {/* Lesson Top Summary & Voice Control Strip */}
          <div className="rounded-2xl bg-slate-950/85 border border-slate-800 p-4 space-y-3">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div className="min-w-0 space-y-1">
                <div className="text-[11px] font-semibold text-cyan-300">
                  {SUBJECTS[lesson.subject]?.name ?? lesson.subject} · {lesson.grade} ·{' '}
                  {TEACHING_STYLE_META[lesson.style].label}
                </div>
                <h3 className="font-display text-base sm:text-lg font-bold text-white leading-snug">
                  {lesson.topicTitle}
                </h3>
                <p className="text-xs text-slate-400">{lesson.learningObjective}</p>
              </div>

              <div className="flex flex-wrap items-center gap-2 shrink-0">
                <select
                  aria-label="Teacher voice persona"
                  value={voiceName}
                  onChange={(e) => setVoiceName(e.target.value as LiveVoiceName)}
                  className="px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-[11px] text-slate-200"
                >
                  {LIVE_VOICE_OPTIONS.map((v) => (
                    <option key={v.id} value={v.id}>
                      Voice: {v.label}
                    </option>
                  ))}
                </select>

                <button
                  type="button"
                  onClick={() =>
                    activeStep &&
                    void speakWithGeminiTTS(`step-${activeStep.stepNumber}`, activeStep.spokenScript)
                  }
                  disabled={!activeStep || (isSynthesizingAudio && speakingKey !== `step-${activeStep?.stepNumber}`)}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-semibold transition-colors whitespace-nowrap shrink-0 ${
                    speakingKey === `step-${activeStep?.stepNumber}`
                      ? 'bg-rose-500/20 border-rose-500/50 text-rose-200'
                      : 'bg-cyan-500/15 hover:bg-cyan-500/25 border-cyan-500/40 text-cyan-200'
                  }`}
                >
                  {isSynthesizingAudio && speakingKey === `step-${activeStep?.stepNumber}` ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      <span>Preparing Voice...</span>
                    </>
                  ) : speakingKey === `step-${activeStep?.stepNumber}` ? (
                    <>
                      <VolumeX className="w-3.5 h-3.5" />
                      <span>Stop Voice</span>
                    </>
                  ) : (
                    <>
                      <Volume2 className="w-3.5 h-3.5" />
                      <span>Hear AI Teacher</span>
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={() =>
                    onSwitchToLiveVoice({
                      topicTitle: lesson.topicTitle,
                      stageTitle: activeStep?.stageTitle,
                      explanation: activeStep?.explanation,
                      voiceName,
                    })
                  }
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-500/40 text-emerald-200 text-xs font-semibold transition-colors whitespace-nowrap shrink-0"
                >
                  <PhoneCall className="w-3.5 h-3.5" />
                  <span>Live Call</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    stopAudioPlayback();
                    setLesson(null);
                    setTurns([]);
                  }}
                  className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 text-xs text-slate-300 transition-colors whitespace-nowrap shrink-0"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>New Topic</span>
                </button>
              </div>
            </div>

            {/* Step Progress Rail */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-800/80">
              <div className="flex flex-wrap items-center gap-1.5" role="tablist" aria-label="Lesson stages">
                {lesson.steps.map((st, idx) => {
                  const isCurrent = idx === currentStepIndex;
                  const isMastered = correctCheckSteps.includes(st.stepNumber);
                  return (
                    <button
                      key={st.stepNumber}
                      type="button"
                      role="tab"
                      aria-selected={isCurrent}
                      onClick={() => handleNavigateStep(idx)}
                      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-semibold transition-colors whitespace-nowrap ${
                        isCurrent
                          ? 'bg-cyan-500 text-slate-950 border-cyan-400'
                          : isMastered
                            ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-200'
                            : 'bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-700'
                      }`}
                    >
                      {isMastered && !isCurrent && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />}
                      <span className="tabular-nums">Step {st.stepNumber}:</span>
                      <span className="truncate max-w-[140px]">{st.stageTitle}</span>
                    </button>
                  );
                })}
              </div>

              {masterySummary && (
                <div className="text-xs text-slate-300 font-mono tabular-nums whitespace-nowrap">
                  Mastery: <strong className="text-emerald-300">{masterySummary.masteryPercentage}%</strong> ({masterySummary.statusLabel})
                </div>
              )}
            </div>

            {pendingReplay && (
              <div className="flex flex-wrap items-center justify-between gap-2 p-2.5 rounded-xl bg-cyan-500/10 border border-cyan-500/35 text-xs text-cyan-200">
                <span>AI Teacher audio is ready ({pendingReplay.label}). Tap Play to listen aloud.</span>
                <button
                  type="button"
                  onClick={() => void playAudioUrl(pendingReplay.key, pendingReplay.url, pendingReplay.label)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs whitespace-nowrap"
                >
                  <Volume2 className="w-3.5 h-3.5" />
                  <span>Play Voiceover</span>
                </button>
              </div>
            )}
          </div>

          {savedNoteConfirmation && (
            <div className="px-3.5 py-2.5 rounded-xl bg-emerald-500/12 border border-emerald-500/35 text-xs text-emerald-200 flex items-center justify-between gap-2">
              <span>{savedNoteConfirmation}</span>
              <button
                type="button"
                onClick={() => setSavedNoteConfirmation(null)}
                className="font-semibold text-emerald-300 hover:text-white"
              >
                OK
              </button>
            </div>
          )}

          {/* Current Teaching Stage Content */}
          {activeStep && (
            <div className="rounded-2xl bg-slate-950/90 border border-slate-800 p-4 sm:p-5 space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <h4 className="font-display text-sm sm:text-base font-bold text-white">
                  Stage {activeStep.stepNumber} of {lesson.steps.length}: {activeStep.stageTitle}
                </h4>
                <div className="flex items-center gap-3">
                  <label className="inline-flex items-center gap-1.5 text-[11px] text-slate-300 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={continuousWalkthrough}
                      onChange={(e) => setContinuousWalkthrough(e.target.checked)}
                      className="rounded border-slate-700 bg-slate-900 accent-emerald-400"
                    />
                    <span>Continuous play</span>
                  </label>
                  <label className="inline-flex items-center gap-1.5 text-[11px] text-slate-400 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={autoSpeak}
                      onChange={(e) => setAutoSpeak(e.target.checked)}
                      className="rounded border-slate-700 bg-slate-900 accent-cyan-400"
                    />
                    <span>Auto-voice</span>
                  </label>
                </div>
              </div>

              {activeSpeechSync?.key === `step-${activeStep.stepNumber}` && (
                <div
                  data-testid="ai-teacher-live-sync"
                  className="p-3 rounded-xl bg-cyan-500/10 border border-cyan-400/40 space-y-1.5"
                >
                  <div className="flex items-center justify-between text-[11px] font-mono text-cyan-300">
                    <span className="inline-flex items-center gap-1.5 font-semibold">
                      <Volume2 className="w-3.5 h-3.5 animate-pulse" />
                      AI Teacher Reading Aloud (Synced {activeSpeechSync.chunkIndex + 1}/{activeSpeechSync.totalChunks})
                    </span>
                  </div>
                  <p className="text-xs sm:text-sm text-white font-medium leading-relaxed">
                    {activeSpeechSync.chunkText}
                  </p>
                </div>
              )}

              <div className="text-sm text-slate-200 leading-relaxed space-y-2">
                {(() => {
                  const isSyncingThisStep = activeSpeechSync?.key === `step-${activeStep.stepNumber}`;
                  if (!isSyncingThisStep) {
                    return <MarkdownPreview content={activeStep.explanation} />;
                  }
                  const scriptChunks = splitSpeechChunks(activeStep.explanation);
                  if (scriptChunks.length <= 1) {
                    return <MarkdownPreview content={activeStep.explanation} />;
                  }
                  const activeIdx = Math.min(
                    scriptChunks.length - 1,
                    Math.floor(
                      (activeSpeechSync.chunkIndex / Math.max(1, activeSpeechSync.totalChunks)) *
                        scriptChunks.length
                    )
                  );
                  return scriptChunks.map((sentence, sIdx) => {
                    const isCurrent = sIdx === activeIdx;
                    const isSpoken = sIdx < activeIdx;
                    return (
                      <div
                        key={sIdx}
                        className={`px-3 py-2 rounded-lg border-l-2 transition-all ${
                          isCurrent
                            ? 'border-l-cyan-400 bg-cyan-500/12 text-white font-medium'
                            : isSpoken
                              ? 'border-l-emerald-500/50 text-slate-300'
                              : 'border-l-slate-800 text-slate-400'
                        }`}
                      >
                        <MathText text={sentence} />
                      </div>
                    );
                  });
                })()}
              </div>

              {(activeStep.keyEquation || activeStep.realWorldExample) && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {activeStep.keyEquation && (
                    <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-xs space-y-1">
                      <div className="font-semibold text-cyan-300">Key Expression</div>
                      <div className="text-slate-100 font-mono">
                        <MathText text={activeStep.keyEquation} />
                      </div>
                    </div>
                  )}
                  {activeStep.realWorldExample && (
                    <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-xs space-y-1">
                      <div className="font-semibold text-emerald-300">WASSCE / Real-World Link</div>
                      <div className="text-slate-300 leading-relaxed">
                        <MathText text={activeStep.realWorldExample} />
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Adaptive Teaching Requests */}
              <div className="flex flex-wrap items-center gap-2 pt-1">
                <span className="text-[11px] font-medium text-slate-400 mr-1">Need a different angle?</span>
                <button
                  type="button"
                  disabled={isInteracting}
                  onClick={() =>
                    void submitTeachingInteraction({
                      actionKind: 'simpler-analogy',
                      studentInput: 'Give me a simpler everyday analogy for this step.',
                    })
                  }
                  className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-700 text-xs text-slate-200 disabled:opacity-45 transition-colors whitespace-nowrap"
                >
                  <Lightbulb className="w-3.5 h-3.5 text-amber-300" />
                  <span>Simpler Analogy</span>
                </button>
                <button
                  type="button"
                  disabled={isInteracting}
                  onClick={() =>
                    void submitTeachingInteraction({
                      actionKind: 'worked-example',
                      studentInput: 'Walk me through an extra worked WASSCE example for this step.',
                    })
                  }
                  className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-700 text-xs text-slate-200 disabled:opacity-45 transition-colors whitespace-nowrap"
                >
                  <Sparkles className="w-3.5 h-3.5 text-cyan-300" />
                  <span>Worked Example</span>
                </button>
                <button
                  type="button"
                  disabled={isInteracting}
                  onClick={() =>
                    void submitTeachingInteraction({
                      actionKind: 'hint',
                      studentInput: 'Give me a Socratic hint for this checkpoint.',
                    })
                  }
                  className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-700 text-xs text-slate-200 disabled:opacity-45 transition-colors whitespace-nowrap"
                >
                  <HelpCircle className="w-3.5 h-3.5 text-emerald-300" />
                  <span>Give Hint</span>
                </button>
              </div>

              {/* Interactive Checkpoint Question */}
              <div className="pt-4 border-t border-slate-800 space-y-3">
                <div className="text-xs sm:text-sm font-semibold text-white">
                  Checkpoint {activeStep.stepNumber}: <MathText text={activeStep.checkPrompt} />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {activeStep.checkOptions.map((opt, idx) => {
                    const selectedIdx = selectedChoices[activeStep.stepNumber];
                    const answered = selectedIdx !== undefined;
                    const isRight = idx === activeStep.correctOptionIndex;
                    const isPicked = selectedIdx === idx;
                    let cls =
                      'bg-slate-900 border-slate-800 text-slate-200 hover:border-cyan-500/50';
                    if (answered) {
                      if (isRight) cls = 'bg-emerald-500/15 border-emerald-400 text-emerald-100';
                      else if (isPicked) cls = 'bg-rose-500/15 border-rose-400 text-rose-100';
                      else cls = 'bg-slate-900/50 border-slate-800/60 text-slate-500';
                    }
                    return (
                      <button
                        key={idx}
                        type="button"
                        disabled={isInteracting}
                        onClick={() =>
                          void submitTeachingInteraction({
                            actionKind: 'answer-mcq',
                            studentInput: opt,
                            selectedOptionIndex: idx,
                          })
                        }
                        className={`text-left p-3 rounded-xl border text-xs transition-colors disabled:opacity-60 ${cls}`}
                      >
                        <span className="font-mono font-bold mr-1.5">
                          {String.fromCharCode(65 + idx)}.
                        </span>
                        <MathText text={opt} />
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Open-Ended Student Explanation / Voice Answer / Clarifying Question */}
              <div className="pt-3 border-t border-slate-800/80 space-y-2.5">
                <label
                  htmlFor={`teach-reply-${variant}`}
                  className="text-xs font-semibold text-slate-300 block"
                >
                  Respond in Your Own Words or Ask the AI Teacher
                </label>
                <div className="flex flex-col sm:flex-row gap-2">
                  <textarea
                    id={`teach-reply-${variant}`}
                    rows={2}
                    value={studentReplyDraft}
                    onChange={(e) => setStudentReplyDraft(e.target.value)}
                    placeholder="Type or record your explanation, numerical steps, or ask a question about this stage..."
                    className="flex-1 resize-none px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs sm:text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-cyan-500"
                  />
                  <div className="flex sm:flex-col gap-1.5 shrink-0">
                    <button
                      type="button"
                      onClick={() => void handleToggleVoiceDictation()}
                      disabled={isTranscribingAnswer}
                      aria-label={isRecordingAnswer ? 'Stop voice recording' : 'Speak your answer'}
                      className={`inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl border text-xs font-semibold transition-colors whitespace-nowrap ${
                        isRecordingAnswer
                          ? 'bg-rose-500 border-rose-400 text-white'
                          : 'bg-slate-900 hover:bg-slate-800 border-slate-700 text-slate-200'
                      }`}
                    >
                      {isTranscribingAnswer ? (
                        <>
                          <Loader2 className="w-3.5 h-3.5 animate-spin" />
                          <span>Transcribing...</span>
                        </>
                      ) : isRecordingAnswer ? (
                        <>
                          <MicOff className="w-3.5 h-3.5" />
                          <span>Stop Rec</span>
                        </>
                      ) : (
                        <>
                          <Mic className="w-3.5 h-3.5 text-cyan-400" />
                          <span>Speak Answer</span>
                        </>
                      )}
                    </button>

                    <div className="flex gap-1.5">
                      <button
                        type="button"
                        disabled={!studentReplyDraft.trim() || isInteracting}
                        onClick={() =>
                          void submitTeachingInteraction({
                            actionKind: 'answer-open',
                            studentInput: studentReplyDraft,
                          })
                        }
                        className="flex-1 inline-flex items-center justify-center gap-1 px-3 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 disabled:opacity-40 text-slate-950 text-xs font-bold transition-colors whitespace-nowrap"
                      >
                        <Send className="w-3.5 h-3.5" />
                        <span>Check</span>
                      </button>
                      <button
                        type="button"
                        disabled={!studentReplyDraft.trim() || isInteracting}
                        onClick={() =>
                          void submitTeachingInteraction({
                            actionKind: 'ask-question',
                            studentInput: studentReplyDraft,
                          })
                        }
                        className="flex-1 inline-flex items-center justify-center gap-1 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 disabled:opacity-40 text-slate-100 text-xs font-semibold transition-colors whitespace-nowrap"
                      >
                        <span>Ask</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {isInteracting && (
                <div className="flex items-center gap-2 text-xs text-cyan-300 font-mono">
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>AI Teacher is reviewing your response...</span>
                </div>
              )}

              {/* Interactive Feedback Thread */}
              {stepTurns.length > 0 && (
                <div className="space-y-2.5 pt-2">
                  {stepTurns.map((turn) => {
                    const verdictMeta =
                      turn.verdict === 'correct'
                        ? { label: 'Mastered', cls: 'text-emerald-300 border-emerald-500/40 bg-emerald-500/10' }
                        : turn.verdict === 'partial'
                          ? { label: 'Almost There', cls: 'text-amber-300 border-amber-500/40 bg-amber-500/10' }
                          : turn.verdict === 'needs-review'
                            ? { label: 'Needs Review', cls: 'text-rose-300 border-rose-500/40 bg-rose-500/10' }
                            : { label: 'Teacher Guidance', cls: 'text-cyan-300 border-cyan-500/40 bg-cyan-500/10' };

                    const isSpeakingThis = speakingKey === turn.id;
                    return (
                      <div
                        key={turn.id}
                        className={`p-3.5 rounded-xl border text-xs space-y-2 ${verdictMeta.cls}`}
                      >
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <span className="font-bold uppercase tracking-wider text-[11px]">
                            {verdictMeta.label} · You: &ldquo;{turn.studentInput.slice(0, 72)}
                            {turn.studentInput.length > 72 ? '...' : ''}&rdquo;
                          </span>

                          <button
                            type="button"
                            onClick={() => void speakWithGeminiTTS(turn.id, turn.spokenFeedback)}
                            className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-slate-950/70 border border-slate-700 text-[11px] text-slate-200 hover:text-white whitespace-nowrap"
                          >
                            {isSpeakingThis ? (
                              <>
                                <Square className="w-3 h-3 fill-current" />
                                <span>Stop</span>
                              </>
                            ) : (
                              <>
                                <Volume2 className="w-3 h-3" />
                                <span>Hear Feedback</span>
                              </>
                            )}
                          </button>
                        </div>

                        <div className="text-slate-100 leading-relaxed">
                          <MarkdownPreview content={turn.feedback} />
                        </div>

                        {turn.misconceptionOrNote && (
                          <div className="text-[11px] text-slate-300 bg-slate-950/50 rounded-lg p-2">
                            <strong className="text-white">Key Watchout: </strong>
                            <MathText text={turn.misconceptionOrNote} />
                          </div>
                        )}

                        <div className="text-[11px] text-cyan-200 font-medium">
                          Next Check: <MathText text={turn.followUpPrompt} />
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* WASSCE Exam Trap Banner on Final Step */}
              {currentStepIndex === lesson.steps.length - 1 && (
                <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-xs text-amber-100 space-y-1">
                  <div className="font-bold text-amber-300">WASSCE Examiner Trap</div>
                  <MathText text={lesson.wassceExamTrap} />
                </div>
              )}

              {/* Step Footer Navigation */}
              <div className="flex flex-wrap items-center justify-between gap-2 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  disabled={currentStepIndex === 0}
                  onClick={() => handleNavigateStep(currentStepIndex - 1)}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-xs font-semibold text-slate-200 disabled:opacity-40 transition-colors whitespace-nowrap"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Previous</span>
                </button>

                <div className="flex flex-wrap items-center gap-2">
                  {onSaveLessonAsNote && (
                    <button
                      type="button"
                      onClick={handleSaveToNotes}
                      className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-xs font-semibold text-slate-200 transition-colors whitespace-nowrap"
                    >
                      <BookmarkPlus className="w-3.5 h-3.5 text-cyan-300" />
                      <span>Save to Notes</span>
                    </button>
                  )}

                  {currentStepIndex < lesson.steps.length - 1 ? (
                    <button
                      type="button"
                      onClick={() => handleNavigateStep(currentStepIndex + 1)}
                      className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-bold transition-colors whitespace-nowrap"
                    >
                      <span>Next Stage</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={handlePracticeMatchedTopic}
                      className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold transition-colors whitespace-nowrap"
                    >
                      <Play className="w-3.5 h-3.5 fill-current" />
                      <span>Drill WASSCE Questions</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
