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
		default: '',
		displayOptions: {
			show: showOnly,
		},
		description:
			'企业成员的 UserID。<a href="https://developer.work.weixin.qq.com/document/path/92113" target="_blank">官方文档</a>；可与下方选择二选一',
		placeholder: 'zhangsan',
	},
	{
		displayName: '成员(选择)',
		name: 'userid_selected',
		type: 'options',
		typeOptions: { loadOptionsMethod: 'getAllUsers' },
		default: '',
		displayOptions: {
			show: showOnly,
		},
		description: '与上方字符串二选一；均填写时以字符串为准',
	},
];
