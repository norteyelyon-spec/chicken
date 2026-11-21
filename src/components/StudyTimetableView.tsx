import React, { useMemo } from 'react';
import {
  BellRing,
  BookOpen,
  CalendarDays,
  CheckCircle2,
  Circle,
  Coffee,
  GraduationCap,
  HardDrive,
  PlayCircle,
  RotateCcw,
  Target,
} from 'lucide-react';
import { SUBJECTS, SUBJECT_LIST } from '../data/subjects';
import type {
  StudyNote,
  StudyTimetableSchedule,
  SubjectId,
  TeachingLaunchTarget,
  TimetableDayId,
  UserProfile,
} from '../types';
import {
  getTodayLearningPlan,
  TIMETABLE_DAYS,
} from '../utils/studyTimetable';

interface StudyTimetableViewProps {
  schedule: StudyTimetableSchedule;
  notes: StudyNote[];
  profile: UserProfile;
  completedKeys: Record<string, boolean>;
  onUpdateSlot: (dayId: TimetableDayId, slotId: string, subjectId: SubjectId) => void;
  onToggleBlockCompleted: (completionKey: string) => void;
  onResetSchedule: () => void;
  onWatchVideoNote: (noteId: string) => void;
  onReadNote: (noteId: string) => void;
  onPracticeSubject: (subjectId: SubjectId) => void;
  onLaunchAITeacher: (target: TeachingLaunchTarget) => void;
  onSendTodayAlert: () => void;
  onOpenGoogleDrive?: () => void;
}

