export interface OhmsLawResult {
  totalResistance: number;
  currentAmps: number;
  voltageR1: number;
  voltageR2: number;
  powerWatts: number;
}

export function solveOhmsLawCircuit(
  emfVolts: number,
  r1Ohms: number,
  r2Ohms: number,
  mode: 'series' | 'parallel'
): OhmsLawResult {
  const safeV = Math.max(0, emfVolts);
  const safeR1 = Math.max(0.5, r1Ohms);
  const safeR2 = Math.max(0.5, r2Ohms);

  if (mode === 'series') {
    const totalResistance = safeR1 + safeR2;
    const currentAmps = safeV / totalResistance;
    return {
      totalResistance,
      currentAmps,
      voltageR1: currentAmps * safeR1,
      voltageR2: currentAmps * safeR2,
      powerWatts: safeV * currentAmps,
    };
  }

  const totalResistance = (safeR1 * safeR2) / (safeR1 + safeR2);
  const currentAmps = safeV / totalResistance;
  return {
    totalResistance,
    currentAmps,
    voltageR1: safeV,
    voltageR2: safeV,
    powerWatts: safeV * currentAmps,
  };
}

export interface ProjectileMetrics {
  timeOfFlight: number;
  maxHeight: number;
  horizontalRange: number;
  vx: number;
  vy: number;
}

export function computeProjectileMetrics(
  initialVelocity: number,
  angleDeg: number,
  gravity = 9.81
): ProjectileMetrics {
  const v0 = Math.max(1, initialVelocity);
  const rad = (Math.max(5, Math.min(85, angleDeg)) * Math.PI) / 180;
  const vx = v0 * Math.cos(rad);
  const vy = v0 * Math.sin(rad);
  const timeOfFlight = (2 * vy) / gravity;
  const maxHeight = (vy * vy) / (2 * gravity);
  const horizontalRange = vx * timeOfFlight;
  return { timeOfFlight, maxHeight, horizontalRange, vx, vy };
}

export function sampleProjectilePosition(
  initialVelocity: number,
  angleDeg: number,
  tSeconds: number,
  gravity = 9.81
): { x: number; y: number } {
  const rad = (Math.max(5, Math.min(85, angleDeg)) * Math.PI) / 180;
  const vx = initialVelocity * Math.cos(rad);
  const vy = initialVelocity * Math.sin(rad);
  const x = vx * tSeconds;
  const y = Math.max(0, vy * tSeconds - 0.5 * gravity * tSeconds * tSeconds);
  return { x, y };
}

export interface TitrationState {
  ph: number;
  indicatorColor: 'colorless' | 'pale-pink' | 'deep-magenta';
  stageLabel: string;
}

/**
 * Strong Acid (25.0 cm3 of 0.10 mol/dm3 HCl) titrated with Strong Base (0.10 mol/dm3 NaOH).
 */
export function computeTitrationPH(
  naohVolumeCm3: number,
  acidVolumeCm3 = 25.0,
  acidMolarity = 0.1,
  baseMolarity = 0.1
): TitrationState {
  const vBase = Math.max(0, naohVolumeCm3);
  const totalVol = acidVolumeCm3 + vBase;
  const molesH = acidVolumeCm3 * acidMolarity;
  const molesOH = vBase * baseMolarity;
  const diff = molesH - molesOH;

  let ph: number;
  if (Math.abs(diff) < 1e-4) {
    ph = 7.0;
  } else if (diff > 0) {
    const hConc = diff / totalVol;
    ph = -Math.log10(hConc);
  } else {
    const ohConc = Math.abs(diff) / totalVol;
    const poh = -Math.log10(ohConc);
    ph = 14.0 - poh;
  }

  ph = Math.max(0.5, Math.min(13.5, Number(ph.toFixed(2))));

  let indicatorColor: TitrationState['indicatorColor'] = 'colorless';
  let stageLabel = 'Acidic Region (Excess H⁺)';

  if (ph >= 8.2 && ph <= 10.0) {
    indicatorColor = 'pale-pink';
    stageLabel = 'Endpoint Reached (Phenolphthalein Pale Pink)';
  } else if (ph > 10.0) {
    indicatorColor = 'deep-magenta';
    stageLabel = 'Over-Titrated (Excess OH⁻)';
  } else if (Math.abs(ph - 7.0) <= 1.2) {
    indicatorColor = 'pale-pink';
    stageLabel = 'Near Equivalence Point';
  }

  return { ph, indicatorColor, stageLabel };
}

