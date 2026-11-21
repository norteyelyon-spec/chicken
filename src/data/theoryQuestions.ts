import type { TheoryQuestion } from '../types';
import { ADDMATHS_THEORY_BANK } from './theory/addmaths';
import { BIOLOGY_THEORY_BANK } from './theory/biology';
import { CHEMISTRY_THEORY_BANK } from './theory/chemistry';
import { COREMATH_THEORY_BANK } from './theory/coremath';
import { ENGLISH_THEORY_BANK } from './theory/english';
import { ICT_THEORY_BANK } from './theory/ict';
import { INTEGRATED_SCIENCE_THEORY_BANK } from './theory/integratedscience';
import { LEGACY_THEORY_QUESTIONS } from './theory/legacy';
import { PHYSICS_THEORY_BANK } from './theory/physics';
import { SOCIAL_STUDIES_THEORY_BANK } from './theory/socialstudies';

function deduplicateTheoryQuestions(items: TheoryQuestion[]): TheoryQuestion[] {
  const seenIds = new Set<string>();
  const seenTitles = new Set<string>();
  const unique: TheoryQuestion[] = [];
  for (const item of items) {
    const titleKey = `${item.subject}::${item.title.trim().toLowerCase()}`;
    if (seenIds.has(item.id) || seenTitles.has(titleKey)) continue;
    seenIds.add(item.id);
    seenTitles.add(titleKey);
    unique.push(item);
  }
  return unique;
}

export const THEORY_QUESTIONS: TheoryQuestion[] = deduplicateTheoryQuestions([
  ...PHYSICS_THEORY_BANK,
  ...CHEMISTRY_THEORY_BANK,
  ...BIOLOGY_THEORY_BANK,
  ...ADDMATHS_THEORY_BANK,
  ...ICT_THEORY_BANK,
  ...COREMATH_THEORY_BANK,
  ...ENGLISH_THEORY_BANK,
  ...INTEGRATED_SCIENCE_THEORY_BANK,
  ...SOCIAL_STUDIES_THEORY_BANK,
  ...LEGACY_THEORY_QUESTIONS,
]);
