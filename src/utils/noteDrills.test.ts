import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { INITIAL_NOTES } from '../data/defaultNotes.ts';
import { ALL_MCQ_QUESTIONS } from '../data/mcqQuestions.ts';
import { SYLLABUS_NOTES } from '../data/syllabusNotes/index.ts';
import {
  buildDrillsForNote,
  scoreNoteDrillAttempt,
  type NoteDrillMasteryRecord,
} from './noteDrills.ts';

describe('noteDrills adaptive drill generator & mastery scoring', () => {
  it('generates >= 4 well-formed distinct 4-option questions for 100% of notes across all subjects and grades', () => {
    const combined = [...INITIAL_NOTES, ...SYLLABUS_NOTES];
    assert.ok(combined.length >= 170, `Expected >= 170 total notes, got ${combined.length}`);

    for (const note of combined) {
      const drills = buildDrillsForNote(note, ALL_MCQ_QUESTIONS);
      assert.ok(
        drills.length >= 4,
        `Expected >= 4 drills for ${note.id} (${note.subject} ${note.grade}), got ${drills.length}`
      );

      for (const q of drills) {
        assert.equal(q.noteId, note.id);
        assert.equal(q.options.length, 4);
        assert.ok(q.correctIndex >= 0 && q.correctIndex <= 3);
        assert.ok(q.prompt.trim().length >= 10, `Short prompt in ${q.id}`);
        assert.ok(q.hint.trim().length >= 5, `Empty hint in ${q.id}`);
        assert.ok(q.explanation.trim().length >= 8, `Empty explanation in ${q.id}`);

        const uniqueOpts = new Set(q.options.map((o) => o.trim().toLowerCase()));
        assert.equal(
          uniqueOpts.size,
          4,
          `Duplicate option generated in drill ${q.id} for note ${note.id}`
        );
      }
    }
  });

  it('prioritizes weakConceptTags first on subsequent adaptive attempts', () => {
    const targetNote =
      SYLLABUS_NOTES.find((n) => n.id === 'note-mg-phys-s3-nuclear-logic') ?? SYLLABUS_NOTES[0];
    const baseline = buildDrillsForNote(targetNote, ALL_MCQ_QUESTIONS);
    assert.ok(baseline.length >= 3);

    const lastTag = baseline[baseline.length - 1].conceptTag;
    const mastery: NoteDrillMasteryRecord = {
      noteId: targetNote.id,
      attemptsCount: 1,
      bestAccuracy: 50,
      lastAccuracy: 50,
      masteryLevel: 'developing',
      totalAnswered: baseline.length,
      totalCorrect: Math.floor(baseline.length / 2),
      lastPracticedAt: '2026-02-01T10:00:00.000Z',
      weakConceptTags: [lastTag],
    };

    const adapted = buildDrillsForNote(targetNote, ALL_MCQ_QUESTIONS, mastery);
    assert.equal(
      adapted[0].conceptTag.toLowerCase(),
      lastTag.toLowerCase(),
      'Expected weak concept tag to bubble to the top of adaptive drill queue'
    );
  });

  it('scores drill attempts into accurate mastery tiers and extracts missed matched MCQ IDs', () => {
    const targetNote =
      SYLLABUS_NOTES.find((n) => n.id === 'note-mg-chem-s2-cells-faraday') ?? SYLLABUS_NOTES[0];
    const drills = buildDrillsForNote(targetNote, ALL_MCQ_QUESTIONS);

    const allCorrect: Record<string, number> = {};
    for (const q of drills) {
      allCorrect[q.id] = q.correctIndex;
    }
    const masteredSummary = scoreNoteDrillAttempt(targetNote, drills, allCorrect);
    assert.equal(masteredSummary.accuracyPct, 100);
    assert.equal(masteredSummary.weakConceptTags.length, 0);
    assert.equal(masteredSummary.updatedMastery.masteryLevel, 'mastered');

    const mixedAnswers: Record<string, number> = {};
    drills.forEach((q, idx) => {
      mixedAnswers[q.id] = idx === 0 ? (q.correctIndex + 1) % 4 : q.correctIndex;
    });
    const missedSummary = scoreNoteDrillAttempt(targetNote, drills, mixedAnswers);
    assert.ok(missedSummary.accuracyPct < 100);
    assert.ok(missedSummary.weakConceptTags.includes(drills[0].conceptTag));
    if (drills[0].matchedMcqId) {
      assert.ok(missedSummary.missedMatchedMcqIds.includes(drills[0].matchedMcqId));
    }
  });
});
