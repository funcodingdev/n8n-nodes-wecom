import type { INodeProperties } from 'n8n-workflow';

const showOnlyForUpdateAppChat = {
	resource: ['appChat'],
	operation: ['updateAppChat'],
};

export const updateAppChatDescription: INodeProperties[] = [
	{
		displayName: '群聊ID',
		name: 'chatid',
		type: 'string',
		displayOptions: {
			show: showOnlyForUpdateAppChat,
		},
		default: '',
		required: true,
		description: '群聊的唯一标识',
		hint: '群聊会话的 chatid',
	},
	{
		displayName: '更新类型',
		name: 'updateType',
		type: 'options',
		displayOptions: {
			show: showOnlyForUpdateAppChat,
		},
		options: [
		{
			name: '删除成员',
			value: 'delUsers',
		},
		{
			name: '添加成员',
			value: 'addUsers',
		},
		{
			name: '修改群名称',
			value: 'name',
		},
		{
			name: '修改群主',
			value: 'owner',
		},
		{
			name: '组合更新',
			value: 'combined',
		},
	],
		default: 'name',
		description: '选择要更新的内容',
		hint: '可以单独更新或组合更新多个字段',
	},
	{
		displayName: '群聊名称',
		name: 'name',
		type: 'string',
		displayOptions: {
			show: {
				...showOnlyForUpdateAppChat,
				updateType: ['name', 'combined'],
			},
		},
		default: '',
		description: '新的群聊名称',
		hint: '群聊名，最多50个utf8字符，超过将自动截断',
	},
	{
		displayName: '群主ID',
		name: 'owner',
		type: 'string',
		displayOptions: {
			show: {
				...showOnlyForUpdateAppChat,
				updateType: ['owner', 'combined'],
			},
		},
		default: '',
		description: '新的群主 ID',
		hint: '群主 ID，必须是群成员之一',
	},
	{
		displayName: '添加成员列表',
		name: 'add_user_list',
		type: 'string',
		displayOptions: {
			show: {
				...showOnlyForUpdateAppChat,
				updateType: ['addUsers', 'combined'],
			},
		},
		default: '',
		description: '要添加的成员 ID 列表',
		hint: '成员列表，用逗号分隔',
	},
	{
		displayName: '删除成员列表',
		name: 'del_user_list',
		type: 'string',
		displayOptions: {
			show: {
				...showOnlyForUpdateAppChat,
				updateType: ['delUsers', 'combined'],
			},
		},
		default: '',
		description: '要删除的成员 ID 列表',
		hint: '成员列表，用逗号分隔',
	},
];