export type LogicGateType = 'AND' | 'OR' | 'NAND' | 'NOR' | 'XOR';

export function evaluateLogicGate(gate: LogicGateType, a: boolean, b: boolean): boolean {
  switch (gate) {
    case 'AND':
      return a && b;
    case 'OR':
      return a || b;
    case 'NAND':
      return !(a && b);
    case 'NOR':
      return !(a || b);
    case 'XOR':
      return a !== b;
  }
}

export function buildTruthTable(gate: LogicGateType): { a: 0 | 1; b: 0 | 1; out: 0 | 1 }[] {
  const inputs: [0 | 1, 0 | 1][] = [
    [0, 0],
    [0, 1],
    [1, 0],
    [1, 1],
  ];
  return inputs.map(([a, b]) => ({
    a,
    b,
    out: evaluateLogicGate(gate, a === 1, b === 1) ? 1 : 0,
  }));
}

export interface PendulumMetrics {
  periodSeconds: number;
  frequencyHz: number;
  angularFrequency: number;
  maxSpeedMs: number;
}

export function computePendulumMetrics(
  lengthMeters: number,
  gravity = 9.81,
  maxAngleDeg = 15
): PendulumMetrics {
  const L = Math.max(0.1, lengthMeters);
  const g = Math.max(1.0, gravity);
  const periodSeconds = 2 * Math.PI * Math.sqrt(L / g);
  const frequencyHz = 1 / periodSeconds;
  const angularFrequency = Math.sqrt(g / L);
  const thetaRad = (Math.max(1, maxAngleDeg) * Math.PI) / 180;
  const maxSpeedMs = angularFrequency * L * thetaRad;
  return { periodSeconds, frequencyHz, angularFrequency, maxSpeedMs };
}

export interface ThinLensResult {
  imageDistCm: number;
  magnification: number;
  isReal: boolean;
  isInverted: boolean;
  nature: string;
}

export function computeThinLensImage(
  objectDistCm: number,
  focalLengthCm: number
): ThinLensResult {
  const u = Math.max(2, objectDistCm);
  const f = Math.max(2, focalLengthCm);
  if (Math.abs(u - f) < 0.25) {
    return {
      imageDistCm: 999,
      magnification: 99,
      isReal: true,
      isInverted: true,
      nature: 'At Focal Point (Image at Infinity)',
    };
  }
  const v = (u * f) / (u - f);
  const magnification = Math.abs(v / u);
  const isReal = v > 0;
  const isInverted = isReal;
  const sizeDesc =
    Math.abs(magnification - 1) < 0.05
      ? 'Same Size'
      : magnification > 1
        ? 'Magnified'
        : 'Diminished';
  const nature = `${isReal ? 'Real' : 'Virtual'}, ${isInverted ? 'Inverted' : 'Upright'}, ${sizeDesc}`;
  return {
    imageDistCm: Number(v.toFixed(2)),
    magnification: Number(magnification.toFixed(2)),
    isReal,
    isInverted,
    nature,
  };
}

export interface MicrometerReading {
  rawReadingMm: number;
  sleeveReadingMm: number;
  thimbleDivisions: number;
  correctedDiameterMm: number;
}

export function computeMicrometerReading(
  trueDiameterMm: number,
  zeroErrorMm = 0
): MicrometerReading {
  const clampedTrue = Math.max(0.5, Math.min(25, trueDiameterMm));
  const rawReadingMm = Math.max(0, Number((clampedTrue + zeroErrorMm).toFixed(2)));
  const sleeveReadingMm = Math.floor(rawReadingMm * 2) / 2;
  const thimbleDivisions = Math.round(((rawReadingMm - sleeveReadingMm) / 0.01) * 10) / 10;
  const correctedDiameterMm = Number((rawReadingMm - zeroErrorMm).toFixed(2));
  return {
    rawReadingMm,
    sleeveReadingMm,
    thimbleDivisions: Math.max(0, Math.min(49, Math.round(thimbleDivisions))),
    correctedDiameterMm,
  };
}

