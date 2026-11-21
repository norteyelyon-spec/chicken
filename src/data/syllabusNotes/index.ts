import type { StudyNote } from '../../types';
import { BIOLOGY_SYLLABUS_NOTES } from './biology';
import { CHEMISTRY_PDF_NOTES } from './chemistryExtended';
import { COMPREHENSIVE_CURRICULUM_NOTES } from './comprehensiveCurriculum';
import { CORE_MATH_ENGLISH_SYLLABUS_NOTES } from './coreMathEnglish';
import { CORE_SCIENCE_SOCIAL_SYLLABUS_NOTES } from './coreScienceSocial';
import { EXTENDED_SYLLABUS_NOTES } from './extendedSubjects';
import { MASTER_GUIDE_ADDITION_NOTES } from './masterGuideAdditions';
import { MATHS_ICT_SYLLABUS_NOTES } from './mathsIct';
import { PHYSICS_CHEM_SYLLABUS_NOTES } from './physicsChem';

export const SYLLABUS_NOTES: StudyNote[] = [
  ...BIOLOGY_SYLLABUS_NOTES,
  ...PHYSICS_CHEM_SYLLABUS_NOTES,
  ...CHEMISTRY_PDF_NOTES,
  ...MATHS_ICT_SYLLABUS_NOTES,
  ...CORE_MATH_ENGLISH_SYLLABUS_NOTES,
  ...CORE_SCIENCE_SOCIAL_SYLLABUS_NOTES,
  ...EXTENDED_SYLLABUS_NOTES,
  ...COMPREHENSIVE_CURRICULUM_NOTES,
  ...MASTER_GUIDE_ADDITION_NOTES,
];


