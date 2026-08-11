import type { INodeProperties } from 'n8n-workflow';

const showOnlyForCancel = {
	resource: ['meeting'],
	operation: ['cancelMeeting'],
};

export const cancelMeetingDescription: INodeProperties[] = [
	{
		displayName: '会议ID',
		name: 'meetingid',
		type: 'string',
		required: true,
		displayOptions: { show: showOnlyForCancel },
		default: '',
		description:
			'meetingid，仅允许取消预约中的会议。<a href="https://developer.work.weixin.qq.com/document/path/98153" target="_blank">官方文档</a>',
	},
	{
		displayName: '周期性子会议ID',
		name: 'sub_meetingid',
		type: 'string',
		displayOptions: { show: showOnlyForCancel },
		default: '',
		description: 'sub_meetingid，取消周期会议中的某一场时填写',
	},
];

