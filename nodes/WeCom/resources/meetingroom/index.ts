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
		 
		options: [
			// 会议室管理
			{
				name: '[会议室管理] 管理会议室',
				value: 'manageMeetingroom',
				action: '管理会议室',
				description: '管理会议室（添加、编辑、删除、获取、列表）',
			},
			// 预定管理
			{
				name: '[预定管理] 管理预定',
				value: 'manageBooking',
				action: '管理预定',
				description:
					'管理会议室预定（查询、预定、通过日程/会议预定、按预定ID查详情、取消）',
			},
			// 审批管理
			{
				name: '[审批管理] 批量获取申请单ID',
				value: 'getApplicationList',
				action: '批量获取申请单ID',
				description: '批量获取会议室申请单ID列表',
			},
			{
				name: '[审批管理] 获取申请单详细信息',
				value: 'getApplicationDetail',
				action: '获取申请单详细信息',
				description: '获取会议室申请单的详细信息',
			},
			{
				name: '[审批管理] 设置审批单审批信息',
				value: 'setApprovalInfo',
				action: '设置审批单审批信息',
				description: '设置会议室审批单的审批信息',
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

