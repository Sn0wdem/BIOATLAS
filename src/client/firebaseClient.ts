import { initializeApp } from 'firebase/app';
import {
  getAuth,
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithPopup,
  signOut,
  type User,
} from 'firebase/auth';
import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocFromServer,
  getDocs,
  getFirestore,
  onSnapshot,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
  where,
  type Unsubscribe,
} from 'firebase/firestore';
import firebaseConfig from '../../firebase-applet-config.json' with { type: 'json' };
import type { Specimen } from '../types.ts';

// ============================================================================
// INITIALIZATION & CONNECTION VALIDATION
// ============================================================================

export const WORKSPACE_SCOPES = [
  'https://www.googleapis.com/auth/gmail.send',
] as const;

const configWithDb = firebaseConfig as typeof firebaseConfig & {
  firestoreDatabaseId?: string;
};
const app = initializeApp(firebaseConfig);
const db = configWithDb.firestoreDatabaseId
  ? getFirestore(app, configWithDb.firestoreDatabaseId)
  : getFirestore(app);
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();
WORKSPACE_SCOPES.forEach((scope) => googleProvider.addScope(scope));

// Access token cached strictly in memory (never in localStorage/sessionStorage)
let isSigningIn = false;
let cachedGmailAccessToken: string | null = null;

function buildGoogleProvider(forceConsent = false): GoogleAuthProvider {
  const provider = new GoogleAuthProvider();
  WORKSPACE_SCOPES.forEach((scope) => provider.addScope(scope));
  if (forceConsent) {
    provider.setCustomParameters({ prompt: 'consent' });
  }
  return provider;
}

async function testConnection() {
  try {
    await getDocFromServer(doc(db, 'test', 'connection'));
  } catch (error) {
    if (
      error instanceof Error &&
      error.message.includes('the client is offline')
    ) {
      console.error('Please check your Firebase configuration.');
    }
  }
}
void testConnection();

// ============================================================================
// STRUCTURED FIRESTORE ERROR HANDLING
// ============================================================================

enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  };
}

function handleFirestoreError(
  error: unknown,
  operationType: OperationType,
  path: string | null
): never {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo:
        auth.currentUser?.providerData?.map((provider) => ({
          providerId: provider.providerId,
          email: provider.email,
        })) || [],
    },
    operationType,
    path,
  };
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

// ============================================================================
// DEFENSIVE PAYLOAD SANITIZATION (SYNCED WITH firebase-blueprint.json)
// ============================================================================

const ALLOWED_ERAS = new Set([
  'contemporaneo',
  'cenozoico',
  'mesozoico',
  'paleozoico',
  'precambriano',
  'microbiologico',
]);

const ALLOWED_SKELETAL = new Set([
  'vertebrado',
  'invertebrado',
  'microbiologico',
]);

