import type { INodeProperties } from 'n8n-workflow';

const showOnlyForGetAppChat = {
	resource: ['appChat'],
	operation: ['getAppChat'],
};

export const getAppChatDescription: INodeProperties[] = [
	{
		displayName: '群聊ID',
		name: 'chatid',
		type: 'string',
		displayOptions: {
			show: showOnlyForGetAppChat,
		},
		default: '',
		required: true,
		description: '群聊的唯一标识',
		hint: '群聊会话的 chatid',
	},
];

