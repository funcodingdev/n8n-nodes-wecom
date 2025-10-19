import type { INodeProperties } from 'n8n-workflow';

const showOnlyForGetExportResult = {
	resource: ['contact'],
	operation: ['getExportResult'],
};

export const getExportResultDescription: INodeProperties[] = [
	{
		displayName: 'Job ID',
		name: 'jobid',
		type: 'string',
		required: true,
		displayOptions: {
			show: showOnlyForGetExportResult,
		},
		default: '',
		description: '异步任务ID，最大长度为64字节。',
		hint: '任务ID',
	},
];

