import type { INodeProperties } from 'n8n-workflow';

const showOnlyForGet = {
	resource: ['calendar'],
	operation: ['getCalendar'],
};

export const getCalendarDescription: INodeProperties[] = [
	{
		displayName: '日历ID列表',
		name: 'cal_id_list',
		type: 'string',
		required: true,
		displayOptions: {
			show: showOnlyForGet,
		},
		default: '',
		description: 'Calendar ID list, separated by commas',
		hint: '日历ID列表，用逗号分隔',
	},
];

