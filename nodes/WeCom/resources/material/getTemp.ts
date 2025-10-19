import type { INodeProperties } from 'n8n-workflow';

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
		description: '临时素材的media_ID',
	},
	{
		displayName: '下载到二进制属性',
		name: 'binaryProperty',
		type: 'string',
		default: 'data',
		displayOptions: {
			show: showOnlyGetTemp,
		},
		description: '将下载的文件存储到的二进制属性名称',
	},
];

