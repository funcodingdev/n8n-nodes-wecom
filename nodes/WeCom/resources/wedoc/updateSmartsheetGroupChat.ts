import type { INodeProperties } from 'n8n-workflow';

const showOnly = {
	resource: ['wedoc'],
	operation: ['updateSmartsheetGroupChat'],
};

export const updateSmartsheetGroupChatDescription: INodeProperties[] = [
	{
		displayName: '智能表格ID',
		name: 'docid',
		type: 'string',
		displayOptions: {
			show: showOnly,
		},
		default: '',
		placeholder: 'DOCID',
		required: true,
		description: '必填。智能表格ID，需为当前应用创建的智能表格',
	},
	{
		displayName: '群聊ID',
		name: 'chat_id',
		type: 'string',
		displayOptions: {
			show: showOnly,
		},
		default: '',
		placeholder: 'CHATID',
		required: true,
		description: '必填。群聊ID，需为对应智能表自动规则创建群聊的ID',
	},
	{
		displayName: '新群主ID',
		name: 'owner',
		type: 'string',
		displayOptions: {
			show: showOnly,
		},
		default: '',
		placeholder: 'userid',
		description:
			'可选。新群主的ID，若不需更新请忽略。注意：del_user_list包含群主时本字段必填。群主需为本企业成员；可与下方选择二选一',
	},
	{
		displayName: '新群主(选择)',
		name: 'owner_selected',
		type: 'options',
		typeOptions: { loadOptionsMethod: 'getAllUsers' },
		displayOptions: {
			show: showOnly,
		},
		default: '',
		description: '与上方字符串二选一；均填写时以字符串为准',
	},
	{
		displayName: '添加成员列表',
		name: 'add_user_list',
		type: 'string',
		displayOptions: {
			show: showOnly,
		},
		default: '',
		placeholder: 'userid1,userid2,userid3',
		description:
			'可选。添加成员的ID列表，用逗号分隔；与下方选择合并，一次最多传入500人。操作的成员需为对应的智能表格中的成员',
	},
	{
		displayName: '添加成员(选择)',
		name: 'add_user_list_selected',
		type: 'multiOptions',
		typeOptions: { loadOptionsMethod: 'getAllUsers' },
		displayOptions: {
			show: showOnly,
		},
		default: [],
		description: '与上方添加列表合并去重',
	},
	{
		displayName: '添加成员 JSON',
		name: 'addUserListJson',
		type: 'json',
		displayOptions: {
			show: showOnly,
		},
		default: '[]',
		description:
			'可选。非空数组时与上方列表/选择合并去重。支持 ["userid1"] 或 [{"userid":"userid1"}]',
	},
	{
		displayName: '删除成员列表',
		name: 'del_user_list',
		type: 'string',
		displayOptions: {
			show: showOnly,
		},
		default: '',
		placeholder: 'userid3,userid4',
		description:
			'可选。踢出成员的ID列表，用逗号分隔；与下方选择合并，一次最多传入500人。注意：如果删除列表中包含群主，则owner字段必填',
	},
	{
		displayName: '删除成员(选择)',
		name: 'del_user_list_selected',
		type: 'multiOptions',
		typeOptions: { loadOptionsMethod: 'getAllUsers' },
		displayOptions: {
			show: showOnly,
		},
		default: [],
		description: '与上方删除列表合并去重',
	},
	{
		displayName: '删除成员 JSON',
		name: 'delUserListJson',
		type: 'json',
		displayOptions: {
			show: showOnly,
		},
		default: '[]',
		description:
			'可选。非空数组时与上方列表/选择合并去重。支持 ["userid1"] 或 [{"userid":"userid1"}]',
	},
];
