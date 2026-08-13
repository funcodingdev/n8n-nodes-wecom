import type { INodeProperties } from 'n8n-workflow';

const showOnly = { resource: ['wefile'], operation: ['spaceSecuritySettings'] };
const withSwitch = (name: string) => ({ ...showOnly, [name]: [true] });

export const spaceSecuritySettingsDescription: INodeProperties[] = [
	{
		displayName: '空间ID',
		name: 'spaceId',
		type: 'string',
		required: true,
		displayOptions: { show: showOnly },
		default: '',
		description: '微盘空间的 spaceid',
	},
	{
		displayName: '更新水印开关',
		name: 'updateEnableWatermark',
		type: 'boolean',
		displayOptions: { show: showOnly },
		default: false,
		description: '开启后覆盖空间当前的水印设置；关闭时不发送该字段',
	},
	{
		displayName: '启用水印',
		name: 'enableWatermark',
		type: 'boolean',
		displayOptions: { show: withSwitch('updateEnableWatermark') },
		default: false,
		description: '仅专业版企业可设置',
	},
	{
		displayName: '更新保密模式',
		name: 'updateConfidentialMode',
		type: 'boolean',
		displayOptions: { show: showOnly },
		default: false,
	},
	{
		displayName: '启用保密模式',
		name: 'enableConfidentialMode',
		type: 'boolean',
		displayOptions: { show: withSwitch('updateConfidentialMode') },
		default: false,
	},
	{
		displayName: '更新邀请链接免审批',
		name: 'updateShareUrlNoApprove',
		type: 'boolean',
		displayOptions: { show: showOnly },
		default: false,
	},
	{
		displayName: '邀请链接无需审批',
		name: 'shareUrlNoApprove',
		type: 'boolean',
		displayOptions: { show: withSwitch('updateShareUrlNoApprove') },
		default: false,
	},
	{
		displayName: '邀请链接默认权限',
		name: 'shareUrlDefaultAuth',
		type: 'options',
		displayOptions: {
			show: { ...showOnly, updateShareUrlNoApprove: [true], shareUrlNoApprove: [true] },
		},
		default: 1,
		options: [
			{ name: '仅下载', value: 1 },
			{ name: '可编辑', value: 2 },
			{ name: '仅预览', value: 4 },
			{ name: '可上传下载', value: 5 },
			{ name: '自定义权限', value: 200 },
		],
	},
	{
		displayName: '更新文件默认范围',
		name: 'updateDefaultFileScope',
		type: 'boolean',
		displayOptions: { show: showOnly },
		default: false,
	},
	{
		displayName: '文件默认可查看范围',
		name: 'defaultFileScope',
		type: 'options',
		displayOptions: { show: withSwitch('updateDefaultFileScope') },
		default: 1,
		options: [
			{ name: '仅成员', value: 1 },
			{ name: '企业内', value: 2 },
		],
	},
	{
		displayName: '更新禁止对外分享',
		name: 'updateBanShareExternal',
		type: 'boolean',
		displayOptions: { show: showOnly },
		default: false,
	},
	{
		displayName: '禁止对外分享',
		name: 'banShareExternal',
		type: 'boolean',
		displayOptions: { show: withSwitch('updateBanShareExternal') },
		default: false,
	},
];
