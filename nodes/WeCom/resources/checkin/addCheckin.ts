import type { INodeProperties } from 'n8n-workflow';

const showOnlyForAddCheckin = {
	resource: ['checkin'],
	operation: ['addCheckin'],
};

export const addCheckinDescription: INodeProperties[] = [
	{
		displayName: '成员UserID',
		name: 'userid',
		type: 'string',
		displayOptions: {
			show: showOnlyForAddCheckin,
		},
		default: '',
		description:
			'需要补卡的员工UserID。<a href="https://developer.work.weixin.qq.com/document/path/95803" target="_blank">官方文档</a>；可与下方选择二选一',
	},
	{
		displayName: '成员(选择)',
		name: 'userid_selected',
		type: 'options',
		typeOptions: { loadOptionsMethod: 'getAllUsers' },
		default: '',
		displayOptions: {
			show: showOnlyForAddCheckin,
		},
		description: '与上方字符串二选一；均填写时以字符串为准',
	},
	{
		displayName: '应打卡日期',
		name: 'schedule_date_time',
		type: 'dateTime',
		required: true,
		displayOptions: {
			show: showOnlyForAddCheckin,
		},
		default: '',
		description: '应打卡日期，取当天 0 点的 Unix 时间戳（秒）。接口字段 schedule_date_time',
	},
	{
		displayName: '实际打卡时间',
		name: 'checkin_time',
		type: 'dateTime',
		required: true,
		displayOptions: {
			show: showOnlyForAddCheckin,
		},
		default: '',
		description: '实际打卡时间，Unix 时间戳（秒）。接口字段 checkin_time',
	},
	{
		displayName: '指定应打卡时间点',
		name: 'include_schedule_checkin_time',
		type: 'boolean',
		displayOptions: {
			show: showOnlyForAddCheckin,
		},
		default: false,
		description: '开启后发送相对于应打卡日期 0 点的偏移秒数；休息日、无规则或自由上下班可关闭',
	},
	{
		displayName: '应打卡时间点偏移(秒)',
		name: 'schedule_checkin_time',
		type: 'number',
		displayOptions: {
			show: {
				...showOnlyForAddCheckin,
				include_schedule_checkin_time: [true],
			},
		},
		default: 0,
		description:
			'相对应打卡日期 0 点的偏移秒数，如 9:00 为 32400。可通过「获取员工打卡规则」取得 work_sec/off_work_sec。休息日/无规则/自由上下班可不填',
	},
	{
		displayName: '备注',
		name: 'remark',
		type: 'string',
		displayOptions: {
			show: showOnlyForAddCheckin,
		},
		default: '',
		description: '备注信息，不超过 512 字节',
	},
];
