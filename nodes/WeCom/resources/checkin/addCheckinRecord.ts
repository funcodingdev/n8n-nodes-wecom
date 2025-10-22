import type { INodeProperties } from 'n8n-workflow';

const showOnlyForAddCheckinRecord = {
	resource: ['checkin'],
	operation: ['addCheckinRecord'],
};

export const addCheckinRecordDescription: INodeProperties[] = [
	{
		displayName: '打卡记录',
		name: 'record',
		type: 'json',
		required: true,
		displayOptions: {
			show: showOnlyForAddCheckinRecord,
		},
		default: '{}',
		description: 'Check-in record details in JSON format',
		hint: '打卡记录详情，包含userid、checkin_time、checkin_type等字段',
	},
];

