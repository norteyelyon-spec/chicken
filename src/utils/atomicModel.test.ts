import test from 'node:test';
import assert from 'node:assert/strict';
import {
  analyzeAtomicStructure,
  ATOM_CENTER_X,
  ATOM_CENTER_Y,
  computeAtomicModelFrame,
  easeInOutCubic,
  ELEMENTS_1_TO_30,
} from './atomicModel';

test('ELEMENTS_1_TO_30 provides all first 30 elements cleanly', () => {
  assert.equal(ELEMENTS_1_TO_30.length, 30);
  assert.equal(ELEMENTS_1_TO_30[0].symbol, 'H');
  assert.equal(ELEMENTS_1_TO_30[5].symbol, 'C');
  assert.equal(ELEMENTS_1_TO_30[23].symbol, 'Cr');
  assert.equal(ELEMENTS_1_TO_30[28].symbol, 'Cu');
  assert.equal(ELEMENTS_1_TO_30[29].symbol, 'Zn');
});

test('analyzeAtomicStructure handles neutral atoms, isotopes, and cations/anions', () => {
  const c12 = analyzeAtomicStructure(6, 6, 6);
  assert.equal(c12.element.symbol, 'C');
  assert.equal(c12.massNumber, 12);
  assert.equal(c12.netCharge, 0);
  assert.equal(c12.ionKind, 'Neutral Atom');
  assert.deepEqual(c12.shells, [2, 4]);
  assert.equal(c12.subshellConfig, '1s² 2s² 2p²');

  const naPlus = analyzeAtomicStructure(11, 12, 10);
  assert.equal(naPlus.netCharge, 1);
  assert.equal(naPlus.ionKind, 'Cation (+)');
  assert.equal(naPlus.ionFormula, 'Na⁺');
  assert.deepEqual(naPlus.shells, [2, 8]);
  assert.equal(naPlus.subshellConfig, '1s² 2s² 2p⁶');

  const clMinus = analyzeAtomicStructure(17, 18, 18);
  assert.equal(clMinus.netCharge, -1);
  assert.equal(clMinus.ionKind, 'Anion (−)');
  assert.equal(clMinus.ionFormula, 'Cl⁻');
  assert.deepEqual(clMinus.shells, [2, 8, 8]);
});

test('analyzeAtomicStructure applies Chromium (3d5 4s1), Copper (3d10 4s1), and 4s-first ion exceptions', () => {
  const cr = analyzeAtomicStructure(24, 28, 24);
  assert.equal(cr.hasAufbauException, true);
  assert.deepEqual(cr.shells, [2, 8, 13, 1]);
  assert.equal(cr.subshellConfig, '1s² 2s² 2p⁶ 3s² 3p⁶ 3d⁵ 4s¹');

  const cu = analyzeAtomicStructure(29, 35, 29);
  assert.equal(cu.hasAufbauException, true);
  assert.deepEqual(cu.shells, [2, 8, 18, 1]);
  assert.equal(cu.subshellConfig, '1s² 2s² 2p⁶ 3s² 3p⁶ 3d¹⁰ 4s¹');

  const fe2 = analyzeAtomicStructure(26, 30, 24);
  assert.equal(fe2.ionFormula, 'Fe²⁺');
  assert.deepEqual(fe2.shells, [2, 8, 14]);
  assert.equal(fe2.subshellConfig, '1s² 2s² 2p⁶ 3s² 3p⁶ 3d⁶');
});

test('easeInOutCubic and computeAtomicModelFrame interpolate Plum Pudding -> Rutherford -> Bohr smoothly', () => {
  assert.equal(easeInOutCubic(0), 0);
  assert.equal(easeInOutCubic(0.5), 0.5);
  assert.equal(easeInOutCubic(1), 1);

  const carbon = analyzeAtomicStructure(6, 6, 6);

  const startFrame = computeAtomicModelFrame('plum-pudding', 'rutherford', 0, carbon);
  const midFrame = computeAtomicModelFrame('plum-pudding', 'rutherford', 0.5, carbon);
  const endFrame = computeAtomicModelFrame('plum-pudding', 'rutherford', 1, carbon);

  // Diffuse positive sphere collapses inward into dense nucleus
  assert.equal(startFrame.puddingOpacity, 1);
  assert.equal(startFrame.puddingRadius, 108);
  assert.ok(midFrame.puddingRadius > 18 && midFrame.puddingRadius < 108);
  assert.ok(midFrame.puddingOpacity > 0 && midFrame.puddingOpacity < 1);
  assert.equal(endFrame.puddingOpacity, 0);
  assert.equal(endFrame.rutherfordOrbitOpacity, 1);

  // Nucleons converge inward from dispersed pudding positions to tight nucleus cluster
  const maxStartNucleonDist = Math.max(
    ...startFrame.nucleons.map((n) => Math.hypot(n.x - ATOM_CENTER_X, n.y - ATOM_CENTER_Y))
  );
  const maxEndNucleonDist = Math.max(
    ...endFrame.nucleons.map((n) => Math.hypot(n.x - ATOM_CENTER_X, n.y - ATOM_CENTER_Y))
  );
  assert.ok(maxStartNucleonDist > 45);
  assert.ok(maxEndNucleonDist <= 20);

  // Rutherford -> Bohr transition quantizes into shells
  const bohrMid = computeAtomicModelFrame('rutherford', 'bohr', 0.5, carbon);
  const bohrEnd = computeAtomicModelFrame('rutherford', 'bohr', 1, carbon);
  assert.ok(bohrMid.rutherfordOrbitOpacity > 0 && bohrMid.bohrShellOpacity > 0);
  assert.equal(bohrEnd.rutherfordOrbitOpacity, 0);
  assert.equal(bohrEnd.bohrShellOpacity, 1);
  assert.equal(bohrEnd.electrons.length, 6);
});
