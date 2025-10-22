import type { INodeProperties } from 'n8n-workflow';

import { manageMeetingroomDescription } from './manageMeetingroom';
import { manageBookingDescription } from './manageBooking';
import { getApplicationListDescription } from './getApplicationList';
import { getApplicationDetailDescription } from './getApplicationDetail';
import { setApprovalInfoDescription } from './setApprovalInfo';

const showOnlyForMeetingroom = {
	resource: ['meetingroom'],
};

export const meetingroomDescription: INodeProperties[] = [
	{
		displayName: '操作',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: showOnlyForMeetingroom,
		},
		// eslint-disable-next-line n8n-nodes-base/node-param-options-type-unsorted-items
		options: [
			{
				name: '管理会议室',
				value: 'manageMeetingroom',
				action: '管理会议室',
				description: 'Manage meeting rooms (add/edit/delete/get/list)',
			},
			{
				name: '管理预定',
				value: 'manageBooking',
				action: '管理预定',
				description: 'Manage bookings (book/cancel/get/list)',
			},
			{
				name: '批量获取申请单ID',
				value: 'getApplicationList',
				action: '批量获取申请单ID',
				description: 'Batch get application IDs',
			},
			{
				name: '获取申请单详细信息',
				value: 'getApplicationDetail',
				action: '获取申请单详细信息',
				description: 'Get application details',
			},
			{
				name: '设置审批单审批信息',
				value: 'setApprovalInfo',
				action: '设置审批单审批信息',
				description: 'Set approval information',
			},
		],
		default: 'manageBooking',
	},
	...manageMeetingroomDescription,
	...manageBookingDescription,
	...getApplicationListDescription,
	...getApplicationDetailDescription,
	...setApprovalInfoDescription,
];

