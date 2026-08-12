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
import {
	NATIVE_HITL_CONTEXT_HEADER,
	NATIVE_HITL_CONTEXT_SIGNATURE_HEADER,
	createNativeHitlEventKey,
	parseNativeHitlContext,
} from '../../shared/nativeHitl';
import { getRecipientFields, getRecipientsFromNode } from './commonFields';

type ApprovalMode = 'url' | 'native';

interface CustomApprovalOption {
	label?: string;
	value?: string;
	approved?: boolean;
	style?: number;
}

interface CustomApprovalOptions {
	options?: CustomApprovalOption[];
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
	approvalMode: ApprovalMode;
	options: ApprovalCardOption[];
	taskId: string;
}

interface ApprovalOption {
	label: string;
	value: string;
	approved: boolean;
	style: number;
}

interface ApprovalCardOption extends ApprovalOption {
	action: string;
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
		displayName:
			'用于 AI 工具人工审核时，标题和内容可使用 $tool.name（工具名称）与 $tool.parameters（AI 即将提交的完整参数）。审批通过后 n8n 才会执行原工具。',
		name: 'hitlToolNotice',
		type: 'notice',
		default: '',
		displayOptions: { show: showOnlyForSendAndWait },
	},
	{
		displayName: '审批方式',
		name: 'approvalMode',
		type: 'options',
		default: 'url',
		options: [
			{
				name: 'URL 按钮',
				value: 'url',
				description: '点击按钮后打开 n8n 恢复地址，无需配置企业微信接收消息回调',
			},
			{
				name: '企业微信原生回调',
				value: 'native',
				description: '在企业微信内完成操作，可返回实际审批成员，需要启用企业微信消息接收触发器',
			},
		],
		displayOptions: { show: showOnlyForSendAndWait },
	},
	{
		displayName: '审批标题',
		name: 'subject',
		type: 'string',
		default:
			"={{ $tool?.name ? 'AI 工具调用审批：' + $tool.name : '操作审批' }}",
		required: true,
		placeholder: '例如：工具调用审批',
		description: '建议不超过 36 个字；用于 AI 工具审核时会自动带入工具名称',
		displayOptions: { show: showOnlyForSendAndWait },
	},
	{
		displayName: '审批内容',
		name: 'message',
		type: 'string',
		typeOptions: { rows: 4 },
		default:
			"={{ $tool?.name ? 'AI 希望调用工具：' + $tool.name + '\\n参数：\\n' + JSON.stringify($tool.parameters, null, 2) : '请确认是否继续执行此操作。' }}",
		required: true,
		description:
			'AI 工具审核默认展示工具名称与完整参数，可按需改写；普通工作流中可直接填写审批说明',
		displayOptions: { show: showOnlyForSendAndWait },
	},
	{
		displayName: 'URL 审批按钮无法校验实际点击人，请仅发送给可信接收人，并避免转发审批链接。',
		name: 'urlApprovalNotice',
		type: 'notice',
		default: '',
		displayOptions: {
			show: {
				...showOnlyForSendAndWait,
				approvalMode: ['url'],
			},
		},
	},
	{
		displayName:
			'原生模式需要在企业微信后台配置接收消息回调，并保持一个启用了“自动恢复原生 HITL 审批”的企业微信消息接收触发器处于激活状态。',
		name: 'nativeApprovalNotice',
		type: 'notice',
		default: '',
		displayOptions: {
			show: {
				...showOnlyForSendAndWait,
				approvalMode: ['native'],
			},
		},
	},
	{
		displayName: '审批选项',
		name: 'customApprovalOptions',
		type: 'fixedCollection',
		typeOptions: { multipleValues: true },
		default: {},
		placeholder: '添加审批选项',
		description: '至少添加 1 个、最多 6 个选项；返回值必须唯一。按钮文案建议不超过 10 个字。',
		displayOptions: { show: showOnlyForSendAndWait },
		options: [
			{
				displayName: '选项',
				name: 'options',
				values: [
					{
						displayName: '按钮文案',
						name: 'label',
						type: 'string',
						default: '',
						required: true,
						placeholder: '例如：转交主管',
						description: '企业微信建议不超过 10 个字',
					},
					{
						displayName: '返回值',
						name: 'value',
						type: 'string',
						default: '',
						required: true,
						placeholder: '例如：transfer_to_manager',
						description: '工作流输出中的 selectedOption；同一张卡片内不可重复',
					},
					{
						displayName: '允许工具执行',
						name: 'approved',
						type: 'boolean',
						default: false,
						description: '开启后该选项返回 approved=true，AI Agent 才会执行受控工具',
					},
					{
						displayName: '按钮样式',
						name: 'style',
						type: 'options',
						default: 1,
						options: [
							{
								name: '主要操作（蓝底白字）',
								value: 1,
								description: '强调最重要的操作，例如通过、确认或立即执行',
							},
							{
								name: '次要操作（灰底蓝字）',
								value: 2,
								description: '用于次要但可继续的操作，例如查看详情或稍后处理',
							},
							{
								name: '危险操作（灰底红字）',
								value: 3,
								description: '用于拒绝、删除、终止等需要警示的操作',
							},
							{
								name: '普通操作（灰底黑字）',
								value: 4,
								description: '用于中性操作，例如转交、返回或关闭',
							},
						],
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

export function resolveApprovalOptions(
	customApprovalOptions: CustomApprovalOptions,
): ApprovalOption[] {
	const options = (customApprovalOptions.options ?? []).map((option) => ({
		label: option.label?.trim() ?? '',
		value: option.value?.trim() ?? '',
		approved: option.approved === true,
		style: [1, 2, 3, 4].includes(option.style ?? 1) ? (option.style ?? 1) : 1,
	}));

	if (options.length === 0) {
		throw new Error('审批至少需要 1 个选项');
	}
	if (options.length > 6) {
		throw new Error('企业微信模板卡片最多支持 6 个按钮');
	}
	if (options.some((option) => !option.label || !option.value)) {
		throw new Error('每个自定义选项都必须填写按钮文案和返回值');
	}
	if (new Set(options.map((option) => option.value)).size !== options.length) {
		throw new Error('自定义选项的返回值不可重复');
	}

	return options;
}

export function createApprovalTemplateCard(input: ApprovalCardInput): IDataObject {
	const buttonList = input.options.map<IDataObject>((option) => ({
		type: input.approvalMode === 'native' ? 0 : 1,
		text: option.label,
		style: option.style,
		...(input.approvalMode === 'native'
			? { key: option.action }
			: { url: option.action }),
	}));

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

	const customApprovalOptions = this.getNodeParameter(
		'customApprovalOptions',
		itemIndex,
		{},
	) as CustomApprovalOptions;
	const approvalMode = this.getNodeParameter('approvalMode', itemIndex, 'url') as ApprovalMode;
	let approvalOptionDefinitions: ApprovalOption[];
	try {
		approvalOptionDefinitions = resolveApprovalOptions(customApprovalOptions);
	} catch (error) {
		throw new NodeOperationError(this.getNode(), '无法配置审批选项', {
			description: (error as Error).message,
			itemIndex,
		});
	}
	const taskId = createSendAndWaitTaskId(this.getExecutionId(), this.getNode().id);
	const approvalCardOptions: ApprovalCardOption[] = approvalOptionDefinitions.map((option) => ({
		...option,
		action: this.getSignedResumeUrl({
			approved: String(option.approved),
			selectedOption: option.value,
			selectedLabel: option.label,
			optionMode: 'custom',
			...(approvalMode === 'native' ? { taskId } : {}),
		}),
	}));
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

	if (approvalMode === 'native') {
		const receiveCredentials = await this.getCredentials('weComReceiveApi');
		if (receiveCredentials.corpId !== credentials.corpId) {
			throw new NodeOperationError(this.getNode(), '消息发送与消息接收凭证的企业 ID 不一致', {
				itemIndex,
			});
		}

		try {
			for (const option of approvalCardOptions) {
				option.action = createNativeHitlEventKey(
					option.action,
					taskId,
					receiveCredentials.token as string,
				);
			}
		} catch (error) {
			throw new NodeOperationError(this.getNode(), '无法生成企业微信原生审批按钮', {
				description: (error as Error).message,
				itemIndex,
			});
		}
	}

	const templateCard = createApprovalTemplateCard({
		title: this.getNodeParameter('subject', itemIndex) as string,
		message: this.getNodeParameter('message', itemIndex) as string,
		approvalMode,
		options: approvalCardOptions,
		taskId,
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
	const query = this.getQueryData() as {
		approved?: string;
		taskId?: string;
		selectedOption?: string;
		selectedLabel?: string;
	};
	const approved = query.approved === 'true';
	const selectedOption = query.selectedOption || (approved ? 'approve' : 'reject');
	const selectedLabel = query.selectedLabel || (approved ? '通过' : '拒绝');
	const approvalMode = this.getNodeParameter('approvalMode', 'url') as ApprovalMode;
	let nativeContext;

	if (approvalMode === 'native') {
		const credentials = await this.getCredentials('weComReceiveApi');
		const headers = this.getHeaderData();
		const contextHeader = headers[NATIVE_HITL_CONTEXT_HEADER];
		const signatureHeader = headers[NATIVE_HITL_CONTEXT_SIGNATURE_HEADER];
		nativeContext = parseNativeHitlContext(
			typeof contextHeader === 'string' ? contextHeader : undefined,
			typeof signatureHeader === 'string' ? signatureHeader : undefined,
			credentials.token as string,
		);

		if (
			!nativeContext ||
			nativeContext.approved !== approved ||
			nativeContext.taskId !== query.taskId ||
			(nativeContext.selectedOption !== undefined &&
				nativeContext.selectedOption !== selectedOption) ||
			(nativeContext.selectedLabel !== undefined && nativeContext.selectedLabel !== selectedLabel)
		) {
			throw new NodeOperationError(this.getNode(), '企业微信原生审批回调上下文无效');
		}
	}

	return {
		webhookResponse: '审批结果已记录，可以关闭此页面。',
		workflowData: [
			[
				{
					json: {
						data: {
							approved,
							selectedOption,
							selectedLabel,
							approvalMode,
							...(nativeContext
								? {
										respondedBy: nativeContext.respondedBy,
										taskId: nativeContext.taskId,
										responseCode: nativeContext.responseCode,
									}
								: {}),
							respondedAt: new Date().toISOString(),
						},
					},
				},
			],
		],
	};
}
