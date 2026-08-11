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
		typeOptions: { maxValue: 100 },
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
						default: 'reporter',
						options: [
							{ name: '汇报人', value: 'reporter' },
							{ name: '接收人', value: 'receiver' },
							{ name: '模板ID', value: 'template_id' },
						],

					},
					{
						displayName: '筛选值',
						name: 'value',
						type: 'string',
						default: '',
						description: '筛选值（UserID或模板ID）',
					},
				],
			},
		],
	},
];
