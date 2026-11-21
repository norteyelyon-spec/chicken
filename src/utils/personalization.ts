import type {
  AccentTheme,
  GradeFilter,
  GradeLevel,
  LayoutDensity,
  OrbCorner,
  PersonalizationPreferences,
  TeacherPersonaId,
} from '../types/index.ts';

export const PERSONALIZATION_STORAGE_KEY = 'wassce_masterclass_personalization_v1';
export const ORB_CORNER_STORAGE_KEY = 'wassce_workings_orb_corner_v1';

export const DEFAULT_PERSONALIZATION: PersonalizationPreferences = {
  accentTheme: 'cyan',
  density: 'comfortable',
  studioTagline: 'GES WASSCE Prep Studio',
  teacherPersona: 'kofi',
  orbCorner: 'bottom-right',
};

export interface AccentThemeSpec {
  id: AccentTheme;
  label: string;
  primaryHex: string;
  softBgClass: string;
  borderClass: string;
  textClass: string;
  buttonClass: string;
  activeNavClass: string;
  badgeClass: string;
}

export const ACCENT_THEME_PRESETS: Record<AccentTheme, AccentThemeSpec> = {
  cyan: {
    id: 'cyan',
    label: 'Cyan Electric',
    primaryHex: '#22d3ee',
    softBgClass: 'bg-cyan-500/15',
    borderClass: 'border-cyan-500/35',
    textClass: 'text-cyan-300',
    buttonClass: 'bg-cyan-500 hover:bg-cyan-400 text-slate-950',
    activeNavClass: 'bg-cyan-500/12 text-cyan-300 border border-cyan-500/25',
    badgeClass: 'bg-cyan-500/15 border-cyan-500/30 text-cyan-300',
  },
  emerald: {
    id: 'emerald',
    label: 'Emerald Forest',
    primaryHex: '#34d399',
    softBgClass: 'bg-emerald-500/15',
    borderClass: 'border-emerald-500/35',
    textClass: 'text-emerald-300',
    buttonClass: 'bg-emerald-500 hover:bg-emerald-400 text-slate-950',
    activeNavClass: 'bg-emerald-500/12 text-emerald-300 border border-emerald-500/25',
    badgeClass: 'bg-emerald-500/15 border-emerald-500/30 text-emerald-300',
  },
  amber: {
    id: 'amber',
    label: 'Amber Scholar',
    primaryHex: '#fbbf24',
    softBgClass: 'bg-amber-500/15',
    borderClass: 'border-amber-500/35',
    textClass: 'text-amber-300',
    buttonClass: 'bg-amber-500 hover:bg-amber-400 text-slate-950',
    activeNavClass: 'bg-amber-500/12 text-amber-300 border border-amber-500/25',
    badgeClass: 'bg-amber-500/15 border-amber-500/30 text-amber-300',
  },
  violet: {
    id: 'violet',
    label: 'Violet Studio',
    primaryHex: '#a78bfa',
    softBgClass: 'bg-violet-500/15',
    borderClass: 'border-violet-500/35',
    textClass: 'text-violet-300',
    buttonClass: 'bg-violet-500 hover:bg-violet-400 text-slate-950',
    activeNavClass: 'bg-violet-500/12 text-violet-300 border border-violet-500/25',
    badgeClass: 'bg-violet-500/15 border-violet-500/30 text-violet-300',
  },
};

export interface TeacherPersonaSpec {
  id: TeacherPersonaId;
  name: string;
  roleTitle: string;
  shirtHex: string;
  tieHex: string;
  skinHex: string;
  hairHex: string;
  accentHex: string;
  greetingStyle: string;
}

export const TEACHER_PERSONA_PROFILES: Record<TeacherPersonaId, TeacherPersonaSpec> = {
  kofi: {
    id: 'kofi',
    name: 'Mr. Kofi Mensah',
    roleTitle: 'Senior Physics & Maths Educator',
    shirtHex: '#0ea5e9',
    tieHex: '#fbbf24',
    skinHex: '#8d5524',
    hairHex: '#0f172a',
    accentHex: '#22d3ee',
    greetingStyle: 'Intuitive step-by-step derivations & real lab demos',
  },
  abena: {
    id: 'abena',
    name: 'Dr. Abena Osei',
    roleTitle: 'Chemistry & Biology Lead Tutor',
    shirtHex: '#10b981',
    tieHex: '#e2e8f0',
    skinHex: '#734222',
    hairHex: '#18181b',
    accentHex: '#34d399',
    greetingStyle: 'Visual molecular intuition & WASSCE marking cues',
  },
  efua: {
    id: 'efua',
    name: 'Ms. Efua Boateng',
    roleTitle: 'ICT, Core Maths & Humanities Coach',
    shirtHex: '#8b5cf6',
    tieHex: '#fde68a',
    skinHex: '#9c6434',
    hairHex: '#1e1b4b',
    accentHex: '#a78bfa',
    greetingStyle: 'Structured diagrams, logic flow & clear summaries',
  },
};

export function sanitizePersonalization(raw: unknown): PersonalizationPreferences {
  if (!raw || typeof raw !== 'object') {
    return { ...DEFAULT_PERSONALIZATION };
  }
  const obj = raw as Record<string, unknown>;
  const accentTheme: AccentTheme =
    obj.accentTheme === 'emerald' || obj.accentTheme === 'amber' || obj.accentTheme === 'violet'
      ? obj.accentTheme
      : 'cyan';
  const density: LayoutDensity = obj.density === 'compact' ? 'compact' : 'comfortable';
  const teacherPersona: TeacherPersonaId =
    obj.teacherPersona === 'abena' || obj.teacherPersona === 'efua' ? obj.teacherPersona : 'kofi';
  const orbCorner: OrbCorner =
    obj.orbCorner === 'top-left' ||
    obj.orbCorner === 'top-right' ||
    obj.orbCorner === 'bottom-left'
      ? obj.orbCorner
      : 'bottom-right';
  const rawTagline = typeof obj.studioTagline === 'string' ? obj.studioTagline.trim() : '';
  const studioTagline = rawTagline
    ? rawTagline.slice(0, 48)
    : DEFAULT_PERSONALIZATION.studioTagline;

  return {
    accentTheme,
    density,
    studioTagline,
    teacherPersona,
    orbCorner,
  };
}

export function getGradeDisplayLabel(grade: GradeLevel | GradeFilter): string {
  switch (grade) {
    case 'SHS1':
      return 'Grade 10 (SHS 1)';
    case 'SHS2':
      return 'Grade 11 (SHS 2)';
    case 'SHS3':
      return 'Grade 12 (SHS 3)';
    case 'ALL':
      return 'All Grades (10–12)';
  }
}

export function computeOrbCornerFromPoint(
  clientX: number,
  clientY: number,
  viewportW: number,
  viewportH: number
): OrbCorner {
  const isLeft = clientX < viewportW / 2;
  const isTop = clientY < viewportH / 2;
  if (isTop && isLeft) return 'top-left';
  if (isTop && !isLeft) return 'top-right';
  if (!isTop && isLeft) return 'bottom-left';
  return 'bottom-right';
}
