import React, { useEffect, useMemo, useState } from 'react';
import { BookOpen, Clock, Play, X } from 'lucide-react';
import {
  getCachedMcqsForSubject,
  getCachedTheoryForSubject,
  loadMcqsForSubject,
  loadTheoryForSubject,
} from '../data/curriculumLoader';
import { SUBJECTS, SUBJECT_LIST, SYLLABUS_TOPICS } from '../data/subjects';
import type {
  GradeFilter,
  MCQQuestion,
  PaperType,
  QuizConfig,
  SubjectId,
  TestMode,
  TheoryQuestion,
} from '../types';
import { unlockExamAudioContext } from '../utils/examTimerAudio';

interface QuizConfigModalProps {
  isOpen: boolean;
  initialSubject?: SubjectId;
  initialGrade?: GradeFilter;
  initialTopicIds?: string[];
  onClose: () => void;
  onStartExam: (config: QuizConfig) => void;
}

export const QuizConfigModal: React.FC<QuizConfigModalProps> = ({
  isOpen,
  initialSubject = 'physics',
  initialGrade = 'ALL',
  initialTopicIds = [],
  onClose,
  onStartExam,
}) => {
  const [subject, setSubject] = useState<SubjectId>(initialSubject);
  const [gradeFilter, setGradeFilter] = useState<GradeFilter>(initialGrade);
  const [topicIds, setTopicIds] = useState<string[]>(initialTopicIds);
  const [paperType, setPaperType] = useState<PaperType>('mcq');
  const [mode, setMode] = useState<TestMode>('study');
  const [questionCount, setQuestionCount] = useState<number>(10);
  const [subjectMcqs, setSubjectMcqs] = useState<MCQQuestion[]>(
    () => getCachedMcqsForSubject(initialSubject) ?? []
  );
  const [subjectTheory, setSubjectTheory] = useState<TheoryQuestion[]>(
    () => getCachedTheoryForSubject(initialSubject) ?? []
  );

  // Sync if props change when reopening
  useEffect(() => {
    if (isOpen) {
      setSubject(initialSubject);
      setGradeFilter(initialGrade);
      setTopicIds(initialTopicIds);
    }
  }, [isOpen, initialSubject, initialGrade, initialTopicIds]);

  // Dynamically load question counts for the active subject
  useEffect(() => {
    if (!isOpen) return;
    let active = true;
    const cachedMcq = getCachedMcqsForSubject(subject);
    const cachedTheory = getCachedTheoryForSubject(subject);
    if (cachedMcq) setSubjectMcqs(cachedMcq);
    if (cachedTheory) setSubjectTheory(cachedTheory);

    void Promise.all([
      cachedMcq ? Promise.resolve(cachedMcq) : loadMcqsForSubject(subject),
      cachedTheory ? Promise.resolve(cachedTheory) : loadTheoryForSubject(subject),
    ]).then(([mcqs, theory]) => {
      if (!active) return;
      setSubjectMcqs(mcqs);
      setSubjectTheory(theory);
    });
    return () => {
      active = false;
    };
  }, [isOpen, subject]);

  const availableTopics = useMemo(() => {
    return SYLLABUS_TOPICS.filter((t) => {
      if (t.subject !== subject) return false;
      if (gradeFilter !== 'ALL' && t.grade !== gradeFilter) return false;
      return true;
    });
  }, [subject, gradeFilter]);

  const subjectUniqueCount = useMemo(() => {
    const pool = paperType === 'mcq' ? subjectMcqs : subjectTheory;
    return pool.length;
  }, [paperType, subjectMcqs, subjectTheory]);

  const filteredUniqueCount = useMemo(() => {
    const pool = paperType === 'mcq' ? subjectMcqs : subjectTheory;
    return pool.filter((q) => {
      if (gradeFilter !== 'ALL' && q.grade !== gradeFilter) return false;
      if (topicIds.length > 0 && !topicIds.includes(q.topicId)) return false;
      return true;
    }).length;
  }, [paperType, subjectMcqs, subjectTheory, gradeFilter, topicIds]);

  if (!isOpen) return null;

  const handleSubjectChange = (nextSub: SubjectId) => {
    setSubject(nextSub);
    setTopicIds([]);
  };

  const handleGradeChange = (nextGrade: GradeFilter) => {
    setGradeFilter(nextGrade);
    setTopicIds([]);
  };

  const toggleTopic = (id: string) => {
    setTopicIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const maxCount =
    paperType === 'mcq'
      ? Math.max(1, Math.min(45, subjectUniqueCount || 45))
      : Math.max(1, Math.min(10, subjectUniqueCount || 10));
  const safeCount = Math.max(1, Math.min(maxCount, questionCount || 1));

  const handleLaunch = (e: React.FormEvent) => {
    e.preventDefault();
    if (mode === 'exam') {
      unlockExamAudioContext();
    }
    onStartExam({
      subject,
      gradeFilter,
      topicIds,
      mode,
      paperType,
      questionCount: safeCount,
    });
  };

  const activeSub = SUBJECTS[subject];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md overflow-y-auto"
      role="dialog"
      aria-modal="true"
      aria-labelledby="quiz-config-title"
    >
      <div className="w-full max-w-2xl rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl overflow-hidden my-auto">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800">
          <div>
            <h2 id="quiz-config-title" className="font-display text-lg font-bold text-white">
              Configure WASSCE Exam &amp; Quiz Session
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Customize subject, SHS grade level, GES syllabus topics, paper style, and question count
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close exam configuration"
            className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleLaunch} className="p-6 space-y-5 max-h-[82vh] overflow-y-auto">
          {/* Subject Picker */}
          <div className="space-y-3">
            <span className="block text-xs font-medium text-slate-300">1. Select Subject</span>

            <div className="space-y-1.5">
              <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                Elective Science &amp; ICT
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                {SUBJECT_LIST.filter((s) => s.category === 'elective').map((sub) => {
                  const selected = subject === sub.id;
                  return (
                    <button
                      key={sub.id}
                      type="button"
                      onClick={() => handleSubjectChange(sub.id)}
                      aria-pressed={selected}
                      className={`px-3 py-2.5 rounded-xl border text-xs font-semibold transition-colors whitespace-nowrap ${
                        selected
                          ? `${sub.bgSoftClass} ${sub.borderClass} ${sub.textClass}`
                          : 'bg-slate-950/70 border-slate-800 text-slate-400 hover:text-white'
                      }`}
                    >
                      {sub.shortName}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                Core WASSCE Subjects
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {SUBJECT_LIST.filter((s) => s.category === 'core').map((sub) => {
                  const selected = subject === sub.id;
                  return (
                    <button
                      key={sub.id}
                      type="button"
                      onClick={() => handleSubjectChange(sub.id)}
                      aria-pressed={selected}
                      className={`px-3 py-2.5 rounded-xl border text-xs font-semibold transition-colors whitespace-nowrap ${
                        selected
                          ? `${sub.bgSoftClass} ${sub.borderClass} ${sub.textClass}`
                          : 'bg-slate-950/70 border-slate-800 text-slate-400 hover:text-white'
                      }`}
                    >
                      {sub.shortName}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Grade Level & Paper Type */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="quiz-grade-select" className="block text-xs font-medium text-slate-300 mb-1.5">
                2. Grade / Form Level
              </label>
              <select
                id="quiz-grade-select"
                value={gradeFilter}
                onChange={(e) => handleGradeChange(e.target.value as GradeFilter)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white focus:outline-none focus:border-cyan-400"
              >
                <option value="ALL">All Levels (Full WASSCE Standard)</option>
                <option value="SHS1">SHS 1 (Grade 10)</option>
                <option value="SHS2">SHS 2 (Grade 11)</option>
                <option value="SHS3">SHS 3 (Grade 12)</option>
              </select>
            </div>

            <div>
              <span className="block text-xs font-medium text-slate-300 mb-1.5">3. WASSCE Paper Format</span>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setPaperType('mcq');
                    if (questionCount < 5) setQuestionCount(10);
                  }}
                  aria-pressed={paperType === 'mcq'}
                  className={`px-3 py-2.5 rounded-xl border text-xs font-semibold transition-colors ${
                    paperType === 'mcq'
                      ? 'bg-cyan-500/15 border-cyan-500/40 text-cyan-300'
                      : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  Paper 1 · MCQ
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setPaperType('theory');
                    if (questionCount > 3) setQuestionCount(2);
                  }}
                  aria-pressed={paperType === 'theory'}
                  className={`px-3 py-2.5 rounded-xl border text-xs font-semibold transition-colors ${
                    paperType === 'theory'
                      ? 'bg-violet-500/15 border-violet-500/40 text-violet-300'
                      : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  Paper 2 · Theory
                </button>
              </div>
            </div>
          </div>

          {/* Specific Topics */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-medium text-slate-300">
                4. GES Syllabus Topics ({topicIds.length === 0 ? 'All Topics Included' : `${topicIds.length} Selected`})
              </span>
              {topicIds.length > 0 && (
                <button
                  type="button"
                  onClick={() => setTopicIds([])}
                  className="text-xs text-cyan-400 hover:text-cyan-300"
                >
                  Clear filter
                </button>
              )}
            </div>
            <div className="max-h-40 overflow-y-auto grid grid-cols-1 sm:grid-cols-2 gap-2 pr-1">
              {availableTopics.map((topic) => {
                const checked = topicIds.includes(topic.id);
                return (
                  <label
                    key={topic.id}
                    className={`flex items-start gap-2.5 p-2.5 rounded-xl border cursor-pointer transition-colors ${
                      checked
                        ? `${activeSub.bgSoftClass} ${activeSub.borderClass} text-white`
                        : 'bg-slate-950/70 border-slate-800 text-slate-300 hover:border-slate-700'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={() => toggleTopic(topic.id)}
                      className="mt-0.5 accent-cyan-400"
                    />
                    <div className="min-w-0">
                      <div className="text-xs font-medium leading-snug">{topic.title}</div>
                      <div className="text-[11px] text-slate-500">{topic.grade}</div>
                    </div>
                  </label>
                );
              })}
            </div>
          </div>

          {/* Mode Selection */}
          <div>
            <span className="block text-xs font-medium text-slate-300 mb-2">5. Assessment Mode</span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setMode('study')}
                aria-pressed={mode === 'study'}
                className={`p-3.5 rounded-xl border text-left transition-colors ${
                  mode === 'study'
                    ? 'bg-emerald-500/10 border-emerald-500/40 text-white'
                    : 'bg-slate-950/70 border-slate-800 text-slate-400 hover:text-slate-200'
                }`}
              >
                <div className="flex items-center gap-2 text-xs font-semibold text-emerald-300">
                  <BookOpen className="w-4 h-4" />
                  <span>Study Mode (Instant Feedback)</span>
                </div>
                <p className="text-[11px] text-slate-400 mt-1">
                  Reveals step-by-step workings and distractor explanations immediately after each answer.
                </p>
              </button>

              <button
                type="button"
                onClick={() => setMode('exam')}
                aria-pressed={mode === 'exam'}
                className={`p-3.5 rounded-xl border text-left transition-colors ${
                  mode === 'exam'
                    ? 'bg-amber-500/10 border-amber-500/40 text-white'
                    : 'bg-slate-950/70 border-slate-800 text-slate-400 hover:text-slate-200'
                }`}
              >
                <div className="flex items-center gap-2 text-xs font-semibold text-amber-300">
                  <Clock className="w-4 h-4" />
                  <span>WASSCE Exam Simulation (Timed)</span>
                </div>
                <p className="text-[11px] text-slate-400 mt-1">
                  Countdown timer active with subtle ticking in the final 5 minutes. Explanations unlock after submission.
                </p>
              </button>
            </div>
          </div>

          {/* Custom Number of Questions (Slider + Numeric Input) */}
          <div className="rounded-xl bg-slate-950/80 border border-slate-800 p-4 space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <label htmlFor="question-count-input" className="text-xs font-medium text-slate-300">
                  6. Number of Unique Questions {paperType === 'mcq' ? `(1 – ${maxCount})` : `(1 – ${maxCount} Essays)`}
                </label>
                <div className="text-[11px] text-slate-500 mt-0.5 tabular-nums">
                  {filteredUniqueCount} direct filter matches · {subjectUniqueCount} unique in {activeSub.shortName} (zero repetition)
                </div>
              </div>
              <input
                id="question-count-input"
                type="number"
                min={1}
                max={maxCount}
                value={safeCount}
                onChange={(e) => setQuestionCount(Math.max(1, Math.min(maxCount, Number(e.target.value))))}
                className="w-20 px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-sm text-white text-center font-mono tabular-nums focus:outline-none focus:border-cyan-400"
              />
            </div>
            <input
              type="range"
              aria-label="Question count slider"
              min={1}
              max={maxCount}
              value={safeCount}
              onChange={(e) => setQuestionCount(Number(e.target.value))}
              className="w-full accent-cyan-400 cursor-pointer"
            />
            <div className="flex flex-wrap items-center justify-between gap-2 text-[11px] text-slate-500 tabular-nums">
              {paperType === 'mcq' ? (
                <>
                  <button type="button" onClick={() => setQuestionCount(5)} className="hover:text-cyan-400">5 Quick</button>
                  <button type="button" onClick={() => setQuestionCount(15)} className="hover:text-cyan-400">15 Topic</button>
                  <button type="button" onClick={() => setQuestionCount(30)} className="hover:text-cyan-400">30 Practice</button>
                  <button type="button" onClick={() => setQuestionCount(maxCount)} className="hover:text-cyan-400">{maxCount} Full Paper 1</button>
                </>
              ) : (
                <>
                  <button type="button" onClick={() => setQuestionCount(1)} className="hover:text-cyan-400">1 Essay (~10 marks)</button>
                  <button type="button" onClick={() => setQuestionCount(3)} className="hover:text-cyan-400">3 Essays (Full Section)</button>
                  <button type="button" onClick={() => setQuestionCount(Math.min(5, maxCount))} className="hover:text-cyan-400">5 Extended Paper 2</button>
                </>
              )}
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-1">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs sm:text-sm font-medium text-slate-200 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-semibold text-xs sm:text-sm transition-colors whitespace-nowrap"
            >
              <Play className="w-4 h-4 fill-current" />
              <span>Begin {paperType === 'mcq' ? 'Paper 1' : 'Paper 2'} ({safeCount}Q)</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
