import type { INodeProperties } from 'n8n-workflow';

/** 学生/家长增删改与批量表单 */

const childValues: INodeProperties[] = [
	{
		displayName: '学生UserID',
		name: 'student_userid',
		type: 'string',
		default: '',
	},
	{
		displayName: '关系',
		name: 'relation',
		type: 'string',
		default: '爸爸',
		description: '家长与学生的关系，最长 32 字节（如：爸爸、妈妈、伯父）',
	},
];

export const schoolContactOpsDescription: INodeProperties[] = [
	// --- 单条学生 ---
	{
		displayName: '学生UserID',
		name: 'userid',
		type: 'string',
		required: true,
		displayOptions: {
			show: { resource: ['school'], operation: ['deleteStudent'] },
		},
		default: '',
		description: '要删除的学生 userid',
	},
	{
		displayName: '学生UserID',
		name: 'student_userid',
		type: 'string',
		required: true,
		displayOptions: {
			show: { resource: ['school'], operation: ['updateStudent'] },
		},
		default: '',
	},
	{
		displayName: '新学生UserID',
		name: 'new_student_userid',
		type: 'string',
		displayOptions: {
			show: { resource: ['school'], operation: ['updateStudent'] },
		},
		default: '',
		description: '可选，修改学生 userid',
	},
	{
		displayName: '学生姓名',
		name: 'name',
		type: 'string',
		displayOptions: {
			show: { resource: ['school'], operation: ['updateStudent'] },
		},
		default: '',
	},
	{
		displayName: '班级ID列表',
		name: 'department',
		type: 'string',
		displayOptions: {
			show: { resource: ['school'], operation: ['updateStudent'] },
		},
		default: '',
		placeholder: '1,2',
	},
	{
		displayName: '手机号',
		name: 'mobile',
		type: 'string',
		displayOptions: {
			show: {
				resource: ['school'],
				operation: ['updateStudent', 'updateParent'],
			},
		},
		default: '',
	},
	{
		displayName: '家长手机号',
		name: 'mobile',
		type: 'string',
		required: true,
		displayOptions: {
			show: { resource: ['school'], operation: ['createParent'] },
		},
		default: '',
	},
	// --- 批量学生 ---
	{
		displayName: '学生列表',
		name: 'studentsCollection',
		type: 'fixedCollection',
		displayOptions: {
			show: {
				resource: ['school'],
				operation: ['batchCreateStudent', 'batchUpdateStudent'],
			},
		},
		default: {},
		placeholder: '添加学生',
		typeOptions: { multipleValues: true },
		description: '每次最多约 100 个',
		options: [
			{
				displayName: '学生',
				name: 'students',
				values: [
					{
						displayName: '学生UserID',
						name: 'student_userid',
						type: 'string',
						default: '',
						required: true,
					},
					{
						displayName: '姓名',
						name: 'name',
						type: 'string',
						default: '',
					},
					{
						displayName: '班级ID列表',
						name: 'department',
						type: 'string',
						default: '',
						placeholder: '1,2',
					},
					{
						displayName: '手机号',
						name: 'mobile',
						type: 'string',
						default: '',
					},
					{
						displayName: '新学生UserID',
						name: 'new_student_userid',
						type: 'string',
						default: '',
						description: '仅批量更新时使用',
					},
					{
						displayName: '发起邀请',
						name: 'to_invite',
						type: 'boolean',
						default: true,
						description: '仅批量创建时使用',
					},
				],
			},
		],
	},
	{
		displayName: 'UserID列表',
		name: 'userid_list',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['school'],
				operation: ['batchDeleteStudent', 'batchDeleteParent'],
			},
		},
		default: '',
		placeholder: 'id1,id2',
		description: '逗号分隔',
	},
	// --- 家长单条 ---
	{
		displayName: '家长UserID',
		name: 'parent_userid',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['school'],
				operation: ['createParent', 'updateParent'],
			},
		},
		default: '',
	},
	{
		displayName: '家长UserID',
		name: 'userid',
		type: 'string',
		required: true,
		displayOptions: {
			show: { resource: ['school'], operation: ['deleteParent'] },
		},
		default: '',
		description: '要删除的家长 userid',
	},
	{
		displayName: '新家长UserID',
		name: 'new_parent_userid',
		type: 'string',
		displayOptions: {
			show: { resource: ['school'], operation: ['updateParent'] },
		},
		default: '',
	},
	{
		displayName: '孩子列表',
		name: 'childrenCollection',
		type: 'fixedCollection',
		displayOptions: {
			show: {
				resource: ['school'],
				operation: ['createParent', 'updateParent'],
			},
		},
		default: {},
		placeholder: '添加孩子',
		typeOptions: { multipleValues: true },
		options: [
			{
				displayName: '孩子',
				name: 'children',
				values: childValues,
			},
		],
	},
	{
		displayName: '是否发起邀请',
		name: 'to_invite',
		type: 'boolean',
		displayOptions: {
			show: { resource: ['school'], operation: ['createParent'] },
		},
		default: true,
	},
	// --- 批量家长 ---
	{
		displayName: '家长列表',
		name: 'parentsCollection',
		type: 'fixedCollection',
		displayOptions: {
			show: {
				resource: ['school'],
				operation: ['batchCreateParent', 'batchUpdateParent'],
			},
		},
		default: {},
		placeholder: '添加家长',
		typeOptions: { multipleValues: true },
		options: [
			{
				displayName: '家长',
				name: 'parents',
				values: [
					{
						displayName: '家长UserID',
						name: 'parent_userid',
						type: 'string',
						default: '',
						required: true,
					},
					{
						displayName: '手机号',
						name: 'mobile',
						type: 'string',
						default: '',
					},
					{
						displayName: '新家长UserID',
						name: 'new_parent_userid',
						type: 'string',
						default: '',
						description: '仅批量更新',
					},
					{
						displayName: '发起邀请',
						name: 'to_invite',
						type: 'boolean',
						default: true,
						description: '仅批量创建',
					},
					{
						displayName: '孩子列表',
						name: 'children_pairs',
						type: 'string',
						default: '',
						placeholder: 'stu1:爸爸,stu2:妈妈',
						description:
							'学生UserID:关系，逗号分隔；也可用下方 JSON 字段',
					},
					{
						displayName: '孩子列表JSON',
						name: 'children',
						type: 'json',
						default: '[]',
						description:
							'非空数组优先：[{ "student_userid": "s1", "relation": "爸爸" }]',
					},
				],
			},
		],
	},
];
