import React, { useEffect, useRef, useState } from 'react';
import {
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Clock,
  GraduationCap,
  RotateCcw,
  SlidersHorizontal,
  Sparkles,
  Volume2,
  VolumeX,
  XCircle,
} from 'lucide-react';
import { SUBJECTS } from '../data/subjects';
import type {
  ExamAttempt,
  MCQAnswerRecord,
  MCQQuestion,
  QuizConfig,
  TheoryPartSelfGrade,
  TheoryQuestion,
  TutorQuestionContext,
} from '../types';
import {
  evaluateExamTick,
  playExamTimeUpChime,
  playSubtleExamTick,
  unlockExamAudioContext,
} from '../utils/examTimerAudio';
import {
  formatDurationClock,
  gradeMCQSession,
  gradeTheorySession,
  insertSymbolAtCursor,
} from '../utils/quizEngine';
import { MathText } from './MathText';

const SYMBOL_TOOLBAR = ['θ', 'π', '√', 'Δ', '→', '²', '₃', 'Ω', 'μ', '≈', '∑', '∫'];
const OPTION_LETTERS = ['A', 'B', 'C', 'D'] as const;

interface ExamEngineProps {
  config: QuizConfig | null;
  mcqSession: MCQQuestion[];
  theorySession: TheoryQuestion[];
  onOpenConfig: () => void;
  onCompleteMCQ: (attempt: ExamAttempt, questions: MCQQuestion[], records: MCQAnswerRecord[]) => void;
  onCompleteTheory: (attempt: ExamAttempt) => void;
  onAskQuestionHint: (context: TutorQuestionContext) => void;
}

