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
		placeholder: 'mychat001',
		required: true,
		description:
			'群聊的唯一标识。<a href="https://developer.work.weixin.qq.com/document/path/98914" target="_blank">官方文档</a>',
	},
];
