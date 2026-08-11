import type { INodeProperties } from 'n8n-workflow';

const showOnlyForListServicer = {
	resource: ['kf'],
	operation: ['listServicer'],
};

export const listServicerDescription: INodeProperties[] = [
	{
		displayName: '客服账号',
		name: 'open_kfid',
		type: 'options',
		typeOptions: {
			loadOptionsMethod: 'getKfAccounts',
		},
		required: true,
		displayOptions: {
			show: showOnlyForListServicer,
		},
		default: '',
		description: '客服账号的唯一标识ID。<a href="https://developer.work.weixin.qq.com/document/path/94645" target="_blank">官方文档</a>.',
		placeholder: 'wkxxxxxxxxxxxxxxxxxx',
	},
];

