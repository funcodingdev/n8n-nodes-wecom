import type { INodeProperties } from 'n8n-workflow';

const showOnly = { resource: ['kf'], operation: ['cancelUpgradeService'] };

export const cancelUpgradeServiceDescription: INodeProperties[] = [
	{
		displayName: '调用后将清空此前为该客户指定的专员或客户群推荐，并移除企业微信中的对应状态提示。',
		name: 'cancelUpgradeServiceNotice',
		type: 'notice',
		displayOptions: { show: showOnly },
		default: '',
	},
	{
		displayName: '客服账号',
		name: 'open_kfid',
		type: 'string',
		displayOptions: { show: showOnly },
		default: '',
		placeholder: 'wkxxxxxxxxxxxxxxxxxx',
		description: '客服账号 ID。<a href="https://developer.work.weixin.qq.com/document/path/94674" target="_blank">官方文档</a>；可与下方选择二选一',
	},
	{
		displayName: '客服账号(选择)',
		name: 'open_kfid_selected',
		type: 'options',
		typeOptions: { loadOptionsMethod: 'getKfAccounts' },
		displayOptions: { show: showOnly },
		default: '',
		description: '与上方字符串二选一；均填写时以字符串为准',
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
