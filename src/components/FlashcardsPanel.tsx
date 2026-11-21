import React, { useEffect, useMemo, useState } from 'react';
import {
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Layers,
  LayoutGrid,
  RotateCcw,
  Sparkles,
} from 'lucide-react';
import { SUBJECTS, SYLLABUS_TOPICS } from '../data/subjects';
import type {
  FlashcardItem,
  FlashcardProgress,
  FlashcardRating,
  GradeFilter,
  SubjectId,
} from '../types';
import {
  buildDueFlashcardQueue,
  computeFlashcardDeckStats,
  filterFlashcards,
  formatIntervalLabel,
  generateFlashcardsFromTopics,
  previewNextIntervals,
} from '../utils/flashcards';
import { MathText } from './MathText';
import { TopicVisualDiagram } from './TopicVisualDiagram';

interface FlashcardsPanelProps {
  subject: SubjectId;
  gradeFilter: GradeFilter;
  onChangeGradeFilter: (next: GradeFilter) => void;
  progressMap: Record<string, FlashcardProgress>;
  onRateCard: (cardId: string, rating: FlashcardRating) => void;
  onResetDeck: (cardIds: string[]) => void;
  onAskTutorAboutCard: (card: FlashcardItem) => void;
}

const RATING_STYLES: {
  rating: FlashcardRating;
  label: string;
  shortcut: string;
  className: string;
}[] = [
  {
    rating: 'again',
    label: 'Again',
    shortcut: '1',
    className: 'bg-rose-500/12 hover:bg-rose-500/20 border-rose-500/40 text-rose-300',
  },
  {
    rating: 'hard',
    label: 'Hard',
    shortcut: '2',
    className: 'bg-amber-500/12 hover:bg-amber-500/20 border-amber-500/40 text-amber-300',
  },
  {
    rating: 'good',
    label: 'Good',
    shortcut: '3',
    className: 'bg-cyan-500/12 hover:bg-cyan-500/20 border-cyan-500/40 text-cyan-300',
  },
  {
    rating: 'easy',
    label: 'Easy',
    shortcut: '4',
    className: 'bg-emerald-500/12 hover:bg-emerald-500/20 border-emerald-500/40 text-emerald-300',
  },
];

