import type { INodeProperties } from 'n8n-workflow';
import { receiveTextDescription } from './receiveText';
import { receiveImageDescription } from './receiveImage';
import { receiveVoiceDescription } from './receiveVoice';
import { receiveVideoDescription } from './receiveVideo';
import { receiveLocationDescription } from './receiveLocation';
import { receiveLinkDescription } from './receiveLink';
import { receiveEventDescription } from './receiveEvent';

const showOnlyForPushMessage = {
	resource: ['pushMessage'],
};

export const pushMessageDescription: INodeProperties[] = [
	{
		displayName: '操作',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: showOnlyForPushMessage,
		},
		options: [
			{
				name: '接收事件推送',
				value: 'receiveEvent',
				action: '接收事件推送',
				description: '接收各类事件推送（成员变更、部门变更等）',
			},
			{
				name: '接收位置消息',
				value: 'receiveLocation',
				action: '接收位置消息',
				description: '接收用户发送的地理位置消息',
			},
			{
				name: '接收图片消息',
				value: 'receiveImage',
				action: '接收图片消息',
				description: '接收用户发送的图片消息',
			},
			{
				name: '接收文本消息',
				value: 'receiveText',
				action: '接收文本消息',
				description: '接收用户发送的文本消息',
			},
			{
				name: '接收视频消息',
				value: 'receiveVideo',
				action: '接收视频消息',
				description: '接收用户发送的视频消息',
			},
			{
				name: '接收语音消息',
				value: 'receiveVoice',
				action: '接收语音消息',
				description: '接收用户发送的语音消息',
			},
			{
				name: '接收链接消息',
				value: 'receiveLink',
				action: '接收链接消息',
				description: '接收用户发送的链接消息',
			},
		],
		default: 'receiveText',
	},
	...receiveTextDescription,
	...receiveImageDescription,
	...receiveVoiceDescription,
	...receiveVideoDescription,
	...receiveLocationDescription,
	...receiveLinkDescription,
	...receiveEventDescription,
];

