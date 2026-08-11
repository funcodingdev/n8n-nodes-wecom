#!/usr/bin/env node
/**
 * 从编译后的 n8n 节点 description 生成 docs/UI-TREE.md
 * 用法：先 npm run build，再 node scripts/dump-ui-tree.mjs
 */
import { createRequire } from 'node:module';
import { writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const require = createRequire(import.meta.url);
const root = join(dirname(fileURLToPath(import.meta.url)), '..');

function loadNode(path, exportHint) {
	const mod = require(join(root, path));
	const C =
		mod[exportHint] ||
		Object.values(mod).find((x) => typeof x === 'function' && x.prototype?.description);
	if (!C) throw new Error(`Cannot load node class from ${path}`);
	return new C();
}

function findOperationField(properties, resourceValue) {
	return properties.find(
		(p) =>
			p.name === 'operation' &&
			Array.isArray(p.displayOptions?.show?.resource) &&
			p.displayOptions.show.resource.includes(resourceValue),
	);
}

function groupOps(options = []) {
	const groups = new Map();
	for (const op of options) {
		const m = String(op.name || '').match(/^\[([^\]]+)\]\s*(.+)$/);
		const group = m ? m[1] : '操作';
		const label = m ? m[2] : op.name || op.value;
		if (!groups.has(group)) groups.set(group, []);
		groups.get(group).push({ label, value: op.value });
	}
	return groups;
}

function renderTriggers(triggers) {
	const lines = [];
	lines.push('└─ 触发器节点');
	triggers.forEach((t, ti) => {
		const last = ti === triggers.length - 1;
		const branch = last ? '└─' : '├─';
		const pad = last ? '    ' : '│   ';
		const d = t.description;
		lines.push(`   ${branch} ${d.displayName}`);
		lines.push(`   ${pad} type: ${d.name}`);
		const params = (d.properties || []).filter((p) => p.type !== 'hidden' && p.type !== 'notice');
		const labels = {
			path: 'Path',
			events: d.properties?.find((p) => p.name === 'events')?.displayName || '事件类型',
			returnRawData: '返回原始数据',
		};
		params.forEach((p, pi) => {
			const pLast = pi === params.length - 1;
			const pBranch = pLast ? '└─' : '├─';
			const label = labels[p.name] || p.displayName || p.name;
			lines.push(`   ${pad} ${pBranch} 参数 · ${label}`);
		});
	});
	return lines;
}

// Preferred resource order for readability (matches historical UI-TREE layout)
const baseResourceOrder = [
	'contact',
	'message',
	'appChat',
	'pushMessage',
	'passiveReply',
	'aibotPassiveReply',
	'linkedcorp',
	'material',
	'system',
	'invoice',
	'agent',
	'appAuth',
	'license',
	'paytool',
	'externalpay',
	'miniapppay',
	'mchpay',
	'chatdata',
	'msgaudit',
	'promotionQrcode',
	'accountId',
	'file',
	'security',
];
const officeResourceOrder = [
	'wedoc',
	'wefile',
	'mail',
	'meeting',
	'live',
	'calendar',
	'checkin',
	'approval',
	'journal',
	'hr',
	'meetingroom',
	'emergency',
	'phone',
];
const wechatResourceOrder = ['externalContact', 'kf', 'school', 'living'];

const base = loadNode('dist/nodes/WeComBase/WeComBase.node.js', 'WeComBase');
const office = loadNode('dist/nodes/WeComOffice/WeComOffice.node.js', 'WeComOffice');
const wechat = loadNode('dist/nodes/WeComWechat/WeComWechat.node.js', 'WeComWechat');
const triggers = [
	loadNode('dist/nodes/WeComTrigger/WeComTrigger.node.js', 'WeComTrigger'),
	loadNode('dist/nodes/WeComPassiveTrigger/WeComPassiveTrigger.node.js', 'WeComPassiveTrigger'),
	loadNode('dist/nodes/WeComSuiteTrigger/WeComSuiteTrigger.node.js', 'WeComSuiteTrigger'),
	loadNode('dist/nodes/WeComAiBotTrigger/WeComAiBotTrigger.node.js', 'WeComAiBotTrigger'),
];

