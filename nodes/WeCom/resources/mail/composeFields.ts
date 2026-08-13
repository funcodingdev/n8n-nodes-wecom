import type { INodeProperties } from 'n8n-workflow';

function show(operation: string, extra: Record<string, unknown> = {}) {
	return { resource: ['mail'], operation: [operation], ...extra };
}

function recipientCollection(
	operation: string,
	label: string,
	name: string,
): INodeProperties {
	return {
		displayName: label,
		name,
		type: 'fixedCollection',
		displayOptions: { show: show(operation) },
		default: {},
		placeholder: `添加${label}`,
		typeOptions: { multipleValues: true },
		options: [{
			displayName: label,
			name: 'recipients',
			values: [{
				displayName: '邮箱地址',
				name: 'email',
				type: 'string',
				required: true,
				default: '',
				placeholder: 'name@email.com',
			}],
		}],
	};
}

export function composeFields(operation: string): INodeProperties[] {
	return [
		{
			displayName: '邮件主题',
			name: 'subject',
			type: 'string',
			required: true,
			displayOptions: { show: show(operation) },
			default: '',
		},
		recipientCollection(operation, '收件人邮箱', 'toListCollection'),
		{
			displayName: '收件人UserID列表',
			name: 'to_userids',
			type: 'string',
			displayOptions: { show: show(operation) },
			default: '',
			placeholder: 'zhangsan,lisi',
			description: '与收件人邮箱至少填一类；与下方选择合并；可用逗号、中文逗号、竖线或换行分隔',
		},
		{
			displayName: '收件人(选择)',
			name: 'to_userids_selected',
			type: 'multiOptions',
			typeOptions: { loadOptionsMethod: 'getAllUsers' },
			displayOptions: { show: show(operation) },
			default: [],
			description: '与上方收件人 UserID 列表合并去重',
		},
		{
			displayName: '收件人 JSON',
			name: 'toUseridsJson',
			type: 'json',
			displayOptions: { show: show(operation) },
			default: '[]',
			description:
				'可选。非空数组时与上方列表/选择合并去重。支持 ["userid1"] 或 [{"userid":"userid1"}]',
		},
		recipientCollection(operation, '抄送邮箱', 'ccListCollection'),
		{
			displayName: '抄送UserID列表',
			name: 'cc_userids',
			type: 'string',
			displayOptions: { show: show(operation) },
			default: '',
			description: '与下方选择合并',
		},
		{
			displayName: '抄送人(选择)',
			name: 'cc_userids_selected',
			type: 'multiOptions',
			typeOptions: { loadOptionsMethod: 'getAllUsers' },
			displayOptions: { show: show(operation) },
			default: [],
			description: '与上方抄送 UserID 列表合并去重',
		},
		{
			displayName: '抄送人 JSON',
			name: 'ccUseridsJson',
			type: 'json',
			displayOptions: { show: show(operation) },
			default: '[]',
			description:
				'可选。非空数组时与上方列表/选择合并去重。支持 ["userid1"] 或 [{"userid":"userid1"}]',
		},
		recipientCollection(operation, '密送邮箱', 'bccListCollection'),
		{
			displayName: '密送UserID列表',
			name: 'bcc_userids',
			type: 'string',
			displayOptions: { show: show(operation) },
			default: '',
			description: '与下方选择合并',
		},
		{
			displayName: '密送人(选择)',
			name: 'bcc_userids_selected',
			type: 'multiOptions',
			typeOptions: { loadOptionsMethod: 'getAllUsers' },
			displayOptions: { show: show(operation) },
			default: [],
			description: '与上方密送 UserID 列表合并去重',
		},
		{
			displayName: '密送人 JSON',
			name: 'bccUseridsJson',
			type: 'json',
			displayOptions: { show: show(operation) },
			default: '[]',
			description:
				'可选。非空数组时与上方列表/选择合并去重。支持 ["userid1"] 或 [{"userid":"userid1"}]',
		},
		{
			displayName: '正文格式',
			name: 'contentType',
			type: 'options',
			displayOptions: { show: show(operation) },
			options: [
				{ name: 'HTML', value: 'html' },
				{ name: '纯文本', value: 'text' },
			],
			default: 'html',
		},
		{
			displayName: '邮件正文',
			name: 'content',
			type: 'string',
			required: true,
			displayOptions: { show: show(operation) },
			default: '',
			typeOptions: { rows: 6 },
		},
		{
			displayName: '开启ID转译',
			name: 'enable_id_trans',
			type: 'boolean',
			displayOptions: { show: show(operation) },
			default: false,
			description: '仅第三方应用需要',
		},
		{
			displayName: '附件',
			name: 'attachmentCollection',
			type: 'fixedCollection',
			displayOptions: { show: show(operation) },
			default: {},
			placeholder: '添加附件',
			typeOptions: { multipleValues: true },
			description: '最多 200 个；附件解码后与正文总大小不超过 50MiB',
			options: [{
				displayName: '附件',
				name: 'attachments',
				values: [
					{ displayName: '文件名', name: 'file_name', type: 'string', required: true, default: '' },
					{
						displayName: '文件内容(Base64)',
						name: 'content',
						type: 'string',
						required: true,
						default: '',
						description: '只填纯 Base64，不含 data URL 前缀',
					},
				],
			}],
		},
		{
			displayName: '附件列表 JSON',
			name: 'attachmentsJson',
			type: 'json',
			displayOptions: { show: show(operation) },
			default: '[]',
			description:
				'可选。非空数组时覆盖上方附件表单。支持 [{"file_name":"a.pdf","content":"<base64>"}]，最多 200 个',
		},
	];
}

