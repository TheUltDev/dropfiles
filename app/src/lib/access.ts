export type AccessMode = 'anyone' | 'link' | 'email' | 'password';
export type HashAlgo = 'none' | 'blake3';

export type AccessConfig = {
  accessMode: AccessMode;
  allowedEmails: string[];
  password?: string;
  expiresAt?: string | null;
  maxBytes?: number | null;
  allowedMime: string[];
  maxFiles: number;
  hashAlgo: HashAlgo;
};

export const DEFAULT_ACCESS_CONFIG: AccessConfig = {
  accessMode: 'link',
  allowedEmails: [],
  password: undefined,
  expiresAt: null,
  maxBytes: null,
  allowedMime: [],
  maxFiles: 10,
  hashAlgo: 'blake3',
};

export const ACCESS_MODE_LABELS: Record<AccessMode, string> = {
  anyone: 'Anyone',
  link: 'Anyone with link',
  email: 'Specific emails',
  password: 'Password protected',
};

export function summarizeAccess(config: AccessConfig): string {
  switch (config.accessMode) {
    case 'anyone':
      return 'Public';
    case 'link':
      return 'Link only';
    case 'email':
      return `${config.allowedEmails.length} email(s)`;
    case 'password':
      return 'Password required';
    default:
      return 'Unknown';
  }
}

export function parseEmailList(value: string): string[] {
  return value
    .split(/[,;\s]+/)
    .map((email) => email.trim().toLowerCase())
    .filter(Boolean);
}

export function matchesMime(mime: string, patterns: string[]): boolean {
  if (patterns.length === 0) return true;
  return patterns.some((pattern) => {
    if (pattern.endsWith('/*')) {
      const prefix = pattern.slice(0, -1);
      return mime.startsWith(prefix);
    }
    return mime === pattern;
  });
}

export function hashEnabled(algo: HashAlgo): boolean {
  return algo === 'blake3';
}

export function hashLabel(algo: HashAlgo): string {
  return algo === 'blake3' ? 'BLAKE3' : 'None';
}
