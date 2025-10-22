import type { INodeProperties } from 'n8n-workflow';

const showOnlyForUpdateKfAccount = {
	resource: ['kf'],
	operation: ['updateKfAccount'],
};

export const updateKfAccountDescription: INodeProperties[] = [
	{
		displayName: '客服账号 Name or ID',
		name: 'open_kfid',
		type: 'options',
		typeOptions: {
			loadOptionsMethod: 'getKfAccounts',
		},
		required: true,
		displayOptions: {
			show: showOnlyForUpdateKfAccount,
		},
		default: '',
		description:
			'Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>',
		hint: '客服账号',
	},
	{
		displayName: '客服名称',
		name: 'name',
		type: 'string',
		displayOptions: {
			show: showOnlyForUpdateKfAccount,
		},
		default: '',
		hint: '客服名称，不多于16个字（可选）',
	},
	{
		displayName: '客服头像',
		name: 'media_id',
		type: 'string',
		displayOptions: {
			show: showOnlyForUpdateKfAccount,
		},
		default: '',
		hint: '客服头像临时素材（可选）',
	},
];

