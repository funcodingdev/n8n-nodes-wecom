import type { INodeProperties } from 'n8n-workflow';
const showOnly = { resource: ['wedoc'], operation: ['manageSmartsheetAuth'] };
export const manageSmartsheetAuthDescription: INodeProperties[] = [
	{ displayName: '文档ID', name: 'docid', type: 'string', required: true, displayOptions: { show: showOnly }, default: '', description: '智能表格的docid' },
	{ displayName: '子表ID', name: 'sheet_id', type: 'string', required: true, displayOptions: { show: showOnly }, default: '', description: '子表的sheet_id' },
	{
		displayName: '启用内容权限',
		name: 'enable',
		type: 'boolean',
		required: true,
		displayOptions: { show: showOnly },
		default: false,
		description: '是否启用内容权限管理',
	},
	{
		displayName: '默认规则',
		name: 'defaultRule',
		type: 'collection',
		displayOptions: {
			show: {
				...showOnly,
				enable: [true],
			},
		},
		default: {},
		placeholder: '设置默认规则',
		description: '默认的权限规则',
		options: [
			{
				displayName: '允许查看',
				name: 'read',
				type: 'boolean',
				default: true,
				description: '默认是否允许查看',
			},
			{
				displayName: '允许编辑',
				name: 'edit',
				type: 'boolean',
				default: false,
				description: '默认是否允许编辑',
			},
		],
	},
	{
		displayName: '用户规则',
		name: 'userRulesCollection',
		type: 'fixedCollection',
		displayOptions: {
			show: {
				...showOnly,
				enable: [true],
			},
		},
		default: {},
		placeholder: '添加用户规则',
		typeOptions: { multipleValues: true },
		description: '针对特定用户的权限规则',
		options: [
			{
				displayName: '规则',
				name: 'rules',
				values: [
					{
						displayName: '成员UserID',
						name: 'userid',
						type: 'string',
						default: '',
						required: true,
						description: '企业成员的UserID',
					},
					{
						displayName: '允许查看',
						name: 'read',
						type: 'boolean',
						default: true,
					},
					{
						displayName: '允许编辑',
						name: 'edit',
						type: 'boolean',
						default: false,
					},
				],
			},
		],
	},
];
