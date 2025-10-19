import type { INodeProperties } from 'n8n-workflow';

const showOnlyForReceiveVideo = {
	resource: ['pushMessage'],
	operation: ['receiveVideo'],
};

export const receiveVideoDescription: INodeProperties[] = [
	{
		displayName: '消息内容',
		name: 'messageData',
		type: 'json',
		displayOptions: {
			show: showOnlyForReceiveVideo,
		},
		default: '{}',
		description: '接收到的视频消息数据（JSON格式）',
		hint: '包含FromUserName、ToUserName、MediaId、ThumbMediaId等字段的消息体',
		required: true,
	},
];

export interface IReceiveVideoMessage {
	ToUserName: string;
	FromUserName: string;
	CreateTime: number;
	MsgType: 'video';
	MediaId: string;
	ThumbMediaId: string;
	MsgId: string;
	AgentID: number;
}

