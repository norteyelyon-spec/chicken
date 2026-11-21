export type AtomicModelKind = 'plum-pudding' | 'rutherford' | 'bohr';

export interface ElementRecord {
  z: number;
  symbol: string;
  name: string;
  defaultNeutrons: number;
  atomicMass: number;
  period: number;
  group: number;
  category: string;
}

export const ELEMENTS_1_TO_30: ElementRecord[] = [
  { z: 1, symbol: 'H', name: 'Hydrogen', defaultNeutrons: 0, atomicMass: 1.008, period: 1, group: 1, category: 'Nonmetal' },
  { z: 2, symbol: 'He', name: 'Helium', defaultNeutrons: 2, atomicMass: 4.003, period: 1, group: 18, category: 'Noble Gas' },
  { z: 3, symbol: 'Li', name: 'Lithium', defaultNeutrons: 4, atomicMass: 6.94, period: 2, group: 1, category: 'Alkali Metal' },
  { z: 4, symbol: 'Be', name: 'Beryllium', defaultNeutrons: 5, atomicMass: 9.012, period: 2, group: 2, category: 'Alkaline Earth' },
  { z: 5, symbol: 'B', name: 'Boron', defaultNeutrons: 6, atomicMass: 10.81, period: 2, group: 13, category: 'Metalloid' },
  { z: 6, symbol: 'C', name: 'Carbon', defaultNeutrons: 6, atomicMass: 12.011, period: 2, group: 14, category: 'Nonmetal' },
  { z: 7, symbol: 'N', name: 'Nitrogen', defaultNeutrons: 7, atomicMass: 14.007, period: 2, group: 15, category: 'Nonmetal' },
  { z: 8, symbol: 'O', name: 'Oxygen', defaultNeutrons: 8, atomicMass: 15.999, period: 2, group: 16, category: 'Nonmetal' },
  { z: 9, symbol: 'F', name: 'Fluorine', defaultNeutrons: 10, atomicMass: 18.998, period: 2, group: 17, category: 'Halogen' },
  { z: 10, symbol: 'Ne', name: 'Neon', defaultNeutrons: 10, atomicMass: 20.18, period: 2, group: 18, category: 'Noble Gas' },
  { z: 11, symbol: 'Na', name: 'Sodium', defaultNeutrons: 12, atomicMass: 22.99, period: 3, group: 1, category: 'Alkali Metal' },
  { z: 12, symbol: 'Mg', name: 'Magnesium', defaultNeutrons: 12, atomicMass: 24.305, period: 3, group: 2, category: 'Alkaline Earth' },
  { z: 13, symbol: 'Al', name: 'Aluminium', defaultNeutrons: 14, atomicMass: 26.982, period: 3, group: 13, category: 'Post-Transition' },
  { z: 14, symbol: 'Si', name: 'Silicon', defaultNeutrons: 14, atomicMass: 28.085, period: 3, group: 14, category: 'Metalloid' },
  { z: 15, symbol: 'P', name: 'Phosphorus', defaultNeutrons: 16, atomicMass: 30.974, period: 3, group: 15, category: 'Nonmetal' },
  { z: 16, symbol: 'S', name: 'Sulfur', defaultNeutrons: 16, atomicMass: 32.06, period: 3, group: 16, category: 'Nonmetal' },
  { z: 17, symbol: 'Cl', name: 'Chlorine', defaultNeutrons: 18, atomicMass: 35.45, period: 3, group: 17, category: 'Halogen' },
  { z: 18, symbol: 'Ar', name: 'Argon', defaultNeutrons: 22, atomicMass: 39.948, period: 3, group: 18, category: 'Noble Gas' },
  { z: 19, symbol: 'K', name: 'Potassium', defaultNeutrons: 20, atomicMass: 39.098, period: 4, group: 1, category: 'Alkali Metal' },
  { z: 20, symbol: 'Ca', name: 'Calcium', defaultNeutrons: 20, atomicMass: 40.078, period: 4, group: 2, category: 'Alkaline Earth' },
  { z: 21, symbol: 'Sc', name: 'Scandium', defaultNeutrons: 24, atomicMass: 44.956, period: 4, group: 3, category: 'Transition Metal' },
  { z: 22, symbol: 'Ti', name: 'Titanium', defaultNeutrons: 26, atomicMass: 47.867, period: 4, group: 4, category: 'Transition Metal' },
  { z: 23, symbol: 'V', name: 'Vanadium', defaultNeutrons: 28, atomicMass: 50.942, period: 4, group: 5, category: 'Transition Metal' },
  { z: 24, symbol: 'Cr', name: 'Chromium', defaultNeutrons: 28, atomicMass: 51.996, period: 4, group: 6, category: 'Transition Metal' },
  { z: 25, symbol: 'Mn', name: 'Manganese', defaultNeutrons: 30, atomicMass: 54.938, period: 4, group: 7, category: 'Transition Metal' },
  { z: 26, symbol: 'Fe', name: 'Iron', defaultNeutrons: 30, atomicMass: 55.845, period: 4, group: 8, category: 'Transition Metal' },
  { z: 27, symbol: 'Co', name: 'Cobalt', defaultNeutrons: 32, atomicMass: 58.933, period: 4, group: 9, category: 'Transition Metal' },
  { z: 28, symbol: 'Ni', name: 'Nickel', defaultNeutrons: 31, atomicMass: 58.693, period: 4, group: 10, category: 'Transition Metal' },
  { z: 29, symbol: 'Cu', name: 'Copper', defaultNeutrons: 35, atomicMass: 63.546, period: 4, group: 11, category: 'Transition Metal' },
  { z: 30, symbol: 'Zn', name: 'Zinc', defaultNeutrons: 35, atomicMass: 65.38, period: 4, group: 12, category: 'Transition Metal' },
];

