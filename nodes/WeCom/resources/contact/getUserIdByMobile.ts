import type { INodeProperties } from 'n8n-workflow';

const showOnlyForGetByMobile = {
	resource: ['contact'],
	operation: ['getUserIdByMobile'],
};

export const getUserIdByMobileDescription: INodeProperties[] = [
	{
		displayName: '手机号',
		name: 'mobile',
		type: 'string',
		required: true,
		displayOptions: {
			show: showOnlyForGetByMobile,
		},
		default: '',
		description: '手机号码。长度为5~32个字节。',
		hint: '手机号码',
	},
];

