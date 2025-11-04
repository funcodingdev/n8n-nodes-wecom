import type { INodeProperties } from 'n8n-workflow';

/**
 * 获取高清语音素材参数定义
 * 官方文档：https://developer.work.weixin.qq.com/document/path/90255
 *
 * 可以使用本接口获取从JSSDK的uploadVoice接口上传的临时语音素材
 * 格式一般为speex，16kHz或8kHz采样，单声道
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
		description: '通过JSSDK的uploadVoice接口上传的语音文件ID',
		placeholder: 'MEDIA_ID',
	},
	{
		displayName: '二进制数据属性',
		name: 'binaryProperty',
		type: 'string',
		default: 'data',
		displayOptions: {
			show: showOnlyForGetVoice,
		},
		description: '将下载的高清语音文件存储到的二进制属性名称',
		placeholder: 'data',
	},
];
