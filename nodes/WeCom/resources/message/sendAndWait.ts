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
	createNativeHitlStatusText,
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
		displayName: '结束等待的方式',
		name: 'limitType',
		type: 'options',
		default: 'afterTimeInterval',
		options: [
			{
				name: '从消息发出后开始计时',
				value: 'afterTimeInterval',
				description: '适合给审批人预留固定的处理时长',
			},
			{
				name: '在指定时间结束',
				value: 'atSpecifiedTime',
				description: '适合有明确截止时间的审批',
			},
		],
	},
	{
		displayName: '等待多久',
		name: 'resumeAmount',
		type: 'number',
		default: 1,
		typeOptions: { minValue: 0, numberPrecision: 2 },
		displayOptions: { show: { limitType: ['afterTimeInterval'] } },
	},
	{
		displayName: '单位',
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
		displayName: '结束时间',
		name: 'maxDateAndTime',
		type: 'dateTime',
		default: '',
		description: '到达这个时间后，即使审批人还没有选择，工作流也会结束等待',
		displayOptions: { show: { limitType: ['atSpecifiedTime'] } },
	},
];

export const sendAndWaitDescription: INodeProperties[] = [
	...getRecipientFields(SEND_AND_WAIT_OPERATION),
	{
		displayName:
			'连接在 AI 工具前时，消息会自动显示工具名称和即将使用的参数。只有审批人选择“允许继续”的操作后，工具才会运行。',
		name: 'hitlToolNotice',
		type: 'notice',
		default: '',
		displayOptions: { show: showOnlyForSendAndWait },
	},
	{
		displayName: '审批人如何操作',
		name: 'approvalMode',
		type: 'options',
		default: 'url',
		options: [
			{
				name: '打开结果页（推荐）',
				value: 'url',
				description: '审批人选择卡片操作后，会打开结果页；设置简单，适合大多数场景',
			},
			{
				name: '直接在企业微信中选择',
				value: 'native',
				description: '审批人无需离开企业微信，并可记录操作成员；使用前需要配置消息接收',
			},
		],
		displayOptions: { show: showOnlyForSendAndWait },
	},
	{
		displayName: '消息标题',
		name: 'subject',
		type: 'string',
		default: "={{ $tool?.name ? '请确认 AI 操作：' + $tool.name : '请确认此操作' }}",
		required: true,
		placeholder: '例如：确认发送客户通知',
		description: '告诉审批人需要确认什么，建议不超过 36 个字',
		displayOptions: { show: showOnlyForSendAndWait },
	},
	{
		displayName: '给审批人的说明',
		name: 'message',
		type: 'string',
		typeOptions: { rows: 4 },
		default:
			"={{ $tool?.name ? 'AI 准备执行：' + $tool.name + '\\n请确认是否允许继续。\\n\\n操作内容：\\n' + JSON.stringify($tool.parameters, null, 2) : '请查看操作内容，并选择如何处理。' }}",
		required: true,
		description: '说明操作的目的、内容和可能影响，帮助审批人作出判断',
		displayOptions: { show: showOnlyForSendAndWait },
	},
	{
		displayName:
			'任何拿到确认链接的人都可以提交选择。请只发送给可信成员，并提醒审批人不要转发。',
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
			'审批人可以直接在企业微信中完成选择，并记录其成员身份。提交后，同一张卡片会向所有接收人显示处理结果并停止重复点击。使用前，请先激活“企业微信消息接收”触发器，并开启“自动处理企业微信内的审批选择”。',
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
		displayName: '审批人可选操作',
		name: 'customApprovalOptions',
		type: 'fixedCollection',
		typeOptions: { multipleValues: true },
		default: {},
		placeholder: '添加一个操作',
		description: '这些操作会显示为卡片按钮。至少添加 1 个、最多 6 个。',
		displayOptions: { show: showOnlyForSendAndWait },
		options: [
			{
				displayName: '操作',
				name: 'options',
				values: [
					{
						displayName: '按钮上显示的文字',
						name: 'label',
						type: 'string',
						default: '',
						required: true,
						placeholder: '例如：允许执行',
						description: '让审批人一眼看懂选择后的结果，建议不超过 10 个字',
					},
					{
						displayName: '工作流返回值',
						name: 'value',
						type: 'string',
						default: '',
						required: true,
						placeholder: '例如：allow',
						description: '审批人选择后写入 selectedOption，供后续节点判断；每个操作必须不同',
					},
					{
						displayName: '选择后允许继续执行',
						name: 'approved',
						type: 'boolean',
						default: false,
						description: '开启后会继续执行受保护的 AI 工具；关闭后会停止本次工具调用',
					},
					{
						displayName: '按钮外观',
						name: 'style',
						type: 'options',
						default: 1,
						options: [
							{
								name: '主要选择（蓝底白字）',
								value: 1,
								description: '最醒目，适合“允许”“确认”“立即执行”等主要选择',
							},
							{
								name: '次要选择（灰底蓝字）',
								value: 2,
								description: '较温和，适合“稍后处理”“查看详情”等补充选择',
							},
							{
								name: '需要警示（灰底红字）',
								value: 3,
								description: '突出风险，适合“拒绝”“终止”“删除”等不可继续的选择',
							},
							{
								name: '普通选择（灰底黑字）',
								value: 4,
								description: '保持中性，适合“转交”“返回”“关闭”等普通选择',
							},
						],
					},
				],
			},
		],
	},
	{
		displayName: '更多设置',
		name: 'options',
		type: 'collection',
		default: {},
		placeholder: '添加设置',
		displayOptions: { show: showOnlyForSendAndWait },
		options: [
			{
				displayName: '设置审批期限',
				name: 'limitWaitTime',
				type: 'fixedCollection',
				default: {},
				options: [
					{
						displayName: '审批期限',
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
	'={{ $parameter["operation"] === "sendAndWait" ? "正在等待审批人选择" : "" }}';

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
		throw new Error('请至少添加 1 个审批人可选操作');
	}
	if (options.length > 6) {
		throw new Error('审批人可选操作最多添加 6 个');
	}
	if (options.some((option) => !option.label || !option.value)) {
		throw new Error('请为每个操作填写按钮文字和工作流返回值');
	}
	if (new Set(options.map((option) => option.value)).size !== options.length) {
		throw new Error('每个操作的工作流返回值必须不同');
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
			throw new Error('请选择有效的结束时间');
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
			'请选择至少一位审批消息接收人',
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
		throw new NodeOperationError(this.getNode(), '请完善审批人可选操作', {
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
		throw new NodeOperationError(this.getNode(), '请检查审批期限', {
			description: (error as Error).message,
			itemIndex,
		});
	}

	if (approvalMode === 'native') {
		const receiveCredentials = await this.getCredentials('weComReceiveApi');
		if (receiveCredentials.corpId !== credentials.corpId) {
			throw new NodeOperationError(this.getNode(), '请选择属于同一个企业的发送和接收凭证', {
				description: '直接在企业微信中选择时，发送消息和接收选择必须使用同一个企业 ID',
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
			throw new NodeOperationError(this.getNode(), '无法创建企业微信内的操作按钮', {
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
	let cardUpdate: IDataObject | undefined;

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
			throw new NodeOperationError(
				this.getNode(),
				'无法确认本次企业微信操作，请返回企业微信重新选择',
			);
		}

		if (!nativeContext.responseCode) {
			cardUpdate = {
				status: 'failed',
				scope: 'allRecipients',
				reason: '企业微信未返回卡片更新凭据',
			};
		} else {
			try {
				const sendCredentials = await this.getCredentials('weComApi');
				await weComApiRequest.call(this, 'POST', '/cgi-bin/message/update_template_card', {
					atall: 1,
					agentid: sendCredentials.agentId as string,
					response_code: nativeContext.responseCode,
					button: {
						replace_name: createNativeHitlStatusText(selectedLabel),
					},
				});
				cardUpdate = {
					status: 'updated',
					scope: 'allRecipients',
				};
			} catch (error) {
				cardUpdate = {
					status: 'failed',
					scope: 'allRecipients',
					reason: (error as Error).message,
				};
			}
		}
	}

	return {
		webhookResponse: `已提交“${selectedLabel}”，无需再次操作。现在可以关闭此页面。`,
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
							...(cardUpdate ? { cardUpdate } : {}),
						},
					},
				},
			],
		],
	};
}
