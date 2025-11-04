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
		description: '临时素材的media_id。通过"上传临时素材"接口获得，仅三天内有效。',
		placeholder: 'MEDIA_ID',
	},
	{
		displayName: '二进制数据属性',
		name: 'binaryProperty',
		type: 'string',
		default: 'data',
		displayOptions: {
			show: showOnlyGetTemp,
		},
		description: '将下载的素材文件存储到的二进制属性名称',
		placeholder: 'data',
	},
];
