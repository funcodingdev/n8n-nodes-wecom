import type { INodeProperties } from 'n8n-workflow';

const showOnly = {
	resource: ['externalContact'],
	operation: ['getMomentCustomerList'],
};

export const getMomentCustomerListDescription: INodeProperties[] = [
	{
		displayName: '朋友圈ID',
		name: 'moment_id',
		type: 'string',
		required: true,
		default: '',
		displayOptions: { show: showOnly },
	},
	{
		displayName: '发表成员UserID',
		name: 'userid',
		type: 'string',
				default: '',
		displayOptions: { show: showOnly },
		description: '企业发表成员userid。如果是企业创建的朋友圈，可以通过获取客户朋友圈企业发表的列表获取已发表成员userid，如果是个人创建的朋友圈，创建人userid就是企业发表成员userid；可与下方选择二选一',
	},
	{
		displayName: '发表成员(选择)',
		name: 'userid_selected',
		type: 'options',
		typeOptions: { loadOptionsMethod: 'getAllUsers' },
		default: '',
		displayOptions: { show: showOnly },
		description: '与上方字符串二选一；均填写时以字符串为准',
	},
	{
		displayName: '分页游标',
		name: 'cursor',
		type: 'string',
		default: '',
		displayOptions: { show: showOnly },
		description: '用于分页查询的游标，字符串类型，由上一次调用返回，首次调用可不填',
	},
	{
		displayName: '每页数量',
		name: 'limit',
		type: 'number',
		typeOptions: { minValue: 1, maxValue: 1000, numberStepSize: 1 },
		default: 500,
		displayOptions: { show: showOnly },
		description: '返回的最大记录数，整型，最大值1000，默认值500',
	},
];
