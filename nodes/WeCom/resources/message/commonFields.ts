import type { INodeProperties } from 'n8n-workflow';

/**
 * 消息接收人通用字段定义
 * 可在所有消息发送操作中复用
 */
export function getRecipientFields(operation: string): INodeProperties[] {
	const showCondition = {
		resource: ['message'],
		operation: [operation],
	};

	return [
		{
			displayName: '接收人类型',
			name: 'recipientType',
			type: 'options',
			options: [
				{
					name: '全体成员',
					value: 'all',
				},
				{
					name: '手动输入',
					value: 'manual',
				},
				{
					name: '指定标签',
					value: 'tags',
				},
				{
					name: '指定部门',
					value: 'departments',
				},
				{
					name: '指定成员',
					value: 'users',
				},
			],
			default: 'users',
			displayOptions: {
				show: showCondition,
			},
			description: '选择接收人的方式',
		},
		{
			displayName: '成员 Names or IDs',
			name: 'touser',
			type: 'multiOptions',
			typeOptions: {
				loadOptionsMethod: 'getAllUsers',
			},
			default: [],
			displayOptions: {
				show: {
					...showCondition,
					recipientType: ['users'],
				},
			},
			hint: '成员ID列表（最多支持1000个）',
			description:
				'Choose from the list, or specify IDs using an <a href="https://docs.n8n.io/code/expressions/">expression</a>',
		},
		{
			displayName: '部门 Names or IDs',
			name: 'toparty',
			type: 'multiOptions',
			typeOptions: {
				loadOptionsMethod: 'getDepartments',
			},
			default: [],
			displayOptions: {
				show: {
					...showCondition,
					recipientType: ['departments'],
				},
			},
			hint: '部门ID列表（最多支持100个）',
			description:
				'Choose from the list, or specify IDs using an <a href="https://docs.n8n.io/code/expressions/">expression</a>',
		},
		{
			displayName: '标签 Names or IDs',
			name: 'totag',
			type: 'multiOptions',
			typeOptions: {
				loadOptionsMethod: 'getTags',
			},
			default: [],
			displayOptions: {
				show: {
					...showCondition,
					recipientType: ['tags'],
				},
			},
			hint: '标签ID列表（最多支持100个）',
			description:
				'Choose from the list, or specify IDs using an <a href="https://docs.n8n.io/code/expressions/">expression</a>',
		},
		{
			displayName: '手动输入接收人',
			name: 'touser_manual',
			type: 'string',
			default: '',
			displayOptions: {
				show: {
					...showCondition,
					recipientType: ['manual'],
				},
			},
			description:
				'成员ID列表（多个接收者用 | 分隔，最多支持1000个）。特殊情况：指定为 @all，则向该企业应用的全部成员发送',
		},
		{
			displayName: '部门ID（手动输入）',
			name: 'toparty_manual',
			type: 'string',
			default: '',
			displayOptions: {
				show: {
					...showCondition,
					recipientType: ['manual'],
				},
			},
			description: '部门ID列表，多个接收者用 | 分隔，最多支持100个',
		},
		{
			displayName: '标签ID（手动输入）',
			name: 'totag_manual',
			type: 'string',
			default: '',
			displayOptions: {
				show: {
					...showCondition,
					recipientType: ['manual'],
				},
			},
			description: '标签ID列表，多个接收者用 | 分隔，最多支持100个',
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
	if (recipientType === 'all') {
		return { touser: '@all' };
	}

	if (recipientType === 'manual') {
		return {
			touser: touser_manual || undefined,
			toparty: toparty_manual || undefined,
			totag: totag_manual || undefined,
		};
	}

	const result: { touser?: string; toparty?: string; totag?: string } = {};

	if (recipientType === 'users' && Array.isArray(touser) && touser.length > 0) {
		result.touser = touser.join('|');
	}

	if (recipientType === 'departments' && Array.isArray(toparty) && toparty.length > 0) {
		result.toparty = toparty.join('|');
	}

	if (recipientType === 'tags' && Array.isArray(totag) && totag.length > 0) {
		result.totag = totag.join('|');
	}

	return result;
}