const SUPERSCRIPTS: Record<string, string> = {
  '0': '⁰',
  '1': '¹',
  '2': '²',
  '3': '³',
  '4': '⁴',
  '5': '⁵',
  '6': '⁶',
  '7': '⁷',
  '8': '⁸',
  '9': '⁹',
  '+': '⁺',
  '-': '⁻',
};

function toSuperscript(text: string): string {
  return text
    .split('')
    .map((ch) => SUPERSCRIPTS[ch] ?? ch)
    .join('');
}

interface SubshellDef {
  label: string;
  n: number;
  l: number;
  lSymbol: 's' | 'p' | 'd';
  cap: number;
}

const AUFBAU_ORDER: SubshellDef[] = [
  { label: '1s', n: 1, l: 0, lSymbol: 's', cap: 2 },
  { label: '2s', n: 2, l: 0, lSymbol: 's', cap: 2 },
  { label: '2p', n: 2, l: 1, lSymbol: 'p', cap: 6 },
  { label: '3s', n: 3, l: 0, lSymbol: 's', cap: 2 },
  { label: '3p', n: 3, l: 1, lSymbol: 'p', cap: 6 },
  { label: '4s', n: 4, l: 0, lSymbol: 's', cap: 2 },
  { label: '3d', n: 3, l: 2, lSymbol: 'd', cap: 10 },
  { label: '4p', n: 4, l: 1, lSymbol: 'p', cap: 6 },
];

export interface SubshellOccupancy {
  label: string;
  n: number;
  l: number;
  lSymbol: 's' | 'p' | 'd';
  electrons: number;
}

export interface ValenceQuantumNumbers {
  subshell: string;
  n: number;
  l: number;
  ml: number;
  ms: '+½' | '-½';
}

export interface AtomicAnalysis {
  protons: number;
  neutrons: number;
  electrons: number;
  element: ElementRecord;
  massNumber: number;
  netCharge: number;
  chargeFormatted: string;
  ionFormula: string;
  ionKind: 'Neutral Atom' | 'Cation (+)' | 'Anion (−)';
  nuclideNotation: string;
  shells: number[]; // e.g. [2, 8, 1]
  shellNotation: string; // e.g. "2, 8, 1"
  subshells: SubshellOccupancy[];
  subshellConfig: string; // e.g. "1s² 2s² 2p⁶ 3d⁵ 4s¹"
  hasAufbauException: boolean;
  valenceQuantum: ValenceQuantumNumbers | null;
  specialNote: string | null;
}

