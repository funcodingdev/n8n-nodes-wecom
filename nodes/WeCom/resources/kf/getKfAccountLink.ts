import type { INodeProperties } from 'n8n-workflow';

const showOnlyForGetKfAccountLink = {
	resource: ['kf'],
	operation: ['getKfAccountLink'],
};

export const getKfAccountLinkDescription: INodeProperties[] = [
	{
		displayName: '客服账号 Name or ID',
		name: 'open_kfid',
		type: 'options',
		typeOptions: {
			loadOptionsMethod: 'getKfAccounts',
		},
		required: true,
		displayOptions: {
			show: showOnlyForGetKfAccountLink,
		},
		default: '',
		description:
			'Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>',
		hint: '客服账号',
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

