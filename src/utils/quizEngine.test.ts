import test from 'node:test';
import assert from 'node:assert/strict';
import {
  buildMCQSession,
  computeOverallAnalytics,
  computeSubjectMastery,
  formatDurationClock,
  gradeMCQSession,
  gradeTheorySession,
  insertSymbolAtCursor,
  updateDailyStreak,
  updateMistakeBank,
  validateBackupPayload,
} from './quizEngine';
import type { ExamAttempt, MCQQuestion, MistakeEntry, StreakData, SyllabusTopic } from '../types';

const sampleMCQs: MCQQuestion[] = [
  {
    id: 'phys-1',
    subject: 'physics',
    grade: 'SHS1',
    topicId: 'phys-s1-kinematics',
    topicTitle: 'Kinematics',
    yearTag: 'WASSCE 2022',
    prompt: 'Sample Q1',
    options: ['A', 'B', 'C', 'D'],
    correctIndex: 1,
    stepByStepWorkings: 'Step 1',
    optionExplanations: ['No', 'Yes', 'No', 'No'],
  },
  {
    id: 'phys-2',
    subject: 'physics',
    grade: 'SHS2',
    topicId: 'phys-s2-optics',
    topicTitle: 'Optics',
    yearTag: 'WASSCE 2023',
    prompt: 'Sample Q2',
    options: ['A', 'B', 'C', 'D'],
    correctIndex: 2,
    stepByStepWorkings: 'Step 2',
    optionExplanations: ['No', 'No', 'Yes', 'No'],
  },
  {
    id: 'chem-1',
    subject: 'chemistry',
    grade: 'SHS1',
    topicId: 'chem-s1-atoms',
    topicTitle: 'Atomic Structure',
    yearTag: 'WASSCE 2021',
    prompt: 'Sample Chem',
    options: ['A', 'B', 'C', 'D'],
    correctIndex: 0,
    stepByStepWorkings: 'Step C',
    optionExplanations: ['Yes', 'No', 'No', 'No'],
  },
];

test('buildMCQSession filters by subject/grade and supports custom counts above pool size', () => {
  const exactPool = buildMCQSession(
    sampleMCQs,
    {
      subject: 'physics',
      gradeFilter: 'SHS1',
      topicIds: [],
      mode: 'study',
      paperType: 'mcq',
      questionCount: 1,
    },
    42
  );
  assert.equal(exactPool.length, 1);
  assert.equal(exactPool[0].id, 'phys-1');

  const expandedPool = buildMCQSession(
    sampleMCQs,
    {
      subject: 'physics',
      gradeFilter: 'ALL',
      topicIds: [],
      mode: 'exam',
      paperType: 'mcq',
      questionCount: 10,
    },
    99
  );
  assert.equal(expandedPool.length, 2);
  assert.equal(new Set(expandedPool.map((q) => q.id)).size, 2);
  assert.ok(expandedPool.every((q) => q.subject === 'physics'));
});

test('gradeMCQSession and updateMistakeBank accurately score and track mistakes', () => {
  const questions = sampleMCQs.slice(0, 2);
  const graded = gradeMCQSession(questions, { 0: 1, 1: 0 }); // Q1 right, Q2 wrong
  assert.equal(graded.score, 1);
  assert.equal(graded.maxScore, 2);
  assert.equal(graded.percentage, 50);

  const initialMistakes: MistakeEntry[] = [];
  const afterFirst = updateMistakeBank(
    initialMistakes,
    questions,
    graded.records,
    '2026-11-16T10:00:00Z'
  );
  assert.equal(afterFirst.length, 1);
  assert.equal(afterFirst[0].questionId, 'phys-2');
  assert.equal(afterFirst[0].wrongCount, 1);
  assert.equal(afterFirst[0].mastered, false);

  // Re-answering Q2 correctly marks it mastered
  const retry = gradeMCQSession([questions[1]], { 0: 2 });
  const afterRetry = updateMistakeBank(
    afterFirst,
    [questions[1]],
    retry.records,
    '2026-11-16T11:00:00Z'
  );
  assert.equal(afterRetry[0].mastered, true);
});

test('gradeTheorySession clamps awarded marks and computes percentage', () => {
  const result = gradeTheorySession([
    [
      { partLabel: '(a)', responseText: 'ans', awardedMarks: 2, maxMarks: 3 },
      { partLabel: '(b)', responseText: 'ans2', awardedMarks: 10, maxMarks: 5 }, // clamped to 5
    ],
  ]);
  assert.equal(result.score, 7);
  assert.equal(result.maxScore, 8);
  assert.equal(result.percentage, 88);
});

test('computeOverallAnalytics and computeSubjectMastery aggregate correctly', () => {
  const attempts: ExamAttempt[] = [
    {
      id: 'a1',
      timestamp: '2026-11-15T10:00:00Z',
      subject: 'physics',
      gradeFilter: 'SHS2',
      paperType: 'mcq',
      mode: 'exam',
      topicTitles: ['Optics'],
      totalQuestions: 10,
      score: 8,
      maxScore: 10,
      percentage: 80,
      durationSeconds: 300,
    },
    {
      id: 'a2',
      timestamp: '2026-11-16T10:00:00Z',
      subject: 'physics',
      gradeFilter: 'SHS1',
      paperType: 'mcq',
      mode: 'study',
      topicTitles: ['Kinematics'],
      totalQuestions: 10,
      score: 6,
      maxScore: 10,
      percentage: 60,
      durationSeconds: 300,
    },
  ];
  const overall = computeOverallAnalytics(attempts);
  assert.equal(overall.testsCompleted, 2);
  assert.equal(overall.totalQuestionsSolved, 20);
  assert.equal(overall.overallAccuracy, 70);
  assert.equal(overall.totalStudyMinutes, 10);

  const topics: SyllabusTopic[] = [];
  const mastery = computeSubjectMastery(attempts, ['physics', 'chemistry'], topics);
  assert.equal(mastery[0].averagePercentage, 70);
  assert.equal(mastery[0].byGrade.SHS2, 80);
  assert.equal(mastery[1].averagePercentage, 0);
});

test('updateDailyStreak increments consecutive days and resets after gap', () => {
  const streak: StreakData = {
    currentStreak: 2,
    longestStreak: 2,
    lastActiveDate: '2026-11-15',
    questionsSolvedToday: 5,
    totalStudyMinutes: 15,
  };
  const sameDay = updateDailyStreak(streak, '2026-11-15', 3, 5);
  assert.equal(sameDay.currentStreak, 2);
  assert.equal(sameDay.questionsSolvedToday, 8);

  const nextDay = updateDailyStreak(sameDay, '2026-11-16', 4, 10);
  assert.equal(nextDay.currentStreak, 3);
  assert.equal(nextDay.longestStreak, 3);
  assert.equal(nextDay.questionsSolvedToday, 4);

  const gapped = updateDailyStreak(nextDay, '2026-11-19', 2, 5);
  assert.equal(gapped.currentStreak, 1);
  assert.equal(gapped.longestStreak, 3);
});

test('insertSymbolAtCursor, formatDurationClock, and validateBackupPayload behave cleanly', () => {
  const inserted = insertSymbolAtCursor('V = I × R', 'Ω', 9, 9);
  assert.equal(inserted.nextValue, 'V = I × RΩ');
  assert.equal(inserted.nextCursor, 10);

  assert.equal(formatDurationClock(125), '02:05');
  assert.equal(validateBackupPayload({ version: 1, profile: { fullName: 'Ama' }, attempts: [], mistakes: [], notes: [] }), true);
  assert.equal(validateBackupPayload({ bad: true }), false);
});
