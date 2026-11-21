import React, { useMemo, useState } from 'react';
import {
  BookOpen,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Circle,
  Film,
  FlaskConical,
  GraduationCap,
  Maximize2,
  Minimize2,
  PlayCircle,
  Search,
  Sparkles,
} from 'lucide-react';
import { SUBJECTS, SUBJECT_LIST } from '../data/subjects';
import type {
  GradeFilter,
  SimulatorKind,
  StudyNote,
  SubjectCategory,
  SubjectId,
  TeacherPersonaId,
  TeachingLaunchTarget,
} from '../types';
import { buildInteractiveVideoScenes } from '../utils/noteVideo';
import type { NoteDrillAttemptSummary, NoteDrillMasteryRecord } from '../utils/noteDrills';
import { InteractiveNoteVideo } from './InteractiveNoteVideo';

interface VideoLessonsHubProps {
  notes: StudyNote[];
  selectedNoteId?: string | null;
  defaultGrade?: GradeFilter;
  completedVideoIds: Record<string, boolean>;
  noteDrillMastery?: Record<string, NoteDrillMasteryRecord>;
  teacherPersona?: TeacherPersonaId;
  onChangeTeacherPersona?: (persona: TeacherPersonaId) => void;
  onLogSimulationRun?: (simulatorKind: SimulatorKind, subject: SubjectId) => void;
  onToggleVideoCompleted: (noteId: string) => void;
  onAppendToNote: (noteId: string, markdownSnippet: string) => void;
  onOpenInNotes: (noteId: string) => void;
  onAskTutor: (prompt: string) => void;
  onLaunchAITeacher: (target: TeachingLaunchTarget) => void;
  onCompleteNoteDrill?: (note: StudyNote, summary: NoteDrillAttemptSummary) => void;
}

const FEATURED_BIO_PDF_IDS = ['note-bio-s1-intro-pdf', 'note-bio-s1-microscopes-pdf'];
const FEATURED_CHEM_PDF_IDS = [
  'note-chem-s1-daily-life-branches-pdf',
  'note-chem-s1-lab-safety-hazards-pdf',
  'note-chem-s1-storage-fire-control-pdf',
  'note-chem-s1-scientific-method-pdf',
  'note-chem-s1-quantum-orbitals-pdf',
  'note-chem-s1-mass-spec-isotopes-pdf',
  'note-chem-s1-radioactivity-pdf',
];

