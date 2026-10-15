import type { INodeProperties } from 'n8n-workflow';

const showOnlyForAuthSucc = {
	resource: ['contact'],
	operation: ['authSucc'],
};

export const authSuccDescription: INodeProperties[] = [
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
			show: showOnlyForAuthSucc,
		},
		description: '从列表中选择成员，或使用表达式指定 UserID。用于开启二次验证后，确认成员完成验证并加入企业。<a href="https://developer.work.weixin.qq.com/document/path/90203" target="_blank">官方文档</a>。Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>',
	},
];
