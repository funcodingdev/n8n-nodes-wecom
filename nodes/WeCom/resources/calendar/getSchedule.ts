import type { INodeProperties } from 'n8n-workflow';

const showOnlyForGet = {
	resource: ['calendar'],
	operation: ['getSchedule'],
};

export const getScheduleDescription: INodeProperties[] = [
	{
		displayName: '日程ID列表',
		name: 'schedule_id_list',
		type: 'string',
		required: true,
		displayOptions: {
			show: showOnlyForGet,
		},
		default: '',
		description: 'Schedule ID list, separated by commas',
		hint: '日程ID列表，用逗号分隔',
	},
];

