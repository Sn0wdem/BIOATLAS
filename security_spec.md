# BioAtlas Firestore Security Specification (Phase 0 TDD)

## 1. Data Invariants

1. **Public Catalog Integrity (`/custom_specimens/{specimenId}`)**:
   - Every document must declare `visibility == 'public'`, a valid regex-checked `id` matching `{specimenId}`, and `ownerId == request.auth.uid` on creation.
   - Only verified authenticated users (`request.auth.token.email_verified == true`) can create, update, or delete custom specimens, and only the original `ownerId` can update or delete their own entry.
   - `ownerId`, `id`, and `createdAt` are immutable after creation; `createdAt` and `updatedAt` must strictly equal `request.time`.
   - Every string field has strict `.size()` bounds and arrays (`gallery <= 12`, `curiosities <= 10`) are bounded and element-guarded.
   - `allow list` enforces `resource.data.visibility == 'public'` directly in the rule (no blanket reads).

2. **Private User Bookmarks (`/users/{userId}/favorites/{specimenId}`)**:
   - Strictly isolated to `request.auth.uid == userId` with `request.auth.token.email_verified == true`.
   - `ownerId` must equal `userId` and `specimenId` must match `{specimenId}`.
   - `allow list` explicitly checks `resource.data.ownerId == request.auth.uid`.
   - No PII is stored or exposed to other users.

3. **Private User Collections (`/users/{userId}/collections/{collectionId}`)**:
   - Strictly isolated to `request.auth.uid == userId` with `request.auth.token.email_verified == true`.
   - `specimenIds` is strictly bounded (`<= 50`) and type-guarded.
   - Updates use action-based `affectedKeys().hasOnly(...)` allowlists (`name`, `description`, `specimenIds`, `updatedAt`) and enforce `ownerId` and `createdAt` immutability.

## 2. The "Dirty Dozen" Adversarial Payloads

| # | Target Collection | Attack Vector | Expected Result |
|---|---|---|---|
| 1 | `/custom_specimens/panthera-tigris` | **Unauthenticated Create** (`auth: null`) | `PERMISSION_DENIED` |
| 2 | `/custom_specimens/panthera-tigris` | **Unverified Email Create** (`email_verified: false`) | `PERMISSION_DENIED` |
| 3 | `/custom_specimens/panthera-tigris` | **Identity Spoofing** (`ownerId: 'victim-uid'` while auth is `'attacker-uid'`) | `PERMISSION_DENIED` |
| 4 | `/custom_specimens/panthera-tigris` | **Shadow Ghost Field** (adds `isAdmin: true` to valid payload) | `PERMISSION_DENIED` |
| 5 | `/custom_specimens/../../../etc/passwd` | **ID Poisoning** (invalid characters or >128 char doc ID) | `PERMISSION_DENIED` |
| 6 | `/custom_specimens/panthera-tigris` | **Timestamp Forgery** (`createdAt` set to past client timestamp != `request.time`) | `PERMISSION_DENIED` |
| 7 | `/custom_specimens/panthera-tigris` | **Denial-of-Wallet Oversized Bio** (`bio` string > 4000 chars or `gallery.size() > 12`) | `PERMISSION_DENIED` |
| 8 | `/custom_specimens/panthera-tigris` | **Cross-Owner Update** (User B tries to update User A's specimen) | `PERMISSION_DENIED` |
| 9 | `/custom_specimens/panthera-tigris` | **Immutable Field Tampering** (Owner tries to change `ownerId` or `createdAt` on update) | `PERMISSION_DENIED` |
| 10 | `/users/victim-uid/favorites/onca-pintada` | **Cross-User Private Read/Write** (User B accesses User A's favorites) | `PERMISSION_DENIED` |
| 11 | `/users/user-a/collections/col-1` | **Unbounded Array Poisoning** (`specimenIds` with 51 items or non-string first item `[123]`) | `PERMISSION_DENIED` |
| 12 | `/users/user-a/collections/col-1` | **Value Poisoning on Update** (Updates whitelisted `name` field to a boolean `true`) | `PERMISSION_DENIED` |
