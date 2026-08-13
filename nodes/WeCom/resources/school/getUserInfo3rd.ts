import type { INodeProperties } from 'n8n-workflow';

const showOnly = {
	resource: ['school'],
	operation: ['getUserInfo3rd'],
};

export const getUserInfo3rdDescription: INodeProperties[] = [
	{
		displayName: '仅第三方应用使用，代开发自建应用不可调用。授权 Code 只能使用一次，5 分钟内有效，且跳转域名须完全匹配应用可信域名。',
		name: 'getUserInfo3rdNotice',
		type: 'notice',
		displayOptions: { show: showOnly },
		default: '',
	},
	{
		displayName: 'Suite Access Token',
		name: 'suiteAccessToken',
		type: 'string',
		typeOptions: { password: true },
		required: true,
		displayOptions: {
			show: showOnly,
		},
		default: '',
		description: '第三方应用的 suite_access_token',
	},
	{
		displayName: '授权码',
		name: 'code',
		type: 'string',
		required: true,
		displayOptions: {
			show: showOnly,
		},
		default: '',
		description: '通过网页授权获取的 Code，最大 512 字节。<a href="https://developer.work.weixin.qq.com/document/path/91121" target="_blank">官方文档</a>',
	},
];
