import type { INodeProperties } from 'n8n-workflow';

const showOnlyForListKfAccount = {
	resource: ['kf'],
	operation: ['listKfAccount'],
};

export const listKfAccountDescription: INodeProperties[] = [
	{
		displayName: '偏移量',
		name: 'offset',
		type: 'number',
		typeOptions: {
			minValue: 0,
			maxValue: 4294967295,
			numberStepSize: 1,
		},
		displayOptions: {
			show: showOnlyForListKfAccount,
		},
		default: 0,
		description: '分页偏移量，首次请求填写 0，后续请求累加上一页返回数量',
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
			show: showOnlyForListKfAccount,
		},
		default: 100,
		description: '每页返回的记录数量，默认及最大均为 100。<a href="https://developer.work.weixin.qq.com/document/path/94661" target="_blank">官方文档</a>',
	},
];
