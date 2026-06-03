const path = require('path');
const {getDefaultConfig} = require('expo/metro-config');
const {withUniwindConfig} = require('uniwind/metro');

const projectRoot = __dirname;
const workspaceRoot = path.resolve(projectRoot, '..');
const herouiPrecompiledCss = path.resolve(
  workspaceRoot,
  'node_modules/@heroui/styles/dist/heroui.min.css',
);

const config = getDefaultConfig(projectRoot);

if (!config.resolver.assetExts.includes('wasm')) {
  config.resolver.assetExts.push('wasm');
}

config.watchFolders = [workspaceRoot];
config.resolver.unstable_conditionNames = [
  'development',
  ...(config.resolver.unstable_conditionNames ?? []),
];
config.resolver.nodeModulesPaths = [
  path.resolve(projectRoot, 'node_modules'),
  path.resolve(workspaceRoot, 'node_modules'),
];

const uniwindConfig = withUniwindConfig(config, {
  cssEntryFile: './src/global.css',
  dtsFile: './src/uniwind.d.ts',
});

const resolveRequest = uniwindConfig.resolver.resolveRequest;
uniwindConfig.resolver.resolveRequest = (context, moduleName, platform) => {
  if (moduleName === '@heroui/styles/precompiled') {
    return {filePath: herouiPrecompiledCss, type: 'sourceFile'};
  }
  if (resolveRequest) {
    return resolveRequest(context, moduleName, platform);
  }
  return context.resolveRequest(context, moduleName, platform);
};

module.exports = uniwindConfig;
