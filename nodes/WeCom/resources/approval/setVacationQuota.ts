import type { INodeProperties } from 'n8n-workflow';

const showOnlyForSetVacationQuota = {
	resource: ['approval'],
	operation: ['setVacationQuota'],
};

export const setVacationQuotaDescription: INodeProperties[] = [
	{
		displayName: '成员UserID',
		name: 'userid',
		type: 'string',
		displayOptions: {
			show: showOnlyForSetVacationQuota,
		},
		default: '',
		description: '要修改假期余额的成员UserID；可与下方选择二选一',
	},
	{
		displayName: '成员(选择)',
		name: 'userid_selected',
		type: 'options',
		typeOptions: { loadOptionsMethod: 'getAllUsers' },
		default: '',
		displayOptions: {
			show: showOnlyForSetVacationQuota,
		},
		description: '与上方字符串二选一；均填写时以字符串为准',
	},
	{
		displayName: '假期配置ID',
		name: 'vacation_id',
		type: 'number',
		required: true,
		displayOptions: {
			show: showOnlyForSetVacationQuota,
		},
		default: 1,
		typeOptions: { minValue: 1 },
		description: 'vacation_id，可通过获取假期配置接口获取',
	},
	{
		displayName: '剩余假期时长',
		name: 'leftduration',
		type: 'number',
		required: true,
		displayOptions: {
			show: showOnlyForSetVacationQuota,
		},
		default: 0,
		typeOptions: { minValue: 0, maxValue: 86400000 },
		description: 'leftduration，单位秒；按小时请假须为 360 的倍数，按天请假须为 8640 的倍数',
	},
	{
		displayName: '假期时间刻度',
		name: 'time_attr',
		type: 'options',
		required: true,
		displayOptions: {
			show: showOnlyForSetVacationQuota,
		},
		options: [
			{ name: '按天请假', value: 0 },
			{ name: '按小时请假', value: 1 },
		],
		default: 0,
		description: 'time_attr，须与企业假期配置中的时间刻度一致',
	},
	{
		displayName: '备注',
		name: 'remarks',
		type: 'string',
		displayOptions: {
			show: showOnlyForSetVacationQuota,
		},
		default: '',
		description: '修改记录备注，不超过 200 字符',
	},
];
