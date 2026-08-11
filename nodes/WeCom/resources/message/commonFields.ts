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
	const allowAll = operation !== 'sendMiniprogramNotice';
	const recipientTypeOptions = [
		{
			name: '手动输入',
			value: 'manual',
			description: '手动输入成员ID、部门ID或标签ID',
		},
		{
			name: '组合选择',
			value: 'mixed',
			description: '同时选择成员、部门和标签',
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
			description: '向应用的全部成员发送消息',
		});
	}

	const recipientTypeDescription = allowAll
		? '选择接收消息的对象类型。touser、toparty、totag不能同时为空，后面不再强调。'
		: '选择接收消息的对象类型。小程序通知不支持 @all。touser、toparty、totag不能同时为空，后面不再强调。';

	return [
		{
			displayName: '接收人类型',
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
			displayName: '接收成员',
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
			description: '指定接收消息的成员，最多支持1000个。<a href="https://developer.work.weixin.qq.com/document/path/90236" target="_blank">官方文档</a>.',
		},
		{
			displayName: '接收部门',
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
			description: '指定接收消息的部门，最多支持100个。<a href="https://developer.work.weixin.qq.com/document/path/90236" target="_blank">官方文档</a>.',
		},
		{
			displayName: '接收标签',
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
			description: '指定接收消息的标签，最多支持100个。<a href="https://developer.work.weixin.qq.com/document/path/90236" target="_blank">官方文档</a>.',
		},
		{
			displayName: '成员ID（手动输入）',
			name: 'touser_manual',
			type: 'string',
			default: '',
			placeholder: '例如：user001|user002 或 @all',
			displayOptions: {
				show: {
					...showCondition,
					recipientType: ['manual'],
				},
			},
			description:
				'可选。成员ID列表，多个接收者用 | 分隔，最多支持1000个。特殊情况：指定为 @all，则向该企业应用的全部成员发送。<a href="https://developer.work.weixin.qq.com/document/path/90236" target="_blank">官方文档</a>',
		},
		{
			displayName: '部门ID（手动输入）',
			name: 'toparty_manual',
			type: 'string',
			default: '',
			placeholder: '例如：1|2|3',
			displayOptions: {
				show: {
					...showCondition,
					recipientType: ['manual'],
				},
			},
			description:
				'可选。部门ID列表，多个接收者用 | 分隔，最多支持100个。<a href="https://developer.work.weixin.qq.com/document/path/90236" target="_blank">官方文档</a>',
		},
		{
			displayName: '标签ID（手动输入）',
			name: 'totag_manual',
			type: 'string',
			default: '',
			placeholder: '例如：1|2|3',
			displayOptions: {
				show: {
					...showCondition,
					recipientType: ['manual'],
				},
			},
			description:
				'可选。标签ID列表，多个接收者用 | 分隔，最多支持100个。<a href="https://developer.work.weixin.qq.com/document/path/90236" target="_blank">官方文档</a>',
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
	const normalizeRecipientValue = (value?: string | string[]): string | undefined => {
		if (Array.isArray(value)) {
			const trimmed = value.map((item) => item.trim()).filter(Boolean);
			return trimmed.length > 0 ? trimmed.join('|') : undefined;
		}
		if (typeof value === 'string') {
			const trimmed = value.trim();
			return trimmed ? trimmed : undefined;
		}
		return undefined;
	};

	if (recipientType === 'all') {
		return { touser: '@all' };
	}

	if (recipientType === 'manual') {
		return {
			touser: normalizeRecipientValue(touser_manual),
			toparty: normalizeRecipientValue(toparty_manual),
			totag: normalizeRecipientValue(totag_manual),
		};
	}

	const result: { touser?: string; toparty?: string; totag?: string } = {};

	if (recipientType === 'mixed') {
		result.touser = normalizeRecipientValue(touser);
		result.toparty = normalizeRecipientValue(toparty);
		result.totag = normalizeRecipientValue(totag);
		return result;
	}

	if (recipientType === 'users') {
		result.touser = normalizeRecipientValue(touser);
	}

	if (recipientType === 'departments') {
		result.toparty = normalizeRecipientValue(toparty);
	}

	if (recipientType === 'tags') {
		result.totag = normalizeRecipientValue(totag);
	}

	return result;
}
