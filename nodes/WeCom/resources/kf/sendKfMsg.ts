import type { INodeProperties } from 'n8n-workflow';

const showOnlyForSendKfMsg = {
	resource: ['kf'],
	operation: ['sendKfMsg'],
};

export const sendKfMsgDescription: INodeProperties[] = [
	{
		displayName: '客服账号 Name or ID',
		name: 'open_kfid',
		type: 'options',
		typeOptions: {
			loadOptionsMethod: 'getKfAccounts',
		},
		required: true,
		displayOptions: {
			show: showOnlyForSendKfMsg,
		},
		default: '',
		description:
			'Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>',
		hint: '客服账号',
	},
	{
		displayName: '外部联系人ID',
		name: 'touser',
		type: 'string',
		required: true,
		displayOptions: {
			show: showOnlyForSendKfMsg,
		},
		default: '',
		hint: '接收消息的客户UserID',
	},
	{
		displayName: '消息类型',
		name: 'msgtype',
		type: 'options',
		required: true,
		displayOptions: {
			show: showOnlyForSendKfMsg,
		},
		// eslint-disable-next-line n8n-nodes-base/node-param-options-type-unsorted-items
		options: [
			{
				name: '文本',
				value: 'text',
			},
			{
				name: '图片',
				value: 'image',
			},
			{
				name: '语音',
				value: 'voice',
			},
			{
				name: '视频',
				value: 'video',
			},
			{
				name: '文件',
				value: 'file',
			},
			{
				name: '图文链接',
				value: 'link',
			},
			{
				name: '小程序',
				value: 'miniprogram',
			},
			{
				name: '菜单消息',
				value: 'msgmenu',
			},
			{
				name: '地理位置',
				value: 'location',
			},
		],
		default: 'text',
		hint: '消息类型',
	},
	{
		displayName: '消息内容',
		name: 'content',
		type: 'json',
		required: true,
		displayOptions: {
			show: showOnlyForSendKfMsg,
		},
		default: '{}',
		hint: '消息内容JSON，根据msgtype不同而不同',
	},
];

