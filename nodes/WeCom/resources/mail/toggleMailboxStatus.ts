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
		displayName: '成员UserID',
		name: 'userid',
		type: 'string',
		displayOptions: { show: showOnly },
		default: '',
		placeholder: 'zhangsan',
		description: '成员 userid；与公共邮箱 ID 至少填一项，同时传则只操作 userid',
	},
	{
		displayName: '公共邮箱ID',
		name: 'publicemail_id',
		type: 'number',
		displayOptions: { show: showOnly },
		default: 0,
		description: '业务邮箱/公共邮箱 ID（publicemail_id）',
	},
];
