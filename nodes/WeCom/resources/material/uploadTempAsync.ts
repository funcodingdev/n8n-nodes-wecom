import type { INodeProperties } from 'n8n-workflow';

const showOnlyForUploadAsync = {
	resource: ['material'],
	operation: ['uploadTempAsync'],
};

export const uploadTempAsyncDescription: INodeProperties[] = [
	{
		displayName: '场景值',
		name: 'scene',
		type: 'options',
		required: true,
		displayOptions: {
			show: showOnlyForUploadAsync,
		},
		options: [
			{
				name: '客户联系入群欢迎语素材',
				value: 1,
				description: '目前仅支持此场景',
			},
		],
		default: 1,
		description: '场景值。目前仅支持1-客户联系入群欢迎语素材。每个场景值有对应的使用范围，详见使用场景说明。<a href="https://developer.work.weixin.qq.com/document/path/96219" target="_blank">官方文档</a>',
	},
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
				name: '视频',
				value: 'video',
				description: '视频文件，200MB，仅支持MP4格式',
			},
			{
				name: '文件',
				value: 'file',
				description: '普通文件，200MB',
			},
		],
		default: 'video',
		description: '媒体文件类型。目前仅支持视频和普通文件；视频必须为 MP4。远程文件必须大于 5B 且不超过 200MB，企业微信会在异步处理时校验',
	},
	{
		displayName: '文件名',
		name: 'filename',
		type: 'string',
		required: true,
		displayOptions: {
			show: showOnlyForUploadAsync,
		},
		default: '',
		description: '文件展示名称，不超过 128 字节。视频文件名应以 .mp4 结尾',
		placeholder: 'video.mp4',
	},
	{
		displayName: '文件 CDN URL',
		name: 'url',
		type: 'string',
		required: true,
		displayOptions: {
			show: showOnlyForUploadAsync,
		},
		default: '',
		description: '可公开访问的 HTTP(S) CDN 链接，不超过 1024 字节，并且必须支持 Range 分块下载。腾讯云 COS 链接需设置为公有读',
		placeholder: 'https://example.com/video.mp4',
	},
	{
		displayName: '文件 MD5',
		name: 'md5',
		type: 'string',
		required: true,
		displayOptions: {
			show: showOnlyForUploadAsync,
		},
		default: '',
		description: '远程文件内容的 32 位十六进制 MD5，用于校验企业微信下载到的文件是否完整',
		placeholder: 'd41d8cd98f00b204e9800998ecf8427e',
	},
];
