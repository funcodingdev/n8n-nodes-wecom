import type { INodeProperties } from 'n8n-workflow';

const showOnly = { resource: ['wefile'], operation: ['fileShareSettings'] };

// 分享范围选项（根据官方文档）
const authScopeOptions = [
	{ name: '指定人', value: 1, description: '仅指定成员可访问' },
	{ name: '企业内', value: 2, description: '企业内获得链接的人可访问' },
	{ name: '企业外', value: 3, description: '获得链接的任何人可访问' },
	{ name: '企业内需管理员审批', value: 4, description: '企业内获得链接的人可访问，需管理员审批' },
	{ name: '企业外需管理员审批', value: 5, description: '获得链接的任何人可访问，需管理员审批' },
];

// 权限选项（根据官方文档）
const authOptions = [
	{ name: '仅浏览', value: 1, description: '只能浏览文件' },
	{ name: '仅预览', value: 4, description: '只能预览文件（仅微文档支持）' },
];

export const fileShareSettingsDescription: INodeProperties[] = [
	{
		displayName: '文件ID',
		name: 'fileId',
		type: 'string',
		required: true,
		displayOptions: { show: showOnly },
		default: '',
		description: '文件或文件夹的ID<a href="https://developer.work.weixin.qq.com/document/path/93660" target="_blank">更多信息</a>',
	},
	{
		displayName: '分享范围',
		name: 'authScope',
		type: 'options',
		required: true,
		displayOptions: { show: showOnly },
		default: 1,
		options: authScopeOptions,
	},
	{
		displayName: '更新分享权限',
		name: 'updateAuth',
		type: 'boolean',
		displayOptions: { show: showOnly },
		default: false,
		description: '开启后覆盖分享权限；关闭时保持现有权限',
	},
	{
		displayName: '权限',
		name: 'auth',
		type: 'options',
		displayOptions: { show: { ...showOnly, updateAuth: [true] } },
		default: 1,
		options: authOptions,
	},
];