function fillNeutralGroundState(z: number): Record<string, number> {
  const counts: Record<string, number> = {};
  let remaining = z;
  for (const sub of AUFBAU_ORDER) {
    if (remaining <= 0) break;
    const take = Math.min(sub.cap, remaining);
    counts[sub.label] = take;
    remaining -= take;
  }
  // Apply Chromium (Z=24) and Copper (Z=29) exchange-stability exceptions
  if (z === 24) {
    counts['4s'] = 1;
    counts['3d'] = 5;
  } else if (z === 29) {
    counts['4s'] = 1;
    counts['3d'] = 10;
  }
  return counts;
}

function computeSubshellCounts(protons: number, electrons: number): Record<string, number> {
  if (electrons === 0) return {};
  if (electrons === protons) {
    return fillNeutralGroundState(protons);
  }
  if (electrons < protons && protons > 20) {
    // Transition metal cations lose 4s electrons BEFORE 3d electrons
    const counts = fillNeutralGroundState(protons);
    let toRemove = protons - electrons;
    const removalOrder = ['4p', '4s', '3d', '3p', '3s', '2p', '2s', '1s'];
    for (const label of removalOrder) {
      if (toRemove <= 0) break;
      const cur = counts[label] ?? 0;
      if (cur > 0) {
        const drop = Math.min(cur, toRemove);
        counts[label] = cur - drop;
        toRemove -= drop;
      }
    }
    return counts;
  }
  // Standard Aufbau fill for anions or main-group ions up to 32 electrons
  return fillNeutralGroundState(electrons);
}

function computeValenceQuantumNumbers(subshells: SubshellOccupancy[]): ValenceQuantumNumbers | null {
  if (subshells.length === 0) return null;
  // Last occupied subshell by highest n (or highest Aufbau filling)
  const last = subshells[subshells.length - 1];
  const orbitals = 2 * last.l + 1; // 1 for s, 3 for p, 5 for d
  const idxZeroBased = (last.electrons - 1) % orbitals;
  const ml = -last.l + idxZeroBased;
  const ms: '+½' | '-½' = last.electrons <= orbitals ? '+½' : '-½';
  return {
    subshell: last.label,
    n: last.n,
    l: last.l,
    ml,
    ms,
  };
}

function getSpecialWASSCENote(z: number, n: number, e: number): string | null {
  const mass = z + n;
  if (z === 6 && mass === 12 && e === 6) {
    return 'Carbon-12 (¹²C): Standard atomic mass reference (1 amu = 1/12 mass of ¹²C).';
  }
  if (z === 6 && mass === 14) {
    return 'Carbon-14 (¹⁴C): Radioactive isotope of Carbon (same Z=6, different N=8) used in radiocarbon dating.';
  }
  if (z === 17 && (mass === 35 || mass === 37)) {
    return 'Chlorine Isotopes (³⁵Cl 75% & ³⁷Cl 25%): Weighted average gives Ar = 35.5.';
  }
  if ((z === 18 || z === 20) && mass === 40) {
    return 'Isobar Pair Example: ⁴⁰Ar (Z=18) and ⁴⁰Ca (Z=20) share mass number A=40 but are different elements.';
  }
  if (z === 24 && e === 24) {
    return 'WASSCE Exception: Cr (Z=24) adopts [Ar] 3d⁵ 4s¹ instead of 3d⁴ 4s² for extra half-filled 3d⁵ stability.';
  }
  if (z === 29 && e === 29) {
    return 'WASSCE Exception: Cu (Z=29) adopts [Ar] 3d¹⁰ 4s¹ instead of 3d⁹ 4s² for extra filled 3d¹⁰ stability.';
  }
  if (z > 20 && e < z) {
    return `Transition Ion Rule: ${ELEMENTS_1_TO_30[z - 1].symbol} loses outer 4s electrons before 3d electrons upon ionization.`;
  }
  if (z === 1 && n > 0) {
    return n === 1
      ? 'Deuterium (²₁H): Heavy isotope of Hydrogen with 1 proton and 1 neutron.'
      : 'Tritium (³₁H): Radioactive isotope of Hydrogen with 1 proton and 2 neutrons.';
  }
  return null;
}

