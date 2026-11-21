import type { StudyNote } from '../types/index.ts';

export interface VideoCheckpointQuestion {
  prompt: string;
  options: [string, string, string, string];
  correctIndex: 0 | 1 | 2 | 3;
  explanation: string;
}

export interface VideoNarrationSegment {
  text: string;
  keyPointIndex: number | null;
  startFrac: number;
  endFrac: number;
}

export type Video3DVisualKind =
  | 'atom-orbitals'
  | 'mechanics-projectile'
  | 'waves-optics'
  | 'circuits-em'
  | 'geometry-solids'
  | 'calculus-surface'
  | 'chemistry-molecules'
  | 'biology-cell-organ'
  | 'ict-network-logic'
  | 'grammar-pillars'
  | 'governance-scale';

export interface FormulaBreakdownItem {
  formula: string;
  meaning: string;
  variables: string[];
  spokenExplanation: string;
}

export interface VideoLessonScene {
  id: string;
  index: number;
  title: string;
  intuitionHook: string;
  visual3DKind: Video3DVisualKind;
  narration: string;
  narrationSegments?: VideoNarrationSegment[];
  keyPoints: string[];
  equations: string[];
  formulaBreakdowns?: FormulaBreakdownItem[];
  durationSeconds: number;
  visualBadge: string;
  checkpoint?: VideoCheckpointQuestion;
}

export interface DimensionRowSpec {
  id: string;
  name: string;
  formula: string;
  unit: string;
  m: number;
  l: number;
  t: number;
}

export const DIMENSION_REFERENCE_ITEMS: DimensionRowSpec[] = [
  { id: 'velocity', name: 'Velocity / Speed', formula: 'v = s / t', unit: 'm s⁻¹', m: 0, l: 1, t: -1 },
  { id: 'acceleration', name: 'Acceleration', formula: 'a = Δv / t', unit: 'm s⁻²', m: 0, l: 1, t: -2 },
  { id: 'force', name: 'Force / Weight / Tension', formula: 'F = m × a', unit: 'N (kg m s⁻²)', m: 1, l: 1, t: -2 },
  { id: 'momentum', name: 'Linear Momentum / Impulse', formula: 'p = m × v', unit: 'kg m s⁻¹', m: 1, l: 1, t: -1 },
  { id: 'work', name: 'Work / Energy / Torque', formula: 'W = F × d', unit: 'J (kg m² s⁻²)', m: 1, l: 2, t: -2 },
  { id: 'power', name: 'Power', formula: 'P = W / t', unit: 'W (J s⁻¹)', m: 1, l: 2, t: -3 },
  { id: 'pressure', name: 'Pressure / Stress', formula: 'P = F / A', unit: 'Pa (N m⁻²)', m: 1, l: -1, t: -2 },
  { id: 'density', name: 'Density', formula: 'ρ = m / V', unit: 'kg m⁻³', m: 1, l: -3, t: 0 },
  { id: 'frequency', name: 'Frequency', formula: 'f = 1 / T', unit: 'Hz (s⁻¹)', m: 0, l: 0, t: -1 },
  { id: 'surface-tension', name: 'Surface Tension', formula: 'γ = F / L', unit: 'N m⁻¹', m: 1, l: 0, t: -2 },
  { id: 'viscosity', name: 'Coefficient of Viscosity (η)', formula: 'η = F / (A · Δv/Δy)', unit: 'Pa s', m: 1, l: -1, t: -1 },
  { id: 'planck', name: "Planck's Constant (h)", formula: 'h = E / f', unit: 'J s', m: 1, l: 2, t: -1 },
  { id: 'gravity-g', name: 'Gravitational Constant (G)', formula: 'G = F·r² / (m₁·m₂)', unit: 'N m² kg⁻²', m: -1, l: 3, t: -2 },
];

export function matchDimensionalQuantity(m: number, l: number, t: number): DimensionRowSpec | null {
  return DIMENSION_REFERENCE_ITEMS.find((d) => d.m === m && d.l === l && d.t === t) ?? null;
}

function cleanMarkdownLine(raw: string): string {
  return raw
    .replace(/\*\*/g, '')
    .replace(/`/g, '')
    .replace(/\\text\{([^}]*)\}/g, '$1')
    .replace(/\\frac\{([^}]*)\}\{([^}]*)\}/g, '($1)/($2)')
    .replace(/\\(?:l|c|v)?dots/g, '...')
    .replace(/\\times/g, '×')
    .replace(/\\cdot/g, '·')
    .replace(/\\pm/g, '±')
    .replace(/\\approx/g, '≈')
    .replace(/\\leq/g, '≤')
    .replace(/\\geq/g, '≥')
    .replace(/\\neq/g, '≠')
    .replace(/\\alpha/g, 'α')
    .replace(/\\beta/g, 'β')
    .replace(/\\gamma/g, 'γ')
    .replace(/\\theta/g, 'θ')
    .replace(/\\lambda/g, 'λ')
    .replace(/\\Delta/g, 'Δ')
    .replace(/\^\\circ|\\degree/g, '°')
    .replace(/\\implies/g, '⇒')
    .replace(/\\rightarrow/g, '→')
    .replace(/\\left|\\right/g, '')
    .replace(/\$/g, '')
    .trim();
}

export function markdownToPlainSpeech(raw: string): string {
  return raw
    .replace(/\$\$([^$]+)\$\$/g, ' $1 ')
    .replace(/\$([^$]+)\$/g, ' $1 ')
    .replace(/\\frac\{([^}]*)\}\{([^}]*)\}/g, '$1 over $2')
    .replace(/\\(?:l|c|v)?dots/g, ' and so on ')
    .replace(/\\times/g, ' times ')
    .replace(/\\cdot/g, ' dot ')
    .replace(/\\sqrt\{([^}]*)\}/g, 'square root of $1')
    .replace(/\\text\{([^}]*)\}/g, '$1')
    .replace(/\\left|\\right/g, '')
    .replace(/\\rightarrow|\\implies/g, ' leads to ')
    .replace(/\\approx/g, ' approximately equals ')
    .replace(/\\pm/g, ' plus or minus ')
    .replace(/\\Delta/g, 'delta ')
    .replace(/\\alpha/g, 'alpha ')
    .replace(/\\beta/g, 'beta ')
    .replace(/\\gamma/g, 'gamma ')
    .replace(/\\theta/g, 'theta ')
    .replace(/\\lambda/g, 'lambda ')
    .replace(/\^\\circ|\\degree/g, ' degrees')
    .replace(/[#*_`>|~]/g, ' ')
    .replace(/\s+/g, ' ')
    .replace(/\.{2,}/g, '.')
    .trim();
}

function ensureSentence(text: string): string {
  const trimmed = text.trim();
  if (!trimmed) return '';
  return /[.!?]$/.test(trimmed) ? trimmed : `${trimmed}.`;
}