export interface IdealGasResult {
  pressureKpa: number;
  pvProduct: number;
  meanSpeedFactor: number;
}

export function computeIdealGasState(
  volumeLiters: number,
  tempKelvin: number,
  moles = 1.0
): IdealGasResult {
  const R = 8.314; // kPa·L / (mol·K)
  const safeV = Math.max(0.5, volumeLiters);
  const safeT = Math.max(150, tempKelvin);
  const pressureKpa = (moles * R * safeT) / safeV;
  return {
    pressureKpa: Number(pressureKpa.toFixed(1)),
    pvProduct: Number((pressureKpa * safeV).toFixed(1)),
    meanSpeedFactor: Number(Math.sqrt(safeT / 300).toFixed(2)),
  };
}

export interface StandingWaveResult {
  waveSpeedMs: number;
  wavelengthM: number;
  frequencyHz: number;
  nodesCount: number;
  antinodesCount: number;
}

export function computeStandingWaveHarmonic(
  stringLengthM: number,
  tensionN: number,
  harmonicN: number,
  linearDensityKgM = 0.0025
): StandingWaveResult {
  const L = Math.max(0.2, stringLengthM);
  const T = Math.max(5, tensionN);
  const n = Math.max(1, Math.min(6, Math.round(harmonicN)));
  const waveSpeedMs = Math.sqrt(T / linearDensityKgM);
  const wavelengthM = (2 * L) / n;
  const frequencyHz = waveSpeedMs / wavelengthM;
  return {
    waveSpeedMs: Number(waveSpeedMs.toFixed(1)),
    wavelengthM: Number(wavelengthM.toFixed(3)),
    frequencyHz: Number(frequencyHz.toFixed(1)),
    nodesCount: n + 1,
    antinodesCount: n,
  };
}

export interface EnzymeKineticsResult {
  relativeRatePct: number;
  statusLabel: string;
  isDenatured: boolean;
}

export function computeEnzymeReactionRate(
  tempCelsius: number,
  ph: number
): EnzymeKineticsResult {
  // Optimum human amylase/catalase around 37°C and pH 7.0
  let tempFactor: number;
  if (tempCelsius <= 40) {
    tempFactor = Math.exp(-Math.pow((tempCelsius - 37) / 14, 2));
  } else {
    tempFactor = Math.max(0, Math.exp(-Math.pow((tempCelsius - 40) / 8, 2)));
  }
  const phFactor = Math.exp(-Math.pow((ph - 7.0) / 1.9, 2));
  const rate = Math.round(tempFactor * phFactor * 100);
  const isDenatured = tempCelsius >= 52 || ph <= 3.0 || ph >= 11.0;

  let statusLabel = 'Active Catalysis';
  if (isDenatured) {
    statusLabel = 'Denatured Active Site (Loss of 3D Structure)';
  } else if (rate >= 85) {
    statusLabel = 'Optimal Enzyme–Substrate Complex Formation';
  } else if (tempCelsius < 20) {
    statusLabel = 'Low Kinetic Energy (Slow Collisions)';
  } else if (tempCelsius > 42) {
    statusLabel = 'Thermal Denaturation Beginning';
  }

  return {
    relativeRatePct: Math.max(0, Math.min(100, rate)),
    statusLabel,
    isDenatured,
  };
}

export type CathodeGasId = 'H2' | 'Ne' | 'Ar';

export interface CathodeRayResult {
  electronSpeedMs: number;
  electricFieldVm: number;
  electricDeflectionMm: number;
  magneticDeflectionMm: number;
  netDeflectionMm: number;
  balanceMagneticFieldMt: number;
  isVelocityBalanced: boolean;
  eOverMRatio: string;
}

/**
 * J.J. Thomson (1897) Cathode Ray Tube crossed E & B field physics.
 * Demonstrates e/m = 1.7588 x 10^11 C/kg independent of residual cathode tube gas.
 */
