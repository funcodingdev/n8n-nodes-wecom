import type { INodeProperties } from 'n8n-workflow';

/** Rooms / MRA / 投票 / 会中扩展 / 报名补全 / 等候室等：结构化表单 */

export const controlRoomsOperationOptions = [
	// Rooms
	{ name: '[Rooms] 呼叫会议室', value: 'roomsCall', action: '呼叫 Rooms', description: '呼叫 Rooms 会议室入会' },
	{ name: '[Rooms] 取消呼叫', value: 'roomsCancelCall', action: '取消 Rooms 呼叫', description: '取消呼叫 Rooms 会议室' },
	{ name: '[Rooms] 获取应答状态', value: 'roomsGetResponseStatus', action: '获取应答状态', description: '获取 Rooms 应答状态' },
	{ name: '[Rooms] 获取会议室下会议列表', value: 'roomsListMeetings', action: '获取 Rooms 会议列表', description: '获取 Rooms 会议室下的会议' },
	{ name: '[Rooms] 获取配置项', value: 'roomsGetConfig', action: '获取 Rooms 配置', description: '获取 Rooms 会议室配置项' },
	{ name: '[Rooms] 获取资源库存', value: 'roomsGetInventory', action: '获取 Rooms 库存', description: '获取 Rooms 会议室资源' },
	{ name: '[Rooms] 获取设备列表', value: 'roomsListDevices', action: '获取设备列表', description: '获取 Rooms 设备列表' },
	{ name: '[Rooms] 获取控制器列表', value: 'roomsListControllers', action: '获取控制器列表', description: '获取 Rooms 控制器列表' },
	// MRA
	{ name: '[MRA] 挂断连接', value: 'mraHangup', action: '挂断 MRA', description: '挂断 MRA 呼叫' },
	{ name: '[MRA] 查询状态', value: 'mraQueryStatus', action: '查询 MRA 状态', description: '获取 MRA 状态信息' },
	{ name: '[MRA] 设置默认布局', value: 'mraSetDefaultLayout', action: '设置 MRA 默认布局', description: '切换 MRA 默认布局' },
	{ name: '[MRA] 设置举手', value: 'mraSetRaiseHand', action: '设置 MRA 举手', description: '设置 MRA 举手或放下' },
	// 投票
	{ name: '[投票] 创建投票主题', value: 'pollCreateTheme', action: '创建投票主题', description: '创建会议投票主题' },
	{ name: '[投票] 修改投票主题', value: 'pollUpdateTheme', action: '修改投票主题', description: '修改会议投票主题' },
	{ name: '[投票] 获取投票主题信息', value: 'pollGetThemeInfo', action: '获取投票主题', description: '获取投票主题信息' },
	{ name: '[投票] 发起投票', value: 'pollStart', action: '发起投票', description: '发起会议投票' },
	{ name: '[投票] 结束投票', value: 'pollFinish', action: '结束投票', description: '结束会议投票' },
	{ name: '[投票] 删除投票', value: 'pollDelete', action: '删除投票', description: '删除会议投票' },
	// 会中控制扩展
	{ name: '[会中控制] 关闭屏幕共享', value: 'rcCloseScreenShare', action: '关闭屏幕共享', description: '关闭成员屏幕共享' },
	{ name: '[会中控制] 管理等候室成员', value: 'rcManageWaitingRoom', action: '管理等候室成员', description: '管理等候室成员' },
	{ name: '[会中控制] 设置成员昵称', value: 'rcSetNicknames', action: '设置成员昵称', description: '修改成员会中显示昵称' },
	{ name: '[会中控制] 开关成员视频', value: 'rcSwitchUserVideo', action: '开关成员视频', description: '关闭或开启成员视频' },
	// 等候室
	{ name: '[等候室] 获取当前等候成员', value: 'waitingroomCurrentUsers', action: '当前等候成员', description: '获取当前等候室成员' },
	{ name: '[等候室] 获取等候室成员列表', value: 'waitingroomUserList', action: '等候室成员列表', description: '获取等候室成员列表' },
	// 报名补全
	{ name: '[报名管理] 删除报名信息', value: 'enrollDelete', action: '删除报名', description: '删除会议报名信息' },
	{ name: '[报名管理] 导入报名信息', value: 'enrollImport', action: '导入报名', description: '导入会议报名信息' },
	{ name: '[报名管理] 按临时OpenID查询报名', value: 'enrollQueryByTmpOpenid', action: '按临时OpenID查询报名', description: '按临时 OpenID 查询报名' },
	// 会议其它
	{ name: '[会议] 设置嘉宾', value: 'setGuests', action: '设置嘉宾', description: '设置会议嘉宾列表' },
	{ name: '[会议] 设置邀请成员', value: 'setInvitees', action: '设置邀请成员', description: '设置会议邀请成员' },
	{ name: '[会议] 获取嘉宾列表', value: 'getGuests', action: '获取嘉宾列表', description: '获取会议嘉宾' },
	{ name: '[会议] 获取会议质量数据', value: 'getQuality', action: '获取质量数据', description: '获取会议质量数据' },
	{ name: '[会议] 检查设备是否在会中', value: 'checkDeviceInMeeting', action: '检查设备在会中', description: '检查设备是否在会议中' },
	{ name: '[会议] 创建客户专属短链', value: 'createCustomerShortUrl', action: '创建客户短链', description: '创建客户专属短链' },
	{ name: '[会议] 获取客户专属短链', value: 'getCustomerShortUrl', action: '获取客户短链', description: '获取客户专属短链' },
	{ name: '[电话入会] 获取临时OpenID', value: 'phoneGetTmpOpenid', action: '获取临时OpenID', description: '获取电话入会临时 OpenID' },
	{ name: '[高级账号] 查询批量取消任务结果', value: 'vipBatchDelJobResult', action: '查询批量取消任务结果', description: '查询批量取消高级账号任务结果' },
];

