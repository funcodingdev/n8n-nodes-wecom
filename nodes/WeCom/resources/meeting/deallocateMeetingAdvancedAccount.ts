import type { INodeProperties } from 'n8n-workflow';

const showOnly = { resource: ['meeting'], operation: ['deallocateMeetingAdvancedAccount'] };

export const deallocateMeetingAdvancedAccountDescription: INodeProperties[] = [
	{
		displayName: '用户列表',
		name: 'useridCollection',
		type: 'fixedCollection',
		required: true,
		displayOptions: { show: showOnly },
		default: {},
		placeholder: '添加用户',
		typeOptions: { multipleValues: true },
		description: '要收回高级账号的用户列表。<a href="https://developer.work.weixin.qq.com/document/path/99509" target="_blank">官方文档</a>',
		options: [
			{
				displayName: '用户',
				name: 'users',
				values: [
					{
						displayName: '用户ID',
						name: 'userid',
						type: 'string',
						default: '',
						required: true,
						description: '企业微信UserID',
					},
				],
			},
		],
	},
];
