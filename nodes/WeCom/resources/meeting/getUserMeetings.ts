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
		displayOptions: {
			show: showOnlyForGet,
		},
		default: '',
		description: '要查询会议列表的用户ID。<a href="https://developer.work.weixin.qq.com/document/path/98150" target="_blank">官方文档</a>',
	},
	{
		displayName: '游标',
		name: 'cursor',
		type: 'string',
		displayOptions: {
			show: showOnlyForGet,
		},
		default: '',
		description: '分页查询的游标，用于获取后续页面的数据',
	},
	{
		displayName: '限制数量',
		name: 'limit',
		type: 'number',
		typeOptions: {
			minValue: 1,
		},
		displayOptions: {
			show: showOnlyForGet,
		},
		default: 50,
		description: '单次返回的会议数量上限',
	},
];

