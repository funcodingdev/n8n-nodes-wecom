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
		displayName: '查询方式',
		name: 'recording_address_type',
		type: 'options',
		displayOptions: { show: showOnly },
		options: [
			{ name: '按会议录制ID获取录制地址', value: 'meetingRecord' },
			{ name: '按录制文件ID获取文件详情', value: 'recordFile' },
		],
		default: 'meetingRecord',
		description: '两种查询方式对应不同的企业微信接口',
	},
	{
		displayName: '录制文件ID',
		name: 'record_file_id',
		type: 'string',
		required: true,
		displayOptions: { show: { ...showOnly, recording_address_type: ['recordFile'] } },
		default: '',
		description: 'record_file_id，调用 record/get_file',
	},
	{
		displayName: '会议录制ID',
		name: 'meeting_record_id',
		type: 'string',
		required: true,
		displayOptions: { show: { ...showOnly, recording_address_type: ['meetingRecord'] } },
		default: '',
		description: 'meeting_record_id，调用 record/get_file_list 获取会议录制地址',
	},
];
