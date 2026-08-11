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
		required: true,
		displayOptions: {
			show: showOnlyForSetVacationQuota,
		},
		default: '',
		description: '要修改假期余额的成员UserID',
	},
	{
		displayName: '假期配置ID',
		name: 'vacation_id',
		type: 'string',
		required: true,
		displayOptions: {
			show: showOnlyForSetVacationQuota,
		},
		default: '',
		description: '假期类型的配置ID，可通过获取假期配置接口获取',
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
		description:
			'leftduration，单位秒；按小时请假须为 360 的倍数，按天请假须为 8640 的倍数',
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

