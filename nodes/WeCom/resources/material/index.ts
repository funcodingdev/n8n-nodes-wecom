import type { INodeProperties } from 'n8n-workflow';
import { uploadTempDescription } from './uploadTemp';
import { getTempDescription } from './getTemp';
import { uploadPermanentDescription } from './uploadPermanent';
import { getPermanentDescription } from './getPermanent';

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
				name: '上传临时素材',
				value: 'uploadTemp',
				action: '上传临时素材',
				description: '上传临时素材（3天有效期）',
			},
			{
				name: '获取临时素材',
				value: 'getTemp',
				action: '获取临时素材',
				description: '获取临时素材文件',
			},
			{
				name: '上传永久素材',
				value: 'uploadPermanent',
				action: '上传永久素材',
			},
			{
				name: '获取永久素材',
				value: 'getPermanent',
				action: '获取永久素材',
				description: '获取永久素材文件',
			},
		],
		default: 'uploadTemp',
	},
	...uploadTempDescription,
	...getTempDescription,
	...uploadPermanentDescription,
	...getPermanentDescription,
];

