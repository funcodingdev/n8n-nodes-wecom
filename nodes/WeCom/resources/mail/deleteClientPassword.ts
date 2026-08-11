import type { INodeProperties } from 'n8n-workflow';

const showOnly = {
	resource: ['mail'],
	operation: ['deleteClientPassword'],
};

export const deleteClientPasswordDescription: INodeProperties[] = [
	{
		displayName: '公共邮箱ID',
		name: 'id',
		type: 'number',
		required: true,
		displayOptions: { show: showOnly },
		default: 0,
		description:
			'公共邮箱 ID。<a href="https://developer.work.weixin.qq.com/document/path/100184" target="_blank">官方文档</a>',
	},
	{
		displayName: '客户端专用密码ID',
		name: 'auth_code_id',
		type: 'number',
		required: true,
		displayOptions: { show: showOnly },
		default: 0,
		description: 'auth_code_id',
	},
];
