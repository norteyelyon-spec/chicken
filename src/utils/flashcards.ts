import type {
  FlashcardItem,
  FlashcardProgress,
  FlashcardRating,
  GradeFilter,
  SubjectId,
  SyllabusTopic,
} from '../types/index.ts';

function toRecallQuestion(objective: string): string {
  const clean = objective.trim().replace(/\.$/, '');
  const lower = clean.charAt(0).toLowerCase() + clean.slice(1);
  if (/^(distinguish|compare|contrast|relate|differentiate)/i.test(clean)) {
    return `How do you ${lower}?`;
  }
  if (/^(define|state|explain|describe|identify|outline|analyze|evaluate)/i.test(clean)) {
    return `${clean} — explain key WASSCE points.`;
  }
  return `How do you ${lower}?`;
}

/**
 * Automatically derives spaced-repetition flashcards from GES SYLLABUS_TOPICS:
 * - Explicit keyTerms -> Term & Definition cards
 * - Unit summary -> Core Concept card
 * - Syllabus objectives -> Active-recall mastery prompts
 * - Key formulas -> Expression recall cards
 */
export function generateFlashcardsFromTopics(topics: SyllabusTopic[]): FlashcardItem[] {
  const cards: FlashcardItem[] = [];

  for (const topic of topics) {
    const formulaText =
      topic.keyFormulas.length > 0 ? topic.keyFormulas.join('   ·   ') : undefined;

    // 1. Core Topic Concept card
    cards.push({
      id: `${topic.id}::overview`,
      topicId: topic.id,
      subject: topic.subject,
      grade: topic.grade,
      unitNumber: topic.unitNumber,
      topicTitle: topic.title,
      kind: 'overview',
      frontLabel: 'Core Concept',
      front: topic.title,
      back: topic.summary,
      formulaHint: formulaText,
    });

    // 2. Explicit Key Terms & Definitions (if defined on topic)
    if (topic.keyTerms && topic.keyTerms.length > 0) {
      topic.keyTerms.forEach((kt, idx) => {
        cards.push({
          id: `${topic.id}::term-${idx}`,
          topicId: topic.id,
          subject: topic.subject,
          grade: topic.grade,
          unitNumber: topic.unitNumber,
          topicTitle: topic.title,
          kind: 'term',
          frontLabel: 'Key Term',
          front: kt.term,
          back: kt.definition,
          formulaHint: idx === 0 ? formulaText : undefined,
        });
      });
    }

    // 3. Automatically derived Active-Recall cards from syllabus objectives
    topic.objectives.forEach((obj, idx) => {
      cards.push({
        id: `${topic.id}::obj-${idx}`,
        topicId: topic.id,
        subject: topic.subject,
        grade: topic.grade,
        unitNumber: topic.unitNumber,
        topicTitle: topic.title,
        kind: 'objective',
        frontLabel: 'GES Objective Recall',
        front: toRecallQuestion(obj),
        back: `${obj}\n\nContext (${topic.unitNumber}): ${topic.summary}`,
        formulaHint: formulaText,
      });
    });

    // 4. Key Formulas / Expressions recall card
    if (topic.keyFormulas.length > 0) {
      cards.push({
        id: `${topic.id}::formula`,
        topicId: topic.id,
        subject: topic.subject,
        grade: topic.grade,
        unitNumber: topic.unitNumber,
        topicTitle: topic.title,
        kind: 'formula',
        frontLabel: 'Key Equations & Rules',
        front: `Recall the key expressions or rules for ${topic.title} (${topic.grade})`,
        back: topic.keyFormulas.join('\n'),
        formulaHint: topic.summary,
      });
    }
  }

  return cards;
}

export function filterFlashcards(
  cards: FlashcardItem[],
  subject: SubjectId,
  gradeFilter: GradeFilter,
  topicId?: string | 'ALL'
): FlashcardItem[] {
  return cards.filter((c) => {
    if (c.subject !== subject) return false;
    if (gradeFilter !== 'ALL' && c.grade !== gradeFilter) return false;
    if (topicId && topicId !== 'ALL' && c.topicId !== topicId) return false;
    return true;
  });
}

export function createInitialCardProgress(cardId: string, nowIso: string): FlashcardProgress {
  return {
    cardId,
    repetitions: 0,
    intervalDays: 0,
    easeFactor: 2.5,
    nextReviewAt: nowIso,
  };
}

/**
 * SM-2 Spaced Repetition scheduling update.
 */
