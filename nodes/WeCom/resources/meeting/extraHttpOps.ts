import type { INodeProperties } from 'n8n-workflow';
import type { ExtraHttpOp } from '../../shared/extraHttpOp';
import { extraHttpOpOptions } from '../../shared/extraHttpOp';

/** 会议域补全 HTTP 操作（一等操作名 + 关键字段 + 请求体 JSON） */
export type MeetingExtraHttpOp = ExtraHttpOp & {
	needsMeetingId?: boolean;
	needsRecordFileId?: boolean;
};

export const meetingExtraHttpOps: MeetingExtraHttpOp[] = [
	{ id: 'checkDeviceInMeeting', name: '[会中] 检查设备是否在会中', action: '检查设备是否在会中', description: '检查设备是否在会中', path: '/cgi-bin/meeting/check_device_in_meeting', method: 'POST', needsMeetingId: true },
	{ id: 'createCustomerShortUrl', name: '[会议] 创建客户专属短链', action: '创建客户专属短链', description: '创建客户专属短链', path: '/cgi-bin/meeting/create_customer_short_url', method: 'POST', needsMeetingId: true },
	{ id: 'enrollDelete', name: '[报名] 删除报名信息', action: '删除报名信息', description: '删除报名信息', path: '/cgi-bin/meeting/enroll/delete', method: 'POST', needsMeetingId: true },
	{ id: 'enrollImport', name: '[报名] 导入报名信息', action: '导入报名信息', description: '导入报名信息', path: '/cgi-bin/meeting/enroll/import', method: 'POST', needsMeetingId: true },
	{ id: 'enrollQueryByTmpOpenid', name: '[报名] 按临时OpenID查询报名', action: '按临时OpenID查询报名', description: '按临时OpenID查询报名', path: '/cgi-bin/meeting/enroll/query_by_tmp_openid', method: 'POST', needsMeetingId: true },
	{ id: 'getCustomerShortUrl', name: '[会议] 获取客户专属短链', action: '获取客户专属短链', description: '获取客户专属短链', path: '/cgi-bin/meeting/get_customer_short_url', method: 'POST', needsMeetingId: true },
	{ id: 'getGuests', name: '[会议] 获取嘉宾列表', action: '获取嘉宾列表', description: '获取嘉宾列表', path: '/cgi-bin/meeting/get_guests', method: 'POST', needsMeetingId: true },
	{ id: 'getQuality', name: '[会议] 获取会议质量数据', action: '获取会议质量数据', description: '获取会议质量数据', path: '/cgi-bin/meeting/get_quality', method: 'POST', needsMeetingId: true },
	{ id: 'mraHangup', name: '[MRA] 挂断连接', action: '挂断 MRA 连接', description: '挂断 MRA 连接', path: '/cgi-bin/meeting/mra/hangup', method: 'POST', needsMeetingId: true },
	{ id: 'mraQueryStatus', name: '[MRA] 查询连接状态', action: '查询 MRA 连接状态', description: '查询 MRA 连接状态', path: '/cgi-bin/meeting/mra/query_status', method: 'POST', needsMeetingId: true },
	{ id: 'mraSetDefaultLayout', name: '[MRA] 设置默认布局', action: '设置 MRA 默认布局', description: '设置 MRA 默认布局', path: '/cgi-bin/meeting/mra/set_default_layout', method: 'POST', needsMeetingId: true },
	{ id: 'mraSetRaiseHand', name: '[MRA] 设置举手状态', action: '设置 MRA 举手状态', description: '设置 MRA 举手状态', path: '/cgi-bin/meeting/mra/set_raise_hand', method: 'POST', needsMeetingId: true },
	{ id: 'phoneGetTmpOpenid', name: '[电话入会] 获取临时OpenID', action: '获取电话入会临时 OpenID', description: '获取电话入会临时 OpenID', path: '/cgi-bin/meeting/phone/get_tmp_openid', method: 'POST', needsMeetingId: true },
	{ id: 'pollCreateTheme', name: '[投票] 创建投票主题', action: '创建投票主题', description: '创建投票主题', path: '/cgi-bin/meeting/poll/create_theme', method: 'POST', needsMeetingId: true },
	{ id: 'pollDelete', name: '[投票] 删除投票', action: '删除投票', description: '删除投票', path: '/cgi-bin/meeting/poll/delete', method: 'POST', needsMeetingId: true },
	{ id: 'pollFinish', name: '[投票] 结束投票', action: '结束投票', description: '结束投票', path: '/cgi-bin/meeting/poll/finish', method: 'POST', needsMeetingId: true },
	{ id: 'pollGetThemeInfo', name: '[投票] 获取投票主题详情', action: '获取投票主题详情', description: '获取投票主题详情', path: '/cgi-bin/meeting/poll/get_theme_info', method: 'POST', needsMeetingId: true },
	{ id: 'pollStart', name: '[投票] 开始投票', action: '开始投票', description: '开始投票', path: '/cgi-bin/meeting/poll/start', method: 'POST', needsMeetingId: true },
	{ id: 'pollUpdateTheme', name: '[投票] 更新投票主题', action: '更新投票主题', description: '更新投票主题', path: '/cgi-bin/meeting/poll/update_theme', method: 'POST', needsMeetingId: true },
	{ id: 'realcontrolCloseScreenShare', name: '[会中控制] 关闭屏幕共享', action: '关闭屏幕共享', description: '关闭屏幕共享', path: '/cgi-bin/meeting/realcontrol/close_screen_share', method: 'POST', needsMeetingId: true },
	{ id: 'realcontrolManageWaitingRoomUsers', name: '[会中控制] 管理等候室成员', action: '管理等候室成员', description: '管理等候室成员', path: '/cgi-bin/meeting/realcontrol/manage_waiting_room_users', method: 'POST', needsMeetingId: true },
	{ id: 'realcontrolSetNicknames', name: '[会中控制] 设置成员昵称', action: '设置成员昵称', description: '设置成员昵称', path: '/cgi-bin/meeting/realcontrol/set_nicknames', method: 'POST', needsMeetingId: true },
	{ id: 'realcontrolSwitchUserVideo', name: '[会中控制] 开关成员视频', action: '开关成员视频', description: '开关成员视频', path: '/cgi-bin/meeting/realcontrol/switch_user_video', method: 'POST', needsMeetingId: true },
	{ id: 'roomsCall', name: '[Rooms] 呼叫会议室', action: '呼叫 Rooms 会议室', description: '呼叫 Rooms 会议室', path: '/cgi-bin/meeting/rooms/call', method: 'POST', needsMeetingId: true },
	{ id: 'roomsCancelCall', name: '[Rooms] 取消呼叫', action: '取消 Rooms 呼叫', description: '取消 Rooms 呼叫', path: '/cgi-bin/meeting/rooms/cancel_call', method: 'POST', needsMeetingId: true },
	{ id: 'roomsGetConfig', name: '[Rooms] 获取配置', action: '获取 Rooms 配置', description: '获取 Rooms 配置', path: '/cgi-bin/meeting/rooms/get_config', method: 'POST' },
	{ id: 'roomsGetInventory', name: '[Rooms] 获取库存', action: '获取 Rooms 库存', description: '获取 Rooms 库存', path: '/cgi-bin/meeting/rooms/get_inventory', method: 'POST' },
	{ id: 'roomsGetResponseStatus', name: '[Rooms] 获取响应状态', action: '获取 Rooms 响应状态', description: '获取 Rooms 响应状态', path: '/cgi-bin/meeting/rooms/get_response_status', method: 'POST', needsMeetingId: true },
	{ id: 'roomsListControllers', name: '[Rooms] 获取控制器列表', action: '获取 Rooms 控制器列表', description: '获取 Rooms 控制器列表', path: '/cgi-bin/meeting/rooms/list_controllers', method: 'POST' },
	{ id: 'roomsListDevices', name: '[Rooms] 获取设备列表', action: '获取 Rooms 设备列表', description: '获取 Rooms 设备列表', path: '/cgi-bin/meeting/rooms/list_devices', method: 'POST' },
	{ id: 'roomsListMeetings', name: '[Rooms] 获取会议列表', action: '获取 Rooms 会议列表', description: '获取 Rooms 会议列表', path: '/cgi-bin/meeting/rooms/list_meetings', method: 'POST', needsMeetingId: true },
	{ id: 'setGuests', name: '[会议] 设置嘉宾', action: '设置会议嘉宾', description: '设置会议嘉宾', path: '/cgi-bin/meeting/set_guests', method: 'POST', needsMeetingId: true },
	{ id: 'setInvitees', name: '[会议] 设置邀请成员', action: '设置邀请成员', description: '设置邀请成员', path: '/cgi-bin/meeting/set_invitees', method: 'POST', needsMeetingId: true },
	{ id: 'vipBatchDelJobResult', name: '[高级账号] 查询批量取消任务结果', action: '查询批量取消高级账号任务结果', description: '查询批量取消高级账号任务结果', path: '/cgi-bin/meeting/vip/batch_del_job_result', method: 'POST' },
	{ id: 'waitingroomGetCurrentUserList', name: '[等候室] 获取当前等候成员', action: '获取当前等候室成员', description: '获取当前等候室成员', path: '/cgi-bin/meeting/waitingroom/get_current_user_list', method: 'POST', needsMeetingId: true },
	{ id: 'waitingroomGetUserList', name: '[等候室] 获取等候室成员列表', action: '获取等候室成员列表', description: '获取等候室成员列表', path: '/cgi-bin/meeting/waitingroom/get_user_list', method: 'POST', needsMeetingId: true },
];