function buildDomainCheckpoint(noteId: string, sceneTitle: string, index: number): VideoCheckpointQuestion | undefined {
  const lower = sceneTitle.toLowerCase();

  if (noteId === 'note-phys-dimensions' || lower.includes('dimension')) {
    if (lower.includes('fundamental') || index === 0) {
      return {
        prompt: 'Which set contains ONLY fundamental (base) quantities in mechanics?',
        options: [
          'Mass, Length, and Time',
          'Force, Mass, and Velocity',
          'Mass, Density, and Acceleration',
          'Energy, Length, and Time',
        ],
        correctIndex: 0,
        explanation: 'In mechanics, Mass (M), Length (L), and Time (T) are independent fundamental quantities; Force, Velocity, Density, and Energy are derived.',
      };
    }
    if (lower.includes('formula') || lower.includes('table') || lower.includes('notation')) {
      return {
        prompt: 'What is the correct dimensional formula for Power ($P = W/t$)?',
        options: ['[M L² T⁻²]', '[M L² T⁻³]', '[M L⁻¹ T⁻²]', '[M L T⁻²]'],
        correctIndex: 1,
        explanation: 'Work has dimensions [M L² T⁻²]. Dividing by Time [T] yields [M L² T⁻³].',
      };
    }
    if (lower.includes('homogeneity')) {
      return {
        prompt: 'Why is the equation $v = u + at^2$ dimensionally invalid?',
        options: [
          'u and v have different units',
          'at² has dimensions [L], which cannot be added to velocity [L T⁻¹]',
          'Acceleration is dimensionless',
          'Time cannot be squared in physics equations',
        ],
        correctIndex: 1,
        explanation: 'By the Principle of Homogeneity, [v] = [L T⁻¹] and [u] = [L T⁻¹], whereas [at²] = [L T⁻²][T²] = [L]. Quantities with different dimensions cannot be added.',
      };
    }
    if (lower.includes('uses') || lower.includes('major')) {
      return {
        prompt: 'Using $1\\text{ N} = 10^5\\text{ dynes}$, what are the dimensions of Gravitational Constant $G$?',
        options: ['[M⁻¹ L³ T⁻²]', '[M L³ T⁻²]', '[M⁻¹ L² T⁻²]', '[M L² T⁻¹]'],
        correctIndex: 0,
        explanation: 'From G = F r² / (m₁ m₂): [G] = ([M L T⁻²][L²]) / [M²] = [M⁻¹ L³ T⁻²].',
      };
    }
    if (lower.includes('limitation')) {
      return {
        prompt: 'Which limitation applies to dimensional analysis?',
        options: [
          'It cannot verify homogeneity of mechanical equations',
          'It cannot convert SI units into CGS units',
          'It cannot determine dimensionless constants like 1/2 or 6π',
          'It cannot find dimensions of Planck’s constant h',
        ],
        correctIndex: 2,
        explanation: 'Dimensional analysis only compares base powers [M^a L^b T^c]; dimensionless numerical constants like 1/2, k, or 6π must be found experimentally.',
      };
    }
  }

  if (noteId.startsWith('note-chem-atomic') || lower.includes('atomic') || lower.includes('dalton') || lower.includes('rutherford') || lower.includes('quantum')) {
    if (lower.includes('dalton')) {
      return {
        prompt: 'Which discovery directly refuted Dalton’s postulate that atoms of the same element are identical in mass?',
        options: ['Isotopes (e.g., ¹²C and ¹⁴C)', 'Law of Definite Proportions', 'Covalent bonding', 'Cathode anode metal invariance'],
        correctIndex: 0,
        explanation: 'Isotopes of the same element have identical atomic number Z but different neutron counts and masses.',
      };
    }
    if (lower.includes('thomson') || lower.includes('cathode')) {
      return {
        prompt: 'What did J.J. Thomson conclude from finding the exact same e/m ratio across different gases and cathodes?',
        options: [
          'Electrons are universal subatomic constituents of all matter',
          'Atoms have a dense central nucleus',
          'Mass is concentrated in neutrons',
          'Energy levels are quantized',
        ],
        correctIndex: 0,
        explanation: 'Because every gas and metal cathode emitted particles with e/m = 1.76 × 10¹¹ C kg⁻¹, electrons exist in all atoms.',
      };
    }
    if (lower.includes('rutherford')) {
      return {
        prompt: 'In Rutherford’s gold foil experiment, what did ~1 in 8,000 alpha particles bouncing back (>90°) prove?',
        options: [
          'Atoms are uniform positive spheres',
          'Almost all mass and positive charge sit in a tiny dense nucleus',
          'Electrons occupy spherical 1s orbitals',
          'Neutrons carry a +1 charge',
        ],
        correctIndex: 1,
        explanation: 'Only a compact, massive, positively charged nucleus can exert enough electrostatic repulsion to reverse an energetic alpha particle.',
      };
    }
    if (lower.includes('bohr')) {
      return {
        prompt: 'According to Bohr’s model, when is a photon emitted by an atom?',
        options: [
          'While an electron stays in a ground stationary orbit',
          'When an electron jumps from a higher shell to a lower shell',
          'Only during alpha scattering',
          'When protons leave the nucleus',
        ],
        correctIndex: 1,
        explanation: 'A photon of energy ΔE = E_upper - E_lower = hf is emitted when an excited electron drops to a lower energy level.',
      };
    }
    if (lower.includes('isotope') || lower.includes('spectrometer')) {
      return {
        prompt: 'Which ions experience the greatest magnetic deflection inside a mass spectrometer?',
        options: [
          'Heaviest +1 ions with the largest m/z ratio',
          'Lightest ions with the lowest mass-to-charge ratio (m/z)',
          'Neutral un-ionized atoms entering the flight tube',
          'Ions stopped before the electric accelerator plates',
        ],
        correctIndex: 1,
        explanation: 'Magnetic deflection angle increases as mass-to-charge ratio (m/z) decreases; lighter ions bend most sharply.',
      };
    }
    if (lower.includes('quantum') || lower.includes('exception') || lower.includes('aufbau') || lower.includes('orbital')) {
      return {
        prompt: 'Which ground-state subshell configuration correctly represents Chromium (₂₄Cr)?',
        options: [
          '[Ar] 3d⁴ 4s²',
          '[Ar] 3d⁵ 4s¹',
          '[Ar] 3d⁶ 4s⁰',
          '[Ar] 3d³ 4s² 4p¹',
        ],
        correctIndex: 1,
        explanation: 'Chromium promotes one 4s electron to achieve extra exchange stability in a half-filled 3d⁵ subshell: [Ar] 3d⁵ 4s¹.',
      };
    }
  }

  // Year 1 Chemistry PDF Masterclasses: Lab Safety, Compatibility Storage, Scientific Method, Mass Spec & Radioactivity
  if (noteId.includes('chem-s1-') || lower.includes('hazard') || lower.includes('compatibility') || lower.includes('radioactiv')) {
    if (lower.includes('safety') || lower.includes('hazard') || lower.includes('pictogram') || lower.includes('ppe')) {
      return {
        prompt: 'When diluting concentrated H₂SO₄ in the chemistry laboratory, what is the mandatory safe procedure?',
        options: [
          'Add concentrated acid slowly into cold water while stirring continuously',
          'Pour cold water quickly into the bottle of concentrated acid',
          'Heat the acid before adding tap water',
          'Taste a dilute drop to verify pH instead of using litmus',
        ],
        correctIndex: 0,
        explanation: 'Adding acid slowly to water lets water’s high heat capacity absorb exothermic dilution heat safely without boiling/splattering.',
      };
    }
    if (lower.includes('compatibility') || lower.includes('storage') || lower.includes('fire')) {
      return {
        prompt: 'Why must chemicals be stored by chemical compatibility rather than strict alphabetical order?',
        options: [
          'Alphabetical order places reactive incompatibles like Acetic Acid and Acetone or oxidizers and flammables side-by-side',
          'Alphabetical shelves collapse under heavy glass bottles',
          'Inorganic acids evaporate faster when alphabetized',
          'Compatibility charts only apply to solid metals',
        ],
        correctIndex: 0,
        explanation: 'Storing by hazard compatibility prevents leaks or broken bottles from triggering violent exothermic reactions, toxic gas, or fire.',
      };
    }
    if (lower.includes('radioactiv') || lower.includes('decay') || lower.includes('half-life') || lower.includes('nuclide')) {
      return {
        prompt: 'A radioactive isotope has a half-life of 6 hours. Starting with 80 g, what mass remains undecayed after 18 hours?',
        options: ['10 g', '20 g', '40 g', '5 g'],
        correctIndex: 0,
        explanation: '18 hours ÷ 6 hours = 3 half-lives. Mass remaining = 80 × (1/2)³ = 80 / 8 = 10 g.',
      };
    }
    if (lower.includes('mass spec') || lower.includes('isotope') || lower.includes('relative atomic')) {
      return {
        prompt: 'Which component in a mass spectrometer separates positive ions strictly according to their mass-to-charge ratio (m/z)?',
        options: [
          'Electromagnet (deflection magnetic field)',
          'Heated filament vaporizer',
          'Vacuum pump exhaust',
          'Graphite paper strip',
        ],
        correctIndex: 0,
        explanation: 'The magnetic field deflects lighter ions (smaller m/z) through a tighter curve than heavier ions of equal charge.',
      };
    }
    if (lower.includes('ghana') || lower.includes('branch') || lower.includes('daily life')) {
      return {
        prompt: 'Which Ghanaian institution uses chemical treatment (coagulation, filtration, chlorination) to supply potable water?',
        options: [
          'Ghana Water Company stations such as Weija and Kpong',
          'Tema Oil Refinery cracker tower only',
          'Cocoa Marketing Board warehouses only',
          'National Sports Authority',
        ],
        correctIndex: 0,
        explanation: 'Treatment plants at Weija and Kpong apply applied chemistry (alum coagulation, rapid sand filtration, and chlorination) for safe drinking water.',
      };
    }
  }

  // Year 1 Biology PDF 1: Introduction to Biology, Scientific Method, Symmetry & Drawings
  if (noteId === 'note-bio-s1-intro-pdf' || lower.includes('symmetry') || lower.includes('scientific method') || lower.includes('drawing')) {
    if (lower.includes('branches') || index === 0) {
      return {
        prompt: 'Which specialized branch of biology specifically studies fungi such as mushrooms and yeast?',
        options: ['Mycology', 'Histology', 'Cytology', 'Ornithology'],
        correctIndex: 0,
        explanation: 'Mycology is the study of fungi, whereas Cytology studies cells, Histology studies tissues, and Ornithology studies birds.',
      };
    }
    if (lower.includes('everyday') || lower.includes('importance')) {
      return {
        prompt: 'In traditional Ghanaian food preservation, how does salting tilapia to make "koobi" prevent spoilage?',
        options: [
          'It creates an unfavourable hypertonic/high-salt environment that dehydrates microbes',
          'It raises moisture content to accelerate bacterial growth',
          'It converts glucose into alcoholic palm wine',
          'It eliminates the need for any hygiene',
        ],
        correctIndex: 0,
        explanation: 'Heavy salting draws water out of spoilage bacteria by osmosis, arresting microbial growth.',
      };
    }
    if (lower.includes('scientific method') || lower.includes('reasoning')) {
      return {
        prompt: 'Which example demonstrates DEDUCTIVE (top-down) reasoning in Biology?',
        options: [
          'All mammals give birth to live young; sheep are mammals; therefore sheep give birth to live young',
          'Davi Dzifa has grey hair, so all grandmothers have grey hair',
          'Guessing an outcome before reading literature',
          'Drawing a specimen without a title',
        ],
        correctIndex: 0,
        explanation: 'Deductive reasoning applies a verified general rule (all mammals) to reach a certain conclusion for a specific case (sheep).',
      };
    }
    if (lower.includes('symmetry') || lower.includes('orientation')) {
      return {
        prompt: 'Which set of specimens exhibits RADIAL symmetry (divisible along multiple planes through the centre)?',
        options: [
          'Starfish, hibiscus flower, orange, and okra',
          'Humans, tilapia, and mango fruit',
          'Land snail, sponge, and fiddler crab',
          'Butterfly, toad, and cashew nut',
        ],
        correctIndex: 0,
        explanation: 'Radial symmetry allows multiple equal cuts through the central axis, typical of starfish, jellyfish, hibiscus, orange, and okra.',
      };
    }
    if (lower.includes('drawing')) {
      return {
        prompt: 'Which practice violates WASSCE Biological Drawing rules?',
        options: [
          'Adding arrowheads to label guidelines or crossing lines',
          'Covering at least two-thirds (2/3) of the space with an HB pencil',
          'Writing magnification at the bottom-right corner (e.g., ×2)',
          'Writing horizontal block/neat labels with thin continuous outlines',
        ],
        correctIndex: 0,
        explanation: 'Label guidelines must never have arrowheads, must never cross one another, and must touch the exact target structure.',
      };
    }
  }

  // Year 1 Biology PDF 2: Microscopes & Wet Mounts
  if (noteId === 'note-bio-s1-microscopes-pdf' || lower.includes('microscope') || lower.includes('wet mount')) {
    if (lower.includes('types') || lower.includes('magnification')) {
      return {
        prompt: 'What is the total magnification when a ×10 eyepiece lens is paired with a ×40 high-power objective lens?',
        options: ['×400', '×50', '×4', '×4,000'],
        correctIndex: 0,
        explanation: 'Total Magnification = Eyepiece (×10) × Objective (×40) = ×400.',
      };
    }
    if (lower.includes('13 parts') || lower.includes('compound')) {
      return {
        prompt: 'Which part of a compound light microscope adjusts the amount of light entering the specimen for contrast?',
        options: ['Iris Diaphragm', 'Revolving Nosepiece', 'Coarse Adjustment Knob', 'Arm'],
        correctIndex: 0,
        explanation: 'The Iris Diaphragm opens and closes beneath the stage/condenser to regulate light intensity and image contrast.',
      };
    }
    if (lower.includes('comparison') || lower.includes('criteria')) {
      return {
        prompt: 'Why can living specimens NOT be viewed alive inside an Electron Microscope?',
        options: [
          'The electron beam requires a high vacuum and heavy-metal staining/dehydration that kills living cells',
          'Electron microscopes use visible 700 nm light',
          'Electron microscopes only magnify up to ×100',
          'Glass lenses scatter living cytoplasm',
        ],
        correctIndex: 0,
        explanation: 'Air molecules scatter electrons, so specimens must be dehydrated and placed inside a vacuum chamber.',
      };
    }
    if (lower.includes('wet mount') || lower.includes('care')) {
      return {
        prompt: 'Why is the coverslip lowered gently at roughly 45° with a mounting needle during wet mount preparation?',
        options: [
          'To drive out air slowly and prevent trapped air bubbles',
          'To crack the glass slide before staining',
          'To reflect direct sunlight into the objective',
          'To magnify the onion cells without lenses',
        ],
        correctIndex: 0,
        explanation: 'Lowering the coverslip at ~45° allows the water front to advance evenly, preventing air bubbles from obscuring cells.',
      };
    }
  }

  // General Domain Checkpoints across Biology, Maths, ICT, English, Integrated Science & Social Studies
  if (lower.includes('osmosis') || lower.includes('plasmolysis')) {
    return {
      prompt: 'What happens to a turgid plant cell placed in a strongly hypertonic sucrose solution?',
      options: [
        'Water moves out by osmosis and the cytoplasm pulls away from the cell wall (plasmolysis)',
        'Water enters until the cell bursts',
        'Active transport pumps sucrose outward using ATP',
        'No net water movement occurs',
      ],
      correctIndex: 0,
      explanation: 'Hypertonic solution has lower water potential than cell sap; water leaves via osmosis, causing flaccidity and plasmolysis.',
    };
  }
  if (lower.includes('photosynthesis') || lower.includes('calvin')) {
    return {
      prompt: 'Where do the light-dependent reactions of photosynthesis take place inside the chloroplast?',
      options: ['Thylakoid membranes (grana)', 'Stroma', 'Outer nuclear envelope', 'Mitochondrial cristae'],
      correctIndex: 0,
      explanation: 'Chlorophyll photosystems and electron carriers sit in thylakoid membranes, while the Calvin cycle occurs in the stroma.',
    };
  }
  if (lower.includes('genetics') || lower.includes('mendel') || lower.includes('punnett')) {
    return {
      prompt: 'What is the expected phenotypic ratio in the F₂ generation of a Mendelian dihybrid cross between two heterozygotes (TtRr × TtRr)?',
      options: ['9:3:3:1', '3:1', '1:2:1', '1:1'],
      correctIndex: 0,
      explanation: 'Independent assortment of two unlinked genes produces the classic 9:3:3:1 F₂ phenotypic ratio.',
    };
  }
  if (lower.includes('ecology') || lower.includes('lincoln')) {
    return {
      prompt: 'Approximately what percentage of energy passes from one trophic level to the next in an ecosystem?',
      options: ['About 10%', 'About 90%', 'About 50%', '100%'],
      correctIndex: 0,
      explanation: 'Most energy (~90%) is lost as heat via respiration, movement, and undigested waste; only ~10% transfers upward.',
    };
  }
  if (lower.includes('circle') || lower.includes('tangent') || lower.includes('cyclic')) {
    return {
      prompt: 'In a cyclic quadrilateral ABCD, if interior angle A = 72°, what is the opposite angle C?',
      options: ['108°', '72°', '36°', '144°'],
      correctIndex: 0,
      explanation: 'Opposite interior angles of a cyclic quadrilateral are supplementary (A + C = 180° ⇒ C = 180° − 72° = 108°).',
    };
  }
  if (lower.includes('differentiation') || lower.includes('stationary') || lower.includes('calculus')) {
    return {
      prompt: 'At a local maximum point on a smooth curve y = f(x), which derivative conditions hold?',
      options: [
        'dy/dx = 0 and d²y/dx² < 0',
        'dy/dx = 0 and d²y/dx² > 0',
        'dy/dx > 0 and d²y/dx² = 0',
        'dy/dx < 0 and d²y/dx² < 0',
      ],
      correctIndex: 0,
      explanation: 'Stationary points satisfy dy/dx = 0; concave-down turning points (local maxima) have negative second derivative d²y/dx² < 0.',
    };
  }
  if (lower.includes('integral') || lower.includes('revolution') || lower.includes('area')) {
    return {
      prompt: 'Which definite integral computes the volume when the curve y = f(x) from x = a to x = b is rotated 2π radians about the x-axis?',
      options: ['π ∫ y² dx from a to b', '∫ y dx from a to b', '2π ∫ y dx from a to b', 'π ∫ x² dy from a to b'],
      correctIndex: 0,
      explanation: 'By the disk method, V = ∫ₐᵇ πy² dx.',
    };
  }
  if (lower.includes('sql') || lower.includes('normalization') || lower.includes('3nf')) {
    return {
      prompt: 'What must be eliminated to transform a 2NF relational table into Third Normal Form (3NF)?',
      options: [
        'Transitive dependencies (non-key attributes depending on another non-key attribute)',
        'Primary keys',
        'Atomic columns',
        'Foreign key constraints',
      ],
      correctIndex: 0,
      explanation: '3NF requires a table to be in 2NF with zero transitive functional dependencies among non-prime attributes.',
    };
  }
  if (lower.includes('boolean') || lower.includes('logic gate') || lower.includes('de morgan')) {
    return {
      prompt: 'According to De Morgan’s Theorem, what is equivalent to NOT (A AND B)?',
      options: ['(NOT A) OR (NOT B)', '(NOT A) AND (NOT B)', 'A XOR B', 'A AND B'],
      correctIndex: 0,
      explanation: 'Breaking the bar changes the operator: ¬(A · B) = ¬A + ¬B.',
    };
  }
  if (lower.includes('network') || lower.includes('osi') || lower.includes('topology')) {
    return {
      prompt: 'Which device operates at OSI Layer 3 to forward packets between different IP subnets?',
      options: ['Router', 'Passive Hub', 'Repeater', 'RJ45 Patch Cable'],
      correctIndex: 0,
      explanation: 'Routers inspect IPv4/IPv6 network addresses (Layer 3) to route packets across separate networks.',
    };
  }
  if (lower.includes('concord') || lower.includes('agreement') || lower.includes('syntax')) {
    return {
      prompt: 'Select the grammatically correct concord option: "Neither the captain nor the players ___ ready for the kick-off."',
      options: ['were', 'was', 'is', 'has been'],
      correctIndex: 0,
      explanation: 'With "neither ... nor", the verb agrees with the nearer subject ("the players", plural), requiring "were".',
    };
  }
  if (lower.includes('literature') || lower.includes('irony') || lower.includes('simile')) {
    return {
      prompt: 'What distinguishes dramatic irony from verbal irony in WASSCE Literature?',
      options: [
        'The audience knows a critical truth that a character on stage does not know',
        'A speaker uses "like" or "as" to compare unlike objects',
        'Inanimate objects are given human emotions',
        'Consonant sounds repeat at the start of adjacent words',
      ],
      correctIndex: 0,
      explanation: 'Dramatic irony creates tension because spectators possess crucial information hidden from a character.',
    };
  }
  if (lower.includes('saponification') || lower.includes('acid') || lower.includes('titration')) {
    return {
      prompt: 'Which products form when vegetable fats or oils are boiled with concentrated sodium hydroxide (saponification)?',
      options: [
        'Soap (sodium carboxylate salt) and glycerol',
        'Ethanol and carbon dioxide',
        'Sulfur trioxide and oleum',
        'Ammonia and brine',
      ],
      correctIndex: 0,
      explanation: 'Alkaline hydrolysis of triesters yields fatty acid salts (soap) plus propane-1,2,3-triol (glycerol).',
    };
  }
  // SHS 1 Core Mathematics Master Guide Checkpoints (Strands 1–4)
  if (
    noteId.includes('coremath-s1-strand1') ||
    lower.includes('recurring decimal') ||
    lower.includes('number base') ||
    lower.includes('modular') ||
    lower.includes('venn')
  ) {
    if (lower.includes('recurring') || lower.includes('real number')) {
      return {
        prompt: 'To convert 0.2363636... to a fraction, why do we multiply by both 10 and 1000 before subtracting?',
        options: [
          'So both equations share the exact same infinite .363636... tail that cancels cleanly to 990x = 234',
          'Because multiplying by 100 always removes non-repeating digits immediately',
          'To turn a rational number into an irrational surd',
          'Because 1000 minus 10 equals 100',
        ],
        correctIndex: 0,
        explanation: 'Aligning the repeating .363636... tail after the decimal point guarantees subtraction eliminates the infinite tail completely, leaving 990x = 234 ⇒ x = 13/55.',
      };
    }
    if (lower.includes('base') || lower.includes('modular')) {
      return {
        prompt: 'In the unknown-base equation 23_x + 14_x = 42_x, why must base x be strictly greater than 4?',
        options: [
          'No digit in a valid base-x system can equal or exceed x, and the digit 4 appears in 14_x and 42_x',
          'All number bases must be prime numbers',
          'Base 10 does not allow digits smaller than 4',
          'Adding two base-x numbers doubles the base',
        ],
        correctIndex: 0,
        explanation: 'In base x, allowable digits are 0 to x − 1. Because digit 4 is used, x must satisfy x > 4 (here x = 5 passes).',
      };
    }
    if (lower.includes('venn') || lower.includes('percent') || lower.includes('interest')) {
      return {
        prompt: 'When solving a 3-set Venn diagram problem, which region should you ALWAYS fill first?',
        options: [
          'The central triple intersection n(A ∩ B ∩ C), then work outward subtracting overlaps',
          'The "only one subject" outer wings first',
          'The complement outside all three circles first',
          'The largest single set total n(A) first',
        ],
        correctIndex: 0,
        explanation: 'Filling from the triple intersection center outward prevents double-counting elements shared by two or three sets.',
      };
    }
  }

  if (
    noteId.includes('coremath-s1-strand2') ||
    lower.includes('quadratic') ||
    lower.includes('rational expression') ||
    lower.includes('perpendicular') ||
    lower.includes('sequence')
  ) {
    if (lower.includes('quadratic') || lower.includes('rational') || lower.includes('undefined')) {
      return {
        prompt: 'When is a rational expression P(x)/Q(x) undefined versus equal to zero?',
        options: [
          'Undefined when denominator Q(x) = 0; equal to zero when numerator P(x) = 0 (with Q(x) ≠ 0)',
          'Undefined when numerator P(x) = 0; equal to zero when Q(x) = 0',
          'Both happen whenever x = 0',
          'Undefined only when P(x) is negative',
        ],
        correctIndex: 0,
        explanation: 'Division by zero is mathematically undefined (set Q(x) = 0), whereas 0 divided by a non-zero denominator equals 0 (set P(x) = 0).',
      };
    }
    if (lower.includes('coordinate') || lower.includes('perpendicular') || lower.includes('bisector')) {
      return {
        prompt: 'Line L has gradient m₁ = 1/2. What is the gradient m₂ of a perpendicular bisector to L?',
        options: ['-2', '1/2', '2', '-1/2'],
        correctIndex: 0,
        explanation: 'Perpendicular lines satisfy m₁ · m₂ = −1, so m₂ = −1 / (1/2) = −2.',
      };
    }
    if (lower.includes('sequence') || lower.includes('series') || lower.includes('geometric')) {
      return {
        prompt: 'For which values of common ratio r does an infinite Geometric Progression converge to S_∞ = a / (1 − r)?',
        options: ['|r| < 1 (i.e., −1 < r < 1)', 'r > 1', 'r = 1', '|r| > 2'],
        correctIndex: 0,
        explanation: 'Only when |r| < 1 do successive terms rⁿ shrink toward zero as n → ∞, giving a finite sum S_∞ = a/(1 − r).',
      };
    }
  }

  if (
    noteId.includes('coremath-s1-strand3') ||
    lower.includes('enlargement') ||
    lower.includes('special angle') ||
    lower.includes('bearing') ||
    lower.includes('sector') ||
    lower.includes('cone')
  ) {
    if (lower.includes('bearing') || lower.includes('trigonometr') || lower.includes('special angle')) {
      return {
        prompt: 'Why is the "FROM" point critical when finding a three-figure bearing of B from A?',
        options: [
          'You draw the North arrow at the FROM point (A) and measure clockwise from North around to line AB',
          'You always measure counter-clockwise from East at point B',
          'Bearings are measured from the South line in two digits',
          'The FROM point is only needed for distances, not angles',
        ],
        correctIndex: 0,
        explanation: 'Bearings always originate at the FROM point: stand at A, face due North (000°), and turn clockwise until facing B.',
      };
    }
    if (lower.includes('transformation') || lower.includes('enlargement') || lower.includes('reflection')) {
      return {
        prompt: 'If a triangle of area 12 cm² undergoes an enlargement of linear scale factor k = 3, what is the image area?',
        options: ['108 cm² (since Area Scale Factor = k² = 9)', '36 cm²', '24 cm²', '4 cm²'],
        correctIndex: 0,
        explanation: 'Lengths scale by k, so 2D areas scale by k²: 12 × 3² = 12 × 9 = 108 cm².',
      };
    }
    if (lower.includes('sector') || lower.includes('cone') || lower.includes('mensuration')) {
      return {
        prompt: 'When a circular sector of radius R and arc length L is folded into a cone, what does R become on the cone?',
        options: [
          'The slant height l of the cone, while arc length L becomes base circumference 2πr',
          'The vertical height h of the cone',
          'The base radius r of the cone',
          'Half the base diameter',
        ],
        correctIndex: 0,
        explanation: 'The straight edge of the sector becomes the slanted side l = R, while the curved arc wraps into the circular base 2πr = (θ/360) × 2πR.',
      };
    }
  }

  if (
    noteId.includes('coremath-s1-strand4') ||
    lower.includes('frequency density') ||
    lower.includes('ogive') ||
    lower.includes('standard deviation') ||
    lower.includes('probability tree')
  ) {
    if (lower.includes('histogram') || lower.includes('frequency density')) {
      return {
        prompt: 'Why must you plot Frequency Density (Frequency ÷ Class Width) instead of raw frequency when class widths are unequal?',
        options: [
          'Because the AREA of each bar—not its height alone—must stay proportional to frequency',
          'Because raw frequencies cannot be decimals',
          'To make the median appear at the origin',
          'To increase every bar height by 10',
        ],
        correctIndex: 0,
        explanation: 'Area = Class Width × Height. Using Frequency Density = f / width makes Area = width × (f / width) = f faithfully represent every class.',
      };
    }
    if (lower.includes('ogive') || lower.includes('cumulative') || lower.includes('quartile')) {
      return {
        prompt: 'Which x-values are plotted on the horizontal axis of a cumulative frequency curve (ogive), and where is it anchored?',
        options: [
          'Upper Class Boundaries (UCBs), anchored at frequency 0 on the lowest Lower Class Boundary',
          'Class midpoints, anchored at the highest frequency',
          'Lower Class Limits only, disconnected at y = 10',
          'Frequency densities against class widths',
        ],
        correctIndex: 0,
        explanation: 'Cumulative frequency counts values LESS THAN OR EQUAL TO each upper class boundary, starting smoothly from 0 at the lowest lower boundary.',
      };
    }
    if (lower.includes('probability') || lower.includes('variance') || lower.includes('deviation')) {
      return {
        prompt: 'In sampling TWO balls WITHOUT replacement from 5 Red and 3 Blue balls, how do denominators change on the second branch?',
        options: [
          'Denominator drops from 8 to 7, and the numerator of the drawn color also drops by 1',
          'Both numerator and denominator stay at 8',
          'Only the numerator changes while the denominator stays 8',
          'Second branch probabilities always equal 1/2',
        ],
        correctIndex: 0,
        explanation: 'Without replacement removes 1 ball from the bag, reducing total remaining items from 8 to 7 and reducing the count of that color by 1.',
      };
    }
  }

  if (lower.includes('constitution') || lower.includes('governance') || lower.includes('citizenship')) {
    return {
      prompt: 'Which principle of Ghana’s 1992 Constitution prevents absolute power by dividing authority among Executive, Legislature, and Judiciary?',
      options: [
        'Separation of Powers with Checks and Balances',
        'Unitary Dictatorship',
        'Intestate Succession',
        'Oligopoly',
      ],
      correctIndex: 0,
      explanation: 'Separation of powers ensures each arm checks the others to uphold constitutional democracy and the Rule of Law.',
    };
  }

  return undefined;
}

