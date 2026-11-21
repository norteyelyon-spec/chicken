import test from 'node:test';
import assert from 'node:assert/strict';
import {
  buildTeachingInteractPrompt,
  buildTeachingSessionPrompt,
  computeTeachingMasterySummary,
  formatTextForSpeech,
  lessonPlanToMarkdownNote,
  normalizeInteractionFeedback,
  normalizeLessonPlanResponse,
} from './aiTeaching';

test('formatTextForSpeech converts KaTeX and Markdown into natural spoken phrases', () => {
  const raw = '## Ohm Law\nThe formula is $V = I \\times R$ and $\\frac{P}{V} = I$, with $E = mc^2$. **Remember units!**';
  const spoken = formatTextForSpeech(raw);
  assert.doesNotMatch(spoken, /[$\\#*]/);
  assert.match(spoken, /I times R/);
  assert.match(spoken, /P over V/);
  assert.match(spoken, /mc squared/);
  assert.match(spoken, /Remember units!/);
});

test('formatTextForSpeech respects maxChars boundary cleanly', () => {
  const longText = 'Sentence one explains atomic structure. '.repeat(60);
  const spoken = formatTextForSpeech(longText, 120);
  assert.ok(spoken.length <= 123);
});

test('buildTeachingSessionPrompt and buildTeachingInteractPrompt include subject, grade, and student context', () => {
  const sessionPrompt = buildTeachingSessionPrompt({
    subject: 'chemistry',
    grade: 'SHS2',
    topicTitle: 'Rutherford Gold Foil Experiment',
    style: 'socratic',
    keyFormulas: ['$A = Z + N$'],
  });
  assert.match(sessionPrompt, /SHS2/);
  assert.match(sessionPrompt, /Chemistry/);
  assert.match(sessionPrompt, /Rutherford Gold Foil Experiment/);
  assert.match(sessionPrompt, /A = Z \+ N/);

  const interactPrompt = buildTeachingInteractPrompt({
    lesson: {
      subject: 'chemistry',
      grade: 'SHS2',
      topicTitle: 'Rutherford Gold Foil Experiment',
      style: 'socratic',
    },
    step: {
      stepNumber: 1,
      stageTitle: 'Observations',
      explanation: 'Most alpha particles passed straight through.',
      checkPrompt: 'Why did 1 in 8000 bounce back?',
      checkOptions: ['Empty space', 'Dense positive nucleus', 'Electrons', 'Neutrons'],
      correctOptionIndex: 1,
      hint: 'Think of electrostatic repulsion from concentrated positive charge.',
    },
    actionKind: 'answer-mcq',
    studentInput: 'Empty space',
    selectedOptionIndex: 0,
    studentName: 'Ama',
  });
  assert.match(interactPrompt, /Ama/);
  assert.match(interactPrompt, /INCORRECT/);
  assert.match(interactPrompt, /Dense positive nucleus/);
});

test('normalizeLessonPlanResponse bounds checkOptions and builds spokenScript fallback', () => {
  const plan = normalizeLessonPlanResponse(
    {
      learningObjective: 'Master Mole Concept',
      wassceExamTrap: 'Confusing molar mass with molecular mass',
      steps: [
        {
          stageTitle: 'Avogadro Constant',
          explanation: 'One mole contains $6.02 \\times 10^{23}$ particles.',
          checkPrompt: 'What is $n$ if $N = 6.02 \\times 10^{23}$?',
          checkOptions: ['1 mol', '2 mol'],
          correctOptionIndex: 0,
          hint: 'Divide N by Avogadro constant.',
          explanationAfterCheck: '$n = N / N_A = 1\\text{ mol}$.',
        },
      ],
    },
    { subject: 'chemistry', grade: 'SHS1', topicTitle: 'Mole Concept', style: 'step-by-step' }
  );

  assert.equal(plan.steps.length, 1);
  assert.equal(plan.steps[0].checkOptions.length, 4);
  assert.equal(plan.steps[0].correctOptionIndex, 0);
  assert.doesNotMatch(plan.steps[0].spokenScript, /\$/);

  const md = lessonPlanToMarkdownNote(plan);
  assert.match(md, /# Mole Concept \(SHS1 AI Interactive Lesson\)/);
  assert.match(md, /Common WASSCE Examiner Trap/);
});

test('normalizeInteractionFeedback validates verdict and sanitizes spokenFeedback', () => {
  const fb = normalizeInteractionFeedback(
    {
      verdict: 'partial',
      feedback: 'Good start on $F = ma$, now check units.',
      followUpPrompt: 'What is the SI unit of force?',
      readyToAdvance: false,
      spokenFeedback: 'Good start on $F = ma$. Remember the SI unit is newton.',
    },
    'clarification'
  );
  assert.equal(fb.verdict, 'partial');
  assert.equal(fb.readyToAdvance, false);
  assert.doesNotMatch(fb.spokenFeedback, /\$/);
});

test('computeTeachingMasterySummary computes weighted mastery percentage cleanly', () => {
  const summary = computeTeachingMasterySummary({
    completedStepNumbers: [1, 2, 3],
    totalSteps: 3,
    correctCheckStepNumbers: [1, 2, 3],
  });
  assert.equal(summary.masteryPercentage, 100);
  assert.equal(summary.statusLabel, 'WASSCE Ready');
});
