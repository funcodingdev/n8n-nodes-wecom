import type { INodeProperties } from 'n8n-workflow';

const showOnlyForGetKfAccountLink = {
	resource: ['kf'],
	operation: ['getKfAccountLink'],
};

export const getKfAccountLinkDescription: INodeProperties[] = [
	{
		displayName: '客服账号',
		name: 'open_kfid',
		type: 'options',
		typeOptions: {
			loadOptionsMethod: 'getKfAccounts',
		},
		required: true,
		displayOptions: {
			show: showOnlyForGetKfAccountLink,
		},
		default: '',
		description: '客服账号的唯一标识ID。<a href="https://developer.work.weixin.qq.com/document/path/94665" target="_blank">官方文档</a>.',
		placeholder: 'wkxxxxxxxxxxxxxxxxxx',
	},
	{
		displayName: '场景值',
		name: 'scene',
		type: 'string',
		displayOptions: {
			show: showOnlyForGetKfAccountLink,
		},
		default: '',
		description: '场景值，字符串类型，由开发者自定义，用于区分不同的链接来源。<a href="https://developer.work.weixin.qq.com/document/path/94665" target="_blank">官方文档</a>',
		placeholder: 'from_website',
	},
];

