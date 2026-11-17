/* <style>{`css`}</style> → <style dangerouslySetInnerHTML={{ __html: `css` }} />
   React escapes ">" inside text children when rendering on the server, so CSS with child
   selectors would not match during hydration. Run once over src/legacy (idempotent). */
import fs from 'node:fs';
import path from 'node:path';
import { parse } from '@babel/parser';
import traverseMod from '@babel/traverse';
const traverse = traverseMod.default || traverseMod;

const dirs = process.argv.slice(2).length ? process.argv.slice(2) : ['src/legacy/components', 'src/legacy/apps'];
let total = 0;
for (const dir of dirs) {
  for (const f of fs.readdirSync(dir).filter((x) => /\.(jsx|tsx)$/.test(x))) {
    const file = path.join(dir, f);
    const code = fs.readFileSync(file, 'utf8');
    const ast = parse(code, { sourceType: 'module', plugins: ['jsx', 'typescript'] });
    const edits = [];
    traverse(ast, {
      JSXElement(p) {
        const o = p.node.openingElement;
        if (o.name.type !== 'JSXIdentifier' || o.name.name !== 'style' || o.selfClosing) return;
        const kids = p.node.children.filter((c) => !(c.type === 'JSXText' && !c.value.trim()));
        if (kids.length !== 1) return;
        const k = kids[0];
        let expr;
        if (k.type === 'JSXExpressionContainer') expr = code.slice(k.expression.start, k.expression.end);
        else if (k.type === 'JSXText') expr = JSON.stringify(k.value);
        else return;
        const attrs = o.attributes.map((a) => code.slice(a.start, a.end)).join(' ');
        edits.push([p.node.start, p.node.end, `<style${attrs ? ' ' + attrs : ''} dangerouslySetInnerHTML={{ __html: ${expr} }} />`]);
      },
    });
    if (!edits.length) continue;
    edits.sort((a, b) => b[0] - a[0]);
    let out = code;
    let last = Infinity;
    for (const [s, e, t] of edits) { if (e > last) continue; out = out.slice(0, s) + t + out.slice(e); last = s; }
    fs.writeFileSync(file, out);
    total += edits.length;
    console.log(f, edits.length);
  }
}
console.log('style tags fixed:', total);
