import type { INodeProperties } from 'n8n-workflow';

const showOnlyForGetLivingUnwatchStat = {
	resource: ['school'],
	operation: ['getLivingUnwatchStat'],
};

export const getLivingUnwatchStatDescription: INodeProperties[] = [
	{
		displayName: '这是旧版统计接口，学生与家长数据未拆分。新工作流建议使用“获取未观看直播统计 V2”，并根据 ending 判断旧版是否拉取完成。',
		name: 'legacyUnwatchStatNotice',
		type: 'notice',
		displayOptions: { show: showOnlyForGetLivingUnwatchStat },
		default: '',
	},
	{
		displayName: '直播 ID',
		name: 'livingid',
		type: 'string',
		required: true,
		displayOptions: {
			show: showOnlyForGetLivingUnwatchStat,
		},
		default: '',
		placeholder: 'living_001',
	},
	{
		displayName: '分页游标',
		name: 'next_key',
		type: 'string',
		displayOptions: {
			show: showOnlyForGetLivingUnwatchStat,
		},
		default: '',
		description: '上次请求返回的 next_key，首次可留空或填写 0',
	},
];
