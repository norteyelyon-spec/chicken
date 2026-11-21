import React, { useMemo, useState } from 'react';
import { BookOpen, CheckCircle2, Clock, FilePlus, GraduationCap, Layers, Play, Sparkles } from 'lucide-react';
import { SUBJECTS, SUBJECT_LIST, SYLLABUS_TOPICS } from '../data/subjects';
import type {
  FlashcardItem,
  FlashcardProgress,
  FlashcardRating,
  GradeFilter,
  GradeLevel,
  SubjectId,
  SyllabusTopic,
} from '../types';
import {
  computeFlashcardDeckStats,
  filterFlashcards,
  generateFlashcardsFromTopics,
} from '../utils/flashcards';
import { FlashcardsPanel } from './FlashcardsPanel';
import { MathText } from './MathText';
import { TopicVisualDiagram } from './TopicVisualDiagram';

interface SubjectsHubProps {
  selectedSubject: SubjectId;
  onSelectSubject: (subject: SubjectId) => void;
  onPracticeTopic: (subject: SubjectId, grade: GradeLevel, topicId: string) => void;
  onCreateNoteForTopic: (topic: SyllabusTopic) => void;
  onAskTutorAboutTopic: (topic: SyllabusTopic) => void;
  onTeachTopic: (topic: SyllabusTopic) => void;
  flashcardProgress: Record<string, FlashcardProgress>;
  onRateFlashcard: (cardId: string, rating: FlashcardRating) => void;
  onResetFlashcardDeck: (cardIds: string[]) => void;
  onAskTutorAboutFlashcard: (card: FlashcardItem) => void;
}

const GRADES: { id: GradeLevel; label: string }[] = [
  { id: 'SHS1', label: 'SHS 1 (Grade 10)' },
  { id: 'SHS2', label: 'SHS 2 (Grade 11)' },
  { id: 'SHS3', label: 'SHS 3 (Grade 12)' },
];

