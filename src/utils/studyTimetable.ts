import { SUBJECTS, SYLLABUS_TOPICS } from '../data/subjects.ts';
import type {
  GradeLevel,
  StudyNote,
  StudyTimetableGrid,
  StudyTimetableSchedule,
  StudyTimetableSlot,
  SubjectId,
  SyllabusTopic,
  TimetableDayId,
  UserProfile,
} from '../types/index.ts';
import { formatLocalDateKey } from './studyReminders.ts';

export interface TimetableDayMeta {
  id: TimetableDayId;
  label: string;
  shortLabel: string;
  jsDayIndex: number; // 0 = Sunday ... 6 = Saturday
}

export const TIMETABLE_DAYS: TimetableDayMeta[] = [
  { id: 'monday', label: 'Monday', shortLabel: 'Mon', jsDayIndex: 1 },
  { id: 'tuesday', label: 'Tuesday', shortLabel: 'Tue', jsDayIndex: 2 },
  { id: 'wednesday', label: 'Wednesday', shortLabel: 'Wed', jsDayIndex: 3 },
  { id: 'thursday', label: 'Thursday', shortLabel: 'Thu', jsDayIndex: 4 },
  { id: 'friday', label: 'Friday', shortLabel: 'Fri', jsDayIndex: 5 },
  { id: 'saturday', label: 'Saturday', shortLabel: 'Sat', jsDayIndex: 6 },
  { id: 'sunday', label: 'Sunday', shortLabel: 'Sun', jsDayIndex: 0 },
];

export const DEFAULT_TIMETABLE_SLOTS: StudyTimetableSlot[] = [
  { id: 'slot-1', label: '10:00 AM - 11:00 AM', startTime: '10:00', endTime: '11:00', kind: 'study' },
  { id: 'break-1', label: '11:00 AM - 1:00 PM', startTime: '11:00', endTime: '13:00', kind: 'break' },
  { id: 'slot-2', label: '2:00 PM - 3:00 PM', startTime: '14:00', endTime: '15:00', kind: 'study' },
  { id: 'break-2', label: '3:00 PM - 4:00 PM', startTime: '15:00', endTime: '16:00', kind: 'break' },
  { id: 'slot-3', label: '4:00 PM - 5:00 PM', startTime: '16:00', endTime: '17:00', kind: 'study' },
];

function buildDayRow(s1: SubjectId, s2: SubjectId, s3: SubjectId) {
  return {
    'slot-1': { kind: 'study' as const, subjectId: s1 },
    'break-1': { kind: 'break' as const, customLabel: 'BREAK' },
    'slot-2': { kind: 'study' as const, subjectId: s2 },
    'break-2': { kind: 'break' as const, customLabel: 'BREAK' },
    'slot-3': { kind: 'study' as const, subjectId: s3 },
  };
}

export const DEFAULT_TIMETABLE_GRID: StudyTimetableGrid = {
  monday: buildDayRow('physics', 'coremath', 'english'),
  tuesday: buildDayRow('chemistry', 'english', 'socialstudies'),
  wednesday: buildDayRow('biology', 'ict', 'addmaths'),
  thursday: buildDayRow('addmaths', 'socialstudies', 'physics'),
  friday: buildDayRow('coremath', 'biology', 'ict'),
  saturday: buildDayRow('physics', 'addmaths', 'coremath'),
  sunday: buildDayRow('chemistry', 'english', 'socialstudies'),
};

export const DEFAULT_TIMETABLE_SCHEDULE: StudyTimetableSchedule = {
  slots: DEFAULT_TIMETABLE_SLOTS,
  grid: DEFAULT_TIMETABLE_GRID,
  updatedAt: '2026-01-15T08:00:00.000Z',
};

export function getTodayDayId(date: Date = new Date()): TimetableDayId {
  const jsDay = date.getDay();
  return TIMETABLE_DAYS.find((d) => d.jsDayIndex === jsDay)?.id ?? 'monday';
}

export function buildTimetableCompletionKey(dateKey: string, slotId: string): string {
  return `${dateKey}::${slotId}`;
}

