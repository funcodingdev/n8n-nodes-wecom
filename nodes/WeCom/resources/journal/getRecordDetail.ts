import type { INodeProperties } from 'n8n-workflow';

const showOnlyForGetRecordDetail = {
	resource: ['journal'],
	operation: ['getRecordDetail'],
};

export const getRecordDetailDescription: INodeProperties[] = [
	{
		displayName: '汇报ID',
		name: 'journalid',
		type: 'string',
		required: true,
		displayOptions: {
			show: showOnlyForGetRecordDetail,
		},
		default: '',
		description: 'Journal record ID',
		hint: '汇报记录ID',
	},
];

