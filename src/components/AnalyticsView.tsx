import React, { useEffect, useState } from 'react';
import {
  AlertTriangle,
  Award,
  CheckCircle2,
  Download,
  Play,
  RotateCcw,
  Sparkles,
} from 'lucide-react';
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { getAllCachedMcqs, loadMcqsForSubjects } from '../data/curriculumLoader';
import { SUBJECTS, SUBJECT_LIST } from '../data/subjects';
import type {
  AchievementBadge,
  ExamAttempt,
  MCQQuestion,
  MistakeEntry,
  StreakData,
  SubjectId,
} from '../types';
import type { SubjectMasteryStats } from '../utils/quizEngine';
import { MathText } from './MathText';

interface AnalyticsViewProps {
  attempts: ExamAttempt[];
  mistakes: MistakeEntry[];
  masteryStats: SubjectMasteryStats[];
  achievements: AchievementBadge[];
  streak: StreakData;
  overallAccuracy: number;
  totalQuestionsSolved: number;
  totalStudyMinutes: number;
  onToggleMistakeMastered: (questionId: string) => void;
  onPracticeMistakes: (subject?: SubjectId) => void;
  onAskTutorAboutMistake: (question: {
    id: string;
    subject: SubjectId;
    grade: 'SHS1' | 'SHS2' | 'SHS3';
    topicId: string;
    topicTitle: string;
    prompt: string;
    options: [string, string, string, string];
    selectedOptionIndex: number | null;
  }) => void;
  onExportBackup: () => void;
  onResetProgress: () => void;
}

