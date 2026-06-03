import type {Plugin} from 'rolldown';

const WEB_FILE = /\.web\.(tsx?|ts)$/;

export type PlatformTarget = 'native' | 'web';

export function platformResolvePlugin(target: PlatformTarget): Plugin {
  return {
    name: `platform-resolve:${target}`,
    resolveId(source) {
      if (target === 'native' && WEB_FILE.test(source)) {
        return false;
      }
      return null;
    },
    load(id) {
      if (target === 'native' && WEB_FILE.test(id)) {
        return false;
      }
      return null;
    },
  };
}