export function sanitizeTimetableSchedule(raw: unknown): StudyTimetableSchedule {
  if (!raw || typeof raw !== 'object') return DEFAULT_TIMETABLE_SCHEDULE;
  const candidate = raw as Partial<StudyTimetableSchedule>;
  const validGrid: StudyTimetableGrid = { ...DEFAULT_TIMETABLE_GRID };

  if (candidate.grid && typeof candidate.grid === 'object') {
    for (const day of TIMETABLE_DAYS) {
      const incomingRow = candidate.grid[day.id];
      if (!incomingRow || typeof incomingRow !== 'object') continue;
      validGrid[day.id] = { ...DEFAULT_TIMETABLE_GRID[day.id] };
      for (const slot of DEFAULT_TIMETABLE_SLOTS) {
        const cell = incomingRow[slot.id];
        if (!cell || typeof cell !== 'object') continue;
        if (slot.kind === 'study' && cell.subjectId && SUBJECTS[cell.subjectId]) {
          validGrid[day.id][slot.id] = {
            kind: 'study',
            subjectId: cell.subjectId,
          };
        }
      }
    }
  }

  return {
    slots: DEFAULT_TIMETABLE_SLOTS,
    grid: validGrid,
    updatedAt: typeof candidate.updatedAt === 'string' ? candidate.updatedAt : DEFAULT_TIMETABLE_SCHEDULE.updatedAt,
  };
}

export function updateTimetableSlot(
  schedule: StudyTimetableSchedule,
  dayId: TimetableDayId,
  slotId: string,
  subjectId: SubjectId
): StudyTimetableSchedule {
  const existingRow = schedule.grid[dayId] ?? DEFAULT_TIMETABLE_GRID[dayId];
  return {
    ...schedule,
    grid: {
      ...schedule.grid,
      [dayId]: {
        ...existingRow,
        [slotId]: {
          kind: 'study',
          subjectId,
        },
      },
    },
    updatedAt: new Date().toISOString(),
  };
}

export interface TodayTimetableBlock {
  slotId: string;
  slotLabel: string;
  startTime: string;
  endTime: string;
  subjectId: SubjectId;
  subjectName: string;
  completionKey: string;
  isCompleted: boolean;
  recommendedNote: StudyNote | null;
  syllabusTopic: SyllabusTopic | null;
}

export interface TodayLearningPlan {
  dayId: TimetableDayId;
  dayLabel: string;
  dateKey: string;
  items: TodayTimetableBlock[];
  completedCount: number;
  totalCount: number;
}

function pickRecommendedNoteForSubject(
  notes: StudyNote[],
  subjectId: SubjectId,
  grade: GradeLevel
): StudyNote | null {
  const gradeMatches = notes.filter((n) => n.subject === subjectId && n.grade === grade);
  if (gradeMatches.length > 0) return gradeMatches[0];
  const subjectMatches = notes.filter((n) => n.subject === subjectId);
  return subjectMatches[0] ?? null;
}

function pickRecommendedTopicForSubject(
  subjectId: SubjectId,
  grade: GradeLevel
): SyllabusTopic | null {
  const gradeMatches = SYLLABUS_TOPICS.filter((t) => t.subject === subjectId && t.grade === grade);
  if (gradeMatches.length > 0) return gradeMatches[0];
  return SYLLABUS_TOPICS.find((t) => t.subject === subjectId) ?? null;
}

export function getTodayLearningPlan(
  schedule: StudyTimetableSchedule,
  notes: StudyNote[],
  profile: UserProfile,
  date: Date = new Date(),
  completedKeys: Record<string, boolean> = {}
): TodayLearningPlan {
  const dayId = getTodayDayId(date);
  const dayMeta = TIMETABLE_DAYS.find((d) => d.id === dayId) ?? TIMETABLE_DAYS[0];
  const dateKey = formatLocalDateKey(date);
  const row = schedule.grid[dayId] ?? DEFAULT_TIMETABLE_GRID[dayId];

  const studySlots = schedule.slots.filter((s) => s.kind === 'study');
  const items: TodayTimetableBlock[] = [];

  for (const slot of studySlots) {
    const cell = row[slot.id];
    const subjectId: SubjectId =
      cell?.subjectId && SUBJECTS[cell.subjectId] ? cell.subjectId : 'physics';
    const completionKey = buildTimetableCompletionKey(dateKey, slot.id);
    items.push({
      slotId: slot.id,
      slotLabel: slot.label,
      startTime: slot.startTime,
      endTime: slot.endTime,
      subjectId,
      subjectName: SUBJECTS[subjectId].shortName,
      completionKey,
      isCompleted: Boolean(completedKeys[completionKey]),
      recommendedNote: pickRecommendedNoteForSubject(notes, subjectId, profile.gradeLevel),
      syllabusTopic: pickRecommendedTopicForSubject(subjectId, profile.gradeLevel),
    });
  }

  return {
    dayId,
    dayLabel: dayMeta.label,
    dateKey,
    items,
    completedCount: items.filter((i) => i.isCompleted).length,
    totalCount: items.length,
  };
}
