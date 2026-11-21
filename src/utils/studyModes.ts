import { INITIAL_NOTES } from '../data/defaultNotes.ts';
import { getAllCachedMcqs, getCachedSyllabusNotes } from '../data/curriculumLoader.ts';
import { SUBJECTS } from '../data/subjects.ts';
import type {
  MCQQuestion,
  StudyNote,
  TutorQuestionContext,
  TutorStudentContextPayload,
} from '../types/index.ts';

export const FOCUS_MODE_STORAGE_KEY = 'wassce_masterclass_focus_mode_v1';
export const OFFLINE_MODE_STORAGE_KEY = 'wassce_masterclass_offline_mode_v1';

export interface FocusModeVisibility {
  showSidebar: boolean;
  showMobileNav: boolean;
  showTopStats: boolean;
  showSecondaryHeaderActions: boolean;
  showReminderBanner: boolean;
  showFloatingOrb: boolean;
  showDashboardHero: boolean;
  showDashboardSubjectHubs: boolean;
  showDashboardRecentAndWorkspace: boolean;
  showDashboardTodayTimetable: boolean;
}

/**
 * Computes exact layout & dashboard element visibility for Global Focus Mode.
 * When active, hides all non-essential navigation, metrics, banners, and secondary dashboard cards
 * so only the current active view remains.
 */
export function getFocusModeVisibility(focusMode: boolean): FocusModeVisibility {
  return {
    showSidebar: !focusMode,
    showMobileNav: !focusMode,
    showTopStats: !focusMode,
    showSecondaryHeaderActions: !focusMode,
    showReminderBanner: !focusMode,
    showFloatingOrb: !focusMode,
    showDashboardHero: !focusMode,
    showDashboardSubjectHubs: !focusMode,
    showDashboardRecentAndWorkspace: !focusMode,
    showDashboardTodayTimetable: true,
  };
}

/**
 * Offline mode activates automatically when the browser loses network connectivity
 * OR when the student manually toggles Offline Study Mode on.
 */
export function isEffectiveOfflineMode(params: {
  browserOnline: boolean;
  manualOfflineMode: boolean;
}): boolean {
  return !params.browserOnline || params.manualOfflineMode;
}

/**
 * Builds an instant, syllabus-grounded tutor reply strictly from local notes, MCQs,
 * and analytics whenever Offline Mode is enabled (zero network requests required).
 */
export function buildLocalOfflineTutorReply(params: {
  prompt: string;
  studentContext: TutorStudentContextPayload;
  activeQuestion?: TutorQuestionContext | null;
  notes?: StudyNote[];
  mcqPool?: MCQQuestion[];
}): string {
  const q = params.prompt.trim();
  const qLower = q.toLowerCase();
  const name = params.studentContext.preferredName || 'Student';
  const notePool = params.notes?.length
    ? params.notes
    : (getCachedSyllabusNotes() ?? INITIAL_NOTES);
  const mcqPool = params.mcqPool?.length ? params.mcqPool : getAllCachedMcqs();

  if (params.activeQuestion) {
    const matchedMcq = mcqPool.find((m) => m.id === params.activeQuestion?.id);
    const workings = matchedMcq?.stepByStepWorkings ?? '';
    return [
      `### Offline Concept Hint — ${params.activeQuestion.topicTitle}`,
      '',
      `${name}, you are working in **Offline Mode**, so here is a structured local walkthrough without waiting on cloud APIs:`,
      '',
      workings || `Break down the core ${params.activeQuestion.grade} definition and units in **${params.activeQuestion.topicTitle}**, then test each option against WAEC marking rules.`,
      '',
      '> Tip: Verify SI units and substitute carefully inside your Workings Board before locking your final answer.',
    ].join('\n');
  }

  if (qLower.includes('next study plan') || qLower.includes('recommend')) {
    const topRecs = params.studentContext.recommendedTopics.slice(0, 3);
    if (topRecs.length > 0) {
      const list = topRecs
        .map(
          (r, i) =>
            `${i + 1}. **${SUBJECTS[r.subject]?.shortName ?? r.subject} · ${r.grade}**: ${r.title} — ${r.reason}`
        )
        .join('\n');
      return `### Offline Study Priority Plan for ${name}\n\n${list}\n\nAll syllabus notes, flashcards, practical labs, and Paper 1/2 mocks for these units are available right now offline.`;
    }
  }

  if (qLower.includes('mistake') && params.studentContext.pendingMistakes.length > 0) {
    const lines = params.studentContext.pendingMistakes.slice(0, 3).map((m, i) => {
      const mcq = mcqPool.find((item) => item.id === m.questionId);
      const takeaway = mcq?.stepByStepWorkings
        ? mcq.stepByStepWorkings.slice(0, 220)
        : `Review ${m.topicTitle} key equations and SI units.`;
      return `${i + 1}. **${m.topicTitle}** (${m.wrongCount}× missed): ${takeaway}`;
    });
    return `### Offline Mistake Bank Review\n\n${lines.join('\n\n')}`;
  }

  const queryWords = qLower.split(/\W+/).filter((w) => w.length >= 4);
  const matchedNote =
    notePool.find((n) =>
      queryWords.some((w) => n.title.toLowerCase().includes(w) || n.tags.some((t) => t.toLowerCase().includes(w)))
    ) ??
    notePool.find((n) => queryWords.some((w) => n.content.toLowerCase().includes(w))) ??
    notePool.find((n) => n.grade === params.studentContext.gradeLevel) ??
    notePool[0];

  if (matchedNote) {
    const excerpt = matchedNote.content
      .split(/\n{2,}/)
      .filter((p) => p.trim().length > 30)
      .slice(0, 3)
      .join('\n\n')
      .slice(0, 800);

    return [
      `### ${matchedNote.title} (${matchedNote.grade} · Offline Reference)`,
      '',
      excerpt,
      '',
      `Source: Cached ${SUBJECTS[matchedNote.subject]?.name ?? matchedNote.subject} GES syllabus library (Offline Mode).`,
    ].join('\n');
  }

  return `${name}, Offline Mode is active. Review your cached Study Notes, Interactive Video Slides, Practical Simulators, and Paper 1/2 Question Bank anytime without internet access.`;
}
