import type { IExecuteFunctions, INodeProperties } from 'n8n-workflow';

/**
 * 消息接收人通用字段定义
 * 可在所有消息发送操作中复用
 */
export function getRecipientFields(operation: string): INodeProperties[] {
	const showCondition = {
		resource: ['message'],
		operation: [operation],
	};
	const allowAll = operation !== 'sendMiniprogramNotice';
	const recipientTypeOptions = [
		{
			name: '手动输入',
			value: 'manual',
			description: '已有成员、部门或标签 ID 时使用',
		},
		{
			name: '组合选择',
			value: 'mixed',
			description: '同时添加成员、部门和标签',
		},
		{
			name: '指定标签',
			value: 'tags',
			description: '从列表中选择标签',
		},
		{
			name: '指定部门',
			value: 'departments',
			description: '从列表中选择部门',
		},
		{
			name: '指定成员',
			value: 'users',
			description: '从列表中选择成员',
		},
	];

	if (allowAll) {
		recipientTypeOptions.unshift({
			name: '全体成员',
			value: 'all',
			description: '发送给应用可见范围内的所有成员',
		});
	}

	const recipientTypeDescription = allowAll
		? '选择哪些人会收到消息；需要同时添加不同范围时，请选择“组合选择”。'
		: '选择哪些人会收到消息；小程序通知不能发送给全体成员。';

	return [
		{
			displayName: '发送给谁',
			name: 'recipientType',
			type: 'options',
			options: recipientTypeOptions,
			default: 'users',
			displayOptions: {
				show: showCondition,
			},
			description:
				`${recipientTypeDescription}<a href="https://developer.work.weixin.qq.com/document/path/90236" target="_blank">官方文档</a>`,
		},
		{
			displayName: '选择成员',
			name: 'touser',
			type: 'multiOptions',
			typeOptions: {
				loadOptionsMethod: 'getAllUsers',
			},
			default: [],
			displayOptions: {
				show: {
					...showCondition,
					recipientType: ['users', 'mixed'],
				},
			},
			description: '选择会收到消息的成员，最多 1000 人。<a href="https://developer.work.weixin.qq.com/document/path/90236" target="_blank">官方文档</a>',
		},
		{
			displayName: '选择部门',
			name: 'toparty',
			type: 'multiOptions',
			typeOptions: {
				loadOptionsMethod: 'getDepartments',
			},
			default: [],
			displayOptions: {
				show: {
					...showCondition,
					recipientType: ['departments', 'mixed'],
				},
			},
			description: '所选部门中的成员都会收到消息，最多 100 个部门。<a href="https://developer.work.weixin.qq.com/document/path/90236" target="_blank">官方文档</a>',
		},
		{
			displayName: '选择标签',
			name: 'totag',
			type: 'multiOptions',
			typeOptions: {
				loadOptionsMethod: 'getTags',
			},
			default: [],
			displayOptions: {
				show: {
					...showCondition,
					recipientType: ['tags', 'mixed'],
				},
			},
			description: '带有所选标签的成员都会收到消息，最多 100 个标签。<a href="https://developer.work.weixin.qq.com/document/path/90236" target="_blank">官方文档</a>',
		},
		{
			displayName: '成员 ID',
			name: 'touser_manual',
			type: 'string',
			default: '',
			placeholder: '例如：user001,user002 或 @all',
			displayOptions: {
				show: {
					...showCondition,
					recipientType: ['manual'],
				},
			},
			description:
				'多个成员 ID 用逗号或 | 分隔，最多 1000 个；输入 @all 可发送给应用可见范围内的所有成员。<a href="https://developer.work.weixin.qq.com/document/path/90236" target="_blank">官方文档</a>',
		},
		{
			displayName: '部门 ID',
			name: 'toparty_manual',
			type: 'string',
			default: '',
			placeholder: '例如：1,2,3',
			displayOptions: {
				show: {
					...showCondition,
					recipientType: ['manual'],
				},
			},
			description:
				'多个部门 ID 用逗号或 | 分隔，最多 100 个。<a href="https://developer.work.weixin.qq.com/document/path/90236" target="_blank">官方文档</a>',
		},
		{
			displayName: '标签 ID',
			name: 'totag_manual',
			type: 'string',
			default: '',
			placeholder: '例如：1,2,3',
			displayOptions: {
				show: {
					...showCondition,
					recipientType: ['manual'],
				},
			},
			description:
				'多个标签 ID 用逗号或 | 分隔，最多 100 个。<a href="https://developer.work.weixin.qq.com/document/path/90236" target="_blank">官方文档</a>',
		},
	];
}

/**
 * 从节点参数中提取接收人信息
 */
export function extractRecipients(
	recipientType: string,
	touser: string | string[],
	toparty: string | string[],
	totag: string | string[],
	touser_manual?: string,
	toparty_manual?: string,
	totag_manual?: string,
): { touser?: string; toparty?: string; totag?: string } {
	const normalizeRecipientValue = (
		value: string | string[] | undefined,
		limit: number,
	): string | undefined => {
		const rawValues = Array.isArray(value) ? value : typeof value === 'string' ? [value] : [];
		const normalized = [
			...new Set(
				rawValues
					.flatMap((item) => item.split(/[|,]/))
					.map((item) => item.trim())
					.filter(Boolean),
			),
		];
		if (normalized.includes('@all')) return '@all';
		return normalized.length > 0 ? normalized.slice(0, limit).join('|') : undefined;
	};

	if (recipientType === 'all') {
		return { touser: '@all' };
	}

	if (recipientType === 'manual') {
		return {
			touser: normalizeRecipientValue(touser_manual, 1000),
			toparty: normalizeRecipientValue(toparty_manual, 100),
			totag: normalizeRecipientValue(totag_manual, 100),
		};
	}

	const result: { touser?: string; toparty?: string; totag?: string } = {};

	if (recipientType === 'mixed') {
		result.touser = normalizeRecipientValue(touser, 1000);
		result.toparty = normalizeRecipientValue(toparty, 100);
		result.totag = normalizeRecipientValue(totag, 100);
		return result;
	}

	if (recipientType === 'users') {
		result.touser = normalizeRecipientValue(touser, 1000);
	}

	if (recipientType === 'departments') {
		result.toparty = normalizeRecipientValue(toparty, 100);
	}

	if (recipientType === 'tags') {
		result.totag = normalizeRecipientValue(totag, 100);
	}

	return result;
}

/**
 * 从消息节点参数中读取接收人，兼容新版选择器和旧版直接输入字段。
 */
export function getRecipientsFromNode(
	context: IExecuteFunctions,
	itemIndex: number,
): { touser?: string; toparty?: string; totag?: string } {
	const recipientType = context.getNodeParameter('recipientType', itemIndex, null) as string | null;

	if (recipientType === null) {
		return extractRecipients(
			'manual',
			'',
			'',
			'',
			context.getNodeParameter('touser', itemIndex, '') as string,
			context.getNodeParameter('toparty', itemIndex, '') as string,
			context.getNodeParameter('totag', itemIndex, '') as string,
		);
	}

	return extractRecipients(
		recipientType,
		context.getNodeParameter('touser', itemIndex, []) as string[],
		context.getNodeParameter('toparty', itemIndex, []) as string[],
		context.getNodeParameter('totag', itemIndex, []) as string[],
		context.getNodeParameter('touser_manual', itemIndex, '') as string,
		context.getNodeParameter('toparty_manual', itemIndex, '') as string,
		context.getNodeParameter('totag_manual', itemIndex, '') as string,
	);
}