export function computeCathodeRayDeflection(
  plateVoltageV: number,
  magneticFieldMt: number,
  acceleratingV = 2500,
  _gasId: CathodeGasId = 'Ne'
): CathodeRayResult {
  const eOverM = 1.75882e11; // C/kg
  const vAcc = Math.max(500, Math.min(6000, acceleratingV));
  const speed = Math.sqrt(2 * eOverM * vAcc); // m/s
  const dPlates = 0.02; // 2 cm separation
  const lPlates = 0.06; // 6 cm field region
  const driftD = 0.14; // 14 cm to ZnS screen

  const eField = plateVoltageV / dPlates; // V/m
  const bTesla = magneticFieldMt * 1e-3;

  // y_E = (e*E / m) * (L/v)^2 * (0.5 + D/L) -> convert m to mm
  const geomFactor = Math.pow(lPlates / speed, 2) * (0.5 + driftD / lPlates) * 1000;
  const electricDeflectionMm = eOverM * eField * geomFactor;
  const magneticDeflectionMm = eOverM * (speed * bTesla) * geomFactor;
  const netRaw = electricDeflectionMm - magneticDeflectionMm;
  const netDeflectionMm = Number(Math.max(-44, Math.min(44, netRaw)).toFixed(2));

  const balanceMagneticFieldMt = Number((((eField / speed) * 1000)).toFixed(3));
  const isVelocityBalanced = Math.abs(netDeflectionMm) <= 1.2;

  return {
    electronSpeedMs: Math.round(speed),
    electricFieldVm: Math.round(eField),
    electricDeflectionMm: Number(electricDeflectionMm.toFixed(2)),
    magneticDeflectionMm: Number(magneticDeflectionMm.toFixed(2)),
    netDeflectionMm,
    balanceMagneticFieldMt,
    isVelocityBalanced,
    eOverMRatio: '1.76 × 10¹¹ C kg⁻¹',
  };
}

export type FoilElement = 'Au' | 'Al';
export type ScatteringModelMode = 'rutherford' | 'thomson';

export interface RutherfordScatteringResult {
  atomicNumberZ: number;
  closestApproachFm: number;
  straightThroughPct: number;
  smallDeflectionPct: number;
  backscatterPct: number;
  explanation: string;
}

/**
 * Geiger-Marsden / Rutherford (1911) Gold Foil alpha-scattering vs Thomson Plum Pudding prediction.
 */
export function computeRutherfordScattering(
  alphaEnergyMev: number,
  foilElement: FoilElement,
  modelMode: ScatteringModelMode
): RutherfordScatteringResult {
  const Z = foilElement === 'Au' ? 79 : 13;
  const E = Math.max(2.0, Math.min(10.0, alphaEnergyMev));

  // Distance of closest approach for head-on collision: d_min ≈ (2 * Z * 1.44 MeV·fm) / E_alpha
  const closestApproachFm = Number(((2 * Z * 1.44) / E).toFixed(1));

  if (modelMode === 'thomson') {
    return {
      atomicNumberZ: Z,
      closestApproachFm,
      straightThroughPct: 99.98,
      smallDeflectionPct: 0.02,
      backscatterPct: 0.0,
      explanation:
        'Thomson Plum Pudding predicts diffuse positive charge cannot exert strong electrostatic repulsion, so 0% of alpha particles bounce back (>90°).',
    };
  }

  // Rutherford nuclear cross-section scales with (Z / E)^2
  const scale = Math.pow((Z / 79) * (5.0 / E), 2);
  const backscatterPct = Number(Math.min(2.4, Math.max(0.01, 0.18 * scale)).toFixed(2));
  const smallDeflectionPct = Number(Math.min(18.0, Math.max(0.15, 2.4 * scale)).toFixed(2));
  const straightThroughPct = Number((100 - backscatterPct - smallDeflectionPct).toFixed(2));

  return {
    atomicNumberZ: Z,
    closestApproachFm,
    straightThroughPct,
    smallDeflectionPct,
    backscatterPct,
    explanation:
      foilElement === 'Au'
        ? 'Dense +79e gold nucleus creates an intense Coulomb field at femtometer distances, deflecting occasional alpha particles >90° while most pass through empty space.'
        : 'Lighter +13e aluminium nucleus reduces (Z/E)² Coulomb repulsion dramatically, producing far fewer wide-angle scatterings than gold.',
  };
}

export type MathFunctionPreset = 'quadratic' | 'cubic' | 'sine';

export interface MathCalculusSample {
  fx: number;
  derivative: number;
  riemannIntegral: number;
  stationarySummary: string;
}

