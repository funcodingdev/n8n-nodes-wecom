import type { INodeProperties } from 'n8n-workflow';

const showOnlyForDelKfAccount = {
	resource: ['kf'],
	operation: ['delKfAccount'],
};

export const delKfAccountDescription: INodeProperties[] = [
	{
		displayName: '客服账号ID',
		name: 'open_kfid',
		type: 'string',
		required: true,
		displayOptions: {
			show: showOnlyForDelKfAccount,
		},
		default: '',
		hint: '客服账号ID',
	},
];

