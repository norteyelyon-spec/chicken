import type { MCQQuestion } from '../types';

export const MCQS_CORE_SUBJECTS: MCQQuestion[] = [
  // CORE MATHEMATICS
  {
    id: 'coremath-s1-q1',
    subject: 'coremath',
    grade: 'SHS1',
    topicId: 'coremath-s1-sets',
    topicTitle: 'Sets, Venn Diagrams & Number Bases',
    yearTag: 'WASSCE Core Maths · 2023',
    prompt:
      'In a class of $40$ students, $25$ offer Core Chemistry and $22$ offer Core Biology. If every student offers at least one of the two subjects, how many students offer both subjects?',
    options: ['$3$', '$7$', '$15$', '$18$'],
    correctIndex: 1,
    stepByStepWorkings:
      'Using $n(C \\cup B) = n(C) + n(B) - n(C \\cap B)$:\n$40 = 25 + 22 - x \\implies x = 47 - 40 = 7$.',
    optionExplanations: [
      'Incorrect: $40 - 25 - 12$ is unrelated to the set intersection.',
      'Correct: $25 + 22 - 40 = 7$ students are counted in both sets.',
      'Incorrect: $15$ is $40 - 25$, which gives students offering Biology only.',
      'Incorrect: $18$ is $40 - 22$, which gives students offering Chemistry only.',
    ],
  },
  {
    id: 'coremath-s2-q1',
    subject: 'coremath',
    grade: 'SHS2',
    topicId: 'coremath-s2-geometry',
    topicTitle: 'Plane Geometry & Circle Theorems',
    yearTag: 'WASSCE Core Maths · 2022',
    prompt:
      'In a cyclic quadrilateral $PQRS$, $\\angle PQR = 112^\\circ$. Find $\\angle PSR$.',
    options: ['$56^\\circ$', '$68^\\circ$', '$78^\\circ$', '$112^\\circ$'],
    correctIndex: 1,
    stepByStepWorkings:
      'Opposite interior angles of a cyclic quadrilateral are supplementary (sum to $180^\\circ$):\n$\\angle PSR = 180^\\circ - 112^\\circ = 68^\\circ$.',
    optionExplanations: [
      'Incorrect: $56^\\circ$ halves $112^\\circ$, confusing angle-at-centre theorem.',
      'Correct: Opposite angles of a cyclic quadrilateral sum to $180^\\circ$, giving $180^\\circ - 112^\\circ = 68^\\circ$.',
      'Incorrect: Arithmetic subtraction error from $190^\\circ$ instead of $180^\\circ$.',
      'Incorrect: Opposite angles in a cyclic quadrilateral are supplementary, not equal.',
    ],
  },
  {
    id: 'coremath-s3-q1',
    subject: 'coremath',
    grade: 'SHS3',
    topicId: 'coremath-s3-business',
    topicTitle: 'Consumer & Financial Mathematics',
    yearTag: 'WASSCE Core Maths · 2024',
    prompt:
      'A machine bought for $\\text{GH₵ } 8{,}000$ depreciates at $10\\%$ per annum. Find its book value after $2$ years.',
    options: [
      '$\\text{GH₵ } 6{,}400$',
      '$\\text{GH₵ } 6{,}480$',
      '$\\text{GH₵ } 7{,}200$',
      '$\\text{GH₵ } 9{,}680$',
    ],
    correctIndex: 1,
    stepByStepWorkings:
      '$V = P\\left(1 - \\frac{r}{100}\\right)^n = 8000 \\times (0.9)^2 = 8000 \\times 0.81 = \\text{GH₵ } 6{,}480$.',
    optionExplanations: [
      'Incorrect: Uses simple $20\\%$ subtraction ($8000 \\times 0.8 = 6400$) instead of compound depreciation.',
      'Correct: Year 1 leaves $7200$; Year 2 reduces $7200$ by $10\\%$ ($720$) to $\\text{GH₵ } 6{,}480$.',
      'Incorrect: Gives the value after only $1$ year.',
      'Incorrect: Adds $10\\%$ compound growth instead of subtracting depreciation.',
    ],
  },

  // ENGLISH LANGUAGE
  {
    id: 'english-s1-q1',
    subject: 'english',
    grade: 'SHS1',
    topicId: 'english-s1-concord',
    topicTitle: 'Parts of Speech & Rules of Concord',
    yearTag: 'WASSCE English · 2023',
    prompt:
      'Choose the option that best completes the sentence: "Neither the Headmaster nor the senior prefects _____ aware of the sudden inspection."',
    options: ['was', 'is', 'were', 'has been'],
    correctIndex: 2,
    stepByStepWorkings:
      'Under the **proximity concord rule**, with "neither...nor", the verb agrees with the closer noun phrase ("the senior prefects", plural) -> plural verb **were**.',
    optionExplanations: [
      'Incorrect: "was" is singular and agrees with "Headmaster", violating proximity concord.',
      'Incorrect: "is" is singular present tense and does not agree with plural "prefects".',
      'Correct: Plural "were" agrees with the closer plural subject "the senior prefects".',
      'Incorrect: "has been" is singular.',
    ],
  },
  {
    id: 'english-s2-q1',
    subject: 'english',
    grade: 'SHS2',
    topicId: 'english-s2-oral',
    topicTitle: 'Oral English: Vowels, Consonants & Stress',
    yearTag: 'WASSCE Oral English · 2022',
    prompt:
      'In the sentence "KOFI drove his uncle’s new car to Tamale", where **KOFI** carries emphatic stress, which question does this sentence answer?',
    options: [
      'Did Kofi drive his father’s new car to Tamale?',
      'Did Ama drive his uncle’s new car to Tamale?',
      'Did Kofi wash his uncle’s new car in Tamale?',
      'Did Kofi drive his uncle’s old car to Tamale?',
    ],
    correctIndex: 1,
    stepByStepWorkings:
      'Emphatic stress highlights the ONLY contrasted element. Since **KOFI** is stressed, the implied question must substitute a different subject (**Ama**) while keeping all other words unchanged.',
    optionExplanations: [
      'Incorrect: Contrasts "father\'s" with "uncle\'s".',
      'Correct: Replaces only the stressed name **KOFI** with **Ama**.',
      'Incorrect: Contrasts the verb "wash" with "drove".',
      'Incorrect: Contrasts the adjective "old" with "new".',
    ],
  },
  {
    id: 'english-s3-q1',
    subject: 'english',
    grade: 'SHS3',
    topicId: 'english-s3-literature',
    topicTitle: 'Literary Appreciation & Figures of Speech',
    yearTag: 'WASSCE English · 2024',
    prompt:
      'Identify the dominant figure of speech in the line: "The classroom held a deafening silence after the exam results were announced."',
    options: ['Simile', 'Oxymoron', 'Euphemism', 'Onomatopoeia'],
    correctIndex: 1,
    stepByStepWorkings:
      '"Deafening" (extremely loud) and "silence" (complete absence of sound) are two contradictory words placed directly side by side, forming an **oxymoron**.',
    optionExplanations: [
      'Incorrect: Similes compare two unlike things using "like" or "as".',
      'Correct: Juxtaposing opposite concepts ("deafening" + "silence") is an oxymoron.',
      'Incorrect: Euphemism softens a harsh or taboo expression.',
      'Incorrect: Onomatopoeia imitates natural sounds (e.g., "buzz", "clang").',
    ],
  },

  // INTEGRATED SCIENCE
  {
    id: 'intsci-s1-q1',
    subject: 'integratedscience',
    grade: 'SHS1',
    topicId: 'intsci-s1-acidsbases',
    topicTitle: 'Acids, Bases, Salts & Soap Making',
    yearTag: 'WASSCE Int. Science · 2023',
    prompt:
      'During traditional Ghanaian black soap preparation (Alata Samina), potassium hydroxide leached from roasted cocoa pod ash reacts with heated palm kernel oil. What is this chemical reaction called?',
    options: ['Esterification', 'Saponification', 'Fermentation', 'Polymerization'],
    correctIndex: 1,
    stepByStepWorkings:
      'Alkaline hydrolysis of triglyceride fats/oils using $\\text{KOH}$ or $\\text{NaOH}$ yields carboxylate salts (soap) and glycerol; this process is **saponification**.',
    optionExplanations: [
      'Incorrect: Esterification forms an ester from a carboxylic acid and an alcohol.',
      'Correct: Hydrolysis of oil with alkali to form soap and glycerol is saponification.',
      'Incorrect: Fermentation converts sugars into ethanol or organic acids via yeast/bacteria.',
      'Incorrect: Polymerization links small monomers into long-chain polymers.',
    ],
  },
  {
    id: 'intsci-s2-q1',
    subject: 'integratedscience',
    grade: 'SHS2',
    topicId: 'intsci-s2-machines',
    topicTitle: 'Force, Energy & Simple Machines',
    yearTag: 'WASSCE Int. Science · 2022',
    prompt:
      'A pulley system of velocity ratio $4$ requires an effort of $150\\text{ N}$ to lift a load of $480\\text{ N}$. Calculate the efficiency of the machine.',
    options: ['$60\\%$', '$75\\%$', '$80\\%$', '$85\\%$'],
    correctIndex: 2,
    stepByStepWorkings:
      'Mechanical Advantage $MA = \\frac{\\text{Load}}{\\text{Effort}} = \\frac{480}{150} = 3.2$.\nEfficiency $\\eta = \\frac{MA}{VR} \\times 100\\% = \\frac{3.2}{4} \\times 100\\% = 80\\%$.',
    optionExplanations: [
      'Incorrect: Results from dividing $480 / (150 \\times 5)$ or wrong VR.',
      'Incorrect: Corresponds to $MA = 3.0$, whereas $480 / 150 = 3.2$.',
      'Correct: $MA = 3.2$ and $\\eta = (3.2 / 4) \\times 100\\% = 80\\%$.',
      'Incorrect: Arithmetic error.',
    ],
  },
  {
    id: 'intsci-s3-q1',
    subject: 'integratedscience',
    grade: 'SHS3',
    topicId: 'intsci-s3-electricity',
    topicTitle: 'Electricity, Electronics & Domestic Safety',
    yearTag: 'WASSCE Int. Science · 2024',
    prompt:
      'A $2{,}000\\text{ W}$ electric iron is used for $3\\text{ hours}$ daily for $5\\text{ days}$. If $1\\text{ kWh}$ costs $\\text{GH₵ } 1.50$, find the total electricity cost.',
    options: [
      '$\\text{GH₵ } 15.00$',
      '$\\text{GH₵ } 30.00$',
      '$\\text{GH₵ } 45.00$',
      '$\\text{GH₵ } 60.00$',
    ],
    correctIndex: 2,
    stepByStepWorkings:
      'Power in kW $= 2000 / 1000 = 2\\text{ kW}$.\nTotal time $= 3 \\times 5 = 15\\text{ hours}$.\nEnergy $= 2 \\times 15 = 30\\text{ kWh}$.\nCost $= 30 \\times 1.50 = \\text{GH₵ } 45.00$.',
    optionExplanations: [
      'Incorrect: Only computes energy for $5$ days at $1\\text{ hour/day}$ or forgets rate.',
      'Incorrect: $30$ is the energy in kWh, before multiplying by $\\text{GH₵ } 1.50$.',
      'Correct: $2\\text{ kW} \\times 15\\text{ h} = 30\\text{ kWh}$; $30 \\times 1.50 = \\text{GH₵ } 45.00$.',
      'Incorrect: Overestimates power or hours.',
    ],
  },

  // SOCIAL STUDIES
  {
    id: 'soc-s1-q1',
    subject: 'socialstudies',
    grade: 'SHS1',
    topicId: 'soc-s1-environment',
    topicTitle: 'The Environment & Resource Conservation',
    yearTag: 'WASSCE Social Studies · 2023',
    prompt:
      'Which combination best explains why illegal alluvial mining (*galamsey*) severely threatens Ghana’s cocoa production and freshwater supply?',
    options: [
      'Increased annual rainfall and soil nitrogen enrichment',
      'Mercury/cyanide water contamination and destruction of arable farmland',
      'Expansion of forest reserves and lower river turbidity',
      'Improved soil aeration and natural siltation',
    ],
    correctIndex: 1,
    stepByStepWorkings:
      'Unregulated alluvial mining introduces toxic heavy metals (mercury, arsenic) into rivers like the Pra and Ankobra, raises turbidity, and strips fertile topsoil used for cocoa cultivation.',
    optionExplanations: [
      'Incorrect: Mining does not enrich soil nitrogen or increase rainfall beneficially.',
      'Correct: Heavy-metal chemical contamination and topsoil destruction directly threaten freshwater treatment and cocoa farms.',
      'Incorrect: Mining reduces forest cover and sharply increases water turbidity.',
      'Incorrect: Heavy compaction and toxic tailings degrade soil fertility.',
    ],
  },
  {
    id: 'soc-s2-q1',
    subject: 'socialstudies',
    grade: 'SHS2',
    topicId: 'soc-s2-governance',
    topicTitle: 'Democracy, Rule of Law & the 1992 Constitution',
    yearTag: 'WASSCE Social Studies · 2022',
    prompt:
      'Under Ghana’s 1992 Constitution, which independent constitutional body is mandated to investigate complaints of fundamental human rights violations and administrative injustice?',
    options: [
      'Electoral Commission (EC)',
      'Commission on Human Rights and Administrative Justice (CHRAJ)',
      'National Commission for Civic Education (NCCE)',
      'Public Utilities Regulatory Commission (PURC)',
    ],
    correctIndex: 1,
    stepByStepWorkings:
      'Chapter 18 of the 1992 Constitution establishes **CHRAJ** as Ghana’s ombudsman, anti-corruption agency, and human rights protection commission.',
    optionExplanations: [
      'Incorrect: The EC conducts public elections and referenda.',
      'Correct: CHRAJ investigates human rights abuses, corruption, and administrative injustice.',
      'Incorrect: The NCCE focuses on civic education and constitutional awareness.',
      'Incorrect: PURC regulates electricity and water utility tariffs.',
    ],
  },
  {
    id: 'soc-s3-q1',
    subject: 'socialstudies',
    grade: 'SHS3',
    topicId: 'soc-s3-peace',
    topicTitle: 'Peace Building, Conflict Resolution & Global Cooperation',
    yearTag: 'WASSCE Social Studies · 2024',
    prompt:
      'Which conflict resolution method relies on a neutral third party who listens to both disputing factions and delivers a legally binding decision?',
    options: ['Negotiation', 'Mediation', 'Arbitration', 'Avoidance'],
    correctIndex: 2,
    stepByStepWorkings:
      'Unlike mediation (where the third party facilitates voluntary agreement), **arbitration** empowers the neutral arbitrator to issue a binding award.',
    optionExplanations: [
      'Incorrect: Negotiation takes place directly between the parties without a third-party adjudicator.',
      'Incorrect: Mediators help parties reach a voluntary compromise without imposing a binding verdict.',
      'Correct: Arbitration produces a binding determination by an impartial third party.',
      'Incorrect: Avoidance ignores rather than resolves the underlying conflict.',
    ],
  },
];
