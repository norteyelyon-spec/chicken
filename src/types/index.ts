export type SubjectId =
  | 'physics'
  | 'chemistry'
  | 'biology'
  | 'addmaths'
  | 'ict'
  | 'coremath'
  | 'english'
  | 'integratedscience'
  | 'socialstudies';

export type SubjectCategory = 'elective' | 'core';

export type GradeLevel = 'SHS1' | 'SHS2' | 'SHS3';

export type GradeFilter = GradeLevel | 'ALL';

export type NavTab =
  | 'dashboard'
  | 'subjects'
  | 'exam'
  | 'competitions'
  | 'practicals'
  | 'notes'
  | 'videos'
  | 'timetable'
  | 'analytics'
  | 'tutor';

export type TestMode = 'exam' | 'study';

export type PaperType = 'mcq' | 'theory';

export interface UserProfile {
  fullName: string;
  preferredName: string;
  avatarId: string;
  gradeLevel: GradeLevel;
  targetYear: number;
  schoolName: string;
  subjects: SubjectId[];
  dailyQuestionGoal: number;
  createdAt: string;
}

export interface SyllabusKeyTerm {
  term: string;
  definition: string;
}

export interface SyllabusTopic {
  id: string;
  subject: SubjectId;
  grade: GradeLevel;
  unitNumber: string;
  title: string;
  summary: string;
  objectives: string[];
  keyFormulas: string[];
  keyTerms?: SyllabusKeyTerm[];
  estimatedMinutes: number;
}

export interface SubjectInfo {
  id: SubjectId;
  category: SubjectCategory;
  name: string;
  shortName: string;
  accentHex: string;
  textClass: string;
  bgSoftClass: string;
  borderClass: string;
  ringClass: string;
  progressClass: string;
  description: string;
  illustrationUrl: string;
  illustrationAlt: string;
}

export interface MCQQuestion {
  id: string;
  subject: SubjectId;
  grade: GradeLevel;
  topicId: string;
  topicTitle: string;
  yearTag: string;
  prompt: string;
  options: [string, string, string, string];
  correctIndex: 0 | 1 | 2 | 3;
  stepByStepWorkings: string;
  optionExplanations: [string, string, string, string];
}

export interface TheorySubPart {
  label: string; // e.g. "(a)", "(b)(i)", "(b)(ii)"
  prompt: string;
  marks: number;
  markingScheme: string;
  keyScoringPoints: string[];
}

export interface TheoryQuestion {
  id: string;
  subject: SubjectId;
  grade: GradeLevel;
  topicId: string;
  topicTitle: string;
  yearTag: string;
  title: string;
  contextPrompt: string;
  totalMarks: number;
  parts: TheorySubPart[];
}

export type SimulatorKind =
  | 'ohms-law'
  | 'projectile-3d'
  | 'pendulum-3d'
  | 'optics-3d'
  | 'micrometer-3d'
  | 'titration'
  | 'gas-laws'
  | 'wave-standing'
  | 'enzyme-rate'
  | 'logic-gate'
  | 'thomson-crt'
  | 'rutherford-scattering'
  | 'math-function-calc'
  | 'radioactive-decay'
  | 'osmosis-cell'
  | 'simple-machines'
  | 'kinematics-motion'
  | 'thermal-calorimetry'
  | 'bearings-trig'
  | 'electrostatics-field'
  | 'ac-transformer-3d'
  | 'genetics-punnett';

export interface PracticalReadingRow {
  id: string;
  parameter: string;
  unit: string;
  expectedValue: string;
  hint: string;
}

export interface PracticalQuestion {
  id: string;
  prompt: string;
  marks: number;
  explainedAnswer: string;
}

export interface PracticalExperiment {
  id: string;
  subject:
    | 'physics'
    | 'chemistry'
    | 'biology'
    | 'ict'
    | 'coremath'
    | 'addmaths'
    | 'integratedscience';
  grade: GradeLevel;
  title: string;
  aim: string;
  apparatus: string[];
  imageUrl: string;
  imageCaption: string;
  svgDiagramType: 'optics-micrometer' | 'titration-setup' | 'heart-leaf' | 'network-topology';
  simulatorKind?: SimulatorKind;
  is3D?: boolean;
  phetUrl?: string;
  phetTitle?: string;
  procedureSteps: string[];
  readingsTable: PracticalReadingRow[];
  questions: PracticalQuestion[];
  precautions: string[];
}

export interface QuizConfig {
  subject: SubjectId;
  gradeFilter: GradeFilter;
  topicIds: string[];
  mode: TestMode;
  paperType: PaperType;
  questionCount: number;
}

