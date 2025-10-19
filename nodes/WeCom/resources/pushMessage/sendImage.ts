import type { INodeProperties } from 'n8n-workflow';

const showOnlyForSendImage = {
	resource: ['pushMessage'],
	operation: ['sendImage'],
};

export const sendImageDescription: INodeProperties[] = [
	{
		displayName: '图片来源',
		name: 'imageSource',
		type: 'options',
		displayOptions: {
			show: showOnlyForSendImage,
		},
		options: [
			{
				name: 'Base64',
				value: 'base64',
				description: '使用 Base64 编码的图片',
			},
			{
				name: 'MD5',
				value: 'md5',
				description: '使用图片的 MD5 值',
			},
		],
		default: 'base64',
		description: '选择图片的提供方式',
	},
	{
		displayName: 'Base64 图片',
		name: 'base64',
		type: 'string',
		typeOptions: {
			rows: 4,
		},
		displayOptions: {
			show: {
				...showOnlyForSendImage,
				imageSource: ['base64'],
			},
		},
		default: '',
		required: true,
		description: '图片的 Base64 编码（不含data:image前缀）',
		hint: '图片（base64编码前）最大不能超过2M，支持JPG、PNG格式',
	},
	{
		displayName: 'MD5 值',
		name: 'md5',
		type: 'string',
		displayOptions: {
			show: {
				...showOnlyForSendImage,
				imageSource: ['md5'],
			},
		},
		default: '',
		required: true,
		description: '图片内容的 MD5 值',
		hint: '用于校验图片内容',
	},
];

