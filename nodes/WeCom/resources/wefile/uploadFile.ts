import type { INodeProperties } from 'n8n-workflow';

const showOnly = { resource: ['wefile'], operation: ['uploadFile'] };

export const uploadFileDescription: INodeProperties[] = [
	{
		displayName: '位置选择方式',
		name: 'locationMethod',
		type: 'options',
		default: 'space',
		required: true,
		description: '选择指定上传位置的方式',
		displayOptions: { show: showOnly },
		options: [
			{
				name: '空间和文件夹',
				value: 'space',
				description: '通过空间ID和文件夹ID指定上传位置',
			},
			{
				name: '选择凭证',
				value: 'ticket',
				description: '通过微盘文件选择器返回的selectedTicket指定位置',
			},
		],
	},
	{
		displayName: '空间ID',
		name: 'spaceId',
		type: 'string',
		required: true,
		default: '',
		description: '要上传文件的微盘空间ID',
		displayOptions: {
			show: {
				...showOnly,
				locationMethod: ['space'],
			},
		},
	},
	{
		displayName: '父文件夹ID',
		name: 'fatherId',
		type: 'string',
		default: '',
		description: '父文件夹的ID，根目录时为空间spaceid',
		displayOptions: {
			show: {
				...showOnly,
				locationMethod: ['space'],
			},
		},
	},
	{
		displayName: '选择凭证',
		name: 'selectedTicket',
		type: 'string',
		required: true,
		default: '',
		placeholder: 'SELECTED_TICKET',
		description: '微盘和文件选择器jsapi返回的selectedTicket',
		displayOptions: {
			show: {
				...showOnly,
				locationMethod: ['ticket'],
			},
		},
	},
	{
		displayName: '文件名',
		name: 'fileName',
		type: 'string',
		required: true,
		default: '',
		placeholder: 'document.pdf',
		description: '上传文件的名称，包含文件扩展名。注意：文件名最多填255个字符，英文算1个，汉字算2个。<a href="https://developer.work.weixin.qq.com/document/path/97880" target="_blank">更多信息</a>',
		displayOptions: { show: showOnly },
	},
	{
		displayName: '文件内容方式',
		name: 'contentMethod',
		type: 'options',
		default: 'base64',
		required: true,
		description: '选择提供文件内容的方式',
		displayOptions: { show: showOnly },
		options: [
			{
				name: 'Base64 内容',
				value: 'base64',
				description: '直接提供Base64编码的文件内容（超过10MB时自动分块上传）',
			},
			{
				name: '二进制数据',
				value: 'binary',
				description: '从n8n二进制数据属性获取文件内容（超过10MB时自动分块上传，最大20GB）',
			},
		],
	},
	{
		displayName: 'Base64 内容',
		name: 'base64Content',
		type: 'string',
		default: '',
		required: true,
		displayOptions: {
			show: {
				...showOnly,
				contentMethod: ['base64'],
			},
		},
		description: '文件内容的Base64编码（注意：只需要填入文件内容的Base64，不需要添加任何如："data:application/x-javascript;base64" 的数据类型描述信息）。超过10MB时自动分块上传。',
	},
	{
		displayName: '二进制属性',
		name: 'binaryPropertyName',
		type: 'string',
		default: 'data',
		required: true,
		displayOptions: {
			show: {
				...showOnly,
				contentMethod: ['binary'],
			},
		},
		description: '包含要上传文件数据的二进制属性名称。超过10MB时自动分块上传，最大20GB。<a href="https://developer.work.weixin.qq.com/document/path/97880" target="_blank">更多信息</a>',
	},
];