import type { INodeProperties } from 'n8n-workflow';

const showOnly = {
	resource: ['mail'],
	operation: ['toggleMailboxStatus'],
};

export const toggleMailboxStatusDescription: INodeProperties[] = [
	{
		displayName: '操作',
		name: 'operation_type',
		type: 'options',
		required: true,
		displayOptions: { show: showOnly },
		options: [
			{ name: '启用', value: 1 },
			{ name: '禁用', value: 2 },
		],
		default: 1,
		description:
			'type：1 启用，2 禁用。<a href="https://developer.work.weixin.qq.com/document/path/95512" target="_blank">官方文档</a>',
	},
	{
		displayName: '账号类型',
		name: 'mailboxTargetType',
		type: 'options',
		required: true,
		displayOptions: { show: showOnly },
		options: [
			{ name: '成员邮箱', value: 'user' },
			{ name: '公共邮箱', value: 'public' },
		],
		default: 'user',
		description: '每次只操作一类账号',
	},
	{
		displayName: '成员UserID',
		name: 'userid',
		type: 'string',
		required: true,
		displayOptions: { show: { ...showOnly, mailboxTargetType: ['user'] } },
		default: '',
		placeholder: 'zhangsan',
		description: '成员 userid',
	},
	{
		displayName: '公共邮箱ID',
		name: 'publicemail_id',
		type: 'number',
		required: true,
		displayOptions: { show: { ...showOnly, mailboxTargetType: ['public'] } },
		typeOptions: { minValue: 1 },
		default: 1,
		description: '业务邮箱/公共邮箱 ID（publicemail_id）',
	},
];
