import type { INodeProperties } from 'n8n-workflow';

const showOnlyForSendText = {
	resource: ['pushMessage'],
	operation: ['sendText'],
};

export const sendTextDescription: INodeProperties[] = [
	{
		displayName: '消息内容',
		name: 'content',
		type: 'string',
		typeOptions: {
			rows: 4,
		},
		displayOptions: {
			show: showOnlyForSendText,
		},
		default: '',
		required: true,
		description: '文本消息内容',
		hint: '支持换行、@成员等功能',
	},
	{
		displayName: '@成员',
		name: 'mentionedList',
		type: 'string',
		displayOptions: {
			show: showOnlyForSendText,
		},
		default: '',
		description: '要@的成员userid列表，多个用|分隔，@all表示提醒所有人',
		hint: '例如: zhangsan|lisi 或 @all',
	},
	{
		displayName: '@手机号',
		name: 'mentionedMobileList',
		type: 'string',
		displayOptions: {
			show: showOnlyForSendText,
		},
		default: '',
		description: '要@的成员手机号列表，多个用|分隔',
		hint: '例如: 13800000000|13900000000',
	},
];

