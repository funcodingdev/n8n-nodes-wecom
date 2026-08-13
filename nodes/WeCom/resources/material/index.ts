import type { INodeProperties } from 'n8n-workflow';
import { uploadTempDescription } from './uploadTemp';
import { getTempDescription } from './getTemp';
import { uploadImageDescription } from './uploadImage';
import { getHighQualityVoiceDescription } from './getHighQualityVoice';
import { uploadTempAsyncDescription } from './uploadTempAsync';
import { getUploadByUrlResultDescription } from './getUploadByUrlResult';

const showOnlyForMaterial = {
	resource: ['material'],
};

export const materialDescription: INodeProperties[] = [
	{
		displayName: '操作',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: showOnlyForMaterial,
		},
		options: [
			{
				name: '[素材管理] 上传临时素材',
				value: 'uploadTemp',
				action: '上传临时素材',
				description: '上传临时素材（图片、语音、视频、文件）',
			},
			{
				name: '[素材管理] 上传图片',
				value: 'uploadImage',
				action: '上传图片',
				description: '上传图片并获取永久有效的 URL',
			},
			{
				name: '[素材管理] 获取临时素材',
				value: 'getTemp',
				action: '获取临时素材',
				description: '下载已上传的临时素材文件，支持 Range 分片',
			},
			{
				name: '[素材管理] 获取高清语音素材',
				value: 'getHighQualityVoice',
				action: '获取高清语音素材',
				description: '下载 JSSDK 上传的 voice/speex 语音文件',
			},
			{
				name: '[素材管理] 异步上传临时素材',
				value: 'uploadTempAsync',
				action: '异步上传临时素材',
				description: '通过 CDN URL 异步上传大文件（最高 200MB）',
			},
			{
				name: '[素材管理] 查询异步任务结果',
				value: 'getUploadByUrlResult',
				action: '查询异步任务结果',
				description: '通过 jobid 查询异步上传任务的结果',
			},
		],
		default: 'uploadTemp',
	},
	...uploadTempDescription,
	...getTempDescription,
	...uploadImageDescription,
	...getHighQualityVoiceDescription,
	...uploadTempAsyncDescription,
	...getUploadByUrlResultDescription,
];
