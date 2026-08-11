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
import { meetingAdvancedOpsDescription } from './meetingAdvancedOps';

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
		// 官方文档：https://developer.work.weixin.qq.com/document/path/93626
		options: [
			// 预约会议基础管理
			{
				name: '[预约会议管理] 创建预约会议',
				value: 'createMeeting',
				action: '创建预约会议',
				description:
					'创建一个预定时间的会议。<a href="https://developer.work.weixin.qq.com/document/path/98148" target="_blank">官方文档</a>',
			},
			{
				name: '[预约会议管理] 修改预约会议',
				value: 'updateMeeting',
				action: '修改预约会议',
				description: '修改已创建的预约会议信息',
			},
			{
				name: '[预约会议管理] 取消预约会议',
				value: 'cancelMeeting',
				action: '取消预约会议',
				description: '取消已创建的预约会议',
			},
			{
				name: '[预约会议管理] 获取会议详情',
				value: 'getMeetingInfo',
				action: '获取会议详情',
				description: '获取指定会议的详细信息',
			},
			{
				name: '[预约会议管理] 获取成员会议ID列表',
				value: 'getUserMeetings',
				action: '获取成员会议列表',
				description: '获取指定成员的会议ID列表',
			},
			{
				name: '[预约会议管理] 获取会议发起记录',
				value: 'getMeetingRecords',
				action: '获取会议发起记录',
				description: '获取会议发起的历史记录',
			},
			// 高级会议管理
			{
				name: '[高级会议管理] 创建预约会议（高级）',
				value: 'createAdvancedMeeting',
				action: '创建高级会议',
				description: '创建具有高级功能的预约会议',
			},
			{
				name: '[高级会议管理] 修改预约会议（高级）',
				value: 'updateAdvancedMeeting',
				action: '修改高级会议',
				description: '修改具有高级功能的预约会议',
			},
			{
				name: '[高级会议管理] 获取会议受邀成员列表',
				value: 'getMeetingInvitees',
				action: '获取受邀成员',
				description: '获取会议的受邀成员列表',
			},
			{
				name: '[高级会议管理] 更新会议受邀成员列表',
				value: 'updateMeetingInvitees',
				action: '更新受邀成员',
				description: '更新会议的受邀成员列表',
			},
			{
				name: '[高级会议管理] 获取实时会中成员列表',
				value: 'getLiveParticipants',
				action: '获取实时会中成员',
				description: '获取当前正在会议中的成员列表',
			},
			{
				name: '[高级会议管理] 获取已参会成员列表',
				value: 'getParticipants',
				action: '获取已参会成员',
				description: '获取已经参加过会议的成员列表',
			},
			// 会中控制
			{
				name: '[会中控制] 静音成员',
				value: 'muteMember',
				action: '静音成员',
				description: '静音或取消静音会议成员',
			},
			{
				name: '[会中控制] 移出成员',
				value: 'removeMember',
				action: '移出成员',
				description: '将成员从会议中移出',
			},
			{
				name: '[会中控制] 结束会议',
				value: 'endMeeting',
				action: '结束会议',
				description: '结束正在进行的会议',
			},
			// 录制管理
			{
				name: '[录制管理] 获取会议录制列表',
				value: 'listRecordings',
				action: '获取录制列表',
				description: '获取会议录制文件列表',
			},
			{
				name: '[录制管理] 获取会议录制地址',
				value: 'getRecordingAddress',
				action: '获取录制地址',
				description: '获取会议录制文件的下载地址',
			},
			// 高级功能账号管理
			{
				name: '[高级账号管理] 分配高级功能账号',
				value: 'allocateMeetingAdvancedAccount',
				action: '分配高级账号',
				description: '为成员分配会议高级功能账号',
			},
			{
				name: '[高级账号管理] 取消高级功能账号',
				value: 'deallocateMeetingAdvancedAccount',
				action: '取消高级账号',
				description: '取消成员的会议高级功能账号',
			},
			{
				name: '[高级账号管理] 获取高级功能账号列表',
				value: 'getMeetingAdvancedAccountList',
				action: '获取高级账号列表',
				description: '获取企业的会议高级功能账号列表',
			},
			// 报名管理
			{
				name: '[报名管理] 获取会议报名配置',
				value: 'getEnrollConfig',
				action: '获取报名配置',
				description: 'enroll/get_config',
			},
			{
				name: '[报名管理] 修改会议报名配置',
				value: 'setEnrollConfig',
				action: '修改报名配置',
				description: 'enroll/set_config',
			},
			{
				name: '[报名管理] 获取会议报名信息',
				value: 'listEnroll',
				action: '获取报名信息',
				description: 'enroll/list',
			},
			{
				name: '[报名管理] 审批会议报名',
				value: 'approveEnroll',
				action: '审批报名',
				description: 'enroll/approve',
			},
			// Rooms
			{
				name: '[Rooms] 获取Rooms会议室列表',
				value: 'listRooms',
				action: 'Rooms列表',
				description: 'rooms/list',
			},
			{
				name: '[Rooms] 获取Rooms会议室详情',
				value: 'getRoomInfo',
				action: 'Rooms详情',
				description: 'rooms/get_info',
			},
			{
				name: '[Rooms] 预定Rooms会议室',
				value: 'bookRooms',
				action: '预定Rooms',
				description: 'rooms/book',
			},
			{
				name: '[Rooms] 释放Rooms会议室',
				value: 'releaseRooms',
				action: '释放Rooms',
				description: 'rooms/release',
			},
			// 会中扩展
			{
				name: '[会中控制] 设置联席主持人',
				value: 'setCohost',
				action: '设置联席主持人',
				description: 'realcontrol/set_cohost',
			},
			{
				name: '[会中控制] 会中设置(扩展)',
				value: 'realcontrolSet',
				action: '会中设置',
				description: 'realcontrol/set，JSON 扩展体',
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
	...meetingAdvancedOpsDescription,
];

