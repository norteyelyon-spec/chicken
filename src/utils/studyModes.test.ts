import test from 'node:test';
import assert from 'node:assert/strict';
import {
  buildLocalOfflineTutorReply,
  getFocusModeVisibility,
  isEffectiveOfflineMode,
} from './studyModes.ts';
import type { TutorStudentContextPayload } from '../types/index.ts';

test('getFocusModeVisibility hides non-essential chrome and dashboard cards when enabled', () => {
  const normal = getFocusModeVisibility(false);
  assert.equal(normal.showSidebar, true);
  assert.equal(normal.showMobileNav, true);
  assert.equal(normal.showTopStats, true);
  assert.equal(normal.showDashboardHero, true);
  assert.equal(normal.showDashboardSubjectHubs, true);
  assert.equal(normal.showDashboardRecentAndWorkspace, true);
  assert.equal(normal.showDashboardTodayTimetable, true);

  const focused = getFocusModeVisibility(true);
  assert.equal(focused.showSidebar, false);
  assert.equal(focused.showMobileNav, false);
  assert.equal(focused.showTopStats, false);
  assert.equal(focused.showSecondaryHeaderActions, false);
  assert.equal(focused.showReminderBanner, false);
  assert.equal(focused.showFloatingOrb, false);
  assert.equal(focused.showDashboardHero, false);
  assert.equal(focused.showDashboardSubjectHubs, false);
  assert.equal(focused.showDashboardRecentAndWorkspace, false);
  assert.equal(focused.showDashboardTodayTimetable, true);
});

test('isEffectiveOfflineMode activates on browser disconnection or manual toggle', () => {
  assert.equal(isEffectiveOfflineMode({ browserOnline: true, manualOfflineMode: false }), false);
  assert.equal(isEffectiveOfflineMode({ browserOnline: false, manualOfflineMode: false }), true);
  assert.equal(isEffectiveOfflineMode({ browserOnline: true, manualOfflineMode: true }), true);
  assert.equal(isEffectiveOfflineMode({ browserOnline: false, manualOfflineMode: true }), true);
});

test('buildLocalOfflineTutorReply answers from cached notes, mistakes, and recommendations offline', () => {
  const ctx: TutorStudentContextPayload = {
    preferredName: 'Abena',
    gradeLevel: 'SHS2',
    targetYear: 2027,
    schoolName: 'Aburi Girls',
    subjects: ['physics', 'chemistry'],
    overallAccuracy: 78,
    totalQuestionsSolved: 30,
    currentStreak: 4,
    subjectMastery: [],
    pendingMistakes: [
      {
        questionId: 'phys-q-1',
        subject: 'physics',
        grade: 'SHS1',
        topicId: 'phys-1-2',
        topicTitle: 'Kinematics & Projectile Motion',
        prompt: 'Projectile range formula',
        wrongCount: 2,
      },
    ],
    recentNoteTitles: [],
    recommendedTopics: [
      {
        topicId: 'phys-1-2',
        subject: 'physics',
        grade: 'SHS1',
        unitNumber: 'Unit 1.2',
        title: 'Kinematics & Projectile Motion',
        reason: 'Pending mistake item',
        priority: 'high',
      },
    ],
  };

  const planReply = buildLocalOfflineTutorReply({
    prompt: 'Suggest my next study plan',
    studentContext: ctx,
  });
  assert.match(planReply, /Offline Study Priority Plan/);
  assert.match(planReply, /Kinematics & Projectile Motion/);

  const conceptReply = buildLocalOfflineTutorReply({
    prompt: 'Explain Rutherford nuclear atom and gold foil',
    studentContext: ctx,
  });
  assert.match(conceptReply, /Offline Reference/);
  assert.ok(conceptReply.length > 80);
});
