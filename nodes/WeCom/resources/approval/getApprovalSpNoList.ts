import type { INodeProperties } from 'n8n-workflow';

const showOnly = { resource: ['approval'], operation: ['getApprovalSpNoList'] };

export const getApprovalSpNoListDescription: INodeProperties[] = [
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
		description: '分页游标，从0开始',
	},
	{
		displayName: '每次拉取数量',
		name: 'size',
		type: 'number',
		displayOptions: { show: showOnly },
		default: 100,
		description: '单次拉取的审批单号数量，最大100',
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
		description: '审批申请的筛选条件',
		options: [
			{
				displayName: '筛选项',
				name: 'filters',
				values: [
					{
						displayName: '筛选类型',
						name: 'key',
						type: 'options',
						default: 'template_id',
						options: [
							{ name: '模板ID', value: 'template_id' },
							{ name: '申请人UserID', value: 'creator' },
							{ name: '部门ID', value: 'department' },
							{ name: '审批单状态', value: 'sp_status' },
						],

					},
					{
						displayName: '筛选值',
						name: 'value',
						type: 'string',
						default: '',

					},
				],
			},
		],
	},
];
