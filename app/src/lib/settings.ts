import type {AccessConfig, AccessMode, HashAlgo} from '@/lib/access';
import * as SecureStore from 'expo-secure-store';
import {defaultExpirationAt} from '@/lib/expiration';

export type AppSettings = {
  defaultAccessMode: AccessMode;
  defaultExpirationAt: string | null;
  defaultMaxBytes: number | null;
  defaultMaxFiles: number;
  defaultHashAlgo: HashAlgo;
  allowedMime: string[];
  blockedMime: string[];
  wifiOnly: boolean;
};

const SETTINGS_KEY = 'dropfiles_settings';

export const DEFAULT_SETTINGS: AppSettings = {
  defaultAccessMode: 'link',
  defaultExpirationAt: defaultExpirationAtValue(),
  defaultMaxBytes: 5 * 1024 * 1024 * 1024,
  defaultMaxFiles: 10,
  defaultHashAlgo: 'blake3',
  allowedMime: [],
  blockedMime: [],
  wifiOnly: false,
};

export async function loadSettings(): Promise<AppSettings> {
  const raw = await SecureStore.getItemAsync(SETTINGS_KEY);
  if (!raw) return {...DEFAULT_SETTINGS};
  try {
    return normalizeSettings(JSON.parse(raw) as Record<string, unknown>);
  } catch {
    return {...DEFAULT_SETTINGS};
  }
}

export async function saveSettings(settings: AppSettings): Promise<void> {
  await SecureStore.setItemAsync(SETTINGS_KEY, JSON.stringify(settings));
}

export function settingsToAccessDefaults(settings: AppSettings): Partial<AccessConfig> {
  return {
    accessMode: settings.defaultAccessMode,
    expiresAt: settings.defaultExpirationAt,
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

function normalizeSettings(raw: Record<string, unknown>): AppSettings {
  const settings = {...DEFAULT_SETTINGS, ...raw} as AppSettings & {
    defaultExpirationDays?: number | null;
  };

  if (settings.defaultExpirationAt == null && settings.defaultExpirationDays != null) {
    settings.defaultExpirationAt = new Date(
      Date.now() + settings.defaultExpirationDays * 86400000,
    ).toISOString();
  }

  delete settings.defaultExpirationDays;
  return settings;
}

function mimeMatches(mime: string, pattern: string): boolean {
  if (pattern.endsWith('/*')) {
    return mime.startsWith(pattern.slice(0, -1));
  }
  return mime === pattern;
}

function defaultExpirationAtValue(): string {
  return defaultExpirationAt();
}
