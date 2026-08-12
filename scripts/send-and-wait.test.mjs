import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';

import sendAndWaitModule from '../dist/nodes/WeCom/resources/message/sendAndWait.js';
import cryptoModule from '../dist/nodes/WeCom/shared/crypto.js';
import nativeHitlModule from '../dist/nodes/WeCom/shared/nativeHitl.js';
import weComBaseModule from '../dist/nodes/WeComBase/WeComBase.node.js';
import weComTriggerModule from '../dist/nodes/WeComTrigger/WeComTrigger.node.js';

const {
	calculateWaitTill,
	createApprovalTemplateCard,
	createSendAndWaitTaskId,
	executeSendAndWait,
	resolveApprovalOptions,
	sendAndWaitDescription,
	sendAndWaitWebhook,
} = sendAndWaitModule;
const { WeComBase } = weComBaseModule;
const { WeComTrigger } = weComTriggerModule;
const { WeComCrypto, parseXML } = cryptoModule;
const {
	NATIVE_HITL_CONTEXT_HEADER,
	NATIVE_HITL_CONTEXT_SIGNATURE_HEADER,
	createNativeHitlContextHeaders,
	createNativeHitlEventKey,
	parseNativeHitlEventKey,
} = nativeHitlModule;

async function invokeNativeTriggerCallback({ approved, userId, selectedOption, selectedLabel }) {
	const token = `native-${approved}-token`;
	const corpId = `ww-native-${approved}`;
	const encodingAESKey = Buffer.alloc(32, approved ? 11 : 12)
		.toString('base64')
		.slice(0, 43);
	const taskId = `n8n_hitl_${approved}_task`;
	const resumeQuery = new URLSearchParams({ approved: String(approved), taskId, signature: 'signed' });
	if (selectedOption) resumeQuery.set('selectedOption', selectedOption);
	if (selectedLabel) resumeQuery.set('selectedLabel', selectedLabel);
	if (selectedOption || selectedLabel) resumeQuery.set('optionMode', 'custom');
	const resumeUrl = `https://n8n.example/webhook-waiting/execution/node?${resumeQuery.toString()}`;
	const eventKey = createNativeHitlEventKey(resumeUrl, taskId, token);
	const decryptedCallback = `<xml>
		<ToUserName><![CDATA[${corpId}]]></ToUserName>
		<FromUserName><![CDATA[${userId}]]></FromUserName>
		<MsgType><![CDATA[event]]></MsgType>
		<Event><![CDATA[template_card_event]]></Event>
		<EventKey><![CDATA[${eventKey}]]></EventKey>
		<TaskId><![CDATA[${taskId}]]></TaskId>
		<ResponseCode><![CDATA[response-${approved}]]></ResponseCode>
	</xml>`;
	const node = {
		id: 'trigger-helper',
		name: 'WeCom Trigger',
		type: 'weComTrigger',
		typeVersion: 1,
	};
	const crypto = new WeComCrypto(encodingAESKey, corpId);
	const encryptedCallback = crypto.encrypt(decryptedCallback, node);
	const timestamp = '1786528002';
	const nonce = `nonce-${approved}`;
	const signature = WeComCrypto.generateSignature(token, timestamp, nonce, encryptedCallback);
	const relayRequests = [];
	const trigger = new WeComTrigger();
	const result = await trigger.webhook.call({
		getWebhookName: () => 'default',
		getCredentials: async () => ({ corpId, token, encodingAESKey }),
		getQueryData: () => ({ msg_signature: signature, timestamp, nonce }),
		getRequestObject: () => ({
			rawBody: Buffer.from(`<xml><Encrypt><![CDATA[${encryptedCallback}]]></Encrypt></xml>`),
		}),
		getNode: () => node,
		getNodeParameter: (name, fallback) =>
			({ events: ['*'], returnRawData: false, autoResumeNativeHitl: true })[name] ?? fallback,
		getNodeWebhookUrl: () => 'https://n8n.example/webhook/wecom-native',
		getInstanceBaseUrl: () => 'https://n8n.example',
		helpers: {
			httpRequest: async (options) => {
				relayRequests.push(options);
				return 'ok';
			},
		},
	});

	return { crypto, node, relayRequests, result, resumeUrl };
}