const allOps = controlRoomsOperationOptions.map((o) => o.value);

const needMeetingId = allOps.filter(
	(o) =>
		![
			'roomsGetConfig',
			'roomsGetInventory',
			'roomsListControllers',
			'roomsListDevices',
			'vipBatchDelJobResult',
		].includes(o),
);

const needOperator = [
	'pollCreateTheme',
	'pollUpdateTheme',
	'pollGetThemeInfo',
	'pollStart',
	'pollFinish',
	'pollDelete',
];

const needPollThemeId = ['pollUpdateTheme', 'pollGetThemeInfo', 'pollStart', 'pollDelete', 'pollFinish'];
const needRoomId = ['roomsCall', 'roomsCancelCall', 'roomsGetResponseStatus', 'roomsListMeetings', 'roomsGetConfig'];
const needMraOpenid = ['mraHangup', 'mraQueryStatus', 'mraSetDefaultLayout', 'mraSetRaiseHand'];
const needOperatedUsers = [
	'rcCloseScreenShare',
	'rcManageWaitingRoom',
	'rcSetNicknames',
	'rcSwitchUserVideo',
];
const needListJson = ['setGuests', 'setInvitees', 'enrollImport', 'enrollDelete', 'enrollQueryByTmpOpenid'];

export const meetingControlRoomsOpsDescription: INodeProperties[] = [
	{
		displayName: '会议ID',
		name: 'cr_meetingid',
		type: 'string',
		displayOptions: { show: { resource: ['meeting'], operation: needMeetingId } },
		default: '',
		description: '会议 ID',
	},
	{
		displayName: '操作者OpenID',
		name: 'operator_userid',
		type: 'string',
		displayOptions: { show: { resource: ['meeting'], operation: needOperator } },
		default: '',
		description: '操作者 openid（投票相关接口必填）',
	},
	{
		displayName: '设备实例ID',
		name: 'instance_id',
		type: 'number',
		displayOptions: { show: { resource: ['meeting'], operation: needOperator } },
		default: 1,
		description: '操作者入会所用设备 ID',
	},
	{
		displayName: '投票主题ID',
		name: 'poll_theme_id',
		type: 'string',
		displayOptions: { show: { resource: ['meeting'], operation: needPollThemeId } },
		default: '',
		description: '投票主题 ID',
	},
	{
		displayName: '投票主题',
		name: 'poll_topic',
		type: 'string',
		displayOptions: {
			show: { resource: ['meeting'], operation: ['pollCreateTheme', 'pollUpdateTheme'] },
		},
		default: '',
		description: '投票主题，最多 50 个字符',
	},
	{
		displayName: '投票描述',
		name: 'poll_desc',
		type: 'string',
		displayOptions: {
			show: { resource: ['meeting'], operation: ['pollCreateTheme', 'pollUpdateTheme'] },
		},
		default: '',
		description: '投票主题描述，最多 100 个字符',
	},
	{
		displayName: '是否匿名',
		name: 'is_anony',
		type: 'options',
		displayOptions: {
			show: { resource: ['meeting'], operation: ['pollCreateTheme', 'pollUpdateTheme'] },
		},
		options: [
			{ name: '实名', value: 0 },
			{ name: '匿名', value: 1 },
		],
		default: 0,
	},
	{
		displayName: '投票问题',
		name: 'pollQuestionsCollection',
		type: 'fixedCollection',
		displayOptions: {
			show: { resource: ['meeting'], operation: ['pollCreateTheme', 'pollUpdateTheme'] },
		},
		default: {},
		placeholder: '添加问题',
		typeOptions: { multipleValues: true },
		options: [
			{
				displayName: '问题',
				name: 'questions',
				values: [
					{
						displayName: '问题类型',
						name: 'question_type',
						type: 'options',
						options: [
							{ name: '单选', value: 0 },
							{ name: '多选', value: 1 },
						],
						default: 0,
					},
					{
						displayName: '问题描述',
						name: 'question_desc',
						type: 'string',
						default: '',
					},
					{
						displayName: '选项(逗号分隔)',
						name: 'poll_option',
						type: 'string',
						default: '',
						placeholder: '选项1,选项2,选项3',
					},
				],
			},
		],
	},
	{
		displayName: '投票问题扩展JSON',
		name: 'poll_questions_json',
		type: 'json',
		displayOptions: {
			show: { resource: ['meeting'], operation: ['pollCreateTheme', 'pollUpdateTheme'] },
		},
		default: '[]',
		description: '非空数组时覆盖上方表单',
	},
	{
		displayName: 'Rooms会议室ID',
		name: 'cr_meeting_room_id',
		type: 'string',
		displayOptions: { show: { resource: ['meeting'], operation: needRoomId } },
		default: '',
		description: 'Rooms 会议室 ID；呼叫时与 MRA 地址二选一',
	},
	{
		displayName: 'MRA临时OpenID',
		name: 'mra_tmp_openid',
		type: 'string',
		displayOptions: { show: { resource: ['meeting'], operation: needMraOpenid } },
		default: '',
		description: '被操作 MRA 设备的会中临时 ID',
	},
	{
		displayName: '任务ID',
		name: 'vip_jobid',
		type: 'string',
		displayOptions: {
			show: { resource: ['meeting'], operation: ['vipBatchDelJobResult'] },
		},
		default: '',
		description: '批量取消高级账号任务的 jobid',
	},
	{
		displayName: '被操作用户',
		name: 'operatedUsersCollection',
		type: 'fixedCollection',
		displayOptions: { show: { resource: ['meeting'], operation: needOperatedUsers } },
		default: {},
		placeholder: '添加用户',
		typeOptions: { multipleValues: true },
		options: [
			{
				displayName: '用户',
				name: 'users',
				values: [
					{
						displayName: '临时OpenID',
						name: 'tmp_openid',
						type: 'string',
						default: '',
					},
					{
						displayName: '实例ID',
						name: 'instance_id',
						type: 'number',
						default: 1,
					},
					{
						displayName: '昵称',
						name: 'nickname',
						type: 'string',
						default: '',
						description: '修改昵称接口使用',
					},
				],
			},
		],
	},
	{
		displayName: '被操作用户扩展JSON',
		name: 'operated_users_json',
		type: 'json',
		displayOptions: { show: { resource: ['meeting'], operation: needOperatedUsers } },
		default: '[]',
		description: '非空数组时覆盖上方表单',
	},
	{
		displayName: '会议嘉宾列表',
		name: 'meetingGuestsCollection',
		type: 'fixedCollection',
		displayOptions: { show: { resource: ['meeting'], operation: ['setGuests'] } },
		default: {},
		placeholder: '添加嘉宾',
		typeOptions: { multipleValues: true },
		description: 'guests，电话嘉宾',
		options: [
			{
				displayName: '嘉宾',
				name: 'guests',
				values: [
					{
						displayName: '国家/地区代码',
						name: 'area',
						type: 'string',
						default: '86',
					},
					{
						displayName: '手机号',
						name: 'phone_number',
						type: 'string',
						default: '',
					},
					{
						displayName: '嘉宾名称',
						name: 'guest_name',
						type: 'string',
						default: '',
					},
				],
			},
		],
	},
	{
		displayName: '邀请成员UserID列表',
		name: 'invitee_userids',
		type: 'string',
		displayOptions: { show: { resource: ['meeting'], operation: ['setInvitees'] } },
		default: '',
		placeholder: 'zhangsan,lisi',
		description: 'invitees userid 列表，逗号分隔',
	},
	{
		displayName: '临时OpenID',
		name: 'enroll_tmp_openid',
		type: 'string',
		displayOptions: {
			show: { resource: ['meeting'], operation: ['enrollQueryByTmpOpenid'] },
		},
		default: '',
		description: 'tmp_openid，用于按临时 OpenID 查询报名',
	},
	{
		displayName: '报名ID列表',
		name: 'enroll_id_list_cr',
		type: 'string',
		displayOptions: {
			show: { resource: ['meeting'], operation: ['enrollDelete'] },
		},
		default: '',
		placeholder: 'id1,id2',
		description: 'enroll_id_list，逗号分隔',
	},
	{
		displayName: '列表数据扩展JSON',
		name: 'list_data_json',
		type: 'json',
		displayOptions: { show: { resource: ['meeting'], operation: needListJson } },
		default: '[]',
		description: '若为非空数组则覆盖上方表单；报名导入等复杂结构也写在这里',
	},
	{
		displayName: '呼叫ID',
		name: 'rooms_invite_id',
		type: 'string',
		displayOptions: {
			show: {
				resource: ['meeting'],
				operation: ['roomsCancelCall', 'roomsGetResponseStatus'],
			},
		},
		default: '',
		description: 'invite_id，呼叫返回的 ID',
	},
	{
		displayName: 'MRA信令协议',
		name: 'mra_protocol',
		type: 'options',
		displayOptions: {
			show: {
				resource: ['meeting'],
				operation: ['roomsCall', 'roomsCancelCall'],
			},
		},
		options: [
			{ name: '不使用 MRA 地址', value: 0 },
			{ name: 'SIP', value: 1 },
			{ name: 'H.323', value: 2 },
		],
		default: 0,
		description: '与 meeting_room_id 二选一',
	},
	{
		displayName: 'MRA信令地址',
		name: 'mra_dial_string',
		type: 'string',
		displayOptions: {
			show: {
				resource: ['meeting'],
				operation: ['roomsCall', 'roomsCancelCall'],
				mra_protocol: [1, 2],
			},
		},
		default: '',
		description: 'dial_string：IP / E.164 / URI',
	},
	{
		displayName: 'MRA默认分屏',
		name: 'mra_default_layout',
		type: 'options',
		displayOptions: {
			show: { resource: ['meeting'], operation: ['mraSetDefaultLayout'] },
		},
		options: [
			{ name: '等分模式', value: 1 },
			{ name: '全屏模式', value: 2 },
			{ name: '1+N', value: 3 },
		],
		default: 2,
		description: 'default_layout',
	},
	{
		displayName: '非视频与会者显示',
		name: 'mra_default_novideo_user',
		type: 'options',
		displayOptions: {
			show: { resource: ['meeting'], operation: ['mraSetDefaultLayout'] },
		},
		options: [
			{ name: '显示', value: 1 },
			{ name: '隐藏', value: 2 },
		],
		default: 1,
		description: 'default_novideo_user',
	},
	{
		displayName: '举手状态',
		name: 'mra_raise_hand',
		type: 'boolean',
		displayOptions: {
			show: { resource: ['meeting'], operation: ['mraSetRaiseHand'] },
		},
		default: true,
		description: 'true 举手，false 放下',
	},
	{
		displayName: '客户专属字段userData',
		name: 'customer_user_data',
		type: 'string',
		displayOptions: {
			show: { resource: ['meeting'], operation: ['createCustomerShortUrl'] },
		},
		default: '',
		description: '将自动封装为 ver=1.0 并 Base64 编码为 customer_data',
	},
	{
		displayName: '客户专属字段Base64',
		name: 'customer_data_raw',
		type: 'string',
		displayOptions: {
			show: { resource: ['meeting'], operation: ['createCustomerShortUrl'] },
		},
		default: '',
		description: '若已有 Base64 的 customer_data 可直接填写（优先）',
	},
	{
		displayName: '质量查询开始时间',
		name: 'quality_start_time',
		type: 'number',
		displayOptions: {
			show: { resource: ['meeting'], operation: ['getQuality'] },
		},
		default: 0,
		description: 'start_time，秒；查过去 7 天内',
	},
	{
		displayName: '周期性子会议ID',
		name: 'sub_meetingid',
		type: 'string',
		displayOptions: {
			show: { resource: ['meeting'], operation: ['getQuality'] },
		},
		default: '',
		description: 'sub_meetingid，周期会议必填',
	},
	{
		displayName: '检查成员UserID',
		name: 'device_check_userid',
		type: 'string',
		displayOptions: {
			show: { resource: ['meeting'], operation: ['checkDeviceInMeeting'] },
		},
		default: '',
		description: 'userid',
	},
	{
		displayName: '会议ID列表',
		name: 'device_meetingid_list',
		type: 'string',
		displayOptions: {
			show: { resource: ['meeting'], operation: ['checkDeviceInMeeting'] },
		},
		default: '',
		placeholder: 'meeting1,meeting2',
		description: 'meetingid_list，逗号分隔',
	},
	{
		displayName: '设备类型列表',
		name: 'device_instance_id_list',
		type: 'string',
		displayOptions: {
			show: { resource: ['meeting'], operation: ['checkDeviceInMeeting'] },
		},
		default: '',
		placeholder: '1,2,3',
		description: 'instance_id_list，逗号分隔数字；空表示全部设备',
	},
	{
		displayName: '查询电话号码',
		name: 'phoneGetTmpOpenidCollection',
		type: 'fixedCollection',
		displayOptions: {
			show: { resource: ['meeting'], operation: ['phoneGetTmpOpenid'] },
		},
		default: {},
		placeholder: '添加号码',
		typeOptions: { multipleValues: true },
		description: 'phone_numbers，最多 20 个',
		options: [
			{
				displayName: '号码',
				name: 'numbers',
				values: [
					{ displayName: '国家/地区代码', name: 'area', type: 'number', default: 86 },
					{ displayName: '电话号码', name: 'phone', type: 'string', default: '' },
					{ displayName: '分机号', name: 'extension_number', type: 'string', default: '' },
				],
			},
		],
	},
	{
		displayName: '开启视频',
		name: 'rc_video_on',
		type: 'boolean',
		displayOptions: {
			show: { resource: ['meeting'], operation: ['rcSwitchUserVideo'] },
		},
		default: false,
		description: 'video：false 关闭（默认），true 开启（仅 MRA）',
	},
	{
		displayName: '等候室操作类型',
		name: 'waiting_operate_type',
		type: 'options',
		displayOptions: {
			show: { resource: ['meeting'], operation: ['rcManageWaitingRoom'] },
		},
		options: [
			{ name: '等候室成员移入会议', value: 1 },
			{ name: '会中成员移入等候室', value: 2 },
			{ name: '等候室成员移出等候室', value: 3 },
		],
		default: 1,
		description: 'operate_type',
	},
	{
		displayName: '允许再次入会',
		name: 'waiting_allow_rejoin',
		type: 'boolean',
		displayOptions: {
			show: {
				resource: ['meeting'],
				operation: ['rcManageWaitingRoom'],
				waiting_operate_type: [3],
			},
		},
		default: true,
		description: 'allow_rejoin，仅移出等候室时有效',
	},
	{
		displayName: '游标',
		name: 'cr_cursor',
		type: 'string',
		displayOptions: {
			show: {
				resource: ['meeting'],
				operation: [
					'roomsListDevices',
					'roomsListControllers',
					'roomsListMeetings',
					'waitingroomUserList',
					'getGuests',
					'getQuality',
				],
			},
		},
		default: '',
		description: '分页游标',
	},
	{
		displayName: '条数限制',
		name: 'cr_limit',
		type: 'number',
		displayOptions: {
			show: {
				resource: ['meeting'],
				operation: [
					'roomsListDevices',
					'roomsListControllers',
					'roomsListMeetings',
					'waitingroomUserList',
					'getGuests',
					'getQuality',
				],
			},
		},
		default: 20,
		description: 'getQuality 最大 50',
	},
	{
		displayName: '扩展请求JSON',
		name: 'cr_extra_json',
		type: 'json',
		displayOptions: { show: { resource: ['meeting'], operation: allOps } },
		default: '{}',
		description: '其余字段（如 mra_address、设备筛选等）与上方合并，JSON 优先',
	},
];
