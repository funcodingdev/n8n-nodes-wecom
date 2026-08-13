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
		description: '要生成会话链接的客服账号。<a href="https://developer.work.weixin.qq.com/document/path/94665" target="_blank">官方文档</a>',
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
		typeOptions: { maxLength: 32 },
		description: '可选场景值，最多 32 字节，仅支持数字、大小写字母、下划线和连字符。返回链接中的参数不可复制或修改。<a href="https://developer.work.weixin.qq.com/document/path/94665" target="_blank">官方文档</a>',
		placeholder: 'from_website',
	},
];
