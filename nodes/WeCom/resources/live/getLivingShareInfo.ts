import type { INodeProperties } from 'n8n-workflow';

const showOnly = { resource: ['live'], operation: ['getLivingShareInfo'] };

export const getLivingShareInfoDescription: INodeProperties[] = [
	{
		displayName: '直播分享码',
		name: 'ww_share_code',
		type: 'string',
		required: true,
		displayOptions: { show: showOnly },
		default: '',
		description: '小程序商城路径中的 ww_share_code，五分钟内有效',
	},
];
