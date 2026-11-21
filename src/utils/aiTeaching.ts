import type {
  GradeLevel,
  SubjectId,
  TeachingActionKind,
  TeachingInteractionFeedback,
  TeachingLessonPlan,
  TeachingStep,
  TeachingStyle,
  TutorStudentContextPayload,
} from '../types/index.ts';

const SUBJECT_NAMES: Record<SubjectId, string> = {
  physics: 'Physics',
  chemistry: 'Chemistry',
  biology: 'Biology',
  addmaths: 'Elective Mathematics',
  ict: 'Information & Communication Technology (ICT)',
  coremath: 'Core Mathematics',
  english: 'English Language',
  integratedscience: 'Integrated Science',
  socialstudies: 'Social Studies',
};

export const TEACHING_STYLE_META: Record<
  TeachingStyle,
  { label: string; summary: string }
> = {
  socratic: {
    label: 'Socratic Guided',
    summary: 'Builds intuition step-by-step with guiding questions before revealing derivations.',
  },
  'step-by-step': {
    label: 'Step-by-Step Derivation',
    summary: 'Clear worked definitions, equations, SI units, and structured WASSCE Paper 2 method.',
  },
  'exam-drill': {
    label: 'WASSCE Exam Drill',
    summary: 'Fast-paced examiner checkpoints, common marking-scheme pitfalls, and speed drills.',
  },
};

/**
 * Convert Markdown + KaTeX math strings into clean, natural spoken prose
 * suitable for Gemini TTS narration (no raw LaTeX delimiters or markdown syntax).
 */
