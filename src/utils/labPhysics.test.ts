import test from 'node:test';
import assert from 'node:assert/strict';
import {
  buildTruthTable,
  computeEnzymeReactionRate,
  computeIdealGasState,
  computeMicrometerReading,
  computePendulumMetrics,
  computeProjectileMetrics,
  computeStandingWaveHarmonic,
  computeThinLensImage,
  computeTitrationPH,
  computeCathodeRayDeflection,
  computeRutherfordScattering,
  computeKinematicsMotion,
  computeCalorimetryEquilibrium,
  computeBearingVector,
  computeElectrostaticsCoulomb,
  computeAcTransformerMetrics,
  computePunnettGenetics,
  pickSimulatorForStudyNote,
  evaluateLogicGate,
  sampleProjectilePosition,
  solveOhmsLawCircuit,
} from './labPhysics';

test('solveOhmsLawCircuit computes series and parallel totals accurately', () => {
  const series = solveOhmsLawCircuit(12, 4, 2, 'series');
  assert.equal(series.totalResistance, 6);
  assert.equal(series.currentAmps, 2);
  assert.equal(series.voltageR1, 8);
  assert.equal(series.voltageR2, 4);
  assert.equal(series.powerWatts, 24);

  const parallel = solveOhmsLawCircuit(12, 6, 6, 'parallel');
  assert.equal(parallel.totalResistance, 3);
  assert.equal(parallel.currentAmps, 4);
  assert.equal(parallel.voltageR1, 12);
});

test('computeProjectileMetrics and sampleProjectilePosition match kinematic equations', () => {
  const metrics = computeProjectileMetrics(20, 45, 10);
  assert.ok(Math.abs(metrics.horizontalRange - 40) < 0.01);
  assert.ok(Math.abs(metrics.maxHeight - 10) < 0.01);

  const apex = sampleProjectilePosition(20, 45, metrics.timeOfFlight / 2, 10);
  assert.ok(Math.abs(apex.y - metrics.maxHeight) < 0.01);
});

test('computeTitrationPH transitions through equivalence point at 25.0 cm3', () => {
  const initial = computeTitrationPH(0);
  assert.ok(initial.ph < 2);
  assert.equal(initial.indicatorColor, 'colorless');

  const equiv = computeTitrationPH(25.0);
  assert.equal(equiv.ph, 7);
  assert.equal(equiv.indicatorColor, 'pale-pink');

  const excess = computeTitrationPH(35.0);
  assert.ok(excess.ph > 11);
  assert.equal(excess.indicatorColor, 'deep-magenta');
});

test('evaluateLogicGate and buildTruthTable return standard Boolean outputs', () => {
  assert.equal(evaluateLogicGate('AND', true, true), true);
  assert.equal(evaluateLogicGate('AND', true, false), false);
  assert.equal(evaluateLogicGate('XOR', true, true), false);
  assert.equal(evaluateLogicGate('NAND', true, true), false);

  const xorTable = buildTruthTable('XOR');
  assert.deepEqual(
    xorTable.map((r) => r.out),
    [0, 1, 1, 0]
  );
});

test('computePendulumMetrics matches T = 2*pi*sqrt(L/g)', () => {
  const res = computePendulumMetrics(1.0, 9.81, 15);
  assert.ok(Math.abs(res.periodSeconds - 2.006) < 0.01);
  assert.ok(res.angularFrequency > 3.1 && res.angularFrequency < 3.2);
});

test('computeThinLensImage handles real, focal-point, and virtual lens cases', () => {
  const sameSize = computeThinLensImage(30, 15);
  assert.equal(sameSize.imageDistCm, 30);
  assert.equal(sameSize.magnification, 1);
  assert.equal(sameSize.isReal, true);

  const virtualImg = computeThinLensImage(10, 15);
  assert.equal(virtualImg.isReal, false);
  assert.equal(virtualImg.isInverted, false);
  assert.ok(virtualImg.imageDistCm < 0);

  const atFocus = computeThinLensImage(15, 15);
  assert.equal(atFocus.nature, 'At Focal Point (Image at Infinity)');
});

test('computeMicrometerReading decomposes sleeve and thimble divisions with zero error', () => {
  const res = computeMicrometerReading(6.28, 0.04);
  assert.equal(res.rawReadingMm, 6.32);
  assert.equal(res.sleeveReadingMm, 6.0);
  assert.equal(res.thimbleDivisions, 32);
  assert.equal(res.correctedDiameterMm, 6.28);
});

test('computeIdealGasState follows PV = nRT', () => {
  const gas1 = computeIdealGasState(10, 300, 1.0);
  const gas2 = computeIdealGasState(5, 300, 1.0);
  assert.ok(Math.abs(gas2.pressureKpa - gas1.pressureKpa * 2) < 0.2);
  assert.ok(Math.abs(gas1.pvProduct - gas2.pvProduct) < 1.0);
});

test('computeStandingWaveHarmonic computes harmonic frequency and node count', () => {
  const h1 = computeStandingWaveHarmonic(1.0, 100, 1, 0.0025);
  const h3 = computeStandingWaveHarmonic(1.0, 100, 3, 0.0025);
  assert.equal(h1.waveSpeedMs, 200);
  assert.equal(h1.wavelengthM, 2);
  assert.equal(h1.frequencyHz, 100);
  assert.equal(h1.nodesCount, 2);
  assert.equal(h3.frequencyHz, 300);
  assert.equal(h3.nodesCount, 4);
});

