import type { INodeProperties } from 'n8n-workflow';

const showOnlyForSendNews = {
	resource: ['pushMessage'],
	operation: ['sendNews'],
};

export const sendNewsDescription: INodeProperties[] = [
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
		description: '图文消息列表',
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
						required: true,
						description: '图文标题',
						hint: '不超过128个字节，超过会自动截断',
					},
					{
						displayName: '描述',
						name: 'description',
						type: 'string',
						typeOptions: {
							rows: 2,
						},
						default: '',
						description: '图文描述',
						hint: '不超过512个字节，超过会自动截断',
					},
					{
						displayName: '跳转链接',
						name: 'url',
						type: 'string',
						default: '',
						required: true,
						description: '点击后跳转的链接',
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

