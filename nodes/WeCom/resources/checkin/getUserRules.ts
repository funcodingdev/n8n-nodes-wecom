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
		displayOptions: {
			show: showOnlyForGetUserRules,
		},
		default: '',
		description: '需要获取打卡规则的用户列表，支持逗号/竖线/换行分隔，最多 100 个；与下方选择合并',
		placeholder: 'james,paul',
	},
	{
		displayName: '成员(选择)',
		name: 'useridlist_selected',
		type: 'multiOptions',
		typeOptions: { loadOptionsMethod: 'getAllUsers' },
		displayOptions: { show: showOnlyForGetUserRules },
		default: [],
		description: '与上方列表合并去重，合计最多 100 个',
	},
	{
		displayName: '成员列表 JSON',
		name: 'useridlistJson',
		type: 'json',
		displayOptions: { show: showOnlyForGetUserRules },
		default: '[]',
		description:
			'可选。非空数组时与上方列表/选择合并去重。支持 ["userid1"] 或 [{"userid":"userid1"}]',
	},
];

