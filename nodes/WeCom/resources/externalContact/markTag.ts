import type { INodeProperties } from 'n8n-workflow';

const showOnly = {
	resource: ['externalContact'],
	operation: ['markTag'],
};

export const markTagDescription: INodeProperties[] = [
	{
		displayName: '成员 Name or ID',
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
		hint: '添加外部联系人的userid',
		description: 'Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>',
	},
	{
		displayName: '外部联系人UserID',
		name: 'external_userid',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: showOnly,
		},
		hint: '外部联系人userid',
	},
	{
		displayName: '添加标签',
		name: 'add_tag',
		type: 'string',
		default: '',
		displayOptions: {
			show: showOnly,
		},
		hint: '要添加的标签ID，用逗号分隔',
		description: '要添加的标签列表',
	},
	{
		displayName: '移除标签',
		name: 'remove_tag',
		type: 'string',
		default: '',
		displayOptions: {
			show: showOnly,
		},
		hint: '要移除的标签ID，用逗号分隔',
		description: '要移除的标签列表',
	},
];