function sanitizeId(raw: string): string {
  const cleaned = String(raw || '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9_-]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 128);
  return cleaned || `item-${Date.now()}`;
}

function clampStr(val: unknown, maxLen: number, fallback = ''): string {
  const s = typeof val === 'string' ? val.trim() : fallback;
  return s.slice(0, maxLen);
}

function sanitizeSpecimenPayload(spec: Specimen, ownerId: string) {
  const docId = sanitizeId(spec.id || spec.name);
  const era = ALLOWED_ERAS.has(spec.era) ? spec.era : 'contemporaneo';
  const skeletalType = ALLOWED_SKELETAL.has(spec.skeletal_type)
    ? spec.skeletal_type
    : 'vertebrado';

  const gallery = (Array.isArray(spec.gallery) ? spec.gallery : [])
    .slice(0, 12)
    .filter((g) => g && typeof g.url === 'string' && g.url.length > 0)
    .map((g) => ({
      url: clampStr(g.url, 2000),
      caption: clampStr(g.caption, 300, 'Representação do espécime'),
      type: clampStr(g.type, 60, 'living_specimen'),
      category: clampStr(g.category, 60, 'life_view'),
      author: clampStr(g.author, 120, 'Wikimedia Commons'),
    }));

  const curiosities = (Array.isArray(spec.curiosities) ? spec.curiosities : [])
    .slice(0, 10)
    .map((c) => clampStr(c, 300))
    .filter(Boolean);

  const cladogram = (
    Array.isArray(spec.expert?.cladogram) ? spec.expert.cladogram : []
  )
    .slice(0, 15)
    .map((n) => clampStr(n, 120))
    .filter(Boolean);

  return {
    docId,
    payload: {
      id: docId,
      name: clampStr(spec.name, 160, 'Espécime'),
      genus: clampStr(spec.genus, 120, spec.name || 'Taxon'),
      scientific_name: clampStr(spec.scientific_name, 200, ''),
      era,
      era_display: clampStr(spec.era_display, 120, 'Contemporâneo'),
      period: clampStr(spec.period, 120, 'Holoceno'),
      epoch: clampStr(spec.epoch, 120, ''),
      geological_range: clampStr(spec.geological_range, 200, 'Presente'),
      group: clampStr(spec.group, 80, 'mamifero-megafauna'),
      group_display: clampStr(spec.group_display, 160, 'Organismo'),
      diet: clampStr(spec.diet, 60, 'carnivoro'),
      diet_display: clampStr(spec.diet_display, 160, 'Carnívoro'),
      habitat: clampStr(spec.habitat, 80, 'terrestre'),
      skeletal_type: skeletalType,
      skeletal_composition: clampStr(
        spec.skeletal_composition,
        240,
        'Endoesqueleto Ósseo'
      ),
      is_contemporary: Boolean(spec.is_contemporary),
      conservation_status: clampStr(
        spec.conservation_status,
        160,
        'Catalogado'
      ),
      length: clampStr(spec.length, 120, 'Em estudo'),
      height: clampStr(spec.height, 120, 'Em estudo'),
      weight: clampStr(spec.weight, 120, 'Em estudo'),
      speed: clampStr(spec.speed, 120, 'Em estudo'),
      bite_force: clampStr(spec.bite_force, 160, 'Em estudo'),
      image_url: clampStr(spec.image_url, 2000, 'https://upload.wikimedia.org'),
      image_caption: clampStr(spec.image_caption, 300, spec.name || ''),
      gallery,
      etymology: clampStr(spec.etymology, 600, ''),
      bio: clampStr(spec.bio, 4000, ''),
      curiosities,
      expert: {
        cladogram,
        osteology: clampStr(spec.expert?.osteology, 1500, ''),
        biomechanics: clampStr(spec.expert?.biomechanics, 1500, ''),
        histology: clampStr(spec.expert?.histology, 1500, ''),
      },
      occurrences_count: Math.max(
        0,
        Math.min(10000000, Number(spec.occurrences_count) || 0)
      ),
      fossil_locations: clampStr(spec.fossil_locations, 500, ''),
      is_custom_ingested: true,
      visibility: 'public',
      ownerId,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    },
  };
}

// ============================================================================
// PUBLIC BROWSER BRIDGE (window.BioAtlasFirebase)
// ============================================================================

export interface BioAtlasUserInfo {
  uid: string;
  displayName: string;
  email: string;
  photoURL: string;
  emailVerified: boolean;
}

export interface UserFavoriteRecord {
  specimenId: string;
  specimenName: string;
  era: string;
  imageUrl: string;
  ownerId: string;
}

export interface UserCollectionRecord {
  id: string;
  name: string;
  description: string;
  specimenIds: string[];
  ownerId: string;
}

export interface UserFieldNoteRecord {
  specimenId: string;
  specimenName: string;
  content: string;
  ownerId: string;
}

export type QuizDifficultyKey = 'facil' | 'medio' | 'dificil' | 'especialista';

export interface QuizDifficultyLevelMap {
  facil: number;
  medio: number;
  dificil: number;
  especialista: number;
}

export interface UserQuizStatsRecord {
  totalRounds: number;
  totalCorrect: number;
  totalQuestions: number;
  bestScore: number;
  badges: string[];
  selectedDifficulty?: QuizDifficultyKey;
  unlockedLevels?: QuizDifficultyLevelMap;
  completedLevels?: QuizDifficultyLevelMap;
  levelStars?: string;
  ownerId: string;
}

function mapUser(u: User | null): BioAtlasUserInfo | null {
  if (!u) return null;
  return {
    uid: u.uid,
    displayName: u.displayName || u.email || 'Explorador',
    email: u.email || '',
    photoURL: u.photoURL || '',
    emailVerified: u.emailVerified,
  };
}

export interface QuizStageEmailParams {
  to: string;
  subject: string;
  textBody: string;
  htmlBody: string;
}

function utf8ToBase64(str: string): string {
  const bytes = new TextEncoder().encode(str);
  let binary = '';
  const chunkSize = 0x8000;
  for (let i = 0; i < bytes.length; i += chunkSize) {
    binary += String.fromCharCode(...bytes.subarray(i, i + chunkSize));
  }
  return btoa(binary);
}

function utf8ToBase64Url(str: string): string {
  return utf8ToBase64(str)
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/g, '');
}

