import type { INodeProperties } from 'n8n-workflow';

const showOnlyForDownloadFile = {
	resource: ['journal'],
	operation: ['downloadFile'],
};

export const downloadFileDescription: INodeProperties[] = [
	{
		displayName: '文件ID',
		name: 'fileid',
		type: 'string',
		required: true,
		displayOptions: {
			show: showOnlyForDownloadFile,
		},
		default: '',
		description: 'File ID from journal report',
		hint: '汇报中的文件ID',
	},
];

