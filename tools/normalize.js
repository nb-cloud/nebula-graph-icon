import fs from 'node:fs';
import path from 'node:path';
import babel from '@babel/core';
import generate from '@babel/generator';
import t from '@babel/types';

const __dirname = path.dirname(new URL(import.meta.url).pathname);

// folder names for svg icons
const targetNames = process.argv[2]
  ? process.argv[2].split(',')
  : [
      'NebulaGraph-Cloud',
      'NebulaGraph-Dashboard',
      'NebulaGraph-Explorer',
      'NebulaGraph-Interface-Guidelines',
      'NebulaGraph-Interface-Guidelines-Vesoft',
      'NebulaGraph-Studio',
      'NebulaGraph-Website',
    ];

targetNames.forEach((targetName) => {
  const srcPath = path.resolve(__dirname, `../src/${targetName}/svgs/`);

  if (!fs.existsSync(srcPath)) {
    console.log(`The folder \`${srcPath}\` does not exist`);
    process.exit(1);
  }

  const srcFolderFiles = fs.readdirSync(srcPath);

  const dstCodeArr = srcFolderFiles
    .filter((file) => file.endsWith('.svg'))
    .map((file) => {
      const svgFilePath = path.resolve(srcPath, file);
      const svgFile = fs.readFileSync(svgFilePath, 'utf-8');
      const ast = babel.parseSync(svgFile, { filename: file });

      babel.traverse(ast, {
        JSXOpeningElement(path) {
          const { node } = path;
          const { attributes } = node;
          const { name } = node.name;
          if (name === 'path' && attributes) {
            node.attributes = attributes.filter((attr) => {
              const { name } = attr.name;
              // remove `fill` attribute, because we use `currentColor` to replace it
              return name !== 'fill';
            });
            return;
          }

          if (name !== 'svg' || !attributes) {
            return;
          }
          node.name.name = 'symbol';
          const attrNames2Filter = new Set(['xmlns', 'width', 'height']);
          node.attributes = attributes.filter((attr) => {
            const { name } = attr.name;
            if (name === 'fill') {
              attr.value.value = 'currentColor';
              return true;
            }
            return !attrNames2Filter.has(name);
          });
          const id = file.replace('.svg', '');
          node.attributes.push(t.jsxAttribute(t.jsxIdentifier('id'), t.stringLiteral(id)));
        },
        JSXClosingElement(path) {
          if (path.node.name?.name === 'svg') {
            path.node.name.name = 'symbol';
          }
        },
      });

      const { code } = generate.default(ast, { comments: false, concise: true, retainLines: false }, svgFile);
      // remove `\n` and `;` at the end of each line
      return code.replace(/\n|(;$)/g, '');
    });

  const dstCode = dstCodeArr.join('\n');
  const output = `<svg aria-hidden="true" style="position: absolute; width: 0px; height: 0px; overflow: hidden;">\n${dstCode}\n</svg>`;

  const distDir = path.resolve(__dirname, '../dist', targetName);
  !fs.existsSync(distDir) && fs.mkdirSync(distDir, { recursive: true });
  fs.writeFileSync(path.resolve(distDir, 'svg-tpl.js'), `module.exports=\`${output}\``, { encoding: 'utf-8' });

  const esDir = path.resolve(__dirname, '../es', targetName);
  !fs.existsSync(esDir) && fs.mkdirSync(esDir, { recursive: true });
  fs.writeFileSync(path.resolve(esDir, 'svg-tpl.js'), `export default \`${output}\``, { encoding: 'utf-8' });
});
