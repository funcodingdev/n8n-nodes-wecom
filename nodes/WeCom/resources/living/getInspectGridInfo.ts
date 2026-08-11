import type { INodeProperties } from 'n8n-workflow';

const showOnlyForGetInspectGridInfo = {
	resource: ['living'],
	operation: ['getInspectGridInfo'],
};

export const getInspectGridInfoDescription: INodeProperties[] = [
	{
		displayName: '提示',
		name: 'notice',
		type: 'notice',
		displayOptions: {
			show: showOnlyForGetInspectGridInfo,
		},
		default:
			'无需额外参数。调用 GET /cgi-bin/report/patrol/get_grid_info。详见：https://developer.work.weixin.qq.com/document/path/93531',
	},
];