export const AnalyticsView: React.FC<AnalyticsViewProps> = ({
  attempts,
  mistakes,
  masteryStats,
  achievements,
  streak,
  overallAccuracy,
  totalQuestionsSolved,
  totalStudyMinutes,
  onToggleMistakeMastered,
  onPracticeMistakes,
  onAskTutorAboutMistake,
  onExportBackup,
  onResetProgress,
}) => {
  const [tab, setTab] = useState<'overview' | 'mistakes' | 'history'>('overview');
  const [mistakeSubjectFilter, setMistakeSubjectFilter] = useState<SubjectId | 'ALL'>('ALL');
  const [loadedMcqs, setLoadedMcqs] = useState<MCQQuestion[]>(() => getAllCachedMcqs());

  useEffect(() => {
    if (mistakes.length === 0) return;
    let cancelled = false;
    const subjectsNeeded = Array.from(new Set(mistakes.map((m) => m.subject)));
    void loadMcqsForSubjects(subjectsNeeded)
      .then((pool) => {
        if (!cancelled) setLoadedMcqs(pool);
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, [mistakes]);

  const chartData = [...attempts]
    .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime())
    .map((a, idx) => ({
      name: `#${idx + 1} ${SUBJECTS[a.subject].shortName}`,
      score: a.percentage,
      date: new Date(a.timestamp).toLocaleDateString(),
    }));

  const pendingMistakes = mistakes.filter((m) => !m.mastered);
  const visibleMistakes = mistakes.filter((m) =>
    mistakeSubjectFilter === 'ALL' ? true : m.subject === mistakeSubjectFilter
  );

  return (
    <div className="space-y-6">
      {/* Header Controls */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="inline-flex items-center p-1 rounded-xl bg-slate-900 border border-slate-800">
          {(
            [
              { id: 'overview', label: 'Mastery & Trends' },
              { id: 'mistakes', label: `Mistake Bank (${pendingMistakes.length})` },
              { id: 'history', label: `Exam Log (${attempts.length})` },
            ] as const
          ).map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => setTab(t.id)}
              aria-pressed={tab === t.id}
              className={`px-3.5 py-2 rounded-lg text-xs font-semibold transition-colors whitespace-nowrap ${
                tab === t.id ? 'bg-slate-800 text-white' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onExportBackup}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-xs font-medium text-slate-200 transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export JSON</span>
          </button>
          <button
            type="button"
            onClick={onResetProgress}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-rose-950/40 border border-slate-800 text-xs font-medium text-slate-400 hover:text-rose-300 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Stats</span>
          </button>
        </div>
      </div>

      {/* KPI Summary Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="rounded-2xl bg-slate-900/80 border border-slate-800 p-4">
          <div className="text-xs text-slate-400">Overall Accuracy</div>
          <div className="text-2xl font-bold text-emerald-400 tabular-nums mt-1">{overallAccuracy}%</div>
        </div>
        <div className="rounded-2xl bg-slate-900/80 border border-slate-800 p-4">
          <div className="text-xs text-slate-400">Questions Solved</div>
          <div className="text-2xl font-bold text-white tabular-nums mt-1">{totalQuestionsSolved}</div>
        </div>
        <div className="rounded-2xl bg-slate-900/80 border border-slate-800 p-4">
          <div className="text-xs text-slate-400">Exams Completed</div>
          <div className="text-2xl font-bold text-cyan-400 tabular-nums mt-1">{attempts.length}</div>
        </div>
        <div className="rounded-2xl bg-slate-900/80 border border-slate-800 p-4">
          <div className="text-xs text-slate-400">Study Time Logged</div>
          <div className="text-2xl font-bold text-violet-400 tabular-nums mt-1">
            {Math.max(totalStudyMinutes, streak.totalStudyMinutes)} min
          </div>
        </div>
      </div>

      {tab === 'overview' && (
        <>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Score Trend Line Chart */}
            <div className="lg:col-span-2 rounded-2xl bg-slate-900/85 border border-slate-800/90 p-5 space-y-4">
              <div>
                <h3 className="font-display text-base font-bold text-white">
                  Assessment Score Trend Over Time
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Percentage scores across completed Paper 1 and Paper 2 attempts
                </p>
              </div>
              <div className="h-64 w-full">
                {chartData.length === 0 ? (
                  <div className="h-full flex items-center justify-center text-sm text-slate-500">
                    Complete your first mock exam to plot score trends.
                  </div>
                ) : (
                  <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={200} debounce={50}>
                    <LineChart data={chartData} margin={{ top: 10, right: 16, left: -16, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                      <XAxis dataKey="name" stroke="#64748b" fontSize={11} />
                      <YAxis domain={[0, 100]} stroke="#64748b" fontSize={11} />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: '#0f172a',
                          border: '1px solid #334155',
                          borderRadius: '10px',
                          fontSize: '12px',
                        }}
                      />
                      <Line
                        type="monotone"
                        dataKey="score"
                        stroke="#22d3ee"
                        strokeWidth={2.5}
                        dot={{ r: 4, fill: '#22d3ee' }}
                        activeDot={{ r: 6 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                )}
              </div>
            </div>

            {/* Subject Mastery Breakdown by Grade */}
            <div className="rounded-2xl bg-slate-900/85 border border-slate-800/90 p-5 space-y-4">
              <h3 className="font-display text-base font-bold text-white">
                Subject &amp; Form Mastery
              </h3>
              <div className="space-y-4">
                {masteryStats.map((stat) => {
                  const sub = SUBJECTS[stat.subject];
                  return (
                    <div key={stat.subject} className="space-y-1.5">
                      <div className="flex items-center justify-between text-xs tabular-nums">
                        <span className={`font-semibold ${sub.textClass}`}>{sub.shortName}</span>
                        <span className="text-slate-300 font-mono">
                          {stat.averagePercentage}% ({stat.questionsSolved}Q)
                        </span>
                      </div>
                      <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full ${sub.progressClass}`}
                          style={{ width: `${Math.max(3, stat.averagePercentage)}%` }}
                        />
                      </div>
                      <div className="flex items-center gap-3 text-[11px] text-slate-500 font-mono tabular-nums">
                        <span>S1: {stat.byGrade.SHS1}%</span>
                        <span>S2: {stat.byGrade.SHS2}%</span>
                        <span>S3: {stat.byGrade.SHS3}%</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Achievement Badges */}
          <div className="rounded-2xl bg-slate-900/85 border border-slate-800/90 p-5 space-y-4">
            <h3 className="font-display text-base font-bold text-white">
              WASSCE Scholar Achievements
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {achievements.map((badge) => (
                <div
                  key={badge.id}
                  className={`p-4 rounded-xl border ${
                    badge.unlocked
                      ? 'bg-emerald-500/10 border-emerald-500/30'
                      : 'bg-slate-950/60 border-slate-800/80 opacity-75'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2 mb-1.5">
                    <Award
                      className={`w-4 h-4 ${badge.unlocked ? 'text-emerald-400' : 'text-slate-500'}`}
                    />
                    <span className="text-[11px] font-mono text-slate-400 tabular-nums">
                      {badge.progressText}
                    </span>
                  </div>
                  <div className="text-xs font-bold text-white">{badge.title}</div>
                  <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">{badge.description}</p>
                </div>
              ))}
            </div>
          </div>
        </>
      )}

      {tab === 'mistakes' && (
        <div className="rounded-2xl bg-slate-900/85 border border-slate-800/90 p-5 space-y-5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h3 className="font-display text-base font-bold text-white">
                Targeted Mistake Bank
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Every incorrect MCQ is logged here automatically. Re-drill pending items to turn them mastered.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <select
                aria-label="Filter mistake bank by subject"
                value={mistakeSubjectFilter}
                onChange={(e) => setMistakeSubjectFilter(e.target.value as SubjectId | 'ALL')}
                className="px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200"
              >
                <option value="ALL">All Subjects</option>
                {SUBJECT_LIST.map((s) => (
                  <option key={s.id} value={s.id}>{s.shortName}</option>
                ))}
              </select>

              {pendingMistakes.length > 0 && (
                <button
                  type="button"
                  onClick={() =>
                    onPracticeMistakes(
                      mistakeSubjectFilter === 'ALL' ? undefined : mistakeSubjectFilter
                    )
                  }
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-rose-500 hover:bg-rose-400 text-white text-xs font-bold transition-colors whitespace-nowrap"
                >
                  <Play className="w-3.5 h-3.5 fill-current" />
                  <span>Drill Missed Questions</span>
                </button>
              )}
            </div>
          </div>

          {visibleMistakes.length === 0 ? (
            <div className="py-12 text-center text-sm text-slate-400">
              No recorded mistakes in this filter. Keep up the distinction work!
            </div>
          ) : (
            <div className="space-y-3">
              {visibleMistakes.map((m) => {
                const q = loadedMcqs.find((item) => item.id === m.questionId);
                if (!q) return null;
                const sub = SUBJECTS[q.subject];

                return (
                  <div
                    key={m.questionId}
                    className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-3"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
                      <div className="flex items-center gap-2">
                        <span className={`font-semibold ${sub.textClass}`}>{sub.shortName}</span>
                        <span className="text-slate-600" aria-hidden="true">·</span>
                        <span className="text-slate-400">{q.grade} · {q.topicTitle}</span>
                        <span className="text-slate-600" aria-hidden="true">·</span>
                        <span className="text-rose-400 tabular-nums">Missed {m.wrongCount}×</span>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() =>
                            onAskTutorAboutMistake({
                              id: q.id,
                              subject: q.subject,
                              grade: q.grade,
                              topicId: q.topicId,
                              topicTitle: q.topicTitle,
                              prompt: q.prompt,
                              options: q.options,
                              selectedOptionIndex: m.lastSelectedIndex,
                            })
                          }
                          className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-cyan-500/12 hover:bg-cyan-500/20 border border-cyan-500/30 text-xs font-semibold text-cyan-300 transition-colors"
                        >
                          <Sparkles className="w-3.5 h-3.5" />
                          <span>Ask AI</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => onToggleMistakeMastered(m.questionId)}
                          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg border text-xs font-medium transition-colors ${
                            m.mastered
                              ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-300'
                              : 'bg-slate-900 border-slate-700 text-slate-300 hover:border-emerald-500/40'
                          }`}
                        >
                          {m.mastered ? (
                            <>
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              <span>Mastered</span>
                            </>
                          ) : (
                            <>
                              <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
                              <span>Mark Mastered</span>
                            </>
                          )}
                        </button>
                      </div>
                    </div>

                    <div className="text-sm text-white leading-relaxed">
                      <MathText text={q.prompt} />
                    </div>

                    <div className="text-xs text-emerald-300 bg-emerald-500/8 border border-emerald-500/20 rounded-lg p-3 leading-relaxed">
                      <span className="font-semibold">Correct Answer ({['A', 'B', 'C', 'D'][q.correctIndex]}): </span>
                      <MathText text={q.options[q.correctIndex]} />
                      <div className="text-slate-300 mt-1">
                        <MathText text={q.stepByStepWorkings} />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {tab === 'history' && (
        <div className="rounded-2xl bg-slate-900/85 border border-slate-800/90 p-5 space-y-4">
          <h3 className="font-display text-base font-bold text-white">Mock Exam Attempt History</h3>
          {attempts.length === 0 ? (
            <div className="py-10 text-center text-sm text-slate-400">
              No exam attempts logged yet.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead>
                  <tr className="border-b border-slate-800 text-slate-400 text-left">
                    <th className="py-2.5 pr-4">Date</th>
                    <th className="py-2.5 pr-4">Subject</th>
                    <th className="py-2.5 pr-4">Paper &amp; Grade</th>
                    <th className="py-2.5 pr-4">Topics</th>
                    <th className="py-2.5 pr-4 text-right">Score</th>
                    <th className="py-2.5 text-right">Duration</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/70 tabular-nums">
                  {[...attempts]
                    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
                    .map((att) => {
                      const sub = SUBJECTS[att.subject];
                      return (
                        <tr key={att.id} className="hover:bg-slate-800/30">
                          <td className="py-3 pr-4 text-slate-400 whitespace-nowrap">
                            {new Date(att.timestamp).toLocaleDateString()}
                          </td>
                          <td className={`py-3 pr-4 font-semibold ${sub.textClass} whitespace-nowrap`}>
                            {sub.shortName}
                          </td>
                          <td className="py-3 pr-4 text-slate-200 whitespace-nowrap">
                            {att.paperType === 'mcq' ? 'Paper 1 MCQ' : 'Paper 2 Theory'} · {att.gradeFilter}
                          </td>
                          <td className="py-3 pr-4 text-slate-400 max-w-xs truncate">
                            {att.topicTitles.join(', ')}
                          </td>
                          <td className="py-3 pr-4 text-right font-mono font-bold text-white whitespace-nowrap">
                            {att.score}/{att.maxScore} ({att.percentage}%)
                          </td>
                          <td className="py-3 text-right font-mono text-slate-400 whitespace-nowrap">
                            {Math.max(1, Math.round(att.durationSeconds / 60))}m
                          </td>
                        </tr>
                      );
                    })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
