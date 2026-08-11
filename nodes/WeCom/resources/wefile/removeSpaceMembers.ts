import type { INodeProperties } from 'n8n-workflow';

const showOnly = { resource: ['wefile'], operation: ['removeSpaceMembers'] };

export const removeSpaceMembersDescription: INodeProperties[] = [
	{
		displayName: '空间ID',
		name: 'spaceId',
		type: 'string',
		required: true,
		displayOptions: { show: showOnly },
		default: '',
		description: '微盘空间的ID<a href="https://developer.work.weixin.qq.com/document/path/93656" target="_blank">更多信息</a>',
	},
	{
		displayName: '成员列表',
		name: 'authInfoCollection',
		type: 'fixedCollection',
		required: true,
		displayOptions: { show: showOnly },
		default: {},
		placeholder: '添加成员',
		typeOptions: { multipleValues: true },
		description: '要移除的成员或部门<a href="https://developer.work.weixin.qq.com/document/path/93656" target="_blank">更多信息</a>',
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
						displayName: '成员',
						name: 'userid',
						type: 'options',
						required: true,
						typeOptions: {
							loadOptionsMethod: 'getAllUsers',
						},
						default: '',
						displayOptions: { show: { type: [1] } },
						description: '成员的userid',
					},
					{
						displayName: '部门',
						name: 'departmentid',
						type: 'options',
						required: true,
						typeOptions: {
							loadOptionsMethod: 'getDepartments',
						},
						default: '',
						displayOptions: { show: { type: [2] } },
						description: '部门的departmentid',
					},
				],
			},
		],
	},
];