function evalMathFn(fnType: MathFunctionPreset, x: number): number {
  switch (fnType) {
    case 'quadratic':
      return 0.5 * x * x - 2 * x + 1;
    case 'cubic':
      return 0.25 * x * x * x - x;
    case 'sine':
      return 2 * Math.sin(x);
  }
}

function evalMathDeriv(fnType: MathFunctionPreset, x: number): number {
  switch (fnType) {
    case 'quadratic':
      return x - 2;
    case 'cubic':
      return 0.75 * x * x - 1;
    case 'sine':
      return 2 * Math.cos(x);
  }
}

export function computeMathCalculusSample(
  fnType: MathFunctionPreset,
  xVal: number,
  aBound: number,
  bBound: number
): MathCalculusSample {
  const low = Math.min(aBound, bBound);
  const high = Math.max(aBound, bBound);
  const steps = 120;
  const dx = (high - low) / steps;
  let area = 0;
  if (dx > 0) {
    for (let i = 0; i < steps; i++) {
      const midX = low + (i + 0.5) * dx;
      area += evalMathFn(fnType, midX) * dx;
    }
  }

  const fx = Number(evalMathFn(fnType, xVal).toFixed(3));
  const derivative = Number(evalMathDeriv(fnType, xVal).toFixed(3));
  const riemannIntegral = Number(area.toFixed(3));

  const stationarySummary =
    fnType === 'quadratic'
      ? 'Minimum at x = 2, y = -1 (Δ = 2 > 0, two real roots)'
      : fnType === 'cubic'
        ? 'Local max at x ≈ -1.15, local min at x ≈ +1.15'
        : 'Crest +2 at π/2, trough -2 at 3π/2 (period 2π)';

  return { fx, derivative, riemannIntegral, stationarySummary };
}

export interface RadioactiveDecayResult {
  remainingNuclei: number;
  decayedNuclei: number;
  activityFractionPct: number;
  decayConstantPerHr: number;
  halfLivesElapsed: number;
}

export function computeRadioactiveDecay(
  n0: number,
  halfLifeHours: number,
  elapsedHours: number
): RadioactiveDecayResult {
  const safeN0 = Math.max(10, n0);
  const safeHalf = Math.max(0.5, halfLifeHours);
  const safeTime = Math.max(0, elapsedHours);
  const decayConstantPerHr = Math.LN2 / safeHalf;
  const halfLivesElapsed = safeTime / safeHalf;
  const fraction = Math.pow(0.5, halfLivesElapsed);
  const remainingNuclei = Math.round(safeN0 * fraction);
  const decayedNuclei = Math.max(0, safeN0 - remainingNuclei);
  return {
    remainingNuclei,
    decayedNuclei,
    activityFractionPct: Number((fraction * 100).toFixed(1)),
    decayConstantPerHr: Number(decayConstantPerHr.toFixed(4)),
    halfLivesElapsed: Number(halfLivesElapsed.toFixed(2)),
  };
}

export interface OsmosisPhotosynthesisResult {
  cellState: 'Turgid (Hypotonic)' | 'Flaccid (Isotonic)' | 'Plasmolysed (Hypertonic)';
  osmoticFlowRate: number;
  photosynthesisRatePct: number;
  limitingFactor: 'Light Intensity' | 'CO₂ Concentration' | 'Light Saturation';
}

export function computeOsmosisAndPhotosynthesis(
  solutePct: number,
  lightIntensity: number,
  co2Pct: number
): OsmosisPhotosynthesisResult {
  // Cell sap isotonic concentration is modeled at 2.0% sucrose
  const isotonicPct = 2.0;
  const diff = Number((isotonicPct - solutePct).toFixed(2));
  let cellState: OsmosisPhotosynthesisResult['cellState'] = 'Flaccid (Isotonic)';
  if (diff > 0.35) {
    cellState = 'Turgid (Hypotonic)';
  } else if (diff < -0.35) {
    cellState = 'Plasmolysed (Hypertonic)';
  }

  // Blackman's law of limiting factors
  const lightNorm = Math.min(100, Math.max(0, lightIntensity));
  const co2Norm = Math.min(100, Math.max(0, (co2Pct / 0.12) * 100));
  const limitingVal = Math.min(lightNorm, co2Norm);
  const limitingFactor: OsmosisPhotosynthesisResult['limitingFactor'] =
    lightNorm >= 85 && co2Norm >= 85
      ? 'Light Saturation'
      : lightNorm <= co2Norm
        ? 'Light Intensity'
        : 'CO₂ Concentration';

  return {
    cellState,
    osmoticFlowRate: Number(Math.abs(diff * 12).toFixed(1)),
    photosynthesisRatePct: Math.round(limitingVal),
    limitingFactor,
  };
}

