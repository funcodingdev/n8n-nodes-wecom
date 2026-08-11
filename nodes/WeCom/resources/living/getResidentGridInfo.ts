import type { INodeProperties } from 'n8n-workflow';

const showOnlyForGetResidentGridInfo = {
	resource: ['living'],
	operation: ['getResidentGridInfo'],
};

export const getResidentGridInfoDescription: INodeProperties[] = [
	{
		displayName: '提示',
		name: 'notice',
		type: 'notice',
		displayOptions: {
			show: showOnlyForGetResidentGridInfo,
		},
		default:
			'无需额外参数。调用 GET /cgi-bin/report/resident/get_grid_info。详见：https://developer.work.weixin.qq.com/document/path/93514',
	},
];