export function scheduleFields(operation: string, noun: '日程' | '会议'): INodeProperties[] {
	const prefix = noun === '日程' ? 'cal' : 'meeting';
	return [
		{
			displayName: `${noun}方法`,
			name: 'scheduleMethod',
			type: 'options',
			required: true,
			displayOptions: { show: show(operation) },
			default: 'request',
			options: [
				{ name: '创建或修改', value: 'request' },
				{ name: '取消', value: 'cancel' },
			],
		},
		{
			displayName: `${noun}ID`,
			name: 'scheduleId',
			type: 'string',
			displayOptions: { show: show(operation) },
			default: '',
			description: `修改或取消${noun}时必填；留空则创建新${noun}`,
		},
		{
			displayName: `${noun}开始时间`,
			name: `${prefix}StartTime`,
			type: 'dateTime',
			required: true,
			displayOptions: { show: show(operation, { scheduleMethod: ['request'] }) },
			default: '',
		},
		{
			displayName: `${noun}结束时间`,
			name: `${prefix}EndTime`,
			type: 'dateTime',
			required: true,
			displayOptions: { show: show(operation, { scheduleMethod: ['request'] }) },
			default: '',
		},
		{
			displayName: `${noun}地点`,
			name: `${prefix}Location`,
			type: 'string',
			displayOptions: { show: show(operation, { scheduleMethod: ['request'] }) },
			default: '',
		},
		{
			displayName: '重复与提醒设置',
			name: 'reminderSettings',
			type: 'collection',
			displayOptions: { show: show(operation, { scheduleMethod: ['request'] }) },
			default: {},
			placeholder: '添加设置',
			options: [
				{ displayName: '开启提醒', name: 'is_remind', type: 'boolean', default: true },
				{ displayName: '提前提醒分钟数', name: 'remind_before_event_mins', type: 'number', default: 15 },
				{ displayName: '时区UTC偏移', name: 'timezone', type: 'number', typeOptions: { minValue: -12, maxValue: 12 }, default: 8 },
				{ displayName: '开启重复', name: 'is_repeat', type: 'boolean', default: false },
				{ displayName: '自定义重复', name: 'is_custom_repeat', type: 'boolean', default: false },
				{
					displayName: '重复类型', name: 'repeat_type', type: 'options', default: 0,
					options: [
						{ name: '每日', value: 0 }, { name: '每周', value: 1 },
						{ name: '每月', value: 2 }, { name: '每年', value: 5 },
					],
				},
				{ displayName: '重复间隔', name: 'repeat_interval', type: 'number', typeOptions: { minValue: 1 }, default: 1 },
				{ displayName: '每周重复日', name: 'repeat_day_of_week', type: 'string', default: '', description: '1–7，可使用逗号、中文逗号、竖线或换行分隔' },
				{ displayName: '每月重复日', name: 'repeat_day_of_month', type: 'string', default: '', description: '1–31' },
				{ displayName: '每年重复月份', name: 'repeat_month_of_year', type: 'string', default: '', description: '1–12' },
				{ displayName: '重复结束时间', name: 'repeat_until', type: 'dateTime', default: '' },
			],
		},
	];
}

export function scheduleAdminField(operation: string): INodeProperties {
	return {
		displayName: '日程管理员UserID列表',
		name: 'schedule_admin_userids',
		type: 'string',
		displayOptions: { show: show(operation, { scheduleMethod: ['request'] }) },
		default: '',
		description: '最多 3 人，必须同时在收件人 UserID 中；与下方选择合并',
	};
}

