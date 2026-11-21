import React, { useEffect, useMemo, useState } from 'react';
import {
  Award,
  Bot,
  CheckCircle2,
  Clock,
  Flame,
  Play,
  RotateCcw,
  Sparkles,
  Trophy,
  XCircle,
  Zap,
} from 'lucide-react';
import { getCachedMcqsForSubject, loadMcqsForSubject } from '../data/curriculumLoader';
import { SUBJECTS, SUBJECT_LIST } from '../data/subjects';
import type {
  AIOpponentProfile,
  CompetitionMatchRecord,
  GradeFilter,
  MCQAnswerRecord,
  MCQQuestion,
  SubjectId,
} from '../types';
import {
  AI_RIVALS,
  buildCompetitionDeck,
  computeCompetitionSummary,
  scoreStudentTurn,
  simulateAiOpponentTurn,
} from '../utils/competitionsEngine';
import { getGradeDisplayLabel } from '../utils/personalization';
import { MathText } from './MathText';

interface CompetitionsArenaViewProps {
  defaultSubject: SubjectId;
  defaultGrade?: GradeFilter;
  matchHistory: CompetitionMatchRecord[];
  onFinishMatch: (
    record: CompetitionMatchRecord,
    questions: MCQQuestion[],
    answerRecords: MCQAnswerRecord[]
  ) => void;
  onAskTutorAboutQuestion: (prompt: string) => void;
}

type ArenaPhase = 'lobby' | 'live' | 'summary';

