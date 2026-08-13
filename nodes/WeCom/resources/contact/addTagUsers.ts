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
		displayOptions: {
			show: showOnlyForAddTagUsers,
		},
		default: '',
		placeholder: '12',
		description:
			'标签ID；可与下方选择二选一。调用的应用必须是指定标签的创建者；成员属于应用的可见范围。注意，每个标签下部门数和人员数总和不能超过3万个。<a href="https://developer.work.weixin.qq.com/document/path/90214" target="_blank">官方文档</a>',
	},
	{
		displayName: '标签(选择)',
		name: 'tagid_selected',
		type: 'options',
		typeOptions: { loadOptionsMethod: 'getTags' },
		displayOptions: {
			show: showOnlyForAddTagUsers,
		},
		default: '',
		description: '与上方标签 ID 二选一；均填写时以字符串为准',
	},
	{
		displayName: 'UserID列表',
		name: 'userlist',
		type: 'string',
		displayOptions: {
			show: showOnlyForAddTagUsers,
		},
		default: '',
		placeholder: 'user1,user2',
		description:
			'可选。企业成员 ID，逗号分隔；与下方选择合并。userlist、partylist 不能同时为空，单次最多 1000 人。<a href="https://developer.work.weixin.qq.com/document/path/90214" target="_blank">官方文档</a>',
	},
	{
		displayName: '成员(选择)',
		name: 'userlist_selected',
		type: 'multiOptions',
		typeOptions: { loadOptionsMethod: 'getAllUsers' },
		displayOptions: { show: showOnlyForAddTagUsers },
		default: [],
		description: '与上方列表合并去重',
	},
	{
		displayName: '成员列表 JSON',
		name: 'userlistJson',
		type: 'json',
		displayOptions: { show: showOnlyForAddTagUsers },
		default: '[]',
		description:
			'可选。非空数组时与上方列表/选择合并去重。支持 ["userid1"] 或 [{"userid":"userid1"}]',
	},
	{
		displayName: '部门ID列表',
		name: 'partylist',
		type: 'string',
		displayOptions: {
			show: showOnlyForAddTagUsers,
		},
		default: '',
		placeholder: '4',
		description:
			'可选。企业部门 ID，逗号分隔；与下方选择合并。userlist、partylist 不能同时为空，单次最多 100 个部门。<a href="https://developer.work.weixin.qq.com/document/path/90214" target="_blank">官方文档</a>',
	},
	{
		displayName: '部门(选择)',
		name: 'partylist_selected',
		type: 'multiOptions',
		typeOptions: { loadOptionsMethod: 'getDepartments' },
		displayOptions: { show: showOnlyForAddTagUsers },
		default: [],
		description: '与上方列表合并去重',
	},
	{
		displayName: '部门列表 JSON',
		name: 'partylistJson',
		type: 'json',
		displayOptions: { show: showOnlyForAddTagUsers },
		default: '[]',
		description:
			'可选。非空数组时与上方列表/选择合并去重。支持 [1,2] 或 [{"partyid":1}]',
	},
];


