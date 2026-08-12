import assert from 'node:assert/strict';
import test from 'node:test';

import sendAndWaitModule from '../dist/nodes/WeCom/resources/message/sendAndWait.js';
import weComBaseModule from '../dist/nodes/WeComBase/WeComBase.node.js';

const {
	calculateWaitTill,
	createApprovalTemplateCard,
	createSendAndWaitTaskId,
	executeSendAndWait,
	sendAndWaitWebhook,
} = sendAndWaitModule;
const { WeComBase } = weComBaseModule;

test('registers sendAndWait as a waiting operation on the WeCom node', () => {
	const node = new WeComBase();
	const operation = node.description.properties.find(
		(property) =>
			property.name === 'operation' &&
			property.options?.some((option) => option.value === 'sendAndWait'),
	);

	assert.ok(operation);
	assert.equal(node.description.webhooks.length, 1);
	assert.equal(node.description.webhooks[0].restartWebhook, true);
});

test('creates URL buttons for approve and reject', () => {
	const card = createApprovalTemplateCard({
		title: '工具调用审批',
		message: '准备发送消息',
		approvalType: 'double',
		approveLabel: '通过',
		disapproveLabel: '拒绝',
		approveUrl: 'https://n8n.example/webhook-waiting?approved=true',
		disapproveUrl: 'https://n8n.example/webhook-waiting?approved=false',
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

test('creates only an approve button for single approval', () => {
	const card = createApprovalTemplateCard({
		title: '审批',
		message: '内容',
		approvalType: 'single',
		approveLabel: '确认',
		disapproveLabel: '拒绝',
		approveUrl: 'https://n8n.example/approve',
		disapproveUrl: 'https://n8n.example/reject',
		taskId: 'n8n_hitl_test',
	});

	assert.equal(card.button_list.length, 1);
	assert.equal(card.button_list[0].url, 'https://n8n.example/approve');
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
		/最晚响应时间格式无效/,
	);
});

test('returns the approval shape expected by n8n HITL', async () => {
	const approvedResult = await sendAndWaitWebhook.call({
		getQueryData: () => ({ approved: 'true' }),
	});
	const rejectedResult = await sendAndWaitWebhook.call({
		getQueryData: () => ({ approved: 'false' }),
	});

	assert.equal(approvedResult.workflowData[0][0].json.data.approved, true);
	assert.equal(rejectedResult.workflowData[0][0].json.data.approved, false);
	assert.match(approvedResult.workflowData[0][0].json.data.respondedAt, /^\d{4}-\d{2}-\d{2}T/);
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
		'approvalOptions.values': { approvalType: 'double' },
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
		getSignedResumeUrl: ({ approved }) => `https://n8n.example/wait?approved=${approved}`,
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
		requests[1].body.template_card.button_list.map((button) => button.url),
		['https://n8n.example/wait?approved=false', 'https://n8n.example/wait?approved=true'],
	);
	assert.equal(waitTill.getUTCFullYear(), 3000);
});