function assemble() {
	const out = [];
	out.push('# n8n 企业微信节点 · UI 总览图');
	out.push('');
	out.push('> 由 `scripts/dump-ui-tree.mjs` 根据编译后节点 description 自动生成，请勿手改。');
	out.push('>');
	out.push('> 生成命令：`npm run build && node scripts/dump-ui-tree.mjs`');
	out.push('');
	out.push('交互路径：`节点 → 资源(Resource) → 操作(Operation) → 参数(Parameters)`');
	out.push('');
	out.push('```');
	out.push('n8n 节点面板');
	out.push('│');

	// 三个 Action 节点均用 ├─/│，最后由「触发器节点」收尾 └─
	const actionNodes = [
		{ node: base, order: baseResourceOrder },
		{ node: office, order: officeResourceOrder },
		{ node: wechat, order: wechatResourceOrder },
	];

	let totalResources = 0;
	let totalOps = 0;

	for (const { node, order } of actionNodes) {
		const d = node.description;
		const v = '│';
		out.push(`├─ ${d.displayName}`);
		out.push(`${v}  type: ${d.name}`);
		out.push(`${v}  配置顺序: Credential → Resource → Operation → Parameters`);
		out.push(`${v}`);

		const resourceField = d.properties.find((p) => p.name === 'resource');
		const resourceOpts = resourceField?.options || [];
		const byValue = Object.fromEntries(resourceOpts.map((r) => [r.value, r]));
		const ordered = [];
		const seen = new Set();
		for (const v0 of order) {
			if (byValue[v0]) {
				ordered.push(byValue[v0]);
				seen.add(v0);
			}
		}
		for (const r of resourceOpts) {
			if (!seen.has(r.value)) ordered.push(r);
		}

		totalResources += ordered.length;

		ordered.forEach((res, ri) => {
			const lastRes = ri === ordered.length - 1;
			const rBranch = lastRes ? '└─' : '├─';
			const rGuide = lastRes ? ' ' : '│';
			const opField = findOperationField(d.properties, res.value);
			const ops = opField?.options || [];
			totalOps += ops.length;
			out.push(`${v}  ${rBranch} 资源 · ${res.name}  (${res.value})  · ${ops.length} ops`);
			if (!ops.length) {
				if (!lastRes) out.push(`${v}`);
				return;
			}
			const groups = groupOps(ops);
			const gEntries = [...groups.entries()];
			gEntries.forEach(([group, items], gi) => {
				const lastG = gi === gEntries.length - 1;
				const gBranch = lastG ? '└─' : '├─';
				const gGuide = lastG ? ' ' : '│';
				out.push(`${v}  ${rGuide}   ${gBranch} [${group}]`);
				items.forEach((item, ii) => {
					const lastI = ii === items.length - 1;
					const iBranch = lastI ? '└─' : '├─';
					out.push(
						`${v}  ${rGuide}   ${gGuide}   ${iBranch} ${item.label}  (${item.value})`,
					);
				});
			});
			if (!lastRes) out.push(`${v}`);
		});

		out.push('│');
	}

	// triggers
	out.push(...renderTriggers(triggers));
	out.push('```');
	out.push('');
	out.push(
		`**统计**：Action 节点 ${actionNodes.length} · 资源 ${totalResources} · 操作 ${totalOps} · 触发器 ${triggers.length}`,
	);
	out.push('');
	return { markdown: out.join('\n'), totalResources, totalOps };
}

const { markdown, totalResources, totalOps } = assemble();
const outPath = join(root, 'docs/UI-TREE.md');
writeFileSync(outPath, markdown, 'utf8');
console.log(`Wrote ${outPath}`);
console.log(`Resources: ${totalResources}, Operations: ${totalOps}, Triggers: ${triggers.length}`);
