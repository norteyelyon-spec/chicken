import test from 'node:test';
import assert from 'node:assert/strict';
import { ALL_MCQ_QUESTIONS } from '../data/mcqQuestions';
import {
  AI_RIVALS,
  buildCompetitionDeck,
  computeCompetitionSummary,
  scoreStudentTurn,
  simulateAiOpponentTurn,
} from './competitionsEngine';

test('buildCompetitionDeck returns deterministic unique questions respecting subject and grade fallback', () => {
  const deckA = buildCompetitionDeck(ALL_MCQ_QUESTIONS, 'physics', 'SHS1', 5, 99);
  const deckB = buildCompetitionDeck(ALL_MCQ_QUESTIONS, 'physics', 'SHS1', 5, 99);
  assert.equal(deckA.length, 5);
  assert.deepEqual(
    deckA.map((q) => q.id),
    deckB.map((q) => q.id)
  );
  assert.ok(deckA.every((q) => q.subject === 'physics'));
  assert.equal(new Set(deckA.map((q) => q.id)).size, 5);

  const allGradesDeck = buildCompetitionDeck(ALL_MCQ_QUESTIONS, 'chemistry', 'ALL', 8, 7);
  assert.equal(allGradesDeck.length, 8);
  assert.ok(allGradesDeck.every((q) => q.subject === 'chemistry'));
});

test('scoreStudentTurn rewards correctness, speed bonus, and >=3 streak multipliers', () => {
  const wrong = scoreStudentTurn({ isCorrect: false, elapsedMs: 1200, currentStreak: 4 });
  assert.equal(wrong.pointsAwarded, 0);
  assert.equal(wrong.nextStreak, 0);

  const fastFirst = scoreStudentTurn({ isCorrect: true, elapsedMs: 3000, currentStreak: 0 });
  assert.equal(fastFirst.pointsAwarded, 140);
  assert.equal(fastFirst.nextStreak, 1);

  const streakThree = scoreStudentTurn({ isCorrect: true, elapsedMs: 3000, currentStreak: 2 });
  // 100 base + 40 speed + 30 streak (min(45, (3-1)*15)) = 170
  assert.equal(streakThree.pointsAwarded, 170);
  assert.equal(streakThree.nextStreak, 3);
});

test('simulateAiOpponentTurn yields calibrated accuracy and speed metrics', () => {
  const prof = AI_RIVALS[2];
  let correctCount = 0;
  for (let i = 0; i < 40; i++) {
    const turn = simulateAiOpponentTurn(prof, i, 17);
    assert.ok(turn.thinkMs > 0);
    if (turn.isCorrect) {
      correctCount++;
      assert.ok(turn.pointsAwarded >= 115);
    } else {
      assert.equal(turn.pointsAwarded, 0);
    }
  }
  assert.ok(correctCount > 25, `Expected Prof. Nkrumah AI high accuracy, got ${correctCount}/40`);
});

test('computeCompetitionSummary handles empty and populated match histories', () => {
  const empty = computeCompetitionSummary([]);
  assert.equal(empty.totalMatches, 0);
  assert.equal(empty.winRatePct, 0);
  assert.equal(empty.bestScore, 0);

  const summary = computeCompetitionSummary([
    {
      id: 'm1',
      timestamp: '2026-11-20T10:00:00Z',
      subject: 'physics',
      gradeFilter: 'SHS2',
      aiOpponentId: 'kofi-bot',
      aiOpponentName: 'Kofi Bot',
      studentScore: 680,
      aiScore: 520,
      totalQuestions: 5,
      correctCount: 5,
      accuracyPct: 100,
      durationSeconds: 32,
      won: true,
    },
    {
      id: 'm2',
      timestamp: '2026-11-20T10:15:00Z',
      subject: 'chemistry',
      gradeFilter: 'ALL',
      aiOpponentId: 'prof-nkrumah',
      aiOpponentName: 'Prof. Nkrumah AI',
      studentScore: 420,
      aiScore: 610,
      totalQuestions: 5,
      correctCount: 3,
      accuracyPct: 60,
      durationSeconds: 40,
      won: false,
    },
  ]);

  assert.equal(summary.totalMatches, 2);
  assert.equal(summary.wins, 1);
  assert.equal(summary.winRatePct, 50);
  assert.equal(summary.bestScore, 680);
  assert.equal(summary.averageAccuracyPct, 80);
});
