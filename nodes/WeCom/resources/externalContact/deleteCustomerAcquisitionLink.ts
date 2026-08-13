import type { INodeProperties } from 'n8n-workflow';

const showOnly = {
	resource: ['externalContact'],
	operation: ['deleteCustomerAcquisitionLink'],
};

export const deleteCustomerAcquisitionLinkDescription: INodeProperties[] = [
	{
		displayName: '删除后链接会立即失效，且无法恢复。应用只能删除由自己创建的获客链接。',
		name: 'deleteNotice',
		type: 'notice',
		default: '',
		displayOptions: { show: showOnly },
	},
	{
		displayName: '链接 ID',
		name: 'link_id',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: showOnly,
		},
		description: '需要是当前应用创建的获客链接 ID',
	},
];
