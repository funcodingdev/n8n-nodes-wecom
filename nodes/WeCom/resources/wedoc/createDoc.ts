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
				value: 10,
			},
		],
		default: 3,
	},
	{
		displayName: '文档名字',
		name: 'doc_name',
		type: 'string',
		required: true,
		displayOptions: {
			show: showOnlyForCreate,
		},
		default: '',
		description: '文件名最多填255个字符, 超过255个字符会被截断',
	},
	{
		displayName: '管理员UserID列表',
		name: 'admin_users',
		type: 'multiOptions',
		typeOptions: {
			loadOptionsMethod: 'getAllUsers',
		},
		displayOptions: {
			show: showOnlyForCreate,
		},
		default: [],
		description: '文档管理员userid列表,可选择多个成员。创建者默认为管理员',
	},
	{
		displayName: '指定空间位置',
		name: 'useSpaceId',
		type: 'boolean',
		required: true,
		displayOptions: {
			show: showOnlyForCreate,
		},
		default: false,
		description: '启用后需同时指定空间ID和父目录ID',
	},
	{
		displayName: '空间ID',
		name: 'spaceid',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				...showOnlyForCreate,
				useSpaceId: [true],
			},
		},
		default: '',
	},
	{
		displayName: '父目录ID',
		name: 'fatherid',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				...showOnlyForCreate,
				useSpaceId: [true],
			},
		},
		default: '',
	},
];
