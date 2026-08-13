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
			{
				name: '智能文档',
				value: 11,
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
		description: '文件名换算长度最多 255（英文计 1，汉字计 2），节点会在超限时报错',
		typeOptions: { maxLength: 255 },
	},
	{
		displayName: '管理员UserID列表',
		name: 'admin_users_text',
		type: 'string',
		displayOptions: {
			show: showOnlyForCreate,
		},
		default: '',
		placeholder: 'zhangsan,lisi',
		description: '逗号分隔，最多 3 人；与下方选择合并。创建者默认为管理员',
	},
	{
		displayName: '管理员(选择)',
		name: 'admin_users',
		type: 'multiOptions',
		typeOptions: {
			loadOptionsMethod: 'getAllUsers',
		},
		displayOptions: {
			show: showOnlyForCreate,
		},
		default: [],
		description: '文档管理员 userid 列表，与上方合并，合计最多 3 人',
	},
	{
		displayName: '管理员 JSON',
		name: 'adminUsersJson',
		type: 'json',
		displayOptions: {
			show: showOnlyForCreate,
		},
		default: '[]',
		description:
			'可选。非空数组时与上方列表/选择合并去重，最多 3 人。支持 ["userid1"] 或 [{"userid":"userid1"}]',
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
