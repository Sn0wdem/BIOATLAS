/**
 * BioAtlas Firestore Security Rules Verification Spec (Dirty Dozen)
 *
 * Documents and verifies all 12 adversarial payloads against the Eight Pillars
 * hardened rules in firestore.rules.
 */

export interface SecurityTestCase {
  id: number;
  name: string;
  path: string;
  operation: 'get' | 'list' | 'create' | 'update' | 'delete';
  auth: { uid: string; email_verified: boolean } | null;
  payload?: Record<string, unknown>;
  expected: 'PERMISSION_DENIED' | 'ALLOW';
}

export const DIRTY_DOZEN_TESTS: SecurityTestCase[] = [
  {
    id: 1,
    name: 'Unauthenticated create on custom_specimens',
    path: '/custom_specimens/panthera-tigris',
    operation: 'create',
    auth: null,
    payload: { id: 'panthera-tigris', name: 'Tigre', visibility: 'public' },
    expected: 'PERMISSION_DENIED',
  },
  {
    id: 2,
    name: 'Unverified email create on custom_specimens',
    path: '/custom_specimens/panthera-tigris',
    operation: 'create',
    auth: { uid: 'user-unverified', email_verified: false },
    payload: {
      id: 'panthera-tigris',
      name: 'Tigre',
      ownerId: 'user-unverified',
      visibility: 'public',
    },
    expected: 'PERMISSION_DENIED',
  },
  {
    id: 3,
    name: 'Identity spoofing via forged ownerId',
    path: '/custom_specimens/panthera-tigris',
    operation: 'create',
    auth: { uid: 'attacker-uid', email_verified: true },
    payload: {
      id: 'panthera-tigris',
      name: 'Tigre',
      ownerId: 'victim-uid',
      visibility: 'public',
    },
    expected: 'PERMISSION_DENIED',
  },
  {
    id: 4,
    name: 'Shadow ghost field injection (isAdmin)',
    path: '/custom_specimens/panthera-tigris',
    operation: 'create',
    auth: { uid: 'user-a', email_verified: true },
    payload: {
      id: 'panthera-tigris',
      name: 'Tigre',
      ownerId: 'user-a',
      visibility: 'public',
      isAdmin: true,
    },
    expected: 'PERMISSION_DENIED',
  },
  {
    id: 5,
    name: 'ID poisoning with invalid characters',
    path: '/custom_specimens/invalid..id!@#',
    operation: 'create',
    auth: { uid: 'user-a', email_verified: true },
    payload: { id: 'invalid..id!@#', name: 'Tigre', ownerId: 'user-a' },
    expected: 'PERMISSION_DENIED',
  },
  {
    id: 6,
    name: 'Client-forged timestamp (createdAt != request.time)',
    path: '/custom_specimens/panthera-tigris',
    operation: 'create',
    auth: { uid: 'user-a', email_verified: true },
    payload: {
      id: 'panthera-tigris',
      name: 'Tigre',
      ownerId: 'user-a',
      createdAt: '2020-01-01T00:00:00Z',
    },
    expected: 'PERMISSION_DENIED',
  },
  {
    id: 7,
    name: 'Denial-of-wallet oversized bio string (> 4000 chars)',
    path: '/custom_specimens/panthera-tigris',
    operation: 'create',
    auth: { uid: 'user-a', email_verified: true },
    payload: {
      id: 'panthera-tigris',
      name: 'Tigre',
      ownerId: 'user-a',
      bio: 'x'.repeat(5000),
    },
    expected: 'PERMISSION_DENIED',
  },
  {
    id: 8,
    name: 'Cross-owner update on custom_specimens',
    path: '/custom_specimens/panthera-tigris',
    operation: 'update',
    auth: { uid: 'user-b', email_verified: true },
    payload: { name: 'Hacked Tigre' },
    expected: 'PERMISSION_DENIED',
  },
  {
    id: 9,
    name: 'Immutable ownerId tampering on update',
    path: '/custom_specimens/panthera-tigris',
    operation: 'update',
    auth: { uid: 'user-a', email_verified: true },
    payload: { ownerId: 'user-b' },
    expected: 'PERMISSION_DENIED',
  },
  {
    id: 10,
    name: 'Cross-user private favorites access',
    path: '/users/user-a/favorites/onca-pintada',
    operation: 'get',
    auth: { uid: 'user-b', email_verified: true },
    expected: 'PERMISSION_DENIED',
  },
  {
    id: 11,
    name: 'Unbounded or invalid type specimenIds array on collection',
    path: '/users/user-a/collections/col-1',
    operation: 'create',
    auth: { uid: 'user-a', email_verified: true },
    payload: {
      name: 'Coleção Inválida',
      specimenIds: [12345],
      ownerId: 'user-a',
    },
    expected: 'PERMISSION_DENIED',
  },
  {
    id: 12,
    name: 'Value poisoning on whitelisted collection update key',
    path: '/users/user-a/collections/col-1',
    operation: 'update',
    auth: { uid: 'user-a', email_verified: true },
    payload: { name: true },
    expected: 'PERMISSION_DENIED',
  },
];
