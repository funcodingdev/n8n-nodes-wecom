import type { INodeProperties } from 'n8n-workflow';

const showOnlyForUpdateKfAccount = {
	resource: ['kf'],
	operation: ['updateKfAccount'],
};

export const updateKfAccountDescription: INodeProperties[] = [
	{
		displayName: '客服账号',
		name: 'open_kfid',
		type: 'string',
		displayOptions: { show: showOnlyForUpdateKfAccount },
		default: '',
		placeholder: 'wkxxxxxxxxxxxxxxxxxx',
		description: '要修改的客服账号。<a href="https://developer.work.weixin.qq.com/document/path/94664" target="_blank">官方文档</a>；可与下方选择二选一',
	},
	{
		displayName: '客服账号(选择)',
		name: 'open_kfid_selected',
		type: 'options',
		typeOptions: { loadOptionsMethod: 'getKfAccounts' },
		displayOptions: { show: showOnlyForUpdateKfAccount },
		default: '',
		description: '与上方字符串二选一；均填写时以字符串为准',
	},
	{
		displayName: '修改客服名称',
		name: 'updateName',
		type: 'boolean',
		displayOptions: {
			show: showOnlyForUpdateKfAccount,
		},
		default: false,
		description: '是否在本次请求中修改客服名称',
	},
	{
		displayName: '客服名称',
		name: 'name',
		type: 'string',
		displayOptions: { show: { ...showOnlyForUpdateKfAccount, updateName: [true] } },
		default: '',
		required: true,
		typeOptions: { maxLength: 16 },
		description: '新的客服账号名称，不超过16个字符。<a href="https://developer.work.weixin.qq.com/document/path/94664" target="_blank">官方文档</a>',
		placeholder: '在线客服',
	},
	{
		displayName: '修改客服头像',
		name: 'updateMediaId',
		type: 'boolean',
		displayOptions: {
			show: showOnlyForUpdateKfAccount,
		},
		default: false,
		description: '是否在本次请求中修改客服头像',
	},
	{
		displayName: '客服头像',
		name: 'media_id',
		type: 'string',
		displayOptions: { show: { ...showOnlyForUpdateKfAccount, updateMediaId: [true] } },
		default: '',
		required: true,
		description: '新的客服头像临时素材 Media ID，最大 128 字节。<a href="https://developer.work.weixin.qq.com/document/path/94664" target="_blank">官方文档</a>',
		placeholder: 'MEDIA_ID',
	},
];
