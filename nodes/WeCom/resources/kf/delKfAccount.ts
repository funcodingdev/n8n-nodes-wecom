import type { INodeProperties } from 'n8n-workflow';

const showOnlyForDelKfAccount = {
	resource: ['kf'],
	operation: ['delKfAccount'],
};

export const delKfAccountDescription: INodeProperties[] = [
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
		description: '客服账号的唯一标识ID。<a href="https://developer.work.weixin.qq.com/document/path/94663" target="_blank">官方文档</a>.',
		placeholder: 'wkxxxxxxxxxxxxxxxxxx',
	},
];