export const FlashcardsPanel: React.FC<FlashcardsPanelProps> = ({
  subject,
  gradeFilter,
  onChangeGradeFilter,
  progressMap,
  onRateCard,
  onResetDeck,
  onAskTutorAboutCard,
}) => {
  const [selectedTopicId, setSelectedTopicId] = useState<string>('ALL');
  const [viewMode, setViewMode] = useState<'study' | 'browse'>('study');
  const [isFlipped, setIsFlipped] = useState(false);
  const [cardIndex, setCardIndex] = useState(0);
  const [focusedCardId, setFocusedCardId] = useState<string | null>(null);

  const allCards = useMemo(() => generateFlashcardsFromTopics(SYLLABUS_TOPICS), []);

  const subjectTopics = useMemo(
    () =>
      SYLLABUS_TOPICS.filter(
        (t) => t.subject === subject && (gradeFilter === 'ALL' || t.grade === gradeFilter)
      ),
    [subject, gradeFilter]
  );

  useEffect(() => {
    setSelectedTopicId('ALL');
    setIsFlipped(false);
    setCardIndex(0);
    setFocusedCardId(null);
  }, [subject, gradeFilter]);

  const deckCards = useMemo(
    () => filterFlashcards(allCards, subject, gradeFilter, selectedTopicId),
    [allCards, subject, gradeFilter, selectedTopicId]
  );

  const nowIso = new Date().toISOString();
  const deckStats = useMemo(
    () => computeFlashcardDeckStats(deckCards, progressMap, nowIso),
    [deckCards, progressMap, nowIso]
  );

  const dueQueue = useMemo(
    () => buildDueFlashcardQueue(deckCards, progressMap, nowIso),
    [deckCards, progressMap, nowIso]
  );

  // Use due queue in study mode; fall back to full deck if user selected a specific card from Browse
  const studyPool = useMemo(() => {
    if (focusedCardId) {
      const target = deckCards.find((c) => c.id === focusedCardId);
      if (target) {
        return [target, ...dueQueue.filter((c) => c.id !== focusedCardId)];
      }
    }
    return dueQueue;
  }, [dueQueue, deckCards, focusedCardId]);

  const safeIndex = studyPool.length > 0 ? Math.min(cardIndex, studyPool.length - 1) : 0;
  const currentCard = studyPool[safeIndex] ?? null;
  const activeSubject = SUBJECTS[subject];

  const handleRate = (rating: FlashcardRating) => {
    if (!currentCard) return;
    onRateCard(currentCard.id, rating);
    setIsFlipped(false);
    setFocusedCardId(null);
    setCardIndex(0);
  };

  useEffect(() => {
    if (viewMode !== 'study' || !currentCard) return;
    const onKeyDown = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement | null)?.tagName;
      if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') return;

      if (e.code === 'Space') {
        e.preventDefault();
        setIsFlipped((prev) => !prev);
      } else if (e.key === 'ArrowRight') {
        setIsFlipped(false);
        setCardIndex((prev) => (prev + 1) % Math.max(1, studyPool.length));
      } else if (e.key === 'ArrowLeft') {
        setIsFlipped(false);
        setCardIndex((prev) => (prev - 1 + studyPool.length) % Math.max(1, studyPool.length));
      } else if (isFlipped) {
        if (e.key === '1') handleRate('again');
        if (e.key === '2') handleRate('hard');
        if (e.key === '3') handleRate('good');
        if (e.key === '4') handleRate('easy');
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  });

  const intervalPreviews = currentCard
    ? previewNextIntervals(progressMap[currentCard.id], currentCard.id, nowIso)
    : null;

  return (
    <div className="space-y-5">
      {/* Top Deck Metrics & Filter Controls */}
      <div className="rounded-2xl bg-slate-900/85 border border-slate-800/90 p-5 space-y-4">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 flex-1">
            <div className="rounded-xl bg-slate-950/75 border border-slate-800/80 px-3.5 py-2.5">
              <div className="text-[11px] text-slate-400">Due Now</div>
              <div className={`text-lg font-bold tabular-nums mt-0.5 ${activeSubject.textClass}`}>
                {deckStats.dueNow}
              </div>
            </div>
            <div className="rounded-xl bg-slate-950/75 border border-slate-800/80 px-3.5 py-2.5">
              <div className="text-[11px] text-slate-400">Learning</div>
              <div className="text-lg font-bold text-amber-300 tabular-nums mt-0.5">
                {deckStats.learning}
              </div>
            </div>
            <div className="rounded-xl bg-slate-950/75 border border-slate-800/80 px-3.5 py-2.5">
              <div className="text-[11px] text-slate-400">Mastered</div>
              <div className="text-lg font-bold text-emerald-300 tabular-nums mt-0.5">
                {deckStats.mastered}
              </div>
            </div>
            <div className="rounded-xl bg-slate-950/75 border border-slate-800/80 px-3.5 py-2.5">
              <div className="text-[11px] text-slate-400">Auto Deck Size</div>
              <div className="text-lg font-bold text-white tabular-nums mt-0.5">
                {deckStats.total}
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 shrink-0">
            <div className="inline-flex p-1 rounded-xl bg-slate-950 border border-slate-800">
              <button
                type="button"
                onClick={() => setViewMode('study')}
                aria-pressed={viewMode === 'study'}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                  viewMode === 'study'
                    ? 'bg-slate-800 text-white'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Layers className="w-3.5 h-3.5" />
                <span>Study Queue</span>
              </button>
              <button
                type="button"
                onClick={() => setViewMode('browse')}
                aria-pressed={viewMode === 'browse'}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                  viewMode === 'browse'
                    ? 'bg-slate-800 text-white'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <LayoutGrid className="w-3.5 h-3.5" />
                <span>Browse All ({deckStats.total})</span>
              </button>
            </div>

            <button
              type="button"
              onClick={() => {
                onResetDeck(deckCards.map((c) => c.id));
                setIsFlipped(false);
                setCardIndex(0);
              }}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-950 hover:bg-slate-800 border border-slate-800 text-xs font-medium text-slate-300 transition-colors"
              title="Reset spaced repetition intervals for this filtered deck"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Deck</span>
            </button>
          </div>
        </div>

        {/* Grade & Unit Filter Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-800/80">
          <div className="flex flex-wrap items-center gap-1.5">
            {(
              [
                { id: 'ALL', label: 'All Forms (SHS 1–3)' },
                { id: 'SHS1', label: 'SHS 1' },
                { id: 'SHS2', label: 'SHS 2' },
                { id: 'SHS3', label: 'SHS 3' },
              ] as const
            ).map((g) => (
              <button
                key={g.id}
                type="button"
                onClick={() => onChangeGradeFilter(g.id)}
                aria-pressed={gradeFilter === g.id}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                  gradeFilter === g.id
                    ? `${activeSubject.bgSoftClass} ${activeSubject.borderClass} ${activeSubject.textClass} border`
                    : 'bg-slate-950 border border-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                {g.label}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <label htmlFor="flashcard-unit-filter" className="text-xs text-slate-400">
              Unit:
            </label>
            <select
              id="flashcard-unit-filter"
              value={selectedTopicId}
              onChange={(e) => {
                setSelectedTopicId(e.target.value);
                setIsFlipped(false);
                setCardIndex(0);
                setFocusedCardId(null);
              }}
              className="px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-xs text-slate-200 max-w-xs focus:outline-none focus:border-cyan-400"
            >
              <option value="ALL">All Units ({subjectTopics.length} units)</option>
              {subjectTopics.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.unitNumber} · {t.grade}: {t.title}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Study Queue Mode */}
      {viewMode === 'study' && (
        <div className="space-y-3.5">
          {!currentCard ? (
            <div className="rounded-2xl bg-slate-900/85 border border-emerald-500/30 p-8 text-center space-y-3">
              <CheckCircle2 className="w-10 h-10 text-emerald-400 mx-auto" />
              <h3 className="font-display text-lg font-bold text-white">
                All due cards reviewed for {activeSubject.name}!
              </h3>
              <p className="text-xs sm:text-sm text-slate-400 max-w-md mx-auto">
                Your SM-2 spaced-repetition queue is clear. Browse all {deckStats.total} auto-generated cards or reset this deck to drill again immediately.
              </p>
              <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setViewMode('browse')}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-white transition-colors"
                >
                  Browse All Cards
                </button>
                <button
                  type="button"
                  onClick={() => onResetDeck(deckCards.map((c) => c.id))}
                  className="px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-bold transition-colors"
                >
                  Practice Deck Again
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-3.5">
              {/* Interactive Flashcard */}
              <div
                role="button"
                tabIndex={0}
                onClick={() => setIsFlipped((prev) => !prev)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    setIsFlipped((prev) => !prev);
                  }
                }}
                aria-label={isFlipped ? 'Flashcard answer revealed. Click to flip to prompt.' : 'Flashcard prompt. Click to reveal answer.'}
                className="w-full text-left rounded-2xl bg-slate-900/90 border border-slate-800 hover:border-slate-700 p-5 sm:p-6 min-h-[215px] flex flex-col justify-between gap-4 cursor-pointer transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex flex-wrap items-center gap-2 text-xs">
                      <span className={`font-mono font-semibold ${activeSubject.textClass}`}>
                        {currentCard.unitNumber} · {currentCard.grade}
                      </span>
                      <span className="text-slate-600" aria-hidden="true">·</span>
                      <span className="text-slate-400 font-medium">{currentCard.frontLabel}</span>
                    </div>
                    <div className="text-xs text-slate-500">{currentCard.topicTitle}</div>
                  </div>

                  <TopicVisualDiagram
                    subject={currentCard.subject}
                    title={currentCard.topicTitle}
                    compact
                  />
                </div>

                {!isFlipped ? (
                  <div className="py-2 space-y-2">
                    <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                      Prompt / Key Term
                    </div>
                    <div className="font-display text-lg sm:text-2xl font-bold text-white leading-snug">
                      <MathText text={currentCard.front} />
                    </div>
                  </div>
                ) : (
                  <div className="py-1 space-y-3 border-t border-slate-800/80 pt-3">
                    <div className="space-y-1">
                      <div className="text-[11px] font-semibold uppercase tracking-wider text-emerald-400">
                        Definition &amp; WASSCE Explanation
                      </div>
                      <div className="text-sm sm:text-base text-slate-100 leading-relaxed whitespace-pre-line">
                        <MathText text={currentCard.back} />
                      </div>
                    </div>

                    {currentCard.formulaHint && (
                      <div className="rounded-xl bg-slate-950/80 border border-slate-800 px-3.5 py-2 text-xs text-cyan-200">
                        <span className="text-slate-400 font-semibold mr-2">Reference:</span>
                        <MathText text={currentCard.formulaHint} />
                      </div>
                    )}
                  </div>
                )}

                <div className="flex flex-wrap items-center justify-between gap-3 pt-2.5 border-t border-slate-800/80 text-xs text-slate-400">
                  <span className="tabular-nums font-mono">
                    Card {safeIndex + 1} of {studyPool.length} in queue
                  </span>
                  <span>
                    {isFlipped
                      ? 'Rate recall confidence below (keys 1–4)'
                      : 'Click card or press Space to reveal answer'}
                  </span>
                </div>
              </div>

              {/* Navigation & Rating Controls */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setIsFlipped(false);
                      setCardIndex(
                        (prev) => (prev - 1 + studyPool.length) % Math.max(1, studyPool.length)
                      );
                    }}
                    className="inline-flex items-center gap-1 px-3 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-xs font-medium text-slate-300 transition-colors"
                  >
                    <ChevronLeft className="w-3.5 h-3.5" />
                    <span>Prev</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setIsFlipped(false);
                      setCardIndex((prev) => (prev + 1) % Math.max(1, studyPool.length));
                    }}
                    className="inline-flex items-center gap-1 px-3 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-xs font-medium text-slate-300 transition-colors"
                  >
                    <span>Skip</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => onAskTutorAboutCard(currentCard)}
                    className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-cyan-500/12 hover:bg-cyan-500/20 border border-cyan-500/30 text-xs font-semibold text-cyan-300 transition-colors"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Ask AI Tutor</span>
                  </button>
                </div>

                {!isFlipped ? (
                  <button
                    type="button"
                    onClick={() => setIsFlipped(true)}
                    className="px-5 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs sm:text-sm transition-colors"
                  >
                    Reveal Answer
                  </button>
                ) : (
                  <div className="grid grid-cols-4 gap-2 flex-1 sm:max-w-lg">
                    {RATING_STYLES.map((item) => (
                      <button
                        key={item.rating}
                        type="button"
                        onClick={() => handleRate(item.rating)}
                        className={`px-2.5 py-2 rounded-xl border text-center transition-colors ${item.className}`}
                      >
                        <div className="text-xs font-bold">{item.label}</div>
                        <div className="text-[11px] opacity-85 font-mono tabular-nums">
                          {intervalPreviews?.[item.rating] ?? ''}
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Browse All Auto-Generated Flashcards Mode */}
      {viewMode === 'browse' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {deckCards.map((card) => {
            const p = progressMap[card.id];
            const statusText = !p
              ? 'New'
              : p.repetitions >= 2 && p.intervalDays >= 6
                ? `Mastered (${formatIntervalLabel(p.intervalDays)})`
                : `Next: ${formatIntervalLabel(p.intervalDays)}`;

            return (
              <div
                key={card.id}
                className="rounded-2xl bg-slate-900/80 border border-slate-800/90 p-4 flex flex-col justify-between gap-3"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between gap-2 text-[11px]">
                    <span className={`font-mono font-semibold ${activeSubject.textClass}`}>
                      {card.unitNumber} · {card.grade} · {card.frontLabel}
                    </span>
                    <span className="text-slate-400 font-mono tabular-nums">{statusText}</span>
                  </div>
                  <div className="text-sm font-bold text-white leading-snug">
                    <MathText text={card.front} />
                  </div>
                  <div className="text-xs text-slate-400 leading-relaxed line-clamp-3">
                    <MathText text={card.back} />
                  </div>
                </div>

                <div className="flex items-center justify-between gap-2 pt-2 border-t border-slate-800/70">
                  <button
                    type="button"
                    onClick={() => onAskTutorAboutCard(card)}
                    className="inline-flex items-center gap-1 text-xs text-cyan-400 hover:text-cyan-300 font-medium"
                  >
                    <Sparkles className="w-3 h-3" />
                    <span>Clarify with AI</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setFocusedCardId(card.id);
                      setCardIndex(0);
                      setIsFlipped(false);
                      setViewMode('study');
                    }}
                    className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-white transition-colors"
                  >
                    Study Card
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
