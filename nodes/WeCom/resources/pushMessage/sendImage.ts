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
		options: [
			{
				name: '二进制数据',
				value: 'binary',
				description: '从二进制数据属性读取图片并自动计算 Base64 与 MD5',
			},
			{
				name: 'Base64 字符串',
				value: 'base64',
				description: '手动输入 Base64 与 MD5',
			},
		],
		default: 'binary',
		required: true,
		displayOptions: {
			show: showOnlyForSendImage,
		},
		description: '选择图片数据来源方式',
	},
	{
		displayName: '二进制数据属性',
		name: 'binaryProperty',
		type: 'string',
		default: 'data',
		required: true,
		displayOptions: {
			show: {
				...showOnlyForSendImage,
				imageSource: ['binary'],
			},
		},
		description: '要读取的图片文件二进制属性名称',
		placeholder: 'data',
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
		placeholder: 'iVBORw0KGgoAAAANSUhEUgAAAAUA...',
		description: '图片内容的 Base64 编码（不含 data:image 前缀）。图片（Base64编码前）最大不超过2M，支持JPG、PNG格式。<a href="https://developer.work.weixin.qq.com/document/path/99110#%E5%9B%BE%E7%89%87%E7%B1%BB%E5%9E%8B" target="_blank">官方文档</a>',
	},
	{
		displayName: 'MD5 值',
		name: 'md5',
		type: 'string',
		displayOptions: {
			show: {
				...showOnlyForSendImage,
				imageSource: ['base64'],
			},
		},
		default: '',
		required: true,
		placeholder: 'd41d8cd98f00b204e9800998ecf8427e',
		description: '图片内容（Base64编码前）的 MD5 值。32位小写字符串，用于校验图片完整性。<a href="https://developer.work.weixin.qq.com/document/path/99110#%E5%9B%BE%E7%89%87%E7%B1%BB%E5%9E%8B" target="_blank">官方文档</a>',
	},
];
