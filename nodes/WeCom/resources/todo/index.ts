import type { INodeProperties } from 'n8n-workflow';

const showOnlyForTodo = { resource: ['todo'] };

export const todoDescription: INodeProperties[] = [
	{
		displayName: '操作',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: { show: showOnlyForTodo },
		options: [
			{
				name: '[待办] 获取待办详情',
				value: 'getTodo',
				action: '获取待办详情',
				description: '获取指定待办的内容、状态与参与人',
			},
			{
				name: '[待办] 更新待办状态',
				value: 'updateTodo',
				action: '更新待办状态',
				description: '修改待办整体状态或参与人状态',
			},
		],
		default: 'getTodo',
	},
	{
		displayName: '待办ID',
		name: 'todo_id',
		type: 'string',
		required: true,
		displayOptions: { show: showOnlyForTodo },
		default: '',
		placeholder: '17c7d2bd9f20d652840f72f59e796AAA',
		description:
			'待办 ID。<a href="https://developer.work.weixin.qq.com/document/path/101524" target="_blank">官方文档</a>',
	},
	{
		displayName: '仅允许修改当前应用创建的待办；调用应用的可见范围需要包含根部门',
		name: 'updateTodoNotice',
		type: 'notice',
		displayOptions: { show: { ...showOnlyForTodo, operation: ['updateTodo'] } },
		default: '',
	},
	{
		displayName: '待办整体状态',
		name: 'todo_status',
		type: 'options',
		displayOptions: { show: { ...showOnlyForTodo, operation: ['updateTodo'] } },
		options: [
			{ name: '不修改', value: -1 },
			{ name: '完成', value: 0 },
			{ name: '进行中', value: 1 },
		],
		default: -1,
	},
	{
		displayName: '参与人',
		name: 'todo_attendees',
		type: 'fixedCollection',
		typeOptions: { multipleValues: true },
		displayOptions: { show: { ...showOnlyForTodo, operation: ['updateTodo'] } },
		default: {},
		placeholder: '添加参与人',
		description:
			'最多 20 人；不添加时不修改参与人列表。<a href="https://developer.work.weixin.qq.com/document/path/101534" target="_blank">官方文档</a>',
		options: [
			{
				name: 'attendees',
				displayName: '参与人',
				values: [
					{
						displayName: '成员UserID',
						name: 'userid',
						type: 'string',
						required: true,
						default: '',
					},
					{
						displayName: '状态',
						name: 'status',
						type: 'options',
						options: [
							{ name: '完成', value: 0 },
							{ name: '进行中', value: 1 },
						],
						default: 1,
					},
				],
			},
		],
	},
];
