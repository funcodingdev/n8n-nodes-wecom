import type { INodeProperties } from 'n8n-workflow';

const showOnlyForGetResidentGridInfo = {
	resource: ['living'],
	operation: ['getResidentGridInfo'],
};

export const getResidentGridInfoDescription: INodeProperties[] = [
	{
		displayName: '无需额外参数。调用 GET /cgi-bin/report/resident/get_grid_info。<a href="https://developer.work.weixin.qq.com/document/path/93514" target="_blank">官方文档</a>',
		name: 'notice',
		type: 'notice',
		displayOptions: {
			show: showOnlyForGetResidentGridInfo,
		},
		default: '',
	},
];
