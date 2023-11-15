# Usage
```bash
npm install --save @vesoft-inc/icons
```

Each `svg-tpl.cjs` file nestled within the lib subdirectories proffers an exportation of the `SVG Icon Element` string.

```js
import SVGElement from '@vesoft-inc/icons/lib/NebulaGraph-Explorer/svg-tpl.cjs';

// inject `SVGElement` string into your html
```

# Build
```bash
npm install
npm run build
```

After build, the `dist` directory will be generated, and the directory structure is as follows:

```
dist
├── NebulaGraph-Cloud
│   └── svg.tpl
├── NebulaGraph-Dashboard
│   └── svg.tpl
├── NebulaGraph-Explorer
│   └── svg.tpl
├── NebulaGraph-Interface-Guidelines
│   └── svg.tpl
├── NebulaGraph-Studio
│   └── svg.tpl
└── NebulaGraph-Website
    └── svg.tpl
```

# Publish
```bash
# npm publish --tag beta
# npm publish
```
`Auto Publish`: push code to `mian` branch, github workflow will be triggered automatically.
- `1.0.0-beta.x` will be published as a beta package
- `1.0.0` will be published as a normal package

# Preview
- [Explorer&Studio](https://nb-cloud.github.io/nebula-graph-icon/src/NebulaGraph-Explorer/demo.html)
- [Dashboard](https://nb-cloud.github.io/nebula-graph-icon/src/NebulaGraph-Dashboard/demo.html)
- [Cloud](https://nb-cloud.github.io/nebula-graph-icon/src/NebulaGraph-Cloud/demo.html)
- [Website](https://nb-cloud.github.io/nebula-graph-icon/src/NebulaGraph-Website/demo.html)
- [Interface-Guidelines](https://nb-cloud.github.io/nebula-graph-icon/src/NebulaGraph-Interface-Guidelines/demo.html)
- [Interface-Guidelines-Vesoft](https://nb-cloud.github.io/nebula-graph-icon/src/NebulaGraph-Interface-Guidelines-Vesoft/demo.html)