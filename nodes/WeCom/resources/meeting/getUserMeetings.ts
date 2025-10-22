import type { INodeProperties } from 'n8n-workflow';

const showOnlyForGet = {
	resource: ['meeting'],
	operation: ['getUserMeetings'],
};

export const getUserMeetingsDescription: INodeProperties[] = [
	{
		displayName: '用户ID',
		name: 'userid',
		type: 'string',
		required: true,
		displayOptions: {
			show: showOnlyForGet,
		},
		default: '',
		description: 'User ID',
		hint: '用户ID',
	},
	{
		displayName: '游标',
		name: 'cursor',
		type: 'string',
		displayOptions: {
			show: showOnlyForGet,
		},
		default: '',
		description: 'Pagination cursor',
		hint: '分页游标',
	},
	{
		displayName: '限制数量',
		name: 'limit',
		type: 'number',
		displayOptions: {
			show: showOnlyForGet,
		},
		default: 20,
		description: 'Number of meetings to return',
		hint: '返回的会议数量',
	},
];

