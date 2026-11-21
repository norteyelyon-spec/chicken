import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

const rootDir = process.cwd();
const blueprint = JSON.parse(
  fs.readFileSync(path.join(rootDir, 'firebase-blueprint.json'), 'utf8')
) as {
  entities: Record<string, { required: string[]; properties: Record<string, unknown> }>;
  firestore: Record<string, { schema: { $ref: string } }>;
};

const rulesPath = fs.existsSync(path.join(rootDir, 'firestore.rules'))
  ? path.join(rootDir, 'firestore.rules')
  : path.join(rootDir, 'DRAFT_firestore.rules');
const rulesText = fs.readFileSync(rulesPath, 'utf8');

test('Firestore rules enforce Eight Pillars default-deny catch-all and identity gates', () => {
  assert.match(rulesText, /rules_version\s*=\s*'2'/);
  assert.match(rulesText, /match\s*\/\{document=\*\*\}\s*\{\s*allow read, write:\s*if false;\s*\}/);
  assert.match(rulesText, /request\.auth\.token\.email_verified\s*==\s*true/);
  assert.match(rulesText, /request\.auth\.uid\s*==\s*userId/);
  assert.match(rulesText, /allow list:\s*if false;/);
  assert.doesNotMatch(rulesText, /allow\s+(read|write)\s*:\s*if\s+true\b/);
});

test('Firestore rules cover every collection and required field defined in firebase-blueprint.json', () => {
  const expectedMatches = [
    'match /users/{userId}',
    'match /notes/{noteId}',
    'match /attempts/{attemptId}',
    'match /mistakes/{questionId}',
    'match /flashcards/{cardId}',
    'match /competitions/{matchId}',
    'match /simulations/{runId}',
  ];
  for (const m of expectedMatches) {
    assert.ok(rulesText.includes(m), `Missing rules block: ${m}`);
  }

  for (const [entityName, entitySpec] of Object.entries(blueprint.entities)) {
    for (const reqField of entitySpec.required) {
      assert.ok(
        rulesText.includes(`'${reqField}'`),
        `Rules missing required field '${reqField}' from entity ${entityName}`
      );
    }
  }
});

test('Dirty Dozen security invariants are enforced in rules', () => {
  // 1 & 2: Unauthenticated / Unverified blocked via isOwner -> isVerifiedUser -> isSignedIn
  assert.ok(rulesText.includes('function isVerifiedUser()'));
  assert.ok(rulesText.includes('isSignedIn() && request.auth.token.email_verified == true'));

  // 3 & 4: Cross-tenant read & list blocked
  assert.ok(rulesText.includes('existing().ownerId == request.auth.uid'));
  assert.ok(rulesText.includes('resource.data.ownerId == request.auth.uid'));

  // 5: Identity spoofing on create blocked
  assert.ok(rulesText.includes('data.ownerId == request.auth.uid'));
  assert.ok(rulesText.includes('data.uid == request.auth.uid'));

  // 6: Shadow fields blocked with hasAll & hasOnly
  assert.ok(rulesText.includes('data.keys().hasAll('));
  assert.ok(rulesText.includes('data.keys().hasOnly('));

  // 7 & 8: String sizes, strict ID regex vs flashcard colon IDs, email format, and domain invariants
  assert.ok(rulesText.includes("id.matches('^[a-zA-Z0-9_-]+$')"));
  assert.ok(rulesText.includes("id.matches('^[a-zA-Z0-9_:-]+$')"));
  assert.ok(rulesText.includes("data.email.matches('^[^@\\\\s]+@[^@\\\\s]+\\\\.[^@\\\\s]+$')"));
  assert.ok(rulesText.includes('data.streakLongest >= data.streakCurrent'));
  assert.ok(rulesText.includes('data.score <= data.maxScore'));
  assert.ok(rulesText.includes('data.correctCount <= data.totalQuestions'));
  assert.ok(rulesText.includes('data.content is string && data.content.size() <= 45000'));
  assert.ok(rulesText.includes('data.tags is list && data.tags.size() <= 12'));

  // 9 & 10: Server timestamp & immutable createdAt/ownerId
  assert.ok(rulesText.includes('incoming().createdAt == request.time'));
  assert.ok(rulesText.includes('incoming().updatedAt == request.time'));
  assert.ok(rulesText.includes('incoming().createdAt == existing().createdAt'));
  assert.ok(rulesText.includes('incoming().ownerId == existing().ownerId'));

  // 11: Terminal Attempt, Competition & Simulation immutability
  assert.match(rulesText, /match \/attempts\/\{attemptId\}[\s\S]*?allow update:\s*if false;/);
  assert.match(rulesText, /match \/competitions\/\{matchId\}[\s\S]*?allow update:\s*if false;/);
  assert.match(rulesText, /match \/simulations\/\{runId\}[\s\S]*?allow update:\s*if false;/);

  // 12: Subcollection Master Gate existsAfter parent check + default-deny catch-all
  assert.ok(rulesText.includes('existsAfter(/databases/$(database)/documents/users/$(userId))'));

  // 13: Non-existent subcollection reads/deletes handle resource == null safely for owners
  const nullSafeGetMatches = rulesText.match(
    /allow get: if isValidId\(userId\) && isValid(?:Flashcard)?Id\([^)]+\) && isOwner\(userId\) && \(resource == null \|\| existing\(\)\.ownerId == request\.auth\.uid\);/g
  );
  assert.equal(nullSafeGetMatches?.length, 6);
});

test('Seed notes satisfy Firestore rules UTF-8 byte limits, tag bounds, and ID regex', async () => {
  const { INITIAL_NOTES } = await import('./src/data/defaultNotes');
  const encoder = new TextEncoder();
  for (const note of INITIAL_NOTES) {
    assert.match(note.id, /^[a-zA-Z0-9_:-]+$/);
    assert.ok(note.id.length >= 1 && note.id.length <= 128);
    assert.ok(encoder.encode(note.title).length >= 1 && encoder.encode(note.title).length <= 160);
    assert.ok(encoder.encode(note.content).length <= 45000);
    assert.ok(note.tags.length <= 12);
    for (const tag of note.tags) {
      assert.ok(encoder.encode(tag).length <= 40);
    }
  }
});

test('UserAccount rules safely validate optional daily study reminder and personalization preferences', () => {
  for (const field of [
    'reminderEnabled',
    'reminderTime',
    'browserNotificationsEnabled',
    'lastReminderDate',
    'accentTheme',
    'density',
    'studioTagline',
    'teacherPersona',
    'orbCorner',
  ]) {
    assert.ok(rulesText.includes(`'${field}'`), `Missing field ${field} in firestore.rules`);
  }
  assert.ok(rulesText.includes("'^([01][0-9]|2[0-3]):[0-5][0-9]$'"));
});