export function scheduleAdminSelectedField(operation: string): INodeProperties {
	return {
		displayName: '日程管理员(选择)',
		name: 'schedule_admin_userids_selected',
		type: 'multiOptions',
		typeOptions: { loadOptionsMethod: 'getAllUsers' },
		displayOptions: { show: show(operation, { scheduleMethod: ['request'] }) },
		default: [],
		description: '与上方列表合并去重，合计最多 3 人',
	};
}

export function scheduleAdminsJsonField(operation: string): INodeProperties {
	return {
		displayName: '日程管理员 JSON',
		name: 'scheduleAdminsJson',
		type: 'json',
		displayOptions: { show: show(operation, { scheduleMethod: ['request'] }) },
		default: '[]',
		description:
			'可选。非空数组时与上方列表/选择合并去重，最多 3 人。支持 ["userid1"] 或 [{"userid":"userid1"}]',
	};
}

export function meetingFields(operation: string): INodeProperties[] {
	return [
		{
			displayName: '主持人UserID列表',
			name: 'meeting_host_userids',
			type: 'string',
			displayOptions: { show: show(operation, { scheduleMethod: ['request'] }) },
			default: '',
			description: '最多 10 人，必须同时在收件人 UserID 中；与下方选择合并',
		},
		{
			displayName: '主持人(选择)',
			name: 'meeting_host_userids_selected',
			type: 'multiOptions',
			typeOptions: { loadOptionsMethod: 'getAllUsers' },
			displayOptions: { show: show(operation, { scheduleMethod: ['request'] }) },
			default: [],
			description: '与上方列表合并去重，合计最多 10 人',
		},
		{
			displayName: '主持人 JSON',
			name: 'meetingHostsJson',
			type: 'json',
			displayOptions: { show: show(operation, { scheduleMethod: ['request'] }) },
			default: '[]',
			description:
				'可选。非空数组时与上方列表/选择合并去重，最多 10 人。支持 ["userid1"] 或 [{"userid":"userid1"}]',
		},
		{
			displayName: '会议管理员UserID',
			name: 'meeting_admin_userid',
			type: 'string',
			displayOptions: { show: show(operation, { scheduleMethod: ['request'] }) },
			default: '',
			description: '仅能指定 1 人，必须同时在收件人 UserID 中；可与下方选择二选一',
		},
		{
			displayName: '会议管理员(选择)',
			name: 'meeting_admin_userid_selected',
			type: 'options',
			typeOptions: { loadOptionsMethod: 'getAllUsers' },
			displayOptions: { show: show(operation, { scheduleMethod: ['request'] }) },
			default: '',
			description: '与上方字符串二选一；均填写时以字符串为准',
		},
		{
			displayName: '会议选项',
			name: 'meetingOptions',
			type: 'collection',
			displayOptions: { show: show(operation, { scheduleMethod: ['request'] }) },
			default: {},
			placeholder: '添加选项',
			options: [
				{ displayName: '入会密码', name: 'password', type: 'string', typeOptions: { password: true }, default: '', description: '4–6 位数字' },
				{
					displayName: '自动录制', name: 'auto_record', type: 'options', default: 0,
					options: [{ name: '不录制', value: 0 }, { name: '本地录制', value: 1 }, { name: '云录制', value: 2 }],
				},
				{ displayName: '开启等候室', name: 'enable_waiting_room', type: 'boolean', default: false },
				{ displayName: '允许主持人前入会', name: 'allow_enter_before_host', type: 'boolean', default: true },
				{
					displayName: '入会限制', name: 'enter_restraint', type: 'options', default: 0,
					options: [{ name: '所有人', value: 0 }, { name: '仅企业内部用户', value: 2 }],
				},
				{ displayName: '开启屏幕水印', name: 'enable_screen_watermark', type: 'boolean', default: false },
				{
					displayName: '入会静音', name: 'enable_enter_mute', type: 'options', default: 2,
					options: [{ name: '关闭', value: 0 }, { name: '开启', value: 1 }, { name: '超过6人后自动开启', value: 2 }],
				},
				{
					displayName: '会议开始提醒范围', name: 'remind_scope', type: 'options', default: 2,
					options: [{ name: '不提醒', value: 1 }, { name: '仅主持人', value: 2 }, { name: '所有成员', value: 3 }],
				},
				{
					displayName: '水印类型', name: 'water_mark_type', type: 'options', default: 0,
					options: [{ name: '单排', value: 0 }, { name: '多排', value: 1 }],
				},
			],
		},
	];
}
