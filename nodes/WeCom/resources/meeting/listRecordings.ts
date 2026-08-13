import type { INodeProperties } from 'n8n-workflow';

const showOnly = { resource: ['meeting'], operation: ['listRecordings'] };

export const listRecordingsDescription: INodeProperties[] = [
	{
		displayName: '会议ID',
		name: 'meetingid',
		type: 'string',
		displayOptions: { show: showOnly },
		default: '',
		description:
			'meetingid 优先。与 meeting_code / userid 三选一。<a href="https://developer.work.weixin.qq.com/document/path/98192" target="_blank">官方文档</a>',
	},
	{
		displayName: '入会码',
		name: 'meeting_code',
		type: 'string',
		displayOptions: { show: showOnly },
		default: '',
		description: 'meeting_code，meetingid 为空时可用',
	},
	{
		displayName: '成员UserID',
		name: 'userid',
		type: 'string',
		displayOptions: { show: showOnly },
		default: '',
		description: 'userid，查询该用户作为创建者的录制；可与下方选择二选一',
	},
	{
		displayName: '成员(选择)',
		name: 'userid_selected',
		type: 'options',
		typeOptions: { loadOptionsMethod: 'getAllUsers' },
		default: '',
		displayOptions: { show: showOnly },
		description: '与上方字符串二选一；均填写时以字符串为准',
	},
	{
		displayName: '开始时间',
		name: 'start_time',
		type: 'dateTime',
		required: true,
		displayOptions: { show: showOnly },
		default: '',
		description: '查询起始时间，区间跨度不超过 31 天',
	},
	{
		displayName: '结束时间',
		name: 'end_time',
		type: 'dateTime',
		required: true,
		displayOptions: { show: showOnly },
		default: '',
		description: '查询结束时间',
	},
	{
		displayName: '分页游标',
		name: 'cursor',
		type: 'string',
		displayOptions: { show: showOnly },
		default: '',
	},
	{
		displayName: '每页数量',
		name: 'size',
		type: 'number',
		displayOptions: { show: showOnly },
		default: 10,
		description: 'limit，默认 10，最大 20',
		typeOptions: { minValue: 1, maxValue: 20 },
	},
];
