#!/usr/bin/env node
/** 校验 docs/001 服务端 HTTP 路径是否均在 nodes/WeCom 中出现 */
import fs from 'fs';
import path from 'path';

function walk(d, a = [], pred = () => true) {
  if (!fs.existsSync(d)) return a;
  for (const e of fs.readdirSync(d, { withFileTypes: true })) {
    const p = path.join(d, e.name);
    if (e.isDirectory()) walk(p, a, pred);
    else if (pred(p)) a.push(p);
  }
  return a;
}
const docsRoot = 'docs/001-企业内部开发/002-服务端API';
const cgiRe = /\/cgi-bin\/[a-zA-Z0-9_./-]+/g;
const mchRe = /https?:\/\/api\.mch\.weixin\.qq\.com\/[a-zA-Z0-9_./-]+/g;
function extract(t) {
  const s = new Set();
  let m;
  const r1 = new RegExp(cgiRe);
  while ((m = r1.exec(t))) {
    let p = m[0].replace(/[.,;:)\]}'"`]+$/, '').split('?')[0];
    if (p.endsWith('/') && p !== '/cgi-bin/') p = p.slice(0, -1);
    if (p.includes('*') || p.includes('{') || p.length < 12) continue;
    const parts = p.replace(/^\/cgi-bin\//, '').split('/');
    if (parts.length === 1 && !['gettoken', 'get_jsapi_ticket', 'get_launch_code'].includes(parts[0])) continue;
    if (parts.length === 1 && ['crm', 'externalcontact', 'user', 'login', 'query', 'redirect', 'sandbox', 'helloworld', 'wxpush'].includes(parts[0])) continue;
    s.add(p);
  }
  const r2 = new RegExp(mchRe);
  while ((m = r2.exec(t))) s.add(m[0].split('?')[0]);
  return s;
}
const docs = new Set();
for (const f of walk(docsRoot, [], (p) => p.endsWith('.md'))) for (const p of extract(fs.readFileSync(f, 'utf8'))) docs.add(p);
const code = extract(walk('nodes/WeCom', [], (p) => p.endsWith('.ts')).map((f) => fs.readFileSync(f, 'utf8')).join('\n'));
const missing = [...docs].filter((p) => !code.has(p));
console.log(`coverage ${docs.size - missing.length}/${docs.size}`);
if (missing.length) {
  console.error('MISSING:');
  missing.forEach((p) => console.error(' ', p));
  process.exit(1);
}
console.log('OK');
