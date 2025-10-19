import type { INodeProperties } from 'n8n-workflow';

const showOnlyForCreate = {
	resource: ['wedoc'],
	operation: ['createDoc'],
};

export const createDocDescription: INodeProperties[] = [
	{
		displayName: '文档类型',
		name: 'doctype',
		type: 'options',
		required: true,
		displayOptions: {
			show: showOnlyForCreate,
		},
		options: [
			{
				name: '文档',
				value: 3,
			},
			{
				name: '表格',
				value: 4,
			},
			{
				name: '智能表格',
				value: 5,
			},
		],
		default: 3,
		description: '文档类型。3:文档 4:表格 5:智能表格。',
		hint: '文档类型',
	},
	{
		displayName: '文档名称',
		name: 'doc_name',
		type: 'string',
		required: true,
		displayOptions: {
			show: showOnlyForCreate,
		},
		default: '',
		description: '文档名称，最多255个字符。',
		hint: '文档名称',
	},
	{
		displayName: '管理员UserID列表',
		name: 'admin_users',
		type: 'string',
		displayOptions: {
			show: showOnlyForCreate,
		},
		default: '',
		description: '文档管理员userid列表，多个用逗号分隔。创建者默认为管理员。',
		hint: 'UserID列表，用逗号分隔',
	},
];
