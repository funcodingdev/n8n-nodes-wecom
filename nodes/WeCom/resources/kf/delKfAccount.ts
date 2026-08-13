import type { INodeProperties } from 'n8n-workflow';

const showOnlyForDelKfAccount = {
	resource: ['kf'],
	operation: ['delKfAccount'],
};

export const delKfAccountDescription: INodeProperties[] = [
	{
		displayName: '删除提示',
		name: 'deleteKfAccountNotice',
		type: 'notice',
		displayOptions: {
			show: showOnlyForDelKfAccount,
		},
		default: '',
		description: '删除客服账号后将无法继续使用该账号提供服务，请确认所选账号无正在处理的业务。',
	},
	{
		displayName: '客服账号',
		name: 'open_kfid',
		type: 'options',
		typeOptions: {
			loadOptionsMethod: 'getKfAccounts',
		},
		required: true,
		displayOptions: {
			show: showOnlyForDelKfAccount,
		},
		default: '',
		description: '要删除的客服账号。<a href="https://developer.work.weixin.qq.com/document/path/94663" target="_blank">官方文档</a>',
		placeholder: 'wkxxxxxxxxxxxxxxxxxx',
	},
];
