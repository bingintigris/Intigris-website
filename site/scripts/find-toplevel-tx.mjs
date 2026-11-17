/* Lists tx() calls that run at module level (outside any function): those are evaluated once
   during the build, so they would freeze one language into every page. */
import fs from 'node:fs';
import path from 'node:path';
import { parse } from '@babel/parser';
import traverseMod from '@babel/traverse';
const traverse = traverseMod.default || traverseMod;

for (const dir of ['src/legacy/components', 'src/legacy/apps']) {
  for (const f of fs.readdirSync(dir).filter((x) => x.endsWith('.jsx'))) {
    const code = fs.readFileSync(path.join(dir, f), 'utf8');
    const ast = parse(code, { sourceType: 'module', plugins: ['jsx'] });
    const hits = new Map();
    traverse(ast, {
      CallExpression(p) {
        const c = p.node.callee;
        const isTx = (c.type === 'Identifier' && (c.name === 'tx' || c.name === 'getLang'));
        if (!isTx || p.getFunctionParent()) return;
        const top = p.findParent((q) => q.parentPath && q.parentPath.isProgram());
        const name = top?.node.declarations?.[0]?.id?.name || top?.node.declaration?.declarations?.[0]?.id?.name || top?.type;
        hits.set(name, (hits.get(name) || 0) + 1);
      },
    });
    if (hits.size) console.log(`${dir.split('/').pop()}/${f}: ${[...hits].map(([k, v]) => `${k}(${v})`).join(', ')}`);
  }
}
