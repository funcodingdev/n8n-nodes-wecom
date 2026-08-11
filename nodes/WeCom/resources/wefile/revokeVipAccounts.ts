import type { INodeProperties } from 'n8n-workflow';

const showOnly = { resource: ['wefile'], operation: ['revokeVipAccounts'] };

export const revokeVipAccountsDescription: INodeProperties[] = [
	{
		displayName: '成员列表',
		name: 'useridList',
		type: 'fixedCollection',
		required: true,
		displayOptions: { show: showOnly },
		default: {},
		placeholder: '添加成员',
		typeOptions: { multipleValues: true },
		description: '要撤销分配高级功能的企业成员userid列表，单次操作最多选择100个<a href="https://developer.work.weixin.qq.com/document/path/93674" target="_blank">更多信息</a>',
		options: [
			{
				displayName: '成员',
				name: 'members',
				values: [
					{
						displayName: '成员',
						name: 'userid',
						type: 'options',
						typeOptions: {
							loadOptionsMethod: 'getAllUsers',
						},
						default: '',
						description: '企业成员的userid',
					},
				],
			},
		],
	},
];
