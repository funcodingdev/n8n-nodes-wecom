import type { INodeProperties } from 'n8n-workflow';

const showOnlyForGetByEmail = {
	resource: ['contact'],
	operation: ['getUserIdByEmail'],
};

export const getUserIdByEmailDescription: INodeProperties[] = [
	{
		displayName: '邮箱',
		name: 'email',
		type: 'string',
		required: true,
		displayOptions: {
			show: showOnlyForGetByEmail,
		},
		placeholder: 'name@email.com',
		default: '',
		description: '邮箱地址。长度为5~64个字节。',
		hint: '邮箱地址',
	},
	{
		displayName: '邮箱类型',
		name: 'email_type',
		type: 'options',
		displayOptions: {
			show: showOnlyForGetByEmail,
		},
		options: [
			{
				name: '企业邮箱',
				value: 1,
			},
			{
				name: '个人邮箱',
				value: 2,
			},
		],
		default: 1,
		description: '邮箱类型：1-企业邮箱（默认）；2-个人邮箱。',
		hint: '邮箱类型',
	},
];

