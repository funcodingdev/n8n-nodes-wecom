import type { INodeProperties } from 'n8n-workflow';

const showOnlyForGetKfAccountLink = {
	resource: ['kf'],
	operation: ['getKfAccountLink'],
};

export const getKfAccountLinkDescription: INodeProperties[] = [
	{
		displayName: '客服账号ID',
		name: 'open_kfid',
		type: 'string',
		required: true,
		displayOptions: {
			show: showOnlyForGetKfAccountLink,
		},
		default: '',
		hint: '客服账号ID',
	},
	{
		displayName: '场景值',
		name: 'scene',
		type: 'string',
		displayOptions: {
			show: showOnlyForGetKfAccountLink,
		},
		default: '',
		hint: '场景值，字符串类型，由开发者自定义（可选）',
	},
];

