import type { INodeProperties } from 'n8n-workflow';

const showOnly = { resource: ['kf'], operation: ['getServiceState'] };

export const getServiceStateDescription: INodeProperties[] = [
	{
		displayName: '客服账号',
		name: 'open_kfid',
		type: 'options',
		typeOptions: {
			loadOptionsMethod: 'getKfAccounts',
		},
		required: true,
		displayOptions: { show: showOnly },
		default: '',
		description:
			'客服账号 ID。<a href="https://developer.work.weixin.qq.com/document/path/94669" target="_blank">官方文档</a>',
		placeholder: 'wkxxxxxxxxxxxxxxxxxx',
	},
	{
		displayName: '客户 External UserID',
		name: 'external_userid',
		type: 'string',
		required: true,
		displayOptions: { show: showOnly },
		default: '',
		description: '要查询会话状态的微信客户 external_userid。<a href="https://developer.work.weixin.qq.com/document/path/94669" target="_blank">官方文档</a>',
		placeholder: 'wmxxxxxxxxxxxxxxxxxx',
	},
];
