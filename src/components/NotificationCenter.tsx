import React, { useEffect, useRef, useState } from 'react';
import {
  AlertTriangle,
  ArrowRight,
  Bell,
  BellOff,
  BellRing,
  CalendarDays,
  Check,
  Clock,
  Flame,
  Sparkles,
  X,
} from 'lucide-react';
import type {
  StreakData,
  StudyNotificationItem,
  StudyReminderSettings,
  UserProfile,
} from '../types';
import { formatLocalDateKey } from '../utils/studyReminders';

interface NotificationCenterProps {
  profile: UserProfile;
  streak: StreakData;
  settings: StudyReminderSettings;
  notifications: StudyNotificationItem[];
  todayScheduleSummary?: string;
  onOpenTimetable?: () => void;
  onUpdateSettings: (patch: Partial<StudyReminderSettings>) => void;
  onRequestBrowserPermission: () => Promise<void>;
  onPreviewReminder: () => void;
  onActionNotification: (item: StudyNotificationItem) => void;
  onMarkRead: (id: string) => void;
  onMarkAllRead: () => void;
  onSnooze: (minutes: number) => void;
}

const TIME_PRESETS = ['16:00', '18:00', '20:00'];

export const NotificationCenter: React.FC<NotificationCenterProps> = ({
  profile,
  streak,
  settings,
  notifications,
  todayScheduleSummary,
  onOpenTimetable,
  onUpdateSettings,
  onRequestBrowserPermission,
  onPreviewReminder,
  onActionNotification,
  onMarkRead,
  onMarkAllRead,
  onSnooze,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement | null>(null);

  const unreadCount = notifications.filter((n) => !n.read).length;
  const todayKey = formatLocalDateKey(new Date());
  const studiedToday =
    streak.lastActiveDate === todayKey && streak.questionsSolvedToday > 0;
  const goalDone = studiedToday && streak.questionsSolvedToday >= profile.dailyQuestionGoal;

  const browserPermission: NotificationPermission | 'unsupported' =
    typeof window !== 'undefined' && 'Notification' in window
      ? Notification.permission
      : 'unsupported';

  useEffect(() => {
    if (!isOpen) return;
    const handleOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsOpen(false);
    };
    document.addEventListener('mousedown', handleOutside);
    document.addEventListener('keydown', handleEscape);
    return () => {
      document.removeEventListener('mousedown', handleOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen]);

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        aria-expanded={isOpen}
        aria-haspopup="dialog"
        aria-label={
          unreadCount > 0
            ? `Study reminders and notifications (${unreadCount} unread)`
            : 'Study reminders and notifications'
        }
        data-testid="notification-bell-button"
        className={`relative inline-flex items-center justify-center w-9 h-9 rounded-xl border transition-colors ${
          isOpen
            ? 'bg-slate-800 border-cyan-500/50 text-cyan-300'
            : unreadCount > 0
              ? 'bg-amber-500/10 border-amber-500/40 text-amber-300 hover:bg-amber-500/15'
              : 'bg-slate-900 border-slate-800 text-slate-300 hover:text-white hover:bg-slate-800'
        }`}
      >
        {unreadCount > 0 ? <BellRing className="w-4 h-4" /> : <Bell className="w-4 h-4" />}
        {unreadCount > 0 && (
          <span
            data-testid="notification-unread-count"
            className="absolute -top-1.5 -right-1.5 min-w-[18px] h-[18px] px-1 rounded-full bg-amber-400 text-slate-950 text-[10px] font-bold flex items-center justify-center tabular-nums"
          >
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div
          role="dialog"
          aria-label="Daily Study Reminders and Notifications"
          data-testid="notification-popover"
          className="fixed sm:absolute right-3 sm:right-0 left-3 sm:left-auto top-16 sm:top-full sm:mt-2 w-auto sm:w-[400px] max-h-[82vh] flex flex-col rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl z-50 overflow-hidden"
        >
          {/* Popover Header */}
          <div className="px-4 py-3.5 border-b border-slate-800 flex items-center justify-between gap-3">
            <div>
              <h2 className="font-display text-sm font-bold text-white">
                Daily Study Reminders
              </h2>
              <div className="text-[11px] text-slate-400 mt-0.5 tabular-nums flex flex-wrap items-center gap-x-1.5 gap-y-0.5">
                <span className="inline-flex items-center gap-1 whitespace-nowrap">
                  <Flame className="w-3 h-3 text-amber-400 shrink-0" />
                  <span>{streak.currentStreak}d streak</span>
                </span>
                <span aria-hidden="true">·</span>
                <span className="whitespace-nowrap">
                  {streak.questionsSolvedToday}/{profile.dailyQuestionGoal} today
                </span>
                <span aria-hidden="true">·</span>
                <span className="whitespace-nowrap">
                  {goalDone ? 'Target met' : `Check-in ${settings.reminderTime}`}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-1.5 shrink-0">
              {unreadCount > 0 && (
                <button
                  type="button"
                  onClick={onMarkAllRead}
                  className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-[11px] font-medium text-slate-200 transition-colors whitespace-nowrap"
                >
                  Mark all read
                </button>
              )}
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                aria-label="Close reminders panel"
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Schedule & Delivery Preferences */}
          <div className="p-4 border-b border-slate-800/80 bg-slate-950/60 space-y-3">
            <div className="flex items-center justify-between gap-3">
              <div>
                <div className="text-xs font-semibold text-white">
                  Personalized Streak Alerts
                </div>
                <div className="text-[11px] text-slate-400">
                  Remind me if I haven&apos;t practiced before my cutoff time
                </div>
              </div>
              <button
                type="button"
                role="switch"
                aria-checked={settings.enabled}
                aria-label="Toggle daily personalized study reminders"
                data-testid="reminder-toggle-switch"
                onClick={() => onUpdateSettings({ enabled: !settings.enabled })}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-colors whitespace-nowrap shrink-0 ${
                  settings.enabled
                    ? 'bg-cyan-500/15 border-cyan-500/40 text-cyan-300'
                    : 'bg-slate-800 border-slate-700 text-slate-400'
                }`}
              >
                {settings.enabled ? 'Enabled' : 'Paused'}
              </button>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-2">
              <label
                htmlFor="reminder-cutoff-time"
                className="text-xs text-slate-300 flex items-center gap-1.5"
              >
                <Clock className="w-3.5 h-3.5 text-slate-400" />
                <span>Reminder cutoff</span>
              </label>

              <div className="flex items-center gap-1.5">
                {TIME_PRESETS.map((preset) => (
                  <button
                    key={preset}
                    type="button"
                    onClick={() =>
                      onUpdateSettings({
                        reminderTime: preset,
                        lastNotifiedDate: '',
                        snoozedUntilIso: null,
                      })
                    }
                    className={`px-2 py-1 rounded-md text-[11px] font-mono tabular-nums transition-colors ${
                      settings.reminderTime === preset
                        ? 'bg-slate-800 text-cyan-300 border border-cyan-500/40'
                        : 'bg-slate-900 text-slate-400 border border-slate-800 hover:text-slate-200'
                    }`}
                  >
                    {preset}
                  </button>
                ))}
                <input
                  id="reminder-cutoff-time"
                  data-testid="reminder-time-input"
                  type="time"
                  value={settings.reminderTime}
                  onChange={(e) =>
                    onUpdateSettings({
                      reminderTime: e.target.value,
                      lastNotifiedDate: '',
                      snoozedUntilIso: null,
                    })
                  }
                  className="px-2 py-1 rounded-lg bg-slate-900 border border-slate-700 text-xs font-mono text-white tabular-nums [color-scheme:dark] focus:outline-none focus:border-cyan-400"
                />
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
              {browserPermission === 'unsupported' ? (
                <span className="text-[11px] text-slate-500">
                  Browser push alerts unavailable in this view
                </span>
              ) : browserPermission === 'denied' ? (
                <span className="text-[11px] text-rose-300 flex items-center gap-1">
                  <BellOff className="w-3.5 h-3.5" />
                  <span>Browser notifications blocked in site settings</span>
                </span>
              ) : browserPermission === 'granted' && settings.browserNotificationsEnabled ? (
                <button
                  type="button"
                  onClick={() => onUpdateSettings({ browserNotificationsEnabled: false })}
                  className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-emerald-500/12 border border-emerald-500/30 text-[11px] font-medium text-emerald-300 transition-colors"
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>Browser Alerts On</span>
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => void onRequestBrowserPermission()}
                  className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-[11px] font-medium text-slate-200 transition-colors"
                >
                  <Bell className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Enable Browser Alerts</span>
                </button>
              )}

              <button
                type="button"
                data-testid="preview-reminder-button"
                onClick={onPreviewReminder}
                className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-cyan-500/15 hover:bg-cyan-500/25 border border-cyan-500/35 text-[11px] font-semibold text-cyan-200 transition-colors whitespace-nowrap"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Preview Reminder</span>
              </button>
            </div>

            {todayScheduleSummary && (
              <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between gap-2 text-[11px]">
                <div className="flex items-center gap-1.5 text-slate-300 min-w-0">
                  <CalendarDays className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                  <span className="truncate">Today: {todayScheduleSummary}</span>
                </div>
                {onOpenTimetable && (
                  <button
                    type="button"
                    onClick={() => {
                      setIsOpen(false);
                      onOpenTimetable();
                    }}
                    className="text-cyan-400 hover:text-cyan-300 font-semibold shrink-0"
                  >
                    Schedule
                  </button>
                )}
              </div>
            )}
          </div>

          {/* Notification Feed */}
          <div className="flex-1 overflow-y-auto divide-y divide-slate-800/80">
            {notifications.length === 0 ? (
              <div className="p-6 text-center space-y-2">
                <p className="text-xs font-medium text-slate-300">
                  {goalDone
                    ? `Today's ${profile.dailyQuestionGoal}-question target is complete!`
                    : 'All caught up on study reminders'}
                </p>
                <p className="text-[11px] text-slate-500 leading-relaxed">
                  {settings.enabled
                    ? `If you haven't logged a session by ${settings.reminderTime}, a personalized reminder tailored to your ${streak.currentStreak}-day streak will appear here.`
                    : 'Daily check-in reminders are paused. Re-enable above to protect your study streak.'}
                </p>
              </div>
            ) : (
              notifications.map((item) => (
                <div
                  key={item.id}
                  data-testid="notification-feed-item"
                  className={`p-4 space-y-2.5 transition-colors ${
                    item.read ? 'bg-slate-900/40 opacity-75' : 'bg-slate-900'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-start gap-2.5 min-w-0">
                      <span
                        className={`mt-0.5 shrink-0 ${
                          item.urgency === 'urgent'
                            ? 'text-amber-400'
                            : item.urgency === 'warning'
                              ? 'text-amber-300'
                              : 'text-cyan-400'
                        }`}
                      >
                        {item.urgency === 'urgent' ? (
                          <AlertTriangle className="w-4 h-4" />
                        ) : (
                          <Flame className="w-4 h-4" />
                        )}
                      </span>
                      <div className="min-w-0">
                        <div className="text-xs font-semibold text-white leading-snug">
                          {item.title}
                        </div>
                        <div className="text-[11px] text-slate-400 mt-1 leading-relaxed">
                          {item.message}
                        </div>
                      </div>
                    </div>

                    {!item.read && (
                      <button
                        type="button"
                        onClick={() => onMarkRead(item.id)}
                        aria-label={`Mark "${item.title}" as read`}
                        className="text-[11px] text-slate-400 hover:text-slate-200 shrink-0"
                      >
                        Done
                      </button>
                    )}
                  </div>

                  <div className="flex flex-wrap items-center justify-between gap-2 pl-6">
                    <button
                      type="button"
                      onClick={() => {
                        setIsOpen(false);
                        onActionNotification(item);
                      }}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-[11px] font-semibold transition-colors whitespace-nowrap"
                    >
                      <span>{item.ctaLabel}</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>

                    <div className="flex items-center gap-3 text-[11px] text-slate-500 tabular-nums">
                      {!item.read && (
                        <button
                          type="button"
                          onClick={() => {
                            onSnooze(30);
                            onMarkRead(item.id);
                          }}
                          className="text-slate-400 hover:text-slate-200 transition-colors"
                        >
                          Snooze 30m
                        </button>
                      )}
                      <span>{item.dateKey}</span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};
