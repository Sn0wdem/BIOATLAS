export interface CachedImageEntry {
  buffer: Buffer;
  contentType: string;
  size: number;
  expiresAt: number;
}

const ALLOWED_IMAGE_HOSTS = new Set([
  'upload.wikimedia.org',
  'thumb.wikimedia.org',
  'commons.wikimedia.org',
  'en.wikipedia.org',
  'pt.wikipedia.org',
  'images.phylopic.org',
]);

const MAX_ENTRIES = 240;
const MAX_TOTAL_BYTES = 60 * 1024 * 1024; // 60 MB
const MAX_SINGLE_BYTES = 8 * 1024 * 1024; // 8 MB
const DEFAULT_TTL_MS = 6 * 60 * 60 * 1000; // 6 hours

export function isAllowedImageUrl(rawUrl: string): {
  allowed: boolean;
  parsed?: URL;
  reason?: string;
} {
  try {
    const parsed = new URL(rawUrl);
    if (parsed.protocol !== 'https:') {
      return { allowed: false, reason: 'Apenas URLs HTTPS são permitidas.' };
    }
    const host = parsed.hostname.toLowerCase();
    // Block IP addresses or localhost
    if (
      host === 'localhost' ||
      /^\d+\.\d+\.\d+\.\d+$/.test(host) ||
      host.includes(':')
    ) {
      return { allowed: false, reason: 'Host não permitido.' };
    }
    if (!ALLOWED_IMAGE_HOSTS.has(host)) {
      return {
        allowed: false,
        reason: `Domínio '${host}' não está na lista de domínios confiáveis.`,
      };
    }
    return { allowed: true, parsed };
  } catch {
    return { allowed: false, reason: 'URL malformada.' };
  }
}

class ImageLruCache {
  private map = new Map<string, CachedImageEntry>();
  private totalBytes = 0;

  get(key: string): CachedImageEntry | null {
    const entry = this.map.get(key);
    if (!entry) return null;
    if (Date.now() > entry.expiresAt) {
      this.delete(key);
      return null;
    }
    // Refresh LRU order
    this.map.delete(key);
    this.map.set(key, entry);
    return entry;
  }

  set(key: string, buffer: Buffer, contentType: string): void {
    if (buffer.byteLength > MAX_SINGLE_BYTES) return;
    if (this.map.has(key)) {
      this.delete(key);
    }

    while (
      this.map.size >= MAX_ENTRIES ||
      this.totalBytes + buffer.byteLength > MAX_TOTAL_BYTES
    ) {
      const oldestKey = this.map.keys().next().value;
      if (!oldestKey) break;
      this.delete(oldestKey);
    }

    const entry: CachedImageEntry = {
      buffer,
      contentType,
      size: buffer.byteLength,
      expiresAt: Date.now() + DEFAULT_TTL_MS,
    };
    this.map.set(key, entry);
    this.totalBytes += entry.size;
  }

  delete(key: string): void {
    const existing = this.map.get(key);
    if (!existing) return;
    this.totalBytes -= existing.size;
    this.map.delete(key);
  }

  stats() {
    return {
      entries: this.map.size,
      totalBytes: this.totalBytes,
    };
  }
}

export class ApiTtlCache<T> {
  private map = new Map<string, { value: T; expiresAt: number }>();
  private readonly ttlMs: number;
  private readonly maxEntries: number;

  constructor(ttlMs = 30 * 60 * 1000, maxEntries = 200) {
    this.ttlMs = ttlMs;
    this.maxEntries = maxEntries;
  }

  get(key: string): T | undefined {
    const hit = this.map.get(key);
    if (!hit) return undefined;
    if (Date.now() > hit.expiresAt) {
      this.map.delete(key);
      return undefined;
    }
    this.map.delete(key);
    this.map.set(key, hit);
    return hit.value;
  }

  set(key: string, value: T): void {
    if (this.map.size >= this.maxEntries) {
      const oldest = this.map.keys().next().value;
      if (oldest !== undefined) this.map.delete(oldest);
    }
    this.map.set(key, { value, expiresAt: Date.now() + this.ttlMs });
  }
}

export const imageProxyCache = new ImageLruCache();
export const MAX_PROXY_IMAGE_BYTES = MAX_SINGLE_BYTES;
