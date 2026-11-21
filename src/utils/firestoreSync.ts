import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  onSnapshot,
  query,
  serverTimestamp,
  setDoc,
  Timestamp,
  updateDoc,
  where,
  type Unsubscribe,
} from 'firebase/firestore';
import { signInWithPopup, signOut, type User } from 'firebase/auth';
import {
  auth,
  db,
  googleProvider,
  handleFirestoreError,
  isTransientFirestoreError,
  OperationType,
} from '../firebase';
import type {
  CompetitionMatchRecord,
  ExamAttempt,
  FlashcardProgress,
  FlashcardRating,
  GradeLevel,
  MistakeEntry,
  PersonalizationPreferences,
  StreakData,
  StudyNote,
  StudyReminderSettings,
  SubjectId,
  UserProfile,
} from '../types';
import { clampUtf8String, sanitizeEmailAddress, sanitizeFirestoreId } from './firestoreSanitize';
import { sanitizePersonalization } from './personalization';
import { DEFAULT_REMINDER_SETTINGS, sanitizeReminderTime } from './studyReminders';

export { sanitizeFirestoreId };

const VALID_SUBJECTS: SubjectId[] = [
  'physics',
  'chemistry',
  'biology',
  'addmaths',
  'ict',
  'coremath',
  'english',
  'integratedscience',
  'socialstudies',
];

const VALID_GRADES: GradeLevel[] = ['SHS1', 'SHS2', 'SHS3'];

function clampString(value: string, maxBytes: number, fallback = ''): string {
  return clampUtf8String(value, maxBytes, fallback);
}

function clampInt(value: number, min: number, max: number, fallback: number): number {
  if (!Number.isFinite(value)) return fallback;
  return Math.max(min, Math.min(max, Math.round(value)));
}

function sanitizeSubjects(subjects: SubjectId[]): SubjectId[] {
  const filtered = subjects.filter((s) => VALID_SUBJECTS.includes(s)).slice(0, 9);
  return filtered.length > 0 ? Array.from(new Set(filtered)) : ['physics', 'chemistry', 'ict'];
}

function timestampToIso(ts: unknown, fallbackIso: string): string {
  if (ts instanceof Timestamp) {
    return ts.toDate().toISOString();
  }
  if (typeof ts === 'string' && ts.length >= 10) return ts;
  return fallbackIso;
}

export async function signInWithGooglePopup(): Promise<User> {
  const credential = await signInWithPopup(auth, googleProvider);
  return credential.user;
}

export async function signOutFirebaseUser(): Promise<void> {
  await signOut(auth);
}

function buildUserAccountFields(
  uid: string,
  email: string,
  profile: UserProfile,
  streak: StreakData,
  reminderSettings?: StudyReminderSettings,
  personalization?: PersonalizationPreferences
) {
  const safeGrade: GradeLevel = VALID_GRADES.includes(profile.gradeLevel) ? profile.gradeLevel : 'SHS3';
  const lastDate = /^\d{4}-\d{2}-\d{2}$/.test(streak.lastActiveDate)
    ? streak.lastActiveDate
    : new Date().toISOString().slice(0, 10);
  const safeReminders = reminderSettings ?? DEFAULT_REMINDER_SETTINGS;
  const safeLastReminderDate = /^\d{4}-\d{2}-\d{2}$/.test(safeReminders.lastNotifiedDate ?? '')
    ? safeReminders.lastNotifiedDate
    : '';
  const safePers = sanitizePersonalization(personalization);

  const safeCurrentStreak = clampInt(streak.currentStreak, 0, 3650, 0);
  const safeLongestStreak = Math.max(safeCurrentStreak, clampInt(streak.longestStreak, 0, 3650, 0));

  return {
    uid: sanitizeFirestoreId(uid, 'user'),
    email: sanitizeEmailAddress(email, 'student@wassce.edu.gh'),
    fullName: clampString(profile.fullName, 100, 'WASSCE Candidate'),
    preferredName: clampString(profile.preferredName, 50, 'Scholar'),
    avatarId: clampString(profile.avatarId.replace(/[^a-zA-Z0-9_-]/g, ''), 40, 'atom'),
    gradeLevel: safeGrade,
    targetYear: clampInt(profile.targetYear, 2024, 2035, 2027),
    schoolName: clampUtf8String(profile.schoolName ?? '', 120, ''),
    subjects: sanitizeSubjects(profile.subjects),
    dailyQuestionGoal: clampInt(profile.dailyQuestionGoal, 1, 100, 15),
    streakCurrent: safeCurrentStreak,
    streakLongest: safeLongestStreak,
    streakLastActiveDate: lastDate,
    questionsSolvedToday: clampInt(streak.questionsSolvedToday, 0, 1000, 0),
    totalStudyMinutes: clampInt(streak.totalStudyMinutes, 0, 1000000, 0),
    reminderEnabled: Boolean(safeReminders.enabled),
    reminderTime: sanitizeReminderTime(safeReminders.reminderTime),
    browserNotificationsEnabled: Boolean(safeReminders.browserNotificationsEnabled),
    lastReminderDate: safeLastReminderDate,
    accentTheme: safePers.accentTheme,
    density: safePers.density,
    studioTagline: clampUtf8String(safePers.studioTagline, 60, ''),
    teacherPersona: safePers.teacherPersona,
    orbCorner: safePers.orbCorner,
  };
}