export const StudyTimetableView: React.FC<StudyTimetableViewProps> = ({
  schedule,
  notes,
  profile,
  completedKeys,
  onUpdateSlot,
  onToggleBlockCompleted,
  onResetSchedule,
  onWatchVideoNote,
  onReadNote,
  onPracticeSubject,
  onLaunchAITeacher,
  onSendTodayAlert,
  onOpenGoogleDrive,
}) => {
  const todayPlan = useMemo(
    () => getTodayLearningPlan(schedule, notes, profile, new Date(), completedKeys),
    [schedule, notes, profile, completedKeys]
  );

  return (
    <div className="space-y-6">
      {/* Today's Learning Focus Hero */}
      <section className="rounded-2xl bg-slate-900/90 border border-slate-800 p-5 sm:p-6 space-y-5">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="space-y-1.5 min-w-0">
            <div className="inline-flex items-center gap-2 text-xs font-semibold text-cyan-300">
              <CalendarDays className="w-4 h-4 shrink-0" />
              <span>Today on Your Timetable · {todayPlan.dayLabel} ({todayPlan.dateKey})</span>
            </div>
            <h2 className="font-display text-xl sm:text-2xl font-bold text-white tracking-tight">
              What to Learn Today ({profile.gradeLevel})
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 max-w-2xl leading-relaxed">
              Three focused 1-hour study sessions separated by dedicated breaks. Check off completed blocks as you finish your video lessons, notes, or Paper 1 drills.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 shrink-0">
            <div className="px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs tabular-nums">
              <span className="text-slate-400">Today&apos;s Progress: </span>
              <span className="font-bold text-emerald-300">
                {todayPlan.completedCount} / {todayPlan.totalCount} done
              </span>
            </div>
            <button
              type="button"
              onClick={onSendTodayAlert}
              data-testid="timetable-send-alert-btn"
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-amber-500/15 hover:bg-amber-500/25 border border-amber-500/35 text-xs font-semibold text-amber-200 transition-colors whitespace-nowrap"
            >
              <BellRing className="w-3.5 h-3.5" />
              <span>Notify Today&apos;s Plan</span>
            </button>
            {onOpenGoogleDrive && (
              <button
                type="button"
                onClick={onOpenGoogleDrive}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-cyan-500/15 hover:bg-cyan-500/25 border border-cyan-500/35 text-xs font-semibold text-cyan-200 transition-colors whitespace-nowrap"
              >
                <HardDrive className="w-3.5 h-3.5" />
                <span>Drive Backup</span>
              </button>
            )}
          </div>
        </div>

        {/* 3 Daily Study Session Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {todayPlan.items.map((block) => {
            const sub = SUBJECTS[block.subjectId];
            return (
              <div
                key={block.slotId}
                data-testid={`today-block-${block.slotId}`}
                className={`rounded-2xl border p-4 flex flex-col justify-between gap-4 transition-colors ${
                  block.isCompleted
                    ? 'bg-emerald-500/8 border-emerald-500/40'
                    : 'bg-slate-950/80 border-slate-800'
                }`}
              >
                <div className="space-y-2.5 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[11px] font-mono text-slate-400 tabular-nums">
                      {block.slotLabel}
                    </span>
                    <button
                      type="button"
                      onClick={() => onToggleBlockCompleted(block.completionKey)}
                      aria-pressed={block.isCompleted}
                      aria-label={`Mark ${sub.name} session (${block.slotLabel}) complete`}
                      className={`inline-flex items-center gap-1 text-xs font-semibold transition-colors ${
                        block.isCompleted ? 'text-emerald-300' : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      {block.isCompleted ? (
                        <CheckCircle2 className="w-4 h-4" />
                      ) : (
                        <Circle className="w-4 h-4" />
                      )}
                      <span>{block.isCompleted ? 'Completed' : 'Mark Done'}</span>
                    </button>
                  </div>

                  <div>
                    <h3 className={`font-display text-lg font-bold ${sub.textClass}`}>
                      {sub.name}
                    </h3>
                    <div className="text-xs text-slate-300 font-medium mt-1 line-clamp-2">
                      {block.recommendedNote
                        ? block.recommendedNote.title
                        : block.syllabusTopic
                          ? `${block.syllabusTopic.unitNumber}: ${block.syllabusTopic.title}`
                          : sub.description}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-1.5 pt-2 border-t border-slate-800/80">
                  {block.recommendedNote && (
                    <>
                      <button
                        type="button"
                        onClick={() => onWatchVideoNote(block.recommendedNote!.id)}
                        className="inline-flex items-center justify-center gap-1 px-2.5 py-1.5 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-[11px] font-bold transition-colors"
                      >
                        <PlayCircle className="w-3.5 h-3.5 shrink-0" />
                        <span>AI Video</span>
                      </button>
                      <button
                        type="button"
                        onClick={() =>
                          onLaunchAITeacher({
                            subject: block.subjectId,
                            grade: block.recommendedNote!.grade,
                            topicTitle: block.recommendedNote!.title,
                            topicSummary: block.recommendedNote!.content.slice(0, 1000),
                            sourceLabel: 'Daily Study Timetable',
                            autoStart: true,
                          })
                        }
                        className="inline-flex items-center justify-center gap-1 px-2.5 py-1.5 rounded-lg bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-500/35 text-emerald-200 text-[11px] font-semibold transition-colors"
                      >
                        <GraduationCap className="w-3.5 h-3.5 shrink-0" />
                        <span>AI Teacher</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => onReadNote(block.recommendedNote!.id)}
                        className="inline-flex items-center justify-center gap-1 px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-[11px] font-medium transition-colors"
                      >
                        <BookOpen className="w-3.5 h-3.5 shrink-0" />
                        <span>Note</span>
                      </button>
                    </>
                  )}
                  <button
                    type="button"
                    onClick={() => onPracticeSubject(block.subjectId)}
                    className="inline-flex items-center justify-center gap-1 px-2.5 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-200 text-[11px] font-medium transition-colors"
                  >
                    <Target className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                    <span>Drill</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Full 7-Day Interactive Weekly Timetable Grid */}
      <section className="rounded-2xl bg-slate-900/90 border border-slate-800 p-5 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h3 className="font-display text-base sm:text-lg font-bold text-white">
              Weekly Study Timetable Grid (Monday – Sunday)
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Customize any study slot directly using its subject selector; daily study reminders update automatically.
            </p>
          </div>
          <button
            type="button"
            onClick={onResetSchedule}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-medium text-slate-200 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Default Grid</span>
          </button>
        </div>

        <div className="overflow-x-auto pb-1">
          <table className="w-full min-w-[780px] border-separate border-spacing-2 text-left">
            <thead>
              <tr>
                <th className="w-28 px-3 py-2 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                  Day
                </th>
                {schedule.slots.map((slot) => (
                  <th
                    key={slot.id}
                    className="px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-[11px] font-mono text-slate-300 text-center tabular-nums"
                  >
                    <div>{slot.label}</div>
                    {slot.kind === 'break' && (
                      <div className="text-[10px] text-slate-500 mt-0.5">REST / BREAK</div>
                    )}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {TIMETABLE_DAYS.map((day) => {
                const isToday = day.id === todayPlan.dayId;
                const row = schedule.grid[day.id];
                return (
                  <tr key={day.id}>
                    <th
                      scope="row"
                      className={`px-3 py-3 rounded-xl border text-xs font-bold tracking-wide uppercase whitespace-nowrap ${
                        isToday
                          ? 'bg-cyan-500/15 border-cyan-500/50 text-cyan-200'
                          : 'bg-slate-950 border-slate-800 text-slate-300'
                      }`}
                    >
                      <div>{day.label}</div>
                      {isToday && (
                        <div className="text-[10px] font-normal text-cyan-300 normal-case mt-0.5">
                          Today
                        </div>
                      )}
                    </th>

                    {schedule.slots.map((slot) => {
                      if (slot.kind === 'break') {
                        return (
                          <td
                            key={slot.id}
                            className="px-3 py-3 rounded-xl bg-slate-950/50 border border-slate-800/70 text-center"
                          >
                            <div className="inline-flex items-center gap-1.5 text-[11px] font-mono text-slate-500">
                              <Coffee className="w-3.5 h-3.5" />
                              <span>BREAK</span>
                            </div>
                          </td>
                        );
                      }

                      const subjectId: SubjectId = row?.[slot.id]?.subjectId ?? 'physics';
                      const sub = SUBJECTS[subjectId];
                      return (
                        <td key={slot.id} className="p-0">
                          <div
                            className={`p-2 rounded-xl border transition-colors ${sub.bgSoftClass} ${sub.borderClass}`}
                          >
                            <label htmlFor={`tt-${day.id}-${slot.id}`} className="sr-only">
                              {day.label} {slot.label} subject
                            </label>
                            <select
                              id={`tt-${day.id}-${slot.id}`}
                              value={subjectId}
                              onChange={(e) =>
                                onUpdateSlot(day.id, slot.id, e.target.value as SubjectId)
                              }
                              className={`w-full bg-transparent text-xs font-bold focus:outline-none cursor-pointer ${sub.textClass}`}
                            >
                              {SUBJECT_LIST.map((optionSub) => (
                                <option
                                  key={optionSub.id}
                                  value={optionSub.id}
                                  className="bg-slate-900 text-slate-100"
                                >
                                  {optionSub.shortName}
                                </option>
                              ))}
                            </select>
                          </div>
                        </td>
                      );
                    })}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
};
