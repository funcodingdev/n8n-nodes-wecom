import type { INodeProperties } from 'n8n-workflow';

const showOnlyForAddKfAccount = {
	resource: ['kf'],
	operation: ['addKfAccount'],
};

export const addKfAccountDescription: INodeProperties[] = [
	{
		displayName: '客服名称',
		name: 'name',
		type: 'string',
		required: true,
		displayOptions: {
			show: showOnlyForAddKfAccount,
		},
		default: '',
		description: '客服账号的名称，用于展示给客户，不超过16个字符。<a href="https://developer.work.weixin.qq.com/document/path/94662" target="_blank">官方文档</a>',
		typeOptions: { maxLength: 16 },
		placeholder: '在线客服',
	},
	{
		displayName: '客服头像',
		name: 'media_id',
		type: 'string',
		required: true,
		displayOptions: {
			show: showOnlyForAddKfAccount,
		},
		default: '',
		description: '客服头像的临时素材 Media ID，最大 128 字节，可通过素材管理接口上传获取。<a href="https://developer.work.weixin.qq.com/document/path/94662" target="_blank">官方文档</a>',
		placeholder: 'MEDIA_ID',
	},
];
