import type { INodeProperties } from 'n8n-workflow';

const showOnlyForUpdateRecurring = {
	resource: ['calendar'],
	operation: ['updateRecurringSchedule'],
};

export const updateRecurringScheduleDescription: INodeProperties[] = [
	{
		displayName: '日程ID',
		name: 'schedule_id',
		type: 'string',
		required: true,
		displayOptions: { show: showOnlyForUpdateRecurring },
		default: '',
	},
	{
		displayName: '主题',
		name: 'schedule_summary',
		type: 'string',
		displayOptions: { show: showOnlyForUpdateRecurring },
		default: '',
		description: 'schedule.summary',
	},
	{
		displayName: '描述',
		name: 'schedule_description',
		type: 'string',
		typeOptions: { rows: 2 },
		displayOptions: { show: showOnlyForUpdateRecurring },
		default: '',
		description: 'schedule.description',
	},
	{
		displayName: '开始时间',
		name: 'schedule_start_time',
		type: 'dateTime',
		displayOptions: { show: showOnlyForUpdateRecurring },
		default: '',
		description: 'start_time（Unix 秒）；空表示不改',
	},
	{
		displayName: '结束时间',
		name: 'schedule_end_time',
		type: 'dateTime',
		displayOptions: { show: showOnlyForUpdateRecurring },
		default: '',
		description: 'end_time（Unix 秒）；空表示不改',
	},
	{
		displayName: '地点',
		name: 'schedule_location',
		type: 'string',
		displayOptions: { show: showOnlyForUpdateRecurring },
		default: '',
		description: 'schedule.location',
	},
	{
		displayName: '日程扩展JSON',
		name: 'schedule',
		type: 'json',
		displayOptions: { show: showOnlyForUpdateRecurring },
		default: '{}',
		description: '其余 schedule 字段与上方合并，JSON 优先',
	},
	{
		displayName: '跳过参与者更新',
		name: 'skip_attendees',
		type: 'boolean',
		default: false,
		displayOptions: { show: showOnlyForUpdateRecurring },
	},
	{
		displayName: '操作模式',
		name: 'op_mode',
		type: 'options',
		options: [
			{ name: '全部修改', value: 0 },
			{ name: '仅修改此日程', value: 1 },
			{ name: '修改将来的所有日程', value: 2 },
		],
		default: 1,
		displayOptions: { show: showOnlyForUpdateRecurring },
	},
	{
		displayName: '操作起始时间',
		name: 'op_start_time',
		type: 'dateTime',
		displayOptions: {
			show: {
				...showOnlyForUpdateRecurring,
				op_mode: [1, 2],
			},
		},
		default: '',
		description: 'op_mode 为 1 或 2 时有效',
	},
];