export function formatTextForSpeech(rawText: string, maxChars = 2200): string {
  if (!rawText || typeof rawText !== 'string') return '';

  let text = rawText
    // Remove fenced code blocks, leaving a short spoken cue
    .replace(/```[\s\S]*?```/g, ' See the code example shown on your screen. ')
    // Unwrap \text{...} and \mathrm{...}
    .replace(/\\(?:text|mathrm|mathbf|mathit)\{([^{}]+)\}/g, '$1')
    // Fractions \frac{a}{b} -> a over b
    .replace(/\\frac\{([^{}]+)\}\{([^{}]+)\}/g, '$1 over $2')
    // Common Greek letters & math operators
    .replace(/\\Delta/g, 'Delta ')
    .replace(/\\alpha/g, 'alpha ')
    .replace(/\\beta/g, 'beta ')
    .replace(/\\gamma/g, 'gamma ')
    .replace(/\\theta/g, 'theta ')
    .replace(/\\lambda/g, 'lambda ')
    .replace(/\\mu/g, 'mu ')
    .replace(/\\pi/g, 'pi ')
    .replace(/\\omega/g, 'omega ')
    .replace(/\\Omega/g, 'ohms ')
    .replace(/\\times/g, ' times ')
    .replace(/\\cdot/g, ' times ')
    .replace(/\\div/g, ' divided by ')
    .replace(/\\rightarrow|\\to/g, ' produces ')
    .replace(/\\approx/g, ' is approximately ')
    .replace(/\\leq/g, ' is less than or equal to ')
    .replace(/\\geq/g, ' is greater than or equal to ')
    .replace(/\\neq/g, ' does not equal ')
    .replace(/\\sqrt\{([^{}]+)\}/g, 'square root of $1')
    // Powers like ^2, ^3, ^{-1}
    .replace(/\^\{?2\}?/g, ' squared')
    .replace(/\^\{?3\}?/g, ' cubed')
    .replace(/\^\{([^}]+)\}/g, ' to the power of $1')
    // Strip LaTeX $ delimiters and leftover backslashes/braces
    .replace(/\$\$/g, ' ')
    .replace(/\$/g, '')
    .replace(/\\[a-zA-Z]+/g, ' ')
    .replace(/[{}]/g, '')
    // Strip Markdown headings, bold/italic markers, inline code, links, list bullets
    .replace(/^#{1,6}\s+/gm, '')
    .replace(/[*_`~]/g, '')
    .replace(/^\s*[-+•]\s+/gm, '')
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    // Normalize whitespace
    .replace(/\s+/g, ' ')
    .trim();

  if (text.length > maxChars) {
    const truncated = text.slice(0, maxChars);
    const lastPeriod = truncated.lastIndexOf('.');
    text = lastPeriod > maxChars * 0.6 ? truncated.slice(0, lastPeriod + 1) : `${truncated.trim()}...`;
  }

  return text;
}

export function buildTeachingSessionPrompt(params: {
  subject: SubjectId;
  grade: GradeLevel;
  topicTitle: string;
  style: TeachingStyle;
  topicSummary?: string;
  keyFormulas?: string[];
  studentContext?: TutorStudentContextPayload;
}): string {
  const { subject, grade, topicTitle, style, topicSummary, keyFormulas, studentContext } = params;
  const subjectName = SUBJECT_NAMES[subject] ?? subject;
  const styleDesc = TEACHING_STYLE_META[style]?.summary ?? TEACHING_STYLE_META.socratic.summary;

  const studentLine = studentContext
    ? `Student: ${studentContext.preferredName} (${studentContext.gradeLevel}, overall accuracy ${studentContext.overallAccuracy}%, streak ${studentContext.currentStreak} days). Pending weak topics: ${
        studentContext.pendingMistakes.length > 0
          ? studentContext.pendingMistakes.map((m) => m.topicTitle).join(', ')
          : 'none'
      }.`
    : 'Student: Ghanaian Senior High School WASSCE Candidate.';

  return `You are an expert, warm, human-like Ghanaian Senior High School (${grade}) ${subjectName} Master Teacher aligned with the GES/NaCCA curriculum and WAEC WASSCE marking scheme.
${studentLine}

Design a thorough, deeply intuitive, unhurried interactive lesson on:
- Topic: ${topicTitle}
- Subject & Form: ${subjectName} (${grade})
- Teaching Approach (${style}): ${styleDesc}
${topicSummary ? `- Syllabus Context / Note Excerpt: ${topicSummary.slice(0, 1500)}` : ''}
${keyFormulas && keyFormulas.length > 0 ? `- Reference Expressions: ${keyFormulas.join('; ')}` : ''}

REQUIREMENTS FOR THE 4 PROGRESSIVE STEPS:
- Step 1: Deep Intuitive Foundation & Visual Picture (relatable real-world analogy, exact WAEC definition, and why the idea works)
- Step 2: Formula Derivation & Symbol-by-Symbol Breakdown (MANDATORY: explain what every single symbol/letter means, its units, why the formula has that structure, and how changing one variable affects the result)
- Step 3: Full Long-Method Worked Example (step-by-step substitution without skipping algebra or intermediate units)
- Step 4: WASSCE Exam Application, Reverse Problems & Pitfall Check (connect to Paper 1/2/3 questions)

STRICT OUTPUT RULES:
1. Return valid JSON matching the schema with 3 to 4 comprehensive items in "steps" (prefer 4 deep steps).
2. Use Markdown + KaTeX delimiters ($...$) in "explanation", "keyEquation", "hint", and "explanationAfterCheck". NEVER show a bare equation without explaining what every symbol represents and why the relationship holds!
3. Write "spokenScript" for each step in warm, lively, human-teacher conversational English (5-8 full, flowing sentences, NO dollar signs, NO backslashes, NO markdown asterisks — pronounce equations AND explain every variable aloud, e.g. "A equals P times 1 plus r over 100 to the power of n, where P is your starting money, r is the percentage interest rate per period, and n is the total number of compounding periods").
4. Each step MUST include a distinct 4-option check-for-understanding question ("checkOptions" length 4, "correctOptionIndex" 0..3) and a helpful "hint".
5. Include a specific "wassceExamTrap" warning about what costs WAEC candidates marks on this topic.`;
}

export function buildTeachingInteractPrompt(params: {
  lesson: Pick<TeachingLessonPlan, 'subject' | 'grade' | 'topicTitle' | 'style'>;
  step: Pick<
    TeachingStep,
    'stepNumber' | 'stageTitle' | 'explanation' | 'checkPrompt' | 'checkOptions' | 'correctOptionIndex' | 'hint'
  >;
  actionKind: TeachingActionKind;
  studentInput: string;
  selectedOptionIndex?: number | null;
  studentName?: string;
}): string {
  const { lesson, step, actionKind, studentInput, selectedOptionIndex, studentName = 'Scholar' } = params;
  const subjectName = SUBJECT_NAMES[lesson.subject] ?? lesson.subject;
  const correctLetter = ['A', 'B', 'C', 'D'][step.correctOptionIndex] ?? 'A';
  const correctText = step.checkOptions[step.correctOptionIndex] ?? '';

  let interactionContext = '';
  if (actionKind === 'answer-mcq' && typeof selectedOptionIndex === 'number') {
    const pickedLetter = ['A', 'B', 'C', 'D'][selectedOptionIndex] ?? '?';
    const pickedText = step.checkOptions[selectedOptionIndex] ?? studentInput;
    const isRight = selectedOptionIndex === step.correctOptionIndex;
    interactionContext = `The student (${studentName}) clicked option ${pickedLetter}: "${pickedText}".
Checkpoint Question: "${step.checkPrompt}"
Correct Option: ${correctLetter} ("${correctText}").
Evaluation fact: Their choice is ${isRight ? 'CORRECT' : 'INCORRECT'}.
${isRight ? 'Affirm why their reasoning is right, explain any underlying formula symbols clearly, and deepen with a brief follow-up prompt.' : 'Do NOT just scold; explain clearly why that option is a trap, address the underlying misconception, break down any formula terms involved, and guide them cleanly toward the right principle.'}`;
  } else if (actionKind === 'answer-open') {
    interactionContext = `The student (${studentName}) submitted their own written/spoken explanation or answer: "${studentInput}".
Evaluate their scientific/mathematical accuracy honestly against GES WASSCE standards for Step ${step.stepNumber} ("${step.stageTitle}"). Praise accurate parts, correct any missing units/definitions/terms, and set verdict to 'correct', 'partial', or 'needs-review'.`;
  } else if (actionKind === 'simpler-analogy') {
    interactionContext = `The student (${studentName}) asked for a SIMPLER ANALOGY for Step ${step.stepNumber} ("${step.stageTitle}"). Explain the idea using an intuitive everyday Ghanaian / relatable analogy and explain what every symbol stands for, set verdict to 'clarification', and keep readyToAdvance false unless they also answered.`;
  } else if (actionKind === 'hint') {
    interactionContext = `The student (${studentName}) asked for a SOCRATIC HINT on the checkpoint "${step.checkPrompt}" without spoiling option ${correctLetter} directly. Give a guiding clue (formula meaning or first step), set verdict to 'clarification'.`;
  } else if (actionKind === 'worked-example') {
    interactionContext = `The student (${studentName}) asked for an EXTRA WORKED EXAMPLE illustrating "${step.stageTitle}". Provide a complete, step-by-step numbered WASSCE Paper 2 long-method worked example explaining every formula variable and SI unit, set verdict to 'clarification'.`;
  } else {
    interactionContext = `The student (${studentName}) asked this question during Step ${step.stepNumber}: "${studentInput}". Answer thoroughly, clearly, and encouragingly using GES WASSCE standards (explaining every formula symbol mentioned), set verdict to 'clarification'.`;
  }

  return `You are an interactive WASSCE ${subjectName} (${lesson.grade}) human-like AI Teacher currently guiding ${studentName} through:
Topic: ${lesson.topicTitle}
Current Step (${step.stepNumber}): ${step.stageTitle}
Step Summary: ${step.explanation.slice(0, 750)}

INTERACTION:
${interactionContext}

OUTPUT RULES:
- Return JSON matching the schema.
- In "feedback" and "misconceptionOrNote", use Markdown + KaTeX ($...$) and always explain the meaning of every symbol in any formula used.
- In "spokenFeedback", write 3–5 natural, warm spoken sentences suitable for continuous text-to-speech (NO dollar signs, NO backslashes, NO markdown formatting).`;
}

export function normalizeLessonPlanResponse(
  raw: Record<string, unknown>,
  meta: {
    subject: SubjectId;
    grade: GradeLevel;
    topicTitle: string;
    style: TeachingStyle;
  }
): TeachingLessonPlan {
  const rawSteps = Array.isArray(raw.steps) ? raw.steps : [];
  const normalizedSteps: TeachingStep[] = rawSteps.slice(0, 5).map((item, idx) => {
    const obj = (item && typeof item === 'object' ? item : {}) as Record<string, unknown>;
    const rawOpts = Array.isArray(obj.checkOptions) ? obj.checkOptions.map(String) : [];
    while (rawOpts.length < 4) {
      rawOpts.push(`Option ${String.fromCharCode(65 + rawOpts.length)}`);
    }
    const checkOptions: [string, string, string, string] = [
      rawOpts[0] || 'Option A',
      rawOpts[1] || 'Option B',
      rawOpts[2] || 'Option C',
      rawOpts[3] || 'Option D',
    ];
    const parsedCorrect = Number(obj.correctOptionIndex);
    const correctOptionIndex: 0 | 1 | 2 | 3 =
      parsedCorrect === 0 || parsedCorrect === 1 || parsedCorrect === 2 || parsedCorrect === 3
        ? parsedCorrect
        : 0;

    const explanation = String(obj.explanation ?? '').trim() || `Core ideas for ${meta.topicTitle}.`;
    const spokenRaw = String(obj.spokenScript ?? '').trim();
    const spokenScript = formatTextForSpeech(spokenRaw || explanation, 1900);

    return {
      stepNumber: idx + 1,
      stageTitle: String(obj.stageTitle ?? `Step ${idx + 1}`).trim(),
      explanation,
      keyEquation: obj.keyEquation ? String(obj.keyEquation).trim() : undefined,
      realWorldExample: obj.realWorldExample ? String(obj.realWorldExample).trim() : undefined,
      spokenScript,
      checkPrompt: String(obj.checkPrompt ?? 'Check your understanding of this concept:').trim(),
      checkOptions,
      correctOptionIndex,
      hint: String(obj.hint ?? 'Re-read the governing definition and check your SI units.').trim(),
      explanationAfterCheck: String(
        obj.explanationAfterCheck ?? 'Review the key relationship shown in this stage.'
      ).trim(),
    };
  });

  if (normalizedSteps.length === 0) {
    throw new Error('The AI Teacher returned an empty lesson plan. Please try again.');
  }

  return {
    lessonId: `teach-${Date.now()}`,
    subject: meta.subject,
    grade: meta.grade,
    topicTitle: meta.topicTitle.trim(),
    style: meta.style,
    learningObjective: String(
      raw.learningObjective ?? `Master ${meta.topicTitle} to WASSCE ${meta.grade} standard.`
    ).trim(),
    steps: normalizedSteps,
    wassceExamTrap: String(
      raw.wassceExamTrap ?? 'Always state definitions precisely and include SI units in numerical steps.'
    ).trim(),
  };
}

export function normalizeInteractionFeedback(
  raw: Record<string, unknown>,
  fallbackVerdict: TeachingInteractionFeedback['verdict'] = 'clarification'
): TeachingInteractionFeedback {
  const validVerdicts: TeachingInteractionFeedback['verdict'][] = [
    'correct',
    'partial',
    'needs-review',
    'clarification',
  ];
  const verdict = validVerdicts.includes(raw.verdict as TeachingInteractionFeedback['verdict'])
    ? (raw.verdict as TeachingInteractionFeedback['verdict'])
    : fallbackVerdict;

  const feedback = String(raw.feedback ?? '').trim() || 'Let us examine that step together.';
  const spokenRaw = String(raw.spokenFeedback ?? '').trim();

  return {
    verdict,
    feedback,
    misconceptionOrNote: raw.misconceptionOrNote ? String(raw.misconceptionOrNote).trim() : undefined,
    followUpPrompt: String(
      raw.followUpPrompt ?? 'Try explaining the main relationship or select an option above.'
    ).trim(),
    readyToAdvance: Boolean(raw.readyToAdvance),
    spokenFeedback: formatTextForSpeech(spokenRaw || feedback, 700),
  };
}

export function computeTeachingMasterySummary(params: {
  completedStepNumbers: number[];
  totalSteps: number;
  correctCheckStepNumbers: number[];
}): {
  stepsCompleted: number;
  totalSteps: number;
  checksMastered: number;
  masteryPercentage: number;
  statusLabel: string;
} {
  const totalSteps = Math.max(1, params.totalSteps);
  const completedSet = new Set(params.completedStepNumbers);
  const masteredSet = new Set(params.correctCheckStepNumbers);
  const stepsCompleted = Math.min(totalSteps, completedSet.size);
  const checksMastered = Math.min(totalSteps, masteredSet.size);
  const masteryPercentage = Math.round(((stepsCompleted * 0.4 + checksMastered * 0.6) / totalSteps) * 100);

  let statusLabel = 'Getting Started';
  if (masteryPercentage >= 90) statusLabel = 'WASSCE Ready';
  else if (masteryPercentage >= 60) statusLabel = 'Strong Progress';
  else if (masteryPercentage > 0) statusLabel = 'In Progress';

  return {
    stepsCompleted,
    totalSteps,
    checksMastered,
    masteryPercentage,
    statusLabel,
  };
}

export function lessonPlanToMarkdownNote(lesson: TeachingLessonPlan): string {
  const stepSections = lesson.steps
    .map(
      (s) => `## Step ${s.stepNumber}: ${s.stageTitle}\n\n${s.explanation}${
        s.keyEquation ? `\n\n**Key Expression:** ${s.keyEquation}` : ''
      }${s.realWorldExample ? `\n\n**Application:** ${s.realWorldExample}` : ''}\n\n**Checkpoint:** ${
        s.checkPrompt
      }\n- **Answer:** ${s.checkOptions[s.correctOptionIndex]}\n- **Why:** ${s.explanationAfterCheck}`
    )
    .join('\n\n---\n\n');

  return `# ${lesson.topicTitle} (${lesson.grade} AI Interactive Lesson)\n\n**Learning Objective:** ${lesson.learningObjective}\n\n${stepSections}\n\n## Common WASSCE Examiner Trap\n${lesson.wassceExamTrap}\n`;
}