test('registers sendAndWait as a waiting operation on the WeCom node', () => {
	const node = new WeComBase();
	const resource = node.description.properties.find((property) => property.name === 'resource');
	const operation = node.description.properties.find(
		(property) =>
			property.name === 'operation' &&
			property.options?.some((option) => option.value === 'sendAndWait'),
	);

	assert.equal(resource.default, 'message');
	assert.ok(operation);
	assert.equal(node.description.webhooks.length, 1);
	assert.equal(node.description.webhooks[0].restartWebhook, true);
});

test('registers WeCom as an n8n Human review channel', () => {
	const codex = JSON.parse(
		readFileSync(new URL('../nodes/WeComBase/WeComBase.node.json', import.meta.url), 'utf8'),
	);

	assert.ok(codex.categories.includes('HITL'));
	assert.deepEqual(codex.subcategories.HITL, ['Human in the Loop']);
	assert.ok(codex.alias.includes('approval'));
});

test('shows the AI tool name and parameters in the default approval message', () => {
	const subject = sendAndWaitDescription.find((property) => property.name === 'subject');
	const message = sendAndWaitDescription.find((property) => property.name === 'message');

	assert.match(subject.default, /\$tool\?\.name/);
	assert.match(message.default, /\$tool\?\.name/);
	assert.match(message.default, /JSON\.stringify\(\$tool\.parameters/);
});

test('places the credential picker before all business parameters', () => {
	const node = new WeComBase();

	assert.equal(node.description.properties[0].type, 'credentials');
	assert.equal(node.description.properties[0].name, 'credentials');
});

test('shows only explicitly configured approval options', () => {
	assert.equal(
		sendAndWaitDescription.some((property) =>
			['approvalOptionMode', 'approvalOptions'].includes(property.name),
		),
		false,
	);
	assert.equal(
		sendAndWaitDescription.find((property) => property.name === 'customApprovalOptions')
			?.displayName,
		'审批人可选操作',
	);
});

test('describes every WeCom button style by visual intent', () => {
	const approvalOptions = sendAndWaitDescription.find(
		(property) => property.name === 'customApprovalOptions',
	);
	const styleProperty = approvalOptions.options[0].values.find(
		(property) => property.name === 'style',
	);

	assert.deepEqual(
		styleProperty.options.map((option) => option.name),
		[
			'主要选择（蓝底白字）',
			'次要选择（灰底蓝字）',
			'需要警示（灰底红字）',
			'普通选择（灰底黑字）',
		],
	);
});

test('describes approval interactions from the approver perspective', () => {
	const recipientType = sendAndWaitDescription.find((property) => property.name === 'recipientType');
	const recipient = sendAndWaitDescription.find((property) => property.name === 'touser');
	const approvalMode = sendAndWaitDescription.find((property) => property.name === 'approvalMode');
	const subject = sendAndWaitDescription.find((property) => property.name === 'subject');
	const message = sendAndWaitDescription.find((property) => property.name === 'message');

	assert.equal(recipientType.displayName, '发送给谁');
	assert.equal(recipient.displayName, '选择成员');
	assert.doesNotMatch(recipientType.description, /touser|toparty|totag/);
	assert.equal(approvalMode.displayName, '审批人如何操作');
	assert.deepEqual(
		approvalMode.options.map((option) => option.name),
		['打开结果页（推荐）', '直接在企业微信中选择'],
	);
	assert.equal(subject.displayName, '消息标题');
	assert.equal(message.displayName, '给审批人的说明');
	assert.doesNotMatch(approvalMode.options[0].description, /恢复地址|回调/);
	assert.doesNotMatch(approvalMode.options[1].description, /HITL|EventKey/);
});

test('creates URL buttons for approve and reject', () => {
	const card = createApprovalTemplateCard({
		title: '工具调用审批',
		message: '准备发送消息',
		approvalMode: 'url',
		options: [
			{
				label: '拒绝',
				value: 'reject',
				approved: false,
				style: 2,
				action: 'https://n8n.example/webhook-waiting?approved=false',
			},
			{
				label: '通过',
				value: 'approve',
				approved: true,
				style: 1,
				action: 'https://n8n.example/webhook-waiting?approved=true',
			},
		],
		taskId: 'n8n_hitl_test',
	});

	assert.equal(card.card_type, 'button_interaction');
	assert.deepEqual(card.button_list, [
		{
			type: 1,
			text: '拒绝',
			style: 2,
			url: 'https://n8n.example/webhook-waiting?approved=false',
		},
		{
			type: 1,
			text: '通过',
			style: 1,
			url: 'https://n8n.example/webhook-waiting?approved=true',
		},
	]);
});

test('creates a card with one custom option', () => {
	const card = createApprovalTemplateCard({
		title: '审批',
		message: '内容',
		approvalMode: 'url',
		options: [
			{
				label: '确认',
				value: 'approve',
				approved: true,
				style: 1,
				action: 'https://n8n.example/approve',
			},
		],
		taskId: 'n8n_hitl_test',
	});

	assert.equal(card.button_list.length, 1);
	assert.equal(card.button_list[0].url, 'https://n8n.example/approve');
});

test('creates native WeCom callback buttons', () => {
	const card = createApprovalTemplateCard({
		title: '审批',
		message: '内容',
		approvalMode: 'native',
		options: [
			{
				label: '拒绝',
				value: 'reject',
				approved: false,
				style: 2,
				action: 'native-reject-key',
			},
			{
				label: '通过',
				value: 'approve',
				approved: true,
				style: 1,
				action: 'native-approve-key',
			},
		],
		taskId: 'n8n_hitl_test',
	});

	assert.deepEqual(card.button_list, [
		{ type: 0, text: '拒绝', style: 2, key: 'native-reject-key' },
		{ type: 0, text: '通过', style: 1, key: 'native-approve-key' },
	]);
});

test('requires at least one explicitly configured approval option', () => {
	assert.throws(() => resolveApprovalOptions({}), /请至少添加 1 个审批人可选操作/);
});

test('supports up to six custom approval options with unique values', () => {
	const options = resolveApprovalOptions({
		options: [
			{ label: '通过', value: 'approve_now', approved: true, style: 1 },
			{ label: '拒绝', value: 'reject_now', approved: false, style: 2 },
			{ label: '转交主管', value: 'transfer', approved: false, style: 3 },
		],
	});

	assert.deepEqual(options[2], {
		label: '转交主管',
		value: 'transfer',
		approved: false,
		style: 3,
	});
	assert.throws(
		() =>
			resolveApprovalOptions({
				options: Array.from({ length: 7 }, (_, index) => ({
					label: `选项${index}`,
					value: `option_${index}`,
				})),
			}),
		/最多添加 6 个/,
	);
	assert.throws(
		() =>
			resolveApprovalOptions({
				options: [
					{ label: '选项一', value: 'same' },
					{ label: '选项二', value: 'same' },
				],
			}),
		/返回值必须不同/,
	);
});

test('creates URL buttons for custom approval options', () => {
	const options = resolveApprovalOptions({
		options: [
			{ label: '立即执行', value: 'run_now', approved: true, style: 1 },
			{ label: '稍后处理', value: 'later', approved: false, style: 3 },
			{ label: '转交主管', value: 'transfer', approved: false, style: 2 },
		],
	});
	const card = createApprovalTemplateCard({
		title: '工具调用审批',
		message: '请选择处理方式',
		approvalMode: 'url',
		options: options.map((option) => ({
			...option,
				action: `https://n8n.example/wait?${new URLSearchParams({
				approved: String(option.approved),
				selectedOption: option.value,
				selectedLabel: option.label,
				optionMode: 'custom',
			}).toString()}`,
		})),
		taskId: 'n8n_hitl_custom',
	});

	assert.equal(card.button_list.length, 3);
	assert.deepEqual(
		card.button_list.map((button) => Object.fromEntries(new URL(button.url).searchParams)),
		[
			{
				approved: 'true',
				selectedOption: 'run_now',
				selectedLabel: '立即执行',
				optionMode: 'custom',
			},
			{
				approved: 'false',
				selectedOption: 'later',
				selectedLabel: '稍后处理',
				optionMode: 'custom',
			},
			{
				approved: 'false',
				selectedOption: 'transfer',
				selectedLabel: '转交主管',
				optionMode: 'custom',
			},
		],
	);
});

test('creates a valid unique WeCom task id', () => {
	const taskId = createSendAndWaitTaskId('execution/1', 'node id', 123456789, 'a1b2c3d4');
	const otherTaskId = createSendAndWaitTaskId('x'.repeat(200), 'node id', 123456789, 'deadbeef');

	assert.match(taskId, /^[A-Za-z0-9_@-]+$/);
	assert.ok(taskId.length <= 128);
	assert.match(taskId, /_21i3v9_a1b2c3d4$/);
	assert.notEqual(taskId, otherTaskId);
	assert.equal(otherTaskId.length, 128);
	assert.match(otherTaskId, /_21i3v9_deadbeef$/);
});

test('calculates a limited wait time', () => {
	const now = new Date('2026-08-12T00:00:00.000Z');
	const waitTill = calculateWaitTill(
		{ limitType: 'afterTimeInterval', resumeAmount: 45, resumeUnit: 'minutes' },
		now,
	);

	assert.equal(waitTill.toISOString(), '2026-08-12T00:45:00.000Z');
	assert.throws(
		() => calculateWaitTill({ limitType: 'atSpecifiedTime', maxDateAndTime: 'not-a-date' }),
		/请选择有效的结束时间/,
	);
});

test('returns the approval shape expected by n8n HITL', async () => {
	const approvedResult = await sendAndWaitWebhook.call({
		getQueryData: () => ({
			approved: 'true',
			selectedOption: 'approve_later',
			selectedLabel: '稍后通过',
		}),
		getNodeParameter: (_name, fallback) => fallback,
	});
	const rejectedResult = await sendAndWaitWebhook.call({
		getQueryData: () => ({ approved: 'false' }),
		getNodeParameter: (_name, fallback) => fallback,
	});

	assert.equal(approvedResult.workflowData[0][0].json.data.approved, true);
	assert.equal(approvedResult.workflowData[0][0].json.data.selectedOption, 'approve_later');
	assert.equal(approvedResult.workflowData[0][0].json.data.selectedLabel, '稍后通过');
	assert.equal(rejectedResult.workflowData[0][0].json.data.approved, false);
	assert.equal(rejectedResult.workflowData[0][0].json.data.selectedOption, 'reject');
	assert.equal(rejectedResult.workflowData[0][0].json.data.selectedLabel, '拒绝');
	assert.equal(approvedResult.workflowData[0][0].json.data.approvalMode, 'url');
	assert.match(approvedResult.workflowData[0][0].json.data.respondedAt, /^\d{4}-\d{2}-\d{2}T/);
});

test('relays an encrypted native callback and returns the verified approver', async () => {
	const token = 'native-callback-token';
	const corpId = 'ww-native-corp';
	const encodingAESKey = Buffer.alloc(32, 7).toString('base64').slice(0, 43);
	const taskId = 'n8n_hitl_native_task';
	const resumeUrl = `https://n8n.example/webhook-waiting/execution-1/node-1?approved=true&taskId=${taskId}&signature=signed`;
	const eventKey = createNativeHitlEventKey(resumeUrl, taskId, token);
	const decryptedCallback = `<xml>
		<ToUserName><![CDATA[${corpId}]]></ToUserName>
		<FromUserName><![CDATA[zhangsan]]></FromUserName>
		<CreateTime>1786528000</CreateTime>
		<MsgType><![CDATA[event]]></MsgType>
		<Event><![CDATA[template_card_event]]></Event>
		<EventKey><![CDATA[${eventKey}]]></EventKey>
		<TaskId><![CDATA[${taskId}]]></TaskId>
		<CardType><![CDATA[button_interaction]]></CardType>
		<ResponseCode><![CDATA[response-code-1]]></ResponseCode>
		<AgentID>1000002</AgentID>
	</xml>`;
	const node = { id: 'trigger-1', name: 'WeCom Trigger', type: 'weComTrigger', typeVersion: 1 };
	const crypto = new WeComCrypto(encodingAESKey, corpId);
	const encryptedCallback = crypto.encrypt(decryptedCallback, node);
	const timestamp = '1786528000';
	const nonce = 'native-nonce';
	const signature = WeComCrypto.generateSignature(token, timestamp, nonce, encryptedCallback);
	const relayRequests = [];
	const trigger = new WeComTrigger();
	const result = await trigger.webhook.call({
		getWebhookName: () => 'default',
		getCredentials: async () => ({ corpId, token, encodingAESKey }),
		getQueryData: () => ({ msg_signature: signature, timestamp, nonce }),
		getRequestObject: () => ({
			rawBody: Buffer.from(`<xml><Encrypt><![CDATA[${encryptedCallback}]]></Encrypt></xml>`),
		}),
		getNode: () => node,
		getNodeParameter: (name, fallback) =>
			({ events: ['*'], returnRawData: false, autoResumeNativeHitl: true })[name] ?? fallback,
		getNodeWebhookUrl: () => 'https://n8n.example/webhook/wecom-native',
		getInstanceBaseUrl: () => 'https://n8n.example',
		helpers: {
			httpRequest: async (options) => {
				relayRequests.push(options);
				return '已提交“通过”，无需再次操作。现在可以关闭此页面。';
			},
		},
	});

	assert.equal(relayRequests.length, 1);
	assert.equal(relayRequests[0].url, resumeUrl);
	assert.equal(relayRequests[0].disableFollowRedirect, true);
	assert.equal(result.workflowData[0][0].json.hitlResume.status, 'resumed');
	assert.equal(result.workflowData[0][0].json.hitlResume.respondedBy, 'zhangsan');
	assert.notEqual(result.webhookResponse, 'success');

	const encryptedReply = parseXML(result.webhookResponse).Encrypt;
	const reply = parseXML(crypto.decrypt(encryptedReply, node));
	assert.equal(reply.MsgType, 'update_template_card');
	assert.equal(reply.ReplaceText, '已提交：通过');

	const nativeResult = await sendAndWaitWebhook.call({
		getQueryData: () => ({ approved: 'true', taskId }),
		getNodeParameter: (name, fallback) => (name === 'approvalMode' ? 'native' : fallback),
		getCredentials: async () => ({ token }),
		getHeaderData: () => relayRequests[0].headers,
		getNode: () => node,
	});

	assert.deepEqual(nativeResult.workflowData[0][0].json.data, {
		approved: true,
		selectedOption: 'approve',
		selectedLabel: '通过',
		approvalMode: 'native',
		respondedBy: 'zhangsan',
		taskId,
		responseCode: 'response-code-1',
		respondedAt: nativeResult.workflowData[0][0].json.data.respondedAt,
	});
	assert.match(nativeResult.workflowData[0][0].json.data.respondedAt, /^\d{4}-\d{2}-\d{2}T/);
	assert.ok(relayRequests[0].headers[NATIVE_HITL_CONTEXT_HEADER]);
	assert.ok(relayRequests[0].headers[NATIVE_HITL_CONTEXT_SIGNATURE_HEADER]);
});

test('relays a native rejection and updates the card as rejected', async () => {
	const { crypto, node, relayRequests, result, resumeUrl } = await invokeNativeTriggerCallback({
		approved: false,
		userId: 'zhaoliu',
	});

	assert.equal(relayRequests[0].url, resumeUrl);
	assert.equal(result.workflowData[0][0].json.hitlResume.approved, false);
	assert.equal(result.workflowData[0][0].json.hitlResume.respondedBy, 'zhaoliu');
	const reply = parseXML(crypto.decrypt(parseXML(result.webhookResponse).Encrypt, node));
	assert.equal(reply.ReplaceText, '已提交：拒绝');
});

test('relays a custom native option and updates the card with its label', async () => {
	const { crypto, node, relayRequests, result } = await invokeNativeTriggerCallback({
		approved: false,
		userId: 'sunqi',
		selectedOption: 'transfer_to_manager',
		selectedLabel: '转交主管',
	});

	assert.equal(result.workflowData[0][0].json.hitlResume.approved, false);
	assert.equal(result.workflowData[0][0].json.hitlResume.selectedOption, 'transfer_to_manager');
	assert.equal(result.workflowData[0][0].json.hitlResume.selectedLabel, '转交主管');
	const reply = parseXML(crypto.decrypt(parseXML(result.webhookResponse).Encrypt, node));
	assert.equal(reply.ReplaceText, '已提交：转交主管');

	const context = JSON.parse(
		Buffer.from(relayRequests[0].headers[NATIVE_HITL_CONTEXT_HEADER], 'base64url').toString(
			'utf8',
		),
	);
	assert.equal(context.selectedOption, 'transfer_to_manager');
	assert.equal(context.selectedLabel, '转交主管');
});

test('rejects tampered native HITL keys and cross-origin resume URLs', () => {
	const token = 'native-token';
	const taskId = 'task-1';
	const validKey = createNativeHitlEventKey(
		`https://n8n.example/webhook-waiting/execution/node?approved=false&taskId=${taskId}&signature=signed`,
		taskId,
		token,
	);
	const tamperedKey = `${validKey.slice(0, -1)}x`;

	assert.deepEqual(
		parseNativeHitlEventKey(tamperedKey, taskId, token, 'https://n8n.example/webhook/wecom'),
		{ recognized: true, valid: false, reason: '原生审批 EventKey 签名无效' },
	);

	const crossOriginKey = createNativeHitlEventKey(
		`https://attacker.example/path?approved=true&taskId=${taskId}&signature=signed`,
		taskId,
		token,
	);
	assert.deepEqual(
		parseNativeHitlEventKey(crossOriginKey, taskId, token, 'https://n8n.example/webhook/wecom'),
		{ recognized: true, valid: false, reason: '原生审批恢复地址不可信' },
	);
});

test('does not resume a native callback twice', async () => {
	const token = 'native-duplicate-token';
	const corpId = 'ww-native-duplicate';
	const encodingAESKey = Buffer.alloc(32, 9).toString('base64').slice(0, 43);
	const taskId = 'n8n_hitl_duplicate_task';
	const resumeUrl = `https://n8n.example/webhook-waiting/execution-2/node-2?approved=false&taskId=${taskId}&signature=signed`;
	const eventKey = createNativeHitlEventKey(resumeUrl, taskId, token);
	const decryptedCallback = `<xml>
		<ToUserName><![CDATA[${corpId}]]></ToUserName>
		<FromUserName><![CDATA[lisi]]></FromUserName>
		<MsgType><![CDATA[event]]></MsgType>
		<Event><![CDATA[template_card_event]]></Event>
		<EventKey><![CDATA[${eventKey}]]></EventKey>
		<TaskId><![CDATA[${taskId}]]></TaskId>
		<ResponseCode><![CDATA[response-code-2]]></ResponseCode>
	</xml>`;
	const node = { id: 'trigger-2', name: 'WeCom Trigger', type: 'weComTrigger', typeVersion: 1 };
	const crypto = new WeComCrypto(encodingAESKey, corpId);
	const encryptedCallback = crypto.encrypt(decryptedCallback, node);
	const timestamp = '1786528001';
	const nonce = 'duplicate-nonce';
	const signature = WeComCrypto.generateSignature(token, timestamp, nonce, encryptedCallback);
	const trigger = new WeComTrigger();
	const result = await trigger.webhook.call({
		getWebhookName: () => 'default',
		getCredentials: async () => ({ corpId, token, encodingAESKey }),
		getQueryData: () => ({ msg_signature: signature, timestamp, nonce }),
		getRequestObject: () => ({
			rawBody: Buffer.from(`<xml><Encrypt><![CDATA[${encryptedCallback}]]></Encrypt></xml>`),
		}),
		getNode: () => node,
		getNodeParameter: (name, fallback) =>
			({ events: ['*'], returnRawData: false, autoResumeNativeHitl: true })[name] ?? fallback,
		getNodeWebhookUrl: () => 'https://n8n.example/webhook/wecom-native',
		getInstanceBaseUrl: () => 'https://n8n.example',
		helpers: {
			httpRequest: async () => {
				throw new Error('waiting webhook not found');
			},
		},
	});

	assert.equal(result.webhookResponse, 'success');
	assert.deepEqual(result.workflowData[0][0].json.hitlResume, {
		status: 'failed',
		reason: '这条审批已处理或已过期，无需重复操作',
		taskId,
	});
});

test('requires a signed native callback context at the waiting webhook', async () => {
	await assert.rejects(
		() =>
			sendAndWaitWebhook.call({
				getQueryData: () => ({ approved: 'true' }),
				getNodeParameter: (name, fallback) => (name === 'approvalMode' ? 'native' : fallback),
				getCredentials: async () => ({ token: 'native-token' }),
				getHeaderData: () => ({}),
				getNode: () => ({ id: 'node-1', name: 'WeCom', type: 'weComBase', typeVersion: 1 }),
			}),
		/无法确认本次企业微信操作，请返回企业微信重新选择/,
	);
});

test('binds native callback context to the signed decision, option, and task id', async () => {
	const token = 'native-context-token';
	const headers = createNativeHitlContextHeaders(
		{
			approved: true,
			selectedOption: 'transfer',
			selectedLabel: '转交主管',
			respondedBy: 'wangwu',
			responseCode: 'response-code-3',
			taskId: 'task-native-3',
		},
		token,
	);

	await assert.rejects(
		() =>
			sendAndWaitWebhook.call({
				getQueryData: () => ({
					approved: 'true',
					selectedOption: 'approve',
					selectedLabel: '通过',
					taskId: 'task-native-3',
				}),
				getNodeParameter: (name, fallback) => (name === 'approvalMode' ? 'native' : fallback),
				getCredentials: async () => ({ token }),
				getHeaderData: () => headers,
				getNode: () => ({ id: 'node-3', name: 'WeCom', type: 'weComBase', typeVersion: 1 }),
			}),
		/无法确认本次企业微信操作，请返回企业微信重新选择/,
	);
});

test('sends the signed URL card before putting execution to wait', async () => {
	const requests = [];
	let waitTill;
	const parameters = {
		recipientType: 'manual',
		touser: [],
		toparty: [],
		totag: [],
		touser_manual: 'approver1',
		toparty_manual: '',
		totag_manual: '',
		subject: '工具调用审批',
		message: '即将发送一条消息',
		customApprovalOptions: {
			options: [
				{ label: '立即执行', value: 'run_now', approved: true, style: 1 },
				{ label: '稍后处理', value: 'later', approved: false, style: 3 },
				{ label: '转交主管', value: 'transfer', approved: false, style: 2 },
			],
		},
		'options.limitWaitTime.values': {},
	};
	const inputItems = [{ json: { tool: 'sendText' } }];
	const context = {
		continueOnFail: () => false,
		getCredentials: async () => ({
			corpId: 'corp_test_hitl',
			corpSecret: 'secret',
			agentId: '1000002',
			baseUrl: 'https://qyapi.weixin.qq.com',
		}),
		getExecutionId: () => 'execution-1',
		getNode: () => ({ id: 'node-1', name: 'WeCom', type: 'weComBase', typeVersion: 1 }),
		getNodeParameter: (name, _index, defaultValue) => parameters[name] ?? defaultValue,
		getSignedResumeUrl: (query) =>
			`https://n8n.example/wait?${new URLSearchParams(query).toString()}`,
		helpers: {
			httpRequest: async (options) => {
				requests.push(options);
				if (options.url.endsWith('/cgi-bin/gettoken')) {
					return { errcode: 0, access_token: 'access-token', expires_in: 7200 };
				}
				return { errcode: 0, errmsg: 'ok', msgid: 'message-1' };
			},
		},
		putExecutionToWait: async (value) => {
			waitTill = value;
		},
	};

	const result = await executeSendAndWait.call(context, inputItems);

	assert.equal(result, inputItems);
	assert.equal(requests.length, 2);
	assert.equal(requests[1].url, 'https://qyapi.weixin.qq.com/cgi-bin/message/send');
	assert.equal(requests[1].body.touser, 'approver1');
	assert.deepEqual(
		requests[1].body.template_card.button_list.map((button) =>
			Object.fromEntries(new URL(button.url).searchParams),
		),
		[
			{
				approved: 'true',
				selectedOption: 'run_now',
				selectedLabel: '立即执行',
				optionMode: 'custom',
			},
			{
				approved: 'false',
				selectedOption: 'later',
				selectedLabel: '稍后处理',
				optionMode: 'custom',
			},
			{
				approved: 'false',
				selectedOption: 'transfer',
				selectedLabel: '转交主管',
				optionMode: 'custom',
			},
		],
	);
	assert.equal(waitTill.getUTCFullYear(), 3000);
});

test('sends native callback buttons before putting execution to wait', async () => {
	const requests = [];
	let waitTill;
	const token = 'native-send-token';
	const parameters = {
		recipientType: 'manual',
		touser: [],
		toparty: [],
		totag: [],
		touser_manual: 'approver1',
		toparty_manual: '',
		totag_manual: '',
		subject: '工具调用审批',
		message: '即将执行工具',
		approvalMode: 'native',
		customApprovalOptions: {
			options: [
				{ label: '拒绝执行', value: 'reject_now', approved: false, style: 2 },
				{ label: '立即执行', value: 'run_now', approved: true, style: 1 },
			],
		},
		'options.limitWaitTime.values': {},
	};
	const context = {
		continueOnFail: () => false,
		getCredentials: async (name) =>
			name === 'weComReceiveApi'
				? { corpId: 'corp-native', token, encodingAESKey: 'unused' }
				: {
						corpId: 'corp-native',
						corpSecret: 'secret',
						agentId: '1000002',
						baseUrl: 'https://qyapi.weixin.qq.com',
					},
		getExecutionId: () => 'execution-native',
		getNode: () => ({ id: 'node-native', name: 'WeCom', type: 'weComBase', typeVersion: 1 }),
		getNodeParameter: (name, _index, defaultValue) => parameters[name] ?? defaultValue,
		getSignedResumeUrl: (query) =>
			`https://n8n.example/webhook-waiting/execution-native/node-native?${new URLSearchParams(query).toString()}&signature=signed-${query.approved}`,
		helpers: {
			httpRequest: async (options) => {
				requests.push(options);
				if (options.url.endsWith('/cgi-bin/gettoken')) {
					return { errcode: 0, access_token: 'access-token-native', expires_in: 7200 };
				}
				return { errcode: 0, errmsg: 'ok', msgid: 'message-native' };
			},
		},
		putExecutionToWait: async (value) => {
			waitTill = value;
		},
	};

	await executeSendAndWait.call(context, [{ json: { tool: 'sendText' } }]);

	const card = requests[1].body.template_card;
	assert.equal(card.button_list[0].type, 0);
	assert.ok(card.button_list[0].key);
	assert.equal(card.button_list[0].url, undefined);
	assert.equal(
		parseNativeHitlEventKey(
			card.button_list[0].key,
			card.task_id,
			token,
			'https://n8n.example/webhook/wecom-native',
		).payload.approved,
		false,
	);
	assert.equal(
		parseNativeHitlEventKey(
			card.button_list[0].key,
			card.task_id,
			token,
			'https://n8n.example/webhook/wecom-native',
		).payload.selectedOption,
		'reject_now',
	);
	assert.equal(
		parseNativeHitlEventKey(
			card.button_list[1].key,
			card.task_id,
			token,
			'https://n8n.example/webhook/wecom-native',
		).payload.approved,
		true,
	);
	assert.equal(
		parseNativeHitlEventKey(
			card.button_list[1].key,
			card.task_id,
			token,
			'https://n8n.example/webhook/wecom-native',
		).payload.selectedOption,
		'run_now',
	);
	assert.equal(waitTill.getUTCFullYear(), 3000);
});
