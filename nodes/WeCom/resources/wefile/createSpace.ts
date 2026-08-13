import type { INodeProperties } from 'n8n-workflow';

const showOnly = { resource: ['wefile'], operation: ['createSpace'] };

// 权限选项（根据官方文档）
const authOptions = [
	{ name: '仅下载', value: 1, description: '只能下载文件' },
	{ name: '可预览', value: 4, description: '只能预览文件（仅专业版微盘企业可设置）' },
	{ name: '管理员', value: 7, description: '应用空间管理员（最多可指定3个，不支持设置部门）' },
];

export const createSpaceDescription: INodeProperties[] = [
	{
		displayName: '空间名称',
		name: 'spaceName',
		type: 'string',
		required: true,
		default: '',
		placeholder: '项目文档空间',
		description: '微盘空间的名称。<a href="https://developer.work.weixin.qq.com/document/path/93654" target="_blank">更多信息</a>',
		displayOptions: { show: showOnly },
	},
	{
		displayName: '成员UserID列表',
		name: 'member_userids',
		type: 'string',
		displayOptions: { show: showOnly },
		default: '',
		placeholder: 'zhangsan,lisi',
		description: '可选。逗号分隔；与下方表单合并，默认权限见「列表默认权限」',
	},
	{
		displayName: '成员(选择)',
		name: 'member_userids_selected',
		type: 'multiOptions',
		typeOptions: { loadOptionsMethod: 'getAllUsers' },
		displayOptions: { show: showOnly },
		default: [],
		description: '与上方成员 UserID 列表合并去重',
	},
	{
		displayName: '部门ID列表',
		name: 'member_departmentids',
		type: 'string',
		displayOptions: { show: showOnly },
		default: '',
		placeholder: '1,2',
		description: '可选。逗号分隔部门 ID；与下方表单合并',
	},
	{
		displayName: '部门(选择)',
		name: 'member_departmentids_selected',
		type: 'multiOptions',
		typeOptions: { loadOptionsMethod: 'getDepartments' },
		displayOptions: { show: showOnly },
		default: [],
		description: '与上方部门 ID 列表合并去重',
	},
	{
		displayName: '列表默认权限',
		name: 'member_list_auth',
		type: 'options',
		displayOptions: { show: showOnly },
		default: 1,
		options: authOptions,
		description: '仅作用于上方逗号列表；表单内每项可单独设权限',
	},
	{
		displayName: '空间其他成员信息(选择)',
		name: 'authInfoCollection',
		type: 'fixedCollection',
		typeOptions: {
			multipleValues: true,
		},
		default: {},
		description: '可选。空间的其他成员信息，可以添加成员或部门并设置权限；可与上方列表合并。<a href="https://developer.work.weixin.qq.com/document/path/93654" target="_blank">更多信息</a>',
		displayOptions: { show: showOnly },
		options: [
			{
				displayName: '成员',
				name: 'members',
				values: [
					{
						displayName: '成员类型',
						name: 'type',
						type: 'options',
						default: 1,
						options: [
							{ name: '个人', value: 1, description: '企业成员' },
							{ name: '部门', value: 2, description: '企业部门' },
						],
					},
					{
						displayName: '成员UserID',
						name: 'userid',
						type: 'string',
						required: true,
						default: '',
						placeholder: 'zhangsan',
						displayOptions: { show: { type: [1] } },
						description: '成员的 userid',
					},
					{
						displayName: '部门ID',
						name: 'departmentid',
						type: 'string',
						required: true,
						default: '',
						displayOptions: { show: { type: [2] } },
						description: '部门的departmentid',
					},
					{
						displayName: '成员权限',
						name: 'auth',
						type: 'options',
						default: 1,
						options: authOptions,
					},
				],
			},
		],
	},
	{
		displayName: '空间类型',
		name: 'spaceSubType',
		type: 'options',
		default: 0,
		description: '区分创建空间类型（可选）<a href="https://developer.work.weixin.qq.com/document/path/93654" target="_blank">更多信息</a>',
		displayOptions: { show: showOnly },
		options: [
			{
				name: '普通空间',
				value: 0,
				description: '普通微盘空间',
			},
		],
	},
];