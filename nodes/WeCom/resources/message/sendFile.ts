import type { INodeProperties } from 'n8n-workflow';

const showOnlySendFile = {
	resource: ['message'],
	operation: ['sendFile'],
};

export const sendFileDescription: INodeProperties[] = [
	{
		displayName: '接收人',
		name: 'touser',
		type: 'string',
		default: '',
		displayOptions: {
			show: showOnlySendFile,
		},
		description: '成员ID列表（消息接收者，多个接收者用 | 分隔，最多支持1000个）。特殊情况：指定为 @all，则向该企业应用的全部成员发送',
	},
	{
		displayName: '部门ID',
		name: 'toparty',
		type: 'string',
		default: '',
		displayOptions: {
			show: showOnlySendFile,
		},
		description: '部门ID列表，多个接收者用 | 分隔，最多支持100个。当touser为@all时忽略本参数',
	},
	{
		displayName: '标签ID',
		name: 'totag',
		type: 'string',
		default: '',
		displayOptions: {
			show: showOnlySendFile,
		},
		description: '标签ID列表，多个接收者用 | 分隔，最多支持100个。当touser为@all时忽略本参数',
	},
	{
		displayName: '文件来源',
		name: 'fileSource',
		type: 'options',
		required: true,
		default: 'mediaId',
		displayOptions: {
			show: showOnlySendFile,
		},
		options: [
			{
				name: 'Media ID',
				value: 'mediaId',
				description: '使用已上传的 Media ID',
			},
			{
				name: '上传文件',
				value: 'upload',
				description: '从输入数据中上传文件',
			},
		],
	},
	{
		displayName: 'Media ID',
		name: 'media_id',
		type: 'string',
		default: '',
		required: true,
		displayOptions: {
			show: {
				...showOnlySendFile,
				fileSource: ['mediaId'],
			},
		},
		description: '文件ID，可以调用上传临时素材接口获取',
	},
	{
		displayName: '输入数据字段名',
		name: 'binaryPropertyName',
		type: 'string',
		default: 'data',
		required: true,
		displayOptions: {
			show: {
				...showOnlySendFile,
				fileSource: ['upload'],
			},
		},
		description: '包含文件数据的二进制属性名称',
	},
];

