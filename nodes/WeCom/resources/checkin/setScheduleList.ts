import type { INodeProperties } from 'n8n-workflow';

const showOnly = { resource: ['checkin'], operation: ['setScheduleList'] };

export const setScheduleListDescription: INodeProperties[] = [
	{
		displayName: '打卡规则ID',
		name: 'groupid',
		type: 'number',
		required: true,
		displayOptions: { show: showOnly },
		default: 1,
		description:
			'打卡规则的规则ID，可通过"获取打卡规则"等接口获取。<a href="https://developer.work.weixin.qq.com/document/path/93385" target="_blank">官方文档</a>',
		typeOptions: { minValue: 1 },
	},
	{
		displayName: '年月',
		name: 'yearmonth',
		type: 'number',
		required: true,
		displayOptions: { show: showOnly },
		default: 0,
		description: '排班的年月，格式为YYYYMM，如202501',
		placeholder: '202501',
	},
	{
		displayName: '排班输入方式',
		name: 'scheduleInputMode',
		type: 'options',
		displayOptions: { show: showOnly },
		options: [
			{ name: '表单', value: 'form' },
			{ name: 'JSON', value: 'json' },
		],
		default: 'form',
		description: '少量排班用表单；大批量可用 JSON 数组（items）',
	},
	{
		displayName: '排班信息',
		name: 'scheduleCollection',
		type: 'fixedCollection',
		displayOptions: { show: { ...showOnly, scheduleInputMode: ['form'] } },
		default: {},
		placeholder: '添加排班',
		typeOptions: { multipleValues: true },
		description: '排班信息列表；至少 1 条',
		options: [
			{
				displayName: '排班项',
				name: 'schedules',
				values: [
					{
						displayName: '成员UserID',
						name: 'userid',
						type: 'string',
						default: '',
						description: '成员的 UserID；可与下方选择二选一',
					},
					{
						displayName: '成员(选择)',
						name: 'userid_selected',
						type: 'options',
						typeOptions: { loadOptionsMethod: 'getAllUsers' },
						default: '',
						description: '与上方字符串二选一；均填写时以字符串为准',
					},
					{
						displayName: '日期',
						name: 'day',
						type: 'number',
						default: 1,
						required: true,
						description: '当月的日期，从1开始',
						typeOptions: { minValue: 1, maxValue: 31 },
					},
					{
						displayName: '班次ID',
						name: 'schedule_id',
						type: 'number',
						default: 0,
						required: true,
						description:
							'schedule_id，来自打卡规则 schedulelist；0 表示休息。可通过获取员工打卡规则取得',
						typeOptions: { minValue: 0 },
					},
				],
			},
		],
	},
	{
		displayName: '排班信息 JSON',
		name: 'scheduleListJson',
		type: 'json',
		displayOptions: { show: { ...showOnly, scheduleInputMode: ['json'] } },
		default: '[{"userid":"zhangsan","day":1,"schedule_id":1}]',
		description:
			'items 数组。每项含 userid、day（1–31）、schedule_id（0 表示休息）。JSON 非空时覆盖表单',
	},
];