test('computeEnzymeReactionRate peaks near 37C/pH 7 and denatures >= 52C', () => {
  const optimal = computeEnzymeReactionRate(37, 7);
  assert.ok(optimal.relativeRatePct >= 95);
  assert.equal(optimal.isDenatured, false);

  const denatured = computeEnzymeReactionRate(65, 7);
  assert.equal(denatured.isDenatured, true);
  assert.ok(denatured.relativeRatePct < 10);
});

test('computeCathodeRayDeflection demonstrates E/B velocity balancing independent of gas', () => {
  const h2 = computeCathodeRayDeflection(250, 0, 2500, 'H2');
  const ne = computeCathodeRayDeflection(250, 0, 2500, 'Ne');
  assert.equal(h2.netDeflectionMm, ne.netDeflectionMm);
  assert.ok(h2.electricDeflectionMm > 0);

  const balanced = computeCathodeRayDeflection(250, h2.balanceMagneticFieldMt, 2500, 'Ne');
  assert.equal(balanced.isVelocityBalanced, true);
  assert.ok(Math.abs(balanced.netDeflectionMm) < 0.5);
});

test('computeRutherfordScattering contrasts nuclear backscattering against Thomson Plum Pudding', () => {
  const thomson = computeRutherfordScattering(5.0, 'Au', 'thomson');
  assert.equal(thomson.backscatterPct, 0);

  const gold = computeRutherfordScattering(5.0, 'Au', 'rutherford');
  const alum = computeRutherfordScattering(5.0, 'Al', 'rutherford');
  assert.ok(gold.backscatterPct > alum.backscatterPct);
  assert.ok(gold.closestApproachFm > alum.closestApproachFm);
  assert.ok(Math.abs(gold.straightThroughPct + gold.smallDeflectionPct + gold.backscatterPct - 100) < 0.05);
});

test('computeKinematicsMotion satisfies v = u + at and s = ut + 0.5*a*t^2', () => {
  const res = computeKinematicsMotion(4, 2, 6);
  assert.equal(res.finalVelocityMs, 16);
  assert.equal(res.displacementM, 60);
  assert.equal(res.averageVelocityMs, 10);
});

test('computeCalorimetryEquilibrium conserves thermal energy between hot metal and water', () => {
  const res = computeCalorimetryEquilibrium(0.5, 390, 100, 0.4, 25);
  assert.ok(Math.abs(res.equilibriumTempC - 32.81) < 0.05);
  assert.ok(Math.abs(res.heatLostByMetalJ - res.heatGainedByWaterJ) <= 5);
});

test('computeBearingVector resolves azimuth angles and 180-degree return bearings', () => {
  const ne = computeBearingVector(30, 10);
  assert.equal(ne.eastKm, 5);
  assert.ok(Math.abs(ne.northKm - 8.66) < 0.02);
  assert.equal(ne.returnBearingDeg, 210);
  assert.equal(ne.quadrantLabel, 'North-East (N·E)');

  const sw = computeBearingVector(225, 10);
  assert.equal(sw.returnBearingDeg, 45);
  assert.equal(sw.quadrantLabel, 'South-West (S·W)');
});

test('computeElectrostaticsCoulomb obeys inverse-square law and sign attraction/repulsion', () => {
  const r10 = computeElectrostaticsCoulomb(4, -2, 10);
  const r20 = computeElectrostaticsCoulomb(4, -2, 20);
  assert.equal(r10.interactionType, 'Attraction');
  assert.ok(Math.abs(r10.forceNewtons / r20.forceNewtons - 4) < 0.05);

  const sameSign = computeElectrostaticsCoulomb(3, 3, 10);
  assert.equal(sameSign.interactionType, 'Repulsion');
});

test('computeAcTransformerMetrics computes turns ratio and step-up/step-down modes', () => {
  const stepDown = computeAcTransformerMetrics(240, 400, 100, 20, 100);
  assert.equal(stepDown.secondaryVoltageV, 60);
  assert.equal(stepDown.secondaryCurrentA, 3);
  assert.equal(stepDown.transformerMode, 'Step-Down');

  const stepUp = computeAcTransformerMetrics(120, 200, 800, 120, 100);
  assert.equal(stepUp.secondaryVoltageV, 480);
  assert.equal(stepUp.transformerMode, 'Step-Up');
});

test('computePunnettGenetics calculates 3:1 monohybrid and 1:1 test-cross ratios', () => {
  const hetero = computePunnettGenetics('Aa', 'Aa');
  assert.equal(hetero.dominantPhenotypePct, 75);
  assert.equal(hetero.recessivePhenotypePct, 25);
  assert.equal(hetero.genotypeRatioText, '1 AA : 2 Aa : 1 aa');

  const testCross = computePunnettGenetics('Aa', 'aa');
  assert.equal(testCross.dominantPhenotypePct, 50);
  assert.equal(testCross.recessivePhenotypePct, 50);
});

test('pickSimulatorForStudyNote maps study notes across subjects to relevant simulators', () => {
  assert.equal(pickSimulatorForStudyNote('physics', 'Projectile Motion & Range'), 'projectile-3d');
  assert.equal(pickSimulatorForStudyNote('physics', 'AC Transformer Induction'), 'ac-transformer-3d');
  assert.equal(pickSimulatorForStudyNote('chemistry', 'Thomson Cathode Rays'), 'thomson-crt');
  assert.equal(pickSimulatorForStudyNote('biology', 'Mendelian Genetics & Heredity'), 'genetics-punnett');
  assert.equal(pickSimulatorForStudyNote('coremath', 'Three-Figure Bearings & Vectors'), 'bearings-trig');
  assert.equal(pickSimulatorForStudyNote('ict', 'Boolean Logic Gates'), 'logic-gate');
});

