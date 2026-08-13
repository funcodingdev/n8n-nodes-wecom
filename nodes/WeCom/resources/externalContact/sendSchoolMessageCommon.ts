import type { INodeProperties } from 'n8n-workflow';

const showOnlyForSendSchoolMessage = {
	resource: ['externalContact'],
	operation: ['sendSchoolMessage'],
};

export const sendSchoolMessageCommonDescription: INodeProperties[] = [
	{
		displayName: '学校管理员必须先将该应用配置为“家长可使用的应用”。如果部分接收人无权限或不存在，其他有效接收人仍会收到通知，并在响应中返回无效名单。',
		name: 'permissionNotice',
		type: 'notice',
		default: '',
		displayOptions: { show: showOnlyForSendSchoolMessage },
	},
	{
		displayName: '消息类型',
		name: 'msgtype',
		type: 'options',
		displayOptions: {
			show: showOnlyForSendSchoolMessage,
		},
		options: [
			{
				name: '文本消息',
				value: 'text',
			},
			{
				name: '图片消息',
				value: 'image',
			},
			{
				name: '语音消息',
				value: 'voice',
			},
			{
				name: '视频消息',
				value: 'video',
			},
			{
				name: '文件消息',
				value: 'file',
			},
			{
				name: '图文消息',
				value: 'news',
			},
			{
				name: '图文消息 (mpnews)',
				value: 'mpnews',
			},
			{
				name: '小程序消息',
				value: 'miniprogram',
			},
		],
		default: 'text',
		required: true,
		description:
			'选择要发送的消息类型。<a href="https://developer.work.weixin.qq.com/document/path/92320" target="_blank">官方文档</a>。选择消息类型',
	},
	{
		displayName: '应用 ID',
		name: 'agentid',
		type: 'number',
		default: 0,
		typeOptions: { minValue: 0, numberStepSize: 1 },
		displayOptions: { show: showOnlyForSendSchoolMessage },
		description: '企业应用的正整数 ID，可在应用设置页面查看；可与下方选择二选一',
	},
	{
		displayName: '应用(选择)',
		name: 'agentid_selected',
		type: 'options',
		typeOptions: { loadOptionsMethod: 'getAgents' },
		displayOptions: { show: showOnlyForSendSchoolMessage },
		default: '',
		description: '与上方数字二选一；均填写时以数字为准',
	},
	{
		displayName: '指定发送对象',
		name: 'recv_scope',
		type: 'options',
		displayOptions: {
			show: showOnlyForSendSchoolMessage,
		},
		options: [
			{
				name: '发送给家长',
				value: 0,
			},
			{
				name: '发送给学生',
				value: 1,
			},
			{
				name: '发送给家长和学生',
				value: 2,
			},
		],
		default: 0,
		description: '决定学生与部门列表最终覆盖家长、学生或两者',
	},
	{
		displayName: '家长列表',
		name: 'to_parent_userid',
		type: 'string',
		displayOptions: {
			show: { ...showOnlyForSendSchoolMessage, toall: [false], recv_scope: [0, 2] },
		},
		default: '',
		placeholder: 'parent_userid1,parent_userid2',
		description: '支持逗号、竖线或换行分隔，自动去重，最多 1000 个',
	},
	{
		displayName: '学生列表',
		name: 'to_student_userid',
		type: 'string',
		displayOptions: {
			show: { ...showOnlyForSendSchoolMessage, toall: [false] },
		},
		default: '',
		placeholder: 'student_userid1,student_userid2',
		description: '支持逗号、竖线或换行分隔，自动去重，最多 1000 个；实际接收对象由“指定发送对象”决定',
	},
	{
		displayName: '部门列表',
		name: 'to_party',
		type: 'string',
		displayOptions: {
			show: { ...showOnlyForSendSchoolMessage, toall: [false] },
		},
		default: '',
		placeholder: 'partyid1,partyid2',
		description: '支持逗号、竖线或换行分隔，自动去重，最多 100 个；实际接收对象由“指定发送对象”决定',
	},
	{
		displayName: '发送给所有人',
		name: 'toall',
		type: 'boolean',
		displayOptions: {
			show: showOnlyForSendSchoolMessage,
		},
		default: false,
		description: '开启后忽略家长、学生和部门列表，按“指定发送对象”覆盖全校',
	},
	{
		displayName: '开启重复消息检查',
		name: 'enable_duplicate_check',
		type: 'boolean',
		displayOptions: {
			show: showOnlyForSendSchoolMessage,
		},
		default: false,
		description: '开启后，在指定间隔内不会重复投递内容相同的请求',
	},
	{
		displayName: '重复消息检查时间间隔',
		name: 'duplicate_check_interval',
		type: 'number',
		displayOptions: {
			show: {
				...showOnlyForSendSchoolMessage,
				enable_duplicate_check: [true],
			},
		},
		default: 1800,
		typeOptions: { minValue: 1, maxValue: 14400 },
		description: '单位为秒，范围 1–14400，默认 1800 秒',
	},
];
