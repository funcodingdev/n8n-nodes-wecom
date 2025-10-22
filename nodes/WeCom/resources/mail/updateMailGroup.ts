import type { INodeProperties } from 'n8n-workflow';

const showOnlyForUpdateMailGroup = {
	resource: ['mail'],
	operation: ['updateMailGroup'],
};

export const updateMailGroupDescription: INodeProperties[] = [
	{
		displayName: '群组地址',
		name: 'groupid',
		type: 'string',
		required: true,
		displayOptions: {
			show: showOnlyForUpdateMailGroup,
		},
		default: '',
		description: '群组邮箱地址',
		hint: '群组地址',
	},
	{
		displayName: '群组名称',
		name: 'groupname',
		type: 'string',
		displayOptions: {
			show: showOnlyForUpdateMailGroup,
		},
		default: '',
		description: '群组名称',
		hint: '群组名称（可选）',
	},
	{
		displayName: '成员列表',
		name: 'userlist',
		type: 'string',
		displayOptions: {
			show: showOnlyForUpdateMailGroup,
		},
		default: '',
		description: '群组成员邮箱列表，用逗号分隔',
		hint: '成员邮箱列表（可选）',
	},
	{
		displayName: '允许外部成员',
		name: 'allow_type',
		type: 'options',
		displayOptions: {
			show: showOnlyForUpdateMailGroup,
		},
		options: [
			{
				name: '仅内部成员',
				value: 0,
			},
			{
				name: '允许外部成员',
				value: 1,
			},
		],
		default: 0,
		description: '是否允许外部成员',
		hint: '是否允许外部成员',
	},
];