export interface SimpleMachineMetrics {
  loadForceN: number;
  mechanicalAdvantage: number;
  idealVelocityRatio: number;
  efficiencyPct: number;
  workInputJ: number;
  usefulWorkOutJ: number;
}

export function computeSimpleMachineMetrics(
  effortN: number,
  loadN: number,
  velocityRatio: number,
  inclineDeg = 30
): SimpleMachineMetrics {
  const safeE = Math.max(1, effortN);
  const safeL = Math.max(0, loadN);
  const safeIncline = Math.max(10, Math.min(75, inclineDeg));
  const idealVRFromIncline = 1 / Math.sin((safeIncline * Math.PI) / 180);
  const vr = Math.max(1, Number((velocityRatio > 0 ? velocityRatio : idealVRFromIncline).toFixed(2)));
  const ma = Math.min(vr * 0.98, safeL / safeE);
  const efficiencyPct = Math.min(98, Number(((ma / vr) * 100).toFixed(1)));
  // Suppose Load moves 1.0 m -> Effort moves VR * 1.0 m
  const usefulWorkOutJ = Number((safeL * 1.0).toFixed(1));
  const workInputJ = Number((safeE * vr * 1.0).toFixed(1));

  return {
    loadForceN: safeL,
    mechanicalAdvantage: Number(ma.toFixed(2)),
    idealVelocityRatio: vr,
    efficiencyPct,
    workInputJ,
    usefulWorkOutJ,
  };
}

// =========================================================================
// NEW GRADE 10 - 12 SIMULATOR PHYSICS & MATH HELPERS
// =========================================================================

// Grade 10 (SHS 1): Uniformly Accelerated Kinematics (v = u + at, s = ut + 1/2 at^2)
export interface KinematicsResult {
  finalVelocityMs: number;
  displacementM: number;
  averageVelocityMs: number;
  kineticEnergyFactor: number;
}

export function computeKinematicsMotion(
  initialVelocityMs: number,
  accelerationMs2: number,
  timeSeconds: number
): KinematicsResult {
  const u = Math.max(0, Math.min(40, initialVelocityMs));
  const a = Math.max(-8, Math.min(12, accelerationMs2));
  const t = Math.max(0, Math.min(20, timeSeconds));
  const finalVelocityMs = u + a * t;
  const displacementM = u * t + 0.5 * a * t * t;
  const averageVelocityMs = t > 0 ? displacementM / t : u;
  return {
    finalVelocityMs: Number(finalVelocityMs.toFixed(2)),
    displacementM: Number(displacementM.toFixed(2)),
    averageVelocityMs: Number(averageVelocityMs.toFixed(2)),
    kineticEnergyFactor: Number((0.5 * finalVelocityMs * finalVelocityMs).toFixed(1)),
  };
}

// Grade 10 (SHS 1): Thermal Calorimetry & Specific Heat Equilibrium
export interface CalorimetryResult {
  equilibriumTempC: number;
  heatLostByMetalJ: number;
  heatGainedByWaterJ: number;
}

export function computeCalorimetryEquilibrium(
  metalMassKg: number,
  metalSpecificHeat: number,
  metalInitialTempC: number,
  waterMassKg: number,
  waterInitialTempC = 25
): CalorimetryResult {
  const cWater = 4200; // J/(kg·K)
  const capMetal = Math.max(10, metalMassKg * metalSpecificHeat);
  const capWater = Math.max(100, waterMassKg * cWater);
  const tEq =
    (capMetal * metalInitialTempC + capWater * waterInitialTempC) / (capMetal + capWater);
  const heatLostByMetalJ = capMetal * (metalInitialTempC - tEq);
  const heatGainedByWaterJ = capWater * (tEq - waterInitialTempC);
  return {
    equilibriumTempC: Number(tEq.toFixed(2)),
    heatLostByMetalJ: Math.round(heatLostByMetalJ),
    heatGainedByWaterJ: Math.round(heatGainedByWaterJ),
  };
}