export interface MCQAnswerRecord {
  questionId: string;
  selectedIndex: number | null;
  correctIndex: number;
  isCorrect: boolean;
}

export interface TheoryPartSelfGrade {
  partLabel: string;
  responseText: string;
  awardedMarks: number;
  maxMarks: number;
}

export interface ExamAttempt {
  id: string;
  timestamp: string;
  subject: SubjectId;
  gradeFilter: GradeFilter;
  paperType: PaperType;
  mode: TestMode;
  topicTitles: string[];
  totalQuestions: number;
  score: number;
  maxScore: number;
  percentage: number;
  durationSeconds: number;
  mcqRecords?: MCQAnswerRecord[];
  theoryRecords?: {
    questionId: string;
    parts: TheoryPartSelfGrade[];
  }[];
}

export interface MistakeEntry {
  questionId: string;
  subject: SubjectId;
  grade: GradeLevel;
  topicId: string;
  wrongCount: number;
  lastMissedAt: string;
  lastSelectedIndex: number | null;
  mastered: boolean;
}

export interface StudyNote {
  id: string;
  title: string;
  subject: SubjectId;
  grade: GradeLevel;
  tags: string[];
  content: string;
  updatedAt: string;
  createdAt: string;
  topicId?: string;
  isBuiltIn?: boolean;
}

export interface StreakData {
  currentStreak: number;
  longestStreak: number;
  lastActiveDate: string; // YYYY-MM-DD
  questionsSolvedToday: number;
  totalStudyMinutes: number;
}

export interface StudyReminderSettings {
  enabled: boolean;
  reminderTime: string; // HH:mm (24h local time)
  browserNotificationsEnabled: boolean;
  lastNotifiedDate: string; // YYYY-MM-DD or ''
  snoozedUntilIso?: string | null;
}

export type StudyNotificationKind =
  | 'streak-reminder'
  | 'streak-at-risk'
  | 'goal-nudge'
  | 'daily-timetable'
  | 'milestone';

export type StudyNotificationCtaAction =
  | 'quiz'
  | 'flashcards'
  | 'mistakes'
  | 'notes'
  | 'videos'
  | 'timetable'
  | 'teach';

export interface StudyNotificationItem {
  id: string;
  kind: StudyNotificationKind;
  title: string;
  message: string;
  ctaLabel: string;
  ctaAction: StudyNotificationCtaAction;
  subjectId?: SubjectId;
  createdAtIso: string;
  dateKey: string; // YYYY-MM-DD
  read: boolean;
  urgency: 'info' | 'warning' | 'urgent';
}

export type TimetableDayId =
  | 'monday'
  | 'tuesday'
  | 'wednesday'
  | 'thursday'
  | 'friday'
  | 'saturday'
  | 'sunday';

export type TimetableSlotKind = 'study' | 'break';

export interface StudyTimetableSlot {
  id: string;
  label: string;
  startTime: string; // HH:mm
  endTime: string;   // HH:mm
  kind: TimetableSlotKind;
}

export interface StudyTimetableCell {
  kind: TimetableSlotKind;
  subjectId?: SubjectId;
  customLabel?: string;
}

export type StudyTimetableGrid = Record<TimetableDayId, Record<string, StudyTimetableCell>>;

export interface StudyTimetableSchedule {
  slots: StudyTimetableSlot[];
  grid: StudyTimetableGrid;
  updatedAt: string;
}

export interface AchievementBadge {
  id: string;
  title: string;
  description: string;
  unlocked: boolean;
  progressText: string;
}

export interface AppBackupPayload {
  version: number;
  exportedAt: string;
  profile: UserProfile;
  attempts: ExamAttempt[];
  mistakes: MistakeEntry[];
  notes: StudyNote[];
  streak: StreakData;
  reminderSettings?: StudyReminderSettings;
  timetable?: StudyTimetableSchedule;
  completedTimetableKeys?: Record<string, boolean>;
}

export interface TutorQuestionContext {
  id: string;
  paperType: PaperType;
  subject: SubjectId;
  grade: GradeLevel;
  topicId: string;
  topicTitle: string;
  prompt: string;
  options?: [string, string, string, string];
  selectedOptionIndex?: number | null;
  isSubmitted?: boolean;
  subPartsSummary?: string;
}

export interface TutorRecommendation {
  topicId: string;
  subject: SubjectId;
  grade: GradeLevel;
  unitNumber: string;
  title: string;
  reason: string;
  priority: 'high' | 'medium';
}

