import { randomBytes } from 'node:crypto';
import type {
	IDataObject,
	IExecuteFunctions,
	INodeExecutionData,
	INodeProperties,
	IWebhookDescription,
	IWebhookFunctions,
	IWebhookResponseData,
} from 'n8n-workflow';
import { NodeOperationError, SEND_AND_WAIT_OPERATION, WAIT_INDEFINITELY } from 'n8n-workflow';
import { weComApiRequest } from '../../shared/transport';
import { getRecipientFields, getRecipientsFromNode } from './commonFields';

type ApprovalType = 'single' | 'double';

interface ApprovalOptions {
	approvalType?: ApprovalType;
	approveLabel?: string;
	disapproveLabel?: string;
}

interface LimitWaitTimeOptions {
	limitType?: 'afterTimeInterval' | 'atSpecifiedTime';
	resumeAmount?: number;
	resumeUnit?: 'minutes' | 'hours' | 'days';
	maxDateAndTime?: string;
}

interface ApprovalCardInput {
	title: string;
	message: string;
	approvalType: ApprovalType;
	approveLabel: string;
	disapproveLabel: string;
	approveUrl: string;
	disapproveUrl: string;
	taskId: string;
}

const showOnlyForSendAndWait = {
	resource: ['message'],
	operation: [SEND_AND_WAIT_OPERATION],
};

const limitWaitTimeProperties: INodeProperties[] = [
	{
		displayName: '限制类型',
		name: 'limitType',
		type: 'options',
		default: 'afterTimeInterval',
		options: [
			{ name: '等待一段时间', value: 'afterTimeInterval' },
			{ name: '等待到指定时间', value: 'atSpecifiedTime' },
		],
	},
	{
		displayName: '等待时长',
		name: 'resumeAmount',
		type: 'number',
		default: 1,
		typeOptions: { minValue: 0, numberPrecision: 2 },
		displayOptions: { show: { limitType: ['afterTimeInterval'] } },
	},
	{
		displayName: '时间单位',
		name: 'resumeUnit',
		type: 'options',
		default: 'hours',
		options: [
			{ name: '分钟', value: 'minutes' },
			{ name: '小时', value: 'hours' },
			{ name: '天', value: 'days' },
		],
		displayOptions: { show: { limitType: ['afterTimeInterval'] } },
	},
	{
		displayName: '最晚响应时间',
		name: 'maxDateAndTime',
		type: 'dateTime',
		default: '',
		displayOptions: { show: { limitType: ['atSpecifiedTime'] } },
	},
];

export const sendAndWaitDescription: INodeProperties[] = [
	...getRecipientFields(SEND_AND_WAIT_OPERATION),
	{
		displayName: '审批标题',
		name: 'subject',
		type: 'string',
		default: '',
		required: true,
		placeholder: '例如：工具调用审批',
		displayOptions: { show: showOnlyForSendAndWait },
	},
	{
		displayName: '审批内容',
		name: 'message',
		type: 'string',
		typeOptions: { rows: 4 },
		default: '',
		required: true,
		displayOptions: { show: showOnlyForSendAndWait },
	},
	{
		displayName: 'URL 审批按钮无法校验实际点击人，请仅发送给可信接收人，并避免转发审批链接。',
		name: 'urlApprovalNotice',
		type: 'notice',
		default: '',
		displayOptions: { show: showOnlyForSendAndWait },
	},
	{
		displayName: '审批选项',
		name: 'approvalOptions',
		type: 'fixedCollection',
		default: {},
		placeholder: '配置审批选项',
		displayOptions: { show: showOnlyForSendAndWait },
		options: [
			{
				displayName: '配置',
				name: 'values',
				values: [
					{
						displayName: '审批类型',
						name: 'approvalType',
						type: 'options',
						default: 'double',
						options: [
							{ name: '仅通过', value: 'single' },
							{ name: '通过或拒绝', value: 'double' },
						],
					},
					{
						displayName: '通过按钮文案',
						name: 'approveLabel',
						type: 'string',
						default: '通过',
					},
					{
						displayName: '拒绝按钮文案',
						name: 'disapproveLabel',
						type: 'string',
						default: '拒绝',
						displayOptions: { show: { approvalType: ['double'] } },
					},
				],
			},
		],
	},
	{
		displayName: '选项',
		name: 'options',
		type: 'collection',
		default: {},
		placeholder: '添加选项',
		displayOptions: { show: showOnlyForSendAndWait },
		options: [
			{
				displayName: '限制等待时间',
				name: 'limitWaitTime',
				type: 'fixedCollection',
				default: {},
				options: [
					{
						displayName: '配置',
						name: 'values',
						values: limitWaitTimeProperties,
					},
				],
			},
		],
	},
];

export const sendAndWaitWebhooksDescription: IWebhookDescription[] = [
	{
		name: 'default',
		httpMethod: 'GET',
		responseMode: 'onReceived',
		responseData: '',
		path: '={{ $nodeId }}',
		restartWebhook: true,
		isFullPath: true,
	},
];

