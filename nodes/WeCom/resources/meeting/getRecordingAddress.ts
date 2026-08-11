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
		required: true,
		displayOptions: { show: showOnly },
		default: '',
		description: 'record_file_id，可获取播放/下载地址',
	},
	{
		displayName: '会议录制ID(可选)',
		name: 'meeting_record_id',
		type: 'string',
		displayOptions: { show: showOnly },
		default: '',
		description:
			'若调用「获取会议录制地址」接口（get_file_list）可填 meeting_record_id；留空则按 record_file_id 查询单个文件详情',
	},
];
