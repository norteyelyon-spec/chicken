import test from 'node:test';
import assert from 'node:assert/strict';
import {
  computeOrbCornerFromPoint,
  DEFAULT_PERSONALIZATION,
  getGradeDisplayLabel,
  sanitizePersonalization,
} from './personalization';

test('sanitizePersonalization validates allowed values and trims/caps studioTagline', () => {
  assert.deepEqual(sanitizePersonalization(null), DEFAULT_PERSONALIZATION);

  const custom = sanitizePersonalization({
    accentTheme: 'emerald',
    density: 'compact',
    studioTagline: '  Achimoto Honors Chemistry Lab  ',
    teacherPersona: 'abena',
    orbCorner: 'top-left',
  });
  assert.deepEqual(custom, {
    accentTheme: 'emerald',
    density: 'compact',
    studioTagline: 'Achimoto Honors Chemistry Lab',
    teacherPersona: 'abena',
    orbCorner: 'top-left',
  });

  const fallback = sanitizePersonalization({
    accentTheme: 'invalid-color',
    density: 'huge',
    studioTagline: '   ',
    teacherPersona: 'unknown',
    orbCorner: 'center',
  });
  assert.deepEqual(fallback, DEFAULT_PERSONALIZATION);
});

test('getGradeDisplayLabel maps SHS1-SHS3 and ALL to Grade 10-12 labels', () => {
  assert.equal(getGradeDisplayLabel('SHS1'), 'Grade 10 (SHS 1)');
  assert.equal(getGradeDisplayLabel('SHS2'), 'Grade 11 (SHS 2)');
  assert.equal(getGradeDisplayLabel('SHS3'), 'Grade 12 (SHS 3)');
  assert.equal(getGradeDisplayLabel('ALL'), 'All Grades (10–12)');
});

test('computeOrbCornerFromPoint snaps pointer coordinates to all 4 screen quadrants', () => {
  assert.equal(computeOrbCornerFromPoint(120, 100, 1440, 900), 'top-left');
  assert.equal(computeOrbCornerFromPoint(1300, 100, 1440, 900), 'top-right');
  assert.equal(computeOrbCornerFromPoint(120, 800, 1440, 900), 'bottom-left');
  assert.equal(computeOrbCornerFromPoint(1300, 800, 1440, 900), 'bottom-right');
});
