import type { INodeProperties } from 'n8n-workflow';

const showOnly = { resource: ['meeting'], operation: ['allocateMeetingAdvancedAccount'] };

export const allocateMeetingAdvancedAccountDescription: INodeProperties[] = [
	{
		displayName: '成员UserID列表',
		name: 'vip_userids',
		type: 'string',
		displayOptions: { show: showOnly },
		default: '',
		placeholder: 'zhangsan,lisi',
		description:
			'userid_list，逗号分隔；与下方选择合并，单次最多 100 个。<a href="https://developer.work.weixin.qq.com/document/path/99508" target="_blank">官方文档</a>',
	},
	{
		displayName: '成员(选择)',
		name: 'vip_userids_selected',
		type: 'multiOptions',
		typeOptions: { loadOptionsMethod: 'getAllUsers' },
		displayOptions: { show: showOnly },
		default: [],
		description: '与上方列表合并去重，合计最多 100 个',
	},
	{
		displayName: '用户列表(兼容旧版)',
		name: 'useridCollection',
		type: 'fixedCollection',
		displayOptions: { show: showOnly },
		default: {},
		placeholder: '添加用户',
		typeOptions: { multipleValues: true },
		description: '与上方 UserID 列表合并；推荐直接用逗号列表或选择器',
		options: [
			{
				displayName: '用户',
				name: 'users',
				values: [
					{
						displayName: '用户UserID',
						name: 'userid',
						type: 'string',
						default: '',
						placeholder: 'zhangsan',
						description: '企业微信 UserID',
					},
				],
			},
		],
	},
];

