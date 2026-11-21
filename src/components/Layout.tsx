import React, { useState } from 'react';
import {
  BarChart3,
  BookOpen,
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  Cloud,
  Download,
  FileText,
  Flame,
  FlaskConical,
  Focus,
  GraduationCap,
  HardDrive,
  LayoutDashboard,
  Minimize2,
  Pencil,
  Play,
  PlayCircle,
  Sparkles,
  Trophy,
  Wifi,
  WifiOff,
  X,
} from 'lucide-react';
import { usePWAInstall } from '../hooks/usePWA';
import type { NavTab, PersonalizationPreferences, StreakData, UserProfile } from '../types';
import { ACCENT_THEME_PRESETS, DEFAULT_PERSONALIZATION } from '../utils/personalization';
import { getFocusModeVisibility } from '../utils/studyModes';
import { AvatarIcon } from './AvatarIcon';

interface LayoutProps {
  activeTab: NavTab;
  onSelectTab: (tab: NavTab) => void;
  profile: UserProfile;
  streak: StreakData;
  overallAccuracy: number;
  cloudUser?: { email: string | null; displayName: string | null } | null;
  isAuthBusy?: boolean;
  onGoogleSignIn?: () => void;
  onOpenProfile: () => void;
  onOpenQuizModal: () => void;
  onOpenTutorDrawer: () => void;
  driveConnected?: boolean;
  onOpenGoogleDrive?: () => void;
  notificationSlot?: React.ReactNode;
  focusMode?: boolean;
  onToggleFocusMode?: () => void;
  isOffline?: boolean;
  manualOfflineMode?: boolean;
  browserOnline?: boolean;
  onToggleOfflineMode?: () => void;
  personalization?: PersonalizationPreferences;
  onOpenPersonalization?: () => void;
  children: React.ReactNode;
}

const NAV_ITEMS: { id: NavTab; label: string; shortLabel: string; icon: React.ComponentType<{ className?: string }> }[] = [
  { id: 'dashboard', label: 'Dashboard', shortLabel: 'Home', icon: LayoutDashboard },
  { id: 'subjects', label: 'Subject Hubs', shortLabel: 'Subjects', icon: BookOpen },
  { id: 'exam', label: 'Exam & Quiz', shortLabel: 'Exams', icon: GraduationCap },
  { id: 'competitions', label: 'AI Competitions', shortLabel: 'Arena', icon: Trophy },
  { id: 'practicals', label: 'Practical Lab', shortLabel: 'Labs', icon: FlaskConical },
  { id: 'notes', label: 'Study Notes', shortLabel: 'Notes', icon: FileText },
  { id: 'videos', label: 'AI Videos', shortLabel: 'Videos', icon: PlayCircle },
  { id: 'timetable', label: 'Timetable', shortLabel: 'Schedule', icon: CalendarDays },
  { id: 'analytics', label: 'Analytics', shortLabel: 'Stats', icon: BarChart3 },
  { id: 'tutor', label: 'AI Tutor', shortLabel: 'Tutor', icon: Sparkles },
];

const PWAInstallButton: React.FC = () => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [showIOSGuide, setShowIOSGuide] = useState(false);

  if (isInstalled) return null;

  if (isInstallable) {
    return (
      <button
        type="button"
        onClick={() => void install()}
        data-testid="pwa-install-btn"
        aria-label="Install WASSCE Masterclass App"
        className="hidden sm:inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-cyan-300 font-semibold text-xs sm:text-sm transition-colors whitespace-nowrap shrink-0"
      >
        <Download className="w-3.5 h-3.5" />
        <span>Install App</span>
      </button>
    );
  }

  if (isIOS) {
    return (
      <>
        <button
          type="button"
          onClick={() => setShowIOSGuide(true)}
          data-testid="pwa-install-ios-btn"
          aria-label="Install App on iOS"
          className="inline-flex items-center gap-1.5 px-2.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-cyan-300 font-semibold text-xs transition-colors whitespace-nowrap shrink-0"
        >
          <Download className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Install App</span>
        </button>

        {showIOSGuide && (
          <div
            role="dialog"
            aria-modal="true"
            aria-label="Install on iPhone or iPad"
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-xs"
          >
            <div className="w-full max-w-sm rounded-2xl border border-slate-800 bg-slate-950 p-5 space-y-3 shadow-2xl">
              <div className="flex items-center justify-between">
                <h2 className="font-display text-base font-bold text-white">Install WASSCE Masterclass</h2>
                <button
                  type="button"
                  onClick={() => setShowIOSGuide(false)}
                  aria-label="Close install instructions"
                  className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-900"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              <ol className="text-xs text-slate-300 space-y-2 list-decimal list-inside">
                <li>Tap the <strong>Share</strong> button at the bottom of Safari.</li>
                <li>Scroll down and tap <strong>Add to Home Screen</strong>.</li>
                <li>Launch anytime offline directly from your Home Screen.</li>
              </ol>
            </div>
          </div>
        )}
      </>
    );
  }

  return null;
};