function encodeMimeHeaderUtf8(value: string): string {
  const clean = String(value || '').replace(/[\r\n]+/g, ' ').trim();
  return `=?UTF-8?B?${utf8ToBase64(clean)}?=`;
}

const BioAtlasFirebase = {
  getCurrentUser(): BioAtlasUserInfo | null {
    return mapUser(auth.currentUser);
  },

  hasGmailAccessToken(): boolean {
    return Boolean(cachedGmailAccessToken && auth.currentUser);
  },

  subscribeAuth(cb: (user: BioAtlasUserInfo | null) => void): Unsubscribe {
    return onAuthStateChanged(auth, (u) => {
      if (!u && !isSigningIn) {
        cachedGmailAccessToken = null;
      }
      cb(mapUser(u));
    });
  },

  async signInWithGoogle(): Promise<BioAtlasUserInfo | null> {
    isSigningIn = true;
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const credential = GoogleAuthProvider.credentialFromResult(result);
      if (credential?.accessToken) {
        cachedGmailAccessToken = credential.accessToken;
      }
      return mapUser(result.user);
    } finally {
      isSigningIn = false;
    }
  },

  async connectGmail(forceConsent = false): Promise<BioAtlasUserInfo | null> {
    isSigningIn = true;
    try {
      const provider = buildGoogleProvider(forceConsent);
      const result = await signInWithPopup(auth, provider);
      const credential = GoogleAuthProvider.credentialFromResult(result);
      if (!credential?.accessToken) {
        throw new Error('GMAIL_TOKEN_UNAVAILABLE');
      }
      cachedGmailAccessToken = credential.accessToken;
      return mapUser(result.user);
    } finally {
      isSigningIn = false;
    }
  },

  async signOutUser(): Promise<void> {
    cachedGmailAccessToken = null;
    await signOut(auth);
  },

  async sendQuizStageEmail(
    params: QuizStageEmailParams
  ): Promise<{ id: string; threadId?: string }> {
    const user = auth.currentUser;
    if (!user || !cachedGmailAccessToken) {
      const err = new Error('Conecte sua conta Gmail para enviar o e-mail.');
      (err as Error & { code?: string }).code = 'GMAIL_AUTH_REQUIRED';
      throw err;
    }

    const toAddress = String(params.to || user.email || '')
      .replace(/[\r\n<>]+/g, '')
      .trim();
    if (!toAddress || !toAddress.includes('@')) {
      throw new Error('Endereço de e-mail do destinatário inválido.');
    }

    const boundary = `bioatlas_quiz_${Date.now().toString(36)}_${Math.random()
      .toString(36)
      .slice(2, 8)}`;

    const mimeLines = [
      `To: ${toAddress}`,
      `Subject: ${encodeMimeHeaderUtf8(params.subject)}`,
      'MIME-Version: 1.0',
      `Content-Type: multipart/alternative; boundary="${boundary}"`,
      '',
      `--${boundary}`,
      'Content-Type: text/plain; charset="UTF-8"',
      'Content-Transfer-Encoding: base64',
      '',
      utf8ToBase64(params.textBody),
      '',
      `--${boundary}`,
      'Content-Type: text/html; charset="UTF-8"',
      'Content-Transfer-Encoding: base64',
      '',
      utf8ToBase64(params.htmlBody),
      '',
      `--${boundary}--`,
    ];

    const raw = utf8ToBase64Url(mimeLines.join('\r\n'));

    const res = await fetch(
      'https://gmail.googleapis.com/gmail/v1/users/me/messages/send',
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${cachedGmailAccessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ raw }),
      }
    );

    if (res.status === 401 || res.status === 403) {
      cachedGmailAccessToken = null;
      const err = new Error(
        'Permissão do Gmail expirada ou não concedida. Conecte o Gmail novamente.'
      );
      (err as Error & { code?: string }).code = 'GMAIL_AUTH_REQUIRED';
      throw err;
    }

    if (!res.ok) {
      let detail = `HTTP ${res.status}`;
      try {
        const errJson = (await res.json()) as {
          error?: { message?: string };
        };
        if (errJson?.error?.message) {
          detail = errJson.error.message;
        }
      } catch {
        // ignore JSON parse failure
      }
      throw new Error(`Falha ao enviar e-mail pelo Gmail (${detail}).`);
    }

    const data = (await res.json()) as { id: string; threadId?: string };
    return data;
  },

  async loadPublicCustomSpecimens(): Promise<Specimen[]> {
    const colPath = 'custom_specimens';
    try {
      const q = query(
        collection(db, colPath),
        where('visibility', '==', 'public')
      );
      const snap = await getDocs(q);
      const list: Specimen[] = [];
      snap.forEach((docSnap) => {
        const d = docSnap.data() as Record<string, unknown>;
        if (typeof d.id === 'string' && typeof d.name === 'string') {
          list.push(d as unknown as Specimen);
        }
      });
      return list;
    } catch (error) {
      handleFirestoreError(error, OperationType.LIST, colPath);
    }
  },

  async saveCustomSpecimen(spec: Specimen): Promise<boolean> {
    const user = auth.currentUser;
    if (!user || !user.emailVerified) return false;
    const { docId, payload } = sanitizeSpecimenPayload(spec, user.uid);
    const docPath = `custom_specimens/${docId}`;
    try {
      await setDoc(doc(db, 'custom_specimens', docId), payload);
      return true;
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, docPath);
    }
  },

  subscribeFavorites(
    cb: (favorites: UserFavoriteRecord[]) => void
  ): Unsubscribe {
    const user = auth.currentUser;
    if (!user) return () => {};
    const colPath = `users/${user.uid}/favorites`;
    const q = query(
      collection(db, colPath),
      where('ownerId', '==', user.uid)
    );
    return onSnapshot(
      q,
      (snap) => {
        const items: UserFavoriteRecord[] = [];
        snap.forEach((d) => {
          items.push(d.data() as UserFavoriteRecord);
        });
        cb(items);
      },
      (error) => {
        handleFirestoreError(error, OperationType.LIST, colPath);
      }
    );
  },

  async setFavorite(
    spec: { id: string; name: string; era: string; image_url?: string },
    shouldFavorite: boolean
  ): Promise<void> {
    const user = auth.currentUser;
    if (!user || !user.emailVerified) return;
    const docId = sanitizeId(spec.id);
    const docPath = `users/${user.uid}/favorites/${docId}`;
    const ref = doc(db, 'users', user.uid, 'favorites', docId);

    if (shouldFavorite) {
      try {
        await setDoc(ref, {
          specimenId: docId,
          specimenName: clampStr(spec.name, 160, docId),
          era: clampStr(spec.era, 40, 'contemporaneo'),
          imageUrl: clampStr(spec.image_url, 2000, ''),
          ownerId: user.uid,
          createdAt: serverTimestamp(),
        });
      } catch (error) {
        handleFirestoreError(error, OperationType.CREATE, docPath);
      }
    } else {
      try {
        await deleteDoc(ref);
      } catch (error) {
        handleFirestoreError(error, OperationType.DELETE, docPath);
      }
    }
  },

  subscribeCollections(
    cb: (collections: UserCollectionRecord[]) => void
  ): Unsubscribe {
    const user = auth.currentUser;
    if (!user) return () => {};
    const colPath = `users/${user.uid}/collections`;
    const q = query(
      collection(db, colPath),
      where('ownerId', '==', user.uid)
    );
    return onSnapshot(
      q,
      (snap) => {
        const items: UserCollectionRecord[] = [];
        snap.forEach((d) => {
          const data = d.data() as Omit<UserCollectionRecord, 'id'>;
          items.push({ id: d.id, ...data });
        });
        cb(items);
      },
      (error) => {
        handleFirestoreError(error, OperationType.LIST, colPath);
      }
    );
  },

  async createCollection(
    name: string,
    description = '',
    initialSpecimenIds: string[] = []
  ): Promise<string | null> {
    const user = auth.currentUser;
    if (!user || !user.emailVerified) return null;
    const cleanName = clampStr(name, 80);
    if (!cleanName) return null;
    const colId = sanitizeId(`${cleanName}-${Date.now().toString(36)}`);
    const docPath = `users/${user.uid}/collections/${colId}`;
    const safeIds = initialSpecimenIds
      .map(sanitizeId)
      .filter(Boolean)
      .slice(0, 50);

    try {
      await setDoc(doc(db, 'users', user.uid, 'collections', colId), {
        name: cleanName,
        description: clampStr(description, 300, ''),
        specimenIds: safeIds,
        ownerId: user.uid,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
      return colId;
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, docPath);
    }
  },

  async updateCollectionSpecimens(
    collectionId: string,
    specimenIds: string[]
  ): Promise<void> {
    const user = auth.currentUser;
    if (!user || !user.emailVerified) return;
    const safeColId = sanitizeId(collectionId);
    const docPath = `users/${user.uid}/collections/${safeColId}`;
    const safeIds = Array.from(new Set(specimenIds.map(sanitizeId)))
      .filter(Boolean)
      .slice(0, 50);

    try {
      await updateDoc(doc(db, 'users', user.uid, 'collections', safeColId), {
        specimenIds: safeIds,
        updatedAt: serverTimestamp(),
      });
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, docPath);
    }
  },

  async deleteCollection(collectionId: string): Promise<void> {
    const user = auth.currentUser;
    if (!user || !user.emailVerified) return;
    const safeColId = sanitizeId(collectionId);
    const docPath = `users/${user.uid}/collections/${safeColId}`;
    try {
      await deleteDoc(doc(db, 'users', user.uid, 'collections', safeColId));
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, docPath);
    }
  },

  subscribeNotes(
    cb: (notes: Record<string, UserFieldNoteRecord>) => void
  ): Unsubscribe {
    const user = auth.currentUser;
    if (!user) return () => {};
    const colPath = `users/${user.uid}/notes`;
    const q = query(collection(db, colPath), where('ownerId', '==', user.uid));
    return onSnapshot(
      q,
      (snap) => {
        const map: Record<string, UserFieldNoteRecord> = {};
        snap.forEach((d) => {
          const rec = d.data() as UserFieldNoteRecord;
          if (rec?.specimenId) map[rec.specimenId] = rec;
        });
        cb(map);
      },
      (error) => {
        handleFirestoreError(error, OperationType.LIST, colPath);
      }
    );
  },

  async saveFieldNote(
    specimenId: string,
    specimenName: string,
    content: string
  ): Promise<void> {
    const user = auth.currentUser;
    if (!user || !user.emailVerified) return;
    const safeId = sanitizeId(specimenId);
    const cleanContent = clampStr(content, 3000);
    const docPath = `users/${user.uid}/notes/${safeId}`;
    const ref = doc(db, 'users', user.uid, 'notes', safeId);

    if (!cleanContent) {
      try {
        await deleteDoc(ref);
      } catch {
        // ignore if doc did not exist
      }
      return;
    }

    try {
      const existing = await getDoc(ref);
      if (existing.exists()) {
        await updateDoc(ref, {
          specimenName: clampStr(specimenName, 160, safeId),
          content: cleanContent,
          updatedAt: serverTimestamp(),
        });
      } else {
        await setDoc(ref, {
          specimenId: safeId,
          specimenName: clampStr(specimenName, 160, safeId),
          content: cleanContent,
          ownerId: user.uid,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        });
      }
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, docPath);
    }
  },

  async deleteFieldNote(specimenId: string): Promise<void> {
    const user = auth.currentUser;
    if (!user || !user.emailVerified) return;
    const safeId = sanitizeId(specimenId);
    const docPath = `users/${user.uid}/notes/${safeId}`;
    try {
      await deleteDoc(doc(db, 'users', user.uid, 'notes', safeId));
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, docPath);
    }
  },

  async loadQuizStats(): Promise<UserQuizStatsRecord | null> {
    const user = auth.currentUser;
    if (!user || !user.emailVerified) return null;
    const docPath = `users/${user.uid}/quiz_stats/summary`;
    try {
      const snap = await getDoc(doc(db, 'users', user.uid, 'quiz_stats', 'summary'));
      if (!snap.exists()) return null;
      return snap.data() as UserQuizStatsRecord;
    } catch (error) {
      handleFirestoreError(error, OperationType.GET, docPath);
    }
  },

  async saveQuizStats(stats: {
    totalRounds: number;
    totalCorrect: number;
    totalQuestions: number;
    bestScore: number;
    badges: string[];
    selectedDifficulty?: string;
    unlockedLevels?: Partial<QuizDifficultyLevelMap>;
    completedLevels?: Partial<QuizDifficultyLevelMap>;
    levelStars?: string | Record<string, unknown>;
  }): Promise<void> {
    const user = auth.currentUser;
    if (!user || !user.emailVerified) return;
    const docPath = `users/${user.uid}/quiz_stats/summary`;
    const ref = doc(db, 'users', user.uid, 'quiz_stats', 'summary');
    const cleanBadges = Array.from(new Set((stats.badges || []).map((b) => clampStr(b, 80))))
      .filter(Boolean)
      .slice(0, 60);

    const allowedDiffs = new Set(['facil', 'medio', 'dificil', 'especialista']);
    const selectedDifficulty: QuizDifficultyKey = allowedDiffs.has(String(stats.selectedDifficulty))
      ? (stats.selectedDifficulty as QuizDifficultyKey)
      : 'facil';

    const clampLvl = (val: unknown, min: number, max: number, fallback: number): number => {
      const n = Math.floor(Number(val));
      if (!Number.isFinite(n)) return fallback;
      return Math.max(min, Math.min(max, n));
    };

    const unlockedLevels: QuizDifficultyLevelMap = {
      facil: clampLvl(stats.unlockedLevels?.facil, 1, 50, 1),
      medio: clampLvl(stats.unlockedLevels?.medio, 1, 50, 1),
      dificil: clampLvl(stats.unlockedLevels?.dificil, 1, 50, 1),
      especialista: clampLvl(stats.unlockedLevels?.especialista, 1, 50, 1),
    };

    const completedLevels: QuizDifficultyLevelMap = {
      facil: clampLvl(stats.completedLevels?.facil, 0, 50, 0),
      medio: clampLvl(stats.completedLevels?.medio, 0, 50, 0),
      dificil: clampLvl(stats.completedLevels?.dificil, 0, 50, 0),
      especialista: clampLvl(stats.completedLevels?.especialista, 0, 50, 0),
    };

    let levelStarsRaw = '{}';
    if (typeof stats.levelStars === 'string') {
      levelStarsRaw = stats.levelStars;
    } else if (stats.levelStars && typeof stats.levelStars === 'object') {
      try {
        levelStarsRaw = JSON.stringify(stats.levelStars);
      } catch {
        levelStarsRaw = '{}';
      }
    }
    const levelStars = levelStarsRaw.length <= 4000 ? levelStarsRaw : '{}';

    const payload = {
      totalRounds: Math.max(0, Math.min(100000, Math.floor(Number(stats.totalRounds) || 0))),
      totalCorrect: Math.max(0, Math.min(500000, Math.floor(Number(stats.totalCorrect) || 0))),
      totalQuestions: Math.max(0, Math.min(500000, Math.floor(Number(stats.totalQuestions) || 0))),
      bestScore: Math.max(0, Math.min(100, Math.floor(Number(stats.bestScore) || 0))),
      badges: cleanBadges,
      selectedDifficulty,
      unlockedLevels,
      completedLevels,
      levelStars,
      ownerId: user.uid,
      updatedAt: serverTimestamp(),
    };

    try {
      const existing = await getDoc(ref);
      if (existing.exists()) {
        await updateDoc(ref, {
          totalRounds: payload.totalRounds,
          totalCorrect: payload.totalCorrect,
          totalQuestions: payload.totalQuestions,
          bestScore: payload.bestScore,
          badges: payload.badges,
          selectedDifficulty: payload.selectedDifficulty,
          unlockedLevels: payload.unlockedLevels,
          completedLevels: payload.completedLevels,
          levelStars: payload.levelStars,
          updatedAt: serverTimestamp(),
        });
      } else {
        await setDoc(ref, payload);
      }
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, docPath);
    }
  },
};

declare global {
  interface Window {
    BioAtlasFirebase?: typeof BioAtlasFirebase;
  }
}

window.BioAtlasFirebase = BioAtlasFirebase;
export default BioAtlasFirebase;
