import type { INodeProperties } from 'n8n-workflow';

const showOnlyForGetQr = {
	resource: ['contact'],
	operation: ['getJoinQrCode'],
};

export const getJoinQrCodeDescription: INodeProperties[] = [
	{
		displayName: '二维码尺寸类型',
		name: 'size_type',
		type: 'options',
		displayOptions: {
			show: showOnlyForGetQr,
		},
		options: [
			{
				name: '171 X 171',
				value: 1,
			},
			{
				name: '399 X 399',
				value: 2,
			},
			{
				name: '741 X 741',
				value: 3,
			},
			{
				name: '2052 X 2052',
				value: 4,
			},
		],
		default: 1,
		description: 'Qrcode尺寸类型，1: 171 x 171; 2: 399 x 399; 3: 741 x 741; 4: 2052 x 2052。',
		hint: '二维码尺寸',
	},
];
