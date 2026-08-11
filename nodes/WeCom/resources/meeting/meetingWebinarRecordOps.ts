import type { INodeProperties } from 'n8n-workflow';

/** 网络研讨会 + 录制/转写：结构化表单（一等操作） */

export const webinarRecordOperationOptions = [
	// --- 网络研讨会 ---
	{
		name: '[网络研讨会] 创建研讨会',
		value: 'webinarCreate',
		action: '创建网络研讨会',
		description: '预定一场网络研讨会',
	},
	{
		name: '[网络研讨会] 获取研讨会详情',
		value: 'webinarGet',
		action: '获取网络研讨会详情',
		description: '按会议 ID 或会议号查询研讨会',
	},
	{
		name: '[网络研讨会] 修改研讨会',
		value: 'webinarUpdate',
		action: '修改网络研讨会',
		description: '修改已创建的网络研讨会',
	},
	{
		name: '[网络研讨会] 取消研讨会',
		value: 'webinarCancel',
		action: '取消网络研讨会',
		description: '取消指定网络研讨会',
	},
	{
		name: '[网络研讨会] 获取嘉宾列表',
		value: 'webinarListGuest',
		action: '获取研讨会嘉宾列表',
		description: '获取网络研讨会嘉宾',
	},
	{
		name: '[网络研讨会] 更新嘉宾列表',
		value: 'webinarUpdateGuestList',
		action: '更新研讨会嘉宾列表',
		description: '覆盖更新研讨会嘉宾',
	},
	{
		name: '[网络研讨会] 更新暖场配置',
		value: 'webinarUpdateWarmUp',
		action: '更新暖场配置',
		description: '管理研讨会暖场配置',
	},
	{
		name: '[网络研讨会] 获取报名配置',
		value: 'webinarEnrollGetConfig',
		action: '获取研讨会报名配置',
		description: '获取网络研讨会报名配置',
	},
	{
		name: '[网络研讨会] 修改报名配置',
		value: 'webinarEnrollSetConfig',
		action: '修改研讨会报名配置',
		description: '修改网络研讨会报名配置',
	},
	{
		name: '[网络研讨会] 获取报名信息',
		value: 'webinarEnrollList',
		action: '获取研讨会报名信息',
		description: '分页获取研讨会报名列表',
	},
	{
		name: '[网络研讨会] 审批报名',
		value: 'webinarEnrollApprove',
		action: '审批研讨会报名',
		description: '审批网络研讨会报名',
	},
	{
		name: '[网络研讨会] 导入报名',
		value: 'webinarEnrollImport',
		action: '导入研讨会报名',
		description: '批量导入研讨会报名信息',
	},
	{
		name: '[网络研讨会] 删除报名',
		value: 'webinarEnrollDelete',
		action: '删除研讨会报名',
		description: '删除研讨会报名信息',
	},
	{
		name: '[网络研讨会] 按临时OpenID查询报名',
		value: 'webinarEnrollQueryByTmpOpenid',
		action: '按临时OpenID查询报名',
		description: '按临时 OpenID 查询研讨会报名',
	},
	// --- 录制扩展 / 转写 ---
	{
		name: '[录制] 删除会议录制',
		value: 'recordDelete',
		action: '删除会议录制',
		description: '删除会议录制数据',
	},
	{
		name: '[录制] 删除单个录制文件',
		value: 'recordDeleteFile',
		action: '删除录制文件',
		description: '删除指定录制文件',
	},
	{
		name: '[录制] 获取录制文件列表',
		value: 'recordGetFileList',
		action: '获取录制文件列表',
		description: '获取会议录制文件列表',
	},
	{
		name: '[录制] 获取录制访问统计',
		value: 'recordGetStatistics',
		action: '获取录制访问统计',
		description: '获取录制文件访问统计',
	},
	{
		name: '[录制] 更新分享设置',
		value: 'recordUpdateSharingConfig',
		action: '更新录制分享设置',
		description: '修改录制共享设置',
	},
	{
		name: '[录制] 获取转写详情',
		value: 'recordTranscriptGetDetail',
		action: '获取录制转写详情',
		description: '获取录制转写段落详情',
	},
	{
		name: '[录制] 获取转写段落列表',
		value: 'recordTranscriptGetParagraphList',
		action: '获取转写段落列表',
		description: '获取录制转写段落信息',
	},
	{
		name: '[录制] 搜索转写内容',
		value: 'recordTranscriptSearch',
		action: '搜索转写内容',
		description: '在录制转写中搜索文本',
	},
];