export const SubjectsHub: React.FC<SubjectsHubProps> = ({
  selectedSubject,
  onSelectSubject,
  onPracticeTopic,
  onCreateNoteForTopic,
  onAskTutorAboutTopic,
  onTeachTopic,
  flashcardProgress,
  onRateFlashcard,
  onResetFlashcardDeck,
  onAskTutorAboutFlashcard,
}) => {
  const [hubTab, setHubTab] = useState<'syllabus' | 'flashcards'>('syllabus');
  const [selectedGrade, setSelectedGrade] = useState<GradeLevel>('SHS1');
  const [flashcardGradeFilter, setFlashcardGradeFilter] = useState<GradeFilter>('ALL');

  const activeSubject = SUBJECTS[selectedSubject];
  const electiveSubjects = useMemo(
    () => SUBJECT_LIST.filter((s) => s.category === 'elective'),
    []
  );
  const coreSubjects = useMemo(
    () => SUBJECT_LIST.filter((s) => s.category === 'core'),
    []
  );

  const topics = useMemo(
    () =>
      SYLLABUS_TOPICS.filter(
        (t) => t.subject === selectedSubject && t.grade === selectedGrade
      ),
    [selectedSubject, selectedGrade]
  );

  const allFlashcards = useMemo(() => generateFlashcardsFromTopics(SYLLABUS_TOPICS), []);
  const subjectFlashcardStats = useMemo(() => {
    const cards = filterFlashcards(allFlashcards, selectedSubject, 'ALL');
    return computeFlashcardDeckStats(cards, flashcardProgress, new Date().toISOString());
  }, [allFlashcards, selectedSubject, flashcardProgress]);

  return (
    <div className="space-y-6">
      {/* Grouped Subject Selector Bar */}
      <div className="rounded-2xl bg-slate-900/70 border border-slate-800/80 p-4 space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center gap-2">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 sm:w-28 shrink-0">
            Electives (5)
          </span>
          <div className="flex flex-wrap items-center gap-2">
            {electiveSubjects.map((sub) => {
              const active = sub.id === selectedSubject;
              return (
                <button
                  key={sub.id}
                  type="button"
                  onClick={() => onSelectSubject(sub.id)}
                  aria-pressed={active}
                  className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold border transition-colors whitespace-nowrap ${
                    active
                      ? `${sub.bgSoftClass} ${sub.borderClass} ${sub.textClass}`
                      : 'bg-slate-950/70 border-slate-800 text-slate-400 hover:text-white hover:border-slate-700'
                  }`}
                >
                  {sub.name}
                </button>
              );
            })}
          </div>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center gap-2 pt-2 border-t border-slate-800/70">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 sm:w-28 shrink-0">
            Core WASSCE (4)
          </span>
          <div className="flex flex-wrap items-center gap-2">
            {coreSubjects.map((sub) => {
              const active = sub.id === selectedSubject;
              return (
                <button
                  key={sub.id}
                  type="button"
                  onClick={() => onSelectSubject(sub.id)}
                  aria-pressed={active}
                  className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold border transition-colors whitespace-nowrap ${
                    active
                      ? `${sub.bgSoftClass} ${sub.borderClass} ${sub.textClass}`
                      : 'bg-slate-950/70 border-slate-800 text-slate-400 hover:text-white hover:border-slate-700'
                  }`}
                >
                  {sub.name}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Subject Hero Banner with Bespoke Visual Illustration & Hub Mode Switcher */}
      <div className="rounded-2xl bg-slate-900/85 border border-slate-800/90 overflow-hidden grid grid-cols-1 lg:grid-cols-12">
        <div className="lg:col-span-8 p-5 sm:p-6 flex flex-col justify-between gap-5">
          <div>
            <div className="flex flex-wrap items-center gap-2 text-xs">
              <span className={`font-semibold ${activeSubject.textClass}`}>
                GES WASSCE {activeSubject.category === 'core' ? 'Core' : 'Elective'} Curriculum
              </span>
              <span className="text-slate-600" aria-hidden="true">·</span>
              <span className="text-slate-400 tabular-nums">
                {SYLLABUS_TOPICS.filter((t) => t.subject === selectedSubject).length} SHS 1–3 Units ·{' '}
                {subjectFlashcardStats.total} Flashcards
              </span>
            </div>
            <h2 className="font-display text-2xl sm:text-3xl font-bold text-white mt-1.5">
              {activeSubject.name}
            </h2>
            <p className="text-sm text-slate-400 mt-1.5 max-w-2xl leading-relaxed">
              {activeSubject.description}
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3">
            {/* Syllabus Units vs Flashcards Tab Switcher */}
            <div className="inline-flex items-center p-1 rounded-xl bg-slate-950 border border-slate-800">
              <button
                type="button"
                onClick={() => setHubTab('syllabus')}
                aria-pressed={hubTab === 'syllabus'}
                className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-semibold transition-colors whitespace-nowrap ${
                  hubTab === 'syllabus'
                    ? 'bg-slate-800 text-white'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <BookOpen className="w-3.5 h-3.5" />
                <span>Syllabus Units</span>
              </button>
              <button
                type="button"
                onClick={() => setHubTab('flashcards')}
                aria-pressed={hubTab === 'flashcards'}
                className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-semibold transition-colors whitespace-nowrap ${
                  hubTab === 'flashcards'
                    ? `${activeSubject.bgSoftClass} ${activeSubject.textClass}`
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Layers className="w-3.5 h-3.5" />
                <span>Flashcards ({subjectFlashcardStats.dueNow} due)</span>
              </button>
            </div>

            {hubTab === 'syllabus' && (
              <div className="inline-flex items-center p-1 rounded-xl bg-slate-950 border border-slate-800 shrink-0">
                {GRADES.map((g) => {
                  const active = selectedGrade === g.id;
                  return (
                    <button
                      key={g.id}
                      type="button"
                      onClick={() => setSelectedGrade(g.id)}
                      aria-pressed={active}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors whitespace-nowrap ${
                        active
                          ? 'bg-slate-800 text-white'
                          : 'text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      {g.label}
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Visual Subject Illustration */}
        <div className="lg:col-span-4 relative min-h-[170px] lg:min-h-[210px] bg-slate-950 border-t lg:border-t-0 lg:border-l border-slate-800/80 overflow-hidden">
          <img
            src={activeSubject.illustrationUrl}
            alt={activeSubject.illustrationAlt}
            className="w-full h-full object-cover opacity-90"
          />
          <div
            className="absolute inset-0 bg-gradient-to-t lg:bg-gradient-to-r from-slate-900/90 via-slate-900/30 to-transparent pointer-events-none"
            aria-hidden="true"
          />
          <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-[11px] text-slate-300 pointer-events-none">
            <span className="px-2.5 py-1 rounded-lg bg-slate-950/80 border border-slate-800/80 font-medium backdrop-blur-xs">
              Visual Concept Map · {activeSubject.shortName}
            </span>
          </div>
        </div>
      </div>

      {/* Sub-tab Content: Syllabus Units OR Spaced-Repetition Flashcards */}
      {hubTab === 'flashcards' ? (
        <FlashcardsPanel
          subject={selectedSubject}
          gradeFilter={flashcardGradeFilter}
          onChangeGradeFilter={setFlashcardGradeFilter}
          progressMap={flashcardProgress}
          onRateCard={onRateFlashcard}
          onResetDeck={onResetFlashcardDeck}
          onAskTutorAboutCard={onAskTutorAboutFlashcard}
        />
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {topics.map((topic) => (
            <article
              key={topic.id}
              className="rounded-2xl bg-slate-900/80 border border-slate-800/80 p-5 flex flex-col justify-between gap-4"
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-3">
                  <div className="space-y-1.5 min-w-0">
                    <div className="flex items-center gap-3 text-xs text-slate-400">
                      <span className={`font-mono font-semibold ${activeSubject.textClass}`}>
                        {topic.unitNumber} · {topic.grade}
                      </span>
                      <span className="inline-flex items-center gap-1 tabular-nums">
                        <Clock className="w-3.5 h-3.5" />
                        {topic.estimatedMinutes} min study
                      </span>
                    </div>
                    <h3 className="font-display text-lg font-bold text-white leading-snug">
                      {topic.title}
                    </h3>
                  </div>

                  <TopicVisualDiagram
                    subject={topic.subject}
                    title={topic.title}
                    compact
                  />
                </div>

                <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                  <MathText text={topic.summary} />
                </p>

                <div className="space-y-1.5 pt-1">
                  <div className="text-xs font-semibold text-slate-300">Syllabus Objectives</div>
                  <ul className="space-y-1.5">
                    {topic.objectives.map((obj, i) => (
                      <li key={i} className="flex items-start gap-2 text-xs text-slate-300 leading-relaxed">
                        <CheckCircle2 className={`w-3.5 h-3.5 shrink-0 mt-0.5 ${activeSubject.textClass}`} />
                        <MathText text={obj} />
                      </li>
                    ))}
                  </ul>
                </div>

                {topic.keyTerms && topic.keyTerms.length > 0 && (
                  <div className="pt-2 border-t border-slate-800/70">
                    <div className="flex items-center justify-between text-[11px] font-medium text-slate-400 mb-1.5">
                      <span>Key Terms ({topic.keyTerms.length})</span>
                      <button
                        type="button"
                        onClick={() => setHubTab('flashcards')}
                        className={`${activeSubject.textClass} hover:underline font-semibold`}
                      >
                        Drill in Flashcards →
                      </button>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {topic.keyTerms.slice(0, 2).map((kt, idx) => (
                        <div
                          key={idx}
                          className="rounded-xl bg-slate-950/70 border border-slate-800/70 p-2.5 text-xs"
                        >
                          <div className="font-semibold text-white">
                            <MathText text={kt.term} />
                          </div>
                          <div className="text-[11px] text-slate-400 mt-0.5 line-clamp-2">
                            <MathText text={kt.definition} />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {topic.keyFormulas.length > 0 && (
                  <div className="pt-2 border-t border-slate-800/80">
                    <div className="text-[11px] font-medium text-slate-400 mb-1.5">Key Expressions</div>
                    <div className="flex flex-wrap gap-3 text-xs text-slate-200 bg-slate-950/70 border border-slate-800/70 rounded-xl p-3">
                      {topic.keyFormulas.map((f, i) => (
                        <MathText key={i} text={f} />
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-800/70">
                <button
                  type="button"
                  onClick={() => onPracticeTopic(topic.subject, topic.grade, topic.id)}
                  className={`flex-1 inline-flex items-center justify-center gap-1.5 px-3.5 py-2.5 rounded-xl border ${activeSubject.bgSoftClass} ${activeSubject.borderClass} ${activeSubject.textClass} hover:brightness-110 text-xs font-semibold transition-all whitespace-nowrap`}
                >
                  <Play className="w-3.5 h-3.5 fill-current" />
                  <span>Practice Questions</span>
                </button>
                <button
                  type="button"
                  onClick={() => onTeachTopic(topic)}
                  className="inline-flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-500/35 text-xs font-semibold text-emerald-300 transition-colors whitespace-nowrap"
                >
                  <GraduationCap className="w-3.5 h-3.5" />
                  <span>AI Teach</span>
                </button>
                <button
                  type="button"
                  onClick={() => onAskTutorAboutTopic(topic)}
                  className="inline-flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl bg-cyan-500/12 hover:bg-cyan-500/20 border border-cyan-500/30 text-xs font-semibold text-cyan-300 transition-colors whitespace-nowrap"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Explain</span>
                </button>
                <button
                  type="button"
                  onClick={() => onCreateNoteForTopic(topic)}
                  className="inline-flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-medium text-slate-200 transition-colors whitespace-nowrap"
                >
                  <FilePlus className="w-3.5 h-3.5" />
                  <span>Add Note</span>
                </button>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
};
