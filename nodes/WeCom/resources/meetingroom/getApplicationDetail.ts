import type { INodeProperties } from 'n8n-workflow';

const showOnlyForGetApplicationDetail = {
	resource: ['meetingroom'],
	operation: ['getApplicationDetail'],
};

export const getApplicationDetailDescription: INodeProperties[] = [
	{
		displayName: '申请单ID列表',
		name: 'meeting_id_list',
		type: 'string',
		required: true,
		displayOptions: {
			show: showOnlyForGetApplicationDetail,
		},
		default: '',
		description: 'Meeting application ID list separated by commas',
		hint: '申请单ID列表，用逗号分隔',
	},
];

