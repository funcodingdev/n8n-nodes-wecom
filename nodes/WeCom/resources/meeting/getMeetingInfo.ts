import type { INodeProperties } from 'n8n-workflow';

const showOnlyForGet = {
	resource: ['meeting'],
	operation: ['getMeetingInfo'],
};

export const getMeetingInfoDescription: INodeProperties[] = [
	{
		displayName: '会议ID',
		name: 'meetingid',
		type: 'string',
		displayOptions: { show: showOnlyForGet },
		default: '',
		description:
			'meetingid，与入会码二选一。<a href="https://developer.work.weixin.qq.com/document/path/98149" target="_blank">官方文档</a>',
	},
	{
		displayName: '入会码',
		name: 'meeting_code',
		type: 'string',
		displayOptions: { show: showOnlyForGet },
		default: '',
		description: 'meeting_code，与会议 ID 二选一',
	},
	{
		displayName: '周期性子会议ID',
		name: 'sub_meetingid',
		type: 'string',
		displayOptions: { show: showOnlyForGet },
		default: '',
		description: 'sub_meetingid，周期会议可选',
	},
];
