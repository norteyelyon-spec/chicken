import type {
  AchievementBadge,
  AppBackupPayload,
  ExamAttempt,
  GradeFilter,
  GradeLevel,
  MCQAnswerRecord,
  MCQQuestion,
  MistakeEntry,
  QuizConfig,
  StreakData,
  SubjectId,
  SyllabusTopic,
  TheoryPartSelfGrade,
  TheoryQuestion,
  UserProfile,
} from '../types';

export function filterMCQs(
  pool: MCQQuestion[],
  subject: SubjectId,
  gradeFilter: GradeFilter,
  topicIds: string[]
): MCQQuestion[] {
  return pool.filter((q) => {
    if (q.subject !== subject) return false;
    if (gradeFilter !== 'ALL' && q.grade !== gradeFilter) return false;
    if (topicIds.length > 0 && !topicIds.includes(q.topicId)) return false;
    return true;
  });
}

export function filterTheoryQuestions(
  pool: TheoryQuestion[],
  subject: SubjectId,
  gradeFilter: GradeFilter,
  topicIds: string[]
): TheoryQuestion[] {
  return pool.filter((q) => {
    if (q.subject !== subject) return false;
    if (gradeFilter !== 'ALL' && q.grade !== gradeFilter) return false;
    if (topicIds.length > 0 && !topicIds.includes(q.topicId)) return false;
    return true;
  });
}

