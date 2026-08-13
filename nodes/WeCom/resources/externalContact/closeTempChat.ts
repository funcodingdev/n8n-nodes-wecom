import type { INodeProperties } from 'n8n-workflow';

const showOnly = {
	resource: ['externalContact'],
	operation: ['closeTempChat'],
};

export const closeTempChatDescription: INodeProperties[] = [
	{
		displayName: '企业成员UserID',
		name: 'userid',
		type: 'string',
		default: '',
		displayOptions: { show: showOnly },
		description: '企业成员的userid；可与下方选择二选一',
		placeholder: 'zhangyisheng',
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
		displayName: '客户外部联系人UserID',
		name: 'external_userid',
		type: 'string',
		required: true,
		default: '',
		displayOptions: { show: showOnly },
		description: '客户的外部联系人userid。请保证传入的企业成员和客户之间有仍然有效的临时会话，通过其他方式的添加外部联系人无法通过此接口关闭会话',
		placeholder: 'woAJ2GCAAAXtWyujaWJHDDGi0mACHAAA',
	},
];
