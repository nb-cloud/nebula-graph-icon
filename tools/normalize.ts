import fs from 'node:fs';
import path from 'node:path';
import { execSync } from 'node:child_process';
import babel from '@babel/core';
import generate from '@babel/generator';
import t from '@babel/types';
import chalk from 'chalk';

const errorLog = (msg: string) => console.log(chalk.redBright.italic(msg));
// const infoLog = (msg: string) => console.log(chalk.blueBright.italic(msg));
const successLog = (msg: string) => console.log(chalk.greenBright.italic(msg));

const __dirname = path.dirname(new URL(import.meta.url).pathname);
const esDir = path.resolve(__dirname, '../es');

const iconPackageName = 'NebulaGraph-Interface-Guidelines-Vesoft';
const iconPackagePath = path.resolve(__dirname, `../src/${iconPackageName}/svgs/`);

if (!fs.existsSync(iconPackagePath)) {
  console.log(`The folder \`${iconPackagePath}\` does not exist`);
  process.exit(1);
}

const srcFolderFiles = fs.readdirSync(iconPackagePath);

const componentNames = srcFolderFiles
  .filter((file) => file.endsWith('.svg'))
  .map((file) => {
    const svgFilePath = path.resolve(iconPackagePath, file);
    const svgFile = fs.readFileSync(svgFilePath, 'utf-8');
    const ast = babel.parseSync(svgFile, { filename: file });

    if (!ast) {
      errorLog(`Failed to parse the file \`${file}\``);
      process.exit(1);
    }

    babel.traverse(ast, {
      JSXOpeningElement(path) {
        const { node } = path;
        const attributes = node.attributes as t.JSXAttribute[];
        const nameNode = node.name as t.JSXIdentifier;
        const { name } = nameNode;
        if (name === 'path' && attributes) {
          node.attributes = attributes.filter((attr) => {
            const { name } = (attr as t.JSXAttribute).name;
            // remove `fill` attribute, because we use `currentColor` to replace it
            return name !== 'fill';
          });
          return;
        }

        if (name !== 'svg' || !attributes) {
          return;
        }
        const attrNames2Filter = new Set(['xmlns', 'width', 'height']);
        node.attributes = attributes.filter((attr) => {
          const name = attr.name.name as string;
          if (name === 'fill') {
            attr.value = t.stringLiteral('currentColor');
            return true;
          }
          return !attrNames2Filter.has(name);
        });
      },
    });

    // @ts-ignore
    const { code } = generate.default(ast, { comments: false, concise: true, retainLines: false }, svgFile);
    // remove `\n` and `;` at the end of each line
    const svgCode = code.replace(/\n|(;$)/g, '');
    // vesoft-account-circle-filled.svg => accountCircleFilled
    const componentId = file.replace('.svg', '').replace(/-(\w)/g, (_, p1) => p1.toUpperCase());
    // accountCircleFilled => AccountCircleFilled
    const componentName = componentId.replace(/^vesoft/, '');

    const esCode = `import { createSvgIcon } from '@mui/material/utils';\nexport default createSvgIcon(${svgCode}, '${componentId}');`;

    !fs.existsSync(esDir) && fs.mkdirSync(esDir, { recursive: true });
    const esFilePath = path.resolve(esDir, `${componentName}.js`);
    fs.writeFileSync(esFilePath, esCode, { encoding: 'utf-8' });

    successLog(`The file \`${componentName}.js\` has been created successfully`);

    return componentName;
  });

execSync(`npx babel es --out-dir es`, { encoding: 'utf-8', cwd: path.resolve(__dirname, '..') });

const indexFileContent = componentNames.map((name) => `export { default as ${name} } from './${name}';`).join('\n');
fs.writeFileSync(path.resolve(esDir, 'index.js'), indexFileContent, { encoding: 'utf-8' });
successLog(`The file \`index.js\` has been created successfully`);

const typesFileContent = [
  `import SvgIcon from '@mui/material/SvgIcon';`,
  `type SvgIconComponent = typeof SvgIcon;`,
  ...componentNames.map((name) => `export const ${name}: SvgIconComponent;`),
].join('\n');

fs.writeFileSync(path.resolve(esDir, 'index.d.ts'), typesFileContent, { encoding: 'utf-8' });
successLog(`The file \`index.d.ts\` has been created successfully`);

// const dstCode = dstCodeArr.join('\n');
// const output = `<svg aria-hidden="true" style="position: absolute; width: 0px; height: 0px; overflow: hidden;">\n${dstCode}\n</svg>`;

// const libDir = path.resolve(__dirname, '../lib', targetName);
// !fs.existsSync(libDir) && fs.mkdirSync(libDir, { recursive: true });
// fs.writeFileSync(path.resolve(libDir, 'svg-tpl.cjs'), `module.exports=\`${output}\``, { encoding: 'utf-8' });
// fs.writeFileSync(path.resolve(libDir, 'icon.cjs'), `const svgElement = require('./svg-tpl.cjs');\n${svgScript}`, {
//   encoding: 'utf-8',
// });

// const esDir = path.resolve(__dirname, '../es', targetName);
// !fs.existsSync(esDir) && fs.mkdirSync(esDir, { recursive: true });
// fs.writeFileSync(path.resolve(esDir, 'svg-tpl.mjs'), `export default \`${output}\``, { encoding: 'utf-8' });
// fs.writeFileSync(path.resolve(esDir, 'icon.mjs'), `import svgElement from './svg-tpl.mjs';\n${svgScript}`, {
//   encoding: 'utf-8',
// });