export function analyzeAtomicStructure(
  rawProtons: number,
  rawNeutrons: number,
  rawElectrons: number
): AtomicAnalysis {
  const protons = Math.max(1, Math.min(30, Math.round(rawProtons)));
  const neutrons = Math.max(0, Math.min(38, Math.round(rawNeutrons)));
  const electrons = Math.max(0, Math.min(32, Math.round(rawElectrons)));

  const element = ELEMENTS_1_TO_30[protons - 1];
  const massNumber = protons + neutrons;
  const netCharge = protons - electrons;

  let chargeFormatted = '0';
  let ionFormula = element.symbol;
  let ionKind: AtomicAnalysis['ionKind'] = 'Neutral Atom';

  if (netCharge > 0) {
    chargeFormatted = `+${netCharge}`;
    ionFormula = `${element.symbol}${netCharge > 1 ? toSuperscript(String(netCharge)) : ''}⁺`;
    ionKind = 'Cation (+)';
  } else if (netCharge < 0) {
    const abs = Math.abs(netCharge);
    chargeFormatted = `-${abs}`;
    ionFormula = `${element.symbol}${abs > 1 ? toSuperscript(String(abs)) : ''}⁻`;
    ionKind = 'Anion (−)';
  }

  const counts = computeSubshellCounts(protons, electrons);
  // Display shells by Principal Quantum Number n = 1, 2, 3, 4
  const shellTotals = [0, 0, 0, 0];
  const displayOrder: SubshellDef[] = [
    { label: '1s', n: 1, l: 0, lSymbol: 's', cap: 2 },
    { label: '2s', n: 2, l: 0, lSymbol: 's', cap: 2 },
    { label: '2p', n: 2, l: 1, lSymbol: 'p', cap: 6 },
    { label: '3s', n: 3, l: 0, lSymbol: 's', cap: 2 },
    { label: '3p', n: 3, l: 1, lSymbol: 'p', cap: 6 },
    { label: '3d', n: 3, l: 2, lSymbol: 'd', cap: 10 },
    { label: '4s', n: 4, l: 0, lSymbol: 's', cap: 2 },
    { label: '4p', n: 4, l: 1, lSymbol: 'p', cap: 6 },
  ];

  const subshells: SubshellOccupancy[] = [];
  for (const def of displayOrder) {
    const cnt = counts[def.label] ?? 0;
    if (cnt > 0) {
      shellTotals[def.n - 1] += cnt;
      subshells.push({
        label: def.label,
        n: def.n,
        l: def.l,
        lSymbol: def.lSymbol,
        electrons: cnt,
      });
    }
  }

  const shells = shellTotals.filter((count, idx) => count > 0 || shellTotals.slice(idx + 1).some((c) => c > 0));
  const shellNotation = shells.length > 0 ? shells.join(', ') : '0 (Bare Nucleus)';
  const subshellConfig =
    subshells.length > 0
      ? subshells.map((s) => `${s.label}${toSuperscript(String(s.electrons))}`).join(' ')
      : 'None (0 e⁻)';

  const nuclideNotation = `${massNumber}/${protons} ${ionFormula}`;
  const hasAufbauException = (protons === 24 && electrons === 24) || (protons === 29 && electrons === 29);

  return {
    protons,
    neutrons,
    electrons,
    element,
    massNumber,
    netCharge,
    chargeFormatted,
    ionFormula,
    ionKind,
    nuclideNotation,
    shells,
    shellNotation,
    subshells,
    subshellConfig,
    hasAufbauException,
    valenceQuantum: computeValenceQuantumNumbers(subshells),
    specialNote: getSpecialWASSCENote(protons, neutrons, electrons),
  };
}

export interface AtomPreset {
  id: string;
  label: string;
  protons: number;
  neutrons: number;
  electrons: number;
  tag: string;
}

