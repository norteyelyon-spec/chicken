import assert from 'node:assert/strict';
import test from 'node:test';
import {
  CURRICULUM_TOTALS,
  getAllCachedMcqs,
  getCachedMcqsForSubject,
  getCachedSyllabusNotes,
  getCachedTheoryForSubject,
  loadAllSyllabusNotes,
  loadMcqsForSubject,
  loadMcqsForSubjects,
  loadTheoryForSubject,
} from './curriculumLoader.ts';
import type { SubjectId } from '../types/index.ts';

const ALL_SUBJECTS: SubjectId[] = [
  'physics',
  'chemistry',
  'biology',
  'addmaths',
  'ict',
  'coremath',
  'english',
  'integratedscience',
  'socialstudies',
];

test('curriculumLoader dynamically loads all 9 subjects and preserves exact counts', async () => {
  const mcqLists = await Promise.all(ALL_SUBJECTS.map((s) => loadMcqsForSubject(s)));
  const totalMcqs = mcqLists.reduce((sum, list) => sum + list.length, 0);
  assert.equal(totalMcqs, CURRICULUM_TOTALS.mcqs, `Expected ${CURRICULUM_TOTALS.mcqs} MCQs, got ${totalMcqs}`);

  // Cache consistency check
  const cachedPhysics = getCachedMcqsForSubject('physics');
  assert.ok(cachedPhysics && cachedPhysics.length > 0);
  const reloadedPhysics = await loadMcqsForSubject('physics');
  assert.equal(reloadedPhysics, cachedPhysics);

  const combined = await loadMcqsForSubjects(['physics', 'chemistry', 'physics']);
  assert.equal(
    combined.length,
    mcqLists[0].length + mcqLists[1].length,
    'loadMcqsForSubjects should deduplicate repeated subjects'
  );
  assert.equal(getAllCachedMcqs().length, CURRICULUM_TOTALS.mcqs);
});

test('curriculumLoader dynamically loads all theory banks with exact total count', async () => {
  const theoryLists = await Promise.all(ALL_SUBJECTS.map((s) => loadTheoryForSubject(s)));
  const totalTheory = theoryLists.reduce((sum, list) => sum + list.length, 0);
  assert.equal(
    totalTheory,
    CURRICULUM_TOTALS.theory,
    `Expected ${CURRICULUM_TOTALS.theory} theory items, got ${totalTheory}`
  );

  const cachedChem = getCachedTheoryForSubject('chemistry');
  assert.ok(cachedChem && cachedChem.length > 0);
  assert.equal(await loadTheoryForSubject('chemistry'), cachedChem);
});

test('curriculumLoader dynamically loads all 169 GES syllabus notes', async () => {
  const notes = await loadAllSyllabusNotes();
  assert.equal(
    notes.length,
    CURRICULUM_TOTALS.notes,
    `Expected ${CURRICULUM_TOTALS.notes} syllabus notes, got ${notes.length}`
  );
  assert.equal(getCachedSyllabusNotes(), notes);
});
