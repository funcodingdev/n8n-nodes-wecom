import type { INodeProperties } from 'n8n-workflow';

const showOnlyForGetResidentEventDetail = {
	resource: ['living'],
	operation: ['getResidentEventDetail'],
};

export const getResidentEventDetailDescription: INodeProperties[] = [
	{
		displayName: '工单ID',
		name: 'order_id',
		type: 'string',
		required: true,
		displayOptions: {
			show: showOnlyForGetResidentEventDetail,
		},
		default: '',
		placeholder: 'order_id',
		description:
			'工单 id（order_id）。<a href="https://developer.work.weixin.qq.com/document/path/93519" target="_blank">官方文档</a>',
	},
];