export function reviewFlashcardSM2(
  prev: FlashcardProgress | undefined,
  cardId: string,
  rating: FlashcardRating,
  nowIso: string
): FlashcardProgress {
  const base = prev ?? createInitialCardProgress(cardId, nowIso);
  const nowMs = new Date(nowIso).getTime();

  let repetitions = base.repetitions;
  let intervalDays = base.intervalDays;
  let easeFactor = base.easeFactor;
  let nextMs = nowMs;

  if (rating === 'again') {
    repetitions = 0;
    intervalDays = 0;
    easeFactor = Math.max(1.3, Number((easeFactor - 0.2).toFixed(2)));
    // Due again in 1 minute so student re-drills inside the same session
    nextMs = nowMs + 60 * 1000;
  } else if (rating === 'hard') {
    repetitions = repetitions + 1;
    intervalDays = repetitions === 1 ? 1 : Math.max(1, Math.round(base.intervalDays * 1.2));
    easeFactor = Math.max(1.3, Number((easeFactor - 0.14).toFixed(2)));
    nextMs = nowMs + intervalDays * 24 * 60 * 60 * 1000;
  } else if (rating === 'good') {
    if (repetitions === 0) {
      intervalDays = 1;
    } else if (repetitions === 1) {
      intervalDays = 6;
    } else {
      intervalDays = Math.max(1, Math.round(base.intervalDays * easeFactor));
    }
    repetitions = repetitions + 1;
    nextMs = nowMs + intervalDays * 24 * 60 * 60 * 1000;
  } else {
    // easy
    if (repetitions === 0) {
      intervalDays = 4;
    } else if (repetitions === 1) {
      intervalDays = 8;
    } else {
      intervalDays = Math.max(4, Math.round(base.intervalDays * easeFactor * 1.3));
    }
    repetitions = repetitions + 1;
    easeFactor = Math.min(3.0, Number((easeFactor + 0.1).toFixed(2)));
    nextMs = nowMs + intervalDays * 24 * 60 * 60 * 1000;
  }

  return {
    cardId,
    repetitions,
    intervalDays,
    easeFactor,
    nextReviewAt: new Date(nextMs).toISOString(),
    lastRating: rating,
    lastReviewedAt: nowIso,
  };
}

export function formatIntervalLabel(days: number): string {
  if (days <= 0) return '< 1m';
  if (days === 1) return '1d';
  if (days < 30) return `${days}d`;
  const months = Math.round(days / 30);
  return `${months}mo`;
}

export function previewNextIntervals(
  progress: FlashcardProgress | undefined,
  cardId: string,
  nowIso: string
): Record<FlashcardRating, string> {
  return {
    again: '< 1m',
    hard: formatIntervalLabel(reviewFlashcardSM2(progress, cardId, 'hard', nowIso).intervalDays),
    good: formatIntervalLabel(reviewFlashcardSM2(progress, cardId, 'good', nowIso).intervalDays),
    easy: formatIntervalLabel(reviewFlashcardSM2(progress, cardId, 'easy', nowIso).intervalDays),
  };
}

export function isCardDue(progress: FlashcardProgress | undefined, nowIso: string): boolean {
  if (!progress) return true;
  return new Date(progress.nextReviewAt).getTime() <= new Date(nowIso).getTime();
}

export function computeFlashcardDeckStats(
  cards: FlashcardItem[],
  progressMap: Record<string, FlashcardProgress>,
  nowIso: string
): {
  total: number;
  dueNow: number;
  learning: number;
  mastered: number;
} {
  let dueNow = 0;
  let learning = 0;
  let mastered = 0;

  for (const card of cards) {
    const p = progressMap[card.id];
    if (isCardDue(p, nowIso)) {
      dueNow++;
    }
    if (p) {
      if (p.repetitions >= 2 && p.intervalDays >= 6) {
        mastered++;
      } else {
        learning++;
      }
    }
  }

  return {
    total: cards.length,
    dueNow,
    learning,
    mastered,
  };
}

export function buildDueFlashcardQueue(
  cards: FlashcardItem[],
  progressMap: Record<string, FlashcardProgress>,
  nowIso: string
): FlashcardItem[] {
  const due = cards.filter((c) => isCardDue(progressMap[c.id], nowIso));
  return due.sort((a, b) => {
    const pa = progressMap[a.id];
    const pb = progressMap[b.id];
    if (!pa && !pb) return 0;
    if (!pa) return 1; // reviewed-overdue items first, then brand new
    if (!pb) return -1;
    return new Date(pa.nextReviewAt).getTime() - new Date(pb.nextReviewAt).getTime();
  });
}
