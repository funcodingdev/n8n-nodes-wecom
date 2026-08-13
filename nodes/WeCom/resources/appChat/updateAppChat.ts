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
		placeholder: 'mychat001',
		required: true,
		description:
			'群聊的唯一标识。<a href="https://developer.work.weixin.qq.com/document/path/98913" target="_blank">官方文档</a>',
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
		description:
			'选择要更新的内容。可以单独更新或组合更新多个字段。<a href="https://developer.work.weixin.qq.com/document/path/98913" target="_blank">官方文档</a>',
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
		placeholder: '请输入新的群聊名称',
		description:
			'单独修改群名称时必填；组合更新时按需填写。最多 50 个 UTF-8 字符。<a href="https://developer.work.weixin.qq.com/document/path/98913" target="_blank">官方文档</a>',
	},
	{
		displayName: '群主ID',
		name: 'owner',
		type: 'options',
		typeOptions: {
			loadOptionsMethod: 'getAllUsers',
		},
		displayOptions: {
			show: {
				...showOnlyForUpdateAppChat,
				updateType: ['owner', 'combined'],
			},
		},
		default: '',
		placeholder: 'userid',
		description:
			'单独修改群主时必填；组合更新时按需填写。新群主必须是群成员；删除当前群主时也必须填写。<a href="https://developer.work.weixin.qq.com/document/path/98913" target="_blank">官方文档</a>',
	},
	{
		displayName: '选择要添加的成员',
		name: 'add_user_list_selected',
		type: 'multiOptions',
		typeOptions: {
			loadOptionsMethod: 'getAllUsers',
		},
		displayOptions: {
			show: {
				...showOnlyForUpdateAppChat,
				updateType: ['addUsers', 'combined'],
			},
		},
		default: [],
		description: '从通讯录选择，将与下方手动输入合并并去重。',
	},
	{
		displayName: '添加成员 ID（手动）',
		name: 'add_user_list',
		type: 'string',
		displayOptions: {
			show: {
				...showOnlyForUpdateAppChat,
				updateType: ['addUsers', 'combined'],
			},
		},
		default: '',
		placeholder: 'user1,user2,user3',
		description:
			'单独添加成员时必填；多个成员 ID 用逗号或 | 分隔。群成员总数不可超过 2000 人。<a href="https://developer.work.weixin.qq.com/document/path/98913" target="_blank">官方文档</a>',
	},
	{
		displayName: '选择要删除的成员',
		name: 'del_user_list_selected',
		type: 'multiOptions',
		typeOptions: {
			loadOptionsMethod: 'getAllUsers',
		},
		displayOptions: {
			show: {
				...showOnlyForUpdateAppChat,
				updateType: ['delUsers', 'combined'],
			},
		},
		default: [],
		description: '从通讯录选择，将与下方手动输入合并并去重。',
	},
	{
		displayName: '删除成员 ID（手动）',
		name: 'del_user_list',
		type: 'string',
		displayOptions: {
			show: {
				...showOnlyForUpdateAppChat,
				updateType: ['delUsers', 'combined'],
			},
		},
		default: '',
		placeholder: 'user4,user5',
		description:
			'单独删除成员时必填；多个成员 ID 用逗号或 | 分隔。删除当前群主时必须同时指定新群主。<a href="https://developer.work.weixin.qq.com/document/path/98913" target="_blank">官方文档</a>',
	},
];
