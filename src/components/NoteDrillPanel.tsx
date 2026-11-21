import React, { useEffect, useMemo, useState } from 'react';
import {
  Award,
  Brain,
  CheckCircle2,
  ChevronRight,
  HelpCircle,
  Lightbulb,
  RotateCcw,
  Sparkles,
  Target,
  XCircle,
} from 'lucide-react';
import { getCachedMcqsForSubject, loadMcqsForSubject } from '../data/curriculumLoader';
import { SUBJECTS } from '../data/subjects';
import type { MCQQuestion, StudyNote } from '../types';
import {
  buildDrillsForNote,
  scoreNoteDrillAttempt,
  type NoteDrillAttemptSummary,
  type NoteDrillMasteryRecord,
} from '../utils/noteDrills';
import { MathText } from './MathText';

interface NoteDrillPanelProps {
  note: StudyNote;
  mastery?: NoteDrillMasteryRecord;
  onCompleteDrill?: (summary: NoteDrillAttemptSummary) => void;
  onAskTutor?: (prompt: string) => void;
}

const DIFFICULTY_STYLES = {
  foundation: 'bg-cyan-500/15 text-cyan-300 border-cyan-500/35',
  standard: 'bg-amber-500/15 text-amber-300 border-amber-500/35',
  distinction: 'bg-violet-500/15 text-violet-300 border-violet-500/35',
};

