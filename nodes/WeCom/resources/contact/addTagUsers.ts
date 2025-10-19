import type { INodeProperties } from 'n8n-workflow';

const showOnlyForAddTagUsers = {
	resource: ['contact'],
	operation: ['addTagUsers'],
};

export const addTagUsersDescription: INodeProperties[] = [
	{
		displayName: '标签ID',
		name: 'tagid',
		type: 'string',
		required: true,
		displayOptions: {
			show: showOnlyForAddTagUsers,
		},
		default: '',
		description: '标签ID。',
		hint: '标签ID',
	},
	{
		displayName: 'UserID列表',
		name: 'userlist',
		type: 'string',
		displayOptions: {
			show: showOnlyForAddTagUsers,
		},
		default: '',
		description: '企业成员ID列表，多个成员ID用逗号分隔，注意：userlist、partylist不能同时为空。',
		hint: 'UserID列表，用逗号分隔',
	},
	{
		displayName: '部门ID列表',
		name: 'partylist',
		type: 'string',
		displayOptions: {
			show: showOnlyForAddTagUsers,
		},
		default: '',
		description: '企业部门ID列表，多个部门ID用逗号分隔，注意：userlist、partylist不能同时为空。',
		hint: '部门ID列表，用逗号分隔',
	},
];

