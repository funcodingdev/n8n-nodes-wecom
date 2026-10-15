import type { INodeProperties } from 'n8n-workflow';

const showOnly = { resource: ['wefile'], operation: ['downloadFile'] };

export const downloadFileDescription: INodeProperties[] = [
	{
		displayName: '下载方式',
		name: 'downloadMethod',
		type: 'options',
		default: 'fileId',
		required: true,
		description: '选择指定要下载文件的方式',
		displayOptions: { show: showOnly },
		options: [
			{
				name: '文件ID',
				value: 'fileId',
				description: '通过文件ID指定要下载的文件（只支持下载普通文件，不支持下载文件夹或微文档）',
			},
			{
				name: '选择凭证',
				value: 'ticket',
				description: '通过微盘文件选择器返回的selectedTicket指定要下载的文件',
			},
		],
	},
	{
		displayName: '文件ID',
		name: 'fileId',
		type: 'string',
		required: true,
		default: '',
		placeholder: 'file_id_123',
		description: '要下载的文件ID（只支持下载普通文件，不支持下载文件夹或微文档）<a href="https://developer.work.weixin.qq.com/document/path/97881" target="_blank">更多信息</a>',
		displayOptions: {
			show: {
				...showOnly,
				downloadMethod: ['fileId'],
			},
		},
	},
	{
		displayName: '选择凭证',
		name: 'selectedTicket',
		type: 'string',
		required: true,
		default: '',
		placeholder: 'SELECTED_TICKET',
		description: '微盘和文件选择器jsapi返回的selectedTicket<a href="https://developer.work.weixin.qq.com/document/path/97881" target="_blank">更多信息</a>',
		displayOptions: {
			show: {
				...showOnly,
				downloadMethod: ['ticket'],
			},
		},
	},
];
