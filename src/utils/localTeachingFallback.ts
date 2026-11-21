import { INITIAL_NOTES } from '../data/defaultNotes.ts';
import {
  getAllCachedMcqs,
  getCachedMcqsForSubject,
  getCachedSyllabusNotes,
} from '../data/curriculumLoader.ts';
import { SUBJECTS, SYLLABUS_TOPICS } from '../data/subjects.ts';
import type {
  GradeLevel,
  MCQQuestion,
  StudyNote,
  SubjectId,
  TeachingActionKind,
  TeachingInteractionFeedback,
  TeachingLessonPlan,
  TeachingStep,
  TeachingStyle,
  TutorStudentContextPayload,
} from '../types/index.ts';
import { explainFormulaInDepth, markdownToPlainSpeech } from './noteVideo.ts';

function resolveNotePool(notes?: StudyNote[]): StudyNote[] {
  if (notes?.length) return notes;
  return getCachedSyllabusNotes() ?? INITIAL_NOTES;
}

function pickMatchingNote(
  subject: SubjectId,
  grade: GradeLevel,
  topicTitle: string,
  notes?: StudyNote[]
): StudyNote | undefined {
  const pool = resolveNotePool(notes);
  const lower = topicTitle.toLowerCase();
  const exactTitle = pool.find(
    (n) => n.subject === subject && n.title.toLowerCase() === lower
  );
  if (exactTitle) return exactTitle;

  const partial = pool.find(
    (n) =>
      n.subject === subject &&
      (n.title.toLowerCase().includes(lower.slice(0, 14)) ||
        lower.includes(n.title.toLowerCase().slice(0, 14)))
  );
  if (partial) return partial;

  return pool.find((n) => n.subject === subject && n.grade === grade) ?? pool[0];
}

