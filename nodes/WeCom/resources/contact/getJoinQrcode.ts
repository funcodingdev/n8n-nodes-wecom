import type { INodeProperties } from 'n8n-workflow';

const showOnlyGetJoinQrcode = {
	resource: ['contact'],
	operation: ['getJoinQrcode'],
};

export const getJoinQrcodeDescription: INodeProperties[] = [
	{
		displayName: '二维码尺寸类型',
		name: 'size_type',
		type: 'options',
		options: [
			{
				name: '171 x 171',
				value: 1,
			},
			{
				name: '399 x 399',
				value: 2,
			},
			{
				name: '741 x 741',
				value: 3,
			},
			{
				name: '2052 x 2052',
				value: 4,
			},
		],
		default: 1,
		displayOptions: {
			show: showOnlyGetJoinQrcode,
		},
		description: 'qrcode尺寸类型，1: 171 x 171; 2: 399 x 399; 3: 741 x 741; 4: 2052 x 2052',
	},
];

