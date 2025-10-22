import type { INodeProperties } from 'n8n-workflow';

const showOnlyForSetUpgradeService = {
	resource: ['kf'],
	operation: ['setUpgradeService'],
};

export const setUpgradeServiceDescription: INodeProperties[] = [
	{
		displayName: '客服账号ID',
		name: 'open_kfid',
		type: 'string',
		required: true,
		displayOptions: {
			show: showOnlyForSetUpgradeService,
		},
		default: '',
		hint: '客服账号ID',
	},
	{
		displayName: '升级服务配置',
		name: 'upgrade_config',
		type: 'json',
		required: true,
		displayOptions: {
			show: showOnlyForSetUpgradeService,
		},
		default: '{}',
		hint: '升级服务配置JSON',
	},
];

