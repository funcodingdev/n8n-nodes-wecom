import type { INodeProperties } from 'n8n-workflow';

const showOnlyForSendText = {
	resource: ['appChat'],
	operation: ['sendText'],
};

export const sendTextDescription: INodeProperties[] = [
	{
		displayName: '群聊ID',
		name: 'chatid',
		type: 'string',
		displayOptions: {
			show: showOnlyForSendText,
		},
		default: '',
		required: true,
		description: '群聊的唯一标识',
		hint: '群聊会话的 chatid',
	},
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
		hint: '支持换行符，最长不超过2048个字节',
	},
	{
		displayName: '保密消息',
		name: 'safe',
		type: 'boolean',
		displayOptions: {
			show: showOnlyForSendText,
		},
		default: false,
		description: 'Whether the message is confidential. 0 means no, 1 means yes.',
		hint: '保密消息会话中的消息在发送后不会显示在聊天记录中',
	},
];

