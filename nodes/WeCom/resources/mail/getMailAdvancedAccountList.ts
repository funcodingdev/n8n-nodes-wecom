import type { INodeProperties } from 'n8n-workflow';

const showOnlyForGetMailAdvancedAccountList = {
	resource: ['mail'],
	operation: ['getMailAdvancedAccountList'],
};

export const getMailAdvancedAccountListDescription: INodeProperties[] = [
	{
		displayName: '返回数量',
		name: 'limit',
		type: 'number',
		typeOptions: {
			minValue: 1,
			maxValue: 200,
		},
		displayOptions: {
			show: showOnlyForGetMailAdvancedAccountList,
		},
		default: 100,
		description: '每页最多 200 个；需根据 has_more 决定是否继续分页',
	},
	{
		displayName: '游标',
		name: 'cursor',
		type: 'string',
		displayOptions: {
			show: showOnlyForGetMailAdvancedAccountList,
		},
		default: '',
		placeholder: 'CURSOR_STRING',
		description: '可选。用于分页查询的游标，从上次响应中获取。<a href="https://developer.work.weixin.qq.com/document/path/95486" target="_blank">更多信息</a>',
	},
];
