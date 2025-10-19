import type { INodeProperties } from 'n8n-workflow';

const showOnlyForSendNews = {
	resource: ['appChat'],
	operation: ['sendNews'],
};

export const sendNewsDescription: INodeProperties[] = [
	{
		displayName: '群聊ID',
		name: 'chatid',
		type: 'string',
		displayOptions: {
			show: showOnlyForSendNews,
		},
		default: '',
		required: true,
		description: '群聊的唯一标识',
		hint: '群聊会话的 chatid',
	},
	{
		displayName: '图文列表',
		name: 'articles',
		type: 'fixedCollection',
		typeOptions: {
			multipleValues: true,
		},
		displayOptions: {
			show: showOnlyForSendNews,
		},
		default: {},
		placeholder: '添加图文',
		description: '图文消息，一个图文消息支持1到8条图文',
		options: [
			{
				name: 'article',
				displayName: '图文',
				values: [
					{
						displayName: '标题',
						name: 'title',
						type: 'string',
						default: '',
						description: '图文消息的标题',
						hint: '不超过128个字节',
					},
					{
						displayName: '描述',
						name: 'description',
						type: 'string',
						typeOptions: {
							rows: 3,
						},
						default: '',
						description: '图文消息的描述',
						hint: '不超过512个字节',
					},
					{
						displayName: '跳转链接',
						name: 'url',
						type: 'string',
						default: '',
						description: '点击后跳转的链接',
						hint: '必须是http或https开头',
					},
					{
						displayName: '图片链接',
						name: 'picurl',
						type: 'string',
						default: '',
						description: '图文消息的图片链接',
						hint: '支持JPG、PNG格式，较好的效果为大图640*320，小图80*80',
					},
				],
			},
		],
	},
];

