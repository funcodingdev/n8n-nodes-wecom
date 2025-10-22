import type { INodeProperties } from 'n8n-workflow';

const showOnlyForSendKfEventMsg = {
	resource: ['kf'],
	operation: ['sendKfEventMsg'],
};

export const sendKfEventMsgDescription: INodeProperties[] = [
	{
		displayName: '消息来源',
		name: 'code',
		type: 'string',
		required: true,
		displayOptions: {
			show: showOnlyForSendKfEventMsg,
		},
		default: '',
		hint: '事件响应消息对应的code，通过事件推送下发',
	},
	{
		displayName: '消息类型',
		name: 'msgtype',
		type: 'options',
		required: true,
		displayOptions: {
			show: showOnlyForSendKfEventMsg,
		},
		options: [
			{
				name: '文本',
				value: 'text',
			},
			{
				name: '图文链接',
				value: 'msgmenu',
			},
		],
		default: 'text',
		hint: '消息类型',
	},
	{
		displayName: '消息内容',
		name: 'content',
		type: 'json',
		required: true,
		displayOptions: {
			show: showOnlyForSendKfEventMsg,
		},
		default: '{}',
		hint: '消息内容JSON',
	},
];

