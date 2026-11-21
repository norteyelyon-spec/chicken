import type { MCQQuestion, StudyNote, SubjectId, TheoryQuestion } from '../types';

export const CURRICULUM_TOTALS = {
  mcqs: 490,
  theory: 424,
  notes: 169,
} as const;

const mcqCache = new Map<SubjectId, MCQQuestion[]>();
const mcqInflight = new Map<SubjectId, Promise<MCQQuestion[]>>();

const theoryCache = new Map<SubjectId, TheoryQuestion[]>();
const theoryInflight = new Map<SubjectId, Promise<TheoryQuestion[]>>();

let notesCache: StudyNote[] | null = null;
let notesInflight: Promise<StudyNote[]> | null = null;

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

function deduplicateTheory(items: TheoryQuestion[]): TheoryQuestion[] {
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

async function importSubjectMcqBank(subject: SubjectId): Promise<MCQQuestion[]> {
  switch (subject) {
    case 'physics': {
      const [primary, legacy] = await Promise.all([
        import('./mcq/physics'),
        import('./mcqsPhysicsChem'),
      ]);
      return [...primary.PHYSICS_MCQS, ...legacy.MCQS_PHYSICS_CHEM.filter((q) => q.subject === 'physics')];
    }
    case 'chemistry': {
      const [primary, legacy] = await Promise.all([
        import('./mcq/chemistry'),
        import('./mcqsPhysicsChem'),
      ]);
      return [...primary.CHEMISTRY_MCQS, ...legacy.MCQS_PHYSICS_CHEM.filter((q) => q.subject === 'chemistry')];
    }
    case 'biology': {
      const [primary, legacy] = await Promise.all([
        import('./mcq/biology'),
        import('./mcqsBioMathIct'),
      ]);
      return [...primary.BIOLOGY_MCQS, ...legacy.MCQS_BIO_MATH_ICT.filter((q) => q.subject === 'biology')];
    }
    case 'addmaths': {
      const [primary, legacy] = await Promise.all([
        import('./mcq/addmaths'),
        import('./mcqsBioMathIct'),
      ]);
      return [...primary.ADDMATHS_MCQS, ...legacy.MCQS_BIO_MATH_ICT.filter((q) => q.subject === 'addmaths')];
    }
    case 'ict': {
      const [primary, legacy] = await Promise.all([
        import('./mcq/ict'),
        import('./mcqsBioMathIct'),
      ]);
      return [...primary.ICT_MCQS, ...legacy.MCQS_BIO_MATH_ICT.filter((q) => q.subject === 'ict')];
    }
    case 'coremath': {
      const [primary, legacy] = await Promise.all([
        import('./mcq/coremath'),
        import('./mcqsCoreSubjects'),
      ]);
      return [...primary.COREMATH_MCQS, ...legacy.MCQS_CORE_SUBJECTS.filter((q) => q.subject === 'coremath')];
    }
    case 'english': {
      const [primary, legacy] = await Promise.all([
        import('./mcq/english'),
        import('./mcqsCoreSubjects'),
      ]);
      return [...primary.ENGLISH_MCQS, ...legacy.MCQS_CORE_SUBJECTS.filter((q) => q.subject === 'english')];
    }
    case 'integratedscience': {
      const [primary, legacy] = await Promise.all([
        import('./mcq/integratedscience'),
        import('./mcqsCoreSubjects'),
      ]);
      return [
        ...primary.INTEGRATED_SCIENCE_MCQS,
        ...legacy.MCQS_CORE_SUBJECTS.filter((q) => q.subject === 'integratedscience'),
      ];
    }
    case 'socialstudies': {
      const [primary, legacy] = await Promise.all([
        import('./mcq/socialstudies'),
        import('./mcqsCoreSubjects'),
      ]);
      return [
        ...primary.SOCIAL_STUDIES_MCQS,
        ...legacy.MCQS_CORE_SUBJECTS.filter((q) => q.subject === 'socialstudies'),
      ];
    }
  }
}

async function importSubjectTheoryBank(subject: SubjectId): Promise<TheoryQuestion[]> {
  const legacyPromise = import('./theory/legacy');
  let primaryList: TheoryQuestion[] = [];

  switch (subject) {
    case 'physics':
      primaryList = (await import('./theory/physics')).PHYSICS_THEORY_BANK;
      break;
    case 'chemistry':
      primaryList = (await import('./theory/chemistry')).CHEMISTRY_THEORY_BANK;
      break;
    case 'biology':
      primaryList = (await import('./theory/biology')).BIOLOGY_THEORY_BANK;
      break;
    case 'addmaths':
      primaryList = (await import('./theory/addmaths')).ADDMATHS_THEORY_BANK;
      break;
    case 'ict':
      primaryList = (await import('./theory/ict')).ICT_THEORY_BANK;
      break;
    case 'coremath':
      primaryList = (await import('./theory/coremath')).COREMATH_THEORY_BANK;
      break;
    case 'english':
      primaryList = (await import('./theory/english')).ENGLISH_THEORY_BANK;
      break;
    case 'integratedscience':
      primaryList = (await import('./theory/integratedscience')).INTEGRATED_SCIENCE_THEORY_BANK;
      break;
    case 'socialstudies':
      primaryList = (await import('./theory/socialstudies')).SOCIAL_STUDIES_THEORY_BANK;
      break;
  }

  const legacy = await legacyPromise;
  return deduplicateTheory([
    ...primaryList,
    ...legacy.LEGACY_THEORY_QUESTIONS.filter((q) => q.subject === subject),
  ]);
}

export async function loadMcqsForSubject(subject: SubjectId): Promise<MCQQuestion[]> {
  const cached = mcqCache.get(subject);
  if (cached) return cached;

  const existingPromise = mcqInflight.get(subject);
  if (existingPromise) return existingPromise;

  const promise = importSubjectMcqBank(subject)
    .then((items) => {
      const deduped = deduplicateMCQs(items);
      mcqCache.set(subject, deduped);
      mcqInflight.delete(subject);
      return deduped;
    })
    .catch((err) => {
      mcqInflight.delete(subject);
      throw err;
    });

  mcqInflight.set(subject, promise);
  return promise;
}

export async function loadMcqsForSubjects(subjects: SubjectId[]): Promise<MCQQuestion[]> {
  const uniqueSubs = Array.from(new Set(subjects));
  const lists = await Promise.all(uniqueSubs.map((sub) => loadMcqsForSubject(sub)));
  return deduplicateMCQs(lists.flat());
}

export async function loadTheoryForSubject(subject: SubjectId): Promise<TheoryQuestion[]> {
  const cached = theoryCache.get(subject);
  if (cached) return cached;

  const existingPromise = theoryInflight.get(subject);
  if (existingPromise) return existingPromise;

  const promise = importSubjectTheoryBank(subject)
    .then((items) => {
      theoryCache.set(subject, items);
      theoryInflight.delete(subject);
      return items;
    })
    .catch((err) => {
      theoryInflight.delete(subject);
      throw err;
    });

  theoryInflight.set(subject, promise);
  return promise;
}

export function getCachedMcqsForSubject(subject: SubjectId): MCQQuestion[] | null {
  return mcqCache.get(subject) ?? null;
}

export function getAllCachedMcqs(): MCQQuestion[] {
  return deduplicateMCQs(Array.from(mcqCache.values()).flat());
}

export function getCachedTheoryForSubject(subject: SubjectId): TheoryQuestion[] | null {
  return theoryCache.get(subject) ?? null;
}

export async function loadAllSyllabusNotes(): Promise<StudyNote[]> {
  if (notesCache) return notesCache;
  if (notesInflight) return notesInflight;

  notesInflight = import('./syllabusNotes/index')
    .then((mod) => {
      notesCache = mod.SYLLABUS_NOTES;
      notesInflight = null;
      return notesCache;
    })
    .catch((err) => {
      notesInflight = null;
      throw err;
    });

  return notesInflight;
}

export function getCachedSyllabusNotes(): StudyNote[] | null {
  return notesCache;
}
