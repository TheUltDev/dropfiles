import {defineConfig, type RolldownOptions} from 'rolldown';

import {
  platformResolvePlugin,
  type PlatformTarget,
} from './scripts/platform-resolve';

const SHARED_EXTERNAL = [
  'react',
  'react-dom',
  'react-native',
  'react-native-web',
  'react-native-svg',
  'react-native-gesture-handler',
  'react-native-reanimated',
  'react-native-worklets',
  'heroui-native',
  'heroui-native-pro',
  '@heroui/react',
  '@heroui-pro/react',
  '@internationalized/date',
  'motion',
  'tailwind-merge',
  '@number-flow/react',
] as const;

function isExternal(id: string): boolean {
  if ((SHARED_EXTERNAL as readonly string[]).includes(id)) {
    return true;
  }
  if (id.startsWith('@heroui/') || id.startsWith('@heroui-pro/')) {
    return true;
  }
  return false;
}

function createPlatformConfig(target: PlatformTarget): RolldownOptions {
  const isWeb = target === 'web';

  return {
    input: {index: 'src/index.ts'},
    platform: isWeb ? 'browser' : 'neutral',
    tsconfig: './tsconfig.json',
    external: isExternal,
    resolve: {
      extensions: isWeb
        ? ['.web.tsx', '.web.ts', '.tsx', '.ts', '.jsx', '.js', '.json']
        : ['.tsx', '.ts', '.jsx', '.js', '.json'],
      mainFields: isWeb
        ? ['browser', 'module', 'main']
        : ['react-native', 'module', 'main'],
    },
    transform: {
      jsx: 'react-jsx',
    },
    plugins: [platformResolvePlugin(target)],
    output: {
      format: 'esm',
      dir: isWeb ? 'dist/web' : 'dist/native',
      preserveModules: true,
      preserveModulesRoot: 'src',
    },
  };
}

export default defineConfig([
  createPlatformConfig('native'),
  createPlatformConfig('web'),
]);