function extractNoteSections(content: string): { heading: string; summary: string; equation: string }[] {
  const lines = content.replace(/\r\n/g, '\n').split('\n');
  const sections: { heading: string; points: string[]; equations: string[] }[] = [];
  let current: { heading: string; points: string[]; equations: string[] } | null = null;

  for (const rawLine of lines) {
    const h = rawLine.match(/^#{1,3}\s+(.+)$/);
    if (h) {
      if (current && (current.points.length > 0 || current.equations.length > 0)) {
        sections.push(current);
      }
      current = { heading: h[1].replace(/\*\*/g, '').trim(), points: [], equations: [] };
      continue;
    }
    if (!current) {
      current = { heading: 'Core Overview', points: [], equations: [] };
    }
    const trimmed = rawLine.trim();
    if (!trimmed || trimmed.startsWith('```') || trimmed.startsWith('|---')) continue;
    if (trimmed.startsWith('$$')) {
      current.equations.push(trimmed.replace(/\$/g, '').trim());
      continue;
    }
    const clean = trimmed
      .replace(/^[-*]\s+/, '')
      .replace(/^\|/, '')
      .replace(/\|$/, '')
      .replace(/\*\*/g, '')
      .trim();
    if (clean && current.points.length < 4) {
      current.points.push(clean);
    }
  }
  if (current && (current.points.length > 0 || current.equations.length > 0)) {
    sections.push(current);
  }

  return sections.map((sec) => ({
    heading: sec.heading,
    summary: sec.points.join(' ').slice(0, 380) || sec.heading,
    equation: sec.equations[0] ?? '',
  }));
}

export function buildLocalCurriculumLessonPlan(params: {
  subject: SubjectId;
  grade: GradeLevel;
  topicTitle: string;
  style: TeachingStyle;
  topicSummary?: string;
  keyFormulas?: string[];
  notes?: StudyNote[];
  mcqPool?: MCQQuestion[];
}): TeachingLessonPlan {
  const subjectName = SUBJECTS[params.subject]?.name ?? params.subject;
  const matchedTopic =
    SYLLABUS_TOPICS.find(
      (t) =>
        t.subject === params.subject &&
        (t.title.toLowerCase() === params.topicTitle.toLowerCase() ||
          t.title.toLowerCase().includes(params.topicTitle.toLowerCase().slice(0, 12)))
    ) ?? SYLLABUS_TOPICS.find((t) => t.subject === params.subject && t.grade === params.grade);

  const matchedNote = pickMatchingNote(
    params.subject,
    params.grade,
    params.topicTitle,
    params.notes
  );
  const noteSections = matchedNote ? extractNoteSections(matchedNote.content) : [];
  const mcqs =
    params.mcqPool ??
    getCachedMcqsForSubject(params.subject) ??
    getAllCachedMcqs();
  const topicMcqs = mcqs.filter(
    (q) =>
      q.subject === params.subject &&
      (matchedTopic ? q.topicId === matchedTopic.id : q.grade === params.grade)
  );
  const fallbackMcqs =
    topicMcqs.length >= 2
      ? topicMcqs
      : mcqs.filter((q) => q.subject === params.subject);

  const formulaList = params.keyFormulas?.length
    ? params.keyFormulas
    : matchedTopic?.keyFormulas ?? [];

  const desiredSteps = 4;
  const steps: TeachingStep[] = [];

  for (let i = 0; i < desiredSteps; i++) {
    const sec = noteSections[i];
    const mcq = fallbackMcqs[i % Math.max(1, fallbackMcqs.length)];
    const stageTitles = [
      sec?.heading || `Core Principles of ${params.topicTitle}`,
      sec?.heading || `Quantitative Relations & Key Laws`,
      sec?.heading || `Applied Ghanaian & WASSCE Examples`,
      sec?.heading || `WASSCE Examination Synthesis & Pitfalls`,
    ];
    const rawExplanation =
      sec?.summary ||
      params.topicSummary ||
      matchedTopic?.summary ||
      `Master the core GES ${params.grade} ${subjectName} principles behind ${params.topicTitle} and how WASSCE examiners test definitions, diagrams, and step-by-step derivations.`;

    const keyEq = sec?.equation || formulaList[i % Math.max(1, formulaList.length)] || '';
    const formulaDetails = keyEq
      ? explainFormulaInDepth(keyEq, stageTitles[i], params.subject)
      : null;

    const explanation = formulaDetails
      ? `${rawExplanation}\n\n**Formula Unpacked (${formulaDetails.formula}):** ${formulaDetails.meaning}\n- ${formulaDetails.variables.join('\n- ')}`
      : rawExplanation;

    const checkPrompt = mcq
      ? mcq.prompt
      : `Checkpoint ${i + 1}: Which approach demonstrates true WASSCE mastery of ${stageTitles[i]}?`;
    const checkOptions: [string, string, string, string] = mcq
      ? mcq.options
      : [
          'State exact GES definitions, units, and step-by-step reasoning',
          'Skip formulas and guess numerical values without units',
          'Memorize isolated letters without understanding concepts',
          'Ignore examiner marking scheme precautions',
        ];
    const correctIndex = mcq ? mcq.correctIndex : 0;
    const afterCheck = mcq
      ? mcq.stepByStepWorkings
      : 'Stating clear definitions, proper SI units, and justified intermediate steps maximizes Paper 1 and Paper 2 marks.';

    const spokenScript = markdownToPlainSpeech(
      `Welcome to Stage ${i + 1}: ${stageTitles[i]}. ${rawExplanation}${
        formulaDetails ? ` ${formulaDetails.spokenExplanation}` : ''
      } Let us check your understanding together.`
    );

    steps.push({
      stepNumber: i + 1,
      stageTitle: stageTitles[i],
      explanation,
      keyEquation: keyEq || undefined,
      realWorldExample: `Applied in Ghanaian laboratories, industry, and WAEC WASSCE Paper 2 structured items on ${params.topicTitle}.`,
      spokenScript,
      checkPrompt,
      checkOptions,
      correctOptionIndex: correctIndex,
      hint: `Focus on the core rule in "${stageTitles[i]}" and verify units or cause-and-effect before choosing.`,
      explanationAfterCheck: afterCheck,
    });
  }

  return {
    lessonId: `lesson-local-${Date.now()}`,
    subject: params.subject,
    grade: params.grade,
    topicTitle: params.topicTitle,
    style: params.style,
    learningObjective: `Master ${params.topicTitle} (${params.grade} ${subjectName}) using interactive checkpoints, structured explanations, and WASSCE Paper 1/2 strategies.`,
    wassceExamTrap:
      'WAEC examiners frequently deduct marks for omitted SI units, unbalanced equations, or vague everyday phrasing instead of precise scientific terms.',
    steps,
  };
}

export function evaluateLocalTeachingInteraction(params: {
  lesson: Pick<TeachingLessonPlan, 'subject' | 'grade' | 'topicTitle' | 'style'>;
  step: Pick<
    TeachingStep,
    'stepNumber' | 'stageTitle' | 'explanation' | 'checkPrompt' | 'checkOptions' | 'correctOptionIndex' | 'hint'
  >;
  actionKind: TeachingActionKind;
  studentInput: string;
  selectedOptionIndex?: number | null;
  studentName?: string;
}): TeachingInteractionFeedback {
  const name = params.studentName || 'Student';

  if (params.actionKind === 'hint') {
    const feedback = `Here is a targeted coaching hint for ${params.step.stageTitle}: ${params.step.hint}`;
    return {
      verdict: 'clarification',
      feedback,
      misconceptionOrNote: 'Read every option carefully against the exact GES syllabus definition.',
      followUpPrompt: 'Now select your best option or explain the idea in one clear sentence.',
      readyToAdvance: false,
      spokenFeedback: markdownToPlainSpeech(feedback),
    };
  }

  if (params.actionKind === 'answer-mcq' && typeof params.selectedOptionIndex === 'number') {
    const isRight = params.selectedOptionIndex === params.step.correctOptionIndex;
    const correctOptionText = params.step.checkOptions[params.step.correctOptionIndex] ?? '';
    if (isRight) {
      const feedback = `Excellent work, ${name}! "${correctOptionText}" is spot on for ${params.step.stageTitle}.`;
      return {
        verdict: 'correct',
        feedback,
        misconceptionOrNote: params.step.explanation.slice(0, 180),
        followUpPrompt: 'Great command of this stage — click Next Step when ready or ask a deeper question.',
        readyToAdvance: true,
        spokenFeedback: markdownToPlainSpeech(`${feedback} ${params.step.hint}`),
      };
    }

    const chosenText = params.step.checkOptions[params.selectedOptionIndex] ?? 'that choice';
    const feedback = `Good try, ${name}, though "${chosenText}" misses a key rule here. The correct answer is "${correctOptionText}".`;
    return {
      verdict: 'needs-review',
      feedback,
      misconceptionOrNote: params.step.hint,
      followUpPrompt: 'Re-read the explanation card above and verify why the correct option holds.',
      readyToAdvance: true,
      spokenFeedback: markdownToPlainSpeech(`${feedback} Remember: ${params.step.hint}`),
    };
  }

  if (params.actionKind === 'answer-open') {
    const answerLower = params.studentInput.toLowerCase();
    const keywords = params.step.explanation
      .toLowerCase()
      .split(/\W+/)
      .filter((w) => w.length >= 5);
    const hits = keywords.filter((kw) => answerLower.includes(kw));
    const isStrong = params.studentInput.trim().length >= 15 && (hits.length >= 1 || answerLower.length >= 35);

    const feedback = isStrong
      ? `Well explained, ${name}! You captured the core idea of ${params.step.stageTitle}. For full WASSCE Paper 2 marks, pair this with precise units or a clear example.`
      : `Good start, ${name}! Strengthen your answer by explicitly connecting "${params.step.stageTitle}" to: ${params.step.explanation.slice(0, 180)}.`;

    return {
      verdict: isStrong ? 'correct' : 'partial',
      feedback,
      misconceptionOrNote: `Examiner Tip: ${params.step.hint}`,
      followUpPrompt: 'Would you like to test yourself on the multiple-choice checkpoint or advance to the next stage?',
      readyToAdvance: true,
      spokenFeedback: markdownToPlainSpeech(feedback),
    };
  }

  // ask-question
  const matchedNote = pickMatchingNote(
    params.lesson.subject,
    params.lesson.grade,
    params.lesson.topicTitle
  );
  const queryWords = params.studentInput
    .toLowerCase()
    .split(/\W+/)
    .filter((w) => w.length >= 4);
  const noteParagraphs = (matchedNote?.content ?? '')
    .split(/\n{2,}/)
    .map((p) => p.trim())
    .filter((p) => p.length > 30 && !p.startsWith('|'));
  const matchingPara =
    noteParagraphs.find((p) => queryWords.some((qw) => p.toLowerCase().includes(qw))) ??
    params.step.explanation;

  const cleanAnswer = markdownToPlainSpeech(matchingPara).slice(0, 320);
  const feedback = `Great question, ${name}! Regarding "${params.studentInput}": ${cleanAnswer}`;
  return {
    verdict: 'clarification',
    feedback,
    misconceptionOrNote: `Grounded in ${params.lesson.grade} ${SUBJECTS[params.lesson.subject]?.shortName ?? params.lesson.subject} syllabus (${params.step.stageTitle}).`,
    followUpPrompt: 'Does that clear it up? Try answering the stage check or ask another follow-up!',
    readyToAdvance: true,
    spokenFeedback: markdownToPlainSpeech(feedback),
  };
}

export function buildLocalVoiceReply(params: {
  prompt: string;
  studentContext: TutorStudentContextPayload;
  lessonContext?: { topicTitle: string; stageTitle?: string; explanation?: string } | null;
  notes?: StudyNote[];
  mcqPool?: MCQQuestion[];
}): string {
  const q = params.prompt.trim();
  const qLower = q.toLowerCase();
  const name = params.studentContext.preferredName || 'Student';
  const notePool = resolveNotePool(params.notes);
  const mcqPool = params.mcqPool ?? getAllCachedMcqs();

  if (qLower.includes('mistake') && params.studentContext.pendingMistakes.length > 0) {
    const first = params.studentContext.pendingMistakes[0];
    const matchedMcq = mcqPool.find((item) => item.id === first.questionId);
    const keyTakeaway = matchedMcq?.stepByStepWorkings ?? `Focus carefully on ${first.topicTitle}.`;
    return `Let us review your top pending mistake, ${name}. Question: ${first.prompt} Remember: ${markdownToPlainSpeech(keyTakeaway).slice(0, 220)} Try summarizing why that holds in one sentence!`;
  }

  if (qLower.includes('quiz me') || qLower.includes('oral check')) {
    const weakTopic = params.studentContext.recommendedTopics[0];
    const mcq = mcqPool.find(
      (m) => (weakTopic ? m.topicId === weakTopic.topicId : m.grade === params.studentContext.gradeLevel)
    ) ?? mcqPool[0];
    if (mcq) {
      return `Alright ${name}, here is your ${mcq.grade} oral check on ${mcq.topicTitle}: ${markdownToPlainSpeech(mcq.prompt)} Tell me your answer and reasoning aloud or type it below.`;
    }
    const targetTopic = weakTopic?.title ?? `${params.studentContext.gradeLevel} core definitions`;
    return `Alright ${name}, here is your oral check on ${targetTopic}: state the exact GES definition, write the governing formula with SI units, and explain one WASSCE examiner precaution aloud.`;
  }

  if (qLower.includes('practical') || qLower.includes('paper 3')) {
    return `Good Paper 3 focus, ${name}! In WASSCE Physics and Chemistry practicals, always state two realistic precautions—such as avoiding parallax error when reading a burette or thermometer at eye level, and swirling gently—and record burette readings to two decimal places ending in 0 or 5.`;
  }

  if (params.lessonContext?.topicTitle) {
    const matched = notePool.find((n) =>
      n.title.toLowerCase().includes(params.lessonContext!.topicTitle.toLowerCase().slice(0, 14))
    );
    const snippet = matched
      ? markdownToPlainSpeech(matched.content).slice(0, 260)
      : markdownToPlainSpeech(params.lessonContext.explanation ?? params.lessonContext.topicTitle).slice(0, 260);
    return `Sure ${name}! On ${params.lessonContext.topicTitle}: ${snippet}. Would you like a quick oral question on this concept?`;
  }

  const queryWords = qLower.split(/\W+/).filter((w) => w.length >= 4);
  const matchedNote =
    notePool.find((n) =>
      queryWords.some((w) => n.title.toLowerCase().includes(w) || n.tags.some((t) => t.toLowerCase().includes(w)))
    ) ??
    notePool.find((n) =>
      queryWords.some((w) => n.content.toLowerCase().includes(w))
    );

  if (matchedNote) {
    const paras = matchedNote.content
      .split(/\n{2,}/)
      .map((p) => markdownToPlainSpeech(p))
      .filter((p) => p.length > 35);
    const best =
      paras.find((p) => queryWords.some((w) => p.toLowerCase().includes(w))) ??
      paras[0] ??
      matchedNote.title;
    return `${name}, from ${matchedNote.grade} ${SUBJECTS[matchedNote.subject].shortName} (${matchedNote.title}): ${best.slice(0, 310)}. Ask me to quiz you next whenever you are ready!`;
  }

  return `Great question, ${name}! Break ${q} down using your ${params.studentContext.gradeLevel} GES definitions, write the relevant formula first, and verify SI units carefully. Tell me the exact step you want us to check next!`;
}
