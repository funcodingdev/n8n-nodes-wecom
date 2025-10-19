import type { INodeProperties } from 'n8n-workflow';

const showOnlyForInvite = {
	resource: ['contact'],
	operation: ['inviteUser'],
};

export const inviteUserDescription: INodeProperties[] = [
	{
		displayName: 'UserID列表',
		name: 'user',
		type: 'string',
		displayOptions: {
			show: showOnlyForInvite,
		},
		default: '',
		description: '成员ID列表，多个成员ID用逗号分隔，最多支持1000个。',
		hint: 'UserID列表，用逗号分隔',
	},
	{
		displayName: '部门ID列表',
		name: 'party',
		type: 'string',
		displayOptions: {
			show: showOnlyForInvite,
		},
		default: '',
		description: '部门ID列表，多个部门ID用逗号分隔，最多支持100个。',
		hint: '部门ID列表，用逗号分隔',
	},
	{
		displayName: '标签ID列表',
		name: 'tag',
		type: 'string',
		displayOptions: {
			show: showOnlyForInvite,
		},
		default: '',
		description: '标签ID列表，多个标签ID用逗号分隔，最多支持100个。',
		hint: '标签ID列表，用逗号分隔',
	},
];

