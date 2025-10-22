import type { INodeProperties } from 'n8n-workflow';

const showOnlyForCreate = {
	resource: ['meeting'],
	operation: ['createMeeting'],
};

export const createMeetingDescription: INodeProperties[] = [
	{
		displayName: '会议主题',
		name: 'subject',
		type: 'string',
		required: true,
		displayOptions: {
			show: showOnlyForCreate,
		},
		default: '',
		description: 'Meeting subject',
		hint: '会议主题',
	},
	{
		displayName: '会议开始时间',
		name: 'start_time',
		type: 'number',
		required: true,
		displayOptions: {
			show: showOnlyForCreate,
		},
		default: 0,
		description: 'Meeting start time (Unix timestamp)',
		hint: '会议开始时间（Unix时间戳）',
	},
	{
		displayName: '会议结束时间',
		name: 'end_time',
		type: 'number',
		required: true,
		displayOptions: {
			show: showOnlyForCreate,
		},
		default: 0,
		description: 'Meeting end time (Unix timestamp)',
		hint: '会议结束时间（Unix时间戳）',
	},
	{
		displayName: '会议类型',
		name: 'type',
		type: 'options',
		displayOptions: {
			show: showOnlyForCreate,
		},
		options: [
			{ name: '预约会议', value: 0 },
			{ name: '快速会议', value: 1 },
		],
		default: 0,
		description: 'Meeting type',
		hint: '会议类型',
	},
	{
		displayName: '参会人员',
		name: 'attendees',
		type: 'json',
		displayOptions: {
			show: showOnlyForCreate,
		},
		default: '[{"userid":"user1"}]',
		description: 'Meeting attendees, JSON format array',
		hint: '参会人员，JSON格式数组',
	},
];

