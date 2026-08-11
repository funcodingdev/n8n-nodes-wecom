import type { INodeProperties } from 'n8n-workflow';
import type { ExtraHttpOp } from '../../shared/extraHttpOp';
import { extraHttpOpOptions } from '../../shared/extraHttpOp';

/** 文档有、此前节点未封装的 meeting 相关 HTTP 接口（一等操作） */
export const meetingExtraHttpOps: ExtraHttpOp[] = [
	{ id: 'advancedLayoutAdd', name: '[高级布局] 添加高级布局', action: '添加高级布局', description: 'POST /cgi-bin/meeting/advanced_layout/add', path: '/cgi-bin/meeting/advanced_layout/add', method: 'POST' },
	{ id: 'advancedLayoutApply', name: '[高级布局] 应用高级布局', action: '应用高级布局', description: 'POST /cgi-bin/meeting/advanced_layout/apply', path: '/cgi-bin/meeting/advanced_layout/apply', method: 'POST' },
	{ id: 'advancedLayoutBatchDelete', name: '[高级布局] 批量删除高级布局', action: '批量删除高级布局', description: 'POST /cgi-bin/meeting/advanced_layout/batch_delete', path: '/cgi-bin/meeting/advanced_layout/batch_delete', method: 'POST' },
	{ id: 'advancedLayoutGetUserLayout', name: '[高级布局] 获取用户高级布局', action: '获取用户高级布局', description: 'POST /cgi-bin/meeting/advanced_layout/get_user_layout', path: '/cgi-bin/meeting/advanced_layout/get_user_layout', method: 'POST' },
	{ id: 'advancedLayoutList', name: '[高级布局] 高级布局列表', action: '高级布局列表', description: 'POST /cgi-bin/meeting/advanced_layout/list', path: '/cgi-bin/meeting/advanced_layout/list', method: 'POST' },
	{ id: 'advancedLayoutUpdate', name: '[高级布局] 更新高级布局', action: '更新高级布局', description: 'POST /cgi-bin/meeting/advanced_layout/update', path: '/cgi-bin/meeting/advanced_layout/update', method: 'POST' },
	{ id: 'checkDeviceInMeeting', name: '[会议补全] meeting/check_device_in_meeting', action: 'meeting/check_device_in_meeting', description: 'POST /cgi-bin/meeting/check_device_in_meeting', path: '/cgi-bin/meeting/check_device_in_meeting', method: 'POST' },
	{ id: 'createCustomerShortUrl', name: '[会议补全] meeting/create_customer_short_url', action: 'meeting/create_customer_short_url', description: 'POST /cgi-bin/meeting/create_customer_short_url', path: '/cgi-bin/meeting/create_customer_short_url', method: 'POST' },
	{ id: 'enrollDelete', name: '[报名] enroll/delete', action: 'enroll/delete', description: 'POST /cgi-bin/meeting/enroll/delete', path: '/cgi-bin/meeting/enroll/delete', method: 'POST' },
	{ id: 'enrollImport', name: '[报名] enroll/import', action: 'enroll/import', description: 'POST /cgi-bin/meeting/enroll/import', path: '/cgi-bin/meeting/enroll/import', method: 'POST' },
	{ id: 'enrollQueryByTmpOpenid', name: '[报名] enroll/query_by_tmp_openid', action: 'enroll/query_by_tmp_openid', description: 'POST /cgi-bin/meeting/enroll/query_by_tmp_openid', path: '/cgi-bin/meeting/enroll/query_by_tmp_openid', method: 'POST' },
	{ id: 'getCustomerShortUrl', name: '[会议补全] meeting/get_customer_short_url', action: 'meeting/get_customer_short_url', description: 'POST /cgi-bin/meeting/get_customer_short_url', path: '/cgi-bin/meeting/get_customer_short_url', method: 'POST' },
	{ id: 'getGuests', name: '[会议补全] meeting/get_guests', action: 'meeting/get_guests', description: 'POST /cgi-bin/meeting/get_guests', path: '/cgi-bin/meeting/get_guests', method: 'POST' },
	{ id: 'getQuality', name: '[会议补全] meeting/get_quality', action: 'meeting/get_quality', description: 'POST /cgi-bin/meeting/get_quality', path: '/cgi-bin/meeting/get_quality', method: 'POST' },
	{ id: 'layoutAdd', name: '[布局] layout/add', action: 'layout/add', description: 'POST /cgi-bin/meeting/layout/add', path: '/cgi-bin/meeting/layout/add', method: 'POST' },
	{ id: 'layoutAddBackground', name: '[布局] layout/add_background', action: 'layout/add_background', description: 'POST /cgi-bin/meeting/layout/add_background', path: '/cgi-bin/meeting/layout/add_background', method: 'POST' },
	{ id: 'layoutBatchDeleteBackground', name: '[布局] layout/batch_delete_background', action: 'layout/batch_delete_background', description: 'POST /cgi-bin/meeting/layout/batch_delete_background', path: '/cgi-bin/meeting/layout/batch_delete_background', method: 'POST' },
	{ id: 'layoutDeleteBackground', name: '[布局] layout/delete_background', action: 'layout/delete_background', description: 'POST /cgi-bin/meeting/layout/delete_background', path: '/cgi-bin/meeting/layout/delete_background', method: 'POST' },
	{ id: 'layoutListBackground', name: '[布局] layout/list_background', action: 'layout/list_background', description: 'POST /cgi-bin/meeting/layout/list_background', path: '/cgi-bin/meeting/layout/list_background', method: 'POST' },
	{ id: 'layoutSetDefaultBackground', name: '[布局] layout/set_default_background', action: 'layout/set_default_background', description: 'POST /cgi-bin/meeting/layout/set_default_background', path: '/cgi-bin/meeting/layout/set_default_background', method: 'POST' },
	{ id: 'layoutUpdate', name: '[布局] layout/update', action: 'layout/update', description: 'POST /cgi-bin/meeting/layout/update', path: '/cgi-bin/meeting/layout/update', method: 'POST' },
	{ id: 'mraHangup', name: '[MRA] mra/hangup', action: 'mra/hangup', description: 'POST /cgi-bin/meeting/mra/hangup', path: '/cgi-bin/meeting/mra/hangup', method: 'POST' },
	{ id: 'mraQueryStatus', name: '[MRA] mra/query_status', action: 'mra/query_status', description: 'POST /cgi-bin/meeting/mra/query_status', path: '/cgi-bin/meeting/mra/query_status', method: 'POST' },
	{ id: 'mraSetDefaultLayout', name: '[MRA] mra/set_default_layout', action: 'mra/set_default_layout', description: 'POST /cgi-bin/meeting/mra/set_default_layout', path: '/cgi-bin/meeting/mra/set_default_layout', method: 'POST' },
	{ id: 'mraSetRaiseHand', name: '[MRA] mra/set_raise_hand', action: 'mra/set_raise_hand', description: 'POST /cgi-bin/meeting/mra/set_raise_hand', path: '/cgi-bin/meeting/mra/set_raise_hand', method: 'POST' },
	{ id: 'phoneGetTmpOpenid', name: '[电话入会] phone/get_tmp_openid', action: 'phone/get_tmp_openid', description: 'POST /cgi-bin/meeting/phone/get_tmp_openid', path: '/cgi-bin/meeting/phone/get_tmp_openid', method: 'POST' },
	{ id: 'pollCreateTheme', name: '[投票] poll/create_theme', action: 'poll/create_theme', description: 'POST /cgi-bin/meeting/poll/create_theme', path: '/cgi-bin/meeting/poll/create_theme', method: 'POST' },
	{ id: 'pollDelete', name: '[投票] poll/delete', action: 'poll/delete', description: 'POST /cgi-bin/meeting/poll/delete', path: '/cgi-bin/meeting/poll/delete', method: 'POST' },
	{ id: 'pollFinish', name: '[投票] poll/finish', action: 'poll/finish', description: 'POST /cgi-bin/meeting/poll/finish', path: '/cgi-bin/meeting/poll/finish', method: 'POST' },
	{ id: 'pollGetThemeInfo', name: '[投票] poll/get_theme_info', action: 'poll/get_theme_info', description: 'POST /cgi-bin/meeting/poll/get_theme_info', path: '/cgi-bin/meeting/poll/get_theme_info', method: 'POST' },
	{ id: 'pollStart', name: '[投票] poll/start', action: 'poll/start', description: 'POST /cgi-bin/meeting/poll/start', path: '/cgi-bin/meeting/poll/start', method: 'POST' },
	{ id: 'pollUpdateTheme', name: '[投票] poll/update_theme', action: 'poll/update_theme', description: 'POST /cgi-bin/meeting/poll/update_theme', path: '/cgi-bin/meeting/poll/update_theme', method: 'POST' },
	{ id: 'realcontrolCloseScreenShare', name: '[会中控制] realcontrol/close_screen_share', action: 'realcontrol/close_screen_share', description: 'POST /cgi-bin/meeting/realcontrol/close_screen_share', path: '/cgi-bin/meeting/realcontrol/close_screen_share', method: 'POST' },
	{ id: 'realcontrolManageWaitingRoomUsers', name: '[会中控制] realcontrol/manage_waiting_room_users', action: 'realcontrol/manage_waiting_room_users', description: 'POST /cgi-bin/meeting/realcontrol/manage_waiting_room_users', path: '/cgi-bin/meeting/realcontrol/manage_waiting_room_users', method: 'POST' },
	{ id: 'realcontrolSetNicknames', name: '[会中控制] realcontrol/set_nicknames', action: 'realcontrol/set_nicknames', description: 'POST /cgi-bin/meeting/realcontrol/set_nicknames', path: '/cgi-bin/meeting/realcontrol/set_nicknames', method: 'POST' },
	{ id: 'realcontrolSwitchUserVideo', name: '[会中控制] realcontrol/switch_user_video', action: 'realcontrol/switch_user_video', description: 'POST /cgi-bin/meeting/realcontrol/switch_user_video', path: '/cgi-bin/meeting/realcontrol/switch_user_video', method: 'POST' },
	{ id: 'recordDelete', name: '[录制] record/delete', action: 'record/delete', description: 'POST /cgi-bin/meeting/record/delete', path: '/cgi-bin/meeting/record/delete', method: 'POST' },
	{ id: 'recordDeleteFile', name: '[录制] record/delete_file', action: 'record/delete_file', description: 'POST /cgi-bin/meeting/record/delete_file', path: '/cgi-bin/meeting/record/delete_file', method: 'POST' },
	{ id: 'recordGetFileList', name: '[录制] record/get_file_list', action: 'record/get_file_list', description: 'POST /cgi-bin/meeting/record/get_file_list', path: '/cgi-bin/meeting/record/get_file_list', method: 'POST' },
	{ id: 'recordGetStatistics', name: '[录制] record/get_statistics', action: 'record/get_statistics', description: 'POST /cgi-bin/meeting/record/get_statistics', path: '/cgi-bin/meeting/record/get_statistics', method: 'POST' },
	{ id: 'recordTranscriptGetDetail', name: '[录制] transcript/get_detail', action: 'transcript/get_detail', description: 'POST /cgi-bin/meeting/record/transcript/get_detail', path: '/cgi-bin/meeting/record/transcript/get_detail', method: 'POST' },
	{ id: 'recordTranscriptGetParagraphList', name: '[录制] transcript/get_paragraph_list', action: 'transcript/get_paragraph_list', description: 'POST /cgi-bin/meeting/record/transcript/get_paragraph_list', path: '/cgi-bin/meeting/record/transcript/get_paragraph_list', method: 'POST' },
	{ id: 'recordTranscriptSearch', name: '[录制] transcript/search', action: 'transcript/search', description: 'POST /cgi-bin/meeting/record/transcript/search', path: '/cgi-bin/meeting/record/transcript/search', method: 'POST' },
	{ id: 'recordUpdateSharingConfig', name: '[录制] record/update_sharing_config', action: 'record/update_sharing_config', description: 'POST /cgi-bin/meeting/record/update_sharing_config', path: '/cgi-bin/meeting/record/update_sharing_config', method: 'POST' },
	{ id: 'roomsCall', name: '[Rooms] rooms/call', action: 'rooms/call', description: 'POST /cgi-bin/meeting/rooms/call', path: '/cgi-bin/meeting/rooms/call', method: 'POST' },
	{ id: 'roomsCancelCall', name: '[Rooms] rooms/cancel_call', action: 'rooms/cancel_call', description: 'POST /cgi-bin/meeting/rooms/cancel_call', path: '/cgi-bin/meeting/rooms/cancel_call', method: 'POST' },
	{ id: 'roomsGetConfig', name: '[Rooms] rooms/get_config', action: 'rooms/get_config', description: 'POST /cgi-bin/meeting/rooms/get_config', path: '/cgi-bin/meeting/rooms/get_config', method: 'POST' },
	{ id: 'roomsGetInventory', name: '[Rooms] rooms/get_inventory', action: 'rooms/get_inventory', description: 'POST /cgi-bin/meeting/rooms/get_inventory', path: '/cgi-bin/meeting/rooms/get_inventory', method: 'POST' },
	{ id: 'roomsGetResponseStatus', name: '[Rooms] rooms/get_response_status', action: 'rooms/get_response_status', description: 'POST /cgi-bin/meeting/rooms/get_response_status', path: '/cgi-bin/meeting/rooms/get_response_status', method: 'POST' },
	{ id: 'roomsListControllers', name: '[Rooms] rooms/list_controllers', action: 'rooms/list_controllers', description: 'POST /cgi-bin/meeting/rooms/list_controllers', path: '/cgi-bin/meeting/rooms/list_controllers', method: 'POST' },
	{ id: 'roomsListDevices', name: '[Rooms] rooms/list_devices', action: 'rooms/list_devices', description: 'POST /cgi-bin/meeting/rooms/list_devices', path: '/cgi-bin/meeting/rooms/list_devices', method: 'POST' },
	{ id: 'roomsListMeetings', name: '[Rooms] rooms/list_meetings', action: 'rooms/list_meetings', description: 'POST /cgi-bin/meeting/rooms/list_meetings', path: '/cgi-bin/meeting/rooms/list_meetings', method: 'POST' },
	{ id: 'setGuests', name: '[会议补全] meeting/set_guests', action: 'meeting/set_guests', description: 'POST /cgi-bin/meeting/set_guests', path: '/cgi-bin/meeting/set_guests', method: 'POST' },
	{ id: 'setInvitees', name: '[会议补全] meeting/set_invitees', action: 'meeting/set_invitees', description: 'POST /cgi-bin/meeting/set_invitees', path: '/cgi-bin/meeting/set_invitees', method: 'POST' },
	{ id: 'vipBatchDelJobResult', name: '[高级账号] vip/batch_del_job_result', action: 'vip/batch_del_job_result', description: 'POST /cgi-bin/meeting/vip/batch_del_job_result', path: '/cgi-bin/meeting/vip/batch_del_job_result', method: 'POST' },
	{ id: 'waitingroomGetCurrentUserList', name: '[等候室] waitingroom/get_current_user_list', action: 'waitingroom/get_current_user_list', description: 'POST /cgi-bin/meeting/waitingroom/get_current_user_list', path: '/cgi-bin/meeting/waitingroom/get_current_user_list', method: 'POST' },
	{ id: 'waitingroomGetUserList', name: '[等候室] waitingroom/get_user_list', action: 'waitingroom/get_user_list', description: 'POST /cgi-bin/meeting/waitingroom/get_user_list', path: '/cgi-bin/meeting/waitingroom/get_user_list', method: 'POST' },
	{ id: 'webinarCancel', name: '[网络研讨会] 取消网络研讨会', action: '取消网络研讨会', description: 'POST /cgi-bin/meeting/webinar/cancel', path: '/cgi-bin/meeting/webinar/cancel', method: 'POST' },
	{ id: 'webinarCreate', name: '[网络研讨会] 创建网络研讨会', action: '创建网络研讨会', description: 'POST /cgi-bin/meeting/webinar/create', path: '/cgi-bin/meeting/webinar/create', method: 'POST' },
	{ id: 'webinarEnrollApprove', name: '[报名] enroll/approve', action: 'enroll/approve', description: 'POST /cgi-bin/meeting/webinar/enroll/approve', path: '/cgi-bin/meeting/webinar/enroll/approve', method: 'POST' },
	{ id: 'webinarEnrollDelete', name: '[报名] enroll/delete', action: 'enroll/delete', description: 'POST /cgi-bin/meeting/webinar/enroll/delete', path: '/cgi-bin/meeting/webinar/enroll/delete', method: 'POST' },
	{ id: 'webinarEnrollGetConfig', name: '[报名] enroll/get_config', action: 'enroll/get_config', description: 'POST /cgi-bin/meeting/webinar/enroll/get_config', path: '/cgi-bin/meeting/webinar/enroll/get_config', method: 'POST' },
	{ id: 'webinarEnrollImport', name: '[报名] enroll/import', action: 'enroll/import', description: 'POST /cgi-bin/meeting/webinar/enroll/import', path: '/cgi-bin/meeting/webinar/enroll/import', method: 'POST' },
	{ id: 'webinarEnrollList', name: '[报名] enroll/list', action: 'enroll/list', description: 'POST /cgi-bin/meeting/webinar/enroll/list', path: '/cgi-bin/meeting/webinar/enroll/list', method: 'POST' },
	{ id: 'webinarEnrollQueryByTmpOpenid', name: '[报名] enroll/query_by_tmp_openid', action: 'enroll/query_by_tmp_openid', description: 'POST /cgi-bin/meeting/webinar/enroll/query_by_tmp_openid', path: '/cgi-bin/meeting/webinar/enroll/query_by_tmp_openid', method: 'POST' },
	{ id: 'webinarEnrollSetConfig', name: '[报名] enroll/set_config', action: 'enroll/set_config', description: 'POST /cgi-bin/meeting/webinar/enroll/set_config', path: '/cgi-bin/meeting/webinar/enroll/set_config', method: 'POST' },
	{ id: 'webinarGet', name: '[网络研讨会] 获取网络研讨会', action: '获取网络研讨会', description: 'POST /cgi-bin/meeting/webinar/get', path: '/cgi-bin/meeting/webinar/get', method: 'POST' },
	{ id: 'webinarListGuest', name: '[网络研讨会] webinar/list_guest', action: 'webinar/list_guest', description: 'POST /cgi-bin/meeting/webinar/list_guest', path: '/cgi-bin/meeting/webinar/list_guest', method: 'POST' },
	{ id: 'webinarUpdate', name: '[网络研讨会] 更新网络研讨会', action: '更新网络研讨会', description: 'POST /cgi-bin/meeting/webinar/update', path: '/cgi-bin/meeting/webinar/update', method: 'POST' },
	{ id: 'webinarUpdateGuestList', name: '[网络研讨会] webinar/update_guest_list', action: 'webinar/update_guest_list', description: 'POST /cgi-bin/meeting/webinar/update_guest_list', path: '/cgi-bin/meeting/webinar/update_guest_list', method: 'POST' },
	{ id: 'webinarUpdateWarmUp', name: '[网络研讨会] webinar/update_warm_up', action: 'webinar/update_warm_up', description: 'POST /cgi-bin/meeting/webinar/update_warm_up', path: '/cgi-bin/meeting/webinar/update_warm_up', method: 'POST' },
];

export const meetingExtraHttpOpsById: Record<string, ExtraHttpOp> = Object.fromEntries(
	meetingExtraHttpOps.map((o) => [o.id, o]),
);

export const meetingExtraHttpOpsOptionValues = meetingExtraHttpOps.map((o) => o.id);

export function getMeetingExtraHttpOpOptions() {
	return extraHttpOpOptions(meetingExtraHttpOps);
}

export const meetingExtraHttpOpsDescription: INodeProperties[] = [
	{
		displayName: '请求体JSON',
		name: 'requestBody',
		type: 'json',
		displayOptions: {
			show: { resource: ['meeting'], operation: meetingExtraHttpOpsOptionValues },
		},
		default: '{}',
		description: '请求体 JSON，字段名与企业微信接口文档保持一致；GET 请求可留空',
	},
	{
		displayName: 'Query参数JSON',
		name: 'requestQuery',
		type: 'json',
		displayOptions: {
			show: { resource: ['meeting'], operation: meetingExtraHttpOpsOptionValues },
		},
		default: '{}',
		description: 'URL 查询参数（访问凭证会自动附加，无需填写）',
	},
];
