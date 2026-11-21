import type {
  AIOpponentProfile,
  CompetitionMatchRecord,
  GradeFilter,
  MCQQuestion,
  SubjectId,
} from '../types/index.ts';

export const COMPETITIONS_STORAGE_KEY = 'wassce_masterclass_competitions_v1';

export const AI_RIVALS: AIOpponentProfile[] = [
  {
    id: 'kofi-bot',
    name: 'Kofi Bot',
    tierLabel: 'Standard Rival',
    accuracyRate: 0.65,
    baseResponseMs: 6500,
    avatarColor: '#38bdf8',
    tagline: 'Consistent WASSCE credit pace across core fundamentals.',
  },
  {
    id: 'ama-scholar',
    name: 'Ama Scholar',
    tierLabel: 'Honours Rival',
    accuracyRate: 0.8,
    baseResponseMs: 4800,
    avatarColor: '#34d399',
    tagline: 'Sharp calculations and fast conceptual recall.',
  },
  {
    id: 'prof-nkrumah',
    name: 'Prof. Nkrumah AI',
    tierLabel: 'Distinction Master',
    accuracyRate: 0.92,
    baseResponseMs: 3600,
    avatarColor: '#fbbf24',
    tagline: 'A1 National Quiz Finals pace — rewards speed + zero mistakes.',
  },
];

export function buildCompetitionDeck(
  pool: MCQQuestion[],
  subject: SubjectId,
  gradeFilter: GradeFilter,
  count: number,
  seed = 1
): MCQQuestion[] {
  const bySubject = pool.filter((q) => q.subject === subject);
  const byGrade =
    gradeFilter === 'ALL' ? bySubject : bySubject.filter((q) => q.grade === gradeFilter);
  const source = byGrade.length >= Math.min(count, 4) ? byGrade : bySubject;
  const copy = [...source];

  // Deterministic Fisher-Yates shuffle when seed provided so runs and tests are reproducible
  let state = (seed >>> 0) || 1337;
  const nextRand = () => {
    state = (state * 1664525 + 1013904223) >>> 0;
    return state / 4294967296;
  };

  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(nextRand() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy.slice(0, Math.max(1, Math.min(count, copy.length)));
}

export function simulateAiOpponentTurn(
  opponent: AIOpponentProfile,
  questionIndex: number,
  seed = 42
): { isCorrect: boolean; pointsAwarded: number; thinkMs: number } {
  const hash = (((questionIndex + 1) * 2654435761 + seed * 1597334677) >>> 0) / 4294967295;
  const isCorrect = hash < opponent.accuracyRate;
  const speedRatio = 0.78 + ((hash * 100) % 1) * 0.44;
  const thinkMs = Math.round(opponent.baseResponseMs * speedRatio);
  const speedBonus = thinkMs <= 4200 ? 40 : thinkMs <= 6000 ? 25 : 15;
  const pointsAwarded = isCorrect ? 100 + speedBonus : 0;
  return { isCorrect, pointsAwarded, thinkMs };
}

export function scoreStudentTurn(params: {
  isCorrect: boolean;
  elapsedMs: number;
  currentStreak: number;
}): { pointsAwarded: number; nextStreak: number } {
  if (!params.isCorrect) {
    return { pointsAwarded: 0, nextStreak: 0 };
  }
  const speedBonus = params.elapsedMs <= 4500 ? 40 : params.elapsedMs <= 8000 ? 25 : 10;
  const nextStreak = params.currentStreak + 1;
  const streakBonus = nextStreak >= 3 ? Math.min(45, (nextStreak - 1) * 15) : 0;
  return {
    pointsAwarded: 100 + speedBonus + streakBonus,
    nextStreak,
  };
}

export interface CompetitionStatsSummary {
  totalMatches: number;
  wins: number;
  winRatePct: number;
  bestScore: number;
  averageAccuracyPct: number;
}

export function computeCompetitionSummary(matches: CompetitionMatchRecord[]): CompetitionStatsSummary {
  if (matches.length === 0) {
    return {
      totalMatches: 0,
      wins: 0,
      winRatePct: 0,
      bestScore: 0,
      averageAccuracyPct: 0,
    };
  }
  const wins = matches.filter((m) => m.won).length;
  const bestScore = Math.max(...matches.map((m) => m.studentScore));
  const avgAcc = Math.round(
    matches.reduce((acc, m) => acc + m.accuracyPct, 0) / matches.length
  );
  return {
    totalMatches: matches.length,
    wins,
    winRatePct: Math.round((wins / matches.length) * 100),
    bestScore,
    averageAccuracyPct: avgAcc,
  };
}
