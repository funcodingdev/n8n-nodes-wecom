import type { INodeProperties } from 'n8n-workflow';

const showOnlyForGetEventCategoryList = {
	resource: ['living'],
	operation: ['getEventCategoryList'],
};

export const getEventCategoryListDescription: INodeProperties[] = [
	{
		displayName: '提示',
		name: 'notice',
		type: 'notice',
		displayOptions: {
			show: showOnlyForGetEventCategoryList,
		},
		default: '',
		description:
			'无需额外参数。调用 POST /cgi-bin/report/grid/list_cata。<a href="https://developer.work.weixin.qq.com/document/path/94540" target="_blank">官方文档</a>',
	},
];
