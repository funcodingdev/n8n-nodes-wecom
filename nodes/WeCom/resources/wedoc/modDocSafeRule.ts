import type { INodeProperties } from 'n8n-workflow';

const showOnly = { resource: ['wedoc'], operation: ['modDocSafeRule'] };

export const modDocSafeRuleDescription: INodeProperties[] = [
	{
		displayName: '文档ID',
		name: 'docid',
		type: 'string',
		required: true,
		displayOptions: { show: showOnly },
		default: '',
		description: '应用自己创建的文档 ID',
	},
	{
		displayName: '更新只读成员复制/下载权限',
		name: 'updateReadonlyCopy',
		type: 'boolean',
		displayOptions: { show: showOnly },
		default: false,
		description: '开启后才会覆盖当前的 enable_readonly_copy 设置',
	},
	{
		displayName: '允许只读成员复制/下载',
		name: 'enable_readonly_copy',
		type: 'boolean',
		displayOptions: {
			show: { ...showOnly, updateReadonlyCopy: [true] },
		},
		default: false,
	},
	{
		displayName: '更新水印设置',
		name: 'updateWatermark',
		type: 'boolean',
		displayOptions: { show: showOnly },
		default: false,
		description: '开启后才会覆盖下方的水印字段',
	},
	{
		displayName: '水印疏密度',
		name: 'watermark_margin_type',
		type: 'options',
		displayOptions: { show: { ...showOnly, updateWatermark: [true] } },
		options: [
			{ name: '稀疏', value: 1 },
			{ name: '紧密', value: 2 },
		],
		default: 1,
	},
	{
		displayName: '显示访问者名字',
		name: 'watermark_show_visitor_name',
		type: 'boolean',
		displayOptions: { show: { ...showOnly, updateWatermark: [true] } },
		default: true,
	},
	{
		displayName: '显示自定义文字',
		name: 'watermark_show_text',
		type: 'boolean',
		displayOptions: { show: { ...showOnly, updateWatermark: [true] } },
		default: false,
	},
	{
		displayName: '水印文字',
		name: 'watermark_text',
		type: 'string',
		required: true,
		displayOptions: {
			show: { ...showOnly, updateWatermark: [true], watermark_show_text: [true] },
		},
		default: '',
		typeOptions: { maxLength: 255 },
	},
];