export async function ensureUserAccountInFirestore(
  user: User,
  localProfile: UserProfile,
  localStreak: StreakData,
  localNotes: StudyNote[],
  localAttempts: ExamAttempt[],
  localMistakes: MistakeEntry[],
  localFlashcards: Record<string, FlashcardProgress>,
  localReminders?: StudyReminderSettings,
  localPersonalization?: PersonalizationPreferences
): Promise<void> {
  const uid = user.uid;
  const userPath = `users/${uid}`;
  const userRef = doc(db, 'users', uid);

  let exists = false;
  try {
    const snap = await getDoc(userRef);
    exists = snap.exists();
  } catch (error) {
    if (isTransientFirestoreError(error)) {
      return;
    }
    handleFirestoreError(error, OperationType.GET, userPath);
  }

  if (!exists) {
    const mergedProfile: UserProfile = {
      ...localProfile,
      fullName:
        localProfile.fullName && localProfile.fullName !== 'Kwame Mensah'
          ? localProfile.fullName
          : user.displayName || localProfile.fullName,
      preferredName:
        localProfile.preferredName && localProfile.preferredName !== 'Kwame'
          ? localProfile.preferredName
          : (user.displayName?.split(' ')[0] || localProfile.preferredName),
    };
    const payload = {
      ...buildUserAccountFields(
        uid,
        user.email || 'student@wassce.edu.gh',
        mergedProfile,
        localStreak,
        localReminders,
        localPersonalization
      ),
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    };
    try {
      await setDoc(userRef, payload);
    } catch (error) {
      if (isTransientFirestoreError(error)) {
        return;
      }
      handleFirestoreError(error, OperationType.CREATE, userPath);
    }

    // Migrate local workspace records on first cloud bootstrap
    await Promise.all([
      ...localNotes.slice(0, 30).map((note) => syncStudyNoteToFirestore(uid, note)),
      ...localAttempts.slice(0, 40).map((attempt) => recordExamAttemptInFirestore(uid, attempt)),
      ...localMistakes.slice(0, 80).map((mistake) => syncMistakeToFirestore(uid, mistake)),
      ...Object.values(localFlashcards)
        .slice(0, 80)
        .map((fc) => syncFlashcardToFirestore(uid, fc)),
    ]);
  } else {
    // Ensure Atomic Theory / Physics Dimensions notes exist if user's cloud notes lack them
    const notesPath = `users/${uid}/notes`;
    let existingIds = new Set<string>();
    try {
      const q = query(collection(db, 'users', uid, 'notes'), where('ownerId', '==', uid));
      const snap = await getDocs(q);
      existingIds = new Set(snap.docs.map((d) => d.id));
    } catch (error) {
      if (isTransientFirestoreError(error)) {
        return;
      }
      handleFirestoreError(error, OperationType.LIST, notesPath);
    }

    const requiredSeedIds = new Set([
      'note-phys-dimensions',
      'note-chem-atomic-shs1',
      'note-chem-atomic-shs2',
      'note-chem-atomic-shs3',
    ]);
    const missingSeeds = localNotes.filter(
      (n) => requiredSeedIds.has(n.id) && !existingIds.has(n.id)
    );
    await Promise.all(
      missingSeeds.map((n) => syncStudyNoteToFirestore(uid, n, { assumeNew: true }))
    );
  }
}

