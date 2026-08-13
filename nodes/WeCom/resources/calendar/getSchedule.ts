import type { INodeProperties } from 'n8n-workflow';

const showOnlyForGet = {
	resource: ['calendar'],
	operation: ['getSchedule'],
};

export const getScheduleDescription: INodeProperties[] = [
	{
		displayName: '日程ID列表',
		name: 'schedule_id_list',
		type: 'string',
		required: true,
		displayOptions: {
			show: showOnlyForGet,
		},
		default: '',
		description: '日程ID列表，用逗号分隔；与下方 JSON 合并去重。一次最多拉取1000条',
		placeholder: '17c7d2bd9f20d652840f72f59e796AAA,27c7d2bd9f20d652840f72f59e796BBB',
	},
	{
		displayName: '日程ID列表 JSON',
		name: 'scheduleIdListJson',
		type: 'json',
		displayOptions: {
			show: showOnlyForGet,
		},
		default: '[]',
		description:
			'可选。非空数组时与上方列表合并去重。支持 ["id1"] 或 [{"schedule_id":"id1"}]',
	},
];

