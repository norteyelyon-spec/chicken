import type {
  MCQQuestion,
  MistakeEntry,
  StreakData,
  StudyNote,
  SubjectId,
  SyllabusTopic,
  TutorQuestionContext,
  TutorRecommendation,
  TutorStudentContextPayload,
  UserProfile,
} from '../types/index.ts';
import type { SubjectMasteryStats } from './quizEngine.ts';

const SUBJECT_LABELS: Record<SubjectId, string> = {
  physics: 'Physics',
  chemistry: 'Chemistry',
  biology: 'Biology',
  addmaths: 'Elective Mathematics',
  ict: 'ICT',
  coremath: 'Core Mathematics',
  english: 'English Language',
  integratedscience: 'Integrated Science',
  socialstudies: 'Social Studies',
};

export function computeTutorRecommendations(
  masteryStats: SubjectMasteryStats[],
  mistakes: MistakeEntry[],
  topics: SyllabusTopic[],
  profile: UserProfile,
  limit = 4
): TutorRecommendation[] {
  const recs: TutorRecommendation[] = [];
  const seenTopicIds = new Set<string>();

  // 1. Prioritize topics with pending (unmastered) Mistake Bank entries
  const pendingMistakes = [...mistakes]
    .filter((m) => !m.mastered)
    .sort((a, b) => b.wrongCount - a.wrongCount);

  for (const mistake of pendingMistakes) {
    if (recs.length >= limit) break;
    const topic = topics.find((t) => t.id === mistake.topicId);
    if (!topic || seenTopicIds.has(topic.id)) continue;
    seenTopicIds.add(topic.id);
    recs.push({
      topicId: topic.id,
      subject: topic.subject,
      grade: topic.grade,
      unitNumber: topic.unitNumber,
      title: topic.title,
      reason: `Pending Mistake Bank item (${mistake.wrongCount}x missed)`,
      priority: 'high',
    });
  }

  // 2. Target student's lowest-scoring or unattempted focused subjects
  const focusedMastery = [...masteryStats]
    .filter((m) => profile.subjects.length === 0 || profile.subjects.includes(m.subject))
    .sort((a, b) => {
      if (a.attemptsCount === 0 && b.attemptsCount > 0) return -1;
      if (b.attemptsCount === 0 && a.attemptsCount > 0) return 1;
      return a.averagePercentage - b.averagePercentage;
    });

  for (const stat of focusedMastery) {
    if (recs.length >= limit) break;
    const gradeMatch = topics.find(
      (t) => t.subject === stat.subject && t.grade === profile.gradeLevel && !seenTopicIds.has(t.id)
    );
    const fallbackTopic =
      gradeMatch ?? topics.find((t) => t.subject === stat.subject && !seenTopicIds.has(t.id));
    if (!fallbackTopic) continue;
    seenTopicIds.add(fallbackTopic.id);

    const reason =
      stat.attemptsCount === 0
        ? `No ${SUBJECT_LABELS[stat.subject]} mocks attempted yet`
        : stat.averagePercentage < 75
          ? `Boost ${SUBJECT_LABELS[stat.subject]} mastery (${stat.averagePercentage}%)`
          : `Maintain ${SUBJECT_LABELS[stat.subject]} ${profile.gradeLevel} mastery (${stat.averagePercentage}%)`;

    recs.push({
      topicId: fallbackTopic.id,
      subject: fallbackTopic.subject,
      grade: fallbackTopic.grade,
      unitNumber: fallbackTopic.unitNumber,
      title: fallbackTopic.title,
      reason,
      priority: stat.attemptsCount === 0 || stat.averagePercentage < 70 ? 'high' : 'medium',
    });
  }

  return recs.slice(0, limit);
}

export function buildTutorStudentContextPayload(params: {
  profile: UserProfile;
  overallAccuracy: number;
  totalQuestionsSolved: number;
  streak: StreakData;
  masteryStats: SubjectMasteryStats[];
  mistakes: MistakeEntry[];
  mcqPool: MCQQuestion[];
  topics: SyllabusTopic[];
  notes: StudyNote[];
  activeQuestion?: TutorQuestionContext | null;
}): TutorStudentContextPayload {
  const {
    profile,
    overallAccuracy,
    totalQuestionsSolved,
    streak,
    masteryStats,
    mistakes,
    mcqPool,
    topics,
    notes,
    activeQuestion = null,
  } = params;

  const pendingMistakes = mistakes
    .filter((m) => !m.mastered)
    .slice(0, 6)
    .map((m) => {
      const q = mcqPool.find((item) => item.id === m.questionId);
      const topic = topics.find((t) => t.id === m.topicId);
      return {
        questionId: m.questionId,
        subject: m.subject,
        grade: m.grade,
        topicId: m.topicId,
        topicTitle: q?.topicTitle ?? topic?.title ?? m.topicId,
        prompt: q?.prompt ?? 'Missed WASSCE MCQ item',
        wrongCount: m.wrongCount,
      };
    });

  const recommendedTopics = computeTutorRecommendations(masteryStats, mistakes, topics, profile, 4);

  return {
    preferredName: profile.preferredName,
    gradeLevel: profile.gradeLevel,
    targetYear: profile.targetYear,
    schoolName: profile.schoolName,
    subjects: profile.subjects,
    overallAccuracy,
    totalQuestionsSolved,
    currentStreak: streak.currentStreak,
    subjectMastery: masteryStats.map((m) => ({
      subject: m.subject,
      averagePercentage: m.averagePercentage,
      questionsSolved: m.questionsSolved,
      byGrade: m.byGrade,
    })),
    pendingMistakes,
    recentNoteTitles: notes.slice(0, 5).map((n) => `${n.title} (${SUBJECT_LABELS[n.subject]} ${n.grade})`),
    recommendedTopics,
    activeQuestion,
  };
}

