import { ADDMATHS_MCQS } from './mcq/addmaths';
import { BIOLOGY_MCQS } from './mcq/biology';
import { CHEMISTRY_MCQS } from './mcq/chemistry';
import { COREMATH_MCQS } from './mcq/coremath';
import { ENGLISH_MCQS } from './mcq/english';
import { ICT_MCQS } from './mcq/ict';
import { INTEGRATED_SCIENCE_MCQS } from './mcq/integratedscience';
import { PHYSICS_MCQS } from './mcq/physics';
import { SOCIAL_STUDIES_MCQS } from './mcq/socialstudies';
import { MCQS_BIO_MATH_ICT } from './mcqsBioMathIct';
import { MCQS_CORE_SUBJECTS } from './mcqsCoreSubjects';
import { MCQS_PHYSICS_CHEM } from './mcqsPhysicsChem';
import type { MCQQuestion } from '../types';

function deduplicateMCQs(items: MCQQuestion[]): MCQQuestion[] {
  const seenIds = new Set<string>();
  const seenPrompts = new Set<string>();
  const unique: MCQQuestion[] = [];
  for (const item of items) {
    const promptKey = `${item.subject}::${item.prompt.trim().toLowerCase()}`;
    if (seenIds.has(item.id) || seenPrompts.has(promptKey)) continue;
    seenIds.add(item.id);
    seenPrompts.add(promptKey);
    unique.push(item);
  }
  return unique;
}

export const ALL_MCQ_QUESTIONS: MCQQuestion[] = deduplicateMCQs([
  ...PHYSICS_MCQS,
  ...CHEMISTRY_MCQS,
  ...BIOLOGY_MCQS,
  ...ADDMATHS_MCQS,
  ...ICT_MCQS,
  ...COREMATH_MCQS,
  ...ENGLISH_MCQS,
  ...INTEGRATED_SCIENCE_MCQS,
  ...SOCIAL_STUDIES_MCQS,
  ...MCQS_PHYSICS_CHEM,
  ...MCQS_BIO_MATH_ICT,
  ...MCQS_CORE_SUBJECTS,
]);
