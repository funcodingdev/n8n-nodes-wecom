import type { INodeProperties } from 'n8n-workflow';

/**
 * 异步上传临时素材参数定义
 * 官方文档：https://developer.work.weixin.qq.com/document/path/96219
 *
 * 本接口为异步上传接口，主要用于文件较大或上传时间较长的场景
 * 返回jobid，可用于后续查询上传结果
 */

const showOnlyForUploadAsync = {
	resource: ['material'],
	operation: ['uploadTempAsync'],
};

export const uploadTempAsyncDescription: INodeProperties[] = [
	{
		displayName: '素材类型',
		name: 'type',
		type: 'options',
		required: true,
		displayOptions: {
			show: showOnlyForUploadAsync,
		},
		options: [
			{
				name: '图片',
				value: 'image',
				description: '图片文件',
			},
			{
				name: '语音',
				value: 'voice',
				description: '语音文件',
			},
			{
				name: '视频',
				value: 'video',
				description: '视频文件',
			},
			{
				name: '文件',
				value: 'file',
				description: '普通文件',
			},
		],
		default: 'image',
		description: '媒体文件类型',
	},
	{
		displayName: '二进制数据属性',
		name: 'file',
		type: 'string',
		required: true,
		displayOptions: {
			show: showOnlyForUploadAsync,
		},
		default: 'data',
		description: '要上传的文件的二进制属性名称',
		placeholder: 'data',
	},
	{
		displayName: '文件名',
		name: 'filename',
		type: 'string',
		displayOptions: {
			show: showOnlyForUploadAsync,
		},
		default: '',
		description: '文件名称（可选）。如不指定，将使用二进制数据的原始文件名。',
		placeholder: 'file.pdf',
	},
	{
		displayName: '附件类型',
		name: 'attachment_type',
		type: 'options',
		displayOptions: {
			show: showOnlyForUploadAsync,
		},
		options: [
			{
				name: '临时素材',
				value: 1,
			},
		],
		default: 1,
		description: '附件类型，1表示临时素材（默认）',
	},
	{
		displayName: '场景值',
		name: 'scene',
		type: 'options',
		displayOptions: {
			show: showOnlyForUploadAsync,
		},
		options: [
			{
				name: '客服消息',
				value: 1,
			},
		],
		default: 1,
		description: '上传场景值，1表示客服消息（默认）',
	},
];
