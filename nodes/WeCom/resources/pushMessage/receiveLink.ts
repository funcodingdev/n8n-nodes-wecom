import type { INodeProperties } from 'n8n-workflow';

const showOnlyForReceiveLink = {
	resource: ['pushMessage'],
	operation: ['receiveLink'],
};

export const receiveLinkDescription: INodeProperties[] = [
	{
		displayName: '消息内容',
		name: 'messageData',
		type: 'json',
		displayOptions: {
			show: showOnlyForReceiveLink,
		},
		default: '{}',
		description: '接收到的链接消息数据（JSON格式）',
		hint: '包含FromUserName、ToUserName、Title、Description、Url等字段的消息体',
		required: true,
	},
];

export interface IReceiveLinkMessage {
	ToUserName: string;
	FromUserName: string;
	CreateTime: number;
	MsgType: 'link';
	Title: string;
	Description: string;
	Url: string;
	PicUrl: string;
	MsgId: string;
	AgentID: number;
}