export function resolveVisual3DKind(note: StudyNote, sceneTitle: string): Video3DVisualKind {
  const combined = `${note.title} ${sceneTitle} ${note.tags.join(' ')}`.toLowerCase();

  if (
    /atom|bohr|rutherford|thomson|orbital|quantum|isotope|radioactiv|nuclear|decay|half-life|mass spec/.test(
      combined
    )
  ) {
    return 'atom-orbitals';
  }
  if (
    /wave|optic|mirror|lens|refract|snell|fiber|fibre|microscope|telescope|polariz|sound|spectrum|laser/.test(
      combined
    )
  ) {
    return 'waves-optics';
  }
  if (
    /circuit|ohm|resistor|capacitor|diode|transistor|bjt|induction|transformer|faraday|lenz|logic gate|nand|nor|boolean|electric/.test(
      combined
    )
  ) {
    return 'circuits-em';
  }
  if (
    /projectile|suvat|kinematic|momentum|force|orbit|satellite|kepler|shm|pendulum|machine|pulley|torque|dimension|pressure|archimedes|flotation|elastic|gravity|conduction|thermomet/.test(
      combined
    )
  ) {
    return 'mechanics-projectile';
  }
  if (
    /calculus|differentiat|integrat|stationary|tangent|revolution|quadratic|discriminant|matrix|transform|binomial dist|series|sum to infinity/.test(
      combined
    )
  ) {
    return 'calculus-surface';
  }
  if (
    /polygon|circle|mensuration|sphere|cone|cylinder|bearing|trigonomet|vector|geometry|venn|compound interest|earth/.test(
      combined
    )
  ) {
    return 'geometry-solids';
  }
  if (
    /cell|mitochondr|osmosis|microscop|enzyme|villi|photosynth|respirat|heart|nephron|neuron|genetics|dna|evolution|ecology|trophic|organism|taxonomy|plant/.test(
      combined
    )
  ) {
    return 'biology-cell-organ';
  }
  if (
    /chemistry|bond|periodic|mole|stoichiom|gas law|boyle|hess|acid|titration|redox|galvanic|electrolyt|organic|alkane|ester|haber|contact|saponification|separat|distillation|hazard|safety|fire/.test(
      combined
    )
  ) {
    return 'chemistry-molecules';
  }
  if (
    /cpu|hardware|ram|rom|file|spreadsheet|database|sql|network|osi|router|cyber|python|algorithm|flowchart|html|sdlc|information processing/.test(
      combined
    )
  ) {
    return 'ict-network-logic';
  }
  if (
    /letter|essay|summary|concord|clause|conditional|speech|figurative|litotes|euphemism|irony|oral|vowel|lexis|report|grammar/.test(
      combined
    )
  ) {
    return 'grammar-pillars';
  }
  if (
    /constitution|governance|citizenship|socialization|symbol|coat of arms|flag|ecowas|economy|entrepreneur|family|peace|environment|galamsey|youth/.test(
      combined
    )
  ) {
    return 'governance-scale';
  }

  switch (note.subject) {
    case 'physics':
      return 'mechanics-projectile';
    case 'chemistry':
      return 'chemistry-molecules';
    case 'biology':
      return 'biology-cell-organ';
    case 'addmaths':
      return 'calculus-surface';
    case 'coremath':
      return 'geometry-solids';
    case 'ict':
      return 'ict-network-logic';
    case 'english':
      return 'grammar-pillars';
    case 'socialstudies':
      return 'governance-scale';
    case 'integratedscience':
    default:
      return 'biology-cell-organ';
  }
}

