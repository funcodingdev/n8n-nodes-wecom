import type { INodeProperties } from 'n8n-workflow';

const showOnlyForGetInspectEventDetail = {
	resource: ['living'],
	operation: ['getInspectEventDetail'],
};

export const getInspectEventDetailDescription: INodeProperties[] = [
	{
		displayName: '工单ID',
		name: 'order_id',
		type: 'string',
		required: true,
		displayOptions: {
			show: showOnlyForGetInspectEventDetail,
		},
		default: '',
		placeholder: 'order_id',
		description:
			'工单 id（order_id）。<a href="https://developer.work.weixin.qq.com/document/path/93535" target="_blank">官方文档</a>',
	},
];
