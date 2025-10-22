import type { INodeProperties } from 'n8n-workflow';

const showOnlyForSetUpgradeService = {
	resource: ['kf'],
	operation: ['setUpgradeService'],
};

export const setUpgradeServiceDescription: INodeProperties[] = [
	{
		displayName: '客服账号 Name or ID',
		name: 'open_kfid',
		type: 'options',
		typeOptions: {
			loadOptionsMethod: 'getKfAccounts',
		},
		required: true,
		displayOptions: {
			show: showOnlyForSetUpgradeService,
		},
		default: '',
		description:
			'Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>',
		hint: '客服账号',
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