export const WASSCE_ATOM_PRESETS: AtomPreset[] = [
  { id: 'c12', label: '¹²C Atom', protons: 6, neutrons: 6, electrons: 6, tag: 'Reference' },
  { id: 'c14', label: '¹⁴C Isotope', protons: 6, neutrons: 8, electrons: 6, tag: 'Isotope' },
  { id: 'na-ion', label: '²³Na⁺ Ion', protons: 11, neutrons: 12, electrons: 10, tag: 'Cation' },
  { id: 'cl35-ion', label: '³⁵Cl⁻ Ion', protons: 17, neutrons: 18, electrons: 18, tag: 'Anion' },
  { id: 'ar40', label: '⁴⁰Ar', protons: 18, neutrons: 22, electrons: 18, tag: 'Isobar A=40' },
  { id: 'ca40', label: '⁴⁰Ca', protons: 20, neutrons: 20, electrons: 20, tag: 'Isobar A=40' },
  { id: 'cr24', label: '⁵²Cr (3d⁵4s¹)', protons: 24, neutrons: 28, electrons: 24, tag: 'Exception' },
  { id: 'fe2-ion', label: '⁵⁶Fe²⁺ Ion', protons: 26, neutrons: 30, electrons: 24, tag: 'd-Block Ion' },
  { id: 'cu29', label: '⁶⁴Cu (3d¹⁰4s¹)', protons: 29, neutrons: 35, electrons: 29, tag: 'Exception' },
];

export const ATOM_CENTER_X = 170;
export const ATOM_CENTER_Y = 155;

export interface InterpolatedParticle {
  x: number;
  y: number;
  r: number;
  kind?: 'p' | 'n';
  isExcited?: boolean;
}

export interface AtomicModelFrame {
  easedT: number;
  puddingOpacity: number;
  puddingRadius: number;
  plumSigns: { x: number; y: number; opacity: number }[];
  rutherfordBoundaryOpacity: number;
  rutherfordOrbitOpacity: number;
  rutherfordOrbitScale: number;
  alphaOverlayOpacity: number;
  bohrShellOpacity: number;
  bohrShellScale: number;
  nucleusGlowRadius: number;
  nucleusGlowOpacity: number;
  nucleusClusterOpacity: number;
  electronMinusOpacity: number;
  nucleons: InterpolatedParticle[];
  electrons: InterpolatedParticle[];
}

export function clamp01(value: number): number {
  if (!Number.isFinite(value)) return 0;
  return Math.max(0, Math.min(1, value));
}

export function easeInOutCubic(t: number): number {
  const x = clamp01(t);
  return x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2;
}

function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t;
}

function getModelLayerSpec(model: AtomicModelKind) {
  switch (model) {
    case 'plum-pudding':
      return {
        puddingOpacity: 1,
        puddingRadius: 108,
        rutherfordBoundaryOpacity: 0,
        rutherfordOrbitOpacity: 0,
        rutherfordOrbitScale: 0.45,
        alphaOverlayOpacity: 0,
        bohrShellOpacity: 0,
        bohrShellScale: 0.72,
        nucleusGlowRadius: 8,
        nucleusGlowOpacity: 0,
        nucleusClusterOpacity: 0.24,
        electronMinusOpacity: 1,
        electronRadius: 5.5,
        nucleonRadius: 3.4,
      };
    case 'rutherford':
      return {
        puddingOpacity: 0,
        puddingRadius: 18,
        rutherfordBoundaryOpacity: 1,
        rutherfordOrbitOpacity: 1,
        rutherfordOrbitScale: 1,
        alphaOverlayOpacity: 0.9,
        bohrShellOpacity: 0,
        bohrShellScale: 0.85,
        nucleusGlowRadius: 32,
        nucleusGlowOpacity: 1,
        nucleusClusterOpacity: 1,
        electronMinusOpacity: 0,
        electronRadius: 3.6,
        nucleonRadius: 3.2,
      };
    case 'bohr':
      return {
        puddingOpacity: 0,
        puddingRadius: 16,
        rutherfordBoundaryOpacity: 0,
        rutherfordOrbitOpacity: 0,
        rutherfordOrbitScale: 0.95,
        alphaOverlayOpacity: 0,
        bohrShellOpacity: 1,
        bohrShellScale: 1,
        nucleusGlowRadius: 28,
        nucleusGlowOpacity: 1,
        nucleusClusterOpacity: 1,
        electronMinusOpacity: 0,
        electronRadius: 4.2,
        nucleonRadius: 3.0,
      };
  }
}

