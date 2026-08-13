import type { INodeProperties } from 'n8n-workflow';

const showOnly = { resource: ['wedoc'], operation: ['deallocateAdvancedAccount'] };

export const deallocateAdvancedAccountDescription: INodeProperties[] = [
	{
		displayName: '成员UserID列表',
		name: 'userid_list',
		type: 'string',
		displayOptions: { show: showOnly },
		default: '',
		description: '成员 UserID，逗号分隔；与下方选择合并，最多 100 个',
		placeholder: 'user1,user2,user3',
	},
	{
		displayName: '成员(选择)',
		name: 'userid_list_selected',
		type: 'multiOptions',
		typeOptions: { loadOptionsMethod: 'getAllUsers' },
		displayOptions: { show: showOnly },
		default: [],
		description: '与上方列表合并去重，合计最多 100 个',
	},
];
