import type { INodeProperties } from 'n8n-workflow';

const showOnly = {
	resource: ['externalContact'],
	operation: ['getExternalContactList'],
};

export const getExternalContactListDescription: INodeProperties[] = [
	{
		displayName: '成员UserID',
		name: 'userid',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: showOnly,
		},
		description:
			'企业成员的 UserID。<a href="https://developer.work.weixin.qq.com/document/path/92113" target="_blank">官方文档</a>',
		placeholder: 'zhangsan',
	},
];