export async function saveUserAccountToFirestore(
  uid: string,
  email: string,
  profile: UserProfile,
  streak: StreakData,
  reminderSettings?: StudyReminderSettings,
  personalization?: PersonalizationPreferences
): Promise<void> {
  const userPath = `users/${uid}`;
  const userRef = doc(db, 'users', uid);
  const fields = buildUserAccountFields(
    uid,
    email,
    profile,
    streak,
    reminderSettings,
    personalization
  );
  let operation: OperationType = OperationType.WRITE;
  try {
    operation = OperationType.GET;
    const snap = await getDoc(userRef);
    if (!snap.exists()) {
      operation = OperationType.CREATE;
      await setDoc(userRef, {
        ...fields,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
    } else {
      operation = OperationType.UPDATE;
      const updatePayload: Record<string, unknown> = {
        fullName: fields.fullName,
        preferredName: fields.preferredName,
        avatarId: fields.avatarId,
        gradeLevel: fields.gradeLevel,
        targetYear: fields.targetYear,
        schoolName: fields.schoolName,
        subjects: fields.subjects,
        dailyQuestionGoal: fields.dailyQuestionGoal,
        streakCurrent: fields.streakCurrent,
        streakLongest: fields.streakLongest,
        streakLastActiveDate: fields.streakLastActiveDate,
        questionsSolvedToday: fields.questionsSolvedToday,
        totalStudyMinutes: fields.totalStudyMinutes,
        updatedAt: serverTimestamp(),
      };
      if (reminderSettings) {
        updatePayload.reminderEnabled = fields.reminderEnabled;
        updatePayload.reminderTime = fields.reminderTime;
        updatePayload.browserNotificationsEnabled = fields.browserNotificationsEnabled;
        updatePayload.lastReminderDate = fields.lastReminderDate;
      }
      if (personalization) {
        updatePayload.accentTheme = fields.accentTheme;
        updatePayload.density = fields.density;
        updatePayload.studioTagline = fields.studioTagline;
        updatePayload.teacherPersona = fields.teacherPersona;
        updatePayload.orbCorner = fields.orbCorner;
      }
      await updateDoc(userRef, updatePayload);
    }
  } catch (error) {
    if (isTransientFirestoreError(error)) return;
    handleFirestoreError(error, operation, userPath);
  }
}

export async function syncStudyNoteToFirestore(
  uid: string,
  note: StudyNote,
  options?: { assumeNew?: boolean }
): Promise<void> {
  const noteId = sanitizeFirestoreId(note.id, 'note');
  const notePath = `users/${uid}/notes/${noteId}`;
  const noteRef = doc(db, 'users', uid, 'notes', noteId);
  const safeSubject = VALID_SUBJECTS.includes(note.subject) ? note.subject : 'chemistry';
  const safeGrade = VALID_GRADES.includes(note.grade) ? note.grade : 'SHS1';
  const safeTags = (note.tags ?? [])
    .slice(0, 12)
    .map((t) => clampString(t, 40, 'Note'))
    .filter(Boolean);
  const safeTitle = clampString(note.title, 160, 'Untitled Study Note');
  const safeContent = clampUtf8String(note.content ?? '', 45000, '');

  let operation: OperationType = OperationType.WRITE;
  try {
    let exists = false;
    if (!options?.assumeNew) {
      operation = OperationType.GET;
      const existingSnap = await getDoc(noteRef);
      exists = existingSnap.exists();
    }

    if (!exists) {
      operation = OperationType.CREATE;
      await setDoc(noteRef, {
        id: noteId,
        ownerId: uid,
        title: safeTitle,
        subject: safeSubject,
        grade: safeGrade,
        tags: safeTags,
        content: safeContent,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
    } else {
      operation = OperationType.UPDATE;
      await updateDoc(noteRef, {
        title: safeTitle,
        subject: safeSubject,
        grade: safeGrade,
        tags: safeTags,
        content: safeContent,
        updatedAt: serverTimestamp(),
      });
    }
  } catch (error) {
    if (isTransientFirestoreError(error)) return;
    handleFirestoreError(error, operation, notePath);
  }
}

export async function deleteStudyNoteFromFirestore(uid: string, noteIdRaw: string): Promise<void> {
  const noteId = sanitizeFirestoreId(noteIdRaw, 'note');
  const notePath = `users/${uid}/notes/${noteId}`;
  try {
    await deleteDoc(doc(db, 'users', uid, 'notes', noteId));
  } catch (error) {
    if (isTransientFirestoreError(error)) return;
    handleFirestoreError(error, OperationType.DELETE, notePath);
  }
}

export async function recordExamAttemptInFirestore(
  uid: string,
  attempt: ExamAttempt
): Promise<void> {
  const attemptId = sanitizeFirestoreId(attempt.id, 'att');
  const attemptPath = `users/${uid}/attempts/${attemptId}`;
  const attemptRef = doc(db, 'users', uid, 'attempts', attemptId);
  let operation: OperationType = OperationType.GET;
  try {
    const snap = await getDoc(attemptRef);
    if (snap.exists()) return; // attempts are immutable once recorded

    const safeSubject = VALID_SUBJECTS.includes(attempt.subject) ? attempt.subject : 'physics';
    const safeGrade =
      attempt.gradeFilter === 'ALL' || VALID_GRADES.includes(attempt.gradeFilter)
        ? attempt.gradeFilter
        : 'ALL';

    const safeMaxScore = Math.max(1, Math.min(500, Number(attempt.maxScore) || 1));
    const safeScore = Math.max(0, Math.min(safeMaxScore, Number(attempt.score) || 0));

    operation = OperationType.CREATE;
    await setDoc(attemptRef, {
      id: attemptId,
      ownerId: uid,
      timestamp: clampString(attempt.timestamp, 40, new Date().toISOString()),
      subject: safeSubject,
      gradeFilter: safeGrade,
      paperType: attempt.paperType === 'theory' ? 'theory' : 'mcq',
      mode: attempt.mode === 'exam' ? 'exam' : 'study',
      topicTitles: (attempt.topicTitles ?? [])
        .slice(0, 10)
        .map((t) => clampString(t, 160, 'WASSCE Topic')),
      totalQuestions: clampInt(attempt.totalQuestions, 1, 100, 1),
      score: safeScore,
      maxScore: safeMaxScore,
      percentage: clampInt(attempt.percentage, 0, 100, 0),
      durationSeconds: clampInt(attempt.durationSeconds, 0, 36000, 60),
      createdAt: serverTimestamp(),
    });
  } catch (error) {
    if (isTransientFirestoreError(error)) return;
    handleFirestoreError(error, operation, attemptPath);
  }
}

export async function syncMistakeToFirestore(uid: string, mistake: MistakeEntry): Promise<void> {
  const questionId = sanitizeFirestoreId(mistake.questionId, 'q');
  const mistakePath = `users/${uid}/mistakes/${questionId}`;
  const mistakeRef = doc(db, 'users', uid, 'mistakes', questionId);
  const safeSubject = VALID_SUBJECTS.includes(mistake.subject) ? mistake.subject : 'physics';
  const safeGrade = VALID_GRADES.includes(mistake.grade) ? mistake.grade : 'SHS1';
  const safeTopicId = sanitizeFirestoreId(mistake.topicId, 'topic');

  let operation: OperationType = OperationType.GET;
  try {
    const existingSnap = await getDoc(mistakeRef);
    if (!existingSnap.exists()) {
      operation = OperationType.CREATE;
      await setDoc(mistakeRef, {
        questionId,
        ownerId: uid,
        subject: safeSubject,
        grade: safeGrade,
        topicId: safeTopicId,
        wrongCount: clampInt(mistake.wrongCount, 1, 1000, 1),
        lastMissedAt: clampString(mistake.lastMissedAt, 40, new Date().toISOString()),
        mastered: Boolean(mistake.mastered),
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
    } else {
      operation = OperationType.UPDATE;
      await updateDoc(mistakeRef, {
        wrongCount: clampInt(mistake.wrongCount, 1, 1000, 1),
        lastMissedAt: clampString(mistake.lastMissedAt, 40, new Date().toISOString()),
        mastered: Boolean(mistake.mastered),
        updatedAt: serverTimestamp(),
      });
    }
  } catch (error) {
    if (isTransientFirestoreError(error)) return;
    handleFirestoreError(error, operation, mistakePath);
  }
}

export async function syncFlashcardToFirestore(
  uid: string,
  progress: FlashcardProgress
): Promise<void> {
  const cardId = sanitizeFirestoreId(progress.cardId, 'card', true);
  const cardPath = `users/${uid}/flashcards/${cardId}`;
  const cardRef = doc(db, 'users', uid, 'flashcards', cardId);
  const allowedRatings: FlashcardRating[] = ['again', 'hard', 'good', 'easy'];
  const safeRating =
    progress.lastRating && allowedRatings.includes(progress.lastRating)
      ? progress.lastRating
      : 'good';

  const basePayload = {
    repetitions: clampInt(progress.repetitions, 0, 500, 0),
    intervalDays: clampInt(progress.intervalDays, 0, 3650, 0),
    easeFactor: Math.max(1.0, Math.min(5.0, Number(progress.easeFactor) || 2.5)),
    nextReviewAt: clampString(progress.nextReviewAt, 40, new Date().toISOString()),
    lastRating: safeRating,
    lastReviewedAt: clampString(progress.lastReviewedAt ?? new Date().toISOString(), 40, new Date().toISOString()),
    updatedAt: serverTimestamp(),
  };

  let operation: OperationType = OperationType.GET;
  try {
    const existingSnap = await getDoc(cardRef);
    if (!existingSnap.exists()) {
      operation = OperationType.CREATE;
      await setDoc(cardRef, {
        cardId,
        ownerId: uid,
        ...basePayload,
        createdAt: serverTimestamp(),
      });
    } else {
      operation = OperationType.UPDATE;
      await updateDoc(cardRef, basePayload);
    }
  } catch (error) {
    if (isTransientFirestoreError(error)) return;
    handleFirestoreError(error, operation, cardPath);
  }
}

export async function recordCompetitionMatchInFirestore(
  uid: string,
  record: CompetitionMatchRecord
): Promise<void> {
  const matchId = sanitizeFirestoreId(record.id, 'comp');
  const matchPath = `users/${uid}/competitions/${matchId}`;
  const matchRef = doc(db, 'users', uid, 'competitions', matchId);
  let operation: OperationType = OperationType.GET;
  try {
    const snap = await getDoc(matchRef);
    if (snap.exists()) return;

    const safeSubject = VALID_SUBJECTS.includes(record.subject) ? record.subject : 'physics';
    const safeGrade =
      record.gradeFilter === 'ALL' || VALID_GRADES.includes(record.gradeFilter)
        ? record.gradeFilter
        : 'ALL';
    const safeTotal = clampInt(record.totalQuestions, 1, 50, 5);
    const safeCorrect = clampInt(record.correctCount, 0, safeTotal, 0);

    operation = OperationType.CREATE;
    await setDoc(matchRef, {
      id: matchId,
      ownerId: uid,
      timestamp: clampString(record.timestamp, 40, new Date().toISOString()),
      subject: safeSubject,
      gradeFilter: safeGrade,
      aiOpponentId: clampString(record.aiOpponentId.replace(/[^a-zA-Z0-9_-]/g, ''), 40, 'rival'),
      aiOpponentName: clampString(record.aiOpponentName, 80, 'AI Rival'),
      studentScore: clampInt(record.studentScore, 0, 50000, 0),
      aiScore: clampInt(record.aiScore, 0, 50000, 0),
      totalQuestions: safeTotal,
      correctCount: safeCorrect,
      accuracyPct: clampInt(record.accuracyPct, 0, 100, 0),
      durationSeconds: clampInt(record.durationSeconds, 1, 36000, 60),
      won: Boolean(record.won),
      createdAt: serverTimestamp(),
    });
  } catch (error) {
    if (isTransientFirestoreError(error)) return;
    handleFirestoreError(error, operation, matchPath);
  }
}

export async function recordSimulationRunInFirestore(
  uid: string,
  experimentId: string,
  grade: string
): Promise<void> {
  const runId = sanitizeFirestoreId(`sim-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`, 'sim');
  const runPath = `users/${uid}/simulations/${runId}`;
  const runRef = doc(db, 'users', uid, 'simulations', runId);
  try {
    await setDoc(runRef, {
      id: runId,
      ownerId: uid,
      experimentId: clampString(experimentId, 80, 'lab-sim'),
      grade: clampString(grade, 32, 'SHS1'),
      createdAt: serverTimestamp(),
    });
  } catch (error) {
    if (isTransientFirestoreError(error)) return;
    handleFirestoreError(error, OperationType.CREATE, runPath);
  }
}

export interface WorkspaceSnapshotCallbacks {
  onAccount: (
    profile: UserProfile,
    streak: StreakData,
    reminderSettings?: StudyReminderSettings,
    personalization?: PersonalizationPreferences
  ) => void;
  onNotes: (notes: StudyNote[]) => void;
  onAttempts: (attempts: ExamAttempt[]) => void;
  onMistakes: (mistakes: MistakeEntry[]) => void;
  onFlashcards: (flashcards: Record<string, FlashcardProgress>) => void;
  onCompetitions?: (matches: CompetitionMatchRecord[]) => void;
}

export function subscribeUserWorkspace(
  uid: string,
  callbacks: WorkspaceSnapshotCallbacks
): Unsubscribe {
  const userPath = `users/${uid}`;
  const notesPath = `users/${uid}/notes`;
  const attemptsPath = `users/${uid}/attempts`;
  const mistakesPath = `users/${uid}/mistakes`;
  const flashcardsPath = `users/${uid}/flashcards`;
  const competitionsPath = `users/${uid}/competitions`;

  const unsubUser = onSnapshot(
    doc(db, 'users', uid),
    (snap) => {
      if (!snap.exists()) return;
      const d = snap.data();
      const nowIso = new Date().toISOString();
      const nextProfile: UserProfile = {
        fullName: String(d.fullName ?? 'WASSCE Candidate'),
        preferredName: String(d.preferredName ?? 'Scholar'),
        avatarId: String(d.avatarId ?? 'atom'),
        gradeLevel: (VALID_GRADES.includes(d.gradeLevel) ? d.gradeLevel : 'SHS3') as GradeLevel,
        targetYear: Number(d.targetYear ?? 2027),
        schoolName: String(d.schoolName ?? ''),
        subjects: Array.isArray(d.subjects) ? (d.subjects as SubjectId[]) : ['physics', 'chemistry', 'ict'],
        dailyQuestionGoal: Number(d.dailyQuestionGoal ?? 15),
        createdAt: timestampToIso(d.createdAt, nowIso),
      };
      const nextStreak: StreakData = {
        currentStreak: Number(d.streakCurrent ?? 0),
        longestStreak: Number(d.streakLongest ?? 0),
        lastActiveDate: String(d.streakLastActiveDate ?? nowIso.slice(0, 10)),
        questionsSolvedToday: Number(d.questionsSolvedToday ?? 0),
        totalStudyMinutes: Number(d.totalStudyMinutes ?? 0),
      };
      const cloudReminders: StudyReminderSettings | undefined =
        typeof d.reminderEnabled === 'boolean' || typeof d.reminderTime === 'string'
          ? {
              enabled: typeof d.reminderEnabled === 'boolean' ? d.reminderEnabled : true,
              reminderTime: sanitizeReminderTime(
                typeof d.reminderTime === 'string' ? d.reminderTime : undefined
              ),
              browserNotificationsEnabled: Boolean(d.browserNotificationsEnabled),
              lastNotifiedDate: typeof d.lastReminderDate === 'string' ? d.lastReminderDate : '',
              snoozedUntilIso: null,
            }
          : undefined;
      const cloudPersonalization: PersonalizationPreferences | undefined =
        d.accentTheme || d.density || d.teacherPersona || d.orbCorner
          ? sanitizePersonalization({
              accentTheme: d.accentTheme,
              density: d.density,
              studioTagline: d.studioTagline ?? '',
              teacherPersona: d.teacherPersona,
              orbCorner: d.orbCorner,
            })
          : undefined;
      callbacks.onAccount(nextProfile, nextStreak, cloudReminders, cloudPersonalization);
    },
    (error) => {
      if (!isTransientFirestoreError(error)) {
        handleFirestoreError(error, OperationType.GET, userPath);
      }
    }
  );

  const unsubNotes = onSnapshot(
    query(collection(db, 'users', uid, 'notes'), where('ownerId', '==', uid)),
    (snap) => {
      const nowIso = new Date().toISOString();
      const list: StudyNote[] = snap.docs.map((docSnap) => {
        const d = docSnap.data();
        return {
          id: String(d.id ?? docSnap.id),
          title: String(d.title ?? 'Untitled'),
          subject: (VALID_SUBJECTS.includes(d.subject) ? d.subject : 'chemistry') as SubjectId,
          grade: (VALID_GRADES.includes(d.grade) ? d.grade : 'SHS1') as GradeLevel,
          tags: Array.isArray(d.tags) ? d.tags.map(String) : [],
          content: String(d.content ?? ''),
          createdAt: timestampToIso(d.createdAt, nowIso),
          updatedAt: timestampToIso(d.updatedAt, nowIso),
        };
      });
      if (list.length > 0) {
        list.sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
        callbacks.onNotes(list);
      }
    },
    (error) => {
      if (!isTransientFirestoreError(error)) {
        handleFirestoreError(error, OperationType.LIST, notesPath);
      }
    }
  );

  const unsubAttempts = onSnapshot(
    query(collection(db, 'users', uid, 'attempts'), where('ownerId', '==', uid)),
    (snap) => {
      const list: ExamAttempt[] = snap.docs.map((docSnap) => {
        const d = docSnap.data();
        return {
          id: String(d.id ?? docSnap.id),
          timestamp: String(d.timestamp ?? new Date().toISOString()),
          subject: (VALID_SUBJECTS.includes(d.subject) ? d.subject : 'physics') as SubjectId,
          gradeFilter: d.gradeFilter ?? 'ALL',
          paperType: d.paperType === 'theory' ? 'theory' : 'mcq',
          mode: d.mode === 'exam' ? 'exam' : 'study',
          topicTitles: Array.isArray(d.topicTitles) ? d.topicTitles.map(String) : [],
          totalQuestions: Number(d.totalQuestions ?? 1),
          score: Number(d.score ?? 0),
          maxScore: Number(d.maxScore ?? 1),
          percentage: Number(d.percentage ?? 0),
          durationSeconds: Number(d.durationSeconds ?? 0),
        };
      });
      list.sort((a, b) => a.timestamp.localeCompare(b.timestamp));
      callbacks.onAttempts(list);
    },
    (error) => {
      if (!isTransientFirestoreError(error)) {
        handleFirestoreError(error, OperationType.LIST, attemptsPath);
      }
    }
  );

  const unsubMistakes = onSnapshot(
    query(collection(db, 'users', uid, 'mistakes'), where('ownerId', '==', uid)),
    (snap) => {
      const list: MistakeEntry[] = snap.docs.map((docSnap) => {
        const d = docSnap.data();
        return {
          questionId: String(d.questionId ?? docSnap.id),
          subject: (VALID_SUBJECTS.includes(d.subject) ? d.subject : 'physics') as SubjectId,
          grade: (VALID_GRADES.includes(d.grade) ? d.grade : 'SHS1') as GradeLevel,
          topicId: String(d.topicId ?? 'unknown'),
          wrongCount: Number(d.wrongCount ?? 1),
          lastMissedAt: String(d.lastMissedAt ?? new Date().toISOString()),
          lastSelectedIndex: null,
          mastered: Boolean(d.mastered),
        };
      });
      callbacks.onMistakes(list);
    },
    (error) => {
      if (!isTransientFirestoreError(error)) {
        handleFirestoreError(error, OperationType.LIST, mistakesPath);
      }
    }
  );

  const unsubFlashcards = onSnapshot(
    query(collection(db, 'users', uid, 'flashcards'), where('ownerId', '==', uid)),
    (snap) => {
      const map: Record<string, FlashcardProgress> = {};
      for (const docSnap of snap.docs) {
        const d = docSnap.data();
        const cardId = String(d.cardId ?? docSnap.id);
        map[cardId] = {
          cardId,
          repetitions: Number(d.repetitions ?? 0),
          intervalDays: Number(d.intervalDays ?? 0),
          easeFactor: Number(d.easeFactor ?? 2.5),
          nextReviewAt: String(d.nextReviewAt ?? new Date().toISOString()),
          lastRating: d.lastRating as FlashcardRating | undefined,
          lastReviewedAt: d.lastReviewedAt ? String(d.lastReviewedAt) : undefined,
        };
      }
      callbacks.onFlashcards(map);
    },
    (error) => {
      if (!isTransientFirestoreError(error)) {
        handleFirestoreError(error, OperationType.LIST, flashcardsPath);
      }
    }
  );

  const unsubCompetitions = callbacks.onCompetitions
    ? onSnapshot(
        query(collection(db, 'users', uid, 'competitions'), where('ownerId', '==', uid)),
        (snap) => {
          const list: CompetitionMatchRecord[] = snap.docs.map((docSnap) => {
            const d = docSnap.data();
            return {
              id: String(d.id ?? docSnap.id),
              timestamp: String(d.timestamp ?? new Date().toISOString()),
              subject: (VALID_SUBJECTS.includes(d.subject) ? d.subject : 'physics') as SubjectId,
              gradeFilter: d.gradeFilter ?? 'ALL',
              aiOpponentId: String(d.aiOpponentId ?? 'rival'),
              aiOpponentName: String(d.aiOpponentName ?? 'AI Rival'),
              studentScore: Number(d.studentScore ?? 0),
              aiScore: Number(d.aiScore ?? 0),
              totalQuestions: Number(d.totalQuestions ?? 5),
              correctCount: Number(d.correctCount ?? 0),
              accuracyPct: Number(d.accuracyPct ?? 0),
              durationSeconds: Number(d.durationSeconds ?? 60),
              won: Boolean(d.won),
            };
          });
          list.sort((a, b) => b.timestamp.localeCompare(a.timestamp));
          callbacks.onCompetitions?.(list);
        },
        (error) => {
          if (!isTransientFirestoreError(error)) {
            handleFirestoreError(error, OperationType.LIST, competitionsPath);
          }
        }
      )
    : null;

  return () => {
    unsubUser();
    unsubNotes();
    unsubAttempts();
    unsubMistakes();
    unsubFlashcards();
    unsubCompetitions?.();
  };
}
