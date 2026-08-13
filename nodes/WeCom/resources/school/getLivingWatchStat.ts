import type { INodeProperties } from 'n8n-workflow';

const showOnlyForGetLivingWatchStat = {
	resource: ['school'],
	operation: ['getLivingWatchStat'],
};

export const getLivingWatchStatDescription: INodeProperties[] = [
	{
		displayName: '版本提示',
		name: 'legacyWatchStatNotice',
		type: 'notice',
		displayOptions: { show: showOnlyForGetLivingWatchStat },
		default: '',
		description: '这是旧版统计接口，学生与家长数据未拆分。新工作流建议使用“获取观看直播统计 V2”，并根据 ending 判断旧版是否拉取完成。',
	},
	{
		displayName: '直播 ID',
		name: 'livingid',
		type: 'string',
		required: true,
		displayOptions: {
			show: showOnlyForGetLivingWatchStat,
		},
		default: '',
		placeholder: 'living_001',
	},
	{
		displayName: '分页游标',
		name: 'next_key',
		type: 'string',
		displayOptions: {
			show: showOnlyForGetLivingWatchStat,
		},
		default: '',
		description: '上次请求返回的 next_key，首次可留空或填写 0',
	},
];
