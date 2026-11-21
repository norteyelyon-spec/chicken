import { SUBJECTS } from '../data/subjects.ts';
import type {
  MistakeEntry,
  StreakData,
  StudyNote,
  StudyNotificationCtaAction,
  StudyNotificationItem,
  StudyReminderSettings,
  StudyTimetableSchedule,
  SubjectId,
  UserProfile,
} from '../types/index.ts';
import type { SubjectMasteryStats } from './quizEngine.ts';
import { getTodayLearningPlan } from './studyTimetable.ts';

export const DEFAULT_REMINDER_SETTINGS: StudyReminderSettings = {
  enabled: true,
  reminderTime: '18:00',
  browserNotificationsEnabled: false,
  lastNotifiedDate: '',
  snoozedUntilIso: null,
};

export function formatLocalDateKey(date: Date = new Date()): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function getOffsetLocalDateKey(daysDelta: number, baseDate: Date = new Date()): string {
  const copy = new Date(baseDate.getFullYear(), baseDate.getMonth(), baseDate.getDate() + daysDelta);
  return formatLocalDateKey(copy);
}

export function sanitizeReminderTime(raw: string | undefined | null): string {
  const trimmed = (raw ?? '').trim();
  if (/^([01][0-9]|2[0-3]):[0-5][0-9]$/.test(trimmed)) {
    return trimmed;
  }
  return DEFAULT_REMINDER_SETTINGS.reminderTime;
}

export function parseReminderMinutes(hhmm: string): number {
  const safe = sanitizeReminderTime(hhmm);
  const [hoursStr, minsStr] = safe.split(':');
  return Number(hoursStr) * 60 + Number(minsStr);
}

export function computeMsUntilReminder(now: Date, reminderTime: string): number {
  const safe = sanitizeReminderTime(reminderTime);
  const [hoursStr, minsStr] = safe.split(':');
  const target = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate(),
    Number(hoursStr),
    Number(minsStr),
    0,
    0
  );
  return Math.max(0, target.getTime() - now.getTime());
}

export function diffCalendarDays(fromDateKey: string, toDateKey: string): number {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(fromDateKey) || !/^\d{4}-\d{2}-\d{2}$/.test(toDateKey)) {
    return 0;
  }
  const fromUtc = new Date(`${fromDateKey}T00:00:00Z`).getTime();
  const toUtc = new Date(`${toDateKey}T00:00:00Z`).getTime();
  return Math.round((toUtc - fromUtc) / (1000 * 60 * 60 * 24));
}

export interface EvaluateReminderInput {
  profile: UserProfile;
  streak: StreakData;
  settings: StudyReminderSettings;
  mistakes: MistakeEntry[];
  masteryStats: SubjectMasteryStats[];
  timetableSchedule?: StudyTimetableSchedule;
  notes?: StudyNote[];
  now?: Date;
  forcePreview?: boolean;
}

export type ReminderEvaluationReason =
  | 'disabled'
  | 'already-notified'
  | 'snoozed'
  | 'before-cutoff'
  | 'goal-complete'
  | 'missed-checkin'
  | 'streak-at-risk'
  | 'goal-nudge'
  | 'preview';

export interface ReminderEvaluationResult {
  shouldTrigger: boolean;
  reason: ReminderEvaluationReason;
  todayKey: string;
  cutoffReached: boolean;
  studiedToday: boolean;
  goalCompletedToday: boolean;
  notification: StudyNotificationItem | null;
}

function pickRecommendedFocus(
  profile: UserProfile,
  mistakes: MistakeEntry[],
  masteryStats: SubjectMasteryStats[]
): {
  subjectId: SubjectId;
  subjectName: string;
  pendingMistakeCount: number;
  ctaAction: StudyNotificationCtaAction;
  ctaLabel: string;
} {
  const pendingMistakes = mistakes.filter((m) => !m.mastered);
  const focusSet = new Set(profile.subjects);
  const candidateStats = masteryStats
    .filter((s) => focusSet.size === 0 || focusSet.has(s.subject))
    .sort((a, b) => a.averagePercentage - b.averagePercentage);

  const weakestSubjectId: SubjectId =
    candidateStats[0]?.subject ?? profile.subjects[0] ?? 'physics';
  const subjectName = SUBJECTS[weakestSubjectId]?.shortName ?? 'Science';

  if (pendingMistakes.length > 0) {
    const firstMistakeSubject = pendingMistakes[0].subject;
    return {
      subjectId: firstMistakeSubject,
      subjectName: SUBJECTS[firstMistakeSubject]?.shortName ?? subjectName,
      pendingMistakeCount: pendingMistakes.length,
      ctaAction: 'mistakes',
      ctaLabel: `Review ${pendingMistakes.length} Mistake${pendingMistakeCountPlural(pendingMistakes.length)}`,
    };
  }

  return {
    subjectId: weakestSubjectId,
    subjectName,
    pendingMistakeCount: 0,
    ctaAction: 'quiz',
    ctaLabel: `Start ${subjectName} Drill`,
  };
}

