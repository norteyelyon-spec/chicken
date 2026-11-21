import React, { Suspense, useEffect, useMemo, useState } from 'react';
import {
  ChevronDown,
  ChevronRight,
  Copy,
  FilePlus,
  GraduationCap,
  HardDrive,
  Layers,
  PlayCircle,
  Search,
  Target,
  Trash2,
} from 'lucide-react';
import { NOTE_TEMPLATES } from '../data/defaultNotes';
import { SUBJECTS, SUBJECT_LIST } from '../data/subjects';
import type {
  GradeFilter,
  GradeLevel,
  StudyNote,
  SubjectCategory,
  SubjectId,
  TeachingLaunchTarget,
} from '../types';
import {
  computeGradeCounts,
  filterNotesByCriteria,
  groupNotesByGrade,
} from '../utils/notesCategorization';
import { InteractiveNoteVideo } from './InteractiveNoteVideo';

const AtomicModelViewer = React.lazy(() =>
  import('./AtomicModelViewer').then((m) => ({ default: m.AtomicModelViewer }))
);
import { MarkdownPreview } from './MathText';
import { NoteDrillPanel } from './NoteDrillPanel';
import type { NoteDrillAttemptSummary, NoteDrillMasteryRecord } from '../utils/noteDrills';

interface NotesHubViewProps {
  notes: StudyNote[];
  selectedNoteId?: string | null;
  noteDrillMastery?: Record<string, NoteDrillMasteryRecord>;
  onCreateNote: (note: StudyNote) => void;
  onUpdateNote: (note: StudyNote) => void;
  onDeleteNote: (noteId: string) => void;
  onAskTutorAboutNote?: (prompt: string) => void;
  onLaunchAITeacher?: (target: TeachingLaunchTarget) => void;
  onOpenGoogleDrive?: (note: StudyNote | null) => void;
  onCompleteNoteDrill?: (note: StudyNote, summary: NoteDrillAttemptSummary) => void;
}

