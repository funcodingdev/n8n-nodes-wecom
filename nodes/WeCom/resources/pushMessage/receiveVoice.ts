import type { INodeProperties } from 'n8n-workflow';

const showOnlyForReceiveVoice = {
	resource: ['pushMessage'],
	operation: ['receiveVoice'],
};

export const receiveVoiceDescription: INodeProperties[] = [
	{
		displayName: '消息内容',
		name: 'messageData',
		type: 'json',
		displayOptions: {
			show: showOnlyForReceiveVoice,
		},
		default: '{}',
		description: '接收到的语音消息数据（JSON格式）',
		hint: '包含FromUserName、ToUserName、MediaId、Format等字段的消息体',
		required: true,
	},
];

export interface IReceiveVoiceMessage {
	ToUserName: string;
	FromUserName: string;
	CreateTime: number;
	MsgType: 'voice';
	MediaId: string;
	Format: string;
	MsgId: string;
	AgentID: number;
}

