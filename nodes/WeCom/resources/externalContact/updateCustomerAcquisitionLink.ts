import type { INodeProperties } from 'n8n-workflow';

const showOnly = {
	resource: ['externalContact'],
	operation: ['updateCustomerAcquisitionLink'],
};

export const updateCustomerAcquisitionLinkDescription: INodeProperties[] = [
	{
		displayName: '链接ID',
		name: 'link_id',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: showOnly,
		},
		hint: '获客链接id',
		description: '获客链接ID',
	},
	{
		displayName: '链接名称',
		name: 'link_name',
		type: 'string',
		default: '',
		displayOptions: {
			show: showOnly,
		},
		hint: '获客链接名称',
		description: '获客链接名称',
	},
	{
		displayName: '使用人员',
		name: 'range',
		type: 'json',
		default: '[]',
		displayOptions: {
			show: showOnly,
		},
		hint: 'JSON数组格式',
		description: '使用人员列表',
	},
];

