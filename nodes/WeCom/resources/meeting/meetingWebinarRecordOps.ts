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
		displayName: '嘉宾列表JSON',
		name: 'guestsJson',
		type: 'json',
		displayOptions: {
			show: { resource: ['meeting'], operation: ['webinarUpdateGuestList'] },
		},
		default: '[]',
		description: '嘉宾数组，字段见官方「更新网络研讨会嘉宾列表」',
	},
	{
		displayName: '报名/审批JSON',
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
		description: '与会议 ID 合并的请求字段，字段名与官方文档一致',
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
		description: '其余可选字段（如 media_setting、分享配置等），与上方字段合并，JSON 优先',
	},
];
