import test from 'node:test';
import assert from 'node:assert/strict';
import {
  computeMsUntilReminder,
  DEFAULT_REMINDER_SETTINGS,
  diffCalendarDays,
  evaluateDailyStudyReminder,
  formatLocalDateKey,
  parseReminderMinutes,
  sanitizeReminderTime,
} from './studyReminders';
import { createDefaultProfile, type SubjectMasteryStats } from './quizEngine';
import type { MistakeEntry, StreakData } from '../types';

const sampleMastery: SubjectMasteryStats[] = [
  {
    subject: 'physics',
    attemptsCount: 2,
    questionsSolved: 10,
    averagePercentage: 55,
    byGrade: { SHS1: 55, SHS2: 0, SHS3: 0 },
  },
  {
    subject: 'chemistry',
    attemptsCount: 2,
    questionsSolved: 10,
    averagePercentage: 85,
    byGrade: { SHS1: 85, SHS2: 0, SHS3: 0 },
  },
];

const sampleMistakes: MistakeEntry[] = [
  {
    questionId: 'phys-q3',
    subject: 'physics',
    grade: 'SHS1',
    topicId: 'phys-s1-kinematics',
    wrongCount: 2,
    lastMissedAt: '2026-11-17T15:00:00Z',
    lastSelectedIndex: 1,
    mastered: false,
  },
];

test('sanitizeReminderTime, parseReminderMinutes, and computeMsUntilReminder behave accurately', () => {
  assert.equal(sanitizeReminderTime('07:30'), '07:30');
  assert.equal(sanitizeReminderTime('25:99'), '18:00');
  assert.equal(parseReminderMinutes('18:15'), 1095);

  const morning = new Date(2026, 10, 18, 17, 45, 0, 0); // 17:45 local
  assert.equal(computeMsUntilReminder(morning, '18:00'), 15 * 60 * 1000);
  const evening = new Date(2026, 10, 18, 18, 5, 0, 0);
  assert.equal(computeMsUntilReminder(evening, '18:00'), 0);
  assert.equal(formatLocalDateKey(morning), '2026-11-18');
  assert.equal(diffCalendarDays('2026-11-17', '2026-11-18'), 1);
});

test('triggers personalized streak reminder when cutoff time passed and user has not studied today', () => {
  const profile = createDefaultProfile({ preferredName: 'Abena', dailyQuestionGoal: 15 });
  const streak: StreakData = {
    currentStreak: 4,
    longestStreak: 6,
    lastActiveDate: '2026-11-17',
    questionsSolvedToday: 0,
    totalStudyMinutes: 90,
  };

  // Before 18:00 cutoff -> no trigger
  const beforeCutoff = new Date(2026, 10, 18, 17, 30, 0, 0);
  const earlyEval = evaluateDailyStudyReminder({
    profile,
    streak,
    settings: { ...DEFAULT_REMINDER_SETTINGS, reminderTime: '18:00' },
    mistakes: sampleMistakes,
    masteryStats: sampleMastery,
    now: beforeCutoff,
  });
  assert.equal(earlyEval.shouldTrigger, false);
  assert.equal(earlyEval.reason, 'before-cutoff');

  // After 18:00 cutoff -> triggers personalized streak reminder
  const afterCutoff = new Date(2026, 10, 18, 18, 15, 0, 0);
  const lateEval = evaluateDailyStudyReminder({
    profile,
    streak,
    settings: { ...DEFAULT_REMINDER_SETTINGS, reminderTime: '18:00' },
    mistakes: sampleMistakes,
    masteryStats: sampleMastery,
    now: afterCutoff,
  });
  assert.equal(lateEval.shouldTrigger, true);
  assert.equal(lateEval.reason, 'missed-checkin');
  assert.ok(lateEval.notification);
  assert.match(lateEval.notification.title, /Protect your 4-day streak, Abena/);
  assert.match(lateEval.notification.message, /18:00/);
  assert.match(lateEval.notification.message, /1 pending Physics Mistake Bank item/);
  assert.equal(lateEval.notification.ctaAction, 'mistakes');
});

test('suppresses duplicate reminders on the same day or during active snooze, and detects goal completion', () => {
  const profile = createDefaultProfile({ preferredName: 'Kwame', dailyQuestionGoal: 10 });
  const now = new Date(2026, 10, 18, 19, 0, 0, 0);
  const activeTodayStreak: StreakData = {
    currentStreak: 5,
    longestStreak: 5,
    lastActiveDate: '2026-11-18',
    questionsSolvedToday: 10,
    totalStudyMinutes: 120,
  };

  const doneEval = evaluateDailyStudyReminder({
    profile,
    streak: activeTodayStreak,
    settings: DEFAULT_REMINDER_SETTINGS,
    mistakes: [],
    masteryStats: sampleMastery,
    now,
  });
  assert.equal(doneEval.shouldTrigger, false);
  assert.equal(doneEval.reason, 'goal-complete');

  const alreadySentEval = evaluateDailyStudyReminder({
    profile,
    streak: { ...activeTodayStreak, lastActiveDate: '2026-11-17', questionsSolvedToday: 0 },
    settings: { ...DEFAULT_REMINDER_SETTINGS, lastNotifiedDate: '2026-11-18' },
    mistakes: [],
    masteryStats: sampleMastery,
    now,
  });
  assert.equal(alreadySentEval.shouldTrigger, false);
  assert.equal(alreadySentEval.reason, 'already-notified');

  const snoozedEval = evaluateDailyStudyReminder({
    profile,
    streak: { ...activeTodayStreak, lastActiveDate: '2026-11-17', questionsSolvedToday: 0 },
    settings: {
      ...DEFAULT_REMINDER_SETTINGS,
      snoozedUntilIso: new Date(now.getTime() + 15 * 60 * 1000).toISOString(),
    },
    mistakes: [],
    masteryStats: sampleMastery,
    now,
  });
  assert.equal(snoozedEval.shouldTrigger, false);
  assert.equal(snoozedEval.reason, 'snoozed');
});

test('triggers streak-at-risk when multiple days elapsed and supports forcePreview', () => {
  const profile = createDefaultProfile({ preferredName: 'Kojo', dailyQuestionGoal: 15 });
  const now = new Date(2026, 10, 18, 9, 0, 0, 0);
  const gappedStreak: StreakData = {
    currentStreak: 7,
    longestStreak: 9,
    lastActiveDate: '2026-11-15',
    questionsSolvedToday: 0,
    totalStudyMinutes: 200,
  };

  const previewEval = evaluateDailyStudyReminder({
    profile,
    streak: gappedStreak,
    settings: { ...DEFAULT_REMINDER_SETTINGS, reminderTime: '20:00' },
    mistakes: [],
    masteryStats: sampleMastery,
    now,
    forcePreview: true,
  });
  assert.equal(previewEval.shouldTrigger, true);
  assert.equal(previewEval.reason, 'preview');
  assert.equal(previewEval.notification?.kind, 'streak-at-risk');
  assert.equal(previewEval.notification?.urgency, 'urgent');
  assert.match(previewEval.notification?.message ?? '', /3 days since your last logged session/);
  assert.equal(previewEval.notification?.ctaAction, 'quiz');
  assert.equal(previewEval.notification?.subjectId, 'physics');
});
