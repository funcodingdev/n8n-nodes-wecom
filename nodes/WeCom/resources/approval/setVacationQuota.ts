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
		description: 'User ID of the employee',
		hint: '员工的UserID',
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
		description: 'Vacation configuration ID',
		hint: '假期配置ID',
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
		description: 'Remaining vacation duration in seconds',
		hint: '剩余假期时长（秒）',
	},
	{
		displayName: '备注',
		name: 'remarks',
		type: 'string',
		displayOptions: {
			show: showOnlyForSetVacationQuota,
		},
		default: '',
		description: 'Remarks for the modification',
		hint: '修改备注',
	},
];