export function buildTutorSystemInstruction(ctx: TutorStudentContextPayload): string {
  const subjectList = ctx.subjects.map((s) => SUBJECT_LABELS[s] ?? s).join(', ') || 'All Science & ICT';

  const masteryLines = ctx.subjectMastery
    .map(
      (m) =>
        `- ${SUBJECT_LABELS[m.subject] ?? m.subject}: ${m.averagePercentage}% avg across ${m.questionsSolved} questions (SHS1: ${m.byGrade.SHS1}%, SHS2: ${m.byGrade.SHS2}%, SHS3: ${m.byGrade.SHS3}%)`
    )
    .join('\n');

  const mistakeLines =
    ctx.pendingMistakes.length > 0
      ? ctx.pendingMistakes
          .map(
            (m, i) =>
              `${i + 1}. [${SUBJECT_LABELS[m.subject] ?? m.subject} · ${m.grade} · ${m.topicTitle}] (missed ${m.wrongCount}x): ${m.prompt}`
          )
          .join('\n')
      : 'None pending (Mistake Bank is clear!).';

  const recommendationLines =
    ctx.recommendedTopics.length > 0
      ? ctx.recommendedTopics
          .map(
            (r) =>
              `- ${r.unitNumber} ${r.title} (${SUBJECT_LABELS[r.subject] ?? r.subject} ${r.grade}) — ${r.reason}`
          )
          .join('\n')
      : 'Continue balanced WASSCE revision across Paper 1, Paper 2, and Paper 3.';

  const activeQuestionBlock = ctx.activeQuestion
    ? `\nACTIVE PRACTICE QUESTION ATTACHED BY STUDENT:
- Paper: ${ctx.activeQuestion.paperType === 'mcq' ? 'Paper 1 (MCQ)' : 'Paper 2 (Structured Theory)'}
- Subject & Form: ${SUBJECT_LABELS[ctx.activeQuestion.subject] ?? ctx.activeQuestion.subject} (${ctx.activeQuestion.grade})
- Topic: ${ctx.activeQuestion.topicTitle}
- Submission Status: ${ctx.activeQuestion.isSubmitted ? 'Already submitted/revealed — full explanation allowed' : 'In progress — give Socratic hints and guiding steps first; avoid immediately spoiling the final option letter unless the student explicitly asks for the full solution.'}
- Question Prompt: ${ctx.activeQuestion.prompt}
${
  ctx.activeQuestion.options
    ? `Options:\n${ctx.activeQuestion.options
        .map((opt, idx) => `  ${['A', 'B', 'C', 'D'][idx]}. ${opt}`)
        .join('\n')}`
    : ''
}
${
  ctx.activeQuestion.selectedOptionIndex !== undefined &&
  ctx.activeQuestion.selectedOptionIndex !== null
    ? `Student currently selected option: ${['A', 'B', 'C', 'D'][ctx.activeQuestion.selectedOptionIndex]}`
    : ''
}
${ctx.activeQuestion.subPartsSummary ? `Sub-parts:\n${ctx.activeQuestion.subPartsSummary}` : ''}`
    : '';

  return `You are the WASSCE Science & ICT Masterclass AI Study Tutor for Senior High School (SHS 1–3) students in Ghana following the Ghana Education Service (GES) curriculum and WAEC WASSCE examination standards.

STUDENT PROFILE & ANALYTICS:
- Student Name: ${ctx.preferredName} (${ctx.gradeLevel}${ctx.schoolName ? `, ${ctx.schoolName}` : ''})
- Target WASSCE Year: ${ctx.targetYear}
- Focus Subjects: ${subjectList}
- Overall Accuracy: ${ctx.overallAccuracy}% | Total Questions Solved: ${ctx.totalQuestionsSolved} | Study Streak: ${ctx.currentStreak} days

SUBJECT MASTERY BREAKDOWN:
${masteryLines}

PENDING MISTAKE BANK ITEMS:
${mistakeLines}

PRIORITY SYLLABUS UNITS RECOMMENDED BY ANALYTICS:
${recommendationLines}

SAVED PERSONAL STUDY NOTES:
${ctx.recentNoteTitles.length > 0 ? ctx.recentNoteTitles.join('; ') : 'No notes yet.'}
${activeQuestionBlock}

TEACHING & FORMATTING RULES:
1. Be encouraging, warm, human-like, and comprehensive — aligned with GES/NaCCA SHS 1–3 syllabus objectives and WAEC WASSCE marking schemes (SI units, definitions, key scoring phrases, precautions for Paper 3 practicals).
2. ALWAYS EXPLAIN EVERY FORMULA: Whenever you present an equation or formula, explicitly break down what EVERY variable/symbol represents, state its units or domain, explain intuitively why the formula works, and walk through a numerical substitution step-by-step. Never drop a bare formula without explaining it!
3. Format mathematical equations with KaTeX delimiters: inline \`$...$\` and block \`$$...$$\`. Format Python, SQL, or HTML snippets in fenced code blocks (\`\`\`python, \`\`\`sql, \`\`\`html).
4. Use clear markdown headings (\`##\`), intuitive everyday analogies, step-by-step derivations, and bold highlights for key laws or WASSCE exam pitfalls.
5. When giving hints on an in-progress practice question, guide the student step-by-step with the governing principle, formula meaning, or first step rather than handing over the final option immediately (unless they ask for the full worked answer or already submitted).
6. When asked what to study next, reference the student's actual subject mastery percentages, pending Mistake Bank items, and the recommended GES units listed above.`;
}

