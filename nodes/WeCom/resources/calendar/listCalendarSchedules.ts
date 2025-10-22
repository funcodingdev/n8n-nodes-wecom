import type { INodeProperties } from 'n8n-workflow';

const showOnlyForList = {
	resource: ['calendar'],
	operation: ['listCalendarSchedules'],
};

export const listCalendarSchedulesDescription: INodeProperties[] = [
	{
		displayName: '日历ID',
		name: 'cal_id',
		type: 'string',
		required: true,
		displayOptions: {
			show: showOnlyForList,
		},
		default: '',
		description: 'Calendar ID',
		hint: '日历ID',
	},
	{
		displayName: '偏移量',
		name: 'offset',
		type: 'number',
		displayOptions: {
			show: showOnlyForList,
		},
		default: 0,
		description: 'Offset for pagination',
		hint: '分页偏移量',
	},
	{
		displayName: '限制数量',
		name: 'limit',
		type: 'number',
		typeOptions: {
			minValue: 1,
		},
		displayOptions: {
			show: showOnlyForList,
		},
		default: 50,
		description: 'Max number of results to return',
		hint: '返回的日程数量，最多1000',
	},
];