function pendingMistakeCountPlural(count: number): string {
  return count === 1 ? '' : 's';
}

export function evaluateDailyStudyReminder(
  input: EvaluateReminderInput
): ReminderEvaluationResult {
  const now = input.now ?? new Date();
  const todayKey = formatLocalDateKey(now);
  const safeTime = sanitizeReminderTime(input.settings.reminderTime);
  const cutoffMinutes = parseReminderMinutes(safeTime);
  const nowMinutes = now.getHours() * 60 + now.getMinutes();
  const cutoffReached = nowMinutes >= cutoffMinutes;

  const daysSinceActive = diffCalendarDays(input.streak.lastActiveDate, todayKey);
  const studiedToday = daysSinceActive <= 0 && input.streak.questionsSolvedToday > 0;
  const goalCompletedToday =
    studiedToday && input.streak.questionsSolvedToday >= input.profile.dailyQuestionGoal;

  if (!input.forcePreview) {
    if (!input.settings.enabled) {
      return {
        shouldTrigger: false,
        reason: 'disabled',
        todayKey,
        cutoffReached,
        studiedToday,
        goalCompletedToday,
        notification: null,
      };
    }

    if (input.settings.lastNotifiedDate === todayKey) {
      return {
        shouldTrigger: false,
        reason: 'already-notified',
        todayKey,
        cutoffReached,
        studiedToday,
        goalCompletedToday,
        notification: null,
      };
    }

    if (input.settings.snoozedUntilIso) {
      const snoozeUntilMs = new Date(input.settings.snoozedUntilIso).getTime();
      if (Number.isFinite(snoozeUntilMs) && snoozeUntilMs > now.getTime()) {
        return {
          shouldTrigger: false,
          reason: 'snoozed',
          todayKey,
          cutoffReached,
          studiedToday,
          goalCompletedToday,
          notification: null,
        };
      }
    }

    if (!cutoffReached) {
      return {
        shouldTrigger: false,
        reason: 'before-cutoff',
        todayKey,
        cutoffReached,
        studiedToday,
        goalCompletedToday,
        notification: null,
      };
    }

    if (goalCompletedToday) {
      return {
        shouldTrigger: false,
        reason: 'goal-complete',
        todayKey,
        cutoffReached,
        studiedToday,
        goalCompletedToday,
        notification: null,
      };
    }
  }

  const name = input.profile.preferredName || 'Scholar';
  const focus = pickRecommendedFocus(input.profile, input.mistakes, input.masteryStats);
  const todayPlan = input.timetableSchedule
    ? getTodayLearningPlan(
        input.timetableSchedule,
        input.notes ?? [],
        input.profile,
        now
      )
    : null;
  const scheduledSubjectsSummary = todayPlan
    ? todayPlan.items.map((i) => i.subjectName).join(' · ')
    : '';
  const leadTopicTitle = todayPlan?.items[0]?.recommendedNote?.title ?? todayPlan?.items[0]?.syllabusTopic?.title ?? '';
  const timetableClause = scheduledSubjectsSummary
    ? ` Today's timetable (${todayPlan?.dayLabel}): ${scheduledSubjectsSummary}${leadTopicTitle ? ` — start with "${leadTopicTitle}"` : ''}.`
    : '';

  const focusClause =
    focus.pendingMistakeCount > 0
      ? ` or clear ${focus.pendingMistakeCount} pending ${focus.subjectName} Mistake Bank item${pendingMistakeCountPlural(focus.pendingMistakeCount)}`
      : ` in ${focus.subjectName}`;
  const createdAtIso = now.toISOString();

  if (daysSinceActive >= 2 && input.streak.currentStreak > 0) {
    return {
      shouldTrigger: true,
      reason: input.forcePreview ? 'preview' : 'streak-at-risk',
      todayKey,
      cutoffReached,
      studiedToday,
      goalCompletedToday,
      notification: {
        id: `rem-${todayKey}-${input.forcePreview ? now.getTime() : 'risk'}`,
        kind: 'streak-at-risk',
        title: `Recover your ${input.streak.currentStreak}-day WASSCE streak, ${name}`,
        message: `It has been ${daysSinceActive} days since your last logged session (best: ${input.streak.longestStreak} days). Complete a quick ${focus.subjectName} quiz${focusClause} to rebuild momentum today.${timetableClause}`,
        ctaLabel: focus.ctaLabel,
        ctaAction: focus.ctaAction,
        subjectId: focus.subjectId,
        createdAtIso,
        dateKey: todayKey,
        read: false,
        urgency: 'urgent',
      },
    };
  }

  if (!studiedToday) {
    const streakGoalHint =
      input.streak.currentStreak > 0
        ? `Protect your ${input.streak.currentStreak}-day streak (best: ${input.streak.longestStreak} days)`
        : 'Start a fresh daily study streak';
    return {
      shouldTrigger: true,
      reason: input.forcePreview ? 'preview' : 'missed-checkin',
      todayKey,
      cutoffReached,
      studiedToday,
      goalCompletedToday,
      notification: {
        id: `rem-${todayKey}-${input.forcePreview ? now.getTime() : 'checkin'}`,
        kind: 'streak-reminder',
        title:
          input.streak.currentStreak > 0
            ? `Protect your ${input.streak.currentStreak}-day streak, ${name}`
            : `Time for your ${safeTime} study check-in, ${name}`,
        message: `${streakGoalHint}: you haven't logged a session by ${safeTime}. Solve ${input.profile.dailyQuestionGoal} questions${focusClause} before midnight.${timetableClause}`,
        ctaLabel: todayPlan ? `View ${todayPlan.dayLabel} Plan` : focus.ctaLabel,
        ctaAction: todayPlan ? 'timetable' : focus.ctaAction,
        subjectId: todayPlan?.items[0]?.subjectId ?? focus.subjectId,
        createdAtIso,
        dateKey: todayKey,
        read: false,
        urgency: input.streak.currentStreak > 0 ? 'urgent' : 'warning',
      },
    };
  }

  const remainingQuestions = Math.max(
    1,
    input.profile.dailyQuestionGoal - input.streak.questionsSolvedToday
  );
  return {
    shouldTrigger: true,
    reason: input.forcePreview ? 'preview' : 'goal-nudge',
    todayKey,
    cutoffReached,
    studiedToday,
    goalCompletedToday,
    notification: {
      id: `rem-${todayKey}-${input.forcePreview ? now.getTime() : 'goal'}`,
      kind: 'goal-nudge',
      title: `${remainingQuestions} question${remainingQuestions === 1 ? '' : 's'} left for today's target, ${name}`,
      message: `You've solved ${input.streak.questionsSolvedToday}/${input.profile.dailyQuestionGoal} questions today (${input.streak.currentStreak}-day streak). Knock out ${remainingQuestions} more${focusClause} to finish strong.${timetableClause}`,
      ctaLabel: focus.ctaLabel,
      ctaAction: focus.ctaAction,
      subjectId: focus.subjectId,
      createdAtIso,
      dateKey: todayKey,
      read: false,
      urgency: 'info',
    },
  };
}

