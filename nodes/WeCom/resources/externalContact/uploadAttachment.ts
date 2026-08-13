import type { INodeProperties } from 'n8n-workflow';

const showOnly = { resource: ['externalContact'], operation: ['uploadAttachment'] };

export const uploadAttachmentDescription: INodeProperties[] = [
	{
		displayName: '附件类型',
		name: 'attachment_type',
		type: 'options',
		options: [
			{ name: '朋友圈', value: 1, description: '用于朋友圈，仅支持图片或视频' },
			{ name: '商品图册', value: 2, description: '用于商品图册，仅支持图片' },
		],
		required: true,
		default: 1,
		displayOptions: { show: showOnly },
		description: '附件场景决定可上传的媒体类型',
	},
	{
		displayName: '媒体类型',
		name: 'media_type',
		type: 'options',
		options: [
			{ name: '图片', value: 'image', description: '最大 10 MB，支持 JPG、PNG 格式' },
			{ name: '视频', value: 'video', description: '最大 10 MB，支持 MP4 格式' },
		],
		required: true,
		default: 'image',
		displayOptions: { show: { ...showOnly, attachment_type: [1] } },
		description: '朋友圈支持图片或视频',
	},
	{
		displayName: '媒体类型',
		name: 'media_type',
		type: 'options',
		options: [{ name: '图片', value: 'image', description: '最大 10 MB，支持 JPG、PNG 格式' }],
		required: true,
		default: 'image',
		displayOptions: { show: { ...showOnly, attachment_type: [2] } },
		description: '商品图册仅支持图片',
	},
	{
		displayName: '二进制属性名',
		name: 'binaryPropertyName',
		type: 'string',
		required: true,
		default: 'data',
		displayOptions: { show: showOnly },
		description: '包含待上传数据的二进制属性名称；文件必须大于 5 字节且不超过 10 MB',
	},
	{
		displayName: '上传返回的 Media ID 仅三天有效。朋友圈图片长边不超过 10800 像素、短边不超过 1080 像素；视频不超过 30 秒。',
		name: 'notice',
		type: 'notice',
		default: '',
		displayOptions: { show: showOnly },
	},
];
