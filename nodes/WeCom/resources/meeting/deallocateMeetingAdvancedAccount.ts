import type { INodeProperties } from 'n8n-workflow';

const showOnly = { resource: ['meeting'], operation: ['deallocateMeetingAdvancedAccount'] };

export const deallocateMeetingAdvancedAccountDescription: INodeProperties[] = [
	{
		displayName: '成员UserID列表',
		name: 'vip_userids',
		type: 'string',
		displayOptions: { show: showOnly },
		default: '',
		placeholder: 'zhangsan,lisi',
		description:
			'userid_list，逗号分隔。<a href="https://developer.work.weixin.qq.com/document/path/99509" target="_blank">官方文档</a>',
	},
	{
		displayName: '用户列表(兼容旧版)',
		name: 'useridCollection',
		type: 'fixedCollection',
		displayOptions: { show: showOnly },
		default: {},
		placeholder: '添加用户',
		typeOptions: { multipleValues: true },
		description: '与上方 UserID 列表合并',
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
						description: '企业微信 UserID',
					},
				],
			},
		],
	},
];