// Grade 11 (SHS 2): Three-Figure Bearings & Trigonometric Vector Displacement
export interface BearingVectorResult {
  eastKm: number;
  northKm: number;
  distanceKm: number;
  returnBearingDeg: number;
  quadrantLabel: string;
}

export function computeBearingVector(bearingDeg: number, distanceKm: number): BearingVectorResult {
  const normalized = ((bearingDeg % 360) + 360) % 360;
  const rad = (normalized * Math.PI) / 180;
  const dist = Math.max(1, distanceKm);
  const eastKm = Number((dist * Math.sin(rad)).toFixed(2));
  const northKm = Number((dist * Math.cos(rad)).toFixed(2));
  const returnBearingDeg = Math.round((normalized + 180) % 360);
  const quadrantLabel =
    normalized < 90
      ? 'North-East (N·E)'
      : normalized < 180
        ? 'South-East (S·E)'
        : normalized < 270
          ? 'South-West (S·W)'
          : 'North-West (N·W)';
  return { eastKm, northKm, distanceKm: dist, returnBearingDeg, quadrantLabel };
}

// Grade 11 (SHS 2): Electrostatics — Coulomb Force & Electric Field Strength
export interface ElectrostaticsResult {
  forceNewtons: number;
  electricFieldStrengthNC: number;
  interactionType: 'Repulsion' | 'Attraction';
}

export function computeElectrostaticsCoulomb(
  q1MicroC: number,
  q2MicroC: number,
  distanceCm: number
): ElectrostaticsResult {
  const k = 8.99e9;
  const rMeters = Math.max(0.02, distanceCm / 100);
  const q1 = q1MicroC * 1e-6;
  const q2 = q2MicroC * 1e-6;
  const forceNewtons = (k * Math.abs(q1 * q2)) / (rMeters * rMeters);
  const electricFieldStrengthNC = (k * Math.abs(q1)) / (rMeters * rMeters);
  const interactionType = q1MicroC * q2MicroC >= 0 ? 'Repulsion' : 'Attraction';
  return {
    forceNewtons: Number(forceNewtons.toFixed(2)),
    electricFieldStrengthNC: Math.round(electricFieldStrengthNC),
    interactionType,
  };
}

// Grade 12 (SHS 3): AC Transformer Turns Ratio & Ideal Power Conservation
export interface TransformerMetricsResult {
  secondaryVoltageV: number;
  primaryCurrentA: number;
  secondaryCurrentA: number;
  turnsRatio: number;
  transformerMode: 'Step-Up' | 'Step-Down' | 'Isolation (1:1)';
}

export function computeAcTransformerMetrics(
  primaryVoltageV: number,
  primaryTurns: number,
  secondaryTurns: number,
  loadResistanceOhms: number,
  efficiencyPct = 96
): TransformerMetricsResult {
  const vp = Math.max(10, primaryVoltageV);
  const np = Math.max(50, primaryTurns);
  const ns = Math.max(50, secondaryTurns);
  const turnsRatio = Number((ns / np).toFixed(2));
  const vs = vp * (ns / np);
  const rLoad = Math.max(5, loadResistanceOhms);
  const isSec = vs / rLoad;
  const pOut = vs * isSec;
  const eff = Math.max(0.5, Math.min(1, efficiencyPct / 100));
  const pIn = pOut / eff;
  const ip = pIn / vp;
  const transformerMode =
    ns > np ? 'Step-Up' : ns < np ? 'Step-Down' : 'Isolation (1:1)';

  return {
    secondaryVoltageV: Number(vs.toFixed(1)),
    primaryCurrentA: Number(ip.toFixed(2)),
    secondaryCurrentA: Number(isSec.toFixed(2)),
    turnsRatio,
    transformerMode,
  };
}

// Grade 12 (SHS 3): Mendelian Monohybrid Punnett Genetics
export type GenotypePair = 'AA' | 'Aa' | 'aa';

export interface PunnettGeneticsResult {
  grid: [GenotypePair, GenotypePair, GenotypePair, GenotypePair];
  dominantPhenotypePct: number;
  recessivePhenotypePct: number;
  genotypeRatioText: string;
}

