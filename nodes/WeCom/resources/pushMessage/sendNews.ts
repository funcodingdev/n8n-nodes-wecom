import type { INodeProperties } from 'n8n-workflow';

const showOnlyForSendNews = {
	resource: ['pushMessage'],
	operation: ['sendNews'],
};

export const sendNewsDescription: INodeProperties[] = [
	{
		displayName: '输入方式',
		name: 'news_input_mode',
		type: 'options',
		options: [
			{ name: '表单输入', value: 'form' },
			{ name: 'JSON输入', value: 'json' },
		],
		default: 'form',
		displayOptions: {
			show: showOnlyForSendNews,
		},
		description: '选择图文消息的输入方式',
	},
	{
		displayName: '图文列表（JSON）',
		name: 'news_json',
		type: 'json',
		typeOptions: {
			rows: 4,
		},
		default: '[]',
		required: true,
		placeholder: '[{"title":"标题","description":"摘要","url":"https://example.com","picurl":"https://example.com/image.jpg"}]',
		displayOptions: {
			show: {
				...showOnlyForSendNews,
				news_input_mode: ['json'],
			},
		},
		description:
			'使用 JSON 直接输入 1 到 8 条图文的数组，或包含 articles 的对象。<a href="https://developer.work.weixin.qq.com/document/path/99110#%E5%9B%BE%E6%96%87%E7%B1%BB%E5%9E%8B" target="_blank">官方文档</a>',
	},
	{
		displayName: '图文列表',
		name: 'articles',
		type: 'fixedCollection',
		typeOptions: {
			multipleValues: true,
		},
		displayOptions: {
			show: {
				...showOnlyForSendNews,
				news_input_mode: ['form'],
			},
		},
		default: {},
		required: true,
		placeholder: '添加图文',
		description: '图文消息列表，一个图文消息支持1到8条图文。<a href="https://developer.work.weixin.qq.com/document/path/99110#%E5%9B%BE%E6%96%87%E7%B1%BB%E5%9E%8B" target="_blank">官方文档</a>',
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
						placeholder: '请输入图文标题...',
						description: '图文标题，不超过128个字节。<a href="https://developer.work.weixin.qq.com/document/path/99110#%E5%9B%BE%E6%96%87%E7%B1%BB%E5%9E%8B" target="_blank">官方文档</a>',
					},
					{
						displayName: '描述',
						name: 'description',
						type: 'string',
						typeOptions: {
							rows: 2,
						},
						default: '',
						placeholder: '请输入图文描述...',
						description: '可选。图文描述，不超过512个字节。<a href="https://developer.work.weixin.qq.com/document/path/99110#%E5%9B%BE%E6%96%87%E7%B1%BB%E5%9E%8B" target="_blank">官方文档</a>',
					},
					{
						displayName: '跳转链接',
						name: 'url',
						type: 'string',
						default: '',
						required: true,
						placeholder: 'https://example.com/article',
						description: '点击后跳转的链接。<a href="https://developer.work.weixin.qq.com/document/path/99110#%E5%9B%BE%E6%96%87%E7%B1%BB%E5%9E%8B" target="_blank">官方文档</a>',
					},
					{
						displayName: '图片链接',
						name: 'picurl',
						type: 'string',
						default: '',
						placeholder: 'https://example.com/image.jpg',
						description: '可选。图文消息的图片链接。支持JPG、PNG格式，推荐尺寸：大图640×320，小图80×80。<a href="https://developer.work.weixin.qq.com/document/path/99110#%E5%9B%BE%E6%96%87%E7%B1%BB%E5%9E%8B" target="_blank">官方文档</a>',
					},
				],
			},
		],
	},
];
