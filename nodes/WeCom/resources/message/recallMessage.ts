import type { INodeProperties } from 'n8n-workflow';

const showOnlyRecallMessage = {
	resource: ['message'],
	operation: ['recallMessage'],
};

export const recallMessageDescription: INodeProperties[] = [
	{
		displayName: 'Msgid',
		name: 'msgid',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: showOnlyRecallMessage,
		},
		description: '消息 ID。从发送消息接口返回的 msgid',
	},
];

