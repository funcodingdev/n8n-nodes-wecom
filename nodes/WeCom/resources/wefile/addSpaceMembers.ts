import type { INodeProperties } from 'n8n-workflow';

const showOnly = { resource: ['wefile'], operation: ['addSpaceMembers'] };

// 权限选项（根据官方文档）
const authOptions = [
	{ name: '仅下载', value: 1, description: '只能下载文件（仅浏览）' },
	{ name: '管理员', value: 7, description: '应用空间管理员（最多可指定3个，不支持设置部门）' },
];

export const addSpaceMembersDescription: INodeProperties[] = [
	{
		displayName: '空间ID',
		name: 'spaceId',
		type: 'string',
		required: true,
		displayOptions: { show: showOnly },
		default: '',
		description: '微盘空间的ID<a href="https://developer.work.weixin.qq.com/document/path/93655" target="_blank">更多信息</a>',
	},
	{
		displayName: '成员UserID列表',
		name: 'member_userids',
		type: 'string',
		displayOptions: { show: showOnly },
		default: '',
		placeholder: 'zhangsan,lisi',
		description: '逗号分隔；与下方表单合并，默认权限见「列表默认权限」',
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
		description: '逗号分隔部门 ID；与下方表单合并（不可为管理员权限）',
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
		displayName: '成员列表(选择)',
		name: 'authInfoCollection',
		type: 'fixedCollection',
		displayOptions: { show: showOnly },
		default: {},
		placeholder: '添加成员',
		typeOptions: { multipleValues: true },
		description: '要添加的成员或部门；可与上方列表合并，合计 1–1000<a href="https://developer.work.weixin.qq.com/document/path/93655" target="_blank">更多信息</a>',
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
						default: '',
						placeholder: 'zhangsan',
						displayOptions: { show: { type: [1] } },
						description: '成员的 userid；可与下方选择二选一',
					},
					{
						displayName: '成员(选择)',
						name: 'userid_selected',
						type: 'options',
						typeOptions: { loadOptionsMethod: 'getAllUsers' },
						default: '',
						displayOptions: { show: { type: [1] } },
						description: '与上方字符串二选一；均填写时以字符串为准',
					},
					{
						displayName: '部门',
						name: 'departmentid',
						type: 'string',
						default: '',
						displayOptions: { show: { type: [2] } },
						description: '部门的departmentid；可与下方选择二选一',
					},
					{
						displayName: '部门(选择)',
						name: 'departmentid_selected',
						type: 'options',
						typeOptions: { loadOptionsMethod: 'getDepartments' },
						default: '',
						displayOptions: { show: { type: [2] } },
						description: '与上方部门 ID 二选一；均填写时以字符串为准',
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
];
