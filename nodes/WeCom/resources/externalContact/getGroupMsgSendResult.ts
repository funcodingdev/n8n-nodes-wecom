import type { INodeProperties } from 'n8n-workflow';

const showOnly = {
	resource: ['externalContact'],
	operation: ['getGroupMsgSendResult'],
};

export const getGroupMsgSendResultDescription: INodeProperties[] = [
	{
		displayName: '群发消息ID',
		name: 'msgid',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: showOnly,
		},
		description: '群发消息的ID，通过获取群发记录列表接口返回',
	},
	{
		displayName: '发送成员UserID',
		name: 'userid',
		type: 'string',
				default: '',
		displayOptions: {
			show: showOnly,
		},
		description: '发送成员userid，通过获取群发成员发送任务列表接口返回；可与下方选择二选一',
	},
	{
		displayName: '发送成员(选择)',
		name: 'userid_selected',
		type: 'options',
		typeOptions: { loadOptionsMethod: 'getAllUsers' },
		default: '',
		displayOptions: {
			show: showOnly,
		},
		description: '与上方字符串二选一；均填写时以字符串为准',
	},
	{
		displayName: '每页数量',
		name: 'limit',
		type: 'number',
		typeOptions: {
			minValue: 1,
			maxValue: 1000,
			numberStepSize: 1,
		},
		default: 500,
		displayOptions: {
			show: showOnly,
		},
		description: '返回的最大记录数，整型，最大值1000，默认值500',
	},
	{
		displayName: '分页游标',
		name: 'cursor',
		type: 'string',
		default: '',
		displayOptions: {
			show: showOnly,
		},
		description: '用于分页查询的游标，由上一次调用返回，首次调用可不填',
	},
];
