import React, { Suspense, lazy } from 'react';
import { AnimatePresence, MotionConfig, motion } from 'motion/react';
import { DashboardView } from './components/DashboardView';
import { Layout } from './components/Layout';
import { NotificationCenter } from './components/NotificationCenter';
import { StudyReminderBanner } from './components/StudyReminderBanner';
import { WorkingsOrbBoard } from './components/WorkingsOrbBoard';
import { AuthProvider, useAuth } from './context/AuthContext';
import { NavigationProvider, useNavigation } from './context/NavigationContext';
import { StudyProgressProvider, useStudyProgress } from './context/StudyProgressContext';
import { TutorProvider, useTutor } from './context/TutorContext';
import type { GradeLevel, SubjectId, TimetableDayId } from './types';

const AnalyticsView = lazy(() =>
  import('./components/AnalyticsView').then((m) => ({ default: m.AnalyticsView }))
);
const CompetitionsArenaView = lazy(() =>
  import('./components/CompetitionsArenaView').then((m) => ({ default: m.CompetitionsArenaView }))
);
const ExamEngine = lazy(() =>
  import('./components/ExamEngine').then((m) => ({ default: m.ExamEngine }))
);
const GoogleDriveModal = lazy(() =>
  import('./components/GoogleDriveModal').then((m) => ({ default: m.GoogleDriveModal }))
);
const NotesHubView = lazy(() =>
  import('./components/NotesHubView').then((m) => ({ default: m.NotesHubView }))
);
const PersonalizationModal = lazy(() =>
  import('./components/PersonalizationModal').then((m) => ({ default: m.PersonalizationModal }))
);
const PracticalLabView = lazy(() =>
  import('./components/PracticalLabView').then((m) => ({ default: m.PracticalLabView }))
);
const ProfileModal = lazy(() =>
  import('./components/ProfileModal').then((m) => ({ default: m.ProfileModal }))
);
const QuizConfigModal = lazy(() =>
  import('./components/QuizConfigModal').then((m) => ({ default: m.QuizConfigModal }))
);
const StudyTimetableView = lazy(() =>
  import('./components/StudyTimetableView').then((m) => ({ default: m.StudyTimetableView }))
);
const SubjectsHub = lazy(() =>
  import('./components/SubjectsHub').then((m) => ({ default: m.SubjectsHub }))
);
const TutorChatPanel = lazy(() =>
  import('./components/TutorChatPanel').then((m) => ({ default: m.TutorChatPanel }))
);
const VideoLessonsHub = lazy(() =>
  import('./components/VideoLessonsHub').then((m) => ({ default: m.VideoLessonsHub }))
);

const ViewLoadingFallback: React.FC<{ label?: string }> = ({ label = 'Loading module...' }) => (
  <div className="min-h-[320px] rounded-2xl border border-slate-800/80 bg-slate-900/40 flex flex-col items-center justify-center gap-3 text-slate-400">
    <span className="h-6 w-6 rounded-full border-2 border-cyan-400/30 border-t-cyan-400 animate-spin" />
    <span className="text-xs font-medium tracking-wide">{label}</span>
  </div>
);

