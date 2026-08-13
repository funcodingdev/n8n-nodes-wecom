import type { INodeProperties } from 'n8n-workflow';

const showOnlyForDownloadFile = {
	resource: ['journal'],
	operation: ['downloadFile'],
};

export const downloadFileDescription: INodeProperties[] = [
	{
		displayName: '汇报记录ID',
		name: 'journaluuid',
		type: 'string',
		required: true,
		displayOptions: {
			show: showOnlyForDownloadFile,
		},
		default: '',
		placeholder: 'JOURNAL_UUID',
		description:
			'汇报记录 id（journaluuid）。须与附件所属汇报一致。<a href="https://developer.work.weixin.qq.com/document/path/98021" target="_blank">官方文档</a>',
	},
	{
		displayName: '微盘文件ID',
		name: 'fileid',
		type: 'string',
		required: true,
		displayOptions: {
			show: showOnlyForDownloadFile,
		},
		default: '',
		placeholder: 'FILE_ID_STRING',
		description:
			'微盘 fileid，来自「获取汇报记录详情」返回的 wedrive_files。<a href="https://developer.work.weixin.qq.com/document/path/98021" target="_blank">官方文档</a>',
	},
	{
		displayName: '结果方式',
		name: 'downloadMode',
		type: 'options',
		displayOptions: { show: showOnlyForDownloadFile },
		options: [
			{ name: '下载为二进制数据', value: 'binary' },
			{ name: '仅返回临时下载凭据', value: 'credentials' },
		],
		default: 'binary',
		description: '接口先返回两小时有效的下载地址和 Cookie；可继续下载文件，或仅输出这些临时凭据',
	},
	{
		displayName: '二进制数据属性',
		name: 'binaryProperty',
		type: 'string',
		required: true,
		displayOptions: { show: { ...showOnlyForDownloadFile, downloadMode: ['binary'] } },
		default: 'data',
		description: '保存下载文件的输出二进制属性名称',
	},
	{
		displayName: '输出文件名',
		name: 'fileName',
		type: 'string',
		required: true,
		displayOptions: { show: { ...showOnlyForDownloadFile, downloadMode: ['binary'] } },
		default: 'journal-attachment',
		description: '下载文件在 n8n 中显示的名称，可包含扩展名',
	},
];
