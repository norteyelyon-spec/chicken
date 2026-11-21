import test from 'node:test';
import assert from 'node:assert/strict';
import { ALL_MCQ_QUESTIONS } from '../data/mcqQuestions';
import { SUBJECT_LIST, SYLLABUS_TOPICS } from '../data/subjects';
import { SYLLABUS_NOTES } from '../data/syllabusNotes';
import { PRACTICAL_EXPERIMENTS } from '../data/practicals';
import { COMPREHENSIVE_CURRICULUM_NOTES } from '../data/syllabusNotes/comprehensiveCurriculum';
import { THEORY_QUESTIONS } from '../data/theoryQuestions';
import {
  computeMathCalculusSample,
  computeOsmosisAndPhotosynthesis,
  computeRadioactiveDecay,
  computeSimpleMachineMetrics,
} from './labPhysics';
import { buildInteractiveVideoScenes } from './noteVideo';
import { buildMCQSession, createDefaultProfile } from './quizEngine';
import {
  buildTodayTimetableNotification,
  DEFAULT_REMINDER_SETTINGS,
  evaluateDailyStudyReminder,
} from './studyReminders';
import { DEFAULT_TIMETABLE_SCHEDULE } from './studyTimetable';

test('MCQ bank contains at least 405 unique questions (>=45 per subject) with no duplicate IDs or prompts', () => {
  assert.ok(
    ALL_MCQ_QUESTIONS.length >= 405,
    `Expected >=405 MCQs, got ${ALL_MCQ_QUESTIONS.length}`
  );

  const ids = new Set<string>();
  const prompts = new Set<string>();

  for (const q of ALL_MCQ_QUESTIONS) {
    assert.ok(!ids.has(q.id), `Duplicate MCQ id detected: ${q.id}`);
    ids.add(q.id);
    const normPrompt = q.prompt.trim().toLowerCase();
    assert.ok(!prompts.has(normPrompt), `Duplicate MCQ prompt detected: ${q.id}`);
    prompts.add(normPrompt);
  }

  for (const sub of SUBJECT_LIST) {
    const count = ALL_MCQ_QUESTIONS.filter((q) => q.subject === sub.id).length;
    assert.ok(count >= 45, `Subject ${sub.id} expected >=45 MCQs, got ${count}`);
  }
});

test('buildMCQSession returns non-repeating question IDs up to 45 per subject', () => {
  for (const sub of SUBJECT_LIST) {
    const session = buildMCQSession(ALL_MCQ_QUESTIONS, {
      subject: sub.id,
      gradeFilter: 'ALL',
      topicIds: [],
      mode: 'study',
      paperType: 'mcq',
      questionCount: 45,
    });
    assert.equal(session.length, 45, `Expected 45 MCQs in session for ${sub.id}`);
    const uniqueIds = new Set(session.map((q) => q.id));
    assert.equal(uniqueIds.size, 45, `Repeated MCQ found inside ${sub.id} session`);
  }
});

test('Theory bank contains at least 405 unique Paper 2 questions (>=45 per subject)', () => {
  assert.ok(
    THEORY_QUESTIONS.length >= 405,
    `Expected >=405 Theory questions, got ${THEORY_QUESTIONS.length}`
  );

  const ids = new Set<string>();
  for (const q of THEORY_QUESTIONS) {
    assert.ok(!ids.has(q.id), `Duplicate Theory id detected: ${q.id}`);
    ids.add(q.id);
    assert.ok(q.parts.length >= 1, `Theory question ${q.id} must have parts`);
  }

  for (const sub of SUBJECT_LIST) {
    const count = THEORY_QUESTIONS.filter((q) => q.subject === sub.id).length;
    assert.ok(count >= 45, `Subject ${sub.id} expected >=45 Theory questions, got ${count}`);
  }
});