const webinarMeetingOps = [
	'webinarGet',
	'webinarUpdate',
	'webinarCancel',
	'webinarListGuest',
	'webinarUpdateGuestList',
	'webinarUpdateWarmUp',
	'webinarEnrollGetConfig',
	'webinarEnrollSetConfig',
	'webinarEnrollList',
	'webinarEnrollApprove',
	'webinarEnrollImport',
	'webinarEnrollDelete',
	'webinarEnrollQueryByTmpOpenid',
];

const recordMeetingOps = [
	'recordDelete',
	'recordDeleteFile',
	'recordGetFileList',
	'recordGetStatistics',
	'recordUpdateSharingConfig',
	'recordTranscriptGetDetail',
	'recordTranscriptGetParagraphList',
	'recordTranscriptSearch',
];

const recordFileOps = [
	'recordDeleteFile',
	'recordUpdateSharingConfig',
	'recordTranscriptGetDetail',
	'recordTranscriptGetParagraphList',
	'recordTranscriptSearch',
];

export const meetingWebinarRecordOpsDescription: INodeProperties[] = [
	// create webinar
	{
		displayName: '管理员UserID',
		name: 'admin_userid',
		type: 'string',
		required: true,
		displayOptions: { show: { resource: ['meeting'], operation: ['webinarCreate'] } },
		default: '',
		description: '网络研讨会管理员 userid',
	},
	{
		displayName: '主题',
		name: 'title',
		type: 'string',
		required: true,
		displayOptions: { show: { resource: ['meeting'], operation: ['webinarCreate', 'webinarUpdate'] } },
		default: '',
		description: '研讨会主题，1～255 个字符',
	},
	{
		displayName: '开始时间',
		name: 'start_time',
		type: 'dateTime',
		required: true,
		displayOptions: { show: { resource: ['meeting'], operation: ['webinarCreate'] } },
		default: '',
		description: '开始时间（将转为秒级时间戳）；不能早于当前时间约半小时以上',
	},
	{
		displayName: '结束时间',
		name: 'end_time',
		type: 'dateTime',
		required: true,
		displayOptions: { show: { resource: ['meeting'], operation: ['webinarCreate'] } },
		default: '',
		description: '结束时间（将转为秒级时间戳）',
	},
	{
		displayName: '观众限制类型',
		name: 'admission_type',
		type: 'options',
		required: true,
		displayOptions: { show: { resource: ['meeting'], operation: ['webinarCreate'] } },
		options: [
			{ name: '公开', value: 0 },
			{ name: '报名', value: 1 },
			{ name: '密码', value: 2 },
		],
		default: 0,
		description: '0 公开 / 1 报名 / 2 密码',
	},
	{
		displayName: '允许观众观看回放',
		name: 'playback_for_audience',
		type: 'boolean',
		displayOptions: { show: { resource: ['meeting'], operation: ['webinarCreate'] } },
		default: false,
		description: '开启时需配合云录制（auto_record_type=cloud）',
	},
	{
		displayName: '主办方',
		name: 'sponsor',
		type: 'string',
		displayOptions: { show: { resource: ['meeting'], operation: ['webinarCreate', 'webinarUpdate'] } },
		default: '',
		description: '主办方名称，1～40 个字符',
	},
	{
		displayName: '观众密码',
		name: 'password',
		type: 'string',
		displayOptions: { show: { resource: ['meeting'], operation: ['webinarCreate'] } },
		default: '',
		description: '观众限制为密码时必填，4～6 位数字',
	},
	{
		displayName: '主持人UserID列表',
		name: 'host_userids',
		type: 'string',
		displayOptions: { show: { resource: ['meeting'], operation: ['webinarCreate', 'webinarUpdate'] } },
		default: '',
		description: '主持人 userid，逗号分隔；默认管理员',
	},
	// shared meeting id / code
	{
		displayName: '会议ID',
		name: 'webinar_meetingid',
		type: 'string',
		displayOptions: {
			show: { resource: ['meeting'], operation: [...webinarMeetingOps, ...recordMeetingOps] },
		},
		default: '',
		description: '会议 / 研讨会 ID（webinarGet 可与会议号二选一）',
	},
	{
		displayName: '会议号',
		name: 'meeting_code',
		type: 'string',
		displayOptions: {
			show: { resource: ['meeting'], operation: ['webinarGet', 'recordGetFileList'] },
		},
		default: '',
		description: '会议号；获取详情时与会议 ID 二选一',
	},
	{
		displayName: '录制文件ID',
		name: 'webinar_record_file_id',
		type: 'string',
		displayOptions: { show: { resource: ['meeting'], operation: recordFileOps } },
		default: '',
		description: '录制文件 ID',
	},
	{
		displayName: '成员UserID',
		name: 'record_userid',
		type: 'string',
		displayOptions: { show: { resource: ['meeting'], operation: ['recordGetFileList'] } },
		default: '',
		description: '查询成员录制列表时填写；与会议 ID / 会议号三选一',
	},
	{
		displayName: '查询开始时间',
		name: 'record_start_time',
		type: 'dateTime',
		displayOptions: { show: { resource: ['meeting'], operation: ['recordGetFileList'] } },
		default: '',
		description: '查询起始时间；区间跨度不超过 31 天',
	},
	{
		displayName: '查询结束时间',
		name: 'record_end_time',
		type: 'dateTime',
		displayOptions: { show: { resource: ['meeting'], operation: ['recordGetFileList'] } },
		default: '',
		description: '查询结束时间；区间跨度不超过 31 天',
	},
	{
		displayName: '搜索文本',
		name: 'transcript_text',
		type: 'string',
		displayOptions: {
			show: { resource: ['meeting'], operation: ['recordTranscriptSearch'] },
		},
		default: '',
		description: '要搜索的转写文本',
	},
	{
		displayName: '起始段落ID',
		name: 'transcript_pid',
		type: 'string',
		displayOptions: {
			show: {
				resource: ['meeting'],
				operation: ['recordTranscriptGetDetail', 'recordTranscriptGetParagraphList'],
			},
		},
		default: '',
		description: '查询起始段落 ID，默认从 0 开始',
	},
	{
		displayName: '条数限制',
		name: 'webinar_limit',
		type: 'number',
		displayOptions: {
			show: {
				resource: ['meeting'],
				operation: [
					'webinarListGuest',
					'webinarEnrollList',
					'recordGetFileList',
					'recordTranscriptGetDetail',
					'recordTranscriptGetParagraphList',
				],
			},
		},
		default: 10,
		description: '单次返回条数限制',
	},
	{
		displayName: '游标',
		name: 'webinar_cursor',
		type: 'string',
		displayOptions: {
			show: {
				resource: ['meeting'],
				operation: ['webinarListGuest', 'webinarEnrollList', 'recordGetFileList'],
			},
		},
		default: '',
		description: '分页游标，首次可不填',
	},
	{
		displayName: '嘉宾列表',
		name: 'webinarGuestsCollection',
		type: 'fixedCollection',
		displayOptions: {
			show: { resource: ['meeting'], operation: ['webinarUpdateGuestList'] },
		},
		default: {},
		placeholder: '添加嘉宾',
		typeOptions: { multipleValues: true },
		options: [
			{
				displayName: '嘉宾',
				name: 'guests',
				values: [
					{
						displayName: '嘉宾类型',
						name: 'guest_type',
						type: 'options',
						options: [
							{ name: '内部嘉宾', value: 1 },
							{ name: '外部嘉宾', value: 2 },
						],
						default: 1,
					},
					{
						displayName: '成员UserID',
						name: 'userid',
						type: 'string',
						default: '',
						description: '内部嘉宾必填',
					},
					{
						displayName: '国家/地区代码',
						name: 'area',
						type: 'string',
						default: '86',
						description: '外部嘉宾必填，如 86',
					},
					{
						displayName: '手机号',
						name: 'phone_number',
						type: 'string',
						default: '',
						description: '外部嘉宾必填',
					},
					{
						displayName: '嘉宾名称',
						name: 'guest_name',
						type: 'string',
						default: '',
						description: '外部嘉宾必填',
					},
					{
						displayName: '邮箱',
						name: 'email',
						type: 'string',
						default: '',
					},
				],
			},
		],
	},
	{
		displayName: '嘉宾列表扩展JSON',
		name: 'guestsJson',
		type: 'json',
		displayOptions: {
			show: { resource: ['meeting'], operation: ['webinarUpdateGuestList'] },
		},
		default: '[]',
		description: '若填写非空数组则覆盖上方表单嘉宾列表',
	},
	{
		displayName: '审批方式',
		name: 'webinar_approve_type',
		type: 'options',
		displayOptions: {
			show: { resource: ['meeting'], operation: ['webinarEnrollSetConfig'] },
		},
		options: [
			{ name: '自动审批', value: 1 },
			{ name: '手动审批', value: 2 },
		],
		default: 1,
		description: 'approve_type',
	},
	{
		displayName: '是否收集问题',
		name: 'webinar_is_collect_question',
		type: 'options',
		displayOptions: {
			show: { resource: ['meeting'], operation: ['webinarEnrollSetConfig'] },
		},
		options: [
			{ name: '不收集', value: 1 },
			{ name: '收集', value: 2 },
		],
		default: 1,
		description: 'is_collect_question（研讨会：1 不收集 / 2 收集）',
	},
	{
		displayName: '企业成员无需报名',
		name: 'webinar_no_registration_needed_for_staff',
		type: 'boolean',
		displayOptions: {
			show: { resource: ['meeting'], operation: ['webinarEnrollSetConfig'] },
		},
		default: false,
	},
	{
		displayName: '研讨会报名问题',
		name: 'webinarEnrollQuestionsCollection',
		type: 'fixedCollection',
		displayOptions: {
			show: {
				resource: ['meeting'],
				operation: ['webinarEnrollSetConfig'],
				webinar_is_collect_question: [2],
			},
		},
		default: {},
		placeholder: '添加问题',
		typeOptions: { multipleValues: true },
		description: 'question_list',
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
					},
					{
						displayName: '选项(逗号分隔)',
						name: 'option_contents',
						type: 'string',
						default: '',
						placeholder: '选项A,选项B',
					},
				],
			},
		],
	},
	{
		displayName: '导入报名列表',
		name: 'webinarEnrollImportCollection',
		type: 'fixedCollection',
		displayOptions: {
			show: { resource: ['meeting'], operation: ['webinarEnrollImport'] },
		},
		default: {},
		placeholder: '添加报名成员',
		typeOptions: { multipleValues: true },
		description: 'enroll_list：userid 与手机号二选一',
		options: [
			{
				displayName: '成员',
				name: 'members',
				values: [
					{
						displayName: '成员UserID',
						name: 'userid',
						type: 'string',
						default: '',
					},
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
						displayName: '昵称',
						name: 'nick_name',
						type: 'string',
						default: '',
					},
				],
			},
		],
	},
	{
		displayName: '报名ID列表',
		name: 'webinar_enroll_id_list',
		type: 'string',
		displayOptions: {
			show: {
				resource: ['meeting'],
				operation: ['webinarEnrollApprove', 'webinarEnrollDelete'],
			},
		},
		default: '',
		placeholder: 'id1,id2',
		description: 'enroll_id_list，逗号分隔',
	},
	{
		displayName: '审批动作',
		name: 'webinar_enroll_action',
		type: 'options',
		displayOptions: {
			show: { resource: ['meeting'], operation: ['webinarEnrollApprove'] },
		},
		options: [
			{ name: '取消批准', value: 1 },
			{ name: '拒绝', value: 2 },
			{ name: '批准', value: 3 },
		],
		default: 3,
		description: 'action',
	},
	{
		displayName: '报名/审批扩展JSON',
		name: 'webinarEnrollJson',
		type: 'json',
		displayOptions: {
			show: {
				resource: ['meeting'],
				operation: [
					'webinarEnrollSetConfig',
					'webinarEnrollApprove',
					'webinarEnrollImport',
					'webinarEnrollDelete',
					'webinarEnrollQueryByTmpOpenid',
				],
			},
		},
		default: '{}',
		description: '其余字段（完整 question_list、导入数据等）与上方合并，JSON 优先',
	},
	{
		displayName: '会议录制ID',
		name: 'meeting_record_id',
		type: 'string',
		displayOptions: {
			show: {
				resource: ['meeting'],
				operation: ['recordGetStatistics', 'recordUpdateSharingConfig', 'recordDelete'],
			},
		},
		default: '',
		description: 'meeting_record_id；分享设置也可使用上方录制文件 ID 字段',
	},
	{
		displayName: '统计开始时间',
		name: 'record_stat_start_time',
		type: 'number',
		displayOptions: {
			show: { resource: ['meeting'], operation: ['recordGetStatistics'] },
		},
		default: 0,
		description: 'start_time，秒；默认最近 31 天',
	},
	{
		displayName: '统计结束时间',
		name: 'record_stat_end_time',
		type: 'number',
		displayOptions: {
			show: { resource: ['meeting'], operation: ['recordGetStatistics'] },
		},
		default: 0,
		description: 'end_time，秒；区间不超过 31 天',
	},
	{
		displayName: '暖场图片URL',
		name: 'warm_up_picture',
		type: 'string',
		displayOptions: {
			show: { resource: ['meeting'], operation: ['webinarUpdateWarmUp'] },
		},
		default: '',
		description: '与暖场视频二选一，同时传则以图片为准',
	},
	{
		displayName: '暖场视频URL',
		name: 'warm_up_video',
		type: 'string',
		displayOptions: {
			show: { resource: ['meeting'], operation: ['webinarUpdateWarmUp'] },
		},
		default: '',
	},
	{
		displayName: '允许暖场邀请成员',
		name: 'allow_attendees_invite_others',
		type: 'boolean',
		displayOptions: {
			show: { resource: ['meeting'], operation: ['webinarUpdateWarmUp'] },
		},
		default: true,
	},
	{
		displayName: '分享开关',
		name: 'sharing_enable_sharing',
		type: 'boolean',
		displayOptions: {
			show: { resource: ['meeting'], operation: ['recordUpdateSharingConfig'] },
		},
		default: true,
		description: 'sharing_config.enable_sharing',
	},
	{
		displayName: '分享权限类型',
		name: 'sharing_auth_type',
		type: 'options',
		displayOptions: {
			show: { resource: ['meeting'], operation: ['recordUpdateSharingConfig'] },
		},
		options: [
			{ name: '仅允许登录成员查看', value: 0 },
			{ name: '仅企业内成员可查看', value: 1 },
			{ name: '仅参会成员可查看', value: 2 },
			{ name: '全部成员可查看', value: 3 },
			{ name: '通过权限审批的成员可查看', value: 4 },
			{ name: '微信特邀链接成员可查看', value: 5 },
		],
		default: 0,
		description: 'sharing_auth_type',
	},
	{
		displayName: '开启分享密码',
		name: 'sharing_enable_password',
		type: 'boolean',
		displayOptions: {
			show: { resource: ['meeting'], operation: ['recordUpdateSharingConfig'] },
		},
		default: false,
	},
	{
		displayName: '分享密码',
		name: 'sharing_password',
		type: 'string',
		displayOptions: {
			show: {
				resource: ['meeting'],
				operation: ['recordUpdateSharingConfig'],
				sharing_enable_password: [true],
			},
		},
		default: '',
	},
	{
		displayName: '允许下载',
		name: 'sharing_allow_download',
		type: 'boolean',
		displayOptions: {
			show: { resource: ['meeting'], operation: ['recordUpdateSharingConfig'] },
		},
		default: false,
	},
	{
		displayName: '扩展请求JSON',
		name: 'webinarExtraJson',
		type: 'json',
		displayOptions: {
			show: {
				resource: ['meeting'],
				operation: [
					'webinarCreate',
					'webinarUpdate',
					'webinarUpdateWarmUp',
					'recordUpdateSharingConfig',
					'recordGetStatistics',
					'recordDelete',
				],
			},
		},
		default: '{}',
		description: '其余可选字段与上方合并，JSON 优先',
	},
];
