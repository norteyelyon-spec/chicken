import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import {
  buildTutorPromptChips,
  buildTutorStudentContextPayload,
  buildTutorSystemInstruction,
  computeTutorRecommendations,
  extractTutorErrorMessage,
} from './tutorContext.ts';
import { createDefaultProfile } from './quizEngine.ts';
import { SYLLABUS_TOPICS } from '../data/subjects.ts';
import { ALL_MCQ_QUESTIONS } from '../data/mcqQuestions.ts';

describe('tutorContext recommendations & prompt engineering', () => {
  it('prioritizes pending Mistake Bank topics first and lowest-mastery subjects next', () => {
    const profile = createDefaultProfile({ gradeLevel: 'SHS3' });
    const phyTopic = SYLLABUS_TOPICS.find((t) => t.subject === 'physics' && t.grade === 'SHS1')!;
    const chemTopic = SYLLABUS_TOPICS.find((t) => t.subject === 'chemistry' && t.grade === 'SHS2')!;
    const mistakes = [
      {
        questionId: 'phy-s1-1',
        subject: 'physics' as const,
        grade: 'SHS1' as const,
        topicId: phyTopic.id,
        wrongCount: 3,
        lastMissedAt: '2026-11-16T10:00:00.000Z',
        lastSelectedIndex: 1,
        mastered: false,
      },
      {
        questionId: 'chem-s2-1',
        subject: 'chemistry' as const,
        grade: 'SHS2' as const,
        topicId: chemTopic.id,
        wrongCount: 1,
        lastMissedAt: '2026-11-15T10:00:00.000Z',
        lastSelectedIndex: 0,
        mastered: true, // Mastered items should NOT appear in pending recommendations
      },
    ];

    const masteryStats = [
      { subject: 'physics' as const, attemptsCount: 2, questionsSolved: 10, averagePercentage: 65, byGrade: { SHS1: 65, SHS2: 0, SHS3: 0 } },
      { subject: 'chemistry' as const, attemptsCount: 2, questionsSolved: 10, averagePercentage: 85, byGrade: { SHS1: 0, SHS2: 85, SHS3: 0 } },
      { subject: 'biology' as const, attemptsCount: 0, questionsSolved: 0, averagePercentage: 0, byGrade: { SHS1: 0, SHS2: 0, SHS3: 0 } },
      { subject: 'addmaths' as const, attemptsCount: 1, questionsSolved: 5, averagePercentage: 55, byGrade: { SHS1: 0, SHS2: 55, SHS3: 0 } },
      { subject: 'ict' as const, attemptsCount: 1, questionsSolved: 5, averagePercentage: 100, byGrade: { SHS1: 0, SHS2: 0, SHS3: 100 } },
    ];

    const recs = computeTutorRecommendations(masteryStats, mistakes, SYLLABUS_TOPICS, profile, 4);
    assert.equal(recs.length, 4);
    assert.equal(recs[0].topicId, phyTopic.id);
    assert.equal(recs[0].priority, 'high');
    assert.ok(recs[0].reason.includes('3x missed'));

    // Next should target unattempted biology at student's gradeLevel SHS3
    assert.equal(recs[1].subject, 'biology');
    assert.equal(recs[1].grade, 'SHS3');
  });

  it('builds grounded system instruction including analytics, mistakes, and Socratic hint rules', () => {
    const profile = createDefaultProfile({ preferredName: 'Abena', gradeLevel: 'SHS2' });
    const sampleQ = ALL_MCQ_QUESTIONS[0];
    const masteryStats = [
      { subject: 'physics' as const, attemptsCount: 1, questionsSolved: 5, averagePercentage: 60, byGrade: { SHS1: 60, SHS2: 0, SHS3: 0 } },
      { subject: 'chemistry' as const, attemptsCount: 1, questionsSolved: 5, averagePercentage: 80, byGrade: { SHS1: 0, SHS2: 80, SHS3: 0 } },
      { subject: 'biology' as const, attemptsCount: 1, questionsSolved: 5, averagePercentage: 80, byGrade: { SHS1: 0, SHS2: 0, SHS3: 80 } },
      { subject: 'addmaths' as const, attemptsCount: 1, questionsSolved: 5, averagePercentage: 60, byGrade: { SHS1: 0, SHS2: 60, SHS3: 0 } },
      { subject: 'ict' as const, attemptsCount: 1, questionsSolved: 5, averagePercentage: 100, byGrade: { SHS1: 0, SHS2: 0, SHS3: 100 } },
    ];

    const ctx = buildTutorStudentContextPayload({
      profile,
      overallAccuracy: 76,
      totalQuestionsSolved: 25,
      streak: {
        currentStreak: 4,
        longestStreak: 5,
        lastActiveDate: '2026-11-16',
        questionsSolvedToday: 5,
        totalStudyMinutes: 85,
      },
      masteryStats,
      mistakes: [
        {
          questionId: sampleQ.id,
          subject: sampleQ.subject,
          grade: sampleQ.grade,
          topicId: sampleQ.topicId,
          wrongCount: 2,
          lastMissedAt: '2026-11-16T08:00:00Z',
          lastSelectedIndex: 0,
          mastered: false,
        },
      ],
      mcqPool: ALL_MCQ_QUESTIONS,
      topics: SYLLABUS_TOPICS,
      notes: [],
      activeQuestion: {
        id: sampleQ.id,
        paperType: 'mcq',
        subject: sampleQ.subject,
        grade: sampleQ.grade,
        topicId: sampleQ.topicId,
        topicTitle: sampleQ.topicTitle,
        prompt: sampleQ.prompt,
        options: sampleQ.options,
        selectedOptionIndex: null,
        isSubmitted: false,
      },
    });

    const systemPrompt = buildTutorSystemInstruction(ctx);
    assert.ok(systemPrompt.includes('Abena (SHS2'));
    assert.ok(systemPrompt.includes('Overall Accuracy: 76%'));
    assert.ok(systemPrompt.includes('ACTIVE PRACTICE QUESTION ATTACHED BY STUDENT'));
    assert.ok(systemPrompt.includes('give Socratic hints and guiding steps first'));
    assert.ok(systemPrompt.includes(sampleQ.topicTitle));

    const chips = buildTutorPromptChips(ctx);
    assert.equal(chips.length, 3);
    assert.ok(chips[0].label.toLowerCase().includes('hint'));
  });

  it('maps Gemini API status codes cleanly into student-facing error guidance', () => {
    assert.ok(extractTutorErrorMessage(403, 'PERMISSION_DENIED').includes('Settings > Secrets'));
    assert.ok(extractTutorErrorMessage(429, 'RESOURCE_EXHAUSTED').includes('rate limit'));
    assert.equal(extractTutorErrorMessage(500, 'Network timeout'), 'Network timeout');
  });
});
