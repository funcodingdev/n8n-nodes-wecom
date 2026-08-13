import type { INodeProperties } from 'n8n-workflow';

const showOnlyForDelKfAccount = {
	resource: ['kf'],
	operation: ['delKfAccount'],
};

export const delKfAccountDescription: INodeProperties[] = [
	{
		displayName: '删除客服账号后将无法继续使用该账号提供服务，请确认所选账号无正在处理的业务。',
		name: 'deleteKfAccountNotice',
		type: 'notice',
		displayOptions: {
			show: showOnlyForDelKfAccount,
		},
		default: '',
	},
	{
		displayName: '客服账号',
		name: 'open_kfid',
		type: 'string',
		displayOptions: { show: showOnlyForDelKfAccount },
		default: '',
		placeholder: 'wkxxxxxxxxxxxxxxxxxx',
		description: '要删除的客服账号。<a href="https://developer.work.weixin.qq.com/document/path/94663" target="_blank">官方文档</a>；可与下方选择二选一',
	},
	{
		displayName: '客服账号(选择)',
		name: 'open_kfid_selected',
		type: 'options',
		typeOptions: { loadOptionsMethod: 'getKfAccounts' },
		displayOptions: { show: showOnlyForDelKfAccount },
		default: '',
		description: '与上方字符串二选一；均填写时以字符串为准',
	},
];