function getNucleonPosition(
  index: number,
  total: number,
  model: AtomicModelKind
): { x: number; y: number } {
  const goldenAngle = index * 2.39996;
  if (model === 'plum-pudding') {
    const spreadRadius = 18 + Math.sqrt((index + 0.5) / Math.max(1, total)) * 62;
    return {
      x: ATOM_CENTER_X + Math.cos(goldenAngle + 0.6) * spreadRadius,
      y: ATOM_CENTER_Y + Math.sin(goldenAngle + 0.6) * spreadRadius,
    };
  }
  const clusterRadius = Math.min(18, 3.1 * Math.sqrt(index + 0.5));
  return {
    x: ATOM_CENTER_X + Math.cos(goldenAngle) * clusterRadius,
    y: ATOM_CENTER_Y + Math.sin(goldenAngle) * clusterRadius,
  };
}

function getElectronPosition(
  index: number,
  analysis: AtomicAnalysis,
  model: AtomicModelKind,
  excitedOuter: boolean
): { x: number; y: number; isExcited: boolean } {
  const totalElectrons = Math.max(1, analysis.electrons);

  if (model === 'plum-pudding') {
    const angle = index * 2.39996;
    const rad = 16 + Math.sqrt((index + 0.5) / totalElectrons) * 78;
    return {
      x: ATOM_CENTER_X + Math.cos(angle) * rad,
      y: ATOM_CENTER_Y + Math.sin(angle) * rad,
      isExcited: false,
    };
  }

  if (model === 'rutherford') {
    const orbitAngles = [0, 48, 96, 144];
    const ellipseDeg = orbitAngles[index % 4];
    const rx = 82 + ((index % 4) % 2) * 20;
    const ry = 32 + (index % 4) * 5;
    const t = (index / totalElectrons) * Math.PI * 2;
    const lx = Math.cos(t) * rx;
    const ly = Math.sin(t) * ry;
    const rad = (ellipseDeg * Math.PI) / 180;
    return {
      x: ATOM_CENTER_X + lx * Math.cos(rad) - ly * Math.sin(rad),
      y: ATOM_CENTER_Y + lx * Math.sin(rad) + ly * Math.cos(rad),
      isExcited: false,
    };
  }

  // Bohr quantized shell coordinates
  let remaining = index;
  let shellIdx = 0;
  let idxInShell = 0;
  let shellCount = 1;
  for (let s = 0; s < analysis.shells.length; s++) {
    const count = analysis.shells[s] ?? 0;
    if (remaining < count) {
      shellIdx = s;
      idxInShell = remaining;
      shellCount = Math.max(1, count);
      break;
    }
    remaining -= count;
  }

  const baseRadius = 44 + shellIdx * 24;
  const isAnimatedOuter =
    excitedOuter && shellIdx === analysis.shells.length - 1 && idxInShell === 0;
  const radius = isAnimatedOuter ? baseRadius + 16 : baseRadius;
  const angle = (idxInShell / shellCount) * Math.PI * 2 - Math.PI / 2;

  return {
    x: ATOM_CENTER_X + Math.cos(angle) * radius,
    y: ATOM_CENTER_Y + Math.sin(angle) * radius,
    isExcited: isAnimatedOuter,
  };
}

const PLUM_SIGN_OFFSETS: [number, number][] = [
  [-50, -55],
  [50, -55],
  [0, -73],
  [-55, 40],
  [55, 43],
  [0, 77],
];

