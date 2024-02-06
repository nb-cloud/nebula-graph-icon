# Usage
```bash
# npm install --save @vesoft-inc/icons
pnpm install @vesoft-inc/icons
```

```tsx
import { AbTesting } from '@vesoft-inc/icons';

const App = () => {
  return (
    <div>
      <AbTesting />
    </div>
  );
};
```

# Build
```bash
npm install
npm run build
```

After the build process, the `es` directories will be generated.

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