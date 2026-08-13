import type { INodeProperties } from 'n8n-workflow';

const showOnly = { resource: ['wefile'], operation: ['fileSecuritySettings'] };
const switched = (name: string) => ({ ...showOnly, [name]: [true] });

export const fileSecuritySettingsDescription: INodeProperties[] = [
	{
		displayName: '文件ID',
		name: 'fileId',
		type: 'string',
		required: true,
		displayOptions: { show: showOnly },
		default: '',
		description: '文件的 fileid',
	},
	{
		displayName: '更新水印文字',
		name: 'updateWatermarkText',
		type: 'boolean',
		displayOptions: { show: showOnly },
		default: false,
		description: '开启后发送水印文字；空字符串可清空文字',
	},
	{
		displayName: '水印文字',
		name: 'watermarkText',
		type: 'string',
		displayOptions: { show: switched('updateWatermarkText') },
		default: '',
	},
	{
		displayName: '更新水印密度',
		name: 'updateWatermarkMargin',
		type: 'boolean',
		displayOptions: { show: showOnly },
		default: false,
	},
	{
		displayName: '水印密度',
		name: 'watermarkMarginType',
		type: 'options',
		displayOptions: { show: switched('updateWatermarkMargin') },
		default: 1,
		options: [
			{ name: '低密度水印', value: 1 },
			{ name: '高密度水印', value: 2 },
		],
	},
	{
		displayName: '更新访问人名称',
		name: 'updateShowVisitorName',
		type: 'boolean',
		displayOptions: { show: showOnly },
		default: false,
	},
	{
		displayName: '显示访问人名称',
		name: 'showVisitorName',
		type: 'boolean',
		displayOptions: { show: switched('updateShowVisitorName') },
		default: false,
		description: '仅专业版支持',
	},
	{
		displayName: '更新水印文字显示',
		name: 'updateShowWatermarkText',
		type: 'boolean',
		displayOptions: { show: showOnly },
		default: false,
	},
	{
		displayName: '显示水印文字',
		name: 'showWatermarkText',
		type: 'boolean',
		displayOptions: { show: switched('updateShowWatermarkText') },
		default: false,
	},
];
