import { execSync } from 'child_process';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const ExitCode = {
  Skip: 0,
  Normal: 1,
  Beta: 2,
};

// const iii = execSync(`git diff HEAD^ HEAD -- package.json | grep '"version":'`, { encoding: 'utf-8' });
const versionChanged = !!+execSync(
  `git diff -U0 HEAD^ HEAD -- package.json | grep '"version":' > /dev/null && echo 1 || echo 0`,
  { encoding: 'utf-8', cwd: path.resolve(__dirname, '..') }
);

if (!versionChanged) {
  // exit with 0 to skip publish
  process.exit(ExitCode.Skip);
}

const pkg = JSON.parse(fs.readFileSync(path.join(__dirname, '../package.json'), 'utf-8'));

const isBeta = pkg.version.includes('beta');

process.exit(isBeta ? ExitCode.Beta : ExitCode.Normal);
