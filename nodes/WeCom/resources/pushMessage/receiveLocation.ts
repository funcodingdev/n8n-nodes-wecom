import type { INodeProperties } from 'n8n-workflow';

const showOnlyForReceiveLocation = {
	resource: ['pushMessage'],
	operation: ['receiveLocation'],
};

export const receiveLocationDescription: INodeProperties[] = [
	{
		displayName: '消息内容',
		name: 'messageData',
		type: 'json',
		displayOptions: {
			show: showOnlyForReceiveLocation,
		},
		default: '{}',
		description: '接收到的位置消息数据（JSON格式）',
		hint: '包含FromUserName、ToUserName、Location_X、Location_Y、Label等字段的消息体',
		required: true,
	},
];

export interface IReceiveLocationMessage {
	ToUserName: string;
	FromUserName: string;
	CreateTime: number;
	MsgType: 'location';
	Location_X: number;
	Location_Y: number;
	Scale: number;
	Label: string;
	MsgId: string;
	AgentID: number;
	AppType: string;
}

