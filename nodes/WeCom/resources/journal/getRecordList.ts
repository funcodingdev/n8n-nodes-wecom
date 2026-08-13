import type { INodeProperties } from 'n8n-workflow';

const showOnly = { resource: ['journal'], operation: ['getRecordList'] };

export const getRecordListDescription: INodeProperties[] = [
	{
		displayName: '开始时间',
		name: 'starttime',
		type: 'dateTime',
		required: true,
		displayOptions: { show: showOnly },
		default: '',
		description: '查询起始时间 starttime（Unix 秒）',
	},
	{
		displayName: '结束时间',
		name: 'endtime',
		type: 'dateTime',
		required: true,
		displayOptions: { show: showOnly },
		default: '',
		description: '查询结束时间 endtime（Unix 秒）',
	},
	{
		displayName: '游标',
		name: 'cursor',
		type: 'number',
		displayOptions: { show: showOnly },
		default: 0,
		description: '分页游标，首次请求传0',
	},
	{
		displayName: '每次拉取数量',
		name: 'limit',
		type: 'number',
		typeOptions: { minValue: 1, maxValue: 100 },
		displayOptions: { show: showOnly },
		default: 50,
		description: '每次拉取的汇报记录数量，最大100',
	},
	{
		displayName: '启用筛选',
		name: 'enableFilters',
		type: 'boolean',
		displayOptions: { show: showOnly },
		default: false,
		description: '是否启用筛选条件',
	},
	{
		displayName: '筛选条件',
		name: 'filtersCollection',
		type: 'fixedCollection',
		displayOptions: { show: { ...showOnly, enableFilters: [true] } },
		default: {},
		placeholder: '添加筛选条件',
		typeOptions: { multipleValues: true },
		description: '筛选条件列表',
		options: [
			{
				displayName: '筛选项',
				name: 'filters',
				values: [
					{
						displayName: '筛选类型',
						name: 'key',
						type: 'options',
						default: 'creator',
						options: [
							{ name: '提单人', value: 'creator' },
							{ name: '提单人所在部门', value: 'department' },
							{ name: '模板ID', value: 'template_id' },
						],
					},
					{
						displayName: '筛选值',
						name: 'value',
						type: 'string',
						default: '',
						description:
							'筛选值（提单人 UserID、部门 ID 或模板 ID），不超过 256 字节；提单人/部门可与下方选择二选一',
					},
					{
						displayName: '提单人(选择)',
						name: 'value_userid_selected',
						type: 'options',
						typeOptions: { loadOptionsMethod: 'getAllUsers' },
						default: '',
						displayOptions: { show: { key: ['creator'] } },
						description: '与上方筛选值二选一；均填写时以字符串为准',
					},
					{
						displayName: '部门(选择)',
						name: 'value_department_selected',
						type: 'options',
						typeOptions: { loadOptionsMethod: 'getDepartments' },
						default: '',
						displayOptions: { show: { key: ['department'] } },
						description: '与上方筛选值二选一；均填写时以字符串为准',
					},
				],
			},
		],
	},
];
