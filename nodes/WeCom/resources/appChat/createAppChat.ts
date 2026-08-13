import type { INodeProperties } from 'n8n-workflow';

const showOnlyForCreateAppChat = {
	resource: ['appChat'],
	operation: ['createAppChat'],
};

export const createAppChatDescription: INodeProperties[] = [
	{
		displayName: '群聊名称',
		name: 'name',
		type: 'string',
		displayOptions: {
			show: showOnlyForCreateAppChat,
		},
		default: '',
		placeholder: '请输入群聊名称',
		description:
			'可选。群聊名称。最多50个utf8字符，超过将自动截断。<a href="https://developer.work.weixin.qq.com/document/path/90245" target="_blank">官方文档</a>',
	},
	{
		displayName: '群主UserID',
		name: 'owner',
		type: 'string',
		displayOptions: {
			show: showOnlyForCreateAppChat,
		},
		default: '',
		placeholder: 'zhangsan',
		description:
			'可选。指定群主的 UserID，必须是 userlist 成员之一；不填则系统随机指定；可与下方选择二选一。<a href="https://developer.work.weixin.qq.com/document/path/90245" target="_blank">官方文档</a>',
	},
	{
		displayName: '群主(选择)',
		name: 'owner_selected',
		type: 'options',
		typeOptions: { loadOptionsMethod: 'getAllUsers' },
		displayOptions: {
			show: showOnlyForCreateAppChat,
		},
		default: '',
		description: '与上方字符串二选一；均填写时以字符串为准',
	},
	{
		displayName: '选择成员',
		name: 'userlist_selected',
		type: 'multiOptions',
		typeOptions: {
			loadOptionsMethod: 'getAllUsers',
		},
		displayOptions: {
			show: showOnlyForCreateAppChat,
		},
		default: [],
		description: '从通讯录中选择群成员，将与下方手动输入合并并去重。',
	},
	{
		displayName: '成员 ID（手动）',
		name: 'userlist',
		type: 'string',
		displayOptions: {
			show: showOnlyForCreateAppChat,
		},
		default: '',
		placeholder: 'user1,user2,user3',
		description:
			'多个群成员 ID 用逗号或 | 分隔。至少 2 人，至多 2000 人（含应用）。<a href="https://developer.work.weixin.qq.com/document/path/90245" target="_blank">官方文档</a>',
	},
	{
		displayName: '指定群聊ID',
		name: 'chatid',
		type: 'string',
		displayOptions: {
			show: showOnlyForCreateAppChat,
		},
		default: '',
		placeholder: 'mychat001',
		description: '可选。群聊的唯一标识。不能与已有的群重复。字符串类型，最长32个字符，只允许字符0-9及字母a-zA-Z。如果不填，系统会随机生成群ID。<a href="https://developer.work.weixin.qq.com/document/path/90245" target="_blank">官方文档</a>',
	},
];
