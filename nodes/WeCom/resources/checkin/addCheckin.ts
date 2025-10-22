import type { INodeProperties } from 'n8n-workflow';

const showOnlyForAddCheckin = {
	resource: ['checkin'],
	operation: ['addCheckin'],
};

export const addCheckinDescription: INodeProperties[] = [
	{
		displayName: '成员UserID',
		name: 'userid',
		type: 'string',
		required: true,
		displayOptions: {
			show: showOnlyForAddCheckin,
		},
		default: '',
		description: 'User ID of the employee',
		hint: '员工的UserID',
	},
	{
		displayName: '打卡时间',
		name: 'checkintime',
		type: 'number',
		required: true,
		displayOptions: {
			show: showOnlyForAddCheckin,
		},
		default: 0,
		description: 'Check-in time in Unix timestamp format',
		hint: '补卡的打卡时间（Unix时间戳）',
	},
	{
		displayName: '打卡类型',
		name: 'checkintype',
		type: 'options',
		required: true,
		displayOptions: {
			show: showOnlyForAddCheckin,
		},
		options: [
			{ name: '上班', value: 'OnDuty' },
			{ name: '下班', value: 'OffDuty' },
		],
		default: 'OnDuty',
		description: 'Check-in type',
		hint: '打卡类型：OnDuty-上班，OffDuty-下班',
	},
];

