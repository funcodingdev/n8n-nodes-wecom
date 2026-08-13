import type { INodeProperties } from 'n8n-workflow';

const showOnly = { resource: ['wefile'], operation: ['removeFileMembers'] };

export const removeFileMembersDescription: INodeProperties[] = [
	{
		displayName: '文件ID',
		name: 'fileId',
		type: 'string',
		required: true,
		displayOptions: { show: showOnly },
		default: '',
		description: '文件或文件夹的ID<a href="https://developer.work.weixin.qq.com/document/path/93659" target="_blank">更多信息</a>',
	},
	{
		displayName: '成员UserID列表',
		name: 'member_userids',
		type: 'string',
		displayOptions: { show: showOnly },
		default: '',
		placeholder: 'zhangsan,lisi',
		description: '逗号分隔；与下方表单合并',
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
		description: '逗号分隔部门 ID；与下方表单合并',
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
		displayName: '成员列表(选择)',
		name: 'authInfoCollection',
		type: 'fixedCollection',
		displayOptions: { show: showOnly },
		default: {},
		placeholder: '添加成员',
		typeOptions: { multipleValues: true },
		description: '要移除的成员或部门；可与上方列表合并，合计 1–1000<a href="https://developer.work.weixin.qq.com/document/path/93659" target="_blank">更多信息</a>',
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
				],
			},
		],
	},
];
