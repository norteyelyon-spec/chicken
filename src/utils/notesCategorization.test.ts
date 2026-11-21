import test from 'node:test';
import assert from 'node:assert/strict';
import { SUBJECT_LIST } from '../data/subjects.ts';
import { SYLLABUS_NOTES } from '../data/syllabusNotes/index.ts';
import {
  computeGradeCounts,
  filterNotesByCriteria,
  groupNotesByGrade,
} from './notesCategorization.ts';

test('groupNotesByGrade categorizes every GES subject across SHS1, SHS2, and SHS3', () => {
  const groups = groupNotesByGrade(SYLLABUS_NOTES);
  assert.equal(groups.length, 3);
  assert.deepEqual(
    groups.map((g) => g.grade),
    ['SHS1', 'SHS2', 'SHS3']
  );

  for (const subject of SUBJECT_LIST) {
    for (const group of groups) {
      const hasSubject = group.notes.some((n) => n.subject === subject.id);
      assert.ok(hasSubject, `Missing ${subject.id} notes in grade group ${group.grade}`);
    }
  }
});

test('computeGradeCounts and filterNotesByCriteria scope cleanly by grade and category', () => {
  const counts = computeGradeCounts(SYLLABUS_NOTES, 'elective', 'ALL');
  assert.ok(counts.SHS1 >= 15);
  assert.ok(counts.SHS2 >= 15);
  assert.ok(counts.SHS3 >= 15);
  assert.equal(counts.ALL, counts.SHS1 + counts.SHS2 + counts.SHS3);

  const shs2Core = filterNotesByCriteria(SYLLABUS_NOTES, {
    gradeFilter: 'SHS2',
    categoryFilter: 'core',
    subjectFilter: 'ALL',
    search: '',
  });
  assert.ok(shs2Core.length >= 12);
  assert.ok(shs2Core.every((n) => n.grade === 'SHS2'));
});
