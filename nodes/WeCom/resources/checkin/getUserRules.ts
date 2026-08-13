import type { INodeProperties } from 'n8n-workflow';

const showOnlyForGetUserRules = {
	resource: ['checkin'],
	operation: ['getUserRules'],
};

export const getUserRulesDescription: INodeProperties[] = [
	{
		displayName: '规则日期',
		name: 'datetime',
		type: 'dateTime',
		required: true,
		displayOptions: {
			show: showOnlyForGetUserRules,
		},
		default: '',
		description: '需要获取规则的日期。接口按该日期当天 0 点的 Unix 时间戳查询',
	},
	{
		displayName: '成员UserID列表',
		name: 'useridlist',
		type: 'string',
		required: true,
		displayOptions: {
			show: showOnlyForGetUserRules,
		},
		default: '',
		description: '需要获取打卡规则的用户列表，支持逗号、中文逗号、竖线或换行分隔，最多 100 个',
		placeholder: 'james,paul',
	},
];
