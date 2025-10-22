import type { INodeProperties } from 'n8n-workflow';

const showOnlyForDelete = {
	resource: ['calendar'],
	operation: ['deleteCalendar'],
};

export const deleteCalendarDescription: INodeProperties[] = [
	{
		displayName: '日历ID',
		name: 'cal_id',
		type: 'string',
		required: true,
		displayOptions: {
			show: showOnlyForDelete,
		},
		default: '',
		description: 'Calendar ID',
		hint: '日历ID',
	},
];

