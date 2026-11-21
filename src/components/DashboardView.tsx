import React, { useState } from 'react';
import {
  AlertCircle,
  ArrowRight,
  BookOpen,
  CalendarDays,
  CheckCircle2,
  Circle,
  Clock,
  Flame,
  FlaskConical,
  GraduationCap,
  PlayCircle,
  Sparkles,
  Target,
} from 'lucide-react';
import { CURRICULUM_TOTALS } from '../data/curriculumLoader';
import { SUBJECTS, SUBJECT_LIST, SYLLABUS_TOPICS } from '../data/subjects';
import type {
  ExamAttempt,
  MistakeEntry,
  NavTab,
  StreakData,
  SubjectId,
  TeachingLaunchTarget,
  UserProfile,
} from '../types';
import type { SubjectMasteryStats } from '../utils/quizEngine';
import { getFocusModeVisibility } from '../utils/studyModes';
import type { TodayLearningPlan } from '../utils/studyTimetable';
import { AvatarIcon } from './AvatarIcon';

interface DashboardViewProps {
  profile: UserProfile;
  streak: StreakData;
  attempts: ExamAttempt[];
  mistakes: MistakeEntry[];
  masteryStats: SubjectMasteryStats[];
  overallAccuracy: number;
  totalQuestionsSolved: number;
  todayPlan?: TodayLearningPlan;
  focusMode?: boolean;
  onToggleTimetableBlock?: (completionKey: string) => void;
  onWatchVideoNote?: (noteId: string) => void;
  onLaunchAITeacher?: (target: TeachingLaunchTarget) => void;
  onNavigate: (tab: NavTab) => void;
  onOpenSubject: (subject: SubjectId) => void;
  onStartQuickQuiz: (subject: SubjectId) => void;
  onReviewMistakes: () => void;
  onEditProfile: () => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  profile,
  streak,
  attempts,
  mistakes,
  masteryStats,
  overallAccuracy,
  totalQuestionsSolved,
  todayPlan,
  focusMode = false,
  onToggleTimetableBlock,
  onWatchVideoNote,
  onLaunchAITeacher,
  onNavigate,
  onOpenSubject,
  onStartQuickQuiz,
  onReviewMistakes,
  onEditProfile,
}) => {
  const [categoryFilter, setCategoryFilter] = useState<'all' | 'elective' | 'core'>('all');
  const visibility = getFocusModeVisibility(focusMode);

  const activeMistakes = mistakes.filter((m) => !m.mastered).length;
  const goalPct = Math.min(
    100,
    Math.round((streak.questionsSolvedToday / Math.max(1, profile.dailyQuestionGoal)) * 100)
  );
  const gradeLabel =
    profile.gradeLevel === 'SHS1'
      ? 'SHS 1 (Grade 10)'
      : profile.gradeLevel === 'SHS2'
        ? 'SHS 2 (Grade 11)'
        : 'SHS 3 (Grade 12 · WASSCE Candidate)';

  const recentAttempts = [...attempts]
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
    .slice(0, 4);

  const visibleSubjects = SUBJECT_LIST.filter((s) =>
    categoryFilter === 'all' ? true : s.category === categoryFilter
  );

  return (
    <div className="space-y-8">
      {/* Personalized Welcome Banner (hidden in Global Focus Mode) */}
      {visibility.showDashboardHero && (
      <section data-testid="dashboard-hero" className="rounded-2xl bg-slate-900/90 border border-slate-800/90 p-6 sm:p-7 backdrop-blur-md">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="flex items-start gap-4">
            <AvatarIcon avatarId={profile.avatarId} size="lg" />
            <div className="space-y-1.5">
              <div className="text-xs text-slate-400">
                <span>{gradeLabel}</span>
                <span className="mx-2" aria-hidden="true">·</span>
                <span>Target {profile.targetYear} WASSCE</span>
                {profile.schoolName && (
                  <>
                    <span className="mx-2" aria-hidden="true">·</span>
                    <span>{profile.schoolName}</span>
                  </>
                )}
              </div>
              <h2 className="font-display text-2xl sm:text-3xl font-bold text-white tracking-tight text-balance">
                Akwaaba, {profile.preferredName}. Ready to master today’s syllabus?
              </h2>
              <p className="text-sm text-slate-400 max-w-2xl leading-relaxed">
                Aligned with the Ghana Education Service (GES) curriculum across Elective &amp; Core Subjects, Flashcards, Paper 1 Objectives, Paper 2 Theory, and Paper 3 Practicals.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <button
              type="button"
              onClick={onEditProfile}
              className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs sm:text-sm font-medium text-slate-200 transition-colors whitespace-nowrap"
            >
              Edit Profile
            </button>
            <button
              type="button"
              onClick={() => onNavigate('exam')}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-semibold text-xs sm:text-sm transition-colors whitespace-nowrap"
            >
              <span>Configure WASSCE Mock</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* 4-column KPI Strip */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-6 pt-6 border-t border-slate-800/80">
          <div>
            <div className="text-xs text-slate-400 flex items-center gap-1.5">
              <Flame className="w-3.5 h-3.5 text-amber-400" />
              <span>Daily Streak</span>
            </div>
            <div className="text-2xl font-bold text-white tabular-nums mt-1 border-[#ffffff]">
              {streak.currentStreak} days
            </div>
            <div className="text-xs text-slate-500 mt-0.5 tabular-nums">
              Best: {streak.longestStreak} days
            </div>
          </div>

          <div>
            <div className="text-xs text-slate-400 flex items-center gap-1.5">
              <Target className="w-3.5 h-3.5 text-cyan-400" />
              <span>Daily Target</span>
            </div>
            <div className="text-2xl font-bold text-white tabular-nums mt-1">
              {streak.questionsSolvedToday} / {profile.dailyQuestionGoal}
            </div>
            <div className="w-full h-1.5 bg-slate-800 rounded-full mt-2 overflow-hidden">
              <div
                className="h-full bg-cyan-400 rounded-full transition-all duration-300"
                style={{ width: `${goalPct}%` }}
              />
            </div>
          </div>

          <div>
            <div className="text-xs text-slate-400 flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              <span>Overall Accuracy</span>
            </div>
            <div className="text-2xl font-bold text-white tabular-nums mt-1">
              {overallAccuracy}%
            </div>
            <div className="text-xs text-slate-500 mt-0.5 tabular-nums">
              {totalQuestionsSolved} questions solved
            </div>
          </div>

          <div>
            <div className="text-xs text-slate-400 flex items-center gap-1.5">
              <AlertCircle className="w-3.5 h-3.5 text-rose-400" />
              <span>Mistake Bank</span>
            </div>
            <div className="text-2xl font-bold text-white tabular-nums mt-1">
              {activeMistakes} pending
            </div>
            <button
              type="button"
              onClick={onReviewMistakes}
              className="text-xs text-cyan-400 hover:text-cyan-300 font-medium mt-0.5 inline-flex items-center gap-1"
            >
              <span>Review missed items</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>
        </div>
      </section>
      )}

      {/* Today's Learning Timetable Card */}
      {todayPlan && visibility.showDashboardTodayTimetable && (
        <section
          data-testid="dashboard-today-timetable"
          className="rounded-2xl bg-slate-900/90 border border-slate-800/90 p-5 sm:p-6 space-y-4"
        >
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-cyan-300">
                <CalendarDays className="w-4 h-4" />
                <span>Today&apos;s Learning Timetable · {todayPlan.dayLabel}</span>
              </div>
              <h3 className="font-display text-lg font-bold text-white mt-0.5">
                {todayPlan.completedCount}/{todayPlan.totalCount} Scheduled Sessions Complete
              </h3>
              {focusMode && (
                <p className="text-xs text-slate-400 mt-1">
                  Distraction-Free Focus · Only today&apos;s scheduled study blocks are visible.
                </p>
              )}
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => onNavigate('videos')}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 transition-colors"
              >
                <PlayCircle className="w-3.5 h-3.5 text-cyan-400" />
                <span>All AI Videos</span>
              </button>
              <button
                type="button"
                onClick={() => onNavigate('timetable')}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-cyan-500/15 hover:bg-cyan-500/25 border border-cyan-500/35 text-xs font-semibold text-cyan-200 transition-colors"
              >
                <span>Open Weekly Grid</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
            {todayPlan.items.map((item) => {
              const sub = SUBJECTS[item.subjectId];
              return (
                <div
                  key={item.slotId}
                  className={`rounded-xl border p-4 flex flex-col justify-between gap-3 ${
                    item.isCompleted
                      ? 'bg-emerald-500/8 border-emerald-500/35'
                      : 'bg-slate-950/75 border-slate-800'
                  }`}
                >
                  <div className="space-y-1.5 min-w-0">
                    <div className="flex items-center justify-between gap-2 text-[11px]">
                      <span className="font-mono text-slate-400 tabular-nums">{item.slotLabel}</span>
                      {onToggleTimetableBlock && (
                        <button
                          type="button"
                          onClick={() => onToggleTimetableBlock(item.completionKey)}
                          aria-pressed={item.isCompleted}
                          className={`inline-flex items-center gap-1 font-semibold ${
                            item.isCompleted ? 'text-emerald-300' : 'text-slate-400 hover:text-white'
                          }`}
                        >
                          {item.isCompleted ? (
                            <CheckCircle2 className="w-3.5 h-3.5" />
                          ) : (
                            <Circle className="w-3.5 h-3.5" />
                          )}
                          <span>{item.isCompleted ? 'Done' : 'Complete'}</span>
                        </button>
                      )}
                    </div>
                    <div className={`font-display text-base font-bold ${sub.textClass}`}>
                      {sub.name}
                    </div>
                    <div className="text-xs text-slate-300 line-clamp-2">
                      {item.recommendedNote?.title ?? item.syllabusTopic?.title ?? sub.description}
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-1.5 pt-2 border-t border-slate-800/70">
                    {item.recommendedNote && onWatchVideoNote && (
                      <button
                        type="button"
                        onClick={() => onWatchVideoNote(item.recommendedNote!.id)}
                        className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-[11px] font-bold transition-colors"
                      >
                        <PlayCircle className="w-3 h-3" />
                        <span>Video</span>
                      </button>
                    )}
                    {item.recommendedNote && onLaunchAITeacher && (
                      <button
                        type="button"
                        onClick={() =>
                          onLaunchAITeacher({
                            subject: item.subjectId,
                            grade: item.recommendedNote!.grade,
                            topicTitle: item.recommendedNote!.title,
                            topicSummary: item.recommendedNote!.content.slice(0, 1000),
                            sourceLabel: 'Dashboard Timetable',
                            autoStart: true,
                          })
                        }
                        className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-emerald-500/15 border border-emerald-500/35 text-emerald-200 hover:bg-emerald-500/25 text-[11px] font-semibold transition-colors"
                      >
                        <GraduationCap className="w-3 h-3" />
                        <span>AI Teacher</span>
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={() => onStartQuickQuiz(item.subjectId)}
                      className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-[11px] font-medium transition-colors"
                    >
                      <span>Quiz</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* Subject Mastery & Quick Launch Cards (hidden in Global Focus Mode) */}
      {visibility.showDashboardSubjectHubs && (
      <section data-testid="dashboard-subject-hubs" className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h3 className="font-display text-lg font-bold text-white">
              GES Elective &amp; Core Subject Hubs
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Track mastery across SHS 1–3 units, flashcards, or launch a targeted WASSCE drill
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="inline-flex items-center p-1 rounded-xl bg-slate-900 border border-slate-800">
              {(
                [
                  { id: 'all', label: `All (${SUBJECT_LIST.length})` },
                  { id: 'elective', label: 'Electives (5)' },
                  { id: 'core', label: 'Core (4)' },
                ] as const
              ).map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setCategoryFilter(tab.id)}
                  aria-pressed={categoryFilter === tab.id}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                    categoryFilter === tab.id
                      ? 'bg-slate-800 text-white'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            <button
              type="button"
              onClick={() => onNavigate('subjects')}
              className="text-xs font-medium text-cyan-400 hover:text-cyan-300 whitespace-nowrap"
            >
              View full syllabus
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {visibleSubjects.map((sub) => {
            const stat = masteryStats.find((m) => m.subject === sub.id);
            const topicCount = SYLLABUS_TOPICS.filter((t) => t.subject === sub.id).length;
            const masteryPct = stat?.averagePercentage ?? 0;
            const isFocused = profile.subjects.includes(sub.id);

            return (
              <div
                key={sub.id}
                className="rounded-2xl bg-slate-900/80 border border-slate-800/80 overflow-hidden flex flex-col justify-between hover:border-slate-700 transition-colors"
              >
                <div className="relative h-24 bg-slate-950 overflow-hidden">
                  <img
                    src={sub.illustrationUrl}
                    alt={sub.illustrationAlt}
                    className="w-full h-full object-cover opacity-80"
                  />
                  <div
                    className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/40 to-transparent"
                    aria-hidden="true"
                  />
                  <div className="absolute bottom-2.5 left-4 right-4 flex items-center justify-between gap-2 text-xs">
                    <span className="text-slate-300 font-medium">
                      {sub.category === 'core' ? 'Core WASSCE' : 'Elective'} · {topicCount} Units
                    </span>
                    {isFocused && <span className={`font-semibold ${sub.textClass}`}>Focused</span>}
                  </div>
                </div>

                <div className="p-5 flex-1 flex flex-col justify-between gap-4">
                  <div>
                    <h4 className="font-display text-lg font-bold text-white">{sub.name}</h4>
                    <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">{sub.description}</p>
                  </div>

                  <div className="space-y-3">
                    <div>
                      <div className="flex items-center justify-between text-xs mb-1.5 tabular-nums">
                        <span className="text-slate-400">Mock Mastery</span>
                        <span className={`font-semibold ${sub.textClass}`}>{masteryPct}%</span>
                      </div>
                      <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full ${sub.progressClass} transition-all duration-300`}
                          style={{ width: `${Math.max(4, masteryPct)}%` }}
                        />
                      </div>
                    </div>

                    <div className="flex items-center gap-2 pt-1">
                      <button
                        type="button"
                        onClick={() => onOpenSubject(sub.id)}
                        className="flex-1 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-medium text-slate-200 transition-colors whitespace-nowrap"
                      >
                        Topics &amp; Cards
                      </button>
                      <button
                        type="button"
                        onClick={() => onStartQuickQuiz(sub.id)}
                        className={`flex-1 px-3 py-2 rounded-xl border ${sub.bgSoftClass} ${sub.borderClass} ${sub.textClass} hover:brightness-110 text-xs font-semibold transition-all whitespace-nowrap`}
                      >
                        Practice Quiz
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}

          {/* Practical Lab Spotlight Card */}
          <div className="rounded-2xl bg-slate-900/80 border border-slate-800/80 p-5 flex flex-col justify-between gap-4">
            <div>
              <div className="text-xs text-slate-400 mb-2">Paper 3 Interactive Workbench</div>
              <h4 className="font-display text-lg font-bold text-white">
                Virtual Practical &amp; Simulation Lab
              </h4>
              <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">
                Run Ohm’s Law circuits, projectile kinematics, acid-base titration pH curves, logic gates, and PhET experiments.
              </p>
            </div>
            <div className="flex items-center gap-2 pt-1">
              <button
                type="button"
                onClick={() => onNavigate('practicals')}
                className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 hover:bg-emerald-500/20 text-xs font-semibold transition-colors"
              >
                <FlaskConical className="w-4 h-4" />
                <span>Open Practical Lab</span>
              </button>
            </div>
          </div>
        </div>
      </section>
      )}

      {/* Bottom Split: Recent Mock History + Quick Study Tools (hidden in Global Focus Mode) */}
      {visibility.showDashboardRecentAndWorkspace && (
      <section data-testid="dashboard-recent-and-workspace" className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 rounded-2xl bg-slate-900/80 border border-slate-800/80 p-5 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-display text-base font-bold text-white">Recent WASSCE Assessments</h3>
            <button
              type="button"
              onClick={() => onNavigate('analytics')}
              className="text-xs font-medium text-cyan-400 hover:text-cyan-300"
            >
              Full analytics
            </button>
          </div>

          {recentAttempts.length === 0 ? (
            <div className="py-8 text-center text-sm text-slate-400">
              No assessments completed yet. Start a mock exam to log your performance.
            </div>
          ) : (
            <div className="divide-y divide-slate-800/80">
              {recentAttempts.map((att) => {
                const sub = SUBJECTS[att.subject];
                return (
                  <div
                    key={att.id}
                    className="py-3 flex items-center justify-between gap-4 text-sm"
                  >
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className={`font-semibold ${sub.textClass}`}>{sub.shortName}</span>
                        <span className="text-slate-600" aria-hidden="true">·</span>
                        <span className="text-slate-200 font-medium truncate">
                          {att.paperType === 'mcq' ? 'Paper 1 (MCQ)' : 'Paper 2 (Theory)'}
                        </span>
                        <span className="text-slate-600" aria-hidden="true">·</span>
                        <span className="text-xs text-slate-400">{att.gradeFilter}</span>
                      </div>
                      <div className="text-xs text-slate-500 truncate mt-0.5">
                        {att.topicTitles.join(', ')}
                      </div>
                    </div>

                    <div className="text-right shrink-0 tabular-nums">
                      <div className="font-bold text-white">{att.percentage}%</div>
                      <div className="text-xs text-slate-400">
                        {att.score}/{att.maxScore} · {Math.max(1, Math.round(att.durationSeconds / 60))}m
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <div className="rounded-2xl bg-slate-900/80 border border-slate-800/80 p-5 flex flex-col justify-between gap-4">
          <div className="space-y-3">
            <h3 className="font-display text-base font-bold text-white">Study Workspace</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Organize KaTeX formula sheets, titration lab notes, spaced-repetition flashcards, and Python/SQL snippets saved locally.
            </p>
            <div className="space-y-2 pt-1 text-xs text-slate-300">
              <div className="flex items-center gap-2">
                <BookOpen className="w-3.5 h-3.5 text-cyan-400" />
                <span className="tabular-nums">
                  {SYLLABUS_TOPICS.length} GES Syllabus Units (SHS 1–3)
                </span>
              </div>
              <div className="flex items-center gap-2">
                <GraduationCap className="w-3.5 h-3.5 text-violet-400" />
                <span className="tabular-nums">
                  {CURRICULUM_TOTALS.mcqs} Paper 1 MCQs &amp; {CURRICULUM_TOTALS.theory} Paper 2 Essays
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-3.5 h-3.5 text-emerald-400" />
                <span className="tabular-nums">{streak.totalStudyMinutes} mins logged study time</span>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <button
              type="button"
              onClick={() => onNavigate('tutor')}
              className="w-full inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-cyan-500/15 hover:bg-cyan-500/25 border border-cyan-500/30 text-xs font-semibold text-cyan-300 transition-colors"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Ask AI Study Tutor</span>
            </button>
            <button
              type="button"
              onClick={() => onNavigate('notes')}
              className="w-full py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-white transition-colors"
            >
              Open Personal Study Notes
            </button>
          </div>
        </div>
      </section>
      )}
    </div>
  );
};
