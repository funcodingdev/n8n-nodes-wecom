import type { INodeProperties } from 'n8n-workflow';

/** 会议报名 + Rooms + 会中扩展 参数定义 */

const enrollOps = ['getEnrollConfig', 'setEnrollConfig', 'listEnroll', 'approveEnroll'];

export const meetingAdvancedOpsDescription: INodeProperties[] = [
	// --- 报名 ---
	{
		displayName: '会议ID',
		name: 'meetingid',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['meeting'],
				operation: [
					...enrollOps,
					'bookRooms',
					'releaseRooms',
					'setCohost',
					'realcontrolSet',
					'setDefaultLayout',
					'phoneCallout',
					'phoneGetCalloutStatus',
					'getPollList',
					'getPollDetail',
				],
			},
		},
		default: '',
	},
	{
		displayName: '外呼号码列表',
		name: 'phoneCalloutCollection',
		type: 'fixedCollection',
		displayOptions: {
			show: { resource: ['meeting'], operation: ['phoneCallout'] },
		},
		default: {},
		placeholder: '添加号码',
		typeOptions: { multipleValues: true },
		description: 'phone_numbers，单次最多 50 路',
		options: [
			{
				displayName: '号码',
				name: 'numbers',
				values: [
					{
						displayName: '国家/地区代码',
						name: 'area',
						type: 'number',
						default: 86,
					},
					{
						displayName: '电话号码',
						name: 'phone',
						type: 'string',
						default: '',
					},
					{
						displayName: '分机号',
						name: 'extension_number',
						type: 'string',
						default: '',
					},
				],
			},
		],
	},
	{
		displayName: '默认布局ID',
		name: 'selected_layout_id',
		type: 'string',
		displayOptions: {
			show: { resource: ['meeting'], operation: ['setDefaultLayout'] },
		},
		default: '',
		description: 'selected_layout_id，空字符串表示恢复默认原始布局',
	},
	{
		displayName: '投票ID',
		name: 'poll_id_adv',
		type: 'string',
		displayOptions: {
			show: { resource: ['meeting'], operation: ['getPollDetail'] },
		},
		default: '',
		description: 'poll_id',
	},
	{
		displayName: '操作者UserID',
		name: 'poll_operator_userid',
		type: 'string',
		displayOptions: {
			show: { resource: ['meeting'], operation: ['getPollDetail', 'getPollList'] },
		},
		default: '',
		description: 'operator_userid',
	},
	{
		displayName: '操作者实例ID',
		name: 'poll_instance_id',
		type: 'number',
		displayOptions: {
			show: { resource: ['meeting'], operation: ['getPollDetail', 'getPollList'] },
		},
		default: 1,
		description: 'instance_id，操作者入会设备',
	},
	{
		displayName: '扩展请求JSON',
		name: 'extraJson',
		type: 'json',
		displayOptions: {
			show: {
				resource: ['meeting'],
				operation: [
					'setDefaultLayout',
					'phoneCallout',
					'phoneGetCalloutStatus',
					'getPollList',
					'getPollDetail',
				],
			},
		},
		default: '{}',
		description: '额外请求字段，与上方合并（JSON 优先）',
	},
	{
		displayName: '说明',
		name: 'listLayoutTemplateNotice',
		type: 'notice',
		displayOptions: {
			show: { resource: ['meeting'], operation: ['listLayoutTemplate'] },
		},
		default: '',
		description:
			'获取布局模板列表为 GET 接口，无需请求参数。返回 layout_template_list，可用于添加布局时填写模板 ID。',
	},
	{
		displayName: '审批方式',
		name: 'enroll_approve_type',
		type: 'options',
		displayOptions: {
			show: { resource: ['meeting'], operation: ['setEnrollConfig'] },
		},
		options: [
			{ name: '自动审批', value: 1 },
			{ name: '手动审批', value: 2 },
		],
		default: 1,
		description: 'approve_type',
	},
	{
		displayName: '收集问题',
		name: 'enroll_is_collect_question',
		type: 'options',
		displayOptions: {
			show: { resource: ['meeting'], operation: ['setEnrollConfig'] },
		},
		options: [
			{ name: '不收集', value: 1 },
			{ name: '收集', value: 2 },
		],
		default: 1,
		description: 'is_collect_question：1 不收集，2 收集',
	},
	{
		displayName: '企业成员无需报名',
		name: 'enroll_no_registration_needed_for_staff',
		type: 'boolean',
		displayOptions: {
			show: { resource: ['meeting'], operation: ['setEnrollConfig'] },
		},
		default: true,
		description: 'no_registration_needed_for_staff',
	},
	{
		displayName: '报名问题列表',
		name: 'enrollQuestionsCollection',
		type: 'fixedCollection',
		displayOptions: {
			show: {
				resource: ['meeting'],
				operation: ['setEnrollConfig'],
				enroll_is_collect_question: [2],
			},
		},
		default: {},
		placeholder: '添加问题',
		typeOptions: { multipleValues: true },
		description: 'question_list，仅收集问题时生效',
		options: [
			{
				displayName: '问题',
				name: 'questions',
				values: [
					{
						displayName: '是否必填',
						name: 'is_required',
						type: 'options',
						options: [
							{ name: '否', value: 1 },
							{ name: '是', value: 2 },
						],
						default: 1,
					},
					{
						displayName: '问题类型',
						name: 'question_type',
						type: 'options',
						options: [
							{ name: '单选', value: 1 },
							{ name: '多选', value: 2 },
							{ name: '简答', value: 3 },
						],
						default: 3,
						description: 'special_type 非「无」时无效',
					},
					{
						displayName: '特殊问题类型',
						name: 'special_type',
						type: 'options',
						options: [
							{ name: '无', value: 1 },
							{ name: '手机号', value: 2 },
							{ name: '邮箱', value: 3 },
							{ name: '姓名', value: 4 },
							{ name: '公司名称', value: 5 },
						],
						default: 1,
					},
					{
						displayName: '问题标题',
						name: 'question_title',
						type: 'string',
						default: '',
						description: '最多 40 字符；特殊问题时无效',
					},
					{
						displayName: '选项(逗号分隔)',
						name: 'option_contents',
						type: 'string',
						default: '',
						placeholder: '选项A,选项B',
						description: '单选/多选时有效，最多 8 个',
					},
				],
			},
		],
	},
	{
		displayName: '报名配置扩展JSON',
		name: 'enrollConfigJson',
		type: 'json',
		displayOptions: {
			show: { resource: ['meeting'], operation: ['setEnrollConfig'] },
		},
		default: '{}',
		description: '其余 set_config 字段（含完整 question_list）与上方合并，JSON 优先',
	},
	{
		displayName: '报名状态',
		name: 'enroll_status',
		type: 'options',
		displayOptions: {
			show: { resource: ['meeting'], operation: ['listEnroll'] },
		},
		options: [
			{ name: '全部', value: 0 },
			{ name: '待审批', value: 1 },
			{ name: '已拒绝', value: 2 },
			{ name: '已批准', value: 3 },
		],
		default: 0,
		description: 'status：0 全部 / 1 待审批 / 2 已拒绝 / 3 已批准',
	},
	{
		displayName: '游标',
		name: 'cursor',
		type: 'string',
		displayOptions: {
			show: {
				resource: ['meeting'],
				operation: ['listEnroll', 'listRooms'],
			},
		},
		default: '',
	},
	{
		displayName: '条数限制',
		name: 'limit',
		type: 'number',
		displayOptions: {
			show: {
				resource: ['meeting'],
				operation: ['listEnroll', 'listRooms'],
			},
		},
		default: 20,
	},
	{
		displayName: '报名ID列表',
		name: 'enroll_id_list',
		type: 'string',
		displayOptions: {
			show: { resource: ['meeting'], operation: ['approveEnroll'] },
		},
		default: '',
		placeholder: 'id1,id2',
		description: 'enroll_id_list，逗号分隔',
	},
	{
		displayName: '审批动作',
		name: 'enroll_approve_action',
		type: 'options',
		displayOptions: {
			show: { resource: ['meeting'], operation: ['approveEnroll'] },
		},
		options: [
			{ name: '批准', value: 3 },
			{ name: '拒绝', value: 2 },
			{ name: '取消批准', value: 1 },
		],
		default: 3,
		description: 'action：1 取消批准(回待审批) / 2 拒绝 / 3 批准',
	},
	{
		displayName: '审批扩展JSON',
		name: 'approveJson',
		type: 'json',
		displayOptions: {
			show: { resource: ['meeting'], operation: ['approveEnroll'] },
		},
		default: '{}',
		description: '其余审批字段，与上方合并（JSON 优先）',
	},
	// --- Rooms ---
	{
		displayName: 'Rooms名称',
		name: 'meeting_room_name',
		type: 'string',
		displayOptions: {
			show: { resource: ['meeting'], operation: ['listRooms'] },
		},
		default: '',
		description: '按会议室名称模糊筛选（可选）',
	},
	{
		displayName: 'Rooms会议室ID',
		name: 'meeting_room_id',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['meeting'],
				operation: ['getRoomInfo'],
			},
		},
		default: '',
	},
	{
		displayName: 'Rooms会议室ID列表',
		name: 'meeting_room_id_list',
		type: 'string',
		required: true,
		displayOptions: {
			show: { resource: ['meeting'], operation: ['bookRooms', 'releaseRooms'] },
		},
		default: '',
		placeholder: 'id1,id2',
		description:
			'meeting_room_id_list，逗号分隔。<a href="https://developer.work.weixin.qq.com/document/path/98791" target="_blank">预定/释放 Rooms</a>',
	},
	// --- 会中扩展 ---
	{
		displayName: '联席主持人动作',
		name: 'cohost_action',
		type: 'boolean',
		displayOptions: {
			show: { resource: ['meeting'], operation: ['setCohost'] },
		},
		default: true,
		description: 'action：true 设置联席主持人，false 撤销',
	},
	{
		displayName: '被操作成员临时OpenID',
		name: 'cohost_tmp_openid',
		type: 'string',
		displayOptions: {
			show: { resource: ['meeting'], operation: ['setCohost'] },
		},
		default: '',
		description: 'operated_user.tmp_openid',
	},
	{
		displayName: '被操作成员设备ID',
		name: 'cohost_instance_id',
		type: 'number',
		displayOptions: {
			show: { resource: ['meeting'], operation: ['setCohost'] },
		},
		default: 1,
		description: 'operated_user.instance_id',
	},
	{
		displayName: '联席主持人UserID列表(兼容旧版)',
		name: 'cohost_userids',
		type: 'string',
		displayOptions: {
			show: { resource: ['meeting'], operation: ['setCohost'] },
		},
		default: '',
		description: '已废弃：官方为 tmp_openid；仅兼容旧工作流，无法单独生效',
	},
	{
		displayName: '全体静音',
		name: 'rc_mute_all',
		type: 'boolean',
		displayOptions: { show: { resource: ['meeting'], operation: ['realcontrolSet'] } },
		default: false,
	},
	{
		displayName: '允许成员自行取消静音',
		name: 'rc_allow_unmute_self',
		type: 'boolean',
		displayOptions: { show: { resource: ['meeting'], operation: ['realcontrolSet'] } },
		default: true,
		description: '仅 mute_all=true 时生效',
	},
	{
		displayName: '成员入会静音',
		name: 'rc_enable_enter_mute',
		type: 'options',
		displayOptions: { show: { resource: ['meeting'], operation: ['realcontrolSet'] } },
		options: [
			{ name: '关闭静音', value: 0 },
			{ name: '开启静音', value: 1 },
			{ name: '超过6人自动开启静音', value: 2 },
		],
		default: 0,
	},
	{
		displayName: '锁定会议',
		name: 'rc_meeting_locked',
		type: 'boolean',
		displayOptions: { show: { resource: ['meeting'], operation: ['realcontrolSet'] } },
		default: false,
	},
	{
		displayName: '隐藏会议号和密码',
		name: 'rc_hide_meeting_code_password',
		type: 'boolean',
		displayOptions: { show: { resource: ['meeting'], operation: ['realcontrolSet'] } },
		default: false,
	},
	{
		displayName: '聊天权限',
		name: 'rc_allow_chat',
		type: 'options',
		displayOptions: { show: { resource: ['meeting'], operation: ['realcontrolSet'] } },
		options: [
			{ name: '自由聊天', value: 0 },
			{ name: '仅公开聊天', value: 1 },
			{ name: '仅私聊主持人', value: 2 },
		],
		default: 0,
	},
	{
		displayName: '允许发起屏幕共享',
		name: 'rc_allow_share_screen',
		type: 'boolean',
		displayOptions: { show: { resource: ['meeting'], operation: ['realcontrolSet'] } },
		default: true,
	},
	{
		displayName: '仅企业成员可入会',
		name: 'rc_allow_external_user',
		type: 'boolean',
		displayOptions: { show: { resource: ['meeting'], operation: ['realcontrolSet'] } },
		default: false,
		description: 'true 表示仅企业成员可入会',
	},
	{
		displayName: '入会播放提示音',
		name: 'rc_play_ivr_on_join',
		type: 'boolean',
		displayOptions: { show: { resource: ['meeting'], operation: ['realcontrolSet'] } },
		default: false,
	},
	{
		displayName: '开启等候室',
		name: 'rc_enable_waiting_room',
		type: 'boolean',
		displayOptions: { show: { resource: ['meeting'], operation: ['realcontrolSet'] } },
		default: false,
	},
	{
		displayName: '会中控制扩展JSON',
		name: 'realcontrolJson',
		type: 'json',
		displayOptions: {
			show: { resource: ['meeting'], operation: ['realcontrolSet'] },
		},
		default: '{}',
		description: '其余字段与上方合并，JSON 优先',
	},
];
