import type { INodeProperties } from 'n8n-workflow';

const showOnlyForGetResult = {
	resource: ['contact'],
	operation: ['getAsyncResult'],
};

export const getAsyncResultDescription: INodeProperties[] = [
	{
		displayName: 'Job ID',
		name: 'jobid',
		type: 'string',
		required: true,
		displayOptions: {
			show: showOnlyForGetResult,
		},
		default: '',
		description: '异步任务ID，最大长度为64字节。',
		hint: '任务ID',
	},
];

