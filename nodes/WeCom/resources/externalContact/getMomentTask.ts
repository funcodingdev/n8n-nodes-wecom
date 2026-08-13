import type { INodeProperties } from 'n8n-workflow';

const showOnly = {
	resource: ['externalContact'],
	operation: ['getMomentTask'],
};

export const getMomentTaskDescription: INodeProperties[] = [
	{
		displayName: '朋友圈ID',
		name: 'moment_id',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: showOnly,
		},
	},
	{
		displayName: 'Cursor',
		name: 'cursor',
		type: 'string',
		default: '',
		displayOptions: {
			show: showOnly,
		},
		description: '用于分页查询的游标',
	},
	{
		displayName: '每页数量',
		name: 'limit',
		type: 'number',
		typeOptions: {
			minValue: 1,
			maxValue: 1000,
			numberStepSize: 1,
		},
		default: 500,
		displayOptions: {
			show: showOnly,
		},
		description: '返回的最大记录数，默认 500，最大 1000',
	},
];