test('SYLLABUS_NOTES covers all 81 syllabus units, PDF masterclasses, and comprehensive SHS 1-3 GES notes with valid 1:1 narrationSegments', () => {
  assert.ok(
    COMPREHENSIVE_CURRICULUM_NOTES.length >= 30,
    `Expected >=30 comprehensive notes, got ${COMPREHENSIVE_CURRICULUM_NOTES.length}`
  );
  assert.ok(
    SYLLABUS_NOTES.length >= 130,
    `Expected >=130 standalone syllabus notes, got ${SYLLABUS_NOTES.length}`
  );

  const noteIds = new Set<string>();
  for (const note of SYLLABUS_NOTES) {
    assert.ok(!noteIds.has(note.id), `Duplicate StudyNote id detected: ${note.id}`);
    noteIds.add(note.id);
  }

  for (const topic of SYLLABUS_TOPICS) {
    const hasMatch = SYLLABUS_NOTES.some((n) => n.topicId === topic.id);
    assert.ok(hasMatch, `Missing syllabus note for topic ${topic.id}`);
  }

  const requiredPdfNoteIds = [
    'note-bio-s1-intro-pdf',
    'note-bio-s1-microscopes-pdf',
    'note-chem-s1-daily-life-branches-pdf',
    'note-chem-s1-lab-safety-hazards-pdf',
    'note-chem-s1-storage-fire-control-pdf',
    'note-chem-s1-scientific-method-pdf',
    'note-chem-s1-quantum-orbitals-pdf',
    'note-chem-s1-mass-spec-isotopes-pdf',
    'note-chem-s1-radioactivity-pdf',
    'note-coremath-s1-real-numbers',
    'note-addmath-s1-binary-operations',
    'note-phys-s1-pressure-flotation',
    'note-chem-s3-ghana-metals-environment',
    'note-bio-s1-selected-organisms',
    'note-ict-s2-dbms-internet-protocols',
    'note-english-s3-intonation-conditionals',
    'note-mg-phys-s1-units-thermometry',
    'note-mg-phys-s1-optics-fibers',
    'note-mg-phys-s2-instruments-bjt',
    'note-mg-phys-s3-satellites-conduction-transformers',
    'note-mg-phys-s3-nuclear-logic',
    'note-mg-eng-s1-letters-grammar',
    'note-mg-eng-s2-conditionals-summary-letters',
    'note-mg-eng-s3-devices-tags-reports',
    'note-mg-coremath-s1-financial-venn',
    'note-mg-coremath-s2-polygons-bearings',
    'note-mg-coremath-s3-stats-enlargement',
    'note-mg-addmath-s2-series-binomial',
    'note-mg-addmath-s3-binomial-dist',
    'note-mg-chem-s1-separation-stp',
    'note-mg-chem-s2-cells-faraday',
    'note-mg-chem-s3-processes-environment',
    'note-mg-bio-s1-nutrition-villi',
    'note-mg-bio-s3-trophic-energy',
    'note-mg-soc-s1-symbols-socialization',
    'note-mg-ict-s1-info-processing',
    'note-mg-ict-s2-spreadsheets-cybersecurity',
  ];

  for (const id of requiredPdfNoteIds) {
    const found = SYLLABUS_NOTES.find((n) => n.id === id);
    assert.ok(found, `Missing standalone syllabus note ${id}`);
  }

  const combinedCorpus = SYLLABUS_NOTES.map((n) => n.content).join('\n');
  for (const requiredTerm of [
    'candela',
    '360^\\circ',
    '931.5',
    'NAND',
    'Litotes',
    'Type 3',
    'k^2',
    '22.4',
    'OIL RIG',
    'Contact Process',
    'villi',
    '10\\%',
    'Coat of Arms',
    '$A$1',
  ]) {
    assert.ok(
      combinedCorpus.includes(requiredTerm),
      `Expected GES Master Study Guide term "${requiredTerm}" in SYLLABUS_NOTES`
    );
  }

  for (const note of SYLLABUS_NOTES) {
    const scenes = buildInteractiveVideoScenes(note);
    assert.ok(scenes.length >= 2, `Expected >=2 video scenes for ${note.id}`);
    assert.ok(scenes[0].narration.length > 10, `Missing narration for ${note.id}`);
    assert.ok(scenes.every((s) => s.durationSeconds >= 10), `Scene too short in ${note.id}`);
    assert.ok(scenes.every((s) => Boolean(s.visual3DKind) && s.intuitionHook.length >= 15));
    for (const scene of scenes) {
      const segs = scene.narrationSegments ?? [];
      assert.ok(segs.length >= 1, `Missing narrationSegments for scene ${scene.id} in ${note.id}`);
      assert.equal(segs[0].startFrac, 0, `First segment must start at 0 in ${scene.id}`);
      assert.ok(
        Math.abs(segs[segs.length - 1].endFrac - 1) < 1e-6,
        `Last segment must end at 1 in ${scene.id}`
      );
      for (let i = 0; i < segs.length; i++) {
        const kpIdx = segs[i].keyPointIndex;
        assert.ok(kpIdx === null || (kpIdx >= 0 && kpIdx < scene.keyPoints.length));
        if (i > 0) {
          assert.ok(Math.abs(segs[i].startFrac - segs[i - 1].endFrac) < 1e-6);
        }
      }
    }
  }
});

