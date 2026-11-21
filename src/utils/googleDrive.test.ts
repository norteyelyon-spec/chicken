import test from 'node:test';
import assert from 'node:assert/strict';
import {
  clearDriveAccessToken,
  formatNoteAsDriveMarkdown,
  formatTimetableAsDriveMarkdown,
  getDriveAccessToken,
  isDriveConnected,
  parseImportedMarkdownNote,
  sanitizeDriveFileName,
  setDriveAccessToken,
} from './googleDrive.ts';
import {
  buildLocalCurriculumLessonPlan,
  buildLocalVoiceReply,
  evaluateLocalTeachingInteraction,
} from './localTeachingFallback.ts';
import { splitSpeechChunks } from './tutorSpeechClient.ts';
import { createDefaultProfile } from './quizEngine.ts';
import { DEFAULT_TIMETABLE_SCHEDULE } from './studyTimetable.ts';
import type { StudyNote } from '../types/index.ts';

test('Drive OAuth token stays strictly memory-only and clears cleanly', () => {
  clearDriveAccessToken();
  assert.equal(getDriveAccessToken(), null);
  assert.equal(isDriveConnected(), false);

  setDriveAccessToken('ya29.test-memory-token');
  assert.equal(getDriveAccessToken(), 'ya29.test-memory-token');
  assert.equal(isDriveConnected(), true);

  clearDriveAccessToken();
  assert.equal(getDriveAccessToken(), null);
  assert.equal(isDriveConnected(), false);
});

test('Drive Markdown serialization and import preserve subject, grade, and LaTeX content', () => {
  const sampleNote: StudyNote = {
    id: 'note-test-chem',
    title: 'Quantum Orbitals & Aufbau Principle',
    subject: 'chemistry',
    grade: 'SHS1',
    tags: ['Chemistry', 'Orbitals'],
    content: '# Quantum Orbitals\n\nElectron configuration of Chromium: $1s^2 2s^2 2p^6 3s^2 3p^6 3d^5 4s^1$.',
    createdAt: '2026-01-01T00:00:00.000Z',
    updatedAt: '2026-01-01T00:00:00.000Z',
  };

  const md = formatNoteAsDriveMarkdown(sampleNote);
  assert.ok(md.includes('subject: chemistry'));
  assert.ok(md.includes('grade: SHS1'));

  const fileName = sanitizeDriveFileName('Atomic: Orbitals / Subshells?', '.md');
  assert.equal(fileName, 'Atomic- Orbitals - Subshells-.md');

  const imported = parseImportedMarkdownNote(fileName, md, 'physics', 'SHS3');
  assert.equal(imported.title, 'Quantum Orbitals & Aufbau Principle');
  assert.equal(imported.subject, 'chemistry');
  assert.equal(imported.grade, 'SHS1');
  assert.ok(imported.tags.includes('Google-Drive'));
  assert.ok(imported.content.includes('3d^5 4s^1'));

  const ttMd = formatTimetableAsDriveMarkdown(DEFAULT_TIMETABLE_SCHEDULE, createDefaultProfile());
  assert.ok(ttMd.includes('Monday'));
  assert.ok(ttMd.includes('Sunday'));
});

test('Local AI teaching fallback produces multi-stage curriculum lesson and evaluates student response', () => {
  const plan = buildLocalCurriculumLessonPlan({
    subject: 'chemistry',
    grade: 'SHS1',
    topicTitle: 'Radioactivity, Half-Life & Nuclear Decay',
    style: 'step-by-step',
  });
  assert.ok(plan.lessonId.startsWith('lesson-local-'));
  assert.ok(plan.steps.length >= 4);
  assert.ok(plan.steps[0].spokenScript.length > 40);
  assert.ok(plan.learningObjective.length > 20);

  const step = plan.steps[0];
  const passEval = evaluateLocalTeachingInteraction({
    lesson: plan,
    step,
    actionKind: 'answer-mcq',
    studentInput: step.checkOptions[step.correctOptionIndex],
    selectedOptionIndex: step.correctOptionIndex,
    studentName: 'Ama',
  });
  assert.equal(passEval.verdict, 'correct');
  assert.equal(passEval.readyToAdvance, true);

  const hintEval = evaluateLocalTeachingInteraction({
    lesson: plan,
    step,
    actionKind: 'hint',
    studentInput: '',
    studentName: 'Ama',
  });
  assert.equal(hintEval.verdict, 'clarification');
  assert.equal(hintEval.readyToAdvance, false);

  const voiceReply = buildLocalVoiceReply({
    prompt: 'Explain alpha decay and half life briefly',
    studentContext: {
      preferredName: 'Ama',
      gradeLevel: 'SHS1',
      targetYear: 2027,
      schoolName: 'Wesley Girls',
      subjects: ['chemistry', 'physics'],
      overallAccuracy: 78,
      totalQuestionsSolved: 25,
      currentStreak: 3,
      subjectMastery: [],
      pendingMistakes: [],
      recentNoteTitles: [],
      recommendedTopics: [],
    },
  });
  assert.ok(voiceReply.length > 30);
});

test('splitSpeechChunks cleanly segments long narration under Chromium 15s cutoff budget', () => {
  const longText =
    'Welcome to today’s WASSCE Masterclass on quantum mechanical orbitals and electron configuration! ' +
    'In the first shell n equals 1, there is only one s orbital holding 2 electrons. ' +
    'In the second shell n equals 2, there is one s orbital and three p orbitals holding up to 8 electrons total. ' +
    'Notice carefully that chromium has 24 electrons and adopts 3d5 4s1 for extra half-filled stability.';

  const chunks = splitSpeechChunks(longText, 120);
  assert.ok(chunks.length >= 3);
  assert.ok(chunks.every((c) => c.length <= 125));
});