export const CompetitionsArenaView: React.FC<CompetitionsArenaViewProps> = ({
  defaultSubject,
  defaultGrade = 'ALL',
  matchHistory,
  onFinishMatch,
  onAskTutorAboutQuestion,
}) => {
  const [subject, setSubject] = useState<SubjectId>(defaultSubject);
  const [gradeFilter, setGradeFilter] = useState<GradeFilter>(defaultGrade);
  const [opponentId, setOpponentId] = useState<string>(AI_RIVALS[1].id);
  const [questionCount, setQuestionCount] = useState<5 | 8 | 10>(5);

  const [phase, setPhase] = useState<ArenaPhase>('lobby');
  const [deck, setDeck] = useState<MCQQuestion[]>([]);
  const [qIndex, setQIndex] = useState(0);
  const [selectedOpt, setSelectedOpt] = useState<number | null>(null);
  const [studentScore, setStudentScore] = useState(0);
  const [aiScore, setAiScore] = useState(0);
  const [studentStreak, setStudentStreak] = useState(0);
  const [answerRecords, setAnswerRecords] = useState<MCQAnswerRecord[]>([]);
  const [lastAiTurnInfo, setLastAiTurnInfo] = useState<{
    isCorrect: boolean;
    pointsAwarded: number;
    thinkMs: number;
  } | null>(null);

  const [questionStartMs, setQuestionStartMs] = useState<number>(Date.now());
  const [matchStartMs, setMatchStartMs] = useState<number>(Date.now());
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [lastMatchRecord, setLastMatchRecord] = useState<CompetitionMatchRecord | null>(null);

  const [isLoadingDeck, setIsLoadingDeck] = useState(false);

  const activeOpponent: AIOpponentProfile =
    AI_RIVALS.find((r) => r.id === opponentId) ?? AI_RIVALS[0];

  const summaryStats = useMemo(
    () => computeCompetitionSummary(matchHistory),
    [matchHistory]
  );

  // Preload active subject MCQs when entering lobby or switching subject
  useEffect(() => {
    void loadMcqsForSubject(subject);
  }, [subject]);

  useEffect(() => {
    if (phase !== 'live') return;
    const id = window.setInterval(() => {
      setElapsedSeconds(Math.floor((Date.now() - matchStartMs) / 1000));
    }, 500);
    return () => window.clearInterval(id);
  }, [phase, matchStartMs]);

  const handleStartMatch = async () => {
    const seed = Date.now() % 100000;
    let pool = getCachedMcqsForSubject(subject);
    if (!pool) {
      setIsLoadingDeck(true);
      try {
        pool = await loadMcqsForSubject(subject);
      } finally {
        setIsLoadingDeck(false);
      }
    }
    const built = buildCompetitionDeck(pool, subject, gradeFilter, questionCount, seed);
    if (built.length === 0) return;

    setDeck(built);
    setQIndex(0);
    setSelectedOpt(null);
    setStudentScore(0);
    setAiScore(0);
    setStudentStreak(0);
    setAnswerRecords([]);
    setLastAiTurnInfo(null);
    setLastMatchRecord(null);
    const now = Date.now();
    setMatchStartMs(now);
    setQuestionStartMs(now);
    setElapsedSeconds(0);
    setPhase('live');
  };

  const currentQuestion = deck[qIndex] ?? null;

  const handleChooseOption = (optIndex: number) => {
    if (!currentQuestion || selectedOpt !== null) return;
    const isCorrect = optIndex === currentQuestion.correctIndex;
    const elapsedMs = Math.max(400, Date.now() - questionStartMs);
    const turn = scoreStudentTurn({
      isCorrect,
      elapsedMs,
      currentStreak: studentStreak,
    });
    const aiTurn = simulateAiOpponentTurn(activeOpponent, qIndex, matchStartMs % 997);

    setSelectedOpt(optIndex);
    setStudentScore((s) => s + turn.pointsAwarded);
    setAiScore((s) => s + aiTurn.pointsAwarded);
    setStudentStreak(turn.nextStreak);
    setLastAiTurnInfo(aiTurn);
    setAnswerRecords((prev) => [
      ...prev,
      {
        questionId: currentQuestion.id,
        selectedIndex: optIndex,
        correctIndex: currentQuestion.correctIndex,
        isCorrect,
      },
    ]);
  };

  const handleAdvanceQuestion = () => {
    if (qIndex < deck.length - 1) {
      setQIndex((i) => i + 1);
      setSelectedOpt(null);
      setLastAiTurnInfo(null);
      setQuestionStartMs(Date.now());
      return;
    }

    const correctCount = answerRecords.filter((r) => r.isCorrect).length;
    const accuracyPct = Math.round((correctCount / Math.max(1, deck.length)) * 100);
    const durationSeconds = Math.max(1, Math.round((Date.now() - matchStartMs) / 1000));
    const record: CompetitionMatchRecord = {
      id: `comp-${Date.now()}`,
      timestamp: new Date().toISOString(),
      subject,
      gradeFilter,
      aiOpponentId: activeOpponent.id,
      aiOpponentName: activeOpponent.name,
      studentScore,
      aiScore,
      totalQuestions: deck.length,
      correctCount,
      accuracyPct,
      durationSeconds,
      won: studentScore >= aiScore,
    };
    setLastMatchRecord(record);
    setPhase('summary');
    onFinishMatch(record, deck, answerRecords);
  };

  const subInfo = SUBJECTS[subject];

  return (
    <div className="space-y-6" data-testid="competitions-arena-view">
      {/* Header Banner */}
      <section className="rounded-2xl bg-slate-900/90 border border-slate-800/90 p-5 sm:p-6 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div className="space-y-1.5 min-w-0">
          <div className="inline-flex items-center gap-2 text-xs font-semibold text-amber-300">
            <Trophy className="w-4 h-4 shrink-0" />
            <span>GES Subject Challenge · Head-to-Head Against AI Rivals</span>
          </div>
          <h2 className="font-display text-xl sm:text-2xl font-bold text-white tracking-tight">
            AI Academic Competition Arena
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 max-w-2xl leading-relaxed">
            Pick any subject and Grade 10–12 syllabus level, race calibrated AI opponents for speed and streak bonuses, and turn missed rounds directly into guided mastery.
          </p>
        </div>

        <div className="grid grid-cols-3 gap-2.5 shrink-0 text-center tabular-nums">
          <div className="px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800">
            <div className="text-[11px] text-slate-400">Matches</div>
            <div className="text-base font-bold text-white">{summaryStats.totalMatches}</div>
          </div>
          <div className="px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800">
            <div className="text-[11px] text-slate-400">Win Rate</div>
            <div className="text-base font-bold text-emerald-400">{summaryStats.winRatePct}%</div>
          </div>
          <div className="px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800">
            <div className="text-[11px] text-slate-400">Best Score</div>
            <div className="text-base font-bold text-amber-300">{summaryStats.bestScore}</div>
          </div>
        </div>
      </section>

      {phase === 'lobby' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Match Configurator */}
          <section className="lg:col-span-7 rounded-2xl bg-slate-900/90 border border-slate-800 p-5 space-y-5">
            <div className="space-y-2">
              <h3 className="font-display text-sm font-bold text-white">1. Choose Subject Arena</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {SUBJECT_LIST.map((sub) => {
                  const selected = subject === sub.id;
                  return (
                    <button
                      key={sub.id}
                      type="button"
                      data-testid={`comp-subject-${sub.id}`}
                      aria-pressed={selected}
                      onClick={() => setSubject(sub.id)}
                      className={`px-3 py-2 rounded-xl border text-xs font-semibold text-left transition-colors ${
                        selected
                          ? `${sub.bgSoftClass} ${sub.borderClass} ${sub.textClass}`
                          : 'bg-slate-950 border-slate-800 text-slate-300 hover:border-slate-700'
                      }`}
                    >
                      {sub.shortName}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <h3 className="font-display text-sm font-bold text-white">2. Grade Tier (10–12)</h3>
                <div className="grid grid-cols-2 gap-2">
                  {(['ALL', 'SHS1', 'SHS2', 'SHS3'] as GradeFilter[]).map((g) => (
                    <button
                      key={g}
                      type="button"
                      data-testid={`comp-grade-${g}`}
                      aria-pressed={gradeFilter === g}
                      onClick={() => setGradeFilter(g)}
                      className={`px-2.5 py-2 rounded-xl border text-[11px] font-semibold transition-colors ${
                        gradeFilter === g
                          ? 'bg-cyan-500/15 border-cyan-400 text-cyan-200'
                          : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                      }`}
                    >
                      {getGradeDisplayLabel(g)}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <h3 className="font-display text-sm font-bold text-white">3. Round Length</h3>
                <div className="grid grid-cols-3 gap-2">
                  {([5, 8, 10] as const).map((cnt) => (
                    <button
                      key={cnt}
                      type="button"
                      aria-pressed={questionCount === cnt}
                      onClick={() => setQuestionCount(cnt)}
                      className={`py-2 rounded-xl border text-xs font-bold tabular-nums transition-colors ${
                        questionCount === cnt
                          ? 'bg-amber-500/15 border-amber-400 text-amber-200'
                          : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                      }`}
                    >
                      {cnt} Qs
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <h3 className="font-display text-sm font-bold text-white">4. Select AI Rival</h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                {AI_RIVALS.map((rival) => {
                  const selected = opponentId === rival.id;
                  return (
                    <button
                      key={rival.id}
                      type="button"
                      data-testid={`comp-rival-${rival.id}`}
                      aria-pressed={selected}
                      onClick={() => setOpponentId(rival.id)}
                      className={`p-3 rounded-xl border text-left transition-colors space-y-1 ${
                        selected
                          ? 'bg-slate-800 border-amber-400/70'
                          : 'bg-slate-950 border-slate-800 hover:border-slate-700'
                      }`}
                    >
                      <div className="flex items-center justify-between gap-1.5">
                        <span className="font-bold text-xs text-white">{rival.name}</span>
                        <Bot className="w-3.5 h-3.5" style={{ color: rival.avatarColor }} />
                      </div>
                      <div className="text-[11px] font-semibold" style={{ color: rival.avatarColor }}>
                        {rival.tierLabel} · {Math.round(rival.accuracyRate * 100)}% AI
                      </div>
                      <p className="text-[10px] text-slate-400 leading-snug">{rival.tagline}</p>
                    </button>
                  );
                })}
              </div>
            </div>

            <button
              type="button"
              onClick={() => void handleStartMatch()}
              disabled={isLoadingDeck}
              data-testid="comp-start-match-btn"
              className="w-full py-3 rounded-xl bg-amber-500 hover:bg-amber-400 disabled:opacity-60 text-slate-950 font-bold text-sm inline-flex items-center justify-center gap-2 transition-colors shadow-lg"
            >
              <Play className="w-4 h-4 fill-current" />
              <span>
                {isLoadingDeck
                  ? `Loading ${subInfo.shortName} Deck...`
                  : `Challenge ${activeOpponent.name} in ${subInfo.shortName}`}
              </span>
            </button>
          </section>

          {/* Recent Match Leaderboard */}
          <section className="lg:col-span-5 rounded-2xl bg-slate-900/90 border border-slate-800 p-5 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-display text-sm font-bold text-white">Recent AI Matches</h3>
              <span className="text-[11px] text-slate-400">Saved locally &amp; cloud synced</span>
            </div>

            {matchHistory.length === 0 ? (
              <div className="py-12 text-center space-y-2">
                <Award className="w-8 h-8 text-slate-600 mx-auto" />
                <p className="text-xs text-slate-400">
                  No arena matches yet. Launch your first challenge on the left to test your WASSCE speed against an AI rival!
                </p>
              </div>
            ) : (
              <div className="space-y-2 max-h-[420px] overflow-y-auto pr-1">
                {matchHistory.slice(0, 10).map((m) => {
                  const sInfo = SUBJECTS[m.subject];
                  return (
                    <div
                      key={m.id}
                      className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between gap-3 text-xs"
                    >
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <span className={`font-bold ${sInfo?.textClass ?? 'text-cyan-300'}`}>
                            {sInfo?.shortName ?? m.subject}
                          </span>
                          <span className="text-slate-500">vs {m.aiOpponentName}</span>
                        </div>
                        <div className="text-[11px] text-slate-400 tabular-nums mt-0.5">
                          {m.correctCount}/{m.totalQuestions} correct ({m.accuracyPct}%) · {m.durationSeconds}s
                        </div>
                      </div>
                      <div className="text-right shrink-0 tabular-nums">
                        <div
                          className={`text-xs font-bold ${
                            m.won ? 'text-emerald-400' : 'text-rose-300'
                          }`}
                        >
                          {m.won ? 'VICTORY' : 'AI WON'}
                        </div>
                        <div className="font-mono text-[11px] text-slate-200">
                          {m.studentScore} – {m.aiScore}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </section>
        </div>
      )}

      {phase === 'live' && currentQuestion && (
        <section className="rounded-2xl bg-slate-900/95 border border-slate-800 p-5 sm:p-6 space-y-5">
          {/* Live Scoreboard Header */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 items-center pb-4 border-b border-slate-800">
            <div className="p-3 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-between">
              <div>
                <div className="text-[11px] font-semibold text-cyan-300">YOU</div>
                <div className="text-xl font-bold font-mono text-white tabular-nums" data-testid="comp-student-score">
                  {studentScore} pts
                </div>
              </div>
              {studentStreak >= 2 && (
                <div className="inline-flex items-center gap-1 text-xs font-bold text-amber-300">
                  <Flame className="w-4 h-4" />
                  <span>{studentStreak}x</span>
                </div>
              )}
            </div>

            <div className="text-center space-y-1">
              <div className="text-xs font-bold text-slate-300 tabular-nums">
                Round {qIndex + 1} / {deck.length} · {subInfo.shortName}
              </div>
              <div className="inline-flex items-center gap-1.5 text-xs font-mono text-slate-400 tabular-nums">
                <Clock className="w-3.5 h-3.5 text-amber-400" />
                <span>{elapsedSeconds}s elapsed</span>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
              <div>
                <div className="text-[11px] font-semibold" style={{ color: activeOpponent.avatarColor }}>
                  {activeOpponent.name}
                </div>
                <div className="text-xl font-bold font-mono text-white tabular-nums" data-testid="comp-ai-score">
                  {aiScore} pts
                </div>
              </div>
              <Bot className="w-6 h-6" style={{ color: activeOpponent.avatarColor }} />
            </div>
          </div>

          {/* Question Prompt & Options */}
          <div className="space-y-4">
            <div className="flex items-center justify-between gap-2 text-xs text-slate-400">
              <span>
                {currentQuestion.topicTitle} · {getGradeDisplayLabel(currentQuestion.grade)}
              </span>
              <span className="font-mono text-slate-500">{currentQuestion.yearTag}</span>
            </div>

            <div className="text-base sm:text-lg font-semibold text-white leading-relaxed">
              <MathText text={currentQuestion.prompt} />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {currentQuestion.options.map((opt, idx) => {
                const answered = selectedOpt !== null;
                const isCorrect = idx === currentQuestion.correctIndex;
                const isPicked = selectedOpt === idx;

                let cls = 'bg-slate-950 border-slate-800 text-slate-200 hover:border-cyan-400/60';
                if (answered) {
                  if (isCorrect) {
                    cls = 'bg-emerald-500/15 border-emerald-400 text-emerald-100';
                  } else if (isPicked) {
                    cls = 'bg-rose-500/15 border-rose-400 text-rose-100';
                  } else {
                    cls = 'bg-slate-950/60 border-slate-800/60 text-slate-500';
                  }
                }

                return (
                  <button
                    key={idx}
                    type="button"
                    disabled={answered}
                    data-testid={`comp-option-${idx}`}
                    onClick={() => handleChooseOption(idx)}
                    className={`p-3.5 rounded-xl border text-left text-xs sm:text-sm transition-colors flex items-start gap-2.5 ${cls}`}
                  >
                    <span className="font-mono font-bold shrink-0">
                      {String.fromCharCode(65 + idx)}.
                    </span>
                    <span className="flex-1 min-w-0">
                      <MathText text={opt} />
                    </span>
                  </button>
                );
              })}
            </div>

            {selectedOpt !== null && (
              <div className="rounded-xl bg-slate-950 border border-slate-800 p-4 space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
                  <div className="flex items-center gap-2 font-bold">
                    {selectedOpt === currentQuestion.correctIndex ? (
                      <>
                        <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                        <span className="text-emerald-300">Spot on! Speed + streak points banked.</span>
                      </>
                    ) : (
                      <>
                        <XCircle className="w-4 h-4 text-rose-400" />
                        <span className="text-rose-300">
                          Missed — added to your Mistake Bank for mastery review.
                        </span>
                      </>
                    )}
                  </div>
                  {lastAiTurnInfo && (
                    <span className="font-mono text-[11px] text-slate-400 tabular-nums">
                      {activeOpponent.name}: {lastAiTurnInfo.isCorrect ? `+${lastAiTurnInfo.pointsAwarded} pts` : 'Missed (0 pts)'} in {(lastAiTurnInfo.thinkMs / 1000).toFixed(1)}s
                    </span>
                  )}
                </div>

                <div className="text-xs text-slate-300 leading-relaxed">
                  <MathText text={currentQuestion.stepByStepWorkings} />
                </div>

                <div className="flex justify-end">
                  <button
                    type="button"
                    onClick={handleAdvanceQuestion}
                    data-testid="comp-next-btn"
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-bold transition-colors"
                  >
                    <Zap className="w-3.5 h-3.5" />
                    <span>{qIndex < deck.length - 1 ? 'Next Question →' : 'Finish Match & View Scorecard'}</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </section>
      )}

      {phase === 'summary' && lastMatchRecord && (
        <section
          data-testid="comp-match-summary"
          className="rounded-2xl bg-slate-900/95 border border-slate-800 p-6 space-y-5"
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
            <div className="space-y-1">
              <div
                className={`text-xs font-bold uppercase tracking-wider ${
                  lastMatchRecord.won ? 'text-emerald-400' : 'text-amber-300'
                }`}
              >
                {lastMatchRecord.won ? 'Match Victory!' : 'Close Challenge!'}
              </div>
              <h3 className="font-display text-2xl font-bold text-white">
                You {lastMatchRecord.studentScore} — {lastMatchRecord.aiScore} {lastMatchRecord.aiOpponentName}
              </h3>
              <p className="text-xs text-slate-400">
                {subInfo.name} · {getGradeDisplayLabel(lastMatchRecord.gradeFilter)} ·{' '}
                {lastMatchRecord.correctCount}/{lastMatchRecord.totalQuestions} correct ({lastMatchRecord.accuracyPct}%) in {lastMatchRecord.durationSeconds}s
              </p>
            </div>

            <div className="flex flex-wrap gap-2 shrink-0">
              <button
                type="button"
                onClick={handleStartMatch}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold transition-colors"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Play Rematch</span>
              </button>
              <button
                type="button"
                onClick={() => setPhase('lobby')}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition-colors"
              >
                Arena Lobby
              </button>
            </div>
          </div>

          <div className="space-y-2.5">
            <h4 className="font-display text-sm font-bold text-white">Round Breakdown</h4>
            {deck.map((q, idx) => {
              const rec = answerRecords[idx];
              const ok = rec?.isCorrect;
              return (
                <div
                  key={q.id}
                  className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                >
                  <div className="min-w-0 space-y-1">
                    <div className="flex items-center gap-2">
                      {ok ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                      ) : (
                        <XCircle className="w-4 h-4 text-rose-400 shrink-0" />
                      )}
                      <span className="font-semibold text-white">
                        Q{idx + 1}. {q.topicTitle}
                      </span>
                    </div>
                    <div className="text-slate-300 line-clamp-2">
                      <MathText text={q.prompt} />
                    </div>
                  </div>
                  {!ok && (
                    <button
                      type="button"
                      onClick={() =>
                        onAskTutorAboutQuestion(
                          `Explain why the answer to "${q.prompt}" (${subInfo.name}, ${q.topicTitle}) is "${q.options[q.correctIndex]}".`
                        )
                      }
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-violet-500/15 border border-violet-500/40 text-violet-200 hover:bg-violet-500/25 font-semibold shrink-0"
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Coach Me</span>
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        </section>
      )}
    </div>
  );
};
