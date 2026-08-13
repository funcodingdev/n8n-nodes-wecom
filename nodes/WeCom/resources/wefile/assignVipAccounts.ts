import type { INodeProperties } from 'n8n-workflow';

const showOnly = { resource: ['wefile'], operation: ['assignVipAccounts'] };

export const assignVipAccountsDescription: INodeProperties[] = [
	{
		displayName: '成员UserID列表',
		name: 'vip_userids',
		type: 'string',
		displayOptions: { show: showOnly },
		default: '',
		placeholder: 'zhangsan,lisi',
		description:
			'要分配高级功能的成员 userid，支持逗号、中文逗号、竖线或换行分隔；与下方选择合并，单次最多 100 个',
	},
	{
		displayName: '成员列表(选择)',
		name: 'userid_list',
		type: 'multiOptions',
		displayOptions: { show: showOnly },
		typeOptions: { loadOptionsMethod: 'getAllUsers' },
		default: [],
		description: '与上方列表合并去重；单次最多 100 个',
	},
	{
		displayName: '成员列表(逐项)',
		name: 'useridList',
		type: 'fixedCollection',
		displayOptions: { show: showOnly },
		default: {},
		placeholder: '添加成员',
		typeOptions: { multipleValues: true },
		description:
			'可与上方合并；合计 1–100 个。<a href="https://developer.work.weixin.qq.com/document/path/93673" target="_blank">更多信息</a>',
		options: [
			{
				displayName: '成员',
				name: 'members',
				values: [
					{
						displayName: '成员UserID',
						name: 'userid',
						type: 'string',
						default: '',
						placeholder: 'zhangsan',
						description: '企业成员的 userid',
					},
				],
			},
		],
	},
];
