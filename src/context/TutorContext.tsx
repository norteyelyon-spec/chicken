import React, { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { getAllCachedMcqs, loadMcqsForSubjects } from '../data/curriculumLoader';
import { SYLLABUS_TOPICS } from '../data/subjects';
import type {
  FlashcardItem,
  GradeLevel,
  MCQQuestion,
  StudyNotificationItem,
  SubjectId,
  SyllabusTopic,
  TeachingLaunchTarget,
  TutorMessage,
  TutorPanelMode,
  TutorQuestionContext,
} from '../types';
import { safeParseResponseJson } from '../utils/safeFetchJson';
import { buildLocalOfflineTutorReply } from '../utils/studyModes';
import {
  buildTutorStudentContextPayload,
  extractTutorErrorMessage,
} from '../utils/tutorContext';
import { useNavigation } from './NavigationContext';
import { useStudyProgress } from './StudyProgressContext';

const TUTOR_CHAT_STORAGE_KEY = 'wassce_masterclass_tutor_chat_v1';

function readChatStorage(): TutorMessage[] {
  try {
    const raw = window.localStorage.getItem(TUTOR_CHAT_STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw) as TutorMessage[];
  } catch {
    return [];
  }
}

interface TutorContextValue {
  tutorMessages: TutorMessage[];
  clearTutorMessages: () => void;
  tutorPanelMode: TutorPanelMode;
  setTutorPanelMode: React.Dispatch<React.SetStateAction<TutorPanelMode>>;
  teachingLaunchTarget: TeachingLaunchTarget | null;
  setTeachingLaunchTarget: React.Dispatch<React.SetStateAction<TeachingLaunchTarget | null>>;
  isTutorStreaming: boolean;
  tutorErrorBanner: string | null;
  setTutorErrorBanner: React.Dispatch<React.SetStateAction<string | null>>;
  activeTutorQuestion: TutorQuestionContext | null;
  setActiveTutorQuestion: React.Dispatch<React.SetStateAction<TutorQuestionContext | null>>;
  tutorStudentContext: ReturnType<typeof buildTutorStudentContextPayload>;
  handleSendTutorMessage: (
    promptText: string,
    overrideQuestionContext?: TutorQuestionContext | null
  ) => Promise<void>;
  handleStopTutorStreaming: () => void;
  handleAskQuestionHint: (qCtx: TutorQuestionContext) => void;
  handleAskTutorAboutTopic: (topic: SyllabusTopic) => void;
  handleLaunchAITeacher: (target: TeachingLaunchTarget, openInDrawer?: boolean) => void;
  handleTeachTopic: (topic: SyllabusTopic) => void;
  handleAskTutorAboutFlashcard: (card: FlashcardItem) => void;
  handleAskTutorAboutMistake: (q: {
    id: string;
    subject: SubjectId;
    grade: GradeLevel;
    topicId: string;
    topicTitle: string;
    prompt: string;
    options: [string, string, string, string];
    selectedOptionIndex: number | null;
  }) => void;
  handleAskTutorPrompt: (prompt: string) => void;
  handleActionNotification: (item: StudyNotificationItem) => void;
}

const TutorContext = createContext<TutorContextValue | null>(null);

export const TutorProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const {
    activeTab,
    effectiveOffline,
    isTutorDrawerOpen,
    openQuizConfig,
    selectedSubject,
    setActiveTab,
    setIsTutorDrawerOpen,
    setSelectedSubject,
  } = useNavigation();
  const {
    effectiveProfile,
    handleMarkNotificationRead,
    handlePracticeMistakes,
    masteryStats,
    mergedNotes,
    mistakes,
    notes,
    overallAnalytics,
    streak,
  } = useStudyProgress();

  const [tutorMessages, setTutorMessages] = useState<TutorMessage[]>(() => readChatStorage());
  const [tutorPanelMode, setTutorPanelMode] = useState<TutorPanelMode>('chat');
  const [teachingLaunchTarget, setTeachingLaunchTarget] = useState<TeachingLaunchTarget | null>(
    null
  );
  const [isTutorStreaming, setIsTutorStreaming] = useState(false);
  const [tutorErrorBanner, setTutorErrorBanner] = useState<string | null>(null);
  const [activeTutorQuestion, setActiveTutorQuestion] = useState<TutorQuestionContext | null>(null);
  const [cachedMcqSnapshot, setCachedMcqSnapshot] = useState<MCQQuestion[]>(() => getAllCachedMcqs());
  const tutorAbortRef = useRef<AbortController | null>(null);

  useEffect(() => {
    const persistable = tutorMessages
      .filter((m) => !m.error && m.content.trim().length > 0)
      .slice(-30);
    window.localStorage.setItem(TUTOR_CHAT_STORAGE_KEY, JSON.stringify(persistable));
  }, [tutorMessages]);

  // Pre-warm subject MCQ cache when user opens Tutor tab or drawer so weak-area recs are exact
  useEffect(() => {
    if (!isTutorDrawerOpen && activeTab !== 'tutor') return;
    let cancelled = false;
    const subjectsToWarm = effectiveProfile.subjects.slice(0, 3);
    void loadMcqsForSubjects(subjectsToWarm.length > 0 ? subjectsToWarm : [selectedSubject])
      .then(() => {
        if (!cancelled) setCachedMcqSnapshot(getAllCachedMcqs());
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, [activeTab, effectiveProfile.subjects, isTutorDrawerOpen, selectedSubject]);

  const tutorStudentContext = useMemo(
    () =>
      buildTutorStudentContextPayload({
        profile: effectiveProfile,
        overallAccuracy: overallAnalytics.overallAccuracy,
        totalQuestionsSolved: overallAnalytics.totalQuestionsSolved,
        streak,
        masteryStats,
        mistakes,
        mcqPool: cachedMcqSnapshot,
        topics: SYLLABUS_TOPICS,
        notes,
        activeQuestion: activeTutorQuestion,
      }),
    [
      activeTutorQuestion,
      cachedMcqSnapshot,
      effectiveProfile,
      masteryStats,
      mistakes,
      notes,
      overallAnalytics.overallAccuracy,
      overallAnalytics.totalQuestionsSolved,
      streak,
    ]
  );

  const handleStopTutorStreaming = useCallback(() => {
    tutorAbortRef.current?.abort();
    tutorAbortRef.current = null;
    setIsTutorStreaming(false);
  }, []);

  const handleSendTutorMessage = useCallback(
    async (promptText: string, overrideQuestionContext?: TutorQuestionContext | null) => {
      const trimmed = promptText.trim();
      if (!trimmed || isTutorStreaming) return;

      const effectiveQuestion =
        overrideQuestionContext !== undefined ? overrideQuestionContext : activeTutorQuestion;

      const latestMcqs = getAllCachedMcqs();
      const contextForRequest =
        overrideQuestionContext !== undefined
          ? buildTutorStudentContextPayload({
              profile: effectiveProfile,
              overallAccuracy: overallAnalytics.overallAccuracy,
              totalQuestionsSolved: overallAnalytics.totalQuestionsSolved,
              streak,
              masteryStats,
              mistakes,
              mcqPool: latestMcqs,
              topics: SYLLABUS_TOPICS,
              notes,
              activeQuestion: effectiveQuestion,
            })
          : tutorStudentContext;

      const nowIso = new Date().toISOString();
      const userMsg: TutorMessage = {
        id: `tm-u-${Date.now()}`,
        role: 'user',
        content: trimmed,
        createdAt: nowIso,
        attachedQuestionTitle: effectiveQuestion?.topicTitle,
      };
      const assistantMsgId = `tm-a-${Date.now() + 1}`;
      const placeholderMsg: TutorMessage = {
        id: assistantMsgId,
        role: 'assistant',
        content: '',
        createdAt: nowIso,
        recommendations: contextForRequest.recommendedTopics.slice(0, 2),
      };

      const historyForApi = [
        ...tutorMessages.filter((m) => !m.error && m.content.trim()),
        userMsg,
      ].map((m) => ({
        role: m.role,
        content: m.content,
      }));

      setTutorErrorBanner(null);

      if (effectiveOffline) {
        const offlineReply = buildLocalOfflineTutorReply({
          prompt: trimmed,
          studentContext: contextForRequest,
          activeQuestion: effectiveQuestion,
          notes: mergedNotes,
          mcqPool: latestMcqs,
        });
        const offlineAssistantMsg: TutorMessage = {
          ...placeholderMsg,
          content: offlineReply,
        };
        setTutorMessages((prev) => [...prev, userMsg, offlineAssistantMsg]);
        return;
      }

      setTutorMessages((prev) => [...prev, userMsg, placeholderMsg]);
      setIsTutorStreaming(true);

      const controller = new AbortController();
      tutorAbortRef.current = controller;

      try {
        const response = await fetch('/api/tutor/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            messages: historyForApi,
            studentContext: contextForRequest,
            stream: true,
          }),
          signal: controller.signal,
        });

        const contentType = response.headers.get('content-type') ?? '';
        if (!response.ok || contentType.includes('text/html')) {
          const { errorMessage } = await safeParseResponseJson<{ error?: string }>(response);
          const friendly = extractTutorErrorMessage(response.status || 502, errorMessage ?? '');
          setTutorErrorBanner(friendly);
          setTutorMessages((prev) => prev.filter((m) => m.id !== assistantMsgId));
          return;
        }

        if (!response.body) {
          throw new Error('No response stream received from AI Tutor server.');
        }

        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        let buffer = '';
        let accumulated = '';

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          buffer += decoder.decode(value, { stream: true });

          const lines = buffer.split('\n');
          buffer = lines.pop() ?? '';

          for (const rawLine of lines) {
            const line = rawLine.trim();
            if (!line.startsWith('data:')) continue;
            const payloadStr = line.slice(5).trim();
            if (!payloadStr) continue;
            try {
              const parsed = JSON.parse(payloadStr) as {
                text?: string;
                error?: string;
                done?: boolean;
              };
              if (parsed.error) {
                setTutorErrorBanner(extractTutorErrorMessage(500, parsed.error));
                continue;
              }
              if (parsed.text) {
                accumulated += parsed.text;
                setTutorMessages((prev) =>
                  prev.map((m) => (m.id === assistantMsgId ? { ...m, content: accumulated } : m))
                );
              }
            } catch {
              // Ignore malformed SSE fragments
            }
          }
        }

        if (!accumulated.trim()) {
          setTutorMessages((prev) =>
            prev.map((m) =>
              m.id === assistantMsgId
                ? { ...m, content: 'No response generated. Please try asking again.', error: true }
                : m
            )
          );
        }
      } catch (err) {
        if ((err as Error).name === 'AbortError') {
          setTutorMessages((prev) =>
            prev.map((m) =>
              m.id === assistantMsgId && !m.content.trim()
                ? { ...m, content: '_Generation stopped._' }
                : m
            )
          );
        } else {
          const msg = extractTutorErrorMessage(500, (err as Error).message);
          setTutorErrorBanner(msg);
          setTutorMessages((prev) => prev.filter((m) => m.id !== assistantMsgId));
        }
      } finally {
        tutorAbortRef.current = null;
        setIsTutorStreaming(false);
      }
    },
    [
      activeTutorQuestion,
      effectiveOffline,
      effectiveProfile,
      isTutorStreaming,
      masteryStats,
      mergedNotes,
      mistakes,
      notes,
      overallAnalytics.overallAccuracy,
      overallAnalytics.totalQuestionsSolved,
      streak,
      tutorMessages,
      tutorStudentContext,
    ]
  );

  const handleAskQuestionHint = useCallback(
    (qCtx: TutorQuestionContext) => {
      setActiveTutorQuestion(qCtx);
      setTutorErrorBanner(null);
      setIsTutorDrawerOpen(true);
    },
    [setIsTutorDrawerOpen]
  );

  const handleAskTutorAboutTopic = useCallback(
    (topic: SyllabusTopic) => {
      setActiveTutorQuestion(null);
      setTutorErrorBanner(null);
      setTutorPanelMode('chat');
      setIsTutorDrawerOpen(true);
      void handleSendTutorMessage(
        `Explain the GES ${topic.grade} unit "${topic.unitNumber}: ${topic.title}". Include key definitions, equations in LaTeX, and 1 WASSCE practice check.`,
        null
      );
    },
    [handleSendTutorMessage, setIsTutorDrawerOpen]
  );

  const handleLaunchAITeacher = useCallback(
    (target: TeachingLaunchTarget, openInDrawer = false) => {
      setTeachingLaunchTarget(target);
      setTutorPanelMode('teach');
      if (openInDrawer) {
        setIsTutorDrawerOpen(true);
      } else {
        setIsTutorDrawerOpen(false);
        setActiveTab('tutor');
      }
    },
    [setActiveTab, setIsTutorDrawerOpen]
  );

  const handleTeachTopic = useCallback(
    (topic: SyllabusTopic) => {
      handleLaunchAITeacher(
        {
          subject: topic.subject,
          grade: topic.grade,
          topicTitle: `${topic.unitNumber}: ${topic.title}`,
          topicSummary: topic.summary,
          keyFormulas: topic.keyFormulas,
          autoStart: true,
        },
        false
      );
    },
    [handleLaunchAITeacher]
  );

  const handleAskTutorAboutFlashcard = useCallback(
    (card: FlashcardItem) => {
      setActiveTutorQuestion(null);
      setTutorErrorBanner(null);
      setIsTutorDrawerOpen(true);
      void handleSendTutorMessage(
        `Explain this ${card.grade} flashcard on "${card.topicTitle}" (${card.unitNumber}):\nPrompt: ${card.front}\nDefinition: ${card.back}\nGive a clear WASSCE exam example and common pitfall to avoid.`,
        null
      );
    },
    [handleSendTutorMessage, setIsTutorDrawerOpen]
  );

  const handleAskTutorAboutMistake = useCallback(
    (q: {
      id: string;
      subject: SubjectId;
      grade: GradeLevel;
      topicId: string;
      topicTitle: string;
      prompt: string;
      options: [string, string, string, string];
      selectedOptionIndex: number | null;
    }) => {
      const qCtx: TutorQuestionContext = {
        id: q.id,
        paperType: 'mcq',
        subject: q.subject,
        grade: q.grade,
        topicId: q.topicId,
        topicTitle: q.topicTitle,
        prompt: q.prompt,
        options: q.options,
        selectedOptionIndex: q.selectedOptionIndex,
        isSubmitted: true,
      };
      setActiveTutorQuestion(qCtx);
      setTutorErrorBanner(null);
      setIsTutorDrawerOpen(true);
      void handleSendTutorMessage(
        `Walk me through why my answer was incorrect on this ${q.grade} question about ${q.topicTitle}, and explain the exact concept so I master it.`,
        qCtx
      );
    },
    [handleSendTutorMessage, setIsTutorDrawerOpen]
  );

  const handleAskTutorPrompt = useCallback(
    (prompt: string) => {
      setActiveTutorQuestion(null);
      setTutorErrorBanner(null);
      setTutorPanelMode('chat');
      setIsTutorDrawerOpen(true);
      void handleSendTutorMessage(prompt, null);
    },
    [handleSendTutorMessage, setIsTutorDrawerOpen]
  );

  const handleActionNotification = useCallback(
    (item: StudyNotificationItem) => {
      handleMarkNotificationRead(item.id);
      if (item.ctaAction === 'mistakes') {
        const hasPending = mistakes.some((m) => !m.mastered);
        if (hasPending) {
          void handlePracticeMistakes(item.subjectId);
        } else {
          setActiveTab('analytics');
        }
        return;
      }
      if (item.ctaAction === 'notes') {
        setActiveTab('notes');
        return;
      }
      if (item.ctaAction === 'videos') {
        setActiveTab('videos');
        return;
      }
      if (item.ctaAction === 'timetable') {
        setActiveTab('timetable');
        return;
      }
      if (item.ctaAction === 'teach') {
        const targetSub = item.subjectId ?? selectedSubject;
        const recNote = mergedNotes.find(
          (n) => n.subject === targetSub && n.grade === effectiveProfile.gradeLevel
        );
        handleLaunchAITeacher({
          subject: targetSub,
          grade: recNote?.grade ?? effectiveProfile.gradeLevel,
          topicTitle: recNote?.title ?? 'Today’s Scheduled Topic',
          topicSummary: recNote?.content.slice(0, 1000),
          autoStart: true,
        });
        return;
      }
      if (item.ctaAction === 'flashcards') {
        if (item.subjectId) setSelectedSubject(item.subjectId);
        setActiveTab('subjects');
        return;
      }
      openQuizConfig(item.subjectId ?? selectedSubject, effectiveProfile.gradeLevel, []);
    },
    [
      effectiveProfile.gradeLevel,
      handleLaunchAITeacher,
      handleMarkNotificationRead,
      handlePracticeMistakes,
      mergedNotes,
      mistakes,
      openQuizConfig,
      selectedSubject,
      setActiveTab,
      setSelectedSubject,
    ]
  );

  const clearTutorMessages = useCallback(() => {
    setTutorMessages([]);
    setTutorErrorBanner(null);
  }, []);

  const value: TutorContextValue = {
    tutorMessages,
    clearTutorMessages,
    tutorPanelMode,
    setTutorPanelMode,
    teachingLaunchTarget,
    setTeachingLaunchTarget,
    isTutorStreaming,
    tutorErrorBanner,
    setTutorErrorBanner,
    activeTutorQuestion,
    setActiveTutorQuestion,
    tutorStudentContext,
    handleSendTutorMessage,
    handleStopTutorStreaming,
    handleAskQuestionHint,
    handleAskTutorAboutTopic,
    handleLaunchAITeacher,
    handleTeachTopic,
    handleAskTutorAboutFlashcard,
    handleAskTutorAboutMistake,
    handleAskTutorPrompt,
    handleActionNotification,
  };

  return <TutorContext.Provider value={value}>{children}</TutorContext.Provider>;
};

export function useTutor(): TutorContextValue {
  const ctx = useContext(TutorContext);
  if (!ctx) throw new Error('useTutor must be used inside TutorProvider');
  return ctx;
}