export const SEND_AND_WAIT_WAITING_TOOLTIP =
	'={{ $parameter["operation"] === "sendAndWait" ? "收到审批响应后将继续执行" : "" }}';

export function createSendAndWaitTaskId(
	executionId: string,
	nodeId: string,
	timestamp = Date.now(),
	entropy = randomBytes(4).toString('hex'),
): string {
	const suffix = `_${timestamp.toString(36)}_${entropy.replace(/[^A-Za-z0-9_@-]/g, '_')}`;
	const prefix = `n8n_hitl_${nodeId}_${executionId}`.replace(/[^A-Za-z0-9_@-]/g, '_');

	return `${prefix.slice(0, Math.max(0, 128 - suffix.length))}${suffix}`.slice(0, 128);
}

export function createApprovalTemplateCard(input: ApprovalCardInput): IDataObject {
	const buttonList: IDataObject[] = [];

	if (input.approvalType === 'double') {
		buttonList.push({
			type: 1,
			text: input.disapproveLabel,
			style: 2,
			url: input.disapproveUrl,
		});
	}

	buttonList.push({
		type: 1,
		text: input.approveLabel,
		style: 1,
		url: input.approveUrl,
	});

	return {
		card_type: 'button_interaction',
		main_title: { title: input.title },
		sub_title_text: input.message,
		task_id: input.taskId,
		button_list: buttonList,
	};
}

export function calculateWaitTill(limitOptions: LimitWaitTimeOptions, now = new Date()): Date {
	if (Object.keys(limitOptions).length === 0) {
		return WAIT_INDEFINITELY;
	}

	if (limitOptions.limitType === 'atSpecifiedTime') {
		const waitTill = new Date(limitOptions.maxDateAndTime ?? '');
		if (Number.isNaN(waitTill.getTime())) {
			throw new Error('最晚响应时间格式无效');
		}
		return waitTill;
	}

	const amount = limitOptions.resumeAmount ?? 1;
	const unit = limitOptions.resumeUnit ?? 'hours';
	const unitMilliseconds = {
		minutes: 60 * 1000,
		hours: 60 * 60 * 1000,
		days: 24 * 60 * 60 * 1000,
	}[unit];

	return new Date(now.getTime() + amount * unitMilliseconds);
}

export async function executeSendAndWait(
	this: IExecuteFunctions,
	items: INodeExecutionData[],
): Promise<INodeExecutionData[]> {
	const itemIndex = 0;
	const credentials = await this.getCredentials('weComApi');
	const recipients = getRecipientsFromNode(this, itemIndex);

	if (!recipients.touser && !recipients.toparty && !recipients.totag) {
		throw new NodeOperationError(
			this.getNode(),
			'必须指定至少一个审批接收人（成员ID、部门ID或标签ID）',
			{ itemIndex },
		);
	}

	const approvalOptions = this.getNodeParameter(
		'approvalOptions.values',
		itemIndex,
		{},
	) as ApprovalOptions;
	const approvalType = approvalOptions.approvalType ?? 'double';
	const approveLabel = approvalOptions.approveLabel?.trim() || '通过';
	const disapproveLabel = approvalOptions.disapproveLabel?.trim() || '拒绝';
	const approveUrl = this.getSignedResumeUrl({ approved: 'true' });
	const disapproveUrl = this.getSignedResumeUrl({ approved: 'false' });
	const limitOptions = this.getNodeParameter(
		'options.limitWaitTime.values',
		itemIndex,
		{},
	) as LimitWaitTimeOptions;

	let waitTill: Date;
	try {
		waitTill = calculateWaitTill(limitOptions);
	} catch (error) {
		throw new NodeOperationError(this.getNode(), '无法配置审批等待时间', {
			description: (error as Error).message,
			itemIndex,
		});
	}

	const templateCard = createApprovalTemplateCard({
		title: this.getNodeParameter('subject', itemIndex) as string,
		message: this.getNodeParameter('message', itemIndex) as string,
		approvalType,
		approveLabel,
		disapproveLabel,
		approveUrl,
		disapproveUrl,
		taskId: createSendAndWaitTaskId(this.getExecutionId(), this.getNode().id),
	});

	try {
		await weComApiRequest.call(this, 'POST', '/cgi-bin/message/send', {
			...recipients,
			agentid: credentials.agentId as string,
			msgtype: 'template_card',
			template_card: templateCard,
		});
	} catch (error) {
		if (this.continueOnFail()) {
			return [{ json: { error: (error as Error).message }, pairedItem: { item: itemIndex } }];
		}
		throw error;
	}

	await this.putExecutionToWait(waitTill);
	return items;
}

export async function sendAndWaitWebhook(this: IWebhookFunctions): Promise<IWebhookResponseData> {
	const query = this.getQueryData() as { approved?: string };
	const approved = query.approved === 'true';

	return {
		webhookResponse: '审批结果已记录，可以关闭此页面。',
		workflowData: [
			[
				{
					json: {
						data: {
							approved,
							respondedAt: new Date().toISOString(),
						},
					},
				},
			],
		],
	};
}
