import type { INodeProperties } from 'n8n-workflow';

const showOnlyGetPermanent = {
	resource: ['material'],
	operation: ['getPermanent'],
};

export const getPermanentDescription: INodeProperties[] = [
	{
		displayName: '素材ID',
		name: 'media_id',
		type: 'string',
		default: '',
		required: true,
		displayOptions: {
			show: showOnlyGetPermanent,
		},
		description: '永久素材的media_id',
	},
	{
		displayName: '下载到二进制属性',
		name: 'binaryProperty',
		type: 'string',
		default: 'data',
		displayOptions: {
			show: showOnlyGetPermanent,
		},
		description: '将下载的文件存储到的二进制属性名称',
	},
];

