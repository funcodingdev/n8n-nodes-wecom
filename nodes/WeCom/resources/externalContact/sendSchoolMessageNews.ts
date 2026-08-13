import type { INodeProperties } from 'n8n-workflow';

const showOnlyForSendSchoolMessageNews = {
	resource: ['externalContact'],
	operation: ['sendSchoolMessage'],
	msgtype: ['news'],
};

export const sendSchoolMessageNewsDescription: INodeProperties[] = [
	{
		displayName: '图文列表',
		name: 'articles',
		type: 'fixedCollection',
		typeOptions: {
			multipleValues: true,
		},
		displayOptions: {
			show: showOnlyForSendSchoolMessageNews,
		},
		default: {},
		placeholder: '添加图文',
		required: true,
		description:
			'图文消息，一个图文消息支持1到8条图文。',
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
						placeholder: '图文标题',
						required: true,
						description: '标题，不超过128个字节，超过会自动截断（支持ID转译）。必填。标题，不超过128个字节，超过会自动截断，支持ID转译',
					},
					{
						displayName: '描述',
						name: 'description',
						type: 'string',
						typeOptions: {
							rows: 3,
						},
						default: '',
						placeholder: '图文描述',
						description: '可选。描述，不超过512个字节，超过会自动截断（支持ID转译）。可选。描述，不超过512个字节，超过会自动截断，支持ID转译',
					},
					{
						displayName: '跳转链接',
						name: 'url',
						type: 'string',
						default: '',
						placeholder: 'https://example.com',
						required: true,
						description:
							'点击后跳转的链接。。必填。点击后跳转的链接',
					},
					{
						displayName: '图片链接',
						name: 'picurl',
						type: 'string',
						default: '',
						placeholder: 'https://example.com/image.jpg',
						description:
							'可选。图文消息的图片链接，支持JPG、PNG格式，较好的效果为大图1068*455，小图150*150。。可选。图文消息的图片链接，支持JPG、PNG格式，较好的效果为大图1068*455，小图150*150',
					},
				],
			},
		],
	},
	{
		displayName: '开启ID转译',
		name: 'enable_id_trans',
		type: 'boolean',
		displayOptions: {
			show: showOnlyForSendSchoolMessageNews,
		},
		default: false,
		description: '可选。表示是否开启ID转译，默认否。开启后可以将userid/部门ID转成对应的企业通讯录内部的用户名/部门名',
	},

	{
		displayName: '图文列表 JSON',
		name: 'articlesJson',
		type: 'json',
		displayOptions: { show: showOnlyForSendSchoolMessageNews },
		default: '[]',
		description:
			'可选。非空数组时覆盖上方图文表单。支持 [{"title":"...","url":"...","description":"...","picurl":"..."}]，1–8 条',
	},
];
