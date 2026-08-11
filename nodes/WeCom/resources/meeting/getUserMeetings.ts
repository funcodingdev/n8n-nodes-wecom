import type { INodeProperties } from 'n8n-workflow';

const showOnlyForGet = {
	resource: ['meeting'],
	operation: ['getUserMeetings'],
};

export const getUserMeetingsDescription: INodeProperties[] = [
	{
		displayName: '用户ID',
		name: 'userid',
		type: 'string',
		required: true,
		displayOptions: { show: showOnlyForGet },
		default: '',
		description:
			'userid。<a href="https://developer.work.weixin.qq.com/document/path/98150" target="_blank">官方文档</a>',
	},
	{
		displayName: '开始时间',
		name: 'begin_time',
		type: 'dateTime',
		displayOptions: { show: showOnlyForGet },
		default: '',
		description: 'begin_time；空表示不传',
	},
	{
		displayName: '结束时间',
		name: 'end_time',
		type: 'dateTime',
		displayOptions: { show: showOnlyForGet },
		default: '',
		description: 'end_time，与 begin 跨度不超过 180 天；空表示默认当前时间',
	},
	{
		displayName: '游标',
		name: 'cursor',
		type: 'string',
		displayOptions: { show: showOnlyForGet },
		default: '',
		description: 'cursor，首次可留空或 0',
	},
	{
		displayName: '限制数量',
		name: 'limit',
		type: 'number',
		typeOptions: { minValue: 1, maxValue: 100 },
		displayOptions: { show: showOnlyForGet },
		default: 50,
		description: 'limit，最大 100',
	},
];