export const Layout: React.FC<LayoutProps> = ({
  activeTab,
  onSelectTab,
  profile,
  streak,
  overallAccuracy,
  cloudUser,
  isAuthBusy = false,
  onGoogleSignIn,
  onOpenProfile,
  onOpenQuizModal,
  onOpenTutorDrawer,
  driveConnected = false,
  onOpenGoogleDrive,
  notificationSlot,
  focusMode = false,
  onToggleFocusMode,
  isOffline = false,
  manualOfflineMode = false,
  browserOnline = true,
  onToggleOfflineMode,
  personalization = DEFAULT_PERSONALIZATION,
  onOpenPersonalization,
  children,
}) => {
  const [collapsed, setCollapsed] = useState(false);
  const activeItem = NAV_ITEMS.find((i) => i.id === activeTab) ?? NAV_ITEMS[0];
  const visibility = getFocusModeVisibility(focusMode);
  const theme = ACCENT_THEME_PRESETS[personalization.accentTheme] ?? ACCENT_THEME_PRESETS.cyan;
  const isCompact = personalization.density === 'compact';

  const sidebarCssVar = !visibility.showSidebar
    ? '0px'
    : collapsed
      ? '76px'
      : '256px';

  return (
    <div
      data-accent-theme={personalization.accentTheme}
      data-density={personalization.density}
      style={{ '--sidebar-desktop-w': sidebarCssVar } as React.CSSProperties}
      className="min-h-screen bg-[#07090F] text-slate-100 flex flex-col md:flex-row [--sidebar-w:0px] md:[--sidebar-w:var(--sidebar-desktop-w)]"
    >
      {/* Desktop Collapsible Sidebar (hidden in Global Focus Mode) */}
      {visibility.showSidebar && (
        <aside
          data-testid="layout-sidebar"
          className={`hidden md:flex flex-col shrink-0 border-r border-slate-800/80 bg-slate-950/90 backdrop-blur-md transition-[width] duration-200 ${
            collapsed ? 'w-[76px]' : 'w-64'
          }`}
        >
          <div className="h-16 px-4 flex items-center justify-between border-b border-slate-800/80">
            <div className={`flex items-center gap-2.5 overflow-hidden ${collapsed ? 'justify-center w-full' : ''}`}>
              <div className={`w-8 h-8 rounded-lg border flex items-center justify-center shrink-0 ${theme.badgeClass}`}>
                <GraduationCap className="w-4 h-4" />
              </div>
              {!collapsed && (
                <div className="min-w-0">
                  <span className="font-display font-bold text-sm tracking-tight text-white whitespace-nowrap truncate block">
                    WASSCE Masterclass
                  </span>
                  <span className={`text-[10px] font-medium truncate block ${theme.textClass}`}>
                    {personalization.studioTagline}
                  </span>
                </div>
              )}
            </div>
            {!collapsed && (
              <button
                type="button"
                onClick={() => setCollapsed(true)}
                aria-label="Collapse sidebar"
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800/80 transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
            )}
          </div>

          {collapsed && (
            <div className="px-3 pt-3 flex justify-center">
              <button
                type="button"
                onClick={() => setCollapsed(false)}
                aria-label="Expand sidebar"
                className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800/80 transition-colors"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}

          <nav aria-label="Main navigation" className="flex-1 p-3 space-y-1">
            {NAV_ITEMS.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => onSelectTab(item.id)}
                  title={collapsed ? item.label : undefined}
                  aria-current={isActive ? 'page' : undefined}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors whitespace-nowrap ${
                    collapsed ? 'justify-center' : ''
                  } ${
                    isActive
                      ? theme.activeNavClass
                      : 'text-slate-400 hover:text-slate-100 hover:bg-slate-900 border border-transparent'
                  }`}
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  {!collapsed && <span>{item.label}</span>}
                </button>
              );
            })}
          </nav>

          <div className="p-3 border-t border-slate-800/80 space-y-2">
            <button
              type="button"
              onClick={onOpenProfile}
              className={`w-full flex items-center gap-2.5 p-2 rounded-xl hover:bg-slate-900 transition-colors text-left ${
                collapsed ? 'justify-center' : ''
              }`}
              aria-label="Edit student profile"
            >
              <AvatarIcon avatarId={profile.avatarId} size="sm" />
              {!collapsed && (
                <div className="min-w-0 flex-1">
                  <div className="text-xs font-semibold text-white truncate">{profile.preferredName}</div>
                  <div className="text-[11px] text-slate-400 truncate">
                    {profile.gradeLevel} · {profile.targetYear}
                  </div>
                </div>
              )}
            </button>

            {!collapsed && !cloudUser && onGoogleSignIn && !isOffline && (
              <button
                type="button"
                disabled={isAuthBusy}
                onClick={onGoogleSignIn}
                className="w-full flex items-center justify-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 text-[11px] font-semibold text-cyan-300 transition-colors"
              >
                <Cloud className="w-3.5 h-3.5" />
                <span>{isAuthBusy ? 'Connecting...' : 'Sign in with Google'}</span>
              </button>
            )}
            {!collapsed && cloudUser && (
              <div className="px-2.5 py-1 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-[11px] text-emerald-300 flex items-center gap-1.5 truncate">
                <Cloud className="w-3 h-3 shrink-0" />
                <span className="truncate">Synced · {cloudUser.email || cloudUser.displayName}</span>
              </div>
            )}
          </div>
        </aside>
      )}

      {/* Main Column */}
      <div className="flex-1 min-w-0 flex flex-col">
        {/* Clean Top Header */}
        <header className="sticky top-0 z-30 h-16 px-4 sm:px-5 border-b border-slate-800/80 bg-slate-950/85 backdrop-blur-md flex items-center justify-between gap-3">
          {/* Zone 1: Context title + Small Top Pencil Personalization Logo */}
          <div className="flex items-center gap-2 min-w-0 shrink-0">
            <span className={`md:hidden w-8 h-8 rounded-lg border flex items-center justify-center shrink-0 ${theme.badgeClass}`}>
              <GraduationCap className="w-4 h-4" />
            </span>
            <h1 className="font-display text-base sm:text-lg font-bold text-white whitespace-nowrap shrink-0">
              {activeItem.label}
            </h1>
            {onOpenPersonalization && (
              <button
                type="button"
                onClick={onOpenPersonalization}
                data-testid="topbar-personalize-btn"
                aria-label="Personalize study studio"
                title={`Personalize theme & studio (${personalization.studioTagline})`}
                className={`p-1.5 rounded-lg border transition-colors shrink-0 ${theme.softBgClass} ${theme.borderClass} ${theme.textClass} hover:brightness-110`}
              >
                <Pencil className="w-3.5 h-3.5" />
              </button>
            )}
            <span className="hidden 2xl:inline-block text-[11px] font-medium text-slate-400 truncate max-w-[160px]">
              {personalization.studioTagline}
            </span>
            {focusMode && (
              <span
                data-testid="focus-mode-active-label"
                className={`text-xs font-medium border-l border-slate-700 pl-3 whitespace-nowrap ${theme.textClass}`}
              >
                Focus Mode Active
              </span>
            )}
          </div>

          {/* Zone 2: Student Stats & Daily Streak (hidden in Global Focus Mode) */}
          {visibility.showTopStats && (
            <div
              data-testid="layout-top-stats"
              className="hidden lg:flex items-center gap-3 text-xs text-slate-300 tabular-nums whitespace-nowrap"
            >
              <div className="flex items-center gap-1">
                <Flame className="w-3.5 h-3.5 text-amber-400" />
                <span className="font-semibold text-white">{streak.currentStreak}d</span>
                <span className="text-slate-400 hidden xl:inline">Streak</span>
              </div>
              <span className="text-slate-700" aria-hidden="true">·</span>
              <div>
                <span className="text-slate-400">Acc </span>
                <span className="font-semibold text-emerald-400">{overallAccuracy}%</span>
              </div>
              <span className="text-slate-700" aria-hidden="true">·</span>
              <div>
                <span className="text-slate-400">Goal </span>
                <span className="font-semibold text-white">
                  {streak.questionsSolvedToday}/{profile.dailyQuestionGoal}
                </span>
              </div>
            </div>
          )}

          {/* Zone 3: Mode Toggles + Secondary Actions */}
          <div className="flex items-center gap-1.5 shrink-0">
            {visibility.showSecondaryHeaderActions && (
              <>
                <button
                  type="button"
                  onClick={onOpenProfile}
                  aria-label="Open student profile settings"
                  className="md:hidden flex items-center gap-1.5 p-1 rounded-lg bg-slate-900 border border-slate-800 text-xs text-slate-200"
                >
                  <AvatarIcon avatarId={profile.avatarId} size="sm" />
                </button>

                {notificationSlot}

                <PWAInstallButton />

                {onOpenGoogleDrive && (
                  <button
                    type="button"
                    onClick={onOpenGoogleDrive}
                    data-testid="topbar-drive-btn"
                    aria-label="Open Google Drive Study Sync"
                    className={`hidden sm:inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border font-semibold text-xs sm:text-sm transition-colors whitespace-nowrap shrink-0 ${
                      driveConnected
                        ? 'bg-emerald-500/15 border-emerald-500/35 text-emerald-300 hover:bg-emerald-500/25'
                        : 'bg-slate-900 hover:bg-slate-800 border-slate-700 text-slate-200'
                    }`}
                  >
                    <HardDrive className="w-3.5 h-3.5" />
                    <span>{driveConnected ? 'Drive Synced' : 'Drive'}</span>
                  </button>
                )}

                <button
                  type="button"
                  onClick={onOpenTutorDrawer}
                  data-testid="topbar-tutor-btn"
                  aria-label="Open quick AI Tutor assistant"
                  className="hidden sm:inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-cyan-300 font-semibold text-xs sm:text-sm transition-colors whitespace-nowrap shrink-0"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>AI Tutor</span>
                </button>
              </>
            )}

            {onToggleOfflineMode && (
              <button
                type="button"
                onClick={onToggleOfflineMode}
                data-testid="offline-mode-toggle"
                aria-pressed={isOffline}
                aria-label={isOffline ? 'Disable offline study mode' : 'Enable offline study mode'}
                title={
                  !browserOnline
                    ? 'Device offline — cached study library & local AI Tutor active'
                    : isOffline
                      ? 'Offline Study Mode active (click to go online)'
                      : 'Switch to Offline Study Mode'
                }
                className={`inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-2 rounded-xl border font-semibold text-xs sm:text-sm transition-colors whitespace-nowrap shrink-0 ${
                  isOffline
                    ? 'bg-amber-500/15 border-amber-500/40 text-amber-200 hover:bg-amber-500/25'
                    : 'bg-slate-900 hover:bg-slate-800 border-slate-700 text-slate-300'
                }`}
              >
                {isOffline ? (
                  <WifiOff className="w-3.5 h-3.5 text-amber-300" />
                ) : (
                  <Wifi className="w-3.5 h-3.5 text-emerald-400" />
                )}
                <span className="hidden lg:inline">
                  {!browserOnline ? 'No Network' : isOffline ? 'Offline' : 'Offline Mode'}
                </span>
              </button>
            )}

            {onToggleFocusMode && (
              <button
                type="button"
                onClick={onToggleFocusMode}
                data-testid="focus-mode-toggle"
                aria-pressed={focusMode}
                aria-label={focusMode ? 'Exit Focus Mode' : 'Enter Focus Mode'}
                title={focusMode ? 'Exit Focus Mode (Alt+F)' : 'Enter Focus Mode (Alt+F)'}
                className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border font-semibold text-xs sm:text-sm transition-colors whitespace-nowrap shrink-0 ${
                  focusMode
                    ? 'bg-cyan-500 text-slate-950 border-cyan-400 hover:bg-cyan-400'
                    : 'bg-slate-900 hover:bg-slate-800 border-slate-700 text-slate-200'
                }`}
              >
                {focusMode ? (
                  <>
                    <Minimize2 className="w-3.5 h-3.5" />
                    <span>Exit Focus</span>
                  </>
                ) : (
                  <>
                    <Focus className="w-3.5 h-3.5 text-cyan-400" />
                    <span className="hidden sm:inline">Focus Mode</span>
                  </>
                )}
              </button>
            )}

            {visibility.showSecondaryHeaderActions && (
              <button
                type="button"
                onClick={onOpenQuizModal}
                data-testid="topbar-mock-exam-btn"
                className={`inline-flex items-center gap-1.5 px-3 sm:px-3.5 py-2 rounded-xl font-semibold text-xs sm:text-sm transition-colors whitespace-nowrap shrink-0 ${theme.buttonClass}`}
              >
                <Play className="w-3.5 h-3.5 fill-current" />
                <span className="sm:hidden">Mock</span>
                <span className="hidden sm:inline">Start Mock Exam</span>
              </button>
            )}
          </div>
        </header>

        {/* Scrollable Content Viewport */}
        <main
          className={`flex-1 max-w-[1320px] w-full mx-auto ${
            isCompact ? 'p-3 sm:p-4 lg:p-5' : 'p-4 sm:p-6 lg:p-8'
          } ${
            visibility.showMobileNav ? 'pb-24 md:pb-10' : 'pb-10'
          }`}
        >
          {isOffline && (
            <div
              data-testid="offline-mode-banner"
              role="status"
              className="mb-5 px-4 py-2.5 rounded-xl bg-amber-500/12 border border-amber-500/35 text-amber-100 text-xs sm:text-sm flex flex-wrap items-center justify-between gap-3"
            >
              <div className="flex items-center gap-2 min-w-0">
                <WifiOff className="w-4 h-4 text-amber-300 shrink-0" />
                <span>
                  {!browserOnline
                    ? 'You are offline. Cached GES notes, video lessons, flashcards, practical labs, quizzes, and local AI study remain active.'
                    : 'Offline Study Mode active. Studying strictly from your cached library & local AI Tutor with cloud requests paused.'}
                </span>
              </div>
              {browserOnline && manualOfflineMode && onToggleOfflineMode && (
                <button
                  type="button"
                  onClick={onToggleOfflineMode}
                  data-testid="offline-banner-online-btn"
                  className="px-3 py-1 rounded-lg bg-amber-400 hover:bg-amber-300 text-slate-950 font-semibold text-xs transition-colors whitespace-nowrap"
                >
                  Go Online
                </button>
              )}
            </div>
          )}

          {children}
        </main>
      </div>

      {/* Mobile Bottom Navigation (hidden in Global Focus Mode) */}
      {visibility.showMobileNav && (
        <nav
          aria-label="Mobile navigation"
          data-testid="layout-mobile-nav"
          className="md:hidden fixed bottom-0 inset-x-0 z-30 h-16 bg-slate-950/95 backdrop-blur-md border-t border-slate-800 flex items-center overflow-x-auto px-1.5 gap-1"
        >
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => onSelectTab(item.id)}
                aria-label={item.label}
                aria-current={isActive ? 'page' : undefined}
                className={`min-w-[64px] shrink-0 h-12 rounded-lg flex flex-col items-center justify-center gap-1 text-[10px] font-medium transition-colors ${
                  isActive ? 'text-cyan-400 bg-cyan-500/10' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{item.shortLabel}</span>
              </button>
            );
          })}
        </nav>
      )}
    </div>
  );
};