export function computePunnettGenetics(
  parent1: GenotypePair,
  parent2: GenotypePair
): PunnettGeneticsResult {
  const alleles1 = [parent1[0], parent1[1]];
  const alleles2 = [parent2[0], parent2[1]];
  const combine = (a: string, b: string): GenotypePair => {
    if (a === 'A' && b === 'A') return 'AA';
    if (a === 'a' && b === 'a') return 'aa';
    return 'Aa';
  };
  const grid: [GenotypePair, GenotypePair, GenotypePair, GenotypePair] = [
    combine(alleles1[0], alleles2[0]),
    combine(alleles1[0], alleles2[1]),
    combine(alleles1[1], alleles2[0]),
    combine(alleles1[1], alleles2[1]),
  ];
  const aaCount = grid.filter((g) => g === 'aa').length;
  const dominantCount = 4 - aaCount;
  const cntAA = grid.filter((g) => g === 'AA').length;
  const cntAa = grid.filter((g) => g === 'Aa').length;

  return {
    grid,
    dominantPhenotypePct: Math.round((dominantCount / 4) * 100),
    recessivePhenotypePct: Math.round((aaCount / 4) * 100),
    genotypeRatioText: `${cntAA} AA : ${cntAa} Aa : ${aaCount} aa`,
  };
}

export function pickSimulatorForStudyNote(subject: string, title: string): import('../types/index.ts').SimulatorKind {
  const t = title.toLowerCase();
  if (subject === 'physics') {
    if (t.includes('projectile')) return 'projectile-3d';
    if (t.includes('pendulum') || t.includes('harmonic')) return 'pendulum-3d';
    if (t.includes('optic') || t.includes('lens') || t.includes('refraction') || t.includes('light')) return 'optics-3d';
    if (t.includes('micrometer') || t.includes('measurement') || t.includes('dimension') || t.includes('vernier')) return 'micrometer-3d';
    if (t.includes('wave') || t.includes('sound') || t.includes('resonance')) return 'wave-standing';
    if (t.includes('transformer') || t.includes('electromagnetic') || t.includes('induction') || t.includes('ac')) return 'ac-transformer-3d';
    if (t.includes('electric') || t.includes('charge') || t.includes('coulomb') || t.includes('capacit')) return 'electrostatics-field';
    if (t.includes('nuclear') || t.includes('radioact') || t.includes('half-life')) return 'radioactive-decay';
    if (t.includes('kinematic') || t.includes('motion') || t.includes('velocity') || t.includes('newton')) return 'kinematics-motion';
    return 'ohms-law';
  }
  if (subject === 'chemistry') {
    if (t.includes('cathode') || t.includes('thomson') || t.includes('electron')) return 'thomson-crt';
    if (t.includes('rutherford') || t.includes('nucleus') || t.includes('atomic model') || t.includes('quantum')) return 'rutherford-scattering';
    if (t.includes('radioact') || t.includes('isotope') || t.includes('decay')) return 'radioactive-decay';
    if (t.includes('gas') || t.includes('boyle') || t.includes('charles') || t.includes('kinetic')) return 'gas-laws';
    if (t.includes('heat') || t.includes('enthalpy') || t.includes('calorimet') || t.includes('thermo')) return 'thermal-calorimetry';
    return 'titration';
  }
  if (subject === 'biology') {
    if (t.includes('genetic') || t.includes('heredity') || t.includes('mendel') || t.includes('dna')) return 'genetics-punnett';
    if (t.includes('enzyme') || t.includes('respiration') || t.includes('digestion')) return 'enzyme-rate';
    return 'osmosis-cell';
  }
  if (subject === 'ict') return 'logic-gate';
  if (subject === 'addmaths') return 'math-function-calc';
  if (subject === 'coremath') {
    if (t.includes('bearing') || t.includes('trig') || t.includes('angle') || t.includes('vector')) return 'bearings-trig';
    return 'math-function-calc';
  }
  if (subject === 'integratedscience') {
    if (t.includes('machine') || t.includes('work') || t.includes('energy')) return 'simple-machines';
    if (t.includes('acid') || t.includes('base') || t.includes('salt')) return 'titration';
    if (t.includes('heat') || t.includes('temperature')) return 'thermal-calorimetry';
    return 'osmosis-cell';
  }
  return 'ohms-law';
}




