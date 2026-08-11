import type { INodeProperties } from 'n8n-workflow';

const showOnlyForSendText = {
	resource: ['appChat'],
	operation: ['sendText'],
};

export const sendTextDescription: INodeProperties[] = [
	{
		displayName: '群聊 ID',
		name: 'chatid',
		type: 'string',
		displayOptions: {
			show: showOnlyForSendText,
		},
		default: '',
		placeholder: 'mychat001',
		required: true,
		description:
			'群聊会话的唯一标识。<a href="https://developer.work.weixin.qq.com/document/path/90248" target="_blank">官方文档</a>',
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
		placeholder: '请输入文本消息内容',
		required: true,
		description:
			'文本消息内容，最长不超过 2048 字节。支持换行，换行请使用 \\n。<a href="https://developer.work.weixin.qq.com/document/path/90248" target="_blank">官方文档</a>',
	},
	{
		displayName: '@提醒成员',
		name: 'mentionedList',
		type: 'multiOptions',
		typeOptions: {
			loadOptionsMethod: 'getAllUsersWithAllOption',
		},
		displayOptions: {
			show: showOnlyForSendText,
		},
		default: [],
		description:
			'可选。支持从下拉列表选择群成员，也支持切换到表达式后输入 UserID 数组或字符串。下拉列表第一项为“所有人”。<a href="https://developer.work.weixin.qq.com/document/path/90248" target="_blank">官方文档</a>',
	},
	{
		displayName: '保密消息',
		name: 'safe',
		type: 'boolean',
		displayOptions: {
			show: showOnlyForSendText,
		},
		default: false,
		description:
			'可选。是否发送为保密消息。开启后消息不可转发、复制等。<a href="https://developer.work.weixin.qq.com/document/path/90248" target="_blank">官方文档</a>',
	},
];
