import type { INodeProperties } from 'n8n-workflow';
import { getRecipientFields } from './commonFields';

const showOnlySendNews = {
	resource: ['message'],
	operation: ['sendNews'],
};

export const sendNewsDescription: INodeProperties[] = [
	...getRecipientFields('sendNews'),
	{
		displayName: '图文列表',
		name: 'articles',
		type: 'fixedCollection',
		typeOptions: {
			multipleValues: true,
		},
		required: true,
		default: {},
		placeholder: '添加图文',
		displayOptions: {
			show: showOnlySendNews,
		},
		description: '图文消息，一个图文消息支持1到8条图文',
		options: [
			{
				displayName: '图文',
				name: 'article',
				values: [
					{
						displayName: '标题',
						name: 'title',
						type: 'string',
						required: true,
						default: '',
						description: '标题，不超过128个字节，超过会自动截断',
					},
					{
						displayName: '描述',
						name: 'description',
						type: 'string',
						typeOptions: {
							rows: 2,
						},
						default: '',
						description: '描述，不超过512个字节，超过会自动截断',
					},
					{
						displayName: '跳转链接',
						name: 'url',
						type: 'string',
						required: true,
						default: '',
						description: '点击后跳转的链接',
					},
					{
						displayName: '图片链接',
						name: 'picurl',
						type: 'string',
						default: '',
						description: '图文消息的图片链接，支持JPG、PNG格式，较好的效果为大图 1068*455，小图150*150',
					},
				],
			},
		],
	},
	{
		displayName: '是否开启ID转译',
		name: 'enable_id_trans',
		type: 'boolean',
		default: false,
		displayOptions: {
			show: showOnlySendNews,
		},
		description: '是否开启ID转译，开启后会将消息中的userid转为@对应成员',
	},
	{
		displayName: '是否开启重复消息检查',
		name: 'enable_duplicate_check',
		type: 'boolean',
		default: false,
		displayOptions: {
			show: showOnlySendNews,
		},
		description: '是否开启重复消息检查，开启后在时间间隔内相同内容的消息不会重复发送',
	},
	{
		displayName: '重复消息检查时间',
		name: 'duplicate_check_interval',
		type: 'number',
		default: 1800,
		displayOptions: {
			show: {
				...showOnlySendNews,
				enable_duplicate_check: [true],
			},
		},
		description: '表示是否重复消息检查的时间间隔，默认1800s，最大不超过4小时',
	},
];

