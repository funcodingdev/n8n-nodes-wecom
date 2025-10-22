import type { INodeProperties } from 'n8n-workflow';

const showOnlyForAddKfAccount = {
	resource: ['kf'],
	operation: ['addKfAccount'],
};

export const addKfAccountDescription: INodeProperties[] = [
	{
		displayName: '客服名称',
		name: 'name',
		type: 'string',
		required: true,
		displayOptions: {
			show: showOnlyForAddKfAccount,
		},
		default: '',
		hint: '客服名称，不多于16个字',
	},
	{
		displayName: '客服头像',
		name: 'media_id',
		type: 'string',
		required: true,
		displayOptions: {
			show: showOnlyForAddKfAccount,
		},
		default: '',
		hint: '客服头像临时素材，media_id必须是本企业上传的',
	},
];

