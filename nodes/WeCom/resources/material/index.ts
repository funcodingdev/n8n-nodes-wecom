import type { INodeProperties } from 'n8n-workflow';
import { uploadTempDescription } from './uploadTemp';
import { getTempDescription } from './getTemp';
import { uploadPermanentDescription } from './uploadPermanent';
import { getPermanentDescription } from './getPermanent';
import { uploadImageDescription } from './uploadImage';
import { getHighQualityVoiceDescription } from './getHighQualityVoice';
import { uploadTempAsyncDescription } from './uploadTempAsync';

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
			],
		default: '',
	},
	...uploadTempDescription,
	...getTempDescription,
	...uploadPermanentDescription,
	...getPermanentDescription,
	...uploadImageDescription,
	...getHighQualityVoiceDescription,
	...uploadTempAsyncDescription,
];

