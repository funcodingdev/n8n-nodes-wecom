import type { INodeProperties } from 'n8n-workflow';

import { manageMeetingroomDescription } from './manageMeetingroom';
import { manageBookingDescription } from './manageBooking';

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
		options: [
			// 会议室管理
			{
				name: '[会议室管理] 管理会议室',
				value: 'manageMeetingroom',
				action: '管理会议室',
				description: '管理会议室（添加、编辑、删除、列表）',
			},
			// 预定管理
			{
				name: '[预定管理] 管理预定',
				value: 'manageBooking',
				action: '管理预定',
				description:
					'管理会议室预定（查询、预定、通过日程/会议预定、按预定ID查详情、取消）',
			},
		],
		default: 'manageBooking',
	},
	...manageMeetingroomDescription,
	...manageBookingDescription,
];
