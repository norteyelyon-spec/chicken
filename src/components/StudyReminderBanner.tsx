import React from 'react';
import { AlertTriangle, ArrowRight, CalendarDays, Clock, Flame, X } from 'lucide-react';
import type { StudyNotificationItem } from '../types';

interface StudyReminderBannerProps {
  notification: StudyNotificationItem;
  onAction: (item: StudyNotificationItem) => void;
  onSnooze: (minutes: number) => void;
  onDismiss: (id: string) => void;
}

export const StudyReminderBanner: React.FC<StudyReminderBannerProps> = ({
  notification,
  onAction,
  onSnooze,
  onDismiss,
}) => {
  const isUrgent = notification.urgency === 'urgent' || notification.urgency === 'warning';

  return (
    <section
      role="region"
      aria-label="Daily Study Streak Reminder"
      data-testid="study-reminder-banner"
      className={`relative mb-5 rounded-2xl border p-4 sm:p-5 flex flex-col lg:flex-row lg:items-center justify-between gap-4 transition-colors ${
        isUrgent
          ? 'bg-slate-900/95 border-amber-500/40'
          : 'bg-slate-900/95 border-cyan-500/35'
      }`}
    >
      <div className="flex items-start gap-3.5 min-w-0 pr-8 lg:pr-0">
        <div
          className={`w-10 h-10 rounded-xl border flex items-center justify-center shrink-0 ${
            isUrgent
              ? 'bg-amber-500/15 border-amber-500/35 text-amber-300'
              : 'bg-cyan-500/15 border-cyan-500/35 text-cyan-300'
          }`}
        >
          {notification.kind === 'streak-at-risk' ? (
            <AlertTriangle className="w-5 h-5" />
          ) : notification.kind === 'daily-timetable' ? (
            <CalendarDays className="w-5 h-5" />
          ) : (
            <Flame className="w-5 h-5" />
          )}
        </div>

        <div className="min-w-0 space-y-1">
          <div className="text-xs font-medium text-slate-400">
            {notification.kind === 'daily-timetable' ? 'Daily Timetable Focus' : 'Daily Study Reminder'} · {notification.dateKey}
          </div>
          <h2 className="font-display text-sm sm:text-base font-bold text-white leading-snug">
            {notification.title}
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-3xl">
            {notification.message}
          </p>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2 shrink-0">
        <button
          type="button"
          onClick={() => onAction(notification)}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs sm:text-sm font-semibold transition-colors whitespace-nowrap"
        >
          <span>{notification.ctaLabel}</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>

        <button
          type="button"
          onClick={() => onSnooze(30)}
          className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium transition-colors whitespace-nowrap"
        >
          <Clock className="w-3.5 h-3.5 text-slate-400" />
          <span>Snooze 30m</span>
        </button>

        <button
          type="button"
          onClick={() => onDismiss(notification.id)}
          aria-label="Dismiss daily study reminder"
          className="absolute top-3.5 right-3.5 lg:static p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </section>
  );
};
