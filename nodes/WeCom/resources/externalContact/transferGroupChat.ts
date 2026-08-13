import type { INodeProperties } from 'n8n-workflow';

const showOnly = {
	resource: ['externalContact'],
	operation: ['transferGroupChat'],
};

export const transferGroupChatDescription: INodeProperties[] = [
	{
		displayName: '客户群ID列表',
		name: 'chat_id_list',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: showOnly,
		},
		description: '需要转群主的客户群 ID，逗号分隔；与下方 JSON 合并去重，最多 100 个',
		placeholder: 'wrxxxxxxxx,wryyyyyyyy',
	},
	{
		displayName: '客户群ID列表 JSON',
		name: 'chatIdListJson',
		type: 'json',
		default: '[]',
		displayOptions: { show: showOnly },
		description:
			'可选。非空数组时与上方列表合并去重。支持 ["wrxxx"] 或 [{"chat_id":"wrxxx"}]',
	},
	{
		displayName: '新群主UserID',
		name: 'new_owner',
		type: 'string',
		default: '',
		placeholder: 'zhangsan',
		displayOptions: {
			show: showOnly,
		},
		description: '新群主的成员 UserID；可与下方选择二选一',
	},
	{
		displayName: '新群主(选择)',
		name: 'new_owner_selected',
		type: 'options',
		typeOptions: { loadOptionsMethod: 'getAllUsers' },
		displayOptions: {
			show: showOnly,
		},
		default: '',
		description: '与上方字符串二选一；均填写时以字符串为准',
	},
];
