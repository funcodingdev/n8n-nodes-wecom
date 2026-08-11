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
		description:
			'meetingid。<a href="https://developer.work.weixin.qq.com/document/path/98205" target="_blank">获取单个录制文件详情</a>',
	},
	{
		displayName: '录制文件ID',
		name: 'record_file_id',
		type: 'string',
		displayOptions: { show: showOnly },
		default: '',
		description: 'record_file_id；与会议录制 ID 二选一（优先会议录制 ID）',
	},
	{
		displayName: '会议录制ID',
		name: 'meeting_record_id',
		type: 'string',
		displayOptions: { show: showOnly },
		default: '',
		description:
			'meeting_record_id；有值时走 get_file_list 获取录制地址，否则用 record_file_id 查单文件详情',
	},
];