export const NotesHubView: React.FC<NotesHubViewProps> = ({
  notes,
  selectedNoteId,
  noteDrillMastery,
  onCreateNote,
  onUpdateNote,
  onDeleteNote,
  onAskTutorAboutNote,
  onLaunchAITeacher,
  onOpenGoogleDrive,
  onCompleteNoteDrill,
}) => {
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<'all' | SubjectCategory>('all');
  const [filterSubject, setFilterSubject] = useState<SubjectId | 'ALL'>('ALL');
  const [filterGrade, setFilterGrade] = useState<GradeFilter>('ALL');
  const [activeNoteId, setActiveNoteId] = useState<string>(selectedNoteId || (notes[0]?.id ?? ''));
  const [viewMode, setViewMode] = useState<'split' | 'edit' | 'preview' | 'video' | 'drill'>('preview');
  const [tagInput, setTagInput] = useState('');
  const [collapsedGrades, setCollapsedGrades] = useState<Record<GradeLevel, boolean>>({
    SHS1: false,
    SHS2: false,
    SHS3: false,
  });

  useEffect(() => {
    if (selectedNoteId && notes.some((n) => n.id === selectedNoteId)) {
      setActiveNoteId(selectedNoteId);
    }
  }, [selectedNoteId, notes]);

  const visibleSubjects = useMemo(
    () =>
      SUBJECT_LIST.filter((s) =>
        categoryFilter === 'all' ? true : s.category === categoryFilter
      ),
    [categoryFilter]
  );

  const gradeCounts = useMemo(
    () => computeGradeCounts(notes, categoryFilter, filterSubject),
    [notes, categoryFilter, filterSubject]
  );

  const filteredNotes = useMemo(
    () =>
      filterNotesByCriteria(notes, {
        gradeFilter: filterGrade,
        categoryFilter,
        subjectFilter: filterSubject,
        search,
      }),
    [notes, filterGrade, categoryFilter, filterSubject, search]
  );

  const gradeSections = useMemo(() => groupNotesByGrade(filteredNotes), [filteredNotes]);

  const activeNote =
    notes.find((n) => n.id === activeNoteId) ?? filteredNotes[0] ?? null;

  const handleNewNote = (templateContent?: string, templateTitle?: string) => {
    const now = new Date().toISOString();
    const created: StudyNote = {
      id: `note-${Date.now()}`,
      title: templateTitle ?? 'Untitled Study Note',
      subject: filterSubject === 'ALL' ? 'physics' : filterSubject,
      grade: filterGrade === 'ALL' ? 'SHS1' : filterGrade,
      tags: ['Revision'],
      content: templateContent ?? '# New Revision Note\n\nWrite formulas with `$E = mc^2$` or code blocks.',
      createdAt: now,
      updatedAt: now,
    };
    onCreateNote(created);
    setActiveNoteId(created.id);
    setViewMode('split');
  };

  const handleAddTag = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeNote) return;
    const clean = tagInput.trim();
    if (!clean || activeNote.tags.includes(clean)) return;
    onUpdateNote({
      ...activeNote,
      tags: [...activeNote.tags, clean],
      updatedAt: new Date().toISOString(),
    });
    setTagInput('');
  };

  const handleRemoveTag = (tag: string) => {
    if (!activeNote) return;
    onUpdateNote({
      ...activeNote,
      tags: activeNote.tags.filter((t) => t !== tag),
      updatedAt: new Date().toISOString(),
    });
  };

  const toggleGradeSection = (grade: GradeLevel) => {
    setCollapsedGrades((prev) => ({ ...prev, [grade]: !prev[grade] }));
  };

  return (
    <div className="space-y-5">
      {/* Grade & Subject Categorization Header */}
      <section className="rounded-2xl bg-slate-900/85 border border-slate-800/90 p-4 space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          {/* Grade Categorization Tabs */}
          <div
            role="group"
            aria-label="Categorize notes by grade level"
            className="inline-flex flex-wrap items-center p-1 rounded-xl bg-slate-950 border border-slate-800 gap-0.5"
          >
            {(['ALL', 'SHS1', 'SHS2', 'SHS3'] as const).map((g) => (
              <button
                key={g}
                type="button"
                data-testid={`notes-grade-tab-${g}`}
                onClick={() => setFilterGrade(g)}
                aria-pressed={filterGrade === g}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors tabular-nums ${
                  filterGrade === g
                    ? 'bg-cyan-500 text-slate-950'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {g === 'ALL' ? `All Grades (${gradeCounts.ALL})` : `${g} (${gradeCounts[g]})`}
              </button>
            ))}
          </div>

          {/* Elective vs Core Filter */}
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
                    filterSubject !== 'ALL' &&
                    SUBJECTS[filterSubject].category !== cat.id
                  ) {
                    setFilterSubject('ALL');
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
          <div className="relative flex-1 min-w-[200px] max-w-sm">
            <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="search"
              aria-label="Search study notes"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search titles, formulas, tags..."
              className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-cyan-400"
            />
          </div>
        </div>

        {/* Subject Pills Categorized Across Active Grade */}
        <div className="flex flex-wrap gap-1.5 pt-2 border-t border-slate-800/80">
          <button
            type="button"
            onClick={() => setFilterSubject('ALL')}
            className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold border transition-colors tabular-nums ${
              filterSubject === 'ALL'
                ? 'bg-slate-800 border-slate-600 text-white'
                : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            All ({notes.filter((n) => (filterGrade === 'ALL' ? true : n.grade === filterGrade)).length})
          </button>
          {visibleSubjects.map((sub) => {
            const count = notes.filter(
              (n) =>
                n.subject === sub.id &&
                (filterGrade === 'ALL' ? true : n.grade === filterGrade)
            ).length;
            const active = filterSubject === sub.id;
            return (
              <button
                key={sub.id}
                type="button"
                data-testid={`notes-subject-chip-${sub.id}`}
                onClick={() => setFilterSubject(sub.id)}
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

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Notes Sidebar — Categorized by Grade Level */}
        <aside className="lg:col-span-4 min-w-0 rounded-2xl bg-slate-900/85 border border-slate-800/90 p-4 flex flex-col gap-4 max-h-[82vh]">
          <div className="flex items-center justify-between gap-2">
            <div>
              <h2 className="font-display text-base font-bold text-white">
                GES Study Notes ({filteredNotes.length})
              </h2>
              <p className="text-[11px] text-slate-400">
                Organized by SHS 1, SHS 2 &amp; SHS 3 grade syllabus
              </p>
            </div>
            <button
              type="button"
              onClick={() => handleNewNote()}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-bold transition-colors whitespace-nowrap"
            >
              <FilePlus className="w-3.5 h-3.5" />
              <span>New Note</span>
            </button>
          </div>

          {/* Quick-Insert Templates */}
          <div className="pt-2 border-t border-slate-800">
            <div className="text-[11px] font-medium text-slate-400 mb-2">Quick-Start Templates</div>
            <div className="grid grid-cols-2 gap-1.5">
              {NOTE_TEMPLATES.map((tpl) => (
                <button
                  key={tpl.id}
                  type="button"
                  onClick={() => handleNewNote(tpl.content, tpl.label)}
                  className="px-2.5 py-1.5 rounded-lg bg-slate-950 hover:bg-slate-800 border border-slate-800 text-[11px] text-slate-300 text-left truncate transition-colors"
                >
                  + {tpl.label}
                </button>
              ))}
            </div>
          </div>

          {/* Grade-Categorized Notes List */}
          <div className="flex-1 overflow-y-auto space-y-3 pr-1" data-testid="notes-grade-sections">
            {gradeSections.length === 0 ? (
              <div className="py-8 text-center text-xs text-slate-500">
                No matching notes found for this grade or filter.
              </div>
            ) : (
              gradeSections.map((section) => {
                const isCollapsed = collapsedGrades[section.grade] && filterGrade === 'ALL';
                return (
                  <div
                    key={section.grade}
                    data-testid={`notes-section-${section.grade}`}
                    className="space-y-1.5"
                  >
                    <button
                      type="button"
                      onClick={() => toggleGradeSection(section.grade)}
                      aria-expanded={!isCollapsed}
                      className="w-full sticky top-0 z-10 flex items-center justify-between gap-2 px-3 py-2 rounded-xl bg-slate-950/95 border border-slate-800 text-left hover:border-cyan-500/40 transition-colors"
                    >
                      <div className="flex items-center gap-2 min-w-0">
                        <Layers className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                        <div className="min-w-0">
                          <div className="text-xs font-bold text-white truncate">
                            {section.label}
                          </div>
                          <div className="text-[10px] text-slate-400 truncate">
                            {section.subtitle}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-1.5 shrink-0">
                        <span className="text-[11px] font-mono text-cyan-300 tabular-nums">
                          {section.notes.length}
                        </span>
                        {isCollapsed ? (
                          <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                        ) : (
                          <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                        )}
                      </div>
                    </button>

                    {!isCollapsed && (
                      <div className="space-y-1.5 pl-1">
                        {section.notes.map((note) => {
                          const sub = SUBJECTS[note.subject];
                          const isSelected = activeNote?.id === note.id;
                          return (
                            <button
                              key={note.id}
                              type="button"
                              onClick={() => setActiveNoteId(note.id)}
                              className={`w-full text-left p-3 rounded-xl border transition-colors ${
                                isSelected
                                  ? 'bg-slate-800/90 border-cyan-500/45'
                                  : 'bg-slate-950/60 border-slate-800/80 hover:border-slate-700'
                              }`}
                            >
                              <div className="flex items-center justify-between gap-2 text-[11px] text-slate-400 mb-1">
                                <span className={`font-semibold ${sub.textClass}`}>
                                  {sub.shortName} · {note.grade}
                                </span>
                                <span className="tabular-nums text-slate-500">
                                  {note.isBuiltIn
                                    ? 'GES Syllabus'
                                    : new Date(note.updatedAt).toLocaleDateString()}
                                </span>
                              </div>
                              <div className="text-xs font-semibold text-white truncate">
                                {note.title}
                              </div>
                              <div className="flex items-center justify-between gap-2 mt-1">
                                <span className="text-[11px] text-slate-500 truncate">
                                  {note.tags.join(' · ')}
                                </span>
                                {noteDrillMastery?.[note.id]?.attemptsCount ? (
                                  <span className="text-[10px] font-mono font-bold text-emerald-300 shrink-0 tabular-nums">
                                    Drill {noteDrillMastery[note.id].bestAccuracy}%
                                  </span>
                                ) : null}
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </aside>

        {/* Right Note Editor + KaTeX/Code Live Preview */}
        <section className="lg:col-span-8 min-w-0 rounded-2xl bg-slate-900/85 border border-slate-800/90 p-5 flex flex-col gap-4">
          {!activeNote ? (
            <div className="flex-1 flex flex-col items-center justify-center text-center py-16 space-y-3">
              <p className="text-sm text-slate-400">Select a study note or create one from a template.</p>
              <button
                type="button"
                onClick={() => handleNewNote()}
                className="px-4 py-2 rounded-xl bg-cyan-500 text-slate-950 text-xs font-bold"
              >
                Create First Note
              </button>
            </div>
          ) : (
            <>
              {/* Note Meta Bar */}
              <div className="flex flex-col gap-3 border-b border-slate-800 pb-4">
                <div className="w-full min-w-0">
                  {activeNote.isBuiltIn ? (
                    <h2 className="font-display text-lg sm:text-xl font-bold text-white leading-snug break-words">
                      {activeNote.title}
                    </h2>
                  ) : (
                    <>
                      <label htmlFor="note-title-input" className="sr-only">Note Title</label>
                      <input
                        id="note-title-input"
                        type="text"
                        value={activeNote.title}
                        onChange={(e) =>
                          onUpdateNote({
                            ...activeNote,
                            title: e.target.value,
                            updatedAt: new Date().toISOString(),
                          })
                        }
                        className="w-full bg-transparent font-display text-lg sm:text-xl font-bold text-white focus:outline-none"
                      />
                    </>
                  )}
                </div>

                <div className="flex flex-wrap items-center justify-between gap-2">
                  <select
                    aria-label="Note subject"
                    value={activeNote.subject}
                    onChange={(e) =>
                      onUpdateNote({
                        ...activeNote,
                        subject: e.target.value as SubjectId,
                        updatedAt: new Date().toISOString(),
                      })
                    }
                    className="px-2.5 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-xs text-slate-200"
                  >
                    {SUBJECT_LIST.map((s) => (
                      <option key={s.id} value={s.id}>{s.shortName}</option>
                    ))}
                  </select>

                  <select
                    aria-label="Note grade level"
                    value={activeNote.grade}
                    onChange={(e) =>
                      onUpdateNote({
                        ...activeNote,
                        grade: e.target.value as GradeLevel,
                        updatedAt: new Date().toISOString(),
                      })
                    }
                    className="px-2.5 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-xs text-slate-200"
                  >
                    <option value="SHS1">SHS 1</option>
                    <option value="SHS2">SHS 2</option>
                    <option value="SHS3">SHS 3</option>
                  </select>

                  <div className="inline-flex rounded-lg bg-slate-950 border border-slate-800 p-0.5 text-xs">
                    {(['split', 'edit', 'preview'] as const).map((m) => (
                      <button
                        key={m}
                        type="button"
                        onClick={() => setViewMode(m)}
                        className={`px-2.5 py-1 rounded-md capitalize font-medium ${
                          viewMode === m ? 'bg-slate-800 text-white' : 'text-slate-400 hover:text-white'
                        }`}
                      >
                        {m}
                      </button>
                    ))}
                    <button
                      type="button"
                      onClick={() => setViewMode('video')}
                      aria-pressed={viewMode === 'video'}
                      data-testid="notes-mode-video"
                      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md font-semibold transition-colors ${
                        viewMode === 'video'
                          ? 'bg-cyan-500/20 text-cyan-200 border border-cyan-500/40'
                          : 'text-cyan-400 hover:text-cyan-200'
                      }`}
                    >
                      <PlayCircle className="w-3.5 h-3.5" />
                      <span>Video Lesson</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setViewMode('drill')}
                      aria-pressed={viewMode === 'drill'}
                      data-testid="notes-mode-drill"
                      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md font-semibold transition-colors ${
                        viewMode === 'drill'
                          ? 'bg-emerald-500/20 text-emerald-200 border border-emerald-500/40'
                          : 'text-emerald-400 hover:text-emerald-200'
                      }`}
                    >
                      <Target className="w-3.5 h-3.5" />
                      <span>
                        Practice Drill
                        {noteDrillMastery?.[activeNote.id]?.attemptsCount
                          ? ` (${noteDrillMastery[activeNote.id].bestAccuracy}%)`
                          : ''}
                      </span>
                    </button>
                  </div>

                  {onLaunchAITeacher && (
                    <button
                      type="button"
                      onClick={() =>
                        onLaunchAITeacher({
                          subject: activeNote.subject,
                          grade: activeNote.grade,
                          topicTitle: activeNote.title,
                          topicSummary: activeNote.content.slice(0, 1200),
                          autoStart: true,
                        })
                      }
                      className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-500/35 text-xs font-semibold text-emerald-200 transition-colors whitespace-nowrap"
                    >
                      <GraduationCap className="w-3.5 h-3.5" />
                      <span>AI Teach Note</span>
                    </button>
                  )}

                  {onOpenGoogleDrive && (
                    <button
                      type="button"
                      onClick={() => onOpenGoogleDrive(activeNote)}
                      data-testid="notes-open-drive-btn"
                      className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-cyan-500/15 hover:bg-cyan-500/25 border border-cyan-500/35 text-xs font-semibold text-cyan-200 transition-colors whitespace-nowrap"
                    >
                      <HardDrive className="w-3.5 h-3.5" />
                      <span>Drive</span>
                    </button>
                  )}

                  {activeNote.isBuiltIn ? (
                    <button
                      type="button"
                      onClick={() => {
                        const now = new Date().toISOString();
                        const copy: StudyNote = {
                          ...activeNote,
                          id: `note-copy-${Date.now()}`,
                          title: `${activeNote.title} (My Copy)`,
                          isBuiltIn: false,
                          createdAt: now,
                          updatedAt: now,
                        };
                        onCreateNote(copy);
                        setActiveNoteId(copy.id);
                      }}
                      className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-medium text-slate-200 transition-colors"
                      title="Save an editable personal copy of this syllabus note"
                    >
                      <Copy className="w-3.5 h-3.5" />
                      <span>Duplicate</span>
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() => onDeleteNote(activeNote.id)}
                      aria-label={`Delete note ${activeNote.title}`}
                      className="p-2 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-slate-800 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>

              {/* Tags Editor */}
              <div className="flex flex-wrap items-center gap-2 text-xs">
                <span className="text-slate-500">Tags:</span>
                {activeNote.tags.map((tag) => (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => handleRemoveTag(tag)}
                    title="Click to remove tag"
                    className="text-cyan-300 hover:text-rose-300 transition-colors"
                  >
                    #{tag}
                  </button>
                ))}
                <form onSubmit={handleAddTag} className="inline-flex items-center gap-1">
                  <input
                    type="text"
                    aria-label="Add note tag"
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    placeholder="Add tag..."
                    className="w-24 px-2 py-1 rounded-lg bg-slate-950 border border-slate-800 text-xs text-white placeholder:text-slate-600 focus:outline-none focus:border-cyan-400"
                  />
                </form>
              </div>

              {/* Atomic Theory SHS 1-3 Series Quick Switcher + Interactive SVG Model Viewer */}
              {(activeNote.id.startsWith('note-chem-atomic') ||
                activeNote.title.toLowerCase().includes('atomic theory')) && (
                <div className="space-y-4">
                  <div className="flex flex-wrap items-center justify-between gap-2 px-3.5 py-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/25 text-xs">
                    <span className="font-semibold text-emerald-300">
                      Atomic Theory Grade Series:
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {[
                        { id: 'note-chem-atomic-shs1', label: 'SHS 1 · Dalton, Subatomic & Mass Spec' },
                        { id: 'note-chem-atomic-shs2', label: 'SHS 2 · Thomson, Rutherford & Bohr' },
                        { id: 'note-chem-atomic-shs3', label: 'SHS 3 · Quantum Numbers & Orbitals' },
                      ]
                        .filter((item) => notes.some((n) => n.id === item.id))
                        .map((item) => {
                          const isCurrent = activeNote.id === item.id;
                          return (
                            <button
                              key={item.id}
                              type="button"
                              onClick={() => setActiveNoteId(item.id)}
                              className={`px-2.5 py-1 rounded-lg border font-semibold transition-colors ${
                                isCurrent
                                  ? 'bg-emerald-500 text-slate-950 border-emerald-400'
                                  : 'bg-slate-950/80 border-slate-800 text-slate-300 hover:border-emerald-500/50'
                              }`}
                            >
                              {item.label}
                            </button>
                          );
                        })}
                    </div>
                  </div>

                  {viewMode !== 'video' && viewMode !== 'drill' && (
                    <Suspense
                      fallback={
                        <div className="p-6 rounded-2xl bg-slate-950 border border-slate-800 text-xs text-slate-400 text-center">
                          Loading Interactive Atomic &amp; Quantum Orbitals Viewer...
                        </div>
                      }
                    >
                      <AtomicModelViewer
                        grade={activeNote.grade}
                        noteTitle={activeNote.title}
                        onAskTutor={onAskTutorAboutNote}
                        onLaunchAITeacher={onLaunchAITeacher}
                      />
                    </Suspense>
                  )}
                </div>
              )}

              {/* Chemistry Year 1 Individual PDF Syllabus Series Switcher */}
              {activeNote.id.startsWith('note-chem-s1-') && (
                <div className="flex flex-wrap items-center justify-between gap-2 px-3.5 py-2.5 rounded-xl bg-cyan-500/10 border border-cyan-500/25 text-xs">
                  <span className="font-semibold text-cyan-300">
                    SHS 1 Chemistry Curriculum Series (Separate Topic Notes):
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {[
                      { id: 'note-chem-s1-daily-life-branches-pdf', label: '1. Branches & Ghana Impact' },
                      { id: 'note-chem-s1-lab-safety-hazards-pdf', label: '2. Lab Safety & Hazards' },
                      { id: 'note-chem-s1-storage-fire-control-pdf', label: '3. Storage & PASS Fire' },
                      { id: 'note-chem-s1-scientific-method-pdf', label: '4. Scientific Method' },
                      { id: 'note-chem-s1-quantum-orbitals-pdf', label: '5. Bohr & Orbitals' },
                      { id: 'note-chem-s1-mass-spec-isotopes-pdf', label: '6. Mass Spec & Isotopes' },
                      { id: 'note-chem-s1-radioactivity-pdf', label: '7. Radioactivity & Half-Life' },
                    ]
                      .filter((item) => notes.some((n) => n.id === item.id))
                      .map((item) => {
                        const isCurrent = activeNote.id === item.id;
                        return (
                          <button
                            key={item.id}
                            type="button"
                            onClick={() => setActiveNoteId(item.id)}
                            className={`px-2.5 py-1 rounded-lg border font-semibold transition-colors ${
                              isCurrent
                                ? 'bg-cyan-500 text-slate-950 border-cyan-400'
                                : 'bg-slate-950/80 border-slate-800 text-slate-300 hover:border-cyan-500/50'
                            }`}
                          >
                            {item.label}
                          </button>
                        );
                      })}
                  </div>
                </div>
              )}

              {/* Editor, Preview, Interactive Video Lesson, or Adaptive Practice Drill */}
              {viewMode === 'drill' ? (
                <NoteDrillPanel
                  note={activeNote}
                  mastery={noteDrillMastery?.[activeNote.id]}
                  onCompleteDrill={(summary) => onCompleteNoteDrill?.(activeNote, summary)}
                  onAskTutor={onAskTutorAboutNote}
                />
              ) : viewMode === 'video' ? (
                <InteractiveNoteVideo
                  note={activeNote}
                  noteMastery={noteDrillMastery?.[activeNote.id]}
                  onAppendToNote={(snippet) =>
                    onUpdateNote({
                      ...activeNote,
                      content: `${activeNote.content}${snippet}`,
                      updatedAt: new Date().toISOString(),
                    })
                  }
                  onAskTutor={onAskTutorAboutNote}
                  onLaunchAITeacher={onLaunchAITeacher}
                  onCompleteDrill={(summary) => onCompleteNoteDrill?.(activeNote, summary)}
                />
              ) : (
                <div
                  className={`flex-1 grid gap-4 ${
                    viewMode === 'split' ? 'grid-cols-1 xl:grid-cols-2' : 'grid-cols-1'
                  }`}
                >
                  {viewMode !== 'preview' && (
                    <div className="flex flex-col">
                      <label htmlFor="note-markdown-editor" className="text-[11px] font-medium text-slate-400 mb-1.5">
                        Markdown + LaTeX (`$...$`, `$$...$$`) + Code (` ```python `, ` ```sql `)
                      </label>
                      <textarea
                        id="note-markdown-editor"
                        value={activeNote.content}
                        onChange={(e) =>
                          onUpdateNote({
                            ...activeNote,
                            content: e.target.value,
                            updatedAt: new Date().toISOString(),
                          })
                        }
                        className="flex-1 min-h-[380px] p-4 rounded-xl bg-slate-950 border border-slate-800 text-xs sm:text-sm font-mono text-slate-100 leading-6 focus:outline-none focus:border-cyan-400 resize-y"
                      />
                    </div>
                  )}

                  {viewMode !== 'edit' && (
                    <div className="flex flex-col">
                      <div className="text-[11px] font-medium text-slate-400 mb-1.5">
                        Live KaTeX &amp; Syntax-Highlighted Preview
                      </div>
                      <div className="flex-1 min-h-[380px] p-5 rounded-xl bg-slate-950/75 border border-slate-800 overflow-y-auto">
                        <MarkdownPreview content={activeNote.content} />
                      </div>
                    </div>
                  )}
                </div>
              )}
            </>
          )}
        </section>
      </div>
    </div>
  );
};
