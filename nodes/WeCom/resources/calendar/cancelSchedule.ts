import type { INodeProperties } from 'n8n-workflow';

const showOnlyForCancel = {
	resource: ['calendar'],
	operation: ['cancelSchedule'],
};

export const cancelScheduleDescription: INodeProperties[] = [
	{
		displayName: '日程ID',
		name: 'schedule_id',
		type: 'string',
		required: true,
		displayOptions: {
			show: showOnlyForCancel,
		},
		default: '',
		placeholder: '17c7d2bd9f20d652840f72f59e796AAA',
	},
	{
		displayName: '操作模式',
		name: 'op_mode',
		type: 'options',
		options: [
			{
				name: '默认删除所有日程',
				value: 0,
				description: '默认删除所有日程',
			},
			{
				name: '仅删除此日程',
				value: 1,
				description: '仅删除此日程',
			},
			{
				name: '删除本次及后续日程',
				value: 2,
				description: '删除本次及后续日程',
			},
		],
		default: 0,
		displayOptions: {
			show: showOnlyForCancel,
		},
		description: '操作模式。是重复日程时有效',
	},
	{
		displayName: '操作起始时间',
		name: 'op_start_time',
		type: 'dateTime',
		required: true,
		displayOptions: {
			show: {
				...showOnlyForCancel,
				op_mode: [1, 2],
			},
		},
		default: '',
		description:
			'操作起始时间。仅当操作模式是"仅删除此日程"或"删除本次及后续日程"时有效。该时间必须是重复日程的某一次开始时间',
	},
];
