import type {AccessConfig, AccessMode, HashAlgo} from '@/lib/access';

export type AppSettings = {
  defaultAccessMode: AccessMode;
  defaultExpirationDays: number | null;
  defaultMaxBytes: number | null;
  defaultMaxFiles: number;
  defaultHashAlgo: HashAlgo;
  allowedMime: string[];
  blockedMime: string[];
  wifiOnly: boolean;
};

export const DEFAULT_SETTINGS: AppSettings = {
  defaultAccessMode: 'link',
  defaultExpirationDays: 7,
  defaultMaxBytes: 5 * 1024 * 1024 * 1024,
  defaultMaxFiles: 10,
  defaultHashAlgo: 'blake3',
  allowedMime: [],
  blockedMime: [],
  wifiOnly: false,
};

const SETTINGS_KEY = 'dropfiles_settings';

export async function loadSettings(): Promise<AppSettings> {
  if (typeof localStorage === 'undefined') return {...DEFAULT_SETTINGS};

  const raw = localStorage.getItem(SETTINGS_KEY);
  if (!raw) return {...DEFAULT_SETTINGS};
  try {
    return {...DEFAULT_SETTINGS, ...JSON.parse(raw)} as AppSettings;
  } catch {
    return {...DEFAULT_SETTINGS};
  }
}

export async function saveSettings(settings: AppSettings): Promise<void> {
  if (typeof localStorage === 'undefined') return;
  localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
}

export function settingsToAccessDefaults(settings: AppSettings): Partial<AccessConfig> {
  const expiresAt =
    settings.defaultExpirationDays == null
      ? null
      : new Date(Date.now() + settings.defaultExpirationDays * 86400000).toISOString();

  return {
    accessMode: settings.defaultAccessMode,
    expiresAt,
    maxBytes: settings.defaultMaxBytes,
    maxFiles: settings.defaultMaxFiles,
    hashAlgo: settings.defaultHashAlgo,
    allowedMime: settings.allowedMime,
  };
}

export function isMimeAllowed(
  mime: string,
  settings: Pick<AppSettings, 'allowedMime' | 'blockedMime'>,
): boolean {
  if (settings.blockedMime.some((pattern) => mimeMatches(mime, pattern))) {
    return false;
  }
  if (settings.allowedMime.length === 0) return true;
  return settings.allowedMime.some((pattern) => mimeMatches(mime, pattern));
}

function mimeMatches(mime: string, pattern: string): boolean {
  if (pattern.endsWith('/*')) {
    return mime.startsWith(pattern.slice(0, -1));
  }
  return mime === pattern;
}