export const ExamEngine: React.FC<ExamEngineProps> = ({
  config,
  mcqSession,
  theorySession,
  onOpenConfig,
  onCompleteMCQ,
  onCompleteTheory,
  onAskQuestionHint,
}) => {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [mcqAnswers, setMcqAnswers] = useState<Record<number, number | null>>({});
  const [revealedQuestions, setRevealedQuestions] = useState<Record<number, boolean>>({});
  const [mcqSubmitted, setMcqSubmitted] = useState(false);

  // Theory state: map[questionIndex][partIndex] = response string
  const [theoryTexts, setTheoryTexts] = useState<Record<string, string>>({});
  const [theorySelfMarks, setTheorySelfMarks] = useState<Record<string, number>>({});
  const [theoryRevealed, setTheoryRevealed] = useState(false);
  const [theorySaved, setTheorySaved] = useState(false);
  const textareaRefs = useRef<Record<string, HTMLTextAreaElement | null>>({});

  // Timer state
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [remainingSeconds, setRemainingSeconds] = useState(0);
  const [isTickMuted, setIsTickMuted] = useState(false);
  const prevRemainingRef = useRef<number | null>(null);

  // Reset local state whenever a new session starts
  useEffect(() => {
    setCurrentIdx(0);
    setMcqAnswers({});
    setRevealedQuestions({});
    setMcqSubmitted(false);
    setTheoryTexts({});
    setTheorySelfMarks({});
    setTheoryRevealed(false);
    setTheorySaved(false);
    setElapsedSeconds(0);

    if (config) {
      const totalBudget =
        config.paperType === 'mcq'
          ? config.questionCount * 60
          : theorySession.length * 12 * 60;
      setRemainingSeconds(totalBudget);
    }
    prevRemainingRef.current = null;
  }, [config, mcqSession, theorySession]);

  // Active clock tick
  useEffect(() => {
    if (!config) return;
    if (config.paperType === 'mcq' && mcqSubmitted) return;
    if (config.paperType === 'theory' && theorySaved) return;

    const timer = window.setInterval(() => {
      setElapsedSeconds((prev) => prev + 1);
      if (config.mode === 'exam') {
        setRemainingSeconds((prev) => Math.max(0, prev - 1));
      }
    }, 1000);
    return () => window.clearInterval(timer);
  }, [config, mcqSubmitted, theorySaved]);

  const isSessionCompleted =
    !config ||
    (config.paperType === 'mcq' && mcqSubmitted) ||
    (config.paperType === 'theory' && theorySaved);

  const tickSpec = config
    ? evaluateExamTick({
        mode: config.mode,
        remainingSeconds,
        isCompleted: isSessionCompleted,
        isMuted: isTickMuted,
      })
    : evaluateExamTick({
        mode: 'study',
        remainingSeconds: 0,
        isCompleted: true,
        isMuted: true,
      });

  // Trigger subtle chronograph tick on each countdown second during the last 5 minutes
  useEffect(() => {
    const prev = prevRemainingRef.current;
    prevRemainingRef.current = remainingSeconds;
    if (elapsedSeconds === 0 || prev === null || remainingSeconds >= prev) return;
    if (!config || config.mode !== 'exam' || isSessionCompleted) return;

    if (remainingSeconds === 0 && !isTickMuted) {
      playExamTimeUpChime();
      return;
    }
    const tickEval = evaluateExamTick({
      mode: config.mode,
      remainingSeconds,
      isCompleted: isSessionCompleted,
      isMuted: isTickMuted,
    });
    if (tickEval.shouldTick) {
      playSubtleExamTick(tickEval);
    }
  }, [remainingSeconds, elapsedSeconds, config, isSessionCompleted, isTickMuted]);

  if (!config || (config.paperType === 'mcq' && mcqSession.length === 0) || (config.paperType === 'theory' && theorySession.length === 0)) {
    return (
      <div className="rounded-2xl bg-slate-900/80 border border-slate-800/80 p-10 text-center max-w-2xl mx-auto space-y-4">
        <div className="w-12 h-12 rounded-2xl bg-cyan-500/15 border border-cyan-500/30 text-cyan-400 flex items-center justify-center mx-auto">
          <GraduationCap className="w-6 h-6" />
        </div>
        <h2 className="font-display text-2xl font-bold text-white">
          WASSCE Paper 1 &amp; Paper 2 Exam Simulator
        </h2>
        <p className="text-sm text-slate-400 leading-relaxed">
          Configure a custom WASSCE drill by subject, SHS grade level, syllabus topics, Paper 1 (MCQ) or Paper 2 (Structured Theory), and exact question count.
        </p>
        <button
          type="button"
          onClick={onOpenConfig}
          className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-semibold text-sm transition-colors"
        >
          <SlidersHorizontal className="w-4 h-4" />
          <span>Configure New Test</span>
        </button>
      </div>
    );
  }

  const subjectInfo = SUBJECTS[config.subject];

  // ==========================
  // PAPER 1: MCQ VIEW
  // ==========================
  if (config.paperType === 'mcq') {
    const activeQ = mcqSession[currentIdx];
    const selectedOpt = mcqAnswers[currentIdx] ?? null;
    const isRevealed = mcqSubmitted || (config.mode === 'study' && Boolean(revealedQuestions[currentIdx]));
    const graded = mcqSubmitted ? gradeMCQSession(mcqSession, mcqAnswers) : null;

    const handleSelectOption = (optIdx: number) => {
      if (mcqSubmitted) return;
      if (config.mode === 'exam') unlockExamAudioContext();
      setMcqAnswers((prev) => ({ ...prev, [currentIdx]: optIdx }));
      if (config.mode === 'study') {
        setRevealedQuestions((prev) => ({ ...prev, [currentIdx]: true }));
      }
    };

    const handleSubmitMCQ = () => {
      const result = gradeMCQSession(mcqSession, mcqAnswers);
      setMcqSubmitted(true);
      const uniqueTopics = Array.from(new Set(mcqSession.map((q) => q.topicTitle)));
      onCompleteMCQ(
        {
          id: `att-${Date.now()}`,
          timestamp: new Date().toISOString(),
          subject: config.subject,
          gradeFilter: config.gradeFilter,
          paperType: 'mcq',
          mode: config.mode,
          topicTitles: uniqueTopics.slice(0, 3),
          totalQuestions: mcqSession.length,
          score: result.score,
          maxScore: result.maxScore,
          percentage: result.percentage,
          durationSeconds: Math.max(10, elapsedSeconds),
          mcqRecords: result.records,
        },
        mcqSession,
        result.records
      );
    };

    return (
      <div className="space-y-6">
        {/* Exam Top Control Bar */}
        <div className="rounded-2xl bg-slate-900/85 border border-slate-800/80 p-4 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3 text-xs sm:text-sm">
            <span className={`font-bold ${subjectInfo.textClass}`}>{subjectInfo.name}</span>
            <span className="text-slate-600" aria-hidden="true">·</span>
            <span className="text-slate-300">Paper 1 (MCQ)</span>
            <span className="text-slate-600" aria-hidden="true">·</span>
            <span className="text-slate-400">
              {config.mode === 'exam' ? 'Timed Exam' : 'Study Mode'}
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-2 sm:gap-3 tabular-nums">
            <div
              data-testid="exam-timer-pill"
              data-urgency={tickSpec.urgencyLevel}
              data-tick-active={String(tickSpec.shouldTick)}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-mono transition-colors ${
                tickSpec.urgencyLevel === 'critical'
                  ? 'bg-rose-500/15 border-rose-500/50 text-rose-200'
                  : tickSpec.urgencyLevel === 'warning'
                  ? 'bg-amber-500/12 border-amber-500/45 text-amber-200'
                  : 'bg-slate-950 border-slate-800 text-slate-200'
              }`}
            >
              <Clock
                className={`w-3.5 h-3.5 ${
                  tickSpec.urgencyLevel === 'critical'
                    ? 'text-rose-400'
                    : tickSpec.urgencyLevel === 'warning'
                    ? 'text-amber-400'
                    : 'text-cyan-400'
                }`}
              />
              <span>
                {config.mode === 'exam'
                  ? `Left ${formatDurationClock(remainingSeconds)}`
                  : `Elapsed ${formatDurationClock(elapsedSeconds)}`}
              </span>
              {tickSpec.isFinalFiveMinutes && (
                <span
                  className={`ml-1 px-1.5 py-0.5 rounded text-[10px] font-sans font-semibold ${
                    tickSpec.isFinalMinute
                      ? 'bg-rose-500/25 text-rose-200'
                      : 'bg-amber-500/20 text-amber-200'
                  }`}
                >
                  {tickSpec.isFinalMinute ? '<1m' : 'Final 5m'}
                </span>
              )}
            </div>

            {config.mode === 'exam' && !mcqSubmitted && (
              <button
                type="button"
                onClick={() => {
                  unlockExamAudioContext();
                  setIsTickMuted((prev) => !prev);
                }}
                aria-label={
                  isTickMuted
                    ? 'Unmute final 5-minute countdown tick'
                    : 'Mute final 5-minute countdown tick'
                }
                aria-pressed={isTickMuted}
                title={
                  isTickMuted
                    ? 'Countdown tick muted (click to unmute)'
                    : tickSpec.isFinalFiveMinutes
                    ? 'Subtle countdown tick active (click to mute)'
                    : 'Subtle countdown tick begins automatically at 05:00 remaining'
                }
                className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border text-xs font-medium transition-colors whitespace-nowrap ${
                  isTickMuted
                    ? 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
                    : tickSpec.isFinalFiveMinutes
                    ? 'bg-amber-500/12 border-amber-500/40 text-amber-200 hover:bg-amber-500/20'
                    : 'bg-slate-950 border-slate-800 text-slate-300 hover:text-white'
                }`}
              >
                {isTickMuted ? (
                  <VolumeX className="w-3.5 h-3.5" />
                ) : (
                  <Volume2 className="w-3.5 h-3.5" />
                )}
                <span className="hidden sm:inline">
                  {isTickMuted ? 'Muted' : tickSpec.isFinalFiveMinutes ? 'Ticking' : 'Tick Audio'}
                </span>
              </button>
            )}

            {!mcqSubmitted ? (
              <button
                type="button"
                onClick={handleSubmitMCQ}
                className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold transition-colors whitespace-nowrap"
              >
                Submit Paper 1
              </button>
            ) : (
              <button
                type="button"
                onClick={onOpenConfig}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-bold transition-colors whitespace-nowrap"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>New Test</span>
              </button>
            )}
          </div>
        </div>

        {/* Post-Submit Score Summary Banner */}
        {mcqSubmitted && graded && (
          <div className="rounded-2xl bg-slate-900 border border-emerald-500/30 p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="text-xs font-semibold text-emerald-400">Paper 1 Assessment Graded</div>
              <div className="font-display text-2xl font-bold text-white tabular-nums mt-0.5">
                Score: {graded.score} / {graded.maxScore} ({graded.percentage}%)
              </div>
              <p className="text-xs text-slate-400 mt-1">
                Missed questions have been automatically saved to your Mistake Bank for targeted revision.
              </p>
            </div>
            <div className="text-xs text-slate-300 tabular-nums">
              Time taken: {formatDurationClock(elapsedSeconds)}
            </div>
          </div>
        )}

        {/* Question Navigator Pills */}
        <div className="flex flex-wrap gap-1.5" role="navigation" aria-label="Question navigator">
          {mcqSession.map((_, idx) => {
            const ans = mcqAnswers[idx];
            const answered = ans !== undefined && ans !== null;
            const isCurrent = idx === currentIdx;
            const isRight = mcqSubmitted && ans === mcqSession[idx].correctIndex;
            const isWrong = mcqSubmitted && ans !== mcqSession[idx].correctIndex;

            let btnStyle = 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white';
            if (isRight) btnStyle = 'bg-emerald-500/20 border-emerald-500/50 text-emerald-300';
            else if (isWrong) btnStyle = 'bg-rose-500/20 border-rose-500/50 text-rose-300';
            else if (answered) btnStyle = 'bg-cyan-500/20 border-cyan-500/40 text-cyan-200';

            return (
              <button
                key={idx}
                type="button"
                onClick={() => setCurrentIdx(idx)}
                aria-label={`Question ${idx + 1}`}
                aria-current={isCurrent ? 'step' : undefined}
                className={`w-9 h-9 rounded-lg border text-xs font-mono font-semibold tabular-nums transition-all ${btnStyle} ${
                  isCurrent ? 'ring-2 ring-cyan-400 ring-offset-1 ring-offset-slate-950' : ''
                }`}
              >
                {idx + 1}
              </button>
            );
          })}
        </div>

        {/* Active MCQ Card */}
        <div className="rounded-2xl bg-slate-900/90 border border-slate-800/90 p-6 space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-slate-400">
            <span>
              Question {currentIdx + 1} of {mcqSession.length} · {activeQ.grade} · {activeQ.topicTitle}
            </span>
            <div className="flex items-center gap-2.5">
              <span className="font-mono text-slate-500">{activeQ.yearTag}</span>
              <button
                type="button"
                onClick={() =>
                  onAskQuestionHint({
                    id: activeQ.id,
                    paperType: 'mcq',
                    subject: activeQ.subject,
                    grade: activeQ.grade,
                    topicId: activeQ.topicId,
                    topicTitle: activeQ.topicTitle,
                    prompt: activeQ.prompt,
                    options: activeQ.options,
                    selectedOptionIndex: selectedOpt,
                    isSubmitted: isRevealed,
                  })
                }
                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-cyan-500/12 hover:bg-cyan-500/20 border border-cyan-500/30 text-cyan-300 font-semibold transition-colors"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>AI Hint</span>
              </button>
            </div>
          </div>

          <div className="text-base sm:text-lg font-medium text-white leading-relaxed">
            <MathText text={activeQ.prompt} />
          </div>

          <div className="space-y-3" role="radiogroup" aria-label={`Options for question ${currentIdx + 1}`}>
            {activeQ.options.map((opt, optIdx) => {
              const isSelected = selectedOpt === optIdx;
              const isCorrectOpt = optIdx === activeQ.correctIndex;

              let rowClass =
                'bg-slate-950/70 border-slate-800 text-slate-200 hover:border-slate-600';
              if (isRevealed) {
                if (isCorrectOpt) {
                  rowClass = 'bg-emerald-500/12 border-emerald-500/50 text-emerald-100';
                } else if (isSelected && !isCorrectOpt) {
                  rowClass = 'bg-rose-500/12 border-rose-500/50 text-rose-100';
                } else {
                  rowClass = 'bg-slate-950/50 border-slate-800/70 text-slate-400';
                }
              } else if (isSelected) {
                rowClass = 'bg-cyan-500/15 border-cyan-400 text-white';
              }

              return (
                <button
                  key={optIdx}
                  type="button"
                  role="radio"
                  aria-checked={isSelected}
                  onClick={() => handleSelectOption(optIdx)}
                  className={`w-full flex items-start gap-3.5 p-4 rounded-xl border text-left transition-colors ${rowClass}`}
                >
                  <span className="w-7 h-7 rounded-lg bg-slate-900 border border-slate-700 flex items-center justify-center text-xs font-mono font-bold shrink-0">
                    {OPTION_LETTERS[optIdx]}
                  </span>
                  <div className="flex-1 text-sm leading-relaxed pt-0.5">
                    <MathText text={opt} />
                  </div>
                  {isRevealed && isCorrectOpt && (
                    <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                  )}
                  {isRevealed && isSelected && !isCorrectOpt && (
                    <XCircle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
                  )}
                </button>
              );
            })}
          </div>

          {/* Detailed Step-by-Step Workings & Per-Option Distractor Explanations */}
          {isRevealed && (
            <div className="rounded-xl bg-slate-950 border border-slate-800 p-5 space-y-4">
              <div>
                <div className="text-xs font-semibold text-cyan-400 mb-1.5">
                  Step-by-Step Formula &amp; Workings
                </div>
                <div className="text-sm text-slate-200 leading-relaxed">
                  <MathText text={activeQ.stepByStepWorkings} />
                </div>
              </div>

              <div className="pt-3 border-t border-slate-800/80 space-y-2">
                <div className="text-xs font-semibold text-slate-300">
                  Option-by-Option Breakdown
                </div>
                <ul className="space-y-2">
                  {activeQ.optionExplanations.map((exp, idx) => {
                    const isRight = idx === activeQ.correctIndex;
                    return (
                      <li
                        key={idx}
                        className={`text-xs leading-relaxed p-2.5 rounded-lg border ${
                          isRight
                            ? 'bg-emerald-500/8 border-emerald-500/25 text-emerald-200'
                            : 'bg-slate-900/70 border-slate-800/80 text-slate-400'
                        }`}
                      >
                        <span className="font-mono font-bold mr-2">[{OPTION_LETTERS[idx]}]</span>
                        <MathText text={exp} />
                      </li>
                    );
                  })}
                </ul>
              </div>
            </div>
          )}

          {/* Previous / Next Footer */}
          <div className="flex items-center justify-between pt-2 border-t border-slate-800">
            <button
              type="button"
              disabled={currentIdx === 0}
              onClick={() => setCurrentIdx((i) => Math.max(0, i - 1))}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 disabled:opacity-40 text-xs font-medium text-white transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Previous</span>
            </button>

            <button
              type="button"
              disabled={currentIdx === mcqSession.length - 1}
              onClick={() => setCurrentIdx((i) => Math.min(mcqSession.length - 1, i + 1))}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 disabled:opacity-40 text-xs font-medium text-white transition-colors"
            >
              <span>Next</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ==========================
  // PAPER 2: THEORY ESSAY VIEW
  // ==========================
  const activeTheory = theorySession[currentIdx] ?? theorySession[0];

  const handleInsertSymbol = (key: string, symbol: string) => {
    const el = textareaRefs.current[key];
    const currentVal = theoryTexts[key] ?? '';
    const start = el?.selectionStart ?? currentVal.length;
    const end = el?.selectionEnd ?? currentVal.length;
    const { nextValue, nextCursor } = insertSymbolAtCursor(currentVal, symbol, start, end);
    setTheoryTexts((prev) => ({ ...prev, [key]: nextValue }));
    window.requestAnimationFrame(() => {
      if (el) {
        el.focus();
        el.setSelectionRange(nextCursor, nextCursor);
      }
    });
  };

  const handleSaveSelfGrade = () => {
    const allParts: TheoryPartSelfGrade[][] = theorySession.map((tq, qIdx) =>
      tq.parts.map((part, pIdx) => {
        const key = `${qIdx}-${pIdx}`;
        return {
          partLabel: part.label,
          responseText: theoryTexts[key] ?? '',
          awardedMarks: theorySelfMarks[key] ?? 0,
          maxMarks: part.marks,
        };
      })
    );
    const result = gradeTheorySession(allParts);
    setTheorySaved(true);
    onCompleteTheory({
      id: `att-${Date.now()}`,
      timestamp: new Date().toISOString(),
      subject: config.subject,
      gradeFilter: config.gradeFilter,
      paperType: 'theory',
      mode: config.mode,
      topicTitles: theorySession.map((t) => t.topicTitle),
      totalQuestions: theorySession.length,
      score: result.score,
      maxScore: result.maxScore,
      percentage: result.percentage,
      durationSeconds: Math.max(30, elapsedSeconds),
      theoryRecords: theorySession.map((tq, qIdx) => ({
        questionId: tq.id,
        parts: allParts[qIdx],
      })),
    });
  };

  return (
    <div className="space-y-6">
      <div className="rounded-2xl bg-slate-900/85 border border-slate-800/80 p-4 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3 text-xs sm:text-sm">
          <span className={`font-bold ${subjectInfo.textClass}`}>{subjectInfo.name}</span>
          <span className="text-slate-600" aria-hidden="true">·</span>
          <span className="text-slate-300">Paper 2 (Structured Theory)</span>
          <span className="text-slate-600" aria-hidden="true">·</span>
          <span className="text-slate-400">Question {currentIdx + 1} of {theorySession.length}</span>
        </div>

        <div className="flex flex-wrap items-center gap-2 sm:gap-3 tabular-nums">
          <div
            data-testid="exam-timer-pill"
            data-urgency={tickSpec.urgencyLevel}
            data-tick-active={String(tickSpec.shouldTick)}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-mono transition-colors ${
              tickSpec.urgencyLevel === 'critical'
                ? 'bg-rose-500/15 border-rose-500/50 text-rose-200'
                : tickSpec.urgencyLevel === 'warning'
                ? 'bg-amber-500/12 border-amber-500/45 text-amber-200'
                : 'bg-slate-950 border-slate-800 text-slate-200'
            }`}
          >
            <Clock
              className={`w-3.5 h-3.5 ${
                tickSpec.urgencyLevel === 'critical'
                  ? 'text-rose-400'
                  : tickSpec.urgencyLevel === 'warning'
                  ? 'text-amber-400'
                  : 'text-violet-400'
              }`}
            />
            <span>
              {config.mode === 'exam'
                ? `Left ${formatDurationClock(remainingSeconds)}`
                : `Elapsed ${formatDurationClock(elapsedSeconds)}`}
            </span>
            {tickSpec.isFinalFiveMinutes && (
              <span
                className={`ml-1 px-1.5 py-0.5 rounded text-[10px] font-sans font-semibold ${
                  tickSpec.isFinalMinute
                    ? 'bg-rose-500/25 text-rose-200'
                    : 'bg-amber-500/20 text-amber-200'
                }`}
              >
                {tickSpec.isFinalMinute ? '<1m' : 'Final 5m'}
              </span>
            )}
          </div>

          {config.mode === 'exam' && !theorySaved && (
            <button
              type="button"
              onClick={() => {
                unlockExamAudioContext();
                setIsTickMuted((prev) => !prev);
              }}
              aria-label={
                isTickMuted
                  ? 'Unmute final 5-minute countdown tick'
                  : 'Mute final 5-minute countdown tick'
              }
              aria-pressed={isTickMuted}
              title={
                isTickMuted
                  ? 'Countdown tick muted (click to unmute)'
                  : tickSpec.isFinalFiveMinutes
                  ? 'Subtle countdown tick active (click to mute)'
                  : 'Subtle countdown tick begins automatically at 05:00 remaining'
              }
              className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border text-xs font-medium transition-colors whitespace-nowrap ${
                isTickMuted
                  ? 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
                  : tickSpec.isFinalFiveMinutes
                  ? 'bg-amber-500/12 border-amber-500/40 text-amber-200 hover:bg-amber-500/20'
                  : 'bg-slate-950 border-slate-800 text-slate-300 hover:text-white'
              }`}
            >
              {isTickMuted ? (
                <VolumeX className="w-3.5 h-3.5" />
              ) : (
                <Volume2 className="w-3.5 h-3.5" />
              )}
              <span className="hidden sm:inline">
                {isTickMuted ? 'Muted' : tickSpec.isFinalFiveMinutes ? 'Ticking' : 'Tick Audio'}
              </span>
            </button>
          )}

          {!theoryRevealed ? (
            <button
              type="button"
              onClick={() => setTheoryRevealed(true)}
              className="px-4 py-2 rounded-xl bg-violet-500 hover:bg-violet-400 text-white text-xs font-bold transition-colors whitespace-nowrap"
            >
              Submit &amp; Reveal Marking Scheme
            </button>
          ) : !theorySaved ? (
            <button
              type="button"
              onClick={handleSaveSelfGrade}
              className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold transition-colors whitespace-nowrap"
            >
              Save Self-Graded Score
            </button>
          ) : (
            <button
              type="button"
              onClick={onOpenConfig}
              className="px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-bold transition-colors whitespace-nowrap"
            >
              New Assessment
            </button>
          )}
        </div>
      </div>

      {theorySession.length > 1 && (
        <div className="flex flex-wrap gap-2">
          {theorySession.map((tq, idx) => (
            <button
              key={tq.id}
              type="button"
              onClick={() => setCurrentIdx(idx)}
              className={`px-3.5 py-2 rounded-xl border text-xs font-semibold transition-colors ${
                idx === currentIdx
                  ? 'bg-violet-500/20 border-violet-400 text-violet-200'
                  : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              Essay {idx + 1}: {tq.title}
            </button>
          ))}
        </div>
      )}

      {theorySaved && (
        <div className="rounded-2xl bg-slate-900 border border-emerald-500/30 p-5">
          <div className="text-xs font-semibold text-emerald-400">Paper 2 Self-Evaluation Recorded</div>
          <div className="font-display text-xl font-bold text-white mt-1 tabular-nums">
            Your self-graded score has been logged to Analytics &amp; History.
          </div>
        </div>
      )}

      <div className="rounded-2xl bg-slate-900/90 border border-slate-800/90 p-6 space-y-6">
        <div className="space-y-2 border-b border-slate-800 pb-4">
          <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-slate-400">
            <span>{activeTheory.yearTag} · {activeTheory.grade} · {activeTheory.topicTitle}</span>
            <div className="flex items-center gap-2.5">
              <span className="font-mono font-semibold text-violet-300">[{activeTheory.totalMarks} marks total]</span>
              <button
                type="button"
                onClick={() =>
                  onAskQuestionHint({
                    id: activeTheory.id,
                    paperType: 'theory',
                    subject: activeTheory.subject,
                    grade: activeTheory.grade,
                    topicId: activeTheory.topicId,
                    topicTitle: activeTheory.topicTitle,
                    prompt: `${activeTheory.title}: ${activeTheory.contextPrompt}`,
                    isSubmitted: theoryRevealed,
                    subPartsSummary: activeTheory.parts
                      .map((p) => `${p.label} (${p.marks} marks): ${p.prompt}`)
                      .join('\n'),
                  })
                }
                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-cyan-500/12 hover:bg-cyan-500/20 border border-cyan-500/30 text-cyan-300 font-semibold transition-colors"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>AI Hint</span>
              </button>
            </div>
          </div>
          <h3 className="font-display text-xl font-bold text-white">{activeTheory.title}</h3>
          <p className="text-sm text-slate-200 leading-relaxed">
            <MathText text={activeTheory.contextPrompt} />
          </p>
        </div>

        <div className="space-y-8">
          {activeTheory.parts.map((part, pIdx) => {
            const key = `${currentIdx}-${pIdx}`;
            const val = theoryTexts[key] ?? '';
            const awarded = theorySelfMarks[key] ?? 0;

            return (
              <div key={key} className="space-y-3">
                <div className="flex items-start justify-between gap-4">
                  <div className="text-sm sm:text-base font-medium text-white leading-relaxed">
                    <span className="font-mono font-bold text-violet-300 mr-2">{part.label}</span>
                    <MathText text={part.prompt} />
                  </div>
                  <span className="text-xs font-mono text-slate-400 shrink-0 tabular-nums">
                    [{part.marks} marks]
                  </span>
                </div>

                <div>
                  <label htmlFor={`theory-input-${key}`} className="sr-only">
                    Answer workspace for part {part.label}
                  </label>
                  <textarea
                    id={`theory-input-${key}`}
                    ref={(el) => {
                      textareaRefs.current[key] = el;
                    }}
                    rows={5}
                    value={val}
                    onChange={(e) => setTheoryTexts((prev) => ({ ...prev, [key]: e.target.value }))}
                    placeholder="Write your full workings, formulas, and explanations here..."
                    className="w-full p-4 rounded-xl bg-slate-950 border border-slate-800 text-sm text-slate-100 placeholder:text-slate-600 font-mono leading-relaxed focus:outline-none focus:border-violet-400"
                  />

                  {/* Quick-Insert Math & Science Symbol Toolbar */}
                  <div className="flex flex-wrap items-center gap-1.5 mt-2">
                    <span className="text-[11px] text-slate-500 mr-1">Insert symbol:</span>
                    {SYMBOL_TOOLBAR.map((sym) => (
                      <button
                        key={sym}
                        type="button"
                        onClick={() => handleInsertSymbol(key, sym)}
                        aria-label={`Insert ${sym} into part ${part.label}`}
                        className="px-2.5 py-1 rounded-lg bg-slate-800/90 hover:bg-slate-700 text-xs font-mono text-slate-200 transition-colors"
                      >
                        {sym}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Official Marking Scheme Reveal + Self-Grade Control */}
                {theoryRevealed && (
                  <div className="rounded-xl bg-slate-950 border border-violet-500/30 p-4 space-y-3">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <span className="text-xs font-semibold text-violet-300">
                        Official WASSCE Marking Scheme
                      </span>
                      <div className="flex items-center gap-2 text-xs tabular-nums">
                        <label htmlFor={`self-mark-${key}`} className="text-slate-300">
                          Self-grade (0–{part.marks}):
                        </label>
                        <input
                          id={`self-mark-${key}`}
                          type="number"
                          min={0}
                          max={part.marks}
                          step={0.5}
                          disabled={theorySaved}
                          value={awarded}
                          onChange={(e) =>
                            setTheorySelfMarks((prev) => ({
                              ...prev,
                              [key]: Math.max(0, Math.min(part.marks, Number(e.target.value) || 0)),
                            }))
                          }
                          className="w-16 px-2 py-1 rounded-lg bg-slate-900 border border-slate-700 text-center text-white font-mono"
                        />
                      </div>
                    </div>

                    <div className="text-sm text-slate-200 leading-relaxed">
                      <MathText text={part.markingScheme} />
                    </div>

                    <div className="pt-2 border-t border-slate-800/80">
                      <div className="text-[11px] font-semibold text-slate-400 mb-1">
                        Key Scoring Points:
                      </div>
                      <ul className="space-y-1">
                        {part.keyScoringPoints.map((pt, idx) => (
                          <li key={idx} className="text-xs text-emerald-300 flex items-start gap-2">
                            <CheckCircle2 className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                            <MathText text={pt} />
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