export const meetingExtraHttpOpsById: Record<string, MeetingExtraHttpOp> = Object.fromEntries(
	meetingExtraHttpOps.map((o) => [o.id, o]),
);

export const meetingExtraHttpOpsOptionValues = meetingExtraHttpOps.map((o) => o.id);
export const meetingExtraOpsNeedMeetingId = meetingExtraHttpOps.filter((o) => o.needsMeetingId).map((o) => o.id);
export const meetingExtraOpsNeedRecordFileId = meetingExtraHttpOps.filter((o) => o.needsRecordFileId).map((o) => o.id);

export function getMeetingExtraHttpOpOptions() {
	return extraHttpOpOptions(meetingExtraHttpOps);
}

export const meetingExtraHttpOpsDescription: INodeProperties[] = [
	{
		displayName: '会议ID',
		name: 'meetingid',
		type: 'string',
		displayOptions: {
			show: { resource: ['meeting'], operation: meetingExtraOpsNeedMeetingId },
		},
		default: '',
		description: '会议 ID；会与请求体合并（请求体中的同名字段优先）',
	},
	{
		displayName: '录制文件ID',
		name: 'record_file_id',
		type: 'string',
		displayOptions: {
			show: { resource: ['meeting'], operation: meetingExtraOpsNeedRecordFileId },
		},
		default: '',
		description: '录制文件 ID；会与请求体合并（请求体中的同名字段优先）',
	},
	{
		displayName: '请求体JSON',
		name: 'requestBody',
		type: 'json',
		displayOptions: {
			show: { resource: ['meeting'], operation: meetingExtraHttpOpsOptionValues },
		},
		default: '{}',
		description: '其余请求字段，与企业微信会议接口文档一致；可覆盖上方已填字段',
	},
	{
		displayName: 'Query参数JSON',
		name: 'requestQuery',
		type: 'json',
		displayOptions: {
			show: { resource: ['meeting'], operation: meetingExtraHttpOpsOptionValues },
		},
		default: '{}',
		description: 'URL 查询参数（访问凭证自动附加）',
	},
];
