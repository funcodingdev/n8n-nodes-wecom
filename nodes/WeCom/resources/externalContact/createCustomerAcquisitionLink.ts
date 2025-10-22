import type { INodeProperties } from 'n8n-workflow';

const showOnly = {
	resource: ['externalContact'],
	operation: ['createCustomerAcquisitionLink'],
};

export const createCustomerAcquisitionLinkDescription: INodeProperties[] = [
	{
		displayName: '链接名称',
		name: 'link_name',
		type: 'string',
		required: true,
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
		required: true,
		default: '[]',
		displayOptions: {
			show: showOnly,
		},
		hint: 'JSON数组格式，包含user_list或department_list',
		description: '使用人员列表',
	},
	{
		displayName: '跳过验证',
		name: 'skip_verify',
		type: 'boolean',
		default: true,
		displayOptions: {
			show: showOnly,
		},
		hint: '外部客户添加时是否无需验证',
		description: 'Whether external customers need verification when adding',
	},
];

