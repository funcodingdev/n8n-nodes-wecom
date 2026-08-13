import type { INodeProperties } from 'n8n-workflow';

/**
 * 获取高清语音素材参数定义
 * 官方文档：https://developer.work.weixin.qq.com/document/path/90255
 *
 * 可以使用本接口获取从JSSDK的uploadVoice接口上传的临时语音素材
 * 返回 Content-Type 为 voice/speex
 */

const showOnlyForGetVoice = {
	resource: ['material'],
	operation: ['getHighQualityVoice'],
};

export const getHighQualityVoiceDescription: INodeProperties[] = [
	{
		displayName: '素材ID',
		name: 'media_ID',
		type: 'string',
		required: true,
		displayOptions: {
			show: showOnlyForGetVoice,
		},
		default: '',
		description: '通过 JSSDK uploadVoice 接口上传的语音文件 ID。仅企业微信 2.4 及以上版本支持，暂不支持鸿蒙系统上传的语音',
		placeholder: 'MEDIA_ID',
	},
	{
		displayName: '二进制数据属性',
		name: 'binaryProperty',
		type: 'string',
		default: 'data',
		required: true,
		displayOptions: {
			show: showOnlyForGetVoice,
		},
		description: '用于存储下载语音的二进制属性名称。接口返回 voice/speex 格式，转码需使用 Speex 官方解码库并结合微信解码库',
		placeholder: 'data',
	},
];
