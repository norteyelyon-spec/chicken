import test from 'node:test';
import assert from 'node:assert/strict';
import { SYLLABUS_NOTES } from '../data/syllabusNotes';
import { createDefaultProfile } from './quizEngine';
import {
  buildTimetableCompletionKey,
  DEFAULT_TIMETABLE_SCHEDULE,
  getTodayDayId,
  getTodayLearningPlan,
  sanitizeTimetableSchedule,
  updateTimetableSlot,
} from './studyTimetable';

test('getTodayDayId maps calendar days to Monday-Sunday IDs accurately', () => {
  // 2026-01-19 is Monday, 2026-01-25 is Sunday
  assert.equal(getTodayDayId(new Date('2026-01-19T10:00:00')), 'monday');
  assert.equal(getTodayDayId(new Date('2026-01-21T10:00:00')), 'wednesday');
  assert.equal(getTodayDayId(new Date('2026-01-25T10:00:00')), 'sunday');
});

test('DEFAULT_TIMETABLE_SCHEDULE matches all 7 days and 3 study slots per day from weekly schedule', () => {
  const mondaySubjects = ['slot-1', 'slot-2', 'slot-3'].map(
    (s) => DEFAULT_TIMETABLE_SCHEDULE.grid.monday[s].subjectId
  );
  assert.deepEqual(mondaySubjects, ['physics', 'coremath', 'english']);

  const wednesdaySubjects = ['slot-1', 'slot-2', 'slot-3'].map(
    (s) => DEFAULT_TIMETABLE_SCHEDULE.grid.wednesday[s].subjectId
  );
  assert.deepEqual(wednesdaySubjects, ['biology', 'ict', 'addmaths']);

  const sundaySubjects = ['slot-1', 'slot-2', 'slot-3'].map(
    (s) => DEFAULT_TIMETABLE_SCHEDULE.grid.sunday[s].subjectId
  );
  assert.deepEqual(sundaySubjects, ['chemistry', 'english', 'socialstudies']);
});

test('getTodayLearningPlan selects grade-matched syllabus notes and tracks completed sessions', () => {
  const profile = { ...createDefaultProfile(), gradeLevel: 'SHS1' as const };
  const wednesday = new Date('2026-01-21T09:30:00');
  const completedKey = buildTimetableCompletionKey('2026-01-21', 'slot-1');

  const plan = getTodayLearningPlan(
    DEFAULT_TIMETABLE_SCHEDULE,
    SYLLABUS_NOTES,
    profile,
    wednesday,
    { [completedKey]: true }
  );

  assert.equal(plan.dayId, 'wednesday');
  assert.equal(plan.items.length, 3);
  assert.equal(plan.items[0].subjectId, 'biology');
  assert.equal(plan.items[0].isCompleted, true);
  assert.equal(plan.completedCount, 1);
  assert.ok(plan.items[0].recommendedNote, 'Should resolve a Biology SHS1 note');
  assert.equal(plan.items[0].recommendedNote?.grade, 'SHS1');
});

test('updateTimetableSlot updates a single cell and sanitizeTimetableSchedule handles malformed input', () => {
  const updated = updateTimetableSlot(DEFAULT_TIMETABLE_SCHEDULE, 'monday', 'slot-1', 'biology');
  assert.equal(updated.grid.monday['slot-1'].subjectId, 'biology');
  assert.equal(DEFAULT_TIMETABLE_SCHEDULE.grid.monday['slot-1'].subjectId, 'physics');

  const sanitized = sanitizeTimetableSchedule({ invalid: true });
  assert.equal(sanitized.grid.monday['slot-1'].subjectId, 'physics');
});
