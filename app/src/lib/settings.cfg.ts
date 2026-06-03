import type {AppSettings} from '@/lib/settings';
import {defaultExpirationAt} from '@/lib/expiration';

export const SETTINGS_KEY = 'dropfiles_settings_v1';

export const DEFAULT_SETTINGS: AppSettings = {
  defaultAccessMode: 'link',
  defaultExpirationAt: defaultExpirationAt(),
  defaultMaxBytes: 5 * 1024 * 1024 * 1024,
  defaultMaxFiles: 10,
  defaultHashAlgo: 'blake3',
  allowedMime: [],
  blockedMime: [],
  wifiOnly: false,
};
