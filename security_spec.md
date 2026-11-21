# Firestore Security Specification (Phase 0 TDD)

## 1. Data Invariants
1. **Identity & PII Isolation**: `/users/{userId}` stores the student's verified email and profile. Only the authenticated, email-verified user whose `request.auth.uid == userId` may `get`, `create`, `update`, or `delete` their own document. Blanket `list` on `/users` is denied.
2. **Owner-Scoped Subcollections**: All personal study data (`/users/{userId}/notes/{noteId}`, `/attempts/{attemptId}`, `/mistakes/{questionId}`, `/flashcards/{cardId}`, `/competitions/{matchId}`, `/simulations/{runId}`) must belong to an existing parent user or match `userId == request.auth.uid` and `data.ownerId == request.auth.uid`.
3. **Immutable Ownership & Creation Timestamps**: `uid` / `ownerId`, document `id` (`questionId`, `cardId`, `matchId`, `runId`), and `createdAt` cannot be modified after creation (`incoming().ownerId == existing().ownerId`, `incoming().createdAt == existing().createdAt`).
4. **Server Temporal Integrity**: All `createdAt` fields on create and `updatedAt` fields on create/update must equal `request.time`.
5. **Strict Key & Size Boundaries**: Every string, array, enum, email format (`^[^@\s]+@[^@\s]+\.[^@\s]+$`), personalization preference (`accentTheme`, `density`, `studioTagline`, `teacherPersona`, `orbCorner`), and integer is strictly bounded (`hasAll` + `hasOnly` on create, `affectedKeys().hasOnly(...)` on update) to block shadow fields, ghost writes, and payload exhaustion. Document IDs enforce `^[a-zA-Z0-9_-]+$` (with colons allowed strictly on flashcard IDs).
6. **Terminal Attempt, Competition & Simulation Integrity**: Completed `/attempts/{attemptId}`, `/competitions/{matchId}`, and `/simulations/{runId}` records are immutable once logged (`score <= maxScore` and `correctCount <= totalQuestions` enforced at write time), and `streakLongest >= streakCurrent` is guaranteed.

## 2. The "Dirty Dozen" Attack Payloads (All Must Yield `PERMISSION_DENIED`)
1. **Unauthenticated Read/Write**: `request.auth == null` reading or writing `/users/u1/notes/n1`.
2. **Unverified Email Spoof**: `request.auth.uid == 'u1'` with `request.auth.token.email_verified == false` creating `/users/u1`.
3. **Cross-Tenant Profile Read**: User `u2` reading `/users/u1` (PII email exposure).
4. **Cross-Tenant List Scraping**: User `u2` running a list query on `/users/u1/notes`, `/competitions`, or collectionGroup.
5. **Identity Spoofing on Create**: User `u2` writing `/users/u2/notes/n1` or `/users/u2/competitions/m1` with `ownerId: "u1"`.
6. **Shadow Field Injection**: User `u1` creating `/users/u1` with an extra ghost key `{ ..., isAdmin: true }`.
7. **Unbounded String / Payload Poisoning**: User `u1` submitting a note with `title` length `> 160` or `studioTagline` length `> 60` or invalid `matchId` (`"../bad id"`).
8. **Array Overflow**: User `u1` submitting a note with `tags` array size `13` (`> 12`) or non-string first element `[123]`.
9. **Client Timestamp Forgery**: User `u1` creating a note or competition match with `createdAt: "2020-01-01T00:00:00Z"` instead of `request.time` (`serverTimestamp()`).
10. **Immutable Field Tampering**: User `u1` updating `/users/u1/notes/n1` and changing `createdAt` or `ownerId`.
11. **Score Manipulation on Attempt / Competition**: User `u1` updating `/users/u1/attempts/a1` or `/users/u1/competitions/m1` to raise `score` or `studentScore`.
12. **Cross-Collection Privilege Escalation**: Unauthenticated or verified user writing `/admins/u1` or `/test/connection`.
