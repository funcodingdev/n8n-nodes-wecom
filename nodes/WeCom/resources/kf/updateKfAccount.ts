import type { INodeProperties } from 'n8n-workflow';

const showOnlyForUpdateKfAccount = {
	resource: ['kf'],
	operation: ['updateKfAccount'],
};

export const updateKfAccountDescription: INodeProperties[] = [
	{
		displayName: '客服账号',
		name: 'open_kfid',
		type: 'options',
		typeOptions: {
			loadOptionsMethod: 'getKfAccounts',
		},
		required: true,
		displayOptions: {
			show: showOnlyForUpdateKfAccount,
		},
		default: '',
		description: '客服账号的唯一标识ID。<a href="https://developer.work.weixin.qq.com/document/path/94664" target="_blank">官方文档</a>.',
		placeholder: 'wkxxxxxxxxxxxxxxxxxx',
	},
	{
		displayName: '客服名称',
		name: 'name',
		type: 'string',
		displayOptions: {
			show: showOnlyForUpdateKfAccount,
		},
		default: '',
		description: '新的客服账号名称，不超过16个字符。<a href="https://developer.work.weixin.qq.com/document/path/94664" target="_blank">官方文档</a>',
		placeholder: '在线客服',
	},
	{
		displayName: '客服头像',
		name: 'media_id',
		type: 'string',
		displayOptions: {
			show: showOnlyForUpdateKfAccount,
		},
		default: '',
		description: '新的客服头像临时素材MediaID，可通过素材管理接口上传获取。<a href="https://developer.work.weixin.qq.com/document/path/94664" target="_blank">官方文档</a>',
		placeholder: 'MEDIA_ID',
	},
];

