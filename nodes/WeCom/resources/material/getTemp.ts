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
		description: '临时素材的media_id。通过"上传临时素材"或"异步上传临时素材"接口获得。media_id在同一企业内所有应用之间可以共享，有效期只有3天，注意要及时获取，以免过期。异步上传临时素材获取到的media_id，超过20M需使用Range分块下载，且分块大小不超过20M，否则返回错误码830002。其他media_id，若文件过大则返回错误码830002，需使用Range分块下载，建议分块大小不超过20M。本接口支持断点下载（分块下载），通过在http header里指定Range来分块下载。部分业务场景media_id对应的资源在企业微信后台是加密存储的，如果分片下载，指定下载分片长度只能为16字节的倍数，否则无法进行分片解密。<a href="https://developer.work.weixin.qq.com/document/path/90254" target="_blank">官方文档</a>',
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
