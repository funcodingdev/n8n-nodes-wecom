import type { INodeProperties } from 'n8n-workflow';

/**
 * 上传图片参数定义
 * 官方文档：https://developer.work.weixin.qq.com/document/path/90256
 *
 * 上传图片得到图片URL，该URL永久有效
 * 返回的图片URL可用于图文消息、客服消息等场景
 */

const showOnlyForUploadImage = {
	resource: ['material'],
	operation: ['uploadImage'],
};

export const uploadImageDescription: INodeProperties[] = [
	{
		displayName: '二进制数据属性',
		name: 'file',
		type: 'string',
		required: true,
		displayOptions: {
			show: showOnlyForUploadImage,
		},
		default: 'data',
		description: '要上传的 JPG 或 PNG 图片所在的二进制属性名称。图片必须大于 5B 且不超过 2MB。<a href="https://developer.work.weixin.qq.com/document/path/90256" target="_blank">官方文档</a>',
		placeholder: 'data',
	},
	{
		displayName: '文件名',
		name: 'filename',
		type: 'string',
		displayOptions: {
			show: showOnlyForUploadImage,
		},
		default: '',
		description: '图片展示名称。留空时使用二进制数据中的原始文件名',
		placeholder: 'image.jpg',
	},
];
