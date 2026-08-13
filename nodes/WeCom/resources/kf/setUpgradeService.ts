import type { INodeProperties } from 'n8n-workflow';

const showOnly = { resource: ['kf'], operation: ['setUpgradeService'] };

export const setUpgradeServiceDescription: INodeProperties[] = [
	{
		displayName: '客服账号',
		name: 'open_kfid',
		type: 'options',
		typeOptions: {
			loadOptionsMethod: 'getKfAccounts',
		},
		required: true,
		displayOptions: { show: showOnly },
		default: '',
		description:
			'客服账号 ID。<a href="https://developer.work.weixin.qq.com/document/path/94674" target="_blank">官方文档</a>',
		placeholder: 'wkxxxxxxxxxxxxxxxxxx',
	},
	{
		displayName: '客户 External UserID',
		name: 'external_userid',
		type: 'string',
		required: true,
		displayOptions: { show: showOnly },
		default: '',
		description: '要推荐升级服务的微信客户 external_userid',
		placeholder: 'wmxxxxxxxxxxxxxxxxxx',
	},
	{
		displayName: '升级类型',
		name: 'upgradeType',
		type: 'options',
		required: true,
		displayOptions: { show: showOnly },
		options: [
			{ name: '专员服务', value: 'member', description: 'type=1，推荐专员服务' },
			{ name: '客户群服务', value: 'groupchat', description: 'type=2，推荐客户群服务' },
		],
		default: 'member',
		description: '升级到专员服务或客户群服务',
	},
	{
		displayName: '服务专员',
		name: 'member_userid',
		type: 'options',
		typeOptions: { loadOptionsMethod: 'getAllUsers' },
		required: true,
		displayOptions: { show: { ...showOnly, upgradeType: ['member'] } },
		default: '',
		description: '服务专员须已配置在升级服务专员范围，并在应用与客户联系可见范围内',
	},
	{
		displayName: '专员推荐语',
		name: 'member_wording',
		type: 'string',
		displayOptions: { show: { ...showOnly, upgradeType: ['member'] } },
		default: '',
		description: '推荐语（可选）',
		typeOptions: { rows: 3 },
	},
	{
		displayName: '客户群ID',
		name: 'groupchat_chat_id',
		type: 'string',
		required: true,
		displayOptions: { show: { ...showOnly, upgradeType: ['groupchat'] } },
		default: '',
		description: '客户群 chat_id（须已配置在升级服务客户群范围中）',
	},
	{
		displayName: '客户群推荐语',
		name: 'groupchat_wording',
		type: 'string',
		displayOptions: { show: { ...showOnly, upgradeType: ['groupchat'] } },
		default: '',
		description: '推荐语（可选）',
		typeOptions: { rows: 3 },
	},
];
