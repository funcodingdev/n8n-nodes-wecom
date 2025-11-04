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
		description: '要上传的图片文件的二进制属性名称',
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
		description: '图片文件名称（可选）。如不指定，将使用二进制数据的原始文件名。',
		placeholder: 'image.jpg',
	},
];
