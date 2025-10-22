import type { INodeProperties } from 'n8n-workflow';

const showOnlyForManageBooking = {
	resource: ['meetingroom'],
	operation: ['manageBooking'],
};

export const manageBookingDescription: INodeProperties[] = [
	{
		displayName: '操作类型',
		name: 'action',
		type: 'options',
		required: true,
		displayOptions: {
			show: showOnlyForManageBooking,
		},
		options: [
			{ name: '预定会议室', value: 'book' },
			{ name: '取消预定', value: 'cancel' },
			{ name: '查询预定', value: 'get' },
			{ name: '查询预定列表', value: 'list' },
		],
		default: 'book',
		description: 'Meeting room booking action',
		hint: '会议室预定操作类型',
	},
	{
		displayName: '预定数据',
		name: 'bookingData',
		type: 'json',
		displayOptions: {
			show: showOnlyForManageBooking,
		},
		default: '{}',
		description: 'Booking data in JSON format',
		hint: '预定数据，JSON格式',
	},
];

