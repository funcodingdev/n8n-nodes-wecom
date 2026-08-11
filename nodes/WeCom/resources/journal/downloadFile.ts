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
];