const FORMULA_EXPLANATION_CATALOG: {
  pattern: RegExp;
  meaning: string;
  variables: string[];
  spoken: string;
}[] = [
  {
    pattern: /1000x\s*-\s*10x|990x/i,
    meaning: 'Aligns two decimal equations with identical repeating tails so subtraction cancels the infinite decimals cleanly.',
    variables: [
      'x = original recurring decimal value',
      '10x = shifts decimal right past any non-repeating prefix digits',
      '1000x = shifts decimal right again by one full repeating block (10^k)',
    ],
    spoken:
      'Let us understand this recurring decimal formula. x represents our unknown fraction, multiplying by 10 moves the non-repeating digit past the decimal point, and multiplying by 1000 moves one full repeating cycle across. When we subtract 10x from 1000x, the endless repeating decimal tails match digit-for-digit and cancel out completely, leaving 990x equals 234.',
  },
  {
    pattern: /2x\^1\s*\+\s*3|23_x|number\s*base/i,
    meaning: 'Expands any base-x numeral into Base 10 using positional powers of the unknown base x.',
    variables: [
      'x = the unknown number base (must exceed the largest digit in the problem)',
      'x^1, x^0 = place values (x-units column and ones column)',
    ],
    spoken:
      'Every digit in a base-x number sits in a power-of-x place value column. Reading right to left, the rightmost digit multiplies x to the zero (which is 1), the next multiplies x to the one, and so on. Converting every numeral into Base 10 turns a tricky base puzzle into a straightforward linear equation for x.',
  },
  {
    pattern: /n\(A\s*\\cup\s*B|n\(A\s*∪\s*B|venn/i,
    meaning: 'Inclusion-Exclusion Principle: sums individual sets, subtracts pairwise overlaps so they are not counted twice, and adds back the triple center.',
    variables: [
      'n(A), n(B), n(C) = total elements in each individual set',
      'n(A ∩ B), n(B ∩ C), n(A ∩ C) = pairwise intersections',
      'n(A ∩ B ∩ C) = central triple overlap (always fill first)',
    ],
    spoken:
      'Think carefully about why the inclusion-exclusion formula works. Adding n(A), n(B), and n(C) counts students in two clubs twice and students in all three clubs three times. Subtracting the pairwise intersections removes the double-counting, and adding n(A intersect B intersect C) puts back the center so every student is counted exactly once.',
  },
  {
    pattern: /A\s*=\s*P\(1\s*\+\s*r\/100\)\^n|compound/i,
    meaning: 'Compound Interest formula: grows principal P exponentially because each period’s interest also earns interest.',
    variables: [
      'A = final total amount (principal plus compound interest)',
      'P = initial principal deposited or borrowed',
      'r = annual percentage interest rate (%)',
      'n = number of compounding periods',
    ],
    spoken:
      'In this compound interest formula, P is your starting principal, r is the interest rate per period as a percentage, n is how many times interest is compounded, and A is the final accumulated amount. Notice that (1 + r over 100) acts as a growth multiplier applied n times in a row, which is why compound growth curves upward exponentially.',
  },
  {
    pattern: /x\s*=\s*\(?-b\s*[±\\pm]+\s*√|\b\s*-b\s*\\pm/i,
    meaning: 'The Quadratic Formula solves any ax² + bx + c = 0 directly, where the discriminant Δ = b² − 4ac governs the number of real roots.',
    variables: [
      'a = coefficient of x² (a ≠ 0, sets parabola width & direction)',
      'b = coefficient of x (shifts symmetry axis to x = −b/2a)',
      'c = constant y-intercept where graph crosses y-axis',
      'b² − 4ac = discriminant (positive ⇒ 2 roots, 0 ⇒ 1 root, negative ⇒ no real roots)',
    ],
    spoken:
      'Let us unpack every piece of the quadratic formula: negative b plus or minus the square root of b squared minus 4ac, all divided by 2a. Here, a multiplies x-squared, b multiplies x, and c is the constant term. Look at negative b over 2a: that locates the exact vertical symmetry line of the parabola, while the discriminant b squared minus 4ac tells you how far left and right the two roots sit from center.',
  },
  {
    pattern: /m_1\s*[·*×]?\s*m_2\s*=\s*-1|m₁\s*·\s*m₂\s*=\s*-1|y_2\s*-\s*y_1/i,
    meaning: 'Gradient & Perpendicularity relation: slope measures vertical rise over horizontal run, and a 90° rotation flips the fraction and negates its sign.',
    variables: [
      'm₁, m₂ = gradients (slopes) of the two lines',
      '(x₁, y₁), (x₂, y₂) = coordinates of two distinct points on a line',
      'm₁ · m₂ = −1 = negative reciprocal condition for 90° perpendicular lines',
    ],
    spoken:
      'Why does m₁ times m₂ equal negative 1 for perpendicular lines? Because rotating a slope rise over run by 90 degrees swaps rise and run while flipping one direction's sign! So if one line rises 1 unit for every 2 units right (slope +1/2), its perpendicular partner must drop 2 units for every 1 unit right (slope −2), and +1/2 times −2 equals negative 1.',
  },
  {
    pattern: /U_n\s*=\s*a\s*\+\s*\(n\s*-\s*1\)d|S_n\s*=.*2a\s*\+\s*\(n\s*-\s*1\)d/i,
    meaning: 'Arithmetic Progression (AP): jumps by a constant common difference d each step, starting at first term a.',
    variables: [
      'a = first term U₁ of the progression',
      'd = common difference added between consecutive terms (Uₙ₊₁ − Uₙ)',
      'n = term position index (must be a positive integer ≥ 1)',
      'Uₙ = nth term value; Sₙ = sum of the first n terms',
    ],
    spoken:
      'In an arithmetic progression, a is your starting value, d is the constant step you add each time, and n is the term position. To reach the nth term U_n, you take (n minus 1) steps of size d from a—never n steps, because the first term already sits at position 1! And the sum S_n simply pairs the first and last terms to multiply average value by n.',
  },
  {
    pattern: /ar\^\{?n-1\}?|S_∞|S_\\infty|a\/\(1-r\)/i,
    meaning: 'Geometric Progression (GP): scales each term by common ratio r, and converges to a finite infinite sum when |r| < 1.',
    variables: [
      'a = first term of the geometric sequence',
      'r = constant common ratio (Uₙ₊₁ ÷ Uₙ)',
      'n = number of terms',
      'S_∞ = a / (1 − r) = limiting infinite sum valid only when |r| < 1',
    ],
    spoken:
      'A geometric progression multiplies by the common ratio r at every step instead of adding. Starting from first term a, multiplying by r exactly (n minus 1) times gives the nth term a·r^(n−1). When the absolute value of r is strictly less than 1, each added term shrinks toward zero, so the endless series converges cleanly to a over (1 minus r).',
  },
  {
    pattern: /\(n\s*-\s*2\)\s*[×x*]?\s*180|360°?\/n|k\^2/i,
    meaning: 'Polygon angle & scaling geometry: triangulating an n-sided polygon produces (n − 2) triangles, while 2D enlargement scales areas by k².',
    variables: [
      'n = number of sides of the polygon',
      '(n − 2) × 180° = sum of all interior angles',
      'k = linear enlargement scale factor (area scales by k², volume by k³)',
    ],
    spoken:
      'Look at why (n minus 2) times 180 degrees gives any polygon’s interior angle sum: pick one corner and draw diagonals to split an n-sided shape into exactly (n minus 2) non-overlapping triangles, each worth 180 degrees. Similarly, when a shape is enlarged by linear factor k, both width and height stretch by k, which is why its area scales by k squared.',
  },
  {
    pattern: /2\\pi r|2πr|⅓πr²h|\\frac\{1\}\{3\}\\pi r\^2 h|θ\/360/i,
    meaning: 'Sector-to-Cone mensuration: the curved arc length of a flat sector wraps into the circular base circumference of the 3D cone.',
    variables: [
      'R = radius of the original flat sector (becomes slant height l of the cone)',
      'θ = central angle of the sector in degrees',
      'r = base radius of the folded cone (r = (θ/360) × R)',
      'h = vertical perpendicular height (h = √(l² − r²))',
    ],
    spoken:
      'Watch how the flat sector transforms into a 3D cone. First, the sector radius R becomes the slanted edge l of the cone—never the vertical height h! Second, the curved arc length (theta over 360 times 2 pi R) wraps right around to form the circular base circumference 2 pi r. Once you find base radius r, use Pythagoras with l and r to get vertical height h before computing volume 1/3 pi r squared h.',
  },
  {
    pattern: /Frequency Density|Class Width|FD\s*=|s\^2\s*=|Σf\(x/i,
    meaning: 'Statistical spread & density: Frequency Density ensures bar areas stay proportional to frequency, while Variance s² averages squared deviations from the mean.',
    variables: [
      'f = class frequency (number of observations in that bin)',
      'Class Width = Upper Class Boundary minus Lower Class Boundary',
      'x̄ = sample mean (balance point of the distribution)',
      's² = variance; s = √(s²) = standard deviation in the same units as data',
    ],
    spoken:
      'Why do we compute Frequency Density as frequency divided by class width? Because in a true histogram, the AREA of each rectangle represents frequency. Dividing height by width guarantees width times height equals frequency again! And in standard deviation, squaring each deviation from mean x-bar prevents positive and negative offsets from canceling out before we take the square root back to original units.',
  },
  {
    pattern: /\[M.*L.*T|\bF\s*=\s*m\s*[×*]?\s*a|\bV\s*=\s*I\s*[×*]?\s*R|KE\s*=|PE\s*=|T\s*=\s*2π√/i,
    meaning: 'Physical conservation / law connecting measurable quantities via strict SI units and dimensional homogeneity.',
    variables: [
      '[M], [L], [T] = fundamental dimensions Mass (kg), Length (m), Time (s)',
      'F = force (Newtons, kg·m·s⁻²); m = mass (kg); a = acceleration (m·s⁻²)',
      'V = potential difference (V); I = current (A); R = resistance (Ω)',
      'T = oscillation period (s); L = string length (m); g = gravity (~9.8 m·s⁻²)',
    ],
    spoken:
      'Every symbol in a physics formula carries both magnitude and SI units. On both sides of the equals sign, the base dimensions [M], [L], and [T] must match identically—that is the Principle of Homogeneity. Notice for a pendulum T = 2 pi square root of L over g: period increases with longer string L and decreases under stronger gravity g, while bob mass cancels completely.',
  },
  {
    pattern: /n\s*=\s*m\/M|C₁V₁|PV\s*=\s*nRT|N\(t\)|t_\{1\/2\}|pH\s*=/i,
    meaning: 'Quantitative chemical relationship conserving moles, mass-charge, or exponential radioactive decay across states.',
    variables: [
      'n = amount of substance in moles (mol)',
      'm = sample mass in grams (g); M = molar mass (g·mol⁻¹)',
      'C₁, V₁ & C₂, V₂ = molarity (mol·dm⁻³) and volume (dm³) before and after dilution',
      'N₀, N = initial and remaining undecayed nuclei after time t (half-life t½)',
    ],
    spoken:
      'Chemistry equations work in particle packets called moles, n, where n equals mass m divided by molar mass M, or concentration C times volume V. Because dilution only adds solvent, the total moles of solute C₁V₁ stay strictly equal to C₂V₂. Likewise, in radioactive decay, each elapsed half-life t-half cuts remaining undecayed atoms N cleanly in half.',
  },
];

export function explainFormulaInDepth(
  rawEquation: string,
  sceneTitle: string,
  subject: StudyNote['subject']
): FormulaBreakdownItem {
  const formula = cleanMarkdownLine(rawEquation);
  for (const item of FORMULA_EXPLANATION_CATALOG) {
    if (item.pattern.test(rawEquation) || item.pattern.test(formula)) {
      return {
        formula,
        meaning: item.meaning,
        variables: item.variables,
        spokenExplanation: item.spoken,
      };
    }
  }

  // Intelligent dynamic symbol breakdown for any equation across all 9 subjects
  const lhsRhs = formula.split('=');
  const lhs = lhsRhs[0]?.trim() || 'Left side';
  const rhs = lhsRhs.slice(1).join('=').trim();
  const tokens = Array.from(
    new Set(
      (formula.match(/\b[A-Za-z][A-Za-z0-9_₀₁₂]*\b/g) ?? []).filter(
        (tok) => !['sin', 'cos', 'tan', 'log', 'ln', 'mod', 'text', 'sqrt', 'frac'].includes(tok.toLowerCase())
      )
    )
  ).slice(0, 5);

  const SYMBOL_HINTS: Record<string, string> = {
    x: 'unknown input / horizontal coordinate value',
    y: 'dependent output / vertical coordinate value',
    m: 'gradient (slope) or mass depending on context',
    c: 'vertical y-intercept or constant term',
    a: 'first term, leading coefficient, or acceleration',
    b: 'linear coefficient or base value',
    d: 'common difference or distance',
    r: 'radius or common geometric ratio',
    n: 'number of terms, moles, or sample size',
    k: 'constant of proportionality or enlargement scale factor',
    p: 'probability, pressure, or momentum',
    q: 'complementary probability (1 − p) or charge',
    t: 'time elapsed',
    v: 'final velocity, voltage, or volume',
    u: 'initial velocity or object distance',
    f: 'frequency, force, or focal length',
    h: 'vertical height or Planck constant',
    A: 'total area or accumulated amount',
    V: 'volume or potential difference (volts)',
    P: 'principal amount, power, or probability',
    I: 'electric current or interest earned',
    R: 'electrical resistance, gas constant, or outer radius',
    E: 'energy or electromotive force',
    L: 'length, slant height, or arc length',
    θ: 'angle measured in degrees or radians',
    π: 'pi (≈ 3.14159), ratio of circle circumference to diameter',
  };

  const variables =
    tokens.length > 0
      ? tokens.map((tok) => `${tok} = ${SYMBOL_HINTS[tok] ?? `key variable/quantity representing ${tok} in ${sceneTitle}`}`)
      : [`Each term in "${formula}" balances quantities across the equals sign.`];

  const meaning = rhs
    ? `Connects target quantity "${lhs}" directly to "${rhs}" in ${sceneTitle} (${subject.toUpperCase()}).`
    : `Mathematical/scientific relation defining "${formula}" for ${sceneTitle}.`;

  const spokenVars =
    tokens.length > 0
      ? tokens
          .slice(0, 4)
          .map((tok) => `${tok} stands for ${SYMBOL_HINTS[tok] ?? `the quantity ${tok}`}`)
          .join('; ')
      : '';

  const spokenExplanation = markdownToPlainSpeech(
    rhs
      ? `Now look closely at this formula: ${formula}. The left-hand side ${lhs} depends directly on ${rhs}. ${spokenVars ? `Here, ${spokenVars}. ` : ''}Always check how changing each input on the right shifts the final result on the left, and verify your units or signs before finishing.`
      : `Let us unpack the relationship ${formula}. ${spokenVars ? `Remember that ${spokenVars}. ` : ''}Follow every symbol step by step rather than memorizing letters blindly.`
  );

  return {
    formula,
    meaning,
    variables,
    spokenExplanation,
  };
}

function buildIntuitionHook(note: StudyNote, sceneTitle: string, hasEquations: boolean): string {
  const lower = `${note.title} ${sceneTitle}`.toLowerCase();
  if (/atom|orbital|bohr|rutherford/.test(lower)) {
    return 'Picture the atom like a tiny stadium: a super-dense positive core at center field with electrons quantized in energy rings around it.';
  }
  if (/dimension|si unit|candela/.test(lower)) {
    return 'Every complex formula is built from just a handful of basic measurement bricks—check the bricks on both sides and bad equations fall apart instantly.';
  }
  if (/projectile|suvat|kinematic/.test(lower)) {
    return 'The secret to motion is separating sideways cruise speed from gravity pulling straight down—two simple clocks ticking side by side.';
  }
  if (/optic|mirror|lens|fiber|refract/.test(lower)) {
    return 'Light bends whenever its speed changes across a boundary, and past a critical angle the glass traps the beam inside like a mirror tunnel.';
  }
  if (/circuit|ohm|capacitor|transformer|bjt|logic gate/.test(lower)) {
    return 'Think of voltage as electrical pressure pushing charge, resistance as narrow pipes, and logic gates as smart switches making binary decisions.';
  }
  if (/differentiat|integrat|calculus/.test(lower)) {
    return 'Calculus boils down to two visual tricks: zooming in to measure the steepness of a slope, and slicing an area into thin stacks to add it up.';
  }
  if (/trig|bearing|polygon|circle|geometry|venn|recurring|base|modular|histogram|ogive|probability/.test(lower)) {
    return 'In Mathematics, every rule has a visual picture behind it—whether lining up decimal tails, spinning a clockwise North compass, or balancing bar areas rather than just heights.';
  }
  if (/mole|titration|stoichiom|gas law|redox|haber/.test(lower)) {
    return 'Chemical equations are balanced recipes—count atoms in mole packets instead of grams so reactants match products cleanly.';
  }
  if (/cell|osmosis|enzyme|heart|villi|trophic|dna/.test(lower)) {
    return 'Living systems survive by smart engineering—maximizing surface area for fast transport and locking shapes together like keys in enzymes.';
  }
  if (/letter|summary|conditional|concord|litotes|figurative/.test(lower)) {
    return 'Clear writing works like clean architecture: match every subject with its verb, trim fluff in summaries, and pick the exact tone for your reader.';
  }
  if (/spreadsheet|database|network|algorithm|flowchart|processing/.test(lower)) {
    return 'Computers turn raw input into smart decisions by following an exact step-by-step recipe from memory through the processor to output.';
  }
  if (/constitution|citizenship|symbol|socialization|ecowas/.test(lower)) {
    return 'Healthy societies balance citizen rights with civic duties, backed by clear constitutional checks and shared national identity.';
  }
  return hasEquations
    ? `Let us break down "${sceneTitle}" step by step—first the real picture in your mind, then how every symbol inside the formula works together.`
    : `Let us walk through "${sceneTitle}" clearly like a real classroom whiteboard session so every rule and worked example clicks.`;
}

function enrichPointNarration(rawPoint: string, idx: number, total: number): string {
  const spoken = ensureSentence(markdownToPlainSpeech(rawPoint));
  if (!spoken) return '';
  if (total === 1) {
    return `Look closely at this core idea: ${spoken}`;
  }
  if (idx === 0) {
    return `First, let us ground the foundation: ${spoken}`;
  }
  if (idx === total - 1) {
    return `Finally for this stage, lock this in: ${spoken}`;
  }
  const bridges = [
    'Next, build on that step:',
    'Notice why this matters right here:',
    'Pay close attention to this working detail:',
  ];
  return `${bridges[idx % bridges.length]} ${spoken}`;
}

/**
 * Converts any StudyNote into structured, comprehensive animated VideoLessonScene slides
 * without dropping bullet points, equations, or syllabus details, and always explaining formulas aloud.
 */
export function buildInteractiveVideoScenes(note: StudyNote): VideoLessonScene[] {
  const lines = note.content.replace(/\r\n/g, '\n').split('\n');
  const rawSections: { title: string; bodyLines: string[] }[] = [];
  let current: { title: string; bodyLines: string[] } | null = null;

  for (const line of lines) {
    const hMatch = line.match(/^#{1,3}\s+(.+)$/);
    if (hMatch) {
      const headingText = cleanMarkdownLine(hMatch[1]);
      if (line.startsWith('# ') && rawSections.length === 0 && !current) {
        current = { title: headingText, bodyLines: [] };
      } else {
        if (current && current.bodyLines.some((l) => l.trim().length > 0)) {
          rawSections.push(current);
        }
        current = { title: headingText, bodyLines: [] };
      }
      continue;
    }
    if (!current) {
      current = { title: note.title, bodyLines: [] };
    }
    current.bodyLines.push(line);
  }
  if (current && current.bodyLines.some((l) => l.trim().length > 0)) {
    rawSections.push(current);
  }

  if (rawSections.length === 0) {
    rawSections.push({
      title: note.title,
      bodyLines: [note.content || 'Start writing study notes to generate an interactive video lesson.'],
    });
  }

  const scenes: VideoLessonScene[] = [];

  for (const sec of rawSections) {
    const allPoints: string[] = [];
    const allEquations: string[] = [];
    let tableRowsCount = 0;

    let inCode = false;
    for (const rawLine of sec.bodyLines) {
      const trimmed = rawLine.trim();
      if (!trimmed) continue;
      if (trimmed.startsWith('```')) {
        inCode = !inCode;
        continue;
      }
      if (inCode) {
        allPoints.push(trimmed);
        continue;
      }
      if (trimmed.startsWith('$$')) {
        const eq = cleanMarkdownLine(trimmed);
        if (eq) allEquations.push(eq);
        continue;
      }
      if (trimmed.startsWith('|')) {
        if (!trimmed.includes('---')) {
          tableRowsCount++;
          if (tableRowsCount > 1) {
            const cols = trimmed
              .replace(/^\|/, '')
              .replace(/\|$/, '')
              .split('|')
              .map((c) => cleanMarkdownLine(c))
              .filter(Boolean);
            if (cols.length >= 4) {
              allPoints.push(`${cols[0]}: ${cols[1]} (${cols[2]}) — ${cols[3]}`);
            } else if (cols.length >= 2) {
              allPoints.push(cols.join(' — '));
            }
          }
        }
        continue;
      }

      const cleaned = cleanMarkdownLine(trimmed.replace(/^[-*]\s+/, ''));
      if (cleaned) {
        allPoints.push(cleaned);
      }
    }

    if (allPoints.length === 0 && allEquations.length > 0) {
      allPoints.push(`Key relation: ${allEquations[0]}`);
    }
    if (allPoints.length === 0) continue;

    // Chunk into 4 readable board points per scene for deeper explanation per slide
    const POINTS_PER_SLIDE = 4;
    const totalParts = Math.max(1, Math.ceil(allPoints.length / POINTS_PER_SLIDE));

    for (let part = 0; part < totalParts; part++) {
      const chunkPoints = allPoints.slice(part * POINTS_PER_SLIDE, (part + 1) * POINTS_PER_SLIDE);
      const chunkEquations = part === 0 ? allEquations : allEquations.slice(part, part + 2);
      const sceneTitle = totalParts > 1 ? `${sec.title} (Part ${part + 1}/${totalParts})` : sec.title;
      const visual3DKind = resolveVisual3DKind(note, sceneTitle);
      const intuitionHook = buildIntuitionHook(note, sceneTitle, chunkEquations.length > 0);
      const formulaBreakdowns = chunkEquations.map((eq) =>
        explainFormulaInDepth(eq, sceneTitle, note.subject)
      );

      const introSpeech =
        scenes.length === 0
          ? `Welcome to your comprehensive lesson on ${ensureSentence(markdownToPlainSpeech(sceneTitle))} ${ensureSentence(intuitionHook)}`
          : `Now let us examine ${ensureSentence(markdownToPlainSpeech(sceneTitle))} ${ensureSentence(intuitionHook)}`;

      const rawSegs: { text: string; keyPointIndex: number | null }[] = [
        { text: introSpeech, keyPointIndex: null },
        ...chunkPoints.map((pt, kpIdx) => ({
          text: enrichPointNarration(pt, kpIdx, chunkPoints.length),
          keyPointIndex: kpIdx,
        })),
      ];

      if (formulaBreakdowns.length > 0) {
        for (const fb of formulaBreakdowns) {
          rawSegs.push({
            text: fb.spokenExplanation,
            keyPointIndex: chunkPoints.length - 1,
          });
        }
      }

      const weights = rawSegs.map((s) => Math.max(4, s.text.split(/\s+/).filter(Boolean).length));
      const totalWeight = weights.reduce((a, b) => a + b, 0) || 1;
      let running = 0;
      const narrationSegments: VideoNarrationSegment[] = rawSegs.map((s, sIdx) => {
        const startFrac = Number(running.toFixed(4));
        running += weights[sIdx] / totalWeight;
        const endFrac = sIdx === rawSegs.length - 1 ? 1 : Number(Math.min(1, running).toFixed(4));
        return {
          text: s.text,
          keyPointIndex: s.keyPointIndex,
          startFrac,
          endFrac,
        };
      });

      const narration = narrationSegments.map((s) => s.text).join(' ');
      const wordCount = narration.split(/\s+/).filter(Boolean).length;
      const durationSeconds = Math.max(18, Math.min(90, Math.round(wordCount / 2.2) + 5));

      const sceneIndex = scenes.length;
      const checkpoint =
        part === totalParts - 1 ? buildDomainCheckpoint(note.id, sec.title, sceneIndex) : undefined;

      scenes.push({
        id: `${note.id}-scene-${sceneIndex}`,
        index: sceneIndex,
        title: sceneTitle,
        intuitionHook,
        visual3DKind,
        narration,
        narrationSegments,
        keyPoints: chunkPoints,
        equations: chunkEquations,
        formulaBreakdowns: formulaBreakdowns.length > 0 ? formulaBreakdowns : undefined,
        durationSeconds,
        visualBadge:
          chunkEquations.length > 0
            ? '3D Visual + Explained Formulas'
            : tableRowsCount > 0
              ? '3D Visual + Matrix'
              : '3D Concept Walkthrough',
        checkpoint,
      });
    }
  }

  // Ensure every note video finishes cleanly with a takeaway & checkpoint if none attached yet
  if (scenes.length === 1) {
    const first = scenes[0];
    const takeawayPoints = [
      `Recall exact ${note.grade} syllabus definitions and formulas for ${note.title}, understanding what every symbol stands for.`,
      'Show full intermediate working and verify SI units or algebraic constraints before writing final answers.',
      'Watch for common Paper 1 distractors and Paper 2 structured command verbs.',
    ];
    const fb = first.formulaBreakdowns ?? [];
    scenes.push({
      id: `${note.id}-scene-1`,
      index: 1,
      title: `${note.title} — WASSCE Exam Application`,
      intuitionHook: 'Tie the visual model, symbol meanings, and step-by-step working together before tackling exam questions.',
      visual3DKind: first.visual3DKind,
      narration: markdownToPlainSpeech(
        `Let us consolidate everything you have learned in ${note.title}. First, ${takeawayPoints[0]} Second, ${takeawayPoints[1]} Third, ${takeawayPoints[2]}`
      ),
      narrationSegments: [
        { text: `Let us consolidate everything you have learned in ${note.title}.`, keyPointIndex: null, startFrac: 0, endFrac: 0.22 },
        { text: `First, ${takeawayPoints[0]}`, keyPointIndex: 0, startFrac: 0.22, endFrac: 0.5 },
        { text: `Second, ${takeawayPoints[1]}`, keyPointIndex: 1, startFrac: 0.5, endFrac: 0.76 },
        { text: `Third, ${takeawayPoints[2]}`, keyPointIndex: 2, startFrac: 0.76, endFrac: 1 },
      ],
      keyPoints: takeawayPoints,
      equations: first.equations,
      formulaBreakdowns: fb.length > 0 ? fb : undefined,
      durationSeconds: 20,
      visualBadge: 'WASSCE Exam Takeaway',
      checkpoint: {
        prompt: `Quick Review for "${note.title}": What is the strongest WASSCE study habit after completing this lesson?`,
        options: [
          'Test active recall with Paper 1 MCQs and practice Paper 2 step-by-step derivations',
          'Skip units and rough working during structured theory questions',
          'Memorize isolated letters without understanding physical or chemical meaning',
          'Avoid checking marking scheme precautions',
        ],
        correctIndex: 0,
        explanation: 'Active recall paired with step-by-step Paper 2 practice secures top WASSCE grades.',
      },
    });
  } else if (scenes.length > 1 && !scenes[scenes.length - 1].checkpoint) {
    const last = scenes[scenes.length - 1];
    last.checkpoint =
      buildDomainCheckpoint(note.id, last.title, scenes.length - 1) ?? {
        prompt: `Quick Review for "${note.title}": How do you lock in full marks on "${last.title}"?`,
        options: [
          'State precise definitions, units, and verify every calculation or diagram label',
          'Guess units after finishing numerical steps',
          'Skip balancing equations or labelling axes',
          'Rely only on rereading without practice questions',
        ],
        correctIndex: 0,
        explanation: 'Clear definitions, consistent units, and active testing maximize WASSCE marks.',
      };
  }

  return scenes;
}

