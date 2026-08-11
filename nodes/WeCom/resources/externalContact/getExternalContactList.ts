import type { INodeProperties } from 'n8n-workflow';

const showOnly = {
	resource: ['externalContact'],
	operation: ['getExternalContactList'],
};

export const getExternalContactListDescription: INodeProperties[] = [
	{
		displayName: '成员',
		name: 'userid',
		type: 'options',
		typeOptions: {
			loadOptionsMethod: 'getAllUsers',
		},
		required: true,
		default: '',
		displayOptions: {
			show: showOnly,
		},
		description: '企业成员的UserID。<a href="https://developer.work.weixin.qq.com/document/path/92113" target="_blank">官方文档</a>.。企业成员的userid',
		placeholder: 'zhangsan',
	},
];

