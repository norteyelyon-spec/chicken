import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { useOnlineStatus } from '../hooks/usePWA';
import type { GradeFilter, NavTab, StudyNote, SubjectId } from '../types';
import {
  FOCUS_MODE_STORAGE_KEY,
  getFocusModeVisibility,
  isEffectiveOfflineMode,
  OFFLINE_MODE_STORAGE_KEY,
  type FocusModeVisibility,
} from '../utils/studyModes';

const PROFILE_STORAGE_KEY = 'wassce_masterclass_profile_v1';

function readBoolStorage(key: string, fallback: boolean): boolean {
  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as boolean;
  } catch {
    return fallback;
  }
}

interface NavigationContextValue {
  isAutostart: boolean;
  activeTab: NavTab;
  setActiveTab: React.Dispatch<React.SetStateAction<NavTab>>;
  selectedSubject: SubjectId;
  setSelectedSubject: React.Dispatch<React.SetStateAction<SubjectId>>;
  selectedNoteIdForView: string | null;
  setSelectedNoteIdForView: React.Dispatch<React.SetStateAction<string | null>>;
  focusMode: boolean;
  setFocusMode: React.Dispatch<React.SetStateAction<boolean>>;
  toggleFocusMode: () => void;
  focusVisibility: FocusModeVisibility;
  manualOfflineMode: boolean;
  setManualOfflineMode: React.Dispatch<React.SetStateAction<boolean>>;
  toggleOfflineMode: () => void;
  browserOnline: boolean;
  effectiveOffline: boolean;
  bannerMessage: string | null;
  setBannerMessage: React.Dispatch<React.SetStateAction<string | null>>;
  isProfileModalOpen: boolean;
  setIsProfileModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  isQuizModalOpen: boolean;
  setIsQuizModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  quizInitialSubject: SubjectId;
  quizInitialGrade: GradeFilter;
  quizInitialTopics: string[];
  openQuizConfig: (subject?: SubjectId, grade?: GradeFilter, topicIds?: string[]) => void;
  isPersonalizationOpen: boolean;
  setIsPersonalizationOpen: React.Dispatch<React.SetStateAction<boolean>>;
  isDriveModalOpen: boolean;
  setIsDriveModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  driveTargetNote: StudyNote | null;
  setDriveTargetNote: React.Dispatch<React.SetStateAction<StudyNote | null>>;
  openDriveModal: (note?: StudyNote | null) => void;
  isTutorDrawerOpen: boolean;
  setIsTutorDrawerOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const NavigationContext = createContext<NavigationContextValue | null>(null);

export const NavigationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const isAutostart = useMemo(() => {
    if (typeof window === 'undefined') return false;
    return new URLSearchParams(window.location.search).get('autostart') === '1';
  }, []);

  const [activeTab, setActiveTab] = useState<NavTab>('dashboard');
  const [selectedSubject, setSelectedSubject] = useState<SubjectId>('physics');
  const [selectedNoteIdForView, setSelectedNoteIdForView] = useState<string | null>(null);

  const [focusMode, setFocusMode] = useState<boolean>(() =>
    readBoolStorage(FOCUS_MODE_STORAGE_KEY, false)
  );
  const [manualOfflineMode, setManualOfflineMode] = useState<boolean>(() =>
    readBoolStorage(OFFLINE_MODE_STORAGE_KEY, false)
  );
  const browserOnline = useOnlineStatus();
  const effectiveOffline = isEffectiveOfflineMode({ browserOnline, manualOfflineMode });
  const focusVisibility = getFocusModeVisibility(focusMode);

  const [bannerMessage, setBannerMessage] = useState<string | null>(null);

  const [isProfileModalOpen, setIsProfileModalOpen] = useState<boolean>(() => {
    if (isAutostart) return false;
    try {
      return !window.localStorage.getItem(PROFILE_STORAGE_KEY);
    } catch {
      return true;
    }
  });

  const [isQuizModalOpen, setIsQuizModalOpen] = useState(false);
  const [quizInitialSubject, setQuizInitialSubject] = useState<SubjectId>('physics');
  const [quizInitialGrade, setQuizInitialGrade] = useState<GradeFilter>('ALL');
  const [quizInitialTopics, setQuizInitialTopics] = useState<string[]>([]);

  const [isPersonalizationOpen, setIsPersonalizationOpen] = useState(false);
  const [isDriveModalOpen, setIsDriveModalOpen] = useState(false);
  const [driveTargetNote, setDriveTargetNote] = useState<StudyNote | null>(null);
  const [isTutorDrawerOpen, setIsTutorDrawerOpen] = useState(false);

  useEffect(() => {
    window.localStorage.setItem(FOCUS_MODE_STORAGE_KEY, JSON.stringify(focusMode));
  }, [focusMode]);

  useEffect(() => {
    window.localStorage.setItem(OFFLINE_MODE_STORAGE_KEY, JSON.stringify(manualOfflineMode));
  }, [manualOfflineMode]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.altKey && !e.ctrlKey && !e.metaKey && e.key.toLowerCase() === 'f') {
        e.preventDefault();
        setFocusMode((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  useEffect(() => {
    if (!bannerMessage) return;
    const t = window.setTimeout(() => setBannerMessage(null), 4000);
    return () => window.clearTimeout(t);
  }, [bannerMessage]);

  const toggleFocusMode = useCallback(() => {
    setFocusMode((prev) => !prev);
  }, []);

  const toggleOfflineMode = useCallback(() => {
    setManualOfflineMode((prev) => !prev);
  }, []);

  const openQuizConfig = useCallback(
    (subject: SubjectId = selectedSubject, grade: GradeFilter = 'ALL', topicIds: string[] = []) => {
      setQuizInitialSubject(subject);
      setQuizInitialGrade(grade);
      setQuizInitialTopics(topicIds);
      setIsQuizModalOpen(true);
    },
    [selectedSubject]
  );

  const openDriveModal = useCallback((note: StudyNote | null = null) => {
    setDriveTargetNote(note);
    setIsDriveModalOpen(true);
  }, []);

  const value: NavigationContextValue = {
    isAutostart,
    activeTab,
    setActiveTab,
    selectedSubject,
    setSelectedSubject,
    selectedNoteIdForView,
    setSelectedNoteIdForView,
    focusMode,
    setFocusMode,
    toggleFocusMode,
    focusVisibility,
    manualOfflineMode,
    setManualOfflineMode,
    toggleOfflineMode,
    browserOnline,
    effectiveOffline,
    bannerMessage,
    setBannerMessage,
    isProfileModalOpen,
    setIsProfileModalOpen,
    isQuizModalOpen,
    setIsQuizModalOpen,
    quizInitialSubject,
    quizInitialGrade,
    quizInitialTopics,
    openQuizConfig,
    isPersonalizationOpen,
    setIsPersonalizationOpen,
    isDriveModalOpen,
    setIsDriveModalOpen,
    driveTargetNote,
    setDriveTargetNote,
    openDriveModal,
    isTutorDrawerOpen,
    setIsTutorDrawerOpen,
  };

  return <NavigationContext.Provider value={value}>{children}</NavigationContext.Provider>;
};

export function useNavigation(): NavigationContextValue {
  const ctx = useContext(NavigationContext);
  if (!ctx) throw new Error('useNavigation must be used inside NavigationProvider');
  return ctx;
}
