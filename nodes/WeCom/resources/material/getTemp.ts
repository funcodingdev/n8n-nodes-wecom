import type { INodeProperties } from 'n8n-workflow';

/**
 * 获取临时素材参数定义
 * 官方文档：https://developer.work.weixin.qq.com/document/path/90254
 *
 * 获取临时素材文件
 * 注意：素材的media_id仅三天内有效
 */

const showOnlyGetTemp = {
	resource: ['material'],
	operation: ['getTemp'],
};

export const getTempDescription: INodeProperties[] = [
	{
		displayName: '素材ID',
		name: 'media_ID',
		type: 'string',
		default: '',
		required: true,
		displayOptions: {
			show: showOnlyGetTemp,
		},
		description: '临时素材的 media_id，有效期 3 天；超过 20M 的异步上传素材需分块下载。<a href="https://developer.work.weixin.qq.com/document/path/90254" target="_blank">官方文档</a>',
		placeholder: 'MEDIA_ID',
	},
	{
		displayName: '二进制数据属性',
		name: 'binaryProperty',
		type: 'string',
		default: 'data',
		required: true,
		displayOptions: {
			show: showOnlyGetTemp,
		},
		description: '用于存储下载文件的二进制属性名称',
		placeholder: 'data',
	},
	{
		displayName: '使用分片下载',
		name: 'useRange',
		type: 'boolean',
		default: false,
		displayOptions: {
			show: showOnlyGetTemp,
		},
		description: '是否通过 Range 请求头下载指定字节范围。异步上传且超过 20MB 的素材必须分片下载，单片不能超过 20MB',
	},
	{
		displayName: '分片起始位置',
		name: 'rangeStart',
		type: 'number',
		default: 0,
		required: true,
		typeOptions: {
			minValue: 0,
			numberStepSize: 1,
		},
		displayOptions: {
			show: {
				...showOnlyGetTemp,
				useRange: [true],
			},
		},
		description: 'Range 的起始字节位置（包含此字节）',
	},
	{
		displayName: '分片结束位置',
		name: 'rangeEnd',
		type: 'number',
		default: 20971519,
		required: true,
		typeOptions: {
			minValue: 0,
			numberStepSize: 1,
		},
		displayOptions: {
			show: {
				...showOnlyGetTemp,
				useRange: [true],
			},
		},
		description: 'Range 的结束字节位置（包含此字节）。结束位置减起始位置再加 1 不能超过 20MB',
	},
	{
		displayName: '加密素材',
		name: 'encryptedMaterial',
		type: 'boolean',
		default: false,
		displayOptions: {
			show: {
				...showOnlyGetTemp,
				useRange: [true],
			},
		},
		description: '是否按企业微信加密素材的要求校验分片。启用后，起始位置和分片长度必须按 16 字节对齐',
	},
];
