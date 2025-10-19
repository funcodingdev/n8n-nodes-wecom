import type { INodeProperties } from 'n8n-workflow';

const showOnlyForReceiveImage = {
	resource: ['pushMessage'],
	operation: ['receiveImage'],
};

export const receiveImageDescription: INodeProperties[] = [
	{
		displayName: '消息内容',
		name: 'messageData',
		type: 'json',
		displayOptions: {
			show: showOnlyForReceiveImage,
		},
		default: '{}',
		description: '接收到的图片消息数据（JSON格式）',
		hint: '包含FromUserName、ToUserName、PicUrl、MediaId等字段的消息体',
		required: true,
	},
];

export interface IReceiveImageMessage {
	ToUserName: string;
	FromUserName: string;
	CreateTime: number;
	MsgType: 'image';
	PicUrl: string;
	MediaId: string;
	MsgId: string;
	AgentID: number;
}

