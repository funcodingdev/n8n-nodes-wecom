import type { INodeProperties } from 'n8n-workflow';

const show = (ops: string[]) => ({
	show: { resource: ['wefile'], operation: ops },
});

export const chunkUploadOpsDescription: INodeProperties[] = [
	{
		displayName: '上传位置方式',
		name: 'uploadLocationMethod',
		type: 'options',
		required: true,
		displayOptions: show(['uploadInit']),
		default: 'space',
		options: [
			{ name: '空间和文件夹', value: 'space' },
			{ name: '选择凭证', value: 'ticket' },
		],
	},
	{
		displayName: '空间ID',
		name: 'spaceId',
		type: 'string',
		required: true,
		displayOptions: {
			show: { resource: ['wefile'], operation: ['uploadInit'], uploadLocationMethod: ['space'] },
		},
		default: '',
	},
	{
		displayName: '父目录ID',
		name: 'fatherId',
		type: 'string',
		displayOptions: {
			show: { resource: ['wefile'], operation: ['uploadInit'], uploadLocationMethod: ['space'] },
		},
		default: '',
		description: '根目录时为 spaceid',
	},
	{
		displayName: '选择凭证',
		name: 'selectedTicket',
		type: 'string',
		required: true,
		displayOptions: {
			show: { resource: ['wefile'], operation: ['uploadInit'], uploadLocationMethod: ['ticket'] },
		},
		default: '',
		description: '微盘文件选择器返回的 selected_ticket',
	},
	{
		displayName: '文件名',
		name: 'fileName',
		type: 'string',
		required: true,
		displayOptions: show(['uploadInit']),
		default: '',
	},
	{
		displayName: '文件大小(字节)',
		name: 'fileSize',
		type: 'number',
		required: true,
		displayOptions: show(['uploadInit']),
		default: 0,
		typeOptions: { minValue: 1, maxValue: 21474836480 },
		description: '文件字节数，最大 20GiB',
	},
	{
		displayName: '分块SHA列表',
		name: 'block_sha',
		type: 'string',
		required: true,
		displayOptions: show(['uploadInit']),
		default: '',
		description:
			'每个 2MiB 分块的累积 SHA-1（40 位十六进制），可用逗号、中文逗号、竖线或换行分隔；与下方 JSON 合并',
	},
	{
		displayName: '分块SHA列表 JSON',
		name: 'blockShaJson',
		type: 'json',
		displayOptions: show(['uploadInit']),
		default: '[]',
		description:
			'可选。非空数组时与上方列表合并去重。支持 ["sha1..."] 或 [{"sha":"sha1..."}]',
	},
	{
		displayName: '跳过推送卡片',
		name: 'skip_push_card',
		type: 'boolean',
		displayOptions: show(['uploadInit']),
		default: false,
	},
	{
		displayName: 'upload_key',
		name: 'upload_key',
		type: 'string',
		required: true,
		displayOptions: show(['uploadPart', 'uploadFinish']),
		default: '',
		description: 'upload_init 返回的 upload_key',
	},
	{
		displayName: '分块序号',
		name: 'part_index',
		type: 'number',
		required: true,
		displayOptions: show(['uploadPart']),
		default: 1,
		typeOptions: { minValue: 1, maxValue: 10240 },
		description: 'index，从 1 开始',
	},
	{
		displayName: '分块Base64内容',
		name: 'file_base64_content',
		type: 'string',
		required: true,
		displayOptions: show(['uploadPart']),
		default: '',
		typeOptions: { rows: 3 },
		description: '纯 Base64 分块内容，不含 data URL 前缀，解码后最大 2MiB',
	},
];
