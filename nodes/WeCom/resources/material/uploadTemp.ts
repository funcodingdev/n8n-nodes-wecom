import type { INodeProperties } from 'n8n-workflow';

/**
 * 上传临时素材参数定义
 * 官方文档：https://developer.work.weixin.qq.com/document/path/90253
 *
 * 素材上传得到media_id，该media_id仅三天内有效
 * media_id在同一企业内应用之间可以共享
 */

const showOnlyUploadTemp = {
	resource: ['material'],
	operation: ['uploadTemp'],
};

export const uploadTempDescription: INodeProperties[] = [
	{
		displayName: '素材类型',
		name: 'type',
		type: 'options',
		options: [
			{
				name: '图片',
				value: 'image',
				description: '图片文件（jpg/png等），大小不超过2MB',
			},
			{
				name: '语音',
				value: 'voice',
				description: '语音文件（amr/speex等），大小不超过2MB，播放长度不超过60s',
			},
			{
				name: '视频',
				value: 'video',
				description: '视频文件（mp4等），大小不超过10MB',
			},
			{
				name: '文件',
				value: 'file',
				description: '普通文件（pdf/doc/xls等），大小不超过20MB',
			},
		],
		default: 'image',
		required: true,
		displayOptions: {
			show: showOnlyUploadTemp,
		},
		description: '媒体文件类型。素材的media_id仅三天内有效，过期需重新上传。',
	},
	{
		displayName: '二进制数据属性',
		name: 'binaryProperty',
		type: 'string',
		default: 'data',
		required: true,
		displayOptions: {
			show: showOnlyUploadTemp,
		},
		description: '要上传的二进制文件属性名称',
		placeholder: 'data',
	},
];