export function computeAtomicModelFrame(
  fromModel: AtomicModelKind,
  toModel: AtomicModelKind,
  rawProgress: number,
  analysis: AtomicAnalysis,
  options?: { excitedOuter?: boolean }
): AtomicModelFrame {
  const easedT = fromModel === toModel ? 1 : easeInOutCubic(rawProgress);
  const fromSpec = getModelLayerSpec(fromModel);
  const toSpec = getModelLayerSpec(toModel);
  const excitedOuter = Boolean(options?.excitedOuter);

  const puddingOpacity = lerp(fromSpec.puddingOpacity, toSpec.puddingOpacity, easedT);
  const puddingRadius = lerp(fromSpec.puddingRadius, toSpec.puddingRadius, easedT);

  const plumScale = puddingRadius / 108;
  const plumSigns = PLUM_SIGN_OFFSETS.map(([dx, dy]) => ({
    x: ATOM_CENTER_X + dx * plumScale,
    y: ATOM_CENTER_Y + dy * plumScale,
    opacity: puddingOpacity * 0.72,
  }));

  const totalNucleons = Math.min(48, analysis.protons + analysis.neutrons);
  const protonCutoff = Math.round(
    (analysis.protons / Math.max(1, analysis.protons + analysis.neutrons)) * totalNucleons
  );
  const nucleonRadius = lerp(fromSpec.nucleonRadius, toSpec.nucleonRadius, easedT);
  const nucleons: InterpolatedParticle[] = [];
  for (let i = 0; i < totalNucleons; i++) {
    const pFrom = getNucleonPosition(i, totalNucleons, fromModel);
    const pTo = getNucleonPosition(i, totalNucleons, toModel);
    nucleons.push({
      x: lerp(pFrom.x, pTo.x, easedT),
      y: lerp(pFrom.y, pTo.y, easedT),
      r: nucleonRadius,
      kind: i < protonCutoff ? 'p' : 'n',
    });
  }

  const electronRadius = lerp(fromSpec.electronRadius, toSpec.electronRadius, easedT);
  const renderElectronCount = Math.min(32, analysis.electrons);
  const swirlAmp = fromModel !== toModel ? Math.sin(Math.PI * easedT) * 14 : 0;
  const electrons: InterpolatedParticle[] = [];
  for (let i = 0; i < renderElectronCount; i++) {
    const eFrom = getElectronPosition(i, analysis, fromModel, false);
    const eTo = getElectronPosition(i, analysis, toModel, excitedOuter);
    const baseX = lerp(eFrom.x, eTo.x, easedT);
    const baseY = lerp(eFrom.y, eTo.y, easedT);
    const dx = eTo.x - eFrom.x;
    const dy = eTo.y - eFrom.y;
    const len = Math.hypot(dx, dy) || 1;
    const dir = i % 2 === 0 ? 1 : -1;
    electrons.push({
      x: baseX + (-dy / len) * swirlAmp * dir,
      y: baseY + (dx / len) * swirlAmp * dir,
      r: electronRadius,
      isExcited: eTo.isExcited,
    });
  }

  return {
    easedT,
    puddingOpacity,
    puddingRadius,
    plumSigns,
    rutherfordBoundaryOpacity: lerp(
      fromSpec.rutherfordBoundaryOpacity,
      toSpec.rutherfordBoundaryOpacity,
      easedT
    ),
    rutherfordOrbitOpacity: lerp(
      fromSpec.rutherfordOrbitOpacity,
      toSpec.rutherfordOrbitOpacity,
      easedT
    ),
    rutherfordOrbitScale: lerp(
      fromSpec.rutherfordOrbitScale,
      toSpec.rutherfordOrbitScale,
      easedT
    ),
    alphaOverlayOpacity: lerp(
      fromSpec.alphaOverlayOpacity,
      toSpec.alphaOverlayOpacity,
      easedT
    ),
    bohrShellOpacity: lerp(fromSpec.bohrShellOpacity, toSpec.bohrShellOpacity, easedT),
    bohrShellScale: lerp(fromSpec.bohrShellScale, toSpec.bohrShellScale, easedT),
    nucleusGlowRadius: lerp(fromSpec.nucleusGlowRadius, toSpec.nucleusGlowRadius, easedT),
    nucleusGlowOpacity: lerp(fromSpec.nucleusGlowOpacity, toSpec.nucleusGlowOpacity, easedT),
    nucleusClusterOpacity: lerp(
      fromSpec.nucleusClusterOpacity,
      toSpec.nucleusClusterOpacity,
      easedT
    ),
    electronMinusOpacity: lerp(
      fromSpec.electronMinusOpacity,
      toSpec.electronMinusOpacity,
      easedT
    ),
    nucleons,
    electrons,
  };
}
