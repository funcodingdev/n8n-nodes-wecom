#!/usr/bin/env node
/**
 * 从本地全局错误码文档生成 nodes/WeCom/shared/errorCodes.ts
 * 用法：同步 docs 后运行 node scripts/gen-error-codes.mjs
 */
import fs from 'fs';
import path from 'path';

const docFile = 'docs/001-企业自建应用开发/005-附录/003-全局错误码.md';
const outFile = 'nodes/WeCom/shared/errorCodes.ts';
const MAX_FIX_LENGTH = 300;

const text = fs.readFileSync(docFile, 'utf8');

const clean = (value) =>
	value
		.replace(/&nbsp;/g, ' ')
		.replace(/&amp;/g, '&')
		.replace(/&#124;/g, '|')
		.replace(/-?\s*!\[[^\]]*\]\([^)]*\)/g, '')
		.replace(/<[^>]+>/g, '')
		.replace(/!!#[0-9a-f]{6}\s*([^!]*)!!/gi, '$1')
		.replace(/\[([^\]]*)\]\([^)]*\)/g, '$1')
		.replace(/\\([*_|:?"<>])/g, '$1')
		.replace(/\s+/g, ' ')
		.replace(/[\s-]*!?\s*$/, '')
		.trim();

// “查看帮助”指向的详细说明章节
const details = new Map();
const sectionRe = /^#{2,6}\s*错误码[:：]\s*(-?\d+)\s*$/gm;
const headings = [...text.matchAll(sectionRe)];
headings.forEach((match, index) => {
	const end = index + 1 < headings.length ? headings[index + 1].index : text.length;
	const body = text.slice(match.index + match[0].length, end).replace(/^#{1,6} .*$/m, '');
	details.set(match[1], clean(body.split(/\n#{1,6} /)[0]));
});

const codes = new Map();
for (const line of text.split('\n')) {
	const row = line.match(/^\|\s*(-?\d+)\s*\|([^|]*)\|(.*)\|\s*$/);
	if (!row || codes.has(row[1]) || row[1] === '0') continue;
	const meaning = clean(row[2]);
	let fix = clean(row[3]);
	if (/^查看帮助$/.test(fix) || fix === '-') fix = details.get(row[1]) ?? '';
	if (fix.length > MAX_FIX_LENGTH) fix = `${fix.slice(0, MAX_FIX_LENGTH)}…`;
	codes.set(row[1], fix && fix !== meaning ? [meaning, fix] : [meaning]);
}

const entries = [...codes.entries()]
	.sort((a, b) => Number(a[0]) - Number(b[0]))
	.map(([code, value]) => `\t'${code}': ${JSON.stringify(value)},`)
	.join('\n');

fs.mkdirSync(path.dirname(outFile), { recursive: true });
fs.writeFileSync(
	outFile,
	`// 由 scripts/gen-error-codes.mjs 根据官方全局错误码文档生成，请勿手动修改
// https://developer.work.weixin.qq.com/document/path/90313

/** 错误码 → [错误说明, 排查方法?] */
export const WECOM_ERROR_CODES: Record<string, [string, string?]> = {
${entries}
};
`,
);
console.log(`Wrote ${outFile} (${codes.size} codes, ${details.size} detailed sections)`);
