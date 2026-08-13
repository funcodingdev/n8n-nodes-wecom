import type { INodeProperties } from 'n8n-workflow';

const showOnlyForGetKfAccountLink = {
	resource: ['kf'],
	operation: ['getKfAccountLink'],
};

export const getKfAccountLinkDescription: INodeProperties[] = [
	{
		displayName: '客服账号',
		name: 'open_kfid',
		type: 'string',
		displayOptions: { show: showOnlyForGetKfAccountLink },
		default: '',
		placeholder: 'wkxxxxxxxxxxxxxxxxxx',
		description: '要生成会话链接的客服账号。<a href="https://developer.work.weixin.qq.com/document/path/94665" target="_blank">官方文档</a>；可与下方选择二选一',
	},
	{
		displayName: '客服账号(选择)',
		name: 'open_kfid_selected',
		type: 'options',
		typeOptions: { loadOptionsMethod: 'getKfAccounts' },
		displayOptions: { show: showOnlyForGetKfAccountLink },
		default: '',
		description: '与上方字符串二选一；均填写时以字符串为准',
	},
	{
		displayName: '场景值',
		name: 'scene',
		type: 'string',
		displayOptions: {
			show: showOnlyForGetKfAccountLink,
		},
		default: '',
		typeOptions: { maxLength: 32 },
		description: '可选场景值，最多 32 字节，仅支持数字、大小写字母、下划线和连字符。返回链接中的参数不可复制或修改。<a href="https://developer.work.weixin.qq.com/document/path/94665" target="_blank">官方文档</a>',
		placeholder: 'from_website',
	},
];
