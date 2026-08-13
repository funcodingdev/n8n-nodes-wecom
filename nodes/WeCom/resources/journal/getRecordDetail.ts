import type { INodeProperties } from 'n8n-workflow';

const showOnlyForGetRecordDetail = {
	resource: ['journal'],
	operation: ['getRecordDetail'],
};

export const getRecordDetailDescription: INodeProperties[] = [
	{
		displayName: '汇报记录ID',
		name: 'journalid',
		type: 'string',
		required: true,
		displayOptions: {
			show: showOnlyForGetRecordDetail,
		},
		default: '',
		placeholder: 'JOURNAL_ID_STRING',
		description: '汇报记录的 journaluuid，从汇报记录列表获取，不超过 256 字节',
	},
];
