import type { INodeProperties } from 'n8n-workflow';

const showOnlyForReceiveText = {
	resource: ['pushMessage'],
	operation: ['receiveText'],
};

export const receiveTextDescription: INodeProperties[] = [
	{
		displayName: '消息内容',
		name: 'messageData',
		type: 'json',
		displayOptions: {
			show: showOnlyForReceiveText,
		},
		default: '{}',
		description: '接收到的文本消息数据（JSON格式）',
		hint: '包含FromUserName、ToUserName、Content等字段的消息体',
		required: true,
	},
];

export interface IReceiveTextMessage {
	ToUserName: string;
	FromUserName: string;
	CreateTime: number;
	MsgType: 'text';
	Content: string;
	MsgId: string;
	AgentID: number;
}