export function deterministicShuffle<T>(items: T[], seed?: number): T[] {
  const arr = [...items];
  let s = seed ?? Date.now();
  const nextRand = () => {
    s = (s * 1664525 + 1013904223) % 4294967296;
    return s / 4294967296;
  };
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(nextRand() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

/**
 * Builds an exam question set with ZERO repeated questions.
 * Deduplicates by ID across the selected subject/grade/topics.
 * If a narrow topic/grade filter has fewer unique questions than requestedCount,
 * it tops up from remaining unseen questions in the same grade or subject without ever repeating an ID.
 */
export function buildMCQSession(
  pool: MCQQuestion[],
  config: QuizConfig,
  seed?: number
): MCQQuestion[] {
  const uniqueById = new Map<string, MCQQuestion>();
  for (const item of pool) {
    if (!uniqueById.has(item.id)) {
      uniqueById.set(item.id, item);
    }
  }
  const dedupedPool = Array.from(uniqueById.values());

  const primaryMatches = filterMCQs(dedupedPool, config.subject, config.gradeFilter, config.topicIds);
  const shuffledPrimary = deterministicShuffle(primaryMatches, seed);

  const selected: MCQQuestion[] = [...shuffledPrimary];
  const usedIds = new Set(selected.map((q) => q.id));

  const targetCount = Math.max(1, Math.round(config.questionCount));

  // If topic filter had fewer unique questions than requested, top up from same subject/grade first
  if (selected.length < targetCount && config.topicIds.length > 0) {
    const gradeSameSubject = deterministicShuffle(
      dedupedPool.filter(
        (q) =>
          q.subject === config.subject &&
          (config.gradeFilter === 'ALL' || q.grade === config.gradeFilter) &&
          !usedIds.has(q.id)
      ),
      (seed ?? Date.now()) + 17
    );
    for (const q of gradeSameSubject) {
      if (selected.length >= targetCount) break;
      selected.push(q);
      usedIds.add(q.id);
    }
  }

  // If grade filter also has fewer unique items than requested, top up from all unique questions in the same subject
  if (selected.length < targetCount) {
    const subjectRest = deterministicShuffle(
      dedupedPool.filter((q) => q.subject === config.subject && !usedIds.has(q.id)),
      (seed ?? Date.now()) + 31
    );
    for (const q of subjectRest) {
      if (selected.length >= targetCount) break;
      selected.push(q);
      usedIds.add(q.id);
    }
  }

  return selected.slice(0, Math.min(targetCount, selected.length));
}

export function buildTheorySession(
  pool: TheoryQuestion[],
  config: QuizConfig,
  seed?: number
): TheoryQuestion[] {
  const uniqueById = new Map<string, TheoryQuestion>();
  for (const item of pool) {
    if (!uniqueById.has(item.id)) {
      uniqueById.set(item.id, item);
    }
  }
  const dedupedPool = Array.from(uniqueById.values());

  const primaryMatches = filterTheoryQuestions(
    dedupedPool,
    config.subject,
    config.gradeFilter,
    config.topicIds
  );
  const selected: TheoryQuestion[] = deterministicShuffle(primaryMatches, seed);
  const usedIds = new Set(selected.map((q) => q.id));
  const targetCount = Math.max(1, Math.round(config.questionCount));

  if (selected.length < targetCount && config.topicIds.length > 0) {
    const sameGradePool = deterministicShuffle(
      dedupedPool.filter(
        (q) =>
          q.subject === config.subject &&
          (config.gradeFilter === 'ALL' || q.grade === config.gradeFilter) &&
          !usedIds.has(q.id)
      ),
      (seed ?? Date.now()) + 19
    );
    for (const q of sameGradePool) {
      if (selected.length >= targetCount) break;
      selected.push(q);
      usedIds.add(q.id);
    }
  }

  if (selected.length < targetCount) {
    const subjectRest = deterministicShuffle(
      dedupedPool.filter((q) => q.subject === config.subject && !usedIds.has(q.id)),
      (seed ?? Date.now()) + 43
    );
    for (const q of subjectRest) {
      if (selected.length >= targetCount) break;
      selected.push(q);
      usedIds.add(q.id);
    }
  }

  return selected.slice(0, Math.min(targetCount, selected.length));
}

export function gradeMCQSession(
  questions: MCQQuestion[],
  answers: Record<number, number | null>
): {
  score: number;
  maxScore: number;
  percentage: number;
  records: MCQAnswerRecord[];
} {
  const records: MCQAnswerRecord[] = questions.map((q, idx) => {
    const selected = answers[idx] ?? null;
    const isCorrect = selected === q.correctIndex;
    return {
      questionId: q.id,
      selectedIndex: selected,
      correctIndex: q.correctIndex,
      isCorrect,
    };
  });

  const score = records.filter((r) => r.isCorrect).length;
  const maxScore = questions.length;
  const percentage = maxScore > 0 ? Math.round((score / maxScore) * 100) : 0;
  return { score, maxScore, percentage, records };
}

export function gradeTheorySession(
  partsList: TheoryPartSelfGrade[][]
): {
  score: number;
  maxScore: number;
  percentage: number;
} {
  let score = 0;
  let maxScore = 0;
  for (const qParts of partsList) {
    for (const part of qParts) {
      const clamped = Math.max(0, Math.min(part.maxMarks, part.awardedMarks));
      score += clamped;
      maxScore += part.maxMarks;
    }
  }
  const percentage = maxScore > 0 ? Math.round((score / maxScore) * 100) : 0;
  return { score, maxScore, percentage };
}

export function updateMistakeBank(
  existing: MistakeEntry[],
  questions: MCQQuestion[],
  records: MCQAnswerRecord[],
  nowIso: string
): MistakeEntry[] {
  const map = new Map<string, MistakeEntry>();
  for (const item of existing) {
    map.set(item.questionId, { ...item });
  }

  records.forEach((rec, idx) => {
    const q = questions[idx];
    if (!q) return;
    const prev = map.get(q.id);
    if (!rec.isCorrect) {
      map.set(q.id, {
        questionId: q.id,
        subject: q.subject,
        grade: q.grade,
        topicId: q.topicId,
        wrongCount: (prev?.wrongCount ?? 0) + 1,
        lastMissedAt: nowIso,
        lastSelectedIndex: rec.selectedIndex,
        mastered: false,
      });
    } else if (prev) {
      map.set(q.id, {
        ...prev,
        mastered: true,
      });
    }
  });

  return Array.from(map.values()).sort(
    (a, b) => new Date(b.lastMissedAt).getTime() - new Date(a.lastMissedAt).getTime()
  );
}

export interface SubjectMasteryStats {
  subject: SubjectId;
  attemptsCount: number;
  questionsSolved: number;
  averagePercentage: number;
  byGrade: Record<GradeLevel, number>;
}

export function computeSubjectMastery(
  attempts: ExamAttempt[],
  subjects: SubjectId[],
  topics: SyllabusTopic[]
): SubjectMasteryStats[] {
  return subjects.map((subject) => {
    const subAttempts = attempts.filter((a) => a.subject === subject);
    const attemptsCount = subAttempts.length;
    const questionsSolved = subAttempts.reduce((acc, a) => acc + a.totalQuestions, 0);
    const averagePercentage =
      attemptsCount > 0
        ? Math.round(subAttempts.reduce((acc, a) => acc + a.percentage, 0) / attemptsCount)
        : 0;

    const grades: GradeLevel[] = ['SHS1', 'SHS2', 'SHS3'];
    const byGrade = { SHS1: 0, SHS2: 0, SHS3: 0 } as Record<GradeLevel, number>;

    for (const grade of grades) {
      const gradeAttempts = subAttempts.filter(
        (a) => a.gradeFilter === grade || a.gradeFilter === 'ALL'
      );
      if (gradeAttempts.length > 0) {
        byGrade[grade] = Math.round(
          gradeAttempts.reduce((acc, a) => acc + a.percentage, 0) / gradeAttempts.length
        );
      } else {
        const hasTopics = topics.some((t) => t.subject === subject && t.grade === grade);
        byGrade[grade] = hasTopics ? 0 : 0;
      }
    }

    return {
      subject,
      attemptsCount,
      questionsSolved,
      averagePercentage,
      byGrade,
    };
  });
}

export function computeOverallAnalytics(attempts: ExamAttempt[]) {
  const testsCompleted = attempts.length;
  const totalQuestionsSolved = attempts.reduce((sum, a) => sum + a.totalQuestions, 0);
  const totalSeconds = attempts.reduce((sum, a) => sum + a.durationSeconds, 0);
  const overallAccuracy =
    testsCompleted > 0
      ? Math.round(attempts.reduce((sum, a) => sum + a.percentage, 0) / testsCompleted)
      : 0;

  return {
    testsCompleted,
    totalQuestionsSolved,
    totalStudyMinutes: testsCompleted === 0 ? 0 : Math.max(1, Math.round(totalSeconds / 60)),
    overallAccuracy,
  };
}

export function updateDailyStreak(
  streak: StreakData,
  todayDateStr: string,
  addedQuestions: number,
  addedMinutes: number
): StreakData {
  if (streak.lastActiveDate === todayDateStr) {
    return {
      ...streak,
      questionsSolvedToday: streak.questionsSolvedToday + addedQuestions,
      totalStudyMinutes: streak.totalStudyMinutes + addedMinutes,
    };
  }

  const prevDate = new Date(`${streak.lastActiveDate}T00:00:00Z`);
  const todayDate = new Date(`${todayDateStr}T00:00:00Z`);
  const diffDays = Math.round((todayDate.getTime() - prevDate.getTime()) / (1000 * 60 * 60 * 24));

  if (diffDays <= 0) {
    return {
      ...streak,
      questionsSolvedToday: streak.questionsSolvedToday + addedQuestions,
      totalStudyMinutes: streak.totalStudyMinutes + addedMinutes,
    };
  }

  const nextStreak = diffDays === 1 ? streak.currentStreak + 1 : 1;
  return {
    currentStreak: nextStreak,
    longestStreak: Math.max(streak.longestStreak, nextStreak),
    lastActiveDate: todayDateStr,
    questionsSolvedToday: addedQuestions,
    totalStudyMinutes: streak.totalStudyMinutes + addedMinutes,
  };
}

export function evaluateAchievements(
  attempts: ExamAttempt[],
  mistakes: MistakeEntry[],
  notesCount: number,
  streak: StreakData
): AchievementBadge[] {
  const totalQuestions = attempts.reduce((sum, a) => sum + a.totalQuestions, 0);
  const hasHighScore = attempts.some((a) => a.percentage >= 80);
  const masteredMistakes = mistakes.filter((m) => m.mastered).length;
  const hasTheoryAttempt = attempts.some((a) => a.paperType === 'theory');

  return [
    {
      id: 'first-mock',
      title: 'WASSCE Debut',
      description: 'Complete your first Paper 1 or Paper 2 assessment.',
      unlocked: attempts.length >= 1,
      progressText: `${Math.min(attempts.length, 1)}/1 exam`,
    },
    {
      id: 'sharp-scholar',
      title: 'Distinction Grade A1',
      description: 'Score 80% or higher on any WASSCE mock test.',
      unlocked: hasHighScore,
      progressText: hasHighScore ? 'Achieved' : 'Target 80%+',
    },
    {
      id: 'century-solver',
      title: '50 Questions Mastered',
      description: 'Solve at least 50 WASSCE practice questions.',
      unlocked: totalQuestions >= 50,
      progressText: `${Math.min(totalQuestions, 50)}/50 solved`,
    },
    {
      id: 'theory-writer',
      title: 'Paper 2 Strategist',
      description: 'Complete and self-grade a structured Theory essay.',
      unlocked: hasTheoryAttempt,
      progressText: hasTheoryAttempt ? 'Completed' : '0/1 Paper 2',
    },
    {
      id: 'mistake-crusher',
      title: 'Mistake Bank Closer',
      description: 'Re-solve and master 3 previously missed questions.',
      unlocked: masteredMistakes >= 3,
      progressText: `${Math.min(masteredMistakes, 3)}/3 mastered`,
    },
    {
      id: 'note-archivist',
      title: 'Revision Architect',
      description: 'Maintain at least 4 personal study notes in the Hub.',
      unlocked: notesCount >= 4,
      progressText: `${Math.min(notesCount, 4)}/4 notes`,
    },
    {
      id: 'streak-keeper',
      title: '3-Day Consistency',
      description: 'Keep an active study streak for 3 consecutive days.',
      unlocked: streak.longestStreak >= 3,
      progressText: `${Math.min(streak.longestStreak, 3)}/3 days`,
    },
  ];
}

export function validateBackupPayload(raw: unknown): raw is AppBackupPayload {
  if (!raw || typeof raw !== 'object') return false;
  const obj = raw as Partial<AppBackupPayload>;
  if (typeof obj.version !== 'number') return false;
  if (!obj.profile || typeof obj.profile.fullName !== 'string') return false;
  if (!Array.isArray(obj.attempts) || !Array.isArray(obj.mistakes) || !Array.isArray(obj.notes)) {
    return false;
  }
  return true;
}

export function formatDurationClock(totalSeconds: number): string {
  const safe = Math.max(0, Math.floor(totalSeconds));
  const mins = Math.floor(safe / 60);
  const secs = safe % 60;
  return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
}

export function insertSymbolAtCursor(
  currentValue: string,
  symbol: string,
  selectionStart: number,
  selectionEnd: number
): { nextValue: string; nextCursor: number } {
  const before = currentValue.slice(0, selectionStart);
  const after = currentValue.slice(selectionEnd);
  const nextValue = `${before}${symbol}${after}`;
  return {
    nextValue,
    nextCursor: selectionStart + symbol.length,
  };
}

export function createDefaultProfile(overrides?: Partial<UserProfile>): UserProfile {
  return {
    fullName: 'Kwame Mensah',
    preferredName: 'Kwame',
    avatarId: 'atom',
    gradeLevel: 'SHS3',
    targetYear: 2027,
    schoolName: 'Achimota Senior High School',
    subjects: [
      'physics',
      'chemistry',
      'biology',
      'addmaths',
      'ict',
      'coremath',
      'english',
      'integratedscience',
      'socialstudies',
    ],
    dailyQuestionGoal: 15,
    createdAt: new Date().toISOString(),
    ...overrides,
  };
}
