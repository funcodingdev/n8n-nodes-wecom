import type { INodeProperties } from 'n8n-workflow';

const showOnlyForGetUserLivingId = {
	resource: ['school'],
	operation: ['getUserLivingId'],
};

export const getUserLivingIdDescription: INodeProperties[] = [
	{
		displayName: '老师',
		name: 'userid',
		type: 'options',
		typeOptions: { loadOptionsMethod: 'getAllUsers' },
		required: true,
		displayOptions: {
			show: showOnlyForGetUserLivingId,
		},
		default: '',
		placeholder: 'teacher_001',
		description: '创建直播的企业成员 UserID；只能获取本应用创建的直播。<a href="https://developer.work.weixin.qq.com/document/path/93739" target="_blank">官方文档</a>',
	},
	{
		displayName: '分页游标',
		name: 'cursor',
		type: 'string',
		displayOptions: {
			show: showOnlyForGetUserLivingId,
		},
		default: '',
		description: '上次请求返回的 next_cursor，首次留空',
	},
	{
		displayName: '返回数量',
		name: 'limit',
		type: 'number',
		typeOptions: {
			minValue: 1,
			maxValue: 100,
			numberStepSize: 1,
		},
		displayOptions: {
			show: showOnlyForGetUserLivingId,
		},
		default: 100,
		description: '每次拉取数量，默认及最大均为 100',
	},
];
