import type { INodeProperties } from 'n8n-workflow';

const showOnlyForUpdateKfAccount = {
	resource: ['kf'],
	operation: ['updateKfAccount'],
};

export const updateKfAccountDescription: INodeProperties[] = [
	{
		displayName: '客服账号ID',
		name: 'open_kfid',
		type: 'string',
		required: true,
		displayOptions: {
			show: showOnlyForUpdateKfAccount,
		},
		default: '',
		hint: '客服账号ID',
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

