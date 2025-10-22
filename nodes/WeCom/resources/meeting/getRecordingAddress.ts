import type { INodeProperties } from 'n8n-workflow';

const showOnlyForGet = {
	resource: ['meeting'],
	operation: ['getRecordingAddress'],
};

export const getRecordingAddressDescription: INodeProperties[] = [
	{
		displayName: '会议录制ID',
		name: 'record_file_id',
		type: 'string',
		required: true,
		displayOptions: {
			show: showOnlyForGet,
		},
		default: '',
		description: 'Recording file ID',
		hint: '会议录制文件ID',
	},
];

