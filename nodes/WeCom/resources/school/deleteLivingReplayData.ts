import type { INodeProperties } from 'n8n-workflow';

const showOnlyForDeleteLivingReplayData = {
	resource: ['school'],
	operation: ['deleteLivingReplayData'],
};

export const deleteLivingReplayDataDescription: INodeProperties[] = [
	{
		displayName: '删除提示',
		name: 'deleteLivingReplayNotice',
		type: 'notice',
		displayOptions: { show: showOnlyForDeleteLivingReplayData },
		default: '',
		description: '此操作会删除直播回放数据，且仅允许操作当前应用创建的直播。',
	},
	{
		displayName: '直播 ID',
		name: 'livingid',
		type: 'string',
		required: true,
		displayOptions: {
			show: showOnlyForDeleteLivingReplayData,
		},
		default: '',
		placeholder: 'living_001',
	},
];