const AppWorkspace: React.FC = () => {
  const {
    activeTab,
    setActiveTab,
    selectedSubject,
    setSelectedSubject,
    selectedNoteIdForView,
    setSelectedNoteIdForView,
    focusMode,
    toggleFocusMode,
    focusVisibility,
    manualOfflineMode,
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
    openDriveModal,
    isTutorDrawerOpen,
    setIsTutorDrawerOpen,
  } = useNavigation();

  const {
    firebaseUser,
    isAuthBusy,
    driveConnected,
    setDriveConnected,
    handleGoogleSignIn,
    handleGoogleSignOut,
  } = useAuth();

  const {
    profile,
    effectiveProfile,
    saveProfile,
    attempts,
    mistakes,
    mergedNotes,
    streak,
    flashcardProgress,
    reminderSettings,
    notifications,
    activeReminderBanner,
    timetable,
    completedTimetableKeys,
    completedVideoIds,
    noteDrillMastery,
    personalization,
    competitionMatches,
    overallAnalytics,
    masteryStats,
    achievements,
    todayLearningPlan,
    todayScheduleSummary,
    activeQuizConfig,
    activeMCQSession,
    activeTheorySession,
    handleUpdateReminderSettings,
    handleRequestBrowserNotifications,
    handlePreviewReminder,
    handleSendTodayTimetableAlert,
    handleMarkNotificationRead,
    handleMarkAllNotificationsRead,
    handleSnoozeReminder,
    handleStartExam,
    handleCompleteMCQ,
    handleCompleteTheory,
    handleCompleteNoteDrill,
    handleCreateNoteForTopic,
    handleSaveLessonAsNote,
    handleCreatePersonalNote,
    handleUpdateAnyNote,
    handleDeletePersonalNote,
    handleImportNoteFromDrive,
    handlePracticeMistakes,
    handleToggleMistakeMastered,
    handleUpdateTimetableSlot,
    handleResetSchedule,
    handleToggleTimetableBlock,
    handleToggleVideoCompleted,
    handleRateFlashcard,
    handleResetFlashcardDeck,
    updatePersonalization,
    handleLogSimulationRun,
    handleFinishCompetitionMatch,
    buildBackupJson,
    restoreBackupFromJsonText,
    handleExportBackup,
    handleImportBackup,
    handleResetProgress,
  } = useStudyProgress();

  const {
    tutorMessages,
    clearTutorMessages,
    tutorPanelMode,
    setTutorPanelMode,
    teachingLaunchTarget,
    setTeachingLaunchTarget,
    isTutorStreaming,
    tutorErrorBanner,
    activeTutorQuestion,
    setActiveTutorQuestion,
    tutorStudentContext,
    handleSendTutorMessage,
    handleStopTutorStreaming,
    handleAskQuestionHint,
    handleAskTutorAboutTopic,
    handleLaunchAITeacher,
    handleTeachTopic,
    handleAskTutorAboutFlashcard,
    handleAskTutorAboutMistake,
    handleAskTutorPrompt,
    handleActionNotification,
  } = useTutor();

  return (
    <MotionConfig reducedMotion="user">
      <Layout
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        profile={effectiveProfile}
        streak={streak}
        overallAccuracy={overallAnalytics.overallAccuracy}
        cloudUser={
          firebaseUser
            ? { email: firebaseUser.email, displayName: firebaseUser.displayName }
            : null
        }
        isAuthBusy={isAuthBusy}
        onGoogleSignIn={() => void handleGoogleSignIn()}
        onOpenProfile={() => setIsProfileModalOpen(true)}
        onOpenQuizModal={() => openQuizConfig(selectedSubject, 'ALL', [])}
        onOpenTutorDrawer={() => setIsTutorDrawerOpen(true)}
        driveConnected={driveConnected}
        onOpenGoogleDrive={() => openDriveModal(null)}
        focusMode={focusMode}
        onToggleFocusMode={toggleFocusMode}
        isOffline={effectiveOffline}
        manualOfflineMode={manualOfflineMode}
        browserOnline={browserOnline}
        onToggleOfflineMode={toggleOfflineMode}
        personalization={personalization}
        onOpenPersonalization={() => setIsPersonalizationOpen(true)}
        notificationSlot={
          <NotificationCenter
            profile={effectiveProfile}
            streak={streak}
            settings={reminderSettings}
            notifications={notifications}
            todayScheduleSummary={todayScheduleSummary}
            onOpenTimetable={() => setActiveTab('timetable')}
            onUpdateSettings={handleUpdateReminderSettings}
            onRequestBrowserPermission={handleRequestBrowserNotifications}
            onPreviewReminder={handlePreviewReminder}
            onActionNotification={handleActionNotification}
            onMarkRead={handleMarkNotificationRead}
            onMarkAllRead={handleMarkAllNotificationsRead}
            onSnooze={handleSnoozeReminder}
          />
        }
      >
        {focusVisibility.showReminderBanner && activeReminderBanner && !activeReminderBanner.read && (
          <StudyReminderBanner
            notification={activeReminderBanner}
            onAction={handleActionNotification}
            onSnooze={handleSnoozeReminder}
            onDismiss={handleMarkNotificationRead}
          />
        )}

        {bannerMessage && (
          <div
            role="status"
            className="mb-5 px-4 py-3 rounded-xl bg-cyan-500/12 border border-cyan-500/30 text-cyan-200 text-xs sm:text-sm flex items-center justify-between gap-4"
          >
            <span>{bannerMessage}</span>
            <button
              type="button"
              onClick={() => setBannerMessage(null)}
              className="text-xs text-cyan-400 hover:text-cyan-200 font-semibold"
            >
              Dismiss
            </button>
          </div>
        )}

        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.16, ease: [0.16, 1, 0.3, 1] }}
          >
            {activeTab === 'dashboard' && (
              <DashboardView
                profile={effectiveProfile}
                streak={streak}
                attempts={attempts}
                mistakes={mistakes}
                masteryStats={masteryStats}
                overallAccuracy={overallAnalytics.overallAccuracy}
                totalQuestionsSolved={overallAnalytics.totalQuestionsSolved}
                todayPlan={todayLearningPlan}
                focusMode={focusMode}
                onToggleTimetableBlock={handleToggleTimetableBlock}
                onWatchVideoNote={(noteId) => {
                  setSelectedNoteIdForView(noteId);
                  setActiveTab('videos');
                }}
                onLaunchAITeacher={(target) => handleLaunchAITeacher(target, false)}
                onNavigate={setActiveTab}
                onOpenSubject={(sub) => {
                  setSelectedSubject(sub);
                  setActiveTab('subjects');
                }}
                onStartQuickQuiz={(sub) => openQuizConfig(sub, effectiveProfile.gradeLevel, [])}
                onReviewMistakes={() => setActiveTab('analytics')}
                onEditProfile={() => setIsProfileModalOpen(true)}
              />
            )}

            {activeTab !== 'dashboard' && (
              <Suspense fallback={<ViewLoadingFallback />}>
                {activeTab === 'subjects' && (
                  <SubjectsHub
                    selectedSubject={selectedSubject}
                    onSelectSubject={setSelectedSubject}
                    onPracticeTopic={(sub: SubjectId, grade: GradeLevel, topicId: string) =>
                      openQuizConfig(sub, grade, [topicId])
                    }
                    onCreateNoteForTopic={handleCreateNoteForTopic}
                    onAskTutorAboutTopic={handleAskTutorAboutTopic}
                    onTeachTopic={handleTeachTopic}
                    flashcardProgress={flashcardProgress}
                    onRateFlashcard={handleRateFlashcard}
                    onResetFlashcardDeck={handleResetFlashcardDeck}
                    onAskTutorAboutFlashcard={handleAskTutorAboutFlashcard}
                  />
                )}

                {activeTab === 'exam' && (
                  <ExamEngine
                    config={activeQuizConfig}
                    mcqSession={activeMCQSession}
                    theorySession={activeTheorySession}
                    onOpenConfig={() => openQuizConfig(selectedSubject, 'ALL', [])}
                    onCompleteMCQ={handleCompleteMCQ}
                    onCompleteTheory={handleCompleteTheory}
                    onAskQuestionHint={handleAskQuestionHint}
                  />
                )}

                {activeTab === 'competitions' && (
                  <CompetitionsArenaView
                    defaultSubject={selectedSubject}
                    defaultGrade={effectiveProfile.gradeLevel}
                    matchHistory={competitionMatches}
                    onFinishMatch={handleFinishCompetitionMatch}
                    onAskTutorAboutQuestion={handleAskTutorPrompt}
                  />
                )}

                {activeTab === 'practicals' && (
                  <PracticalLabView onLogSimulationRun={handleLogSimulationRun} />
                )}

                {activeTab === 'notes' && (
                  <NotesHubView
                    notes={mergedNotes}
                    selectedNoteId={selectedNoteIdForView}
                    noteDrillMastery={noteDrillMastery}
                    onCreateNote={handleCreatePersonalNote}
                    onUpdateNote={handleUpdateAnyNote}
                    onDeleteNote={handleDeletePersonalNote}
                    onAskTutorAboutNote={handleAskTutorPrompt}
                    onLaunchAITeacher={(target) => handleLaunchAITeacher(target, false)}
                    onOpenGoogleDrive={(note) => openDriveModal(note)}
                    onCompleteNoteDrill={(note, summary) => void handleCompleteNoteDrill(note, summary)}
                  />
                )}

                {activeTab === 'videos' && (
                  <VideoLessonsHub
                    notes={mergedNotes}
                    selectedNoteId={selectedNoteIdForView}
                    defaultGrade={effectiveProfile.gradeLevel}
                    completedVideoIds={completedVideoIds}
                    noteDrillMastery={noteDrillMastery}
                    teacherPersona={personalization.teacherPersona}
                    onChangeTeacherPersona={(persona) =>
                      updatePersonalization({ ...personalization, teacherPersona: persona })
                    }
                    onLogSimulationRun={(kind, subject) =>
                      handleLogSimulationRun(`video-sim:${kind}`, subject)
                    }
                    onToggleVideoCompleted={handleToggleVideoCompleted}
                    onAppendToNote={(noteId, snippet) => {
                      const target = mergedNotes.find((n) => n.id === noteId);
                      if (!target) return;
                      handleUpdateAnyNote({
                        ...target,
                        content: `${target.content}${snippet}`,
                        updatedAt: new Date().toISOString(),
                      });
                    }}
                    onOpenInNotes={(noteId) => {
                      setSelectedNoteIdForView(noteId);
                      setActiveTab('notes');
                    }}
                    onAskTutor={handleAskTutorPrompt}
                    onLaunchAITeacher={(target) => handleLaunchAITeacher(target, false)}
                    onCompleteNoteDrill={(note, summary) => void handleCompleteNoteDrill(note, summary)}
                  />
                )}

                {activeTab === 'timetable' && (
                  <StudyTimetableView
                    schedule={timetable}
                    notes={mergedNotes}
                    profile={effectiveProfile}
                    completedKeys={completedTimetableKeys}
                    onUpdateSlot={(dayId: TimetableDayId, slotId: string, subjectId: SubjectId) =>
                      handleUpdateTimetableSlot(dayId, slotId, subjectId)
                    }
                    onToggleBlockCompleted={handleToggleTimetableBlock}
                    onResetSchedule={handleResetSchedule}
                    onWatchVideoNote={(noteId) => {
                      setSelectedNoteIdForView(noteId);
                      setActiveTab('videos');
                    }}
                    onReadNote={(noteId) => {
                      setSelectedNoteIdForView(noteId);
                      setActiveTab('notes');
                    }}
                    onPracticeSubject={(sub) => openQuizConfig(sub, effectiveProfile.gradeLevel, [])}
                    onLaunchAITeacher={(target) => handleLaunchAITeacher(target, false)}
                    onSendTodayAlert={handleSendTodayTimetableAlert}
                    onOpenGoogleDrive={() => openDriveModal(null)}
                  />
                )}

                {activeTab === 'analytics' && (
                  <AnalyticsView
                    attempts={attempts}
                    mistakes={mistakes}
                    masteryStats={masteryStats}
                    achievements={achievements}
                    streak={streak}
                    overallAccuracy={overallAnalytics.overallAccuracy}
                    totalQuestionsSolved={overallAnalytics.totalQuestionsSolved}
                    totalStudyMinutes={overallAnalytics.totalStudyMinutes}
                    onToggleMistakeMastered={handleToggleMistakeMastered}
                    onPracticeMistakes={(sub) => void handlePracticeMistakes(sub)}
                    onAskTutorAboutMistake={handleAskTutorAboutMistake}
                    onExportBackup={handleExportBackup}
                    onResetProgress={handleResetProgress}
                  />
                )}

                {activeTab === 'tutor' && (
                  <TutorChatPanel
                    variant="full"
                    messages={tutorMessages}
                    isStreaming={isTutorStreaming}
                    errorBanner={tutorErrorBanner}
                    studentContext={tutorStudentContext}
                    activeQuestion={activeTutorQuestion}
                    mode={tutorPanelMode}
                    onChangeMode={setTutorPanelMode}
                    teachingLaunchTarget={teachingLaunchTarget}
                    onConsumeTeachingLaunchTarget={() => setTeachingLaunchTarget(null)}
                    onSaveLessonAsNote={handleSaveLessonAsNote}
                    onSendMessage={(text) => void handleSendTutorMessage(text)}
                    onStopStreaming={handleStopTutorStreaming}
                    onClearChat={clearTutorMessages}
                    onClearActiveQuestion={() => setActiveTutorQuestion(null)}
                    onPracticeTopic={(sub, grade, topicId) => openQuizConfig(sub, grade, [topicId])}
                    onOpenTopicInHub={(sub) => {
                      setSelectedSubject(sub);
                      setActiveTab('subjects');
                    }}
                    onCreateNoteForTopic={handleCreateNoteForTopic}
                  />
                )}
              </Suspense>
            )}
          </motion.div>
        </AnimatePresence>

        {/* Lazy-loaded Modals (zero parse/bundle overhead until opened) */}
        <Suspense fallback={null}>
          {isProfileModalOpen && (
            <ProfileModal
              isOpen={isProfileModalOpen}
              isFirstSetup={!profile}
              profile={profile}
              cloudUser={
                firebaseUser
                  ? {
                      uid: firebaseUser.uid,
                      email: firebaseUser.email,
                      displayName: firebaseUser.displayName,
                    }
                  : null
              }
              isAuthBusy={isAuthBusy}
              onGoogleSignIn={() => void handleGoogleSignIn()}
              onGoogleSignOut={() => void handleGoogleSignOut()}
              onOpenGoogleDrive={() => {
                setIsProfileModalOpen(false);
                openDriveModal(null);
              }}
              onSave={saveProfile}
              onClose={() => setIsProfileModalOpen(false)}
              onExportBackup={handleExportBackup}
              onImportBackup={handleImportBackup}
            />
          )}

          {isQuizModalOpen && (
            <QuizConfigModal
              isOpen={isQuizModalOpen}
              initialSubject={quizInitialSubject}
              initialGrade={quizInitialGrade}
              initialTopicIds={quizInitialTopics}
              onClose={() => setIsQuizModalOpen(false)}
              onStartExam={(config) => void handleStartExam(config)}
            />
          )}

          {isDriveModalOpen && (
            <GoogleDriveModal
              isOpen={isDriveModalOpen}
              onClose={() => setIsDriveModalOpen(false)}
              activeNote={
                driveTargetNote ??
                mergedNotes.find((n) => n.id === selectedNoteIdForView) ??
                mergedNotes[0] ??
                null
              }
              profile={effectiveProfile}
              timetable={timetable}
              buildBackupJson={buildBackupJson}
              onImportNote={handleImportNoteFromDrive}
              onImportBackupJson={restoreBackupFromJsonText}
              onDriveAuthChange={setDriveConnected}
            />
          )}

          {isPersonalizationOpen && (
            <PersonalizationModal
              isOpen={isPersonalizationOpen}
              preferences={personalization}
              onSave={(next) => {
                updatePersonalization(next);
                setIsPersonalizationOpen(false);
                setBannerMessage(`Studio personalized (${next.accentTheme} theme).`);
              }}
              onClose={() => setIsPersonalizationOpen(false)}
            />
          )}
        </Suspense>

        {/* Contextual AI Study Tutor Slide-Over Drawer */}
        <AnimatePresence>
          {isTutorDrawerOpen && (
            <div
              className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-xs"
              role="dialog"
              aria-modal="true"
              aria-label="AI Study Tutor Drawer"
            >
              <div
                className="flex-1"
                onClick={() => setIsTutorDrawerOpen(false)}
                aria-hidden="true"
              />
              <motion.div
                initial={{ x: '100%' }}
                animate={{ x: 0 }}
                exit={{ x: '100%' }}
                transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
                className="w-full sm:w-[460px] lg:w-[500px] h-full shadow-2xl"
              >
                <Suspense fallback={<ViewLoadingFallback label="Loading AI Tutor..." />}>
                  <TutorChatPanel
                    variant="drawer"
                    messages={tutorMessages}
                    isStreaming={isTutorStreaming}
                    errorBanner={tutorErrorBanner}
                    studentContext={tutorStudentContext}
                    activeQuestion={activeTutorQuestion}
                    mode={tutorPanelMode}
                    onChangeMode={setTutorPanelMode}
                    teachingLaunchTarget={teachingLaunchTarget}
                    onConsumeTeachingLaunchTarget={() => setTeachingLaunchTarget(null)}
                    onSaveLessonAsNote={handleSaveLessonAsNote}
                    onSendMessage={(text) => void handleSendTutorMessage(text)}
                    onStopStreaming={handleStopTutorStreaming}
                    onClearChat={clearTutorMessages}
                    onClearActiveQuestion={() => setActiveTutorQuestion(null)}
                    onPracticeTopic={(sub, grade, topicId) => openQuizConfig(sub, grade, [topicId])}
                    onOpenTopicInHub={(sub) => {
                      setIsTutorDrawerOpen(false);
                      setSelectedSubject(sub);
                      setActiveTab('subjects');
                    }}
                    onCreateNoteForTopic={handleCreateNoteForTopic}
                    onCloseDrawer={() => setIsTutorDrawerOpen(false)}
                    onExpandToFull={() => {
                      setIsTutorDrawerOpen(false);
                      setActiveTab('tutor');
                    }}
                  />
                </Suspense>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {/* Floating Neon Blue Robotic Workings Orb & Expandable Board */}
        {focusVisibility.showFloatingOrb && (
          <WorkingsOrbBoard
            orbCorner={personalization.orbCorner}
            onChangeOrbCorner={(corner) =>
              updatePersonalization({ ...personalization, orbCorner: corner })
            }
          />
        )}
      </Layout>
    </MotionConfig>
  );
};

export default function App() {
  return (
    <NavigationProvider>
      <AuthProvider>
        <StudyProgressProvider>
          <TutorProvider>
            <AppWorkspace />
          </TutorProvider>
        </StudyProgressProvider>
      </AuthProvider>
    </NavigationProvider>
  );
}
