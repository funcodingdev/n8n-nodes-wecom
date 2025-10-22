import type { INodeProperties } from 'n8n-workflow';

const showOnly = {
	resource: ['externalContact'],
	operation: ['uploadAttachment'],
};

export const uploadAttachmentDescription: INodeProperties[] = [
	{
		displayName: '媒体类型',
		name: 'media_type',
		type: 'options',
		options: [
			{
				name: '图片',
				value: 'image',
			},
			{
				name: '视频',
				value: 'video',
			},
			{
				name: '文件',
				value: 'file',
			},
		],
		required: true,
		default: 'image',
		displayOptions: {
			show: showOnly,
		},
		hint: '媒体类型',
	},
	{
		displayName: '附件类型',
		name: 'attachment_type',
		type: 'options',
		options: [
			{
				name: '图片',
				value: 1,
			},
			{
				name: '视频',
				value: 2,
			},
			{
				name: '文件',
				value: 3,
			},
		],
		required: true,
		default: 1,
		displayOptions: {
			show: showOnly,
		},
		hint: '附件类型，1-图片，2-视频，3-文件',
	},
	{
		displayName: '附件内容',
		name: 'attachment',
		type: 'json',
		required: true,
		default: '{}',
		displayOptions: {
			show: showOnly,
		},
		hint: 'JSON格式，包含media_id等字段',
	},
];

