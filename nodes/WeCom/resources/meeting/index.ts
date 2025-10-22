import type { INodeProperties } from 'n8n-workflow';

// 预约会议基础管理
import { createMeetingDescription } from './createMeeting';
import { updateMeetingDescription } from './updateMeeting';
import { cancelMeetingDescription } from './cancelMeeting';
import { getMeetingInfoDescription } from './getMeetingInfo';
import { getUserMeetingsDescription } from './getUserMeetings';

// 会议统计管理
import { getMeetingRecordsDescription } from './getMeetingRecords';

// 预约会议高级管理
import { createAdvancedMeetingDescription } from './createAdvancedMeeting';
import { updateAdvancedMeetingDescription } from './updateAdvancedMeeting';
import { getMeetingInviteesDescription } from './getMeetingInvitees';
import { updateMeetingInviteesDescription } from './updateMeetingInvitees';
import { getLiveParticipantsDescription } from './getLiveParticipants';
import { getParticipantsDescription } from './getParticipants';

// 会中控制管理
import { muteMemberDescription } from './muteMember';
import { removeMemberDescription } from './removeMember';
import { endMeetingDescription } from './endMeeting';

// 录制管理
import { listRecordingsDescription } from './listRecordings';
import { getRecordingAddressDescription } from './getRecordingAddress';

// 高级功能账号管理
import { allocateMeetingAdvancedAccountDescription } from './allocateMeetingAdvancedAccount';
import { deallocateMeetingAdvancedAccountDescription } from './deallocateMeetingAdvancedAccount';
import { getMeetingAdvancedAccountListDescription } from './getMeetingAdvancedAccountList';

const showOnlyForMeeting = {
	resource: ['meeting'],
};

export const meetingDescription: INodeProperties[] = [
	{
		displayName: '操作',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: showOnlyForMeeting,
		},
		// eslint-disable-next-line n8n-nodes-base/node-param-options-type-unsorted-items
		options: [
			{
				name: '创建预约会议',
				value: 'createMeeting',
				action: '创建预约会议',
				description: 'Create a scheduled meeting',
			},
			{
				name: '修改预约会议',
				value: 'updateMeeting',
				action: '修改预约会议',
				description: 'Update a scheduled meeting',
			},
			{
				name: '取消预约会议',
				value: 'cancelMeeting',
				action: '取消预约会议',
				description: 'Cancel a scheduled meeting',
			},
			{
				name: '获取会议详情',
				value: 'getMeetingInfo',
				action: '获取会议详情',
				description: 'Get meeting details',
			},
			{
				name: '获取成员会议ID列表',
				value: 'getUserMeetings',
				action: '获取成员会议列表',
				description: 'Get user meeting ID list',
			},
			{
				name: '获取会议发起记录',
				value: 'getMeetingRecords',
				action: '获取会议发起记录',
				description: 'Get meeting initiation records',
			},
			{
				name: '创建预约会议（高级）',
				value: 'createAdvancedMeeting',
				action: '创建高级会议',
				description: 'Create an advanced scheduled meeting',
			},
			{
				name: '修改预约会议（高级）',
				value: 'updateAdvancedMeeting',
				action: '修改高级会议',
				description: 'Update an advanced scheduled meeting',
			},
			{
				name: '获取会议受邀成员列表',
				value: 'getMeetingInvitees',
				action: '获取受邀成员',
				description: 'Get meeting invitees list',
			},
			{
				name: '更新会议受邀成员列表',
				value: 'updateMeetingInvitees',
				action: '更新受邀成员',
				description: 'Update meeting invitees list',
			},
			{
				name: '获取实时会中成员列表',
				value: 'getLiveParticipants',
				action: '获取实时会中成员',
				description: 'Get live participants list',
			},
			{
				name: '获取已参会成员列表',
				value: 'getParticipants',
				action: '获取已参会成员',
				description: 'Get participants list',
			},
			{
				name: '静音成员',
				value: 'muteMember',
				action: '静音成员',
				description: 'Mute or unmute members',
			},
			{
				name: '移出成员',
				value: 'removeMember',
				action: '移出成员',
				description: 'Remove members from meeting',
			},
			{
				name: '结束会议',
				value: 'endMeeting',
				action: '结束会议',
				description: 'End the meeting',
			},
			{
				name: '获取会议录制列表',
				value: 'listRecordings',
				action: '获取录制列表',
				description: 'Get meeting recordings list',
			},
			{
				name: '获取会议录制地址',
				value: 'getRecordingAddress',
				action: '获取录制地址',
				description: 'Get meeting recording address',
			},
			{
				name: '分配高级功能账号',
				value: 'allocateMeetingAdvancedAccount',
				action: '分配高级账号',
				description: 'Allocate advanced account',
			},
			{
				name: '取消高级功能账号',
				value: 'deallocateMeetingAdvancedAccount',
				action: '取消高级账号',
				description: 'Deallocate advanced account',
			},
			{
				name: '获取高级功能账号列表',
				value: 'getMeetingAdvancedAccountList',
				action: '获取高级账号列表',
				description: 'Get advanced account list',
			},
		],
		default: 'createMeeting',
	},
	...createMeetingDescription,
	...updateMeetingDescription,
	...cancelMeetingDescription,
	...getMeetingInfoDescription,
	...getUserMeetingsDescription,
	...getMeetingRecordsDescription,
	...createAdvancedMeetingDescription,
	...updateAdvancedMeetingDescription,
	...getMeetingInviteesDescription,
	...updateMeetingInviteesDescription,
	...getLiveParticipantsDescription,
	...getParticipantsDescription,
	...muteMemberDescription,
	...removeMemberDescription,
	...endMeetingDescription,
	...listRecordingsDescription,
	...getRecordingAddressDescription,
	...allocateMeetingAdvancedAccountDescription,
	...deallocateMeetingAdvancedAccountDescription,
	...getMeetingAdvancedAccountListDescription,
];

