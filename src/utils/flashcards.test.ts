import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import {
  buildDueFlashcardQueue,
  computeFlashcardDeckStats,
  filterFlashcards,
  generateFlashcardsFromTopics,
  previewNextIntervals,
  reviewFlashcardSM2,
} from './flashcards.ts';
import type { SyllabusTopic } from '../types/index.ts';

const SAMPLE_TOPICS: SyllabusTopic[] = [
  {
    id: 'phys-sample',
    subject: 'physics',
    grade: 'SHS1',
    unitNumber: 'Unit 1.2',
    title: 'Kinematics & Projectile Motion',
    summary: 'Equations of uniformly accelerated motion and 2D projectiles.',
    objectives: [
      'Apply SUVAT equations to free-fall motion.',
      'Distinguish between scalar speed and vector velocity.',
    ],
    keyFormulas: ['$v^2 = u^2 + 2as$'],
    keyTerms: [
      {
        term: 'Projectile Range ($R$)',
        definition: 'Horizontal distance covered before returning to launch elevation.',
      },
    ],
    estimatedMinutes: 40,
  },
  {
    id: 'eng-sample',
    subject: 'english',
    grade: 'SHS2',
    unitNumber: 'Unit 2.1',
    title: 'Concord & Sentence Clauses',
    summary: 'Subject-verb agreement and subordinate clauses.',
    objectives: ['Identify noun, adjectival, and adverbial clauses in context.'],
    keyFormulas: [],
    estimatedMinutes: 35,
  },
];

describe('flashcards automatic generator & SM-2 spaced repetition', () => {
  it('automatically generates overview, key term, objective, and formula cards from SYLLABUS_TOPICS', () => {
    const cards = generateFlashcardsFromTopics(SAMPLE_TOPICS);
    const physCards = filterFlashcards(cards, 'physics', 'SHS1');
    const engCards = filterFlashcards(cards, 'english', 'ALL');

    // Physics topic: 1 overview + 1 explicit keyTerm + 2 objectives + 1 formula = 5 cards
    assert.equal(physCards.length, 5);
    assert.ok(physCards.some((c) => c.kind === 'term' && c.front.includes('Projectile Range')));
    assert.ok(physCards.some((c) => c.kind === 'formula' && c.back.includes('v^2 = u^2 + 2as')));
    assert.ok(physCards.some((c) => c.kind === 'objective' && c.front.startsWith('How do you distinguish')));

    // English topic without keyTerms/keyFormulas: still automatically generates overview + objective cards
    assert.equal(engCards.length, 2);
    assert.equal(engCards[0].kind, 'overview');
    assert.equal(engCards[1].kind, 'objective');
  });

  it('schedules SM-2 intervals accurately across again, hard, good, and easy ratings', () => {
    const t0 = '2026-11-16T12:00:00.000Z';
    const p1 = reviewFlashcardSM2(undefined, 'c1', 'good', t0);
    assert.equal(p1.repetitions, 1);
    assert.equal(p1.intervalDays, 1);

    const t1 = '2026-11-17T12:00:00.000Z';
    const p2 = reviewFlashcardSM2(p1, 'c1', 'good', t1);
    assert.equal(p2.repetitions, 2);
    assert.equal(p2.intervalDays, 6);

    const preview = previewNextIntervals(p2, 'c1', t1);
    assert.equal(preview.again, '< 1m');
    assert.ok(preview.easy.endsWith('d'));

    // Missing with "again" resets repetitions and decreases ease factor
    const pReset = reviewFlashcardSM2(p2, 'c1', 'again', t1);
    assert.equal(pReset.repetitions, 0);
    assert.equal(pReset.intervalDays, 0);
    assert.ok(pReset.easeFactor < p2.easeFactor);
  });

  it('computes due queue and deck mastery stats accurately', () => {
    const cards = generateFlashcardsFromTopics(SAMPLE_TOPICS);
    const now = '2026-11-16T12:00:00.000Z';
    const future = '2026-11-25T12:00:00.000Z';

    const progressMap = {
      [cards[0].id]: {
        cardId: cards[0].id,
        repetitions: 2,
        intervalDays: 6,
        easeFactor: 2.5,
        nextReviewAt: future,
      },
      [cards[1].id]: {
        cardId: cards[1].id,
        repetitions: 1,
        intervalDays: 1,
        easeFactor: 2.5,
        nextReviewAt: '2026-11-15T12:00:00.000Z', // overdue
      },
    };

    const stats = computeFlashcardDeckStats(cards, progressMap, now);
    assert.equal(stats.total, 7);
    assert.equal(stats.mastered, 1);
    assert.equal(stats.learning, 1);
    assert.equal(stats.dueNow, 6); // 7 total - 1 scheduled in future

    const queue = buildDueFlashcardQueue(cards, progressMap, now);
    assert.equal(queue.length, 6);
    assert.equal(queue[0].id, cards[1].id); // Overdue card prioritized first
  });
});