export function buildTutorPromptChips(ctx: TutorStudentContextPayload): { label: string; prompt: string }[] {
  if (ctx.activeQuestion) {
    return [
      {
        label: 'Give me a step-by-step hint',
        prompt: `Give me a guiding hint for this ${SUBJECT_LABELS[ctx.activeQuestion.subject]} question on ${ctx.activeQuestion.topicTitle} without spoiling the final answer yet.`,
      },
      {
        label: 'Which formula or concept applies?',
        prompt: `Explain the core GES syllabus concept and formula needed to solve this ${ctx.activeQuestion.topicTitle} question.`,
      },
      {
        label: 'Show common WASSCE traps here',
        prompt: `What mistakes do SHS candidates commonly make on ${ctx.activeQuestion.topicTitle} questions like this?`,
      },
    ];
  }

  const weakest = [...ctx.subjectMastery].sort((a, b) => a.averagePercentage - b.averagePercentage)[0];
  const weakSubjectName = weakest ? SUBJECT_LABELS[weakest.subject] : 'Physics';
  const chips: { label: string; prompt: string }[] = [
    {
      label: 'Suggest my next study plan',
      prompt: 'Based on my analytics and Mistake Bank, which GES syllabus topics should I study next and why?',
    },
  ];

  if (ctx.pendingMistakes.length > 0) {
    chips.push({
      label: `Review my ${ctx.pendingMistakes.length} pending mistake${ctx.pendingMistakes.length > 1 ? 's' : ''}`,
      prompt: 'Walk me through the concepts behind my pending Mistake Bank questions so I stop losing marks on them.',
    });
  } else {
    chips.push({
      label: `Drill ${weakSubjectName} concepts`,
      prompt: `Give me a concise ${ctx.gradeLevel} ${weakSubjectName} revision breakdown with key WASSCE Paper 2 scoring points.`,
    });
  }

  chips.push({
    label: `Explain a tough ${weakSubjectName} topic`,
    prompt: `Explain the hardest ${ctx.gradeLevel} ${weakSubjectName} concept in the GES curriculum with worked examples and equations.`,
  });

  chips.push({
    label: 'Paper 2 & 3 exam scoring tips',
    prompt: 'How do WAEC examiners award method and precaution marks in WASSCE Paper 2 Theory and Paper 3 Practicals?',
  });

  return chips;
}

export function extractTutorErrorMessage(status: number, rawMessage?: string): string {
  const msg = (rawMessage ?? '').trim();
  if (/Unexpected token '<'|<!doctype|<html|not valid JSON/i.test(msg)) {
    return 'Received an unexpected HTML response instead of JSON from the AI Tutor server. Please retry in a moment.';
  }
  if (status === 401 || status === 403 || /API_KEY_INVALID|PERMISSION_DENIED/i.test(msg)) {
    return 'Your Gemini API key appears missing or invalid. Please verify GEMINI_API_KEY in Settings > Secrets and try again.';
  }
  if (status === 429 || /RESOURCE_EXHAUSTED/i.test(msg)) {
    return 'AI Tutor rate limit reached. Please wait a few seconds and retry, or check your quota in Settings > Secrets.';
  }
  if (msg) return msg;
  return `AI Tutor request failed (status ${status}). Please try again.`;
}
