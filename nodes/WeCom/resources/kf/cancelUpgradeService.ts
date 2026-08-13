import type { INodeProperties } from 'n8n-workflow';

const showOnly = { resource: ['kf'], operation: ['cancelUpgradeService'] };

export const cancelUpgradeServiceDescription: INodeProperties[] = [
	{
		displayName: '取消提示',
		name: 'cancelUpgradeServiceNotice',
		type: 'notice',
		displayOptions: { show: showOnly },
		default: '',
		description: '调用后将清空此前为该客户指定的专员或客户群推荐，并移除企业微信中的对应状态提示。',
	},
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
		description: '微信客户的 external_userid',
		placeholder: 'wmxxxxxxxxxxxxxxxxxx',
	},
];