test('Cross-subject interactive simulator physics & calculus engines produce exact theoretical outputs', () => {
  const quad = computeMathCalculusSample('quadratic', 3.0, 0, 2);
  assert.equal(quad.fx, -0.5);
  assert.equal(quad.derivative, 1.0);
  // Integral of (0.5x^2 - 2x + 1) from 0 to 2 = [x^3/6 - x^2 + x]_0^2 = 8/6 - 4 + 2 = -2/3 ≈ -0.667
  assert.ok(Math.abs(quad.riemannIntegral - -0.667) < 0.01);

  const decay = computeRadioactiveDecay(400, 2.0, 4.0);
  assert.equal(decay.remainingNuclei, 100);
  assert.equal(decay.decayedNuclei, 300);
  assert.equal(decay.activityFractionPct, 25);

  const turgid = computeOsmosisAndPhotosynthesis(0.5, 40, 0.12);
  assert.equal(turgid.cellState, 'Turgid (Hypotonic)');
  assert.equal(turgid.limitingFactor, 'Light Intensity');
  const plasmolysed = computeOsmosisAndPhotosynthesis(5.0, 95, 0.03);
  assert.equal(plasmolysed.cellState, 'Plasmolysed (Hypertonic)');
  assert.equal(plasmolysed.limitingFactor, 'CO₂ Concentration');

  const machine = computeSimpleMachineMetrics(250, 400, 2.0, 30);
  assert.equal(machine.mechanicalAdvantage, 1.6);
  assert.equal(machine.efficiencyPct, 80);
});

test('Timetable-integrated daily reminders include today scheduled subjects', () => {
  const profile = { ...createDefaultProfile(), gradeLevel: 'SHS1' as const, preferredName: 'Kwame' };
  const wednesdayEvening = new Date('2026-01-21T19:00:00');
  const reminder = evaluateDailyStudyReminder({
    profile,
    streak: {
      currentStreak: 4,
      longestStreak: 7,
      lastActiveDate: '2026-01-20',
      questionsSolvedToday: 0,
      totalStudyMinutes: 120,
    },
    settings: { ...DEFAULT_REMINDER_SETTINGS, reminderTime: '18:00' },
    mistakes: [],
    masteryStats: [],
    timetableSchedule: DEFAULT_TIMETABLE_SCHEDULE,
    notes: SYLLABUS_NOTES,
    now: wednesdayEvening,
  });

  assert.equal(reminder.shouldTrigger, true);
  assert.ok(reminder.notification?.message.includes('Wednesday'));
  assert.ok(reminder.notification?.message.includes('Biology'));

  const directAlert = buildTodayTimetableNotification({
    profile,
    timetableSchedule: DEFAULT_TIMETABLE_SCHEDULE,
    notes: SYLLABUS_NOTES,
    now: wednesdayEvening,
  });
  assert.equal(directAlert.kind, 'daily-timetable');
  assert.equal(directAlert.ctaAction, 'videos');
});

test('PRACTICAL_EXPERIMENTS preserves all 16 original labs plus 6 new Grade 10-12 labs (22 total)', () => {
  assert.equal(PRACTICAL_EXPERIMENTS.length, 22);
  const ids = new Set(PRACTICAL_EXPERIMENTS.map((p) => p.id));
  assert.equal(ids.size, 22, 'Practical experiment IDs must be unique');

  const shs1 = PRACTICAL_EXPERIMENTS.filter((p) => p.grade === 'SHS1');
  const shs2 = PRACTICAL_EXPERIMENTS.filter((p) => p.grade === 'SHS2');
  const shs3 = PRACTICAL_EXPERIMENTS.filter((p) => p.grade === 'SHS3');
  assert.ok(shs1.length >= 6, `Expected >=6 Grade 10 (SHS1) sims, got ${shs1.length}`);
  assert.ok(shs2.length >= 6, `Expected >=6 Grade 11 (SHS2) sims, got ${shs2.length}`);
  assert.ok(shs3.length >= 4, `Expected >=4 Grade 12 (SHS3) sims, got ${shs3.length}`);
});