const MASTERY_BADGES = {
  unstarted: { label: 'New Drill', style: 'bg-slate-800 text-slate-300 border-slate-700' },
  developing: { label: 'Developing', style: 'bg-amber-500/15 text-amber-300 border-amber-500/35' },
  proficient: { label: 'Proficient', style: 'bg-cyan-500/15 text-cyan-300 border-cyan-500/35' },
  mastered: { label: 'Mastered', style: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/35' },
};

export const NoteDrillPanel: React.FC<NoteDrillPanelProps> = ({
  note,
  mastery,
  onCompleteDrill,
  onAskTutor,
}) => {
  const [attemptSeed, setAttemptSeed] = useState(0);
  const [weakOnlyMode, setWeakOnlyMode] = useState(false);
  const [subjectMcqs, setSubjectMcqs] = useState<MCQQuestion[]>(
    () => getCachedMcqsForSubject(note.subject) ?? []
  );

  useEffect(() => {
    let active = true;
    const cached = getCachedMcqsForSubject(note.subject);
    if (cached) {
      setSubjectMcqs(cached);
    } else {
      void loadMcqsForSubject(note.subject).then((loaded) => {
        if (active) setSubjectMcqs(loaded);
      });
    }
    return () => {
      active = false;
    };
  }, [note.subject]);

  const allDrills = useMemo(
    () => buildDrillsForNote(note, subjectMcqs, mastery),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [note.id, note.updatedAt, attemptSeed, subjectMcqs]
  );

  const activeDrills = useMemo(() => {
    if (!weakOnlyMode || !mastery?.weakConceptTags?.length) return allDrills;
    const weakSet = new Set(mastery.weakConceptTags.map((t) => t.toLowerCase()));
    const filtered = allDrills.filter((d) => weakSet.has(d.conceptTag.toLowerCase()));
    return filtered.length > 0 ? filtered : allDrills;
  }, [allDrills, weakOnlyMode, mastery?.weakConceptTags]);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, number>>({});
  const [showHint, setShowHint] = useState(false);
  const [summary, setSummary] = useState<NoteDrillAttemptSummary | null>(null);
  const [completedResult, setCompletedResult] = useState<NoteDrillAttemptSummary | null>(null);

  useEffect(() => {
    setCurrentIndex(0);
    setSelectedAnswers({});
    setShowHint(false);
    setSummary(null);
    setCompletedResult(null);
    setWeakOnlyMode(false);
  }, [note.id]);

  const currentQuestion = activeDrills[currentIndex] ?? activeDrills[0];
  const chosenOption = currentQuestion ? selectedAnswers[currentQuestion.id] : undefined;
  const isAnswered = chosenOption !== undefined;
  const answeredCount = activeDrills.filter((q) => selectedAnswers[q.id] !== undefined).length;
  const subjectInfo = SUBJECTS[note.subject];
  const masteryInfo = MASTERY_BADGES[mastery?.masteryLevel ?? 'unstarted'];

  const handleSelectOption = (optIdx: number) => {
    if (!currentQuestion || selectedAnswers[currentQuestion.id] !== undefined) return;
    const nextSelections = { ...selectedAnswers, [currentQuestion.id]: optIdx };
    setSelectedAnswers(nextSelections);

    if (Object.keys(nextSelections).length >= activeDrills.length && !completedResult) {
      const result = scoreNoteDrillAttempt(note, activeDrills, nextSelections, mastery);
      setCompletedResult(result);
      onCompleteDrill?.(result);
    }
  };

  const handleRestart = (weakOnly = false) => {
    setWeakOnlyMode(weakOnly);
    setSelectedAnswers({});
    setCurrentIndex(0);
    setShowHint(false);
    setSummary(null);
    setCompletedResult(null);
    setAttemptSeed((s) => s + 1);
  };

  if (!currentQuestion) {
    return null;
  }

  return (
    <div
      data-testid="note-drill-panel"
      className="rounded-2xl bg-slate-950/90 border border-slate-800 p-4 sm:p-5 space-y-4"
    >
      {/* Top Intelligent Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-3.5">
        <div className="space-y-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2 text-xs">
            <span className="inline-flex items-center gap-1.5 font-bold text-cyan-300">
              <Target className="w-4 h-4 shrink-0" />
              <span>Adaptive Note Drill · {subjectInfo.shortName} {note.grade}</span>
            </span>
            <span className={`px-2 py-0.5 rounded-md border text-[11px] font-semibold ${masteryInfo.style}`}>
              {masteryInfo.label}
              {mastery && mastery.attemptsCount > 0 ? ` · Best ${mastery.bestAccuracy}%` : ''}
            </span>
          </div>
          <p className="text-xs text-slate-400 truncate">
            Practicing: <strong className="text-slate-200">{note.title}</strong>
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono tabular-nums text-slate-300">
          <span className="px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800">
            {answeredCount} / {activeDrills.length} Answered
          </span>
          <button
            type="button"
            onClick={() => handleRestart(false)}
            aria-label="Restart note drill"
            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300 font-sans font-medium transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset</span>
          </button>
        </div>
      </div>

      {/* Question Stepper Strip */}
      <div className="flex flex-wrap items-center gap-1.5">
        {activeDrills.map((q, idx) => {
          const ans = selectedAnswers[q.id];
          const answered = ans !== undefined;
          const correct = answered && ans === q.correctIndex;
          const active = idx === currentIndex && !summary;
          return (
            <button
              key={q.id}
              type="button"
              onClick={() => {
                setSummary(null);
                setCurrentIndex(idx);
                setShowHint(false);
              }}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-mono font-bold border transition-colors ${
                active
                  ? 'bg-cyan-500/20 border-cyan-400 text-cyan-200'
                  : answered
                    ? correct
                      ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-300'
                      : 'bg-rose-500/15 border-rose-500/40 text-rose-300'
                    : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              Q{idx + 1}
            </button>
          );
        })}
      </div>

      {/* Scorecard Screen when Drill Finishes */}
      {summary ? (
        <div
          data-testid="note-drill-summary"
          className="rounded-xl bg-slate-900/90 border border-emerald-500/35 p-5 space-y-4"
        >
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-xl bg-emerald-500/15 border border-emerald-500/40 flex items-center justify-center text-emerald-300">
                <Award className="w-6 h-6" />
              </div>
              <div>
                <div className="text-xs font-semibold text-emerald-300 uppercase tracking-wider">
                  Drill Complete
                </div>
                <h4 className="font-display text-lg font-bold text-white tabular-nums">
                  {summary.correctCount} / {summary.totalQuestions} Correct ({summary.accuracyPct}%)
                </h4>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              {summary.weakConceptTags.length > 0 && (
                <button
                  type="button"
                  onClick={() => handleRestart(true)}
                  className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold transition-colors"
                >
                  <Brain className="w-3.5 h-3.5" />
                  <span>Drill Weak Concepts ({summary.weakConceptTags.length})</span>
                </button>
              )}
              <button
                type="button"
                onClick={() => handleRestart(false)}
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-bold transition-colors"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Practice Again</span>
              </button>
            </div>
          </div>

          {summary.weakConceptTags.length > 0 ? (
            <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 text-xs text-slate-300 space-y-1">
              <div className="font-semibold text-amber-300">Focus areas for next adaptive round:</div>
              <div>
                <MathText text={summary.weakConceptTags.join(' · ')} />
              </div>
            </div>
          ) : (
            <div className="p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-xs text-emerald-200">
              Clean sweep! All target concepts in "{note.title}" marked Mastered.
            </div>
          )}
        </div>
      ) : (
        /* Active Question Card */
        <div className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-2 text-[11px]">
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded-md bg-slate-900 border border-slate-700 text-slate-300 font-semibold">
                <MathText text={currentQuestion.conceptTag} />
              </span>
              <span
                className={`px-2 py-0.5 rounded-md border capitalize font-semibold ${DIFFICULTY_STYLES[currentQuestion.difficulty]}`}
              >
                {currentQuestion.difficulty}
              </span>
            </div>

            <button
              type="button"
              onClick={() => setShowHint((h) => !h)}
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-amber-300 font-semibold transition-colors"
            >
              <Lightbulb className="w-3.5 h-3.5" />
              <span>{showHint ? 'Hide Smart Hint' : 'Smart Hint'}</span>
            </button>
          </div>

          {showHint && (
            <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-xs text-amber-100 leading-relaxed flex items-start gap-2">
              <HelpCircle className="w-4 h-4 text-amber-300 shrink-0 mt-0.5" />
              <div>
                <MathText text={currentQuestion.hint} />
              </div>
            </div>
          )}

          <div className="text-sm sm:text-base font-medium text-white leading-relaxed">
            <MathText text={currentQuestion.prompt} />
          </div>

          <div className="grid grid-cols-1 gap-2.5">
            {currentQuestion.options.map((opt, optIdx) => {
              const isCorrect = optIdx === currentQuestion.correctIndex;
              const isSelected = chosenOption === optIdx;

              let btnStyle = 'bg-slate-900 border-slate-800 text-slate-200 hover:border-cyan-500/50';
              if (isAnswered) {
                if (isCorrect) {
                  btnStyle = 'bg-emerald-500/15 border-emerald-400 text-emerald-100';
                } else if (isSelected) {
                  btnStyle = 'bg-rose-500/15 border-rose-400 text-rose-100';
                } else {
                  btnStyle = 'bg-slate-900/50 border-slate-800/70 text-slate-500';
                }
              }

              return (
                <button
                  key={optIdx}
                  type="button"
                  disabled={isAnswered}
                  data-testid={`note-drill-option-${optIdx}`}
                  onClick={() => handleSelectOption(optIdx)}
                  className={`w-full text-left p-3 rounded-xl border text-xs sm:text-sm transition-colors flex items-start justify-between gap-3 ${btnStyle}`}
                >
                  <div className="flex items-start gap-2.5">
                    <span className="font-mono font-bold text-slate-400 shrink-0">
                      {String.fromCharCode(65 + optIdx)}.
                    </span>
                    <div className="leading-relaxed">
                      <MathText text={opt} />
                    </div>
                  </div>
                  {isAnswered && isCorrect && (
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  )}
                  {isAnswered && isSelected && !isCorrect && (
                    <XCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                  )}
                </button>
              );
            })}
          </div>

          {isAnswered && (
            <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-700 space-y-3">
              <div className="text-xs text-slate-200 leading-relaxed">
                <span className="font-bold text-cyan-300 mr-1.5">Worked Explanation:</span>
                <MathText text={currentQuestion.explanation} />
              </div>

              <div className="flex flex-wrap items-center justify-between gap-2">
                {onAskTutor && (
                  <button
                    type="button"
                    onClick={() =>
                      onAskTutor(
                        `Explain this ${note.grade} ${subjectInfo.name} drill question from "${note.title}":\n${currentQuestion.prompt}\nCorrect answer: ${currentQuestion.options[currentQuestion.correctIndex]}`
                      )
                    }
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-violet-500/20 hover:bg-violet-500/30 border border-violet-500/40 text-xs font-semibold text-violet-200 transition-colors"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Ask AI Tutor</span>
                  </button>
                )}

                {currentIndex < activeDrills.length - 1 ? (
                  <button
                    type="button"
                    onClick={() => {
                      setCurrentIndex((i) => i + 1);
                      setShowHint(false);
                    }}
                    className="inline-flex items-center gap-1 px-3.5 py-1.5 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-bold transition-colors ml-auto"
                  >
                    <span>Next Question</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                ) : (
                  <button
                    type="button"
                    data-testid="note-drill-view-scorecard"
                    onClick={() => {
                      if (completedResult) {
                        setSummary(completedResult);
                      } else {
                        const res = scoreNoteDrillAttempt(note, activeDrills, selectedAnswers, mastery);
                        setCompletedResult(res);
                        setSummary(res);
                        onCompleteDrill?.(res);
                      }
                    }}
                    className="inline-flex items-center gap-1 px-3.5 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold transition-colors ml-auto"
                  >
                    <span>View Drill Scorecard</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