export interface TutorMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  createdAt: string;
  attachedQuestionTitle?: string;
  recommendations?: TutorRecommendation[];
  error?: boolean;
}

export interface TutorStudentContextPayload {
  preferredName: string;
  gradeLevel: GradeLevel;
  targetYear: number;
  schoolName: string;
  subjects: SubjectId[];
  overallAccuracy: number;
  totalQuestionsSolved: number;
  currentStreak: number;
  subjectMastery: {
    subject: SubjectId;
    averagePercentage: number;
    questionsSolved: number;
    byGrade: Record<GradeLevel, number>;
  }[];
  pendingMistakes: {
    questionId: string;
    subject: SubjectId;
    grade: GradeLevel;
    topicId: string;
    topicTitle: string;
    prompt: string;
    wrongCount: number;
  }[];
  recentNoteTitles: string[];
  recommendedTopics: TutorRecommendation[];
  activeQuestion?: TutorQuestionContext | null;
}

export type FlashcardRating = 'again' | 'hard' | 'good' | 'easy';

export type FlashcardCardKind = 'term' | 'objective' | 'formula' | 'overview';

export interface FlashcardItem {
  id: string;
  topicId: string;
  subject: SubjectId;
  grade: GradeLevel;
  unitNumber: string;
  topicTitle: string;
  kind: FlashcardCardKind;
  frontLabel: string;
  front: string;
  back: string;
  formulaHint?: string;
}

export interface FlashcardProgress {
  cardId: string;
  repetitions: number;
  intervalDays: number;
  easeFactor: number;
  nextReviewAt: string;
  lastRating?: FlashcardRating;
  lastReviewedAt?: string;
}

export type TutorPanelMode = 'chat' | 'teach' | 'voice';

export type TeachingStyle = 'socratic' | 'step-by-step' | 'exam-drill';

export type TeachingActionKind =
  | 'answer-mcq'
  | 'answer-open'
  | 'ask-question'
  | 'simpler-analogy'
  | 'hint'
  | 'worked-example';

export interface TeachingStep {
  stepNumber: number;
  stageTitle: string;
  explanation: string;
  keyEquation?: string;
  realWorldExample?: string;
  spokenScript: string;
  checkPrompt: string;
  checkOptions: [string, string, string, string];
  correctOptionIndex: 0 | 1 | 2 | 3;
  hint: string;
  explanationAfterCheck: string;
}

export interface TeachingLessonPlan {
  lessonId: string;
  subject: SubjectId;
  grade: GradeLevel;
  topicTitle: string;
  style: TeachingStyle;
  learningObjective: string;
  steps: TeachingStep[];
  wassceExamTrap: string;
}

export interface TeachingInteractionFeedback {
  verdict: 'correct' | 'partial' | 'needs-review' | 'clarification';
  feedback: string;
  misconceptionOrNote?: string;
  followUpPrompt: string;
  readyToAdvance: boolean;
  spokenFeedback: string;
}

export interface TeachingTurnEntry {
  id: string;
  stepNumber: number;
  actionKind: TeachingActionKind;
  studentInput: string;
  verdict: TeachingInteractionFeedback['verdict'];
  feedback: string;
  misconceptionOrNote?: string;
  followUpPrompt: string;
  spokenFeedback: string;
  createdAt: string;
}

export interface TeachingLaunchTarget {
  subject: SubjectId;
  grade: GradeLevel;
  topicTitle: string;
  topicSummary?: string;
  keyFormulas?: string[];
  sourceLabel?: string;
  autoStart?: boolean;
}

export type OrbCorner = 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
export type AccentTheme = 'cyan' | 'emerald' | 'amber' | 'violet';
export type LayoutDensity = 'comfortable' | 'compact';
export type TeacherPersonaId = 'kofi' | 'abena' | 'efua';

export interface PersonalizationPreferences {
  accentTheme: AccentTheme;
  density: LayoutDensity;
  studioTagline: string;
  teacherPersona: TeacherPersonaId;
  orbCorner: OrbCorner;
}

export interface AIOpponentProfile {
  id: string;
  name: string;
  tierLabel: string;
  accuracyRate: number;
  baseResponseMs: number;
  avatarColor: string;
  tagline: string;
}

export interface CompetitionMatchRecord {
  id: string;
  timestamp: string;
  subject: SubjectId;
  gradeFilter: GradeFilter;
  aiOpponentId: string;
  aiOpponentName: string;
  studentScore: number;
  aiScore: number;
  totalQuestions: number;
  correctCount: number;
  accuracyPct: number;
  durationSeconds: number;
  won: boolean;
}

