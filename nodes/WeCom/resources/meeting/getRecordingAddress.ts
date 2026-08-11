import type { INodeProperties } from 'n8n-workflow';

const showOnly = { resource: ['meeting'], operation: ['getRecordingAddress'] };

export const getRecordingAddressDescription: INodeProperties[] = [
	{
		displayName: '会议ID',
		name: 'meetingid',
		type: 'string',
		required: true,
		displayOptions: { show: showOnly },
		default: '',
		description: '会议唯一标识ID。<a href="https://developer.work.weixin.qq.com/document/path/98193" target="_blank">官方文档</a>',
	},
	{
		displayName: '录制文件ID',
		name: 'record_file_id',
		type: 'string',
		required: true,
		displayOptions: { show: showOnly },
		default: '',
		description: '录制文件的唯一标识ID',
	},
];
