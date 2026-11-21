import React, { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import {
  INITIAL_ATTEMPTS,
  INITIAL_MISTAKES,
  INITIAL_NOTES,
  INITIAL_STREAK,
} from '../data/defaultNotes';
import {
  getCachedSyllabusNotes,
  loadAllSyllabusNotes,
  loadMcqsForSubject,
  loadTheoryForSubject,
} from '../data/curriculumLoader';
import { SUBJECT_LIST, SYLLABUS_TOPICS } from '../data/subjects';
import type {
  AppBackupPayload,
  CompetitionMatchRecord,
  ExamAttempt,
  FlashcardProgress,
  FlashcardRating,
  MCQAnswerRecord,
  MCQQuestion,
  MistakeEntry,
  PersonalizationPreferences,
  QuizConfig,
  StreakData,
  StudyNote,
  StudyNotificationItem,
  StudyReminderSettings,
  StudyTimetableSchedule,
  SubjectId,
  SyllabusTopic,
  TheoryQuestion,
  TimetableDayId,
  UserProfile,
} from '../types';
import { COMPETITIONS_STORAGE_KEY } from '../utils/competitionsEngine';
import { reviewFlashcardSM2 } from '../utils/flashcards';
import {
  deleteStudyNoteFromFirestore,
  ensureUserAccountInFirestore,
  recordCompetitionMatchInFirestore,
  recordExamAttemptInFirestore,
  recordSimulationRunInFirestore,
  saveUserAccountToFirestore,
  subscribeUserWorkspace,
  syncFlashcardToFirestore,
  syncMistakeToFirestore,
  syncStudyNoteToFirestore,
} from '../utils/firestoreSync';
import {
  NOTE_DRILLS_STORAGE_KEY,
  type NoteDrillAttemptSummary,
  type NoteDrillMasteryRecord,
} from '../utils/noteDrills';
import {
  DEFAULT_PERSONALIZATION,
  PERSONALIZATION_STORAGE_KEY,
  sanitizePersonalization,
} from '../utils/personalization';
import {
  buildMCQSession,
  buildTheorySession,
  computeOverallAnalytics,
  computeSubjectMastery,
  createDefaultProfile,
  evaluateAchievements,
  updateDailyStreak,
  updateMistakeBank,
  validateBackupPayload,
} from '../utils/quizEngine';
import {
  buildTodayTimetableNotification,
  computeMsUntilReminder,
  DEFAULT_REMINDER_SETTINGS,
  evaluateDailyStudyReminder,
  formatLocalDateKey,
  playGentleReminderChime,
  sanitizeReminderTime,
} from '../utils/studyReminders';
import {
  DEFAULT_TIMETABLE_SCHEDULE,
  getTodayLearningPlan,
  sanitizeTimetableSchedule,
  updateTimetableSlot,
} from '../utils/studyTimetable';
import { useAuth } from './AuthContext';
import { useNavigation } from './NavigationContext';

const STORAGE_KEYS = {
  profile: 'wassce_masterclass_profile_v1',
  attempts: 'wassce_masterclass_attempts_v1',
  mistakes: 'wassce_masterclass_mistakes_v1',
  notes: 'wassce_masterclass_notes_v1',
  streak: 'wassce_masterclass_streak_v1',
  flashcards: 'wassce_masterclass_flashcards_v1',
  reminderSettings: 'wassce_masterclass_reminder_settings_v1',
  notifications: 'wassce_masterclass_notifications_v1',
  timetable: 'wassce_masterclass_timetable_v1',
  completedTimetableKeys: 'wassce_masterclass_completed_tt_v1',
  completedVideoIds: 'wassce_masterclass_completed_videos_v1',
} as const;

function readStorage<T>(key: string, fallback: T): T {
  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

interface StudyProgressContextValue {
  profile: UserProfile | null;
  effectiveProfile: UserProfile;
  saveProfile: (next: UserProfile) => void;
  attempts: ExamAttempt[];
  mistakes: MistakeEntry[];
  notes: StudyNote[];
  mergedNotes: StudyNote[];
  streak: StreakData;
  flashcardProgress: Record<string, FlashcardProgress>;
  reminderSettings: StudyReminderSettings;
  notifications: StudyNotificationItem[];
  activeReminderBanner: StudyNotificationItem | null;
  timetable: StudyTimetableSchedule;
  completedTimetableKeys: Record<string, boolean>;
  completedVideoIds: Record<string, boolean>;
  noteDrillMastery: Record<string, NoteDrillMasteryRecord>;
  personalization: PersonalizationPreferences;
  competitionMatches: CompetitionMatchRecord[];
  overallAnalytics: ReturnType<typeof computeOverallAnalytics>;
  masteryStats: ReturnType<typeof computeSubjectMastery>;
  achievements: ReturnType<typeof evaluateAchievements>;
  todayLearningPlan: ReturnType<typeof getTodayLearningPlan>;
  todayScheduleSummary: string;
  activeQuizConfig: QuizConfig | null;
  activeMCQSession: MCQQuestion[];
  activeTheorySession: TheoryQuestion[];
  deliverStudyNotification: (
    item: StudyNotificationItem,
    options?: { markNotifiedToday?: boolean; browserPush?: boolean }
  ) => void;
  handleUpdateReminderSettings: (patch: Partial<StudyReminderSettings>) => void;
  handleRequestBrowserNotifications: () => Promise<void>;
  handlePreviewReminder: () => void;
  handleSendTodayTimetableAlert: () => void;
  handleMarkNotificationRead: (id: string) => void;
  handleMarkAllNotificationsRead: () => void;
  handleSnoozeReminder: (minutes: number) => void;
  handleStartExam: (config: QuizConfig) => Promise<void>;
  handleCompleteMCQ: (
    attempt: ExamAttempt,
    questions: MCQQuestion[],
    records: MCQAnswerRecord[]
  ) => void;
  handleCompleteTheory: (attempt: ExamAttempt) => void;
  handleCompleteNoteDrill: (note: StudyNote, summary: NoteDrillAttemptSummary) => Promise<void>;
  handleCreateNoteForTopic: (topic: SyllabusTopic) => void;
  handleSaveLessonAsNote: (note: StudyNote) => void;
  handleCreatePersonalNote: (note: StudyNote) => void;
  handleUpdateAnyNote: (updated: StudyNote) => void;
  handleDeletePersonalNote: (id: string) => void;
  handleImportNoteFromDrive: (importedNote: StudyNote) => void;
  handlePracticeMistakes: (subjectFilter?: SubjectId) => Promise<void>;
  handleToggleMistakeMastered: (qId: string) => void;
  handleUpdateTimetableSlot: (dayId: TimetableDayId, slotId: string, subjectId: SubjectId) => void;
  handleResetSchedule: () => void;
  handleToggleTimetableBlock: (completionKey: string) => void;
  handleToggleVideoCompleted: (noteId: string) => void;
  handleRateFlashcard: (cardId: string, rating: FlashcardRating) => void;
  handleResetFlashcardDeck: (cardIds: string[]) => void;
  updatePersonalization: (next: PersonalizationPreferences) => void;
  handleLogSimulationRun: (experimentId: string, grade: string) => void;
  handleFinishCompetitionMatch: (
    record: CompetitionMatchRecord,
    questions: MCQQuestion[],
    records: MCQAnswerRecord[]
  ) => void;
  buildBackupJson: () => string;
  restoreBackupFromJsonText: (rawText: string) => boolean;
  handleExportBackup: () => void;
  handleImportBackup: (file: File) => Promise<void>;
  handleResetProgress: () => void;
}

const StudyProgressContext = createContext<StudyProgressContextValue | null>(null);

export const StudyProgressProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { firebaseUser } = useAuth();
  const {
    isAutostart,
    effectiveOffline,
    isProfileModalOpen,
    setIsProfileModalOpen,
    setIsQuizModalOpen,
    setActiveTab,
    setSelectedNoteIdForView,
    setBannerMessage,
  } = useNavigation();

  const [profile, setProfile] = useState<UserProfile | null>(() => {
    const saved = readStorage<UserProfile | null>(STORAGE_KEYS.profile, null);
    if (saved) return saved;
    return isAutostart ? createDefaultProfile() : null;
  });
  const [attempts, setAttempts] = useState<ExamAttempt[]>(() =>
    readStorage<ExamAttempt[]>(STORAGE_KEYS.attempts, INITIAL_ATTEMPTS)
  );
  const [mistakes, setMistakes] = useState<MistakeEntry[]>(() =>
    readStorage<MistakeEntry[]>(STORAGE_KEYS.mistakes, INITIAL_MISTAKES)
  );
  const [notes, setNotes] = useState<StudyNote[]>(() => {
    const saved = readStorage<StudyNote[]>(STORAGE_KEYS.notes, INITIAL_NOTES);
    const seedIds = [
      'note-phys-dimensions',
      'note-chem-atomic-shs1',
      'note-chem-atomic-shs2',
      'note-chem-atomic-shs3',
    ];
    const missingSeeds = INITIAL_NOTES.filter(
      (seed) => seedIds.includes(seed.id) && !saved.some((n) => n.id === seed.id)
    );
    return missingSeeds.length > 0 ? [...missingSeeds, ...saved] : saved;
  });
  const [syllabusNotes, setSyllabusNotes] = useState<StudyNote[]>(
    () => getCachedSyllabusNotes() ?? []
  );
  const [streak, setStreak] = useState<StreakData>(() =>
    readStorage<StreakData>(STORAGE_KEYS.streak, INITIAL_STREAK)
  );
  const [flashcardProgress, setFlashcardProgress] = useState<Record<string, FlashcardProgress>>(() =>
    readStorage<Record<string, FlashcardProgress>>(STORAGE_KEYS.flashcards, {})
  );
  const [reminderSettings, setReminderSettings] = useState<StudyReminderSettings>(() => ({
    ...DEFAULT_REMINDER_SETTINGS,
    ...readStorage<Partial<StudyReminderSettings>>(STORAGE_KEYS.reminderSettings, {}),
  }));
  const [notifications, setNotifications] = useState<StudyNotificationItem[]>(() =>
    readStorage<StudyNotificationItem[]>(STORAGE_KEYS.notifications, [])
  );
  const [activeReminderBanner, setActiveReminderBanner] =
    useState<StudyNotificationItem | null>(null);
  const [timetable, setTimetable] = useState<StudyTimetableSchedule>(() =>
    sanitizeTimetableSchedule(readStorage<unknown>(STORAGE_KEYS.timetable, null))
  );
  const [completedTimetableKeys, setCompletedTimetableKeys] = useState<Record<string, boolean>>(() =>
    readStorage<Record<string, boolean>>(STORAGE_KEYS.completedTimetableKeys, {})
  );
  const [completedVideoIds, setCompletedVideoIds] = useState<Record<string, boolean>>(() =>
    readStorage<Record<string, boolean>>(STORAGE_KEYS.completedVideoIds, {})
  );
  const [noteDrillMastery, setNoteDrillMastery] = useState<Record<string, NoteDrillMasteryRecord>>(() =>
    readStorage<Record<string, NoteDrillMasteryRecord>>(NOTE_DRILLS_STORAGE_KEY, {})
  );
  const [personalization, setPersonalization] = useState<PersonalizationPreferences>(() =>
    sanitizePersonalization(readStorage<unknown>(PERSONALIZATION_STORAGE_KEY, DEFAULT_PERSONALIZATION))
  );
  const [competitionMatches, setCompetitionMatches] = useState<CompetitionMatchRecord[]>(() =>
    readStorage<CompetitionMatchRecord[]>(COMPETITIONS_STORAGE_KEY, [])
  );

  const [activeQuizConfig, setActiveQuizConfig] = useState<QuizConfig | null>(null);
  const [activeMCQSession, setActiveMCQSession] = useState<MCQQuestion[]>([]);
  const [activeTheorySession, setActiveTheorySession] = useState<TheoryQuestion[]>([]);

  // Dynamically load the 165 built-in GES syllabus notes after initial dashboard mount
  useEffect(() => {
    let cancelled = false;
    void loadAllSyllabusNotes()
      .then((loaded) => {
        if (!cancelled) setSyllabusNotes(loaded);
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, []);

  // Persist workspace slices to localStorage
  useEffect(() => {
    if (profile) {
      window.localStorage.setItem(STORAGE_KEYS.profile, JSON.stringify(profile));
    }
  }, [profile]);
  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEYS.attempts, JSON.stringify(attempts));
  }, [attempts]);
  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEYS.mistakes, JSON.stringify(mistakes));
  }, [mistakes]);
  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEYS.notes, JSON.stringify(notes));
  }, [notes]);
  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEYS.streak, JSON.stringify(streak));
  }, [streak]);
  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEYS.flashcards, JSON.stringify(flashcardProgress));
  }, [flashcardProgress]);
  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEYS.reminderSettings, JSON.stringify(reminderSettings));
  }, [reminderSettings]);
  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEYS.notifications, JSON.stringify(notifications.slice(0, 20)));
  }, [notifications]);
  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEYS.timetable, JSON.stringify(timetable));
  }, [timetable]);
  useEffect(() => {
    window.localStorage.setItem(
      STORAGE_KEYS.completedTimetableKeys,
      JSON.stringify(completedTimetableKeys)
    );
  }, [completedTimetableKeys]);
  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEYS.completedVideoIds, JSON.stringify(completedVideoIds));
  }, [completedVideoIds]);
  useEffect(() => {
    window.localStorage.setItem(PERSONALIZATION_STORAGE_KEY, JSON.stringify(personalization));
  }, [personalization]);
  useEffect(() => {
    window.localStorage.setItem(
      COMPETITIONS_STORAGE_KEY,
      JSON.stringify(competitionMatches.slice(0, 50))
    );
  }, [competitionMatches]);

  const effectiveProfile = profile ?? createDefaultProfile();

  const mergedNotes = useMemo<StudyNote[]>(() => {
    const personalIds = new Set(notes.map((n) => n.id));
    const builtIns = syllabusNotes.filter((s) => !personalIds.has(s.id));
    return [...notes, ...builtIns];
  }, [notes, syllabusNotes]);

  const todayLearningPlan = useMemo(
    () =>
      getTodayLearningPlan(
        timetable,
        mergedNotes,
        effectiveProfile,
        new Date(),
        completedTimetableKeys
      ),
    [timetable, mergedNotes, effectiveProfile, completedTimetableKeys]
  );

  const todayScheduleSummary = useMemo(
    () => todayLearningPlan.items.map((item) => item.subjectName).join(' · '),
    [todayLearningPlan]
  );

  const overallAnalytics = useMemo(() => computeOverallAnalytics(attempts), [attempts]);
  const masteryStats = useMemo(
    () =>
      computeSubjectMastery(
        attempts,
        SUBJECT_LIST.map((s) => s.id),
        SYLLABUS_TOPICS
      ),
    [attempts]
  );
  const achievements = useMemo(
    () => evaluateAchievements(attempts, mistakes, notes.length, streak),
    [attempts, mistakes, notes.length, streak]
  );

  const localWorkspaceRef = useRef({
    effectiveProfile,
    streak,
    notes,
    attempts,
    mistakes,
    flashcardProgress,
    reminderSettings,
    personalization,
  });

  useEffect(() => {
    localWorkspaceRef.current = {
      effectiveProfile,
      streak,
      notes,
      attempts,
      mistakes,
      flashcardProgress,
      reminderSettings,
      personalization,
    };
  }, [
    effectiveProfile,
    streak,
    notes,
    attempts,
    mistakes,
    flashcardProgress,
    reminderSettings,
    personalization,
  ]);

  // Firestore single-source-of-truth workspace synchronization
  useEffect(() => {
    if (!firebaseUser) return;
    let unsubWorkspace: (() => void) | null = null;
    let cancelled = false;

    const snapshot = localWorkspaceRef.current;
    void ensureUserAccountInFirestore(
      firebaseUser,
      snapshot.effectiveProfile,
      snapshot.streak,
      snapshot.notes,
      snapshot.attempts,
      snapshot.mistakes,
      snapshot.flashcardProgress,
      snapshot.reminderSettings,
      snapshot.personalization
    )
      .then(() => {
        if (cancelled) return;
        unsubWorkspace = subscribeUserWorkspace(firebaseUser.uid, {
          onAccount: (cloudProfile, cloudStreak, cloudReminders, cloudPersonalization) => {
            setProfile(cloudProfile);
            setStreak(cloudStreak);
            if (cloudReminders) {
              setReminderSettings((prev) => ({
                ...prev,
                ...cloudReminders,
              }));
            }
            if (cloudPersonalization) {
              setPersonalization(sanitizePersonalization(cloudPersonalization));
            }
          },
          onNotes: (cloudNotes) => {
            setNotes(cloudNotes);
          },
          onAttempts: (cloudAttempts) => {
            if (cloudAttempts.length > 0) setAttempts(cloudAttempts);
          },
          onMistakes: (cloudMistakes) => {
            setMistakes(cloudMistakes);
          },
          onFlashcards: (cloudCards) => {
            setFlashcardProgress(cloudCards);
          },
          onCompetitions: (cloudMatches) => {
            if (cloudMatches.length === 0) return;
            setCompetitionMatches((prev) => {
              const seen = new Set(cloudMatches.map((m) => m.id));
              const localOnly = prev.filter((m) => !seen.has(m.id));
              return [...cloudMatches, ...localOnly]
                .sort((a, b) => b.timestamp.localeCompare(a.timestamp))
                .slice(0, 50);
            });
          },
        });
      })
      .catch((err) => {
        const msg = err instanceof Error ? err.message : 'Unable to connect cloud sync.';
        setBannerMessage(
          /Quota exceeded/i.test(msg)
            ? 'Cloud database quota reached; continuing safely with local storage.'
            : 'Cloud sync paused — your progress remains saved locally.'
        );
      });

    return () => {
      cancelled = true;
      unsubWorkspace?.();
    };
  }, [firebaseUser, setBannerMessage]);

  const deliverStudyNotification = useCallback(
    (
      item: StudyNotificationItem,
      options?: { markNotifiedToday?: boolean; browserPush?: boolean }
    ) => {
      setNotifications((prev) => {
        const deduped = prev.filter((n) => n.id !== item.id);
        return [item, ...deduped].slice(0, 20);
      });
      setActiveReminderBanner(item);
      playGentleReminderChime();

      if (
        options?.browserPush &&
        typeof window !== 'undefined' &&
        'Notification' in window &&
        Notification.permission === 'granted'
      ) {
        try {
          new Notification(item.title, {
            body: item.message,
            tag: 'wassce-daily-streak',
          });
        } catch {
          // Ignore browser notification errors
        }
      }

      if (options?.markNotifiedToday) {
        const updatedSettings: StudyReminderSettings = {
          ...reminderSettings,
          lastNotifiedDate: item.dateKey,
          snoozedUntilIso: null,
        };
        setReminderSettings(updatedSettings);
        if (firebaseUser && !effectiveOffline) {
          void saveUserAccountToFirestore(
            firebaseUser.uid,
            firebaseUser.email || '',
            effectiveProfile,
            streak,
            updatedSettings,
            personalization
          ).catch(() => {});
        }
      }
    },
    [effectiveOffline, effectiveProfile, firebaseUser, personalization, reminderSettings, streak]
  );

  useEffect(() => {
    if (isProfileModalOpen) return;

    const runEvaluation = () => {
      const result = evaluateDailyStudyReminder({
        profile: effectiveProfile,
        streak,
        settings: reminderSettings,
        mistakes,
        masteryStats,
        timetableSchedule: timetable,
        notes: mergedNotes,
        now: new Date(),
      });
      if (result.shouldTrigger && result.notification) {
        deliverStudyNotification(result.notification, {
          markNotifiedToday: true,
          browserPush: reminderSettings.browserNotificationsEnabled,
        });
      }
    };

    runEvaluation();

    const now = new Date();
    const msUntilCutoff = computeMsUntilReminder(now, reminderSettings.reminderTime);
    const cutoffTimer =
      msUntilCutoff > 0 ? window.setTimeout(runEvaluation, msUntilCutoff + 250) : null;

    const snoozeMs = reminderSettings.snoozedUntilIso
      ? Math.max(0, new Date(reminderSettings.snoozedUntilIso).getTime() - now.getTime())
      : 0;
    const snoozeTimer = snoozeMs > 0 ? window.setTimeout(runEvaluation, snoozeMs + 250) : null;
    const pollInterval = window.setInterval(runEvaluation, 60_000);

    return () => {
      if (cutoffTimer !== null) window.clearTimeout(cutoffTimer);
      if (snoozeTimer !== null) window.clearTimeout(snoozeTimer);
      window.clearInterval(pollInterval);
    };
  }, [
    isProfileModalOpen,
    effectiveProfile,
    streak,
    reminderSettings,
    mistakes,
    masteryStats,
    timetable,
    mergedNotes,
    deliverStudyNotification,
  ]);

  const handleUpdateReminderSettings = useCallback(
    (patch: Partial<StudyReminderSettings>) => {
      setReminderSettings((prev) => {
        const next: StudyReminderSettings = {
          ...prev,
          ...patch,
          reminderTime:
            patch.reminderTime !== undefined
              ? sanitizeReminderTime(patch.reminderTime)
              : prev.reminderTime,
        };
        if (firebaseUser && !effectiveOffline) {
          void saveUserAccountToFirestore(
            firebaseUser.uid,
            firebaseUser.email || '',
            effectiveProfile,
            streak,
            next,
            personalization
          ).catch(() => {});
        }
        return next;
      });
    },
    [effectiveOffline, effectiveProfile, firebaseUser, personalization, streak]
  );

  const handleRequestBrowserNotifications = useCallback(async () => {
    if (typeof window === 'undefined' || !('Notification' in window)) {
      setBannerMessage('Browser desktop alerts are unavailable here — in-app reminders remain active.');
      return;
    }
    try {
      const perm = await Notification.requestPermission();
      if (perm === 'granted') {
        handleUpdateReminderSettings({ browserNotificationsEnabled: true });
        setBannerMessage('Browser study reminder alerts enabled.');
      } else {
        handleUpdateReminderSettings({ browserNotificationsEnabled: false });
        setBannerMessage('Browser notifications were not granted — in-app streak reminders remain active.');
      }
    } catch {
      setBannerMessage('Unable to request browser notification permission.');
    }
  }, [handleUpdateReminderSettings, setBannerMessage]);

  const handlePreviewReminder = useCallback(() => {
    const preview = evaluateDailyStudyReminder({
      profile: effectiveProfile,
      streak,
      settings: reminderSettings,
      mistakes,
      masteryStats,
      timetableSchedule: timetable,
      notes: mergedNotes,
      now: new Date(),
      forcePreview: true,
    });
    if (preview.notification) {
      deliverStudyNotification(preview.notification, {
        markNotifiedToday: false,
        browserPush: reminderSettings.browserNotificationsEnabled,
      });
    }
  }, [
    deliverStudyNotification,
    effectiveProfile,
    masteryStats,
    mergedNotes,
    mistakes,
    reminderSettings,
    streak,
    timetable,
  ]);

  const handleSendTodayTimetableAlert = useCallback(() => {
    const item = buildTodayTimetableNotification({
      profile: effectiveProfile,
      timetableSchedule: timetable,
      notes: mergedNotes,
      completedKeys: completedTimetableKeys,
      now: new Date(),
    });
    deliverStudyNotification(item, {
      markNotifiedToday: false,
      browserPush: reminderSettings.browserNotificationsEnabled,
    });
  }, [
    completedTimetableKeys,
    deliverStudyNotification,
    effectiveProfile,
    mergedNotes,
    reminderSettings.browserNotificationsEnabled,
    timetable,
  ]);

  const handleMarkNotificationRead = useCallback((id: string) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
    setActiveReminderBanner((prev) => (prev?.id === id ? null : prev));
  }, []);

  const handleMarkAllNotificationsRead = useCallback(() => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    setActiveReminderBanner(null);
  }, []);

  const handleSnoozeReminder = useCallback(
    (minutes: number) => {
      const untilIso = new Date(Date.now() + minutes * 60 * 1000).toISOString();
      setActiveReminderBanner(null);
      handleUpdateReminderSettings({
        lastNotifiedDate: '',
        snoozedUntilIso: untilIso,
      });
      setBannerMessage(`Study reminder snoozed for ${minutes} minutes.`);
    },
    [handleUpdateReminderSettings, setBannerMessage]
  );

  const saveProfile = useCallback(
    (next: UserProfile) => {
      setProfile(next);
      if (firebaseUser && !effectiveOffline) {
        void saveUserAccountToFirestore(
          firebaseUser.uid,
          firebaseUser.email || '',
          next,
          streak,
          reminderSettings,
          personalization
        ).catch(() => {});
      }
      setIsProfileModalOpen(false);
      setBannerMessage(`Profile saved for ${next.preferredName} (${next.gradeLevel}).`);
    },
    [
      effectiveOffline,
      firebaseUser,
      personalization,
      reminderSettings,
      setBannerMessage,
      setIsProfileModalOpen,
      streak,
    ]
  );

  const handleStartExam = useCallback(
    async (config: QuizConfig) => {
      setIsQuizModalOpen(false);
      setActiveQuizConfig(config);
      if (config.paperType === 'mcq') {
        const pool = await loadMcqsForSubject(config.subject);
        setActiveMCQSession(buildMCQSession(pool, config));
        setActiveTheorySession([]);
      } else {
        const tpool = await loadTheoryForSubject(config.subject);
        setActiveTheorySession(buildTheorySession(tpool, config));
        setActiveMCQSession([]);
      }
      setActiveTab('exam');
    },
    [setActiveTab, setIsQuizModalOpen]
  );

  const handleCompleteMCQ = useCallback(
    (attempt: ExamAttempt, questions: MCQQuestion[], records: MCQAnswerRecord[]) => {
      const now = new Date();
      const nowIso = now.toISOString();
      const todayStr = formatLocalDateKey(now);
      const nextMistakes = updateMistakeBank(mistakes, questions, records, nowIso);
      const nextStreak = updateDailyStreak(
        streak,
        todayStr,
        questions.length,
        Math.max(1, Math.round(attempt.durationSeconds / 60))
      );
      setAttempts((prev) => [...prev, attempt]);
      setMistakes(nextMistakes);
      setStreak(nextStreak);

      if (nextStreak.questionsSolvedToday >= effectiveProfile.dailyQuestionGoal) {
        setActiveReminderBanner(null);
        setNotifications((prev) =>
          prev.map((n) => (n.dateKey === todayStr ? { ...n, read: true } : n))
        );
      }

      if (firebaseUser && !effectiveOffline) {
        const uid = firebaseUser.uid;
        void recordExamAttemptInFirestore(uid, attempt).catch(() => {});
        void saveUserAccountToFirestore(
          uid,
          firebaseUser.email || '',
          effectiveProfile,
          nextStreak,
          reminderSettings,
          personalization
        ).catch(() => {});
        for (const m of nextMistakes) {
          const prevM = mistakes.find((item) => item.questionId === m.questionId);
          if (!prevM || prevM.wrongCount !== m.wrongCount || prevM.mastered !== m.mastered) {
            void syncMistakeToFirestore(uid, m).catch(() => {});
          }
        }
      }
    },
    [effectiveOffline, effectiveProfile, firebaseUser, mistakes, personalization, reminderSettings, streak]
  );

  const handleCompleteTheory = useCallback(
    (attempt: ExamAttempt) => {
      const todayStr = formatLocalDateKey(new Date());
      const nextStreak = updateDailyStreak(
        streak,
        todayStr,
        attempt.totalQuestions,
        Math.max(1, Math.round(attempt.durationSeconds / 60))
      );
      setAttempts((prev) => [...prev, attempt]);
      setStreak(nextStreak);

      if (nextStreak.questionsSolvedToday >= effectiveProfile.dailyQuestionGoal) {
        setActiveReminderBanner(null);
        setNotifications((prev) =>
          prev.map((n) => (n.dateKey === todayStr ? { ...n, read: true } : n))
        );
      }

      if (firebaseUser && !effectiveOffline) {
        const uid = firebaseUser.uid;
        void recordExamAttemptInFirestore(uid, attempt).catch(() => {});
        void saveUserAccountToFirestore(
          uid,
          firebaseUser.email || '',
          effectiveProfile,
          nextStreak,
          reminderSettings,
          personalization
        ).catch(() => {});
      }
    },
    [effectiveOffline, effectiveProfile, firebaseUser, personalization, reminderSettings, streak]
  );

  const handleCompleteNoteDrill = useCallback(
    async (note: StudyNote, summary: NoteDrillAttemptSummary) => {
      const now = new Date();
      const nowIso = now.toISOString();
      const todayStr = formatLocalDateKey(now);

      setNoteDrillMastery((prev) => {
        const next = {
          ...prev,
          [note.id]: summary.updatedMastery,
        };
        try {
          window.localStorage.setItem(NOTE_DRILLS_STORAGE_KEY, JSON.stringify(next));
        } catch {
          // Ignore storage quota issues
        }
        return next;
      });

      const nextStreak = updateDailyStreak(streak, todayStr, summary.totalQuestions, 3);
      setStreak(nextStreak);

      if (nextStreak.questionsSolvedToday >= effectiveProfile.dailyQuestionGoal) {
        setActiveReminderBanner(null);
        setNotifications((prev) =>
          prev.map((n) => (n.dateKey === todayStr ? { ...n, read: true } : n))
        );
      }

      if (summary.missedMatchedMcqIds.length > 0) {
        const subjectMcqs = await loadMcqsForSubject(note.subject);
        const missedMcqs = subjectMcqs.filter((q) => summary.missedMatchedMcqIds.includes(q.id));
        if (missedMcqs.length > 0) {
          const wrongRecords: MCQAnswerRecord[] = missedMcqs.map((q) => ({
            questionId: q.id,
            selectedIndex: (q.correctIndex + 1) % 4,
            correctIndex: q.correctIndex,
            isCorrect: false,
          }));
          const nextMistakes = updateMistakeBank(mistakes, missedMcqs, wrongRecords, nowIso);
          setMistakes(nextMistakes);
          if (firebaseUser && !effectiveOffline) {
            for (const m of nextMistakes) {
              if (summary.missedMatchedMcqIds.includes(m.questionId)) {
                void syncMistakeToFirestore(firebaseUser.uid, m).catch(() => {});
              }
            }
          }
        }
      }

      setBannerMessage(
        `Drill complete on "${note.title}": ${summary.correctCount}/${summary.totalQuestions} (${summary.accuracyPct}% · ${summary.updatedMastery.masteryLevel}).`
      );
    },
    [effectiveOffline, effectiveProfile.dailyQuestionGoal, firebaseUser, mistakes, setBannerMessage, streak]
  );

  const handleCreateNoteForTopic = useCallback(
    (topic: SyllabusTopic) => {
      const now = new Date().toISOString();
      const newNote: StudyNote = {
        id: `note-${Date.now()}`,
        title: `${topic.unitNumber}: ${topic.title}`,
        subject: topic.subject,
        grade: topic.grade,
        tags: [topic.grade, 'Syllabus'],
        createdAt: now,
        updatedAt: now,
        content: `# ${topic.title}\n\n${topic.summary}\n\n## Learning Objectives\n${topic.objectives
          .map((o) => `- ${o}`)
          .join('\n')}\n\n## Key Formulas\n${topic.keyFormulas.join('\n\n')}`,
      };
      setNotes((prev) => [newNote, ...prev]);
      if (firebaseUser && !effectiveOffline) {
        void syncStudyNoteToFirestore(firebaseUser.uid, newNote).catch(() => {});
      }
      setActiveTab('notes');
      setBannerMessage(`Created study note for ${topic.title}.`);
    },
    [effectiveOffline, firebaseUser, setActiveTab, setBannerMessage]
  );

  const handleSaveLessonAsNote = useCallback(
    (note: StudyNote) => {
      setNotes((prev) => [note, ...prev]);
      if (firebaseUser && !effectiveOffline) {
        void syncStudyNoteToFirestore(firebaseUser.uid, note).catch(() => {});
      }
      setBannerMessage(`Saved AI lesson note: ${note.title}.`);
    },
    [effectiveOffline, firebaseUser, setBannerMessage]
  );

  const handleCreatePersonalNote = useCallback(
    (note: StudyNote) => {
      setNotes((prev) => [note, ...prev]);
      setSelectedNoteIdForView(note.id);
      if (firebaseUser && !effectiveOffline) {
        void syncStudyNoteToFirestore(firebaseUser.uid, note).catch(() => {});
      }
    },
    [effectiveOffline, firebaseUser, setSelectedNoteIdForView]
  );

  const handleUpdateAnyNote = useCallback(
    (updated: StudyNote) => {
      const isPersonal = notes.some((n) => n.id === updated.id);
      if (isPersonal) {
        const cleanUpdated = { ...updated, isBuiltIn: false };
        setNotes((prev) => prev.map((n) => (n.id === cleanUpdated.id ? cleanUpdated : n)));
        if (firebaseUser && !effectiveOffline) {
          void syncStudyNoteToFirestore(firebaseUser.uid, cleanUpdated).catch(() => {});
        }
        return;
      }
      const forked: StudyNote = {
        ...updated,
        id: `note-copy-${Date.now()}`,
        isBuiltIn: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      setNotes((prev) => [forked, ...prev]);
      setSelectedNoteIdForView(forked.id);
      if (firebaseUser && !effectiveOffline) {
        void syncStudyNoteToFirestore(firebaseUser.uid, forked).catch(() => {});
      }
      setBannerMessage('Saved your edits as a personal copy in Study Notes.');
    },
    [effectiveOffline, firebaseUser, notes, setBannerMessage, setSelectedNoteIdForView]
  );

  const handleDeletePersonalNote = useCallback(
    (id: string) => {
      setNotes((prev) => prev.filter((n) => n.id !== id));
      if (firebaseUser && !effectiveOffline) {
        void deleteStudyNoteFromFirestore(firebaseUser.uid, id).catch(() => {});
      }
    },
    [effectiveOffline, firebaseUser]
  );

  const handleImportNoteFromDrive = useCallback(
    (importedNote: StudyNote) => {
      setNotes((prev) => [importedNote, ...prev]);
      setSelectedNoteIdForView(importedNote.id);
      setActiveTab('notes');
      if (firebaseUser && !effectiveOffline) {
        void syncStudyNoteToFirestore(firebaseUser.uid, importedNote).catch(() => {});
      }
      setBannerMessage(`Imported "${importedNote.title}" from Google Drive.`);
    },
    [effectiveOffline, firebaseUser, setActiveTab, setBannerMessage, setSelectedNoteIdForView]
  );

  const handlePracticeMistakes = useCallback(
    async (subjectFilter?: SubjectId) => {
      const pending = mistakes.filter(
        (m) => !m.mastered && (!subjectFilter || m.subject === subjectFilter)
      );
      if (pending.length === 0) return;

      const targetSub = subjectFilter ?? pending[0].subject;
      const subjectMcqs = await loadMcqsForSubject(targetSub);
      const pool = pending
        .map((m) => subjectMcqs.find((q) => q.id === m.questionId))
        .filter((q): q is MCQQuestion => Boolean(q))
        .filter((q) => q.subject === targetSub);

      if (pool.length === 0) return;

      setActiveQuizConfig({
        subject: targetSub,
        gradeFilter: 'ALL',
        topicIds: [],
        mode: 'study',
        paperType: 'mcq',
        questionCount: pool.length,
      });
      setActiveMCQSession(pool);
      setActiveTheorySession([]);
      setActiveTab('exam');
    },
    [mistakes, setActiveTab]
  );

  const handleToggleMistakeMastered = useCallback(
    (qId: string) => {
      const target = mistakes.find((m) => m.questionId === qId);
      if (!target) return;
      const toggled = { ...target, mastered: !target.mastered };
      setMistakes((prev) => prev.map((m) => (m.questionId === qId ? toggled : m)));
      if (firebaseUser && !effectiveOffline) {
        void syncMistakeToFirestore(firebaseUser.uid, toggled).catch(() => {});
      }
    },
    [effectiveOffline, firebaseUser, mistakes]
  );

  const handleUpdateTimetableSlot = useCallback(
    (dayId: TimetableDayId, slotId: string, subjectId: SubjectId) => {
      setTimetable((prev) => updateTimetableSlot(prev, dayId, slotId, subjectId));
    },
    []
  );

  const handleResetSchedule = useCallback(() => {
    setTimetable(DEFAULT_TIMETABLE_SCHEDULE);
    setBannerMessage('Weekly timetable reset to default WASSCE schedule.');
  }, [setBannerMessage]);

  const handleToggleTimetableBlock = useCallback((completionKey: string) => {
    setCompletedTimetableKeys((prev) => ({
      ...prev,
      [completionKey]: !prev[completionKey],
    }));
  }, []);

  const handleToggleVideoCompleted = useCallback((noteId: string) => {
    setCompletedVideoIds((prev) => ({
      ...prev,
      [noteId]: !prev[noteId],
    }));
  }, []);

  const handleRateFlashcard = useCallback(
    (cardId: string, rating: FlashcardRating) => {
      const nowIso = new Date().toISOString();
      const nextEntry = reviewFlashcardSM2(flashcardProgress[cardId], cardId, rating, nowIso);
      setFlashcardProgress((prev) => ({
        ...prev,
        [cardId]: nextEntry,
      }));
      if (firebaseUser && !effectiveOffline) {
        void syncFlashcardToFirestore(firebaseUser.uid, nextEntry).catch(() => {});
      }
    },
    [effectiveOffline, firebaseUser, flashcardProgress]
  );

  const handleResetFlashcardDeck = useCallback(
    (cardIds: string[]) => {
      setFlashcardProgress((prev) => {
        const next = { ...prev };
        for (const id of cardIds) {
          delete next[id];
        }
        return next;
      });
      setBannerMessage(`Reset spaced-repetition queue for ${cardIds.length} flashcards.`);
    },
    [setBannerMessage]
  );

  const updatePersonalization = useCallback(
    (next: PersonalizationPreferences) => {
      const clean = sanitizePersonalization(next);
      setPersonalization(clean);
      if (firebaseUser && !effectiveOffline) {
        void saveUserAccountToFirestore(
          firebaseUser.uid,
          firebaseUser.email || '',
          effectiveProfile,
          streak,
          reminderSettings,
          clean
        ).catch(() => {});
      }
    },
    [effectiveOffline, effectiveProfile, firebaseUser, reminderSettings, streak]
  );

  const handleLogSimulationRun = useCallback(
    (experimentId: string, grade: string) => {
      if (!firebaseUser || effectiveOffline) return;
      void recordSimulationRunInFirestore(firebaseUser.uid, experimentId, grade).catch(() => {});
    },
    [effectiveOffline, firebaseUser]
  );

  const handleFinishCompetitionMatch = useCallback(
    (record: CompetitionMatchRecord, questions: MCQQuestion[], records: MCQAnswerRecord[]) => {
      const now = new Date();
      const nowIso = now.toISOString();
      const todayStr = formatLocalDateKey(now);

      setCompetitionMatches((prev) => [record, ...prev].slice(0, 50));
      const nextMistakes = updateMistakeBank(mistakes, questions, records, nowIso);
      const nextStreak = updateDailyStreak(
        streak,
        todayStr,
        questions.length,
        Math.max(1, Math.round(record.durationSeconds / 60))
      );
      setMistakes(nextMistakes);
      setStreak(nextStreak);

      setBannerMessage(
        record.won
          ? `Arena Victory! You defeated ${record.aiOpponentName} (${record.studentScore} vs ${record.aiScore}).`
          : `Match finished vs ${record.aiOpponentName} (${record.studentScore} vs ${record.aiScore}). Review missed items below!`
      );

      if (firebaseUser && !effectiveOffline) {
        const uid = firebaseUser.uid;
        void saveUserAccountToFirestore(
          uid,
          firebaseUser.email || '',
          effectiveProfile,
          nextStreak,
          reminderSettings,
          personalization
        ).catch(() => {});
        for (const m of nextMistakes) {
          const prevM = mistakes.find((item) => item.questionId === m.questionId);
          if (!prevM || prevM.wrongCount !== m.wrongCount || prevM.mastered !== m.mastered) {
            void syncMistakeToFirestore(uid, m).catch(() => {});
          }
        }
        void recordCompetitionMatchInFirestore(uid, record).catch(() => {});
      }
    },
    [
      effectiveOffline,
      effectiveProfile,
      firebaseUser,
      mistakes,
      personalization,
      reminderSettings,
      setBannerMessage,
      streak,
    ]
  );

  const buildBackupJson = useCallback((): string => {
    const payload: AppBackupPayload = {
      version: 1,
      exportedAt: new Date().toISOString(),
      profile: effectiveProfile,
      attempts,
      mistakes,
      notes,
      streak,
      reminderSettings,
      timetable,
      completedTimetableKeys,
    };
    return JSON.stringify(payload, null, 2);
  }, [
    attempts,
    completedTimetableKeys,
    effectiveProfile,
    mistakes,
    notes,
    reminderSettings,
    streak,
    timetable,
  ]);

  const applyImportedBackupObject = useCallback(
    (parsed: unknown): boolean => {
      if (!validateBackupPayload(parsed)) {
        return false;
      }
      setProfile(parsed.profile);
      setAttempts(parsed.attempts);
      setMistakes(parsed.mistakes);
      setNotes(parsed.notes);
      if (parsed.streak) setStreak(parsed.streak);
      if (parsed.timetable) setTimetable(sanitizeTimetableSchedule(parsed.timetable));
      if (parsed.completedTimetableKeys) setCompletedTimetableKeys(parsed.completedTimetableKeys);
      if (parsed.reminderSettings) {
        setReminderSettings({
          ...DEFAULT_REMINDER_SETTINGS,
          ...parsed.reminderSettings,
          reminderTime: sanitizeReminderTime(parsed.reminderSettings.reminderTime),
        });
      }
      if (firebaseUser && !effectiveOffline) {
        const uid = firebaseUser.uid;
        void saveUserAccountToFirestore(
          uid,
          firebaseUser.email || '',
          parsed.profile,
          parsed.streak ?? streak,
          parsed.reminderSettings ?? reminderSettings,
          personalization
        ).catch(() => {});
        for (const n of parsed.notes.slice(0, 30)) {
          void syncStudyNoteToFirestore(uid, n).catch(() => {});
        }
        for (const a of parsed.attempts.slice(0, 40)) {
          void recordExamAttemptInFirestore(uid, a).catch(() => {});
        }
        for (const m of parsed.mistakes.slice(0, 80)) {
          void syncMistakeToFirestore(uid, m).catch(() => {});
        }
      }
      return true;
    },
    [effectiveOffline, firebaseUser, personalization, reminderSettings, streak]
  );

  const restoreBackupFromJsonText = useCallback(
    (rawText: string): boolean => {
      try {
        const parsed = JSON.parse(rawText) as unknown;
        const ok = applyImportedBackupObject(parsed);
        if (ok) {
          setBannerMessage('Backup restored from Google Drive.');
        }
        return ok;
      } catch {
        return false;
      }
    },
    [applyImportedBackupObject, setBannerMessage]
  );

  const handleExportBackup = useCallback(() => {
    const blob = new Blob([buildBackupJson()], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `wassce-masterclass-backup-${formatLocalDateKey(new Date())}.json`;
    link.click();
    URL.revokeObjectURL(url);
    setBannerMessage('Progress backup exported as JSON.');
  }, [buildBackupJson, setBannerMessage]);

  const handleImportBackup = useCallback(
    async (file: File) => {
      try {
        const text = await file.text();
        const parsed = JSON.parse(text) as unknown;
        if (!applyImportedBackupObject(parsed)) {
          setBannerMessage('Invalid backup file format.');
          return;
        }
        setIsProfileModalOpen(false);
        setBannerMessage('Backup restored successfully.');
      } catch {
        setBannerMessage('Could not parse JSON backup file.');
      }
    },
    [applyImportedBackupObject, setBannerMessage, setIsProfileModalOpen]
  );

  const handleResetProgress = useCallback(() => {
    setAttempts([]);
    setMistakes([]);
    setStreak({
      currentStreak: 0,
      longestStreak: 0,
      lastActiveDate: formatLocalDateKey(new Date()),
      questionsSolvedToday: 0,
      totalStudyMinutes: 0,
    });
    setBannerMessage('Exam history and mistake bank cleared.');
  }, [setBannerMessage]);

  const value: StudyProgressContextValue = {
    profile,
    effectiveProfile,
    saveProfile,
    attempts,
    mistakes,
    notes,
    mergedNotes,
    streak,
    flashcardProgress,
    reminderSettings,
    notifications,
    activeReminderBanner,
    timetable,
    completedTimetableKeys,
    completedVideoIds,
    noteDrillMastery,
    personalization,
    competitionMatches,
    overallAnalytics,
    masteryStats,
    achievements,
    todayLearningPlan,
    todayScheduleSummary,
    activeQuizConfig,
    activeMCQSession,
    activeTheorySession,
    deliverStudyNotification,
    handleUpdateReminderSettings,
    handleRequestBrowserNotifications,
    handlePreviewReminder,
    handleSendTodayTimetableAlert,
    handleMarkNotificationRead,
    handleMarkAllNotificationsRead,
    handleSnoozeReminder,
    handleStartExam,
    handleCompleteMCQ,
    handleCompleteTheory,
    handleCompleteNoteDrill,
    handleCreateNoteForTopic,
    handleSaveLessonAsNote,
    handleCreatePersonalNote,
    handleUpdateAnyNote,
    handleDeletePersonalNote,
    handleImportNoteFromDrive,
    handlePracticeMistakes,
    handleToggleMistakeMastered,
    handleUpdateTimetableSlot,
    handleResetSchedule,
    handleToggleTimetableBlock,
    handleToggleVideoCompleted,
    handleRateFlashcard,
    handleResetFlashcardDeck,
    updatePersonalization,
    handleLogSimulationRun,
    handleFinishCompetitionMatch,
    buildBackupJson,
    restoreBackupFromJsonText,
    handleExportBackup,
    handleImportBackup,
    handleResetProgress,
  };

  return <StudyProgressContext.Provider value={value}>{children}</StudyProgressContext.Provider>;
};

export function useStudyProgress(): StudyProgressContextValue {
  const ctx = useContext(StudyProgressContext);
  if (!ctx) throw new Error('useStudyProgress must be used inside StudyProgressProvider');
  return ctx;
}