export function buildTodayTimetableNotification(params: {
  profile: UserProfile;
  timetableSchedule: StudyTimetableSchedule;
  notes: StudyNote[];
  completedKeys?: Record<string, boolean>;
  now?: Date;
}): StudyNotificationItem {
  const now = params.now ?? new Date();
  const plan = getTodayLearningPlan(
    params.timetableSchedule,
    params.notes,
    params.profile,
    now,
    params.completedKeys ?? {}
  );
  const subjectsLine = plan.items
    .map((item) => `${item.slotLabel.split('-')[0].trim()} ${item.subjectName}`)
    .join(' · ');
  const nextPending = plan.items.find((item) => !item.isCompleted) ?? plan.items[0];
  const noteHint = nextPending?.recommendedNote
    ? `Recommended ${params.profile.gradeLevel} lesson: "${nextPending.recommendedNote.title}".`
    : '';

  return {
    id: `tt-${plan.dateKey}-${now.getTime()}`,
    kind: 'daily-timetable',
    title: `${plan.dayLabel} Study Plan for ${params.profile.preferredName || 'Scholar'}`,
    message: `Today's timetable: ${subjectsLine}. ${noteHint}`.trim(),
    ctaLabel: nextPending?.recommendedNote ? 'Watch AI Video Lesson' : 'Open Timetable',
    ctaAction: nextPending?.recommendedNote ? 'videos' : 'timetable',
    subjectId: nextPending?.subjectId,
    createdAtIso: now.toISOString(),
    dateKey: plan.dateKey,
    read: false,
    urgency: 'info',
  };
}

export function playGentleReminderChime(): void {
  if (typeof window === 'undefined') return;
  try {
    const AudioCtx =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();
    if (ctx.state === 'suspended') {
      void ctx.resume().catch(() => {});
    }
    const now = ctx.currentTime;
    const notes = [523.25, 659.25]; // C5 -> E5 calm chime
    notes.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const start = now + idx * 0.11;
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, start);
      gain.gain.setValueAtTime(0.0001, start);
      gain.gain.exponentialRampToValueAtTime(0.06, start + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.0001, start + 0.28);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(start);
      osc.stop(start + 0.3);
    });
    window.setTimeout(() => {
      void ctx.close().catch(() => {});
    }, 650);
  } catch {
    // Ignore autoplay/AudioContext restrictions before user gesture
  }
}
