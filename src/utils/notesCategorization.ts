import { SUBJECTS } from '../data/subjects.ts';
import type { GradeFilter, GradeLevel, StudyNote, SubjectCategory, SubjectId } from '../types/index.ts';

export interface GradeSectionGroup {
  grade: GradeLevel;
  label: string;
  subtitle: string;
  notes: StudyNote[];
}

export const GRADE_SECTION_META: Record<
  GradeLevel,
  { label: string; subtitle: string }
> = {
  SHS1: {
    label: 'SHS 1 (Year 1)',
    subtitle: 'Foundational principles, laws & definitions',
  },
  SHS2: {
    label: 'SHS 2 (Year 2)',
    subtitle: 'Intermediate derivations, practicals & applications',
  },
  SHS3: {
    label: 'SHS 3 (Year 3 · WASSCE)',
    subtitle: 'Advanced synthesis, Paper 2 mastery & exam readiness',
  },
};

const GRADE_ORDER: GradeLevel[] = ['SHS1', 'SHS2', 'SHS3'];

export function filterNotesByCriteria(
  notes: StudyNote[],
  criteria: {
    gradeFilter: GradeFilter;
    categoryFilter: 'all' | SubjectCategory;
    subjectFilter: SubjectId | 'ALL';
    search: string;
  }
): StudyNote[] {
  const q = criteria.search.trim().toLowerCase();
  return notes.filter((n) => {
    if (criteria.gradeFilter !== 'ALL' && n.grade !== criteria.gradeFilter) return false;
    if (
      criteria.categoryFilter !== 'all' &&
      SUBJECTS[n.subject]?.category !== criteria.categoryFilter
    ) {
      return false;
    }
    if (criteria.subjectFilter !== 'ALL' && n.subject !== criteria.subjectFilter) return false;
    if (!q) return true;
    return (
      n.title.toLowerCase().includes(q) ||
      SUBJECTS[n.subject]?.name.toLowerCase().includes(q) ||
      n.content.toLowerCase().includes(q) ||
      n.tags.some((t) => t.toLowerCase().includes(q))
    );
  });
}

export function groupNotesByGrade(notes: StudyNote[]): GradeSectionGroup[] {
  return GRADE_ORDER.map((grade) => {
    const items = notes
      .filter((n) => n.grade === grade)
      .sort((a, b) => {
        const subA = SUBJECTS[a.subject]?.name ?? a.subject;
        const subB = SUBJECTS[b.subject]?.name ?? b.subject;
        if (subA !== subB) return subA.localeCompare(subB);
        return a.title.localeCompare(b.title);
      });
    return {
      grade,
      label: GRADE_SECTION_META[grade].label,
      subtitle: GRADE_SECTION_META[grade].subtitle,
      notes: items,
    };
  }).filter((group) => group.notes.length > 0);
}

export function computeGradeCounts(
  notes: StudyNote[],
  categoryFilter: 'all' | SubjectCategory = 'all',
  subjectFilter: SubjectId | 'ALL' = 'ALL'
): Record<GradeFilter, number> {
  const scoped = notes.filter((n) => {
    if (categoryFilter !== 'all' && SUBJECTS[n.subject]?.category !== categoryFilter) {
      return false;
    }
    if (subjectFilter !== 'ALL' && n.subject !== subjectFilter) return false;
    return true;
  });

  return {
    ALL: scoped.length,
    SHS1: scoped.filter((n) => n.grade === 'SHS1').length,
    SHS2: scoped.filter((n) => n.grade === 'SHS2').length,
    SHS3: scoped.filter((n) => n.grade === 'SHS3').length,
  };
}
