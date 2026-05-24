import {readFileSync} from 'node:fs';
import {execSync} from 'node:child_process';
import path from 'node:path';

const repoRoot = path.resolve(import.meta.dir, '../../..');
const pkgUiSrc = path.join(repoRoot, 'pkg/ui/src');

const forbidden =
  /from\s+['"](?:heroui-native(?:-pro(?:\/[^'"]+)?)?|@heroui(?:-pro)?\/react(?:\/[^'"]+)?)['"]/;

const files = execSync('git ls-files', {cwd: repoRoot, encoding: 'utf8'})
  .split('\n')
  .filter(Boolean)
  .filter((file) => file.endsWith('.ts') || file.endsWith('.tsx'))
  .filter((file) => !file.startsWith('pkg/ui/src/'));

const violations: string[] = [];

for (const file of files) {
  const absolute = path.join(repoRoot, file);
  let content: string;
  try {
    content = readFileSync(absolute, 'utf8');
  } catch {
    continue;
  }

  for (const [index, line] of content.split('\n').entries()) {
    if (forbidden.test(line)) {
      violations.push(`${file}:${index + 1}: ${line.trim()}`);
    }
  }
}

if (violations.length > 0) {
  console.error('Direct HeroUI imports found outside pkg/ui/src:\n');
  console.error(violations.join('\n'));
  process.exit(1);
}

console.log(`HeroUI boundary check passed (${files.length} files scanned).`);
