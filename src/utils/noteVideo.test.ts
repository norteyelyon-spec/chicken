import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { INITIAL_NOTES } from '../data/defaultNotes.ts';
import { loadAllSyllabusNotes } from '../data/curriculumLoader.ts';
import {
  buildInteractiveVideoScenes,
  explainFormulaInDepth,
  matchDimensionalQuantity,
} from './noteVideo.ts';

describe('noteVideo interactive scene builder & dimensional sandbox', () => {
  it('parses the refined Physics Dimensions & Dimensional Analysis note into multi-scene lessons with checkpoints', () => {
    const dimNote = INITIAL_NOTES.find((n) => n.id === 'note-phys-dimensions');
    assert.ok(dimNote, 'Expected note-phys-dimensions in INITIAL_NOTES');

    const scenes = buildInteractiveVideoScenes(dimNote);
    assert.ok(scenes.length >= 6, `Expected >= 6 video scenes, got ${scenes.length}`);
    assert.ok(
      scenes.some((s) => s.checkpoint !== undefined),
      'Expected interactive checkpoints inside the Dimensions video lesson'
    );
    assert.ok(
      scenes.some((s) => s.equations.length > 0),
      'Expected mathematical equations extracted for chalkboard animation'
    );
    const sceneWithEq = scenes.find((s) => s.equations.length > 0);
    assert.ok(
      sceneWithEq?.formulaBreakdowns && sceneWithEq.formulaBreakdowns.length > 0,
      'Expected formulaBreakdowns with symbol meanings on equation scenes'
    );
  });

  it('matches dimensional exponents [M^a L^b T^c] accurately', () => {
    const force = matchDimensionalQuantity(1, 1, -2);
    assert.equal(force?.id, 'force');

    const power = matchDimensionalQuantity(1, 2, -3);
    assert.equal(power?.id, 'power');

    const gravityG = matchDimensionalQuantity(-1, 3, -2);
    assert.equal(gravityG?.id, 'gravity-g');

    assert.equal(matchDimensionalQuantity(3, 3, 3), null);
  });

  it('always explains formulas symbol-by-symbol in explainFormulaInDepth', () => {
    const fb = explainFormulaInDepth('A = P(1 + r/100)^n', 'Compound Interest', 'coremath');
    assert.ok(fb.meaning.length >= 25);
    assert.ok(fb.variables.length >= 3);
    assert.ok(fb.spokenExplanation.toLowerCase().includes('principal'));

    const generic = explainFormulaInDepth('v = u + a*t', 'SUVAT Kinematics', 'physics');
    assert.ok(generic.variables.length >= 3);
    assert.ok(generic.spokenExplanation.length >= 60);
  });

  it('builds comprehensive multi-scene video lessons with formula explanations for SHS 1 Core Math Strands 1-4', async () => {
    const allNotes = await loadAllSyllabusNotes();
    const strandIds = [
      'note-mg-coremath-s1-strand1-numbers',
      'note-mg-coremath-s1-strand2-algebra',
      'note-mg-coremath-s1-strand3-geometry',
      'note-mg-coremath-s1-strand4-data',
    ];
    for (const id of strandIds) {
      const note = allNotes.find((n) => n.id === id);
      assert.ok(note, `Missing SHS 1 Core Math strand note: ${id}`);
      const scenes = buildInteractiveVideoScenes(note);
      assert.ok(scenes.length >= 3, `Expected >= 3 scenes for ${id}, got ${scenes.length}`);
      assert.ok(
        scenes.some((s) => (s.formulaBreakdowns?.length ?? 0) > 0),
        `Expected formulaBreakdowns in ${id}`
      );
      assert.ok(
        scenes.some((s) => s.checkpoint !== undefined),
        `Expected domain checkpoint in ${id}`
      );
      for (const sc of scenes) {
        const segs = sc.narrationSegments ?? [];
        assert.ok(segs.length >= 2);
        assert.equal(segs[0].startFrac, 0);
        assert.equal(segs[segs.length - 1].endFrac, 1);
      }
    }
  });

  it('assigns valid Three.js visual3DKind and intuitive Big Idea analogies to scenes', () => {
    const validKinds = new Set([
      'atom-orbitals',
      'mechanics-projectile',
      'waves-optics',
      'circuits-em',
      'geometry-solids',
      'calculus-surface',
      'chemistry-molecules',
      'biology-cell-organ',
      'ict-network-logic',
      'grammar-pillars',
      'governance-scale',
    ]);

    for (const note of INITIAL_NOTES) {
      const scenes = buildInteractiveVideoScenes(note);
      assert.ok(scenes.length >= 2, `Expected >=2 scenes for ${note.id}`);
      for (const s of scenes) {
        assert.ok(
          validKinds.has(s.visual3DKind),
          `Invalid visual3DKind "${s.visual3DKind}" in ${note.id}`
        );
        assert.ok(
          s.intuitionHook.trim().length >= 20,
          `Missing intuitionHook in ${note.id} scene ${s.id}`
        );
      }
    }
  });
});


