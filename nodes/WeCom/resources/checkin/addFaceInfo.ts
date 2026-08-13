import type { INodeProperties } from 'n8n-workflow';

const showOnly = { resource: ['checkin'], operation: ['addFaceInfo'] };

export const addFaceInfoDescription: INodeProperties[] = [
	{
		displayName: '成员UserID',
		name: 'userid',
		type: 'string',
		displayOptions: { show: showOnly },
		default: '',
		description: '需要录入或覆盖人脸信息的成员 UserID；可与下方选择二选一',
	},
	{
		displayName: '成员(选择)',
		name: 'userid_selected',
		type: 'options',
		typeOptions: { loadOptionsMethod: 'getAllUsers' },
		default: '',
		displayOptions: { show: showOnly },
		description: '与上方字符串二选一；均填写时以字符串为准',
	},
	{
		displayName: '图片来源',
		name: 'faceSource',
		type: 'options',
		displayOptions: { show: showOnly },
		options: [
			{ name: '输入 Base64', value: 'base64' },
			{ name: '使用输入项二进制数据', value: 'binary' },
		],
		default: 'binary',
		description: '接口要求直接传入图片 Base64 数据，并非素材 MediaID；图片解码后不能超过 1 MiB',
	},
	{
		displayName: '二进制数据属性',
		name: 'binaryProperty',
		type: 'string',
		required: true,
		displayOptions: { show: { ...showOnly, faceSource: ['binary'] } },
		default: 'data',
		description: '包含人脸图片的输入项二进制属性名称',
	},
	{
		displayName: '人脸图片Base64',
		name: 'mediaid',
		type: 'string',
		typeOptions: { rows: 6 },
		required: true,
		displayOptions: { show: { ...showOnly, faceSource: ['base64'] } },
		default: '',
		description: '图片文件的纯 Base64 内容，不要填写 data URL 前缀或素材 MediaID',
	},
];