export const VideoLessonsHub: React.FC<VideoLessonsHubProps> = ({
  notes,
  selectedNoteId: externalSelectedNoteId,
  defaultGrade = 'ALL',
  completedVideoIds,
  noteDrillMastery,
  teacherPersona,
  onChangeTeacherPersona,
  onLogSimulationRun,
  onToggleVideoCompleted,
  onAppendToNote,
  onOpenInNotes,
  onAskTutor,
  onLaunchAITeacher,
  onCompleteNoteDrill,
}) => {
  const [gradeFilter, setGradeFilter] = useState<GradeFilter>(defaultGrade);
  const [categoryFilter, setCategoryFilter] = useState<'all' | SubjectCategory>('all');
  const [subjectFilter, setSubjectFilter] = useState<SubjectId | 'ALL'>('ALL');
  const [search, setSearch] = useState('');
  const [isTheaterExpanded, setIsTheaterExpanded] = useState(false);
  const [selectedNoteId, setSelectedNoteId] = useState<string>(
    externalSelectedNoteId ||
      notes.find((n) => n.id === 'note-chem-s1-quantum-orbitals-pdf')?.id ||
      notes.find((n) => n.id === 'note-bio-s1-microscopes-pdf')?.id ||
      notes[0]?.id ||
      ''
  );

  React.useEffect(() => {
    if (externalSelectedNoteId && notes.some((n) => n.id === externalSelectedNoteId)) {
      setSelectedNoteId(externalSelectedNoteId);
    }
  }, [externalSelectedNoteId, notes]);

  const featuredBioPdfs = useMemo(
    () => notes.filter((n) => FEATURED_BIO_PDF_IDS.includes(n.id)),
    [notes]
  );

  const featuredChemPdfs = useMemo(
    () => notes.filter((n) => FEATURED_CHEM_PDF_IDS.includes(n.id)),
    [notes]
  );

  const visibleSubjects = useMemo(
    () =>
      SUBJECT_LIST.filter((s) =>
        categoryFilter === 'all' ? true : s.category === categoryFilter
      ),
    [categoryFilter]
  );

  const filteredNotes = useMemo(() => {
    const q = search.trim().toLowerCase();
    return notes.filter((n) => {
      if (gradeFilter !== 'ALL' && n.grade !== gradeFilter) return false;
      if (categoryFilter !== 'all' && SUBJECTS[n.subject]?.category !== categoryFilter) {
        return false;
      }
      if (subjectFilter !== 'ALL' && n.subject !== subjectFilter) return false;
      if (!q) return true;
      return (
        n.title.toLowerCase().includes(q) ||
        SUBJECTS[n.subject].name.toLowerCase().includes(q) ||
        n.tags.some((t) => t.toLowerCase().includes(q))
      );
    });
  }, [notes, gradeFilter, categoryFilter, subjectFilter, search]);

  const activeNote =
    notes.find((n) => n.id === selectedNoteId) ?? filteredNotes[0] ?? notes[0] ?? null;

  const activePlaylistIdx = useMemo(
    () => (activeNote ? filteredNotes.findIndex((n) => n.id === activeNote.id) : -1),
    [filteredNotes, activeNote]
  );

  const activeScenesCount = useMemo(
    () => (activeNote ? buildInteractiveVideoScenes(activeNote).length : 0),
    [activeNote]
  );

  const watchedCount = useMemo(
    () => notes.filter((n) => Boolean(completedVideoIds[n.id])).length,
    [notes, completedVideoIds]
  );

  return (
    <div className="space-y-6">
      {/* Studio Header Banner */}
      <section className="rounded-2xl bg-slate-900/90 border border-slate-800/90 p-5 sm:p-6 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div className="space-y-1.5 min-w-0">
          <div className="inline-flex items-center gap-2 text-xs font-semibold text-cyan-300">
            <Film className="w-4 h-4 shrink-0" />
            <span>Interactive AI Whiteboard &amp; Voice Teacher Studio</span>
          </div>
          <h2 className="font-display text-xl sm:text-2xl font-bold text-white tracking-tight">
            AI Video Lessons Across Every Grade &amp; Syllabus Unit
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 max-w-2xl leading-relaxed">
            Every GES SHS 1–3 topic note renders as an animated multi-scene video lesson with Gemini AI Teacher voice narration, interactive checkpoint quizzes, and direct escalation to live Socratic AI coaching.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 shrink-0">
          <div className="px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs tabular-nums">
            <div className="text-slate-400">Catalog Progress</div>
            <div className="text-base font-bold text-white mt-0.5">
              {watchedCount} / {notes.length} Lessons
            </div>
          </div>
          {activeNote && (
            <button
              type="button"
              onClick={() =>
                onLaunchAITeacher({
                  subject: activeNote.subject,
                  grade: activeNote.grade,
                  topicTitle: activeNote.title,
                  topicSummary: activeNote.content.slice(0, 1200),
                  sourceLabel: 'AI Video Lesson Studio',
                  autoStart: true,
                })
              }
              data-testid="videos-launch-ai-teacher"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs sm:text-sm font-bold transition-colors whitespace-nowrap"
            >
              <GraduationCap className="w-4 h-4" />
              <span>Teach This Live</span>
            </button>
          )}
        </div>
      </section>

      {/* Featured Year 1 Biology PDF Video Masterclasses */}
      {featuredBioPdfs.length > 0 && (
        <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {featuredBioPdfs.map((pdfNote) => {
            const isCurrent = activeNote?.id === pdfNote.id;
            const isWatched = Boolean(completedVideoIds[pdfNote.id]);
            return (
              <div
                key={pdfNote.id}
                className={`rounded-2xl border p-4 flex flex-col justify-between gap-3 transition-colors ${
                  isCurrent
                    ? 'bg-lime-500/10 border-lime-500/45'
                    : 'bg-slate-900/85 border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="space-y-1 min-w-0">
                  <div className="flex items-center justify-between gap-2 text-[11px] font-semibold text-lime-300">
                    <span>SHS 1 Biology · Featured Syllabus Masterclass</span>
                    {isWatched && <span className="text-emerald-300">Watched</span>}
                  </div>
                  <h3 className="font-display text-sm sm:text-base font-bold text-white leading-snug">
                    {pdfNote.title}
                  </h3>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setSelectedNoteId(pdfNote.id)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-lime-500 hover:bg-lime-400 text-slate-950 text-xs font-bold transition-colors"
                  >
                    <PlayCircle className="w-3.5 h-3.5" />
                    <span>{isCurrent ? 'Loaded Below' : 'Open Lesson'}</span>
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      onLaunchAITeacher({
                        subject: pdfNote.subject,
                        grade: pdfNote.grade,
                        topicTitle: pdfNote.title,
                        topicSummary: pdfNote.content.slice(0, 1200),
                        sourceLabel: 'Biology SHS1 PDF Masterclass',
                        autoStart: true,
                      })
                    }
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition-colors"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                    <span>AI Teacher</span>
                  </button>
                </div>
              </div>
            );
          })}
        </section>
      )}

      {/* Featured Year 1 Chemistry PDF Individual Video Masterclasses */}
      {featuredChemPdfs.length > 0 && (
        <section className="space-y-2.5" data-testid="featured-chemistry-videos">
          <div className="flex items-center justify-between gap-2">
            <div className="inline-flex items-center gap-2 text-xs font-bold text-emerald-300">
              <FlaskConical className="w-4 h-4 shrink-0" />
              <span>SHS 1 Chemistry Curriculum · Individual Topic Video Lessons (Taught One-by-One)</span>
            </div>
            <span className="text-[11px] text-slate-400">{featuredChemPdfs.length} Separate Modules</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {featuredChemPdfs.map((chemNote, idx) => {
              const isCurrent = activeNote?.id === chemNote.id;
              const isWatched = Boolean(completedVideoIds[chemNote.id]);
              return (
                <div
                  key={chemNote.id}
                  className={`rounded-xl border p-3.5 flex flex-col justify-between gap-2.5 transition-colors ${
                    isCurrent
                      ? 'bg-emerald-500/12 border-emerald-400/50'
                      : 'bg-slate-900/85 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="space-y-1 min-w-0">
                    <div className="flex items-center justify-between gap-1 text-[10px] font-semibold text-emerald-300">
                      <span>Module {idx + 1} · SHS 1</span>
                      {isWatched && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />}
                    </div>
                    <h3 className="font-display text-xs font-bold text-white line-clamp-2 leading-snug">
                      {chemNote.title}
                    </h3>
                  </div>
                  <button
                    type="button"
                    onClick={() => setSelectedNoteId(chemNote.id)}
                    className={`w-full inline-flex items-center justify-center gap-1.5 px-2.5 py-1.5 rounded-lg text-[11px] font-bold transition-colors ${
                      isCurrent
                        ? 'bg-emerald-400 text-slate-950'
                        : 'bg-slate-800 hover:bg-emerald-500 hover:text-slate-950 text-slate-200'
                    }`}
                  >
                    <PlayCircle className="w-3.5 h-3.5" />
                    <span>{isCurrent ? 'Loaded Below' : 'Open Module'}</span>
                  </button>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* Categorization Filter Bar */}
      <section className="rounded-2xl bg-slate-900/85 border border-slate-800 p-4 space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          {/* Grade Tabs */}
          <div className="inline-flex items-center p-1 rounded-xl bg-slate-950 border border-slate-800">
            {(['ALL', 'SHS1', 'SHS2', 'SHS3'] as const).map((g) => (
              <button
                key={g}
                type="button"
                onClick={() => setGradeFilter(g)}
                aria-pressed={gradeFilter === g}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                  gradeFilter === g
                    ? 'bg-cyan-500 text-slate-950'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {g === 'ALL' ? 'All Grades' : g}
              </button>
            ))}
          </div>

          {/* Elective vs Core Toggle */}
          <div className="inline-flex items-center p-1 rounded-xl bg-slate-950 border border-slate-800">
            {(
              [
                { id: 'all', label: 'All Subjects' },
                { id: 'elective', label: 'Electives (5)' },
                { id: 'core', label: 'Core (4)' },
              ] as const
            ).map((cat) => (
              <button
                key={cat.id}
                type="button"
                onClick={() => {
                  setCategoryFilter(cat.id);
                  if (
                    cat.id !== 'all' &&
                    subjectFilter !== 'ALL' &&
                    SUBJECTS[subjectFilter].category !== cat.id
                  ) {
                    setSubjectFilter('ALL');
                  }
                }}
                aria-pressed={categoryFilter === cat.id}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                  categoryFilter === cat.id
                    ? 'bg-slate-800 text-white'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Search Input */}
          <div className="relative flex-1 min-w-[210px] max-w-sm">
            <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="search"
              aria-label="Search AI video lessons"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search topic, microscope, titration, calculus..."
              className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-cyan-400"
            />
          </div>
        </div>

        {/* Subject Filter Strip */}
        <div className="flex flex-wrap gap-1.5 pt-2 border-t border-slate-800/80">
          <button
            type="button"
            onClick={() => setSubjectFilter('ALL')}
            className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold border transition-colors ${
              subjectFilter === 'ALL'
                ? 'bg-slate-800 border-slate-600 text-white'
                : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            All ({notes.filter((n) => (gradeFilter === 'ALL' ? true : n.grade === gradeFilter)).length})
          </button>
          {visibleSubjects.map((sub) => {
            const count = notes.filter(
              (n) => n.subject === sub.id && (gradeFilter === 'ALL' ? true : n.grade === gradeFilter)
            ).length;
            const active = subjectFilter === sub.id;
            return (
              <button
                key={sub.id}
                type="button"
                onClick={() => setSubjectFilter(sub.id)}
                className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold border transition-colors tabular-nums ${
                  active
                    ? `${sub.bgSoftClass} ${sub.borderClass} ${sub.textClass}`
                    : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                {sub.shortName} ({count})
              </button>
            );
          })}
        </div>
      </section>

      {/* Main Split: Playlist Sidebar + Interactive Whiteboard Player (expandable to Full Theater) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {!isTheaterExpanded && (
        <aside className="lg:col-span-4 min-w-0 rounded-2xl bg-slate-900/85 border border-slate-800 p-4 flex flex-col gap-3 max-h-[820px]">
          <div className="flex items-center justify-between gap-2 pb-2 border-b border-slate-800">
            <h3 className="font-display text-sm font-bold text-white">
              Lesson Playlist ({filteredNotes.length})
            </h3>
            <span className="text-[11px] text-slate-400 tabular-nums">
              {gradeFilter === 'ALL' ? 'SHS 1–3' : gradeFilter}
            </span>
          </div>

          <div className="flex-1 overflow-y-auto space-y-2 pr-1">
            {filteredNotes.length === 0 ? (
              <div className="py-10 text-center text-xs text-slate-500">
                No lessons match these filters. Try clearing the search or choosing All Grades.
              </div>
            ) : (
              filteredNotes.map((lesson) => {
                const sub = SUBJECTS[lesson.subject];
                const isSelected = activeNote?.id === lesson.id;
                const isWatched = Boolean(completedVideoIds[lesson.id]);
                return (
                  <button
                    key={lesson.id}
                    type="button"
                    onClick={() => setSelectedNoteId(lesson.id)}
                    data-testid={`video-playlist-item-${lesson.id}`}
                    className={`w-full text-left p-3 rounded-xl border transition-colors ${
                      isSelected
                        ? 'bg-slate-800 border-cyan-500/50'
                        : 'bg-slate-950/70 border-slate-800/80 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2 text-[11px] mb-1">
                      <span className={`font-semibold ${sub.textClass}`}>
                        {sub.shortName} · {lesson.grade}
                      </span>
                      <div className="flex items-center gap-1.5 shrink-0">
                        {noteDrillMastery?.[lesson.id]?.attemptsCount ? (
                          <span className="text-[10px] font-mono font-bold text-emerald-300 tabular-nums">
                            {noteDrillMastery[lesson.id].bestAccuracy}%
                          </span>
                        ) : null}
                        {isWatched ? (
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                        ) : (
                          <Circle className="w-3.5 h-3.5 text-slate-600 shrink-0" />
                        )}
                      </div>
                    </div>
                    <div className="text-xs font-semibold text-white line-clamp-2 leading-snug">
                      {lesson.title}
                    </div>
                  </button>
                );
              })
            )}
          </div>
        </aside>
        )}

        <section
          className={`${
            isTheaterExpanded ? 'lg:col-span-12' : 'lg:col-span-8'
          } min-w-0 rounded-2xl bg-slate-900/85 border border-slate-800 p-4 sm:p-5 space-y-4`}
        >
          {!activeNote ? (
            <div className="py-16 text-center text-sm text-slate-400">
              Select a syllabus note from the playlist to start its interactive video lesson.
            </div>
          ) : (
            <>
              <div className="flex flex-wrap items-start justify-between gap-3 border-b border-slate-800 pb-4">
                <div className="min-w-0 space-y-1">
                  <div className="text-xs font-semibold text-cyan-300 tabular-nums">
                    {SUBJECTS[activeNote.subject].name} · {activeNote.grade} · {activeScenesCount} Animated Scenes
                  </div>
                  <h3 className="font-display text-lg sm:text-xl font-bold text-white leading-snug">
                    {activeNote.title}
                  </h3>
                </div>

                <div className="flex flex-wrap items-center gap-2 shrink-0">
                  {filteredNotes.length > 1 && (
                    <div className="inline-flex items-center gap-1 mr-1">
                      <button
                        type="button"
                        disabled={activePlaylistIdx <= 0}
                        onClick={() => {
                          if (activePlaylistIdx > 0) {
                            setSelectedNoteId(filteredNotes[activePlaylistIdx - 1].id);
                          }
                        }}
                        aria-label="Previous note lesson"
                        className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-slate-950 hover:bg-slate-800 border border-slate-700 disabled:opacity-40 text-xs font-semibold text-slate-200 transition-colors"
                      >
                        <ChevronLeft className="w-3.5 h-3.5" />
                        <span>Prev Note</span>
                      </button>
                      <button
                        type="button"
                        disabled={activePlaylistIdx === -1 || activePlaylistIdx >= filteredNotes.length - 1}
                        onClick={() => {
                          if (activePlaylistIdx >= 0 && activePlaylistIdx < filteredNotes.length - 1) {
                            setSelectedNoteId(filteredNotes[activePlaylistIdx + 1].id);
                          }
                        }}
                        aria-label="Next note lesson"
                        className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-slate-950 hover:bg-slate-800 border border-slate-700 disabled:opacity-40 text-xs font-semibold text-slate-200 transition-colors"
                      >
                        <span>Next Note</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  )}

                  <button
                    type="button"
                    onClick={() => onToggleVideoCompleted(activeNote.id)}
                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-semibold transition-colors ${
                      completedVideoIds[activeNote.id]
                        ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-300'
                        : 'bg-slate-950 border-slate-700 text-slate-300 hover:border-slate-500'
                    }`}
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>{completedVideoIds[activeNote.id] ? 'Watched' : 'Mark Watched'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setIsTheaterExpanded((v) => !v)}
                    data-testid="video-theater-expand-btn"
                    aria-pressed={isTheaterExpanded}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-950 hover:bg-slate-800 border border-slate-700 text-cyan-300 text-xs font-semibold transition-colors"
                  >
                    {isTheaterExpanded ? (
                      <>
                        <Minimize2 className="w-3.5 h-3.5" />
                        <span>Show Playlist</span>
                      </>
                    ) : (
                      <>
                        <Maximize2 className="w-3.5 h-3.5" />
                        <span>Expand Theater</span>
                      </>
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={() => onOpenInNotes(activeNote.id)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition-colors"
                  >
                    <BookOpen className="w-3.5 h-3.5" />
                    <span>Read Full Note</span>
                  </button>
                </div>
              </div>

              <InteractiveNoteVideo
                note={activeNote}
                noteMastery={noteDrillMastery?.[activeNote.id]}
                teacherPersona={teacherPersona}
                onChangeTeacherPersona={onChangeTeacherPersona}
                onLogSimulationRun={onLogSimulationRun}
                onAppendToNote={(snippet) => onAppendToNote(activeNote.id, snippet)}
                onAskTutor={onAskTutor}
                onLaunchAITeacher={onLaunchAITeacher}
                onCompleteDrill={(summary) => onCompleteNoteDrill?.(activeNote, summary)}
              />
            </>
          )}
        </section>
      </div>
    </div>
  );
};
