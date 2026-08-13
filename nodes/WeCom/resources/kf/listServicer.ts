import type { INodeProperties } from 'n8n-workflow';

const showOnlyForListServicer = {
	resource: ['kf'],
	operation: ['listServicer'],
};

export const listServicerDescription: INodeProperties[] = [
	{
		displayName: '客服账号',
		name: 'open_kfid',
		type: 'string',
		displayOptions: { show: showOnlyForListServicer },
		default: '',
		placeholder: 'wkxxxxxxxxxxxxxxxxxx',
		description: '要查询接待人员的客服账号。返回结果包含成员接待状态及部门 ID。<a href="https://developer.work.weixin.qq.com/document/path/94645" target="_blank">官方文档</a>；可与下方选择二选一',
	},
	{
		displayName: '客服账号(选择)',
		name: 'open_kfid_selected',
		type: 'options',
		typeOptions: { loadOptionsMethod: 'getKfAccounts' },
		displayOptions: { show: showOnlyForListServicer },
		default: '',
		description: '与上方字符串二选一；均填写时以字符串为准',
	},
];
