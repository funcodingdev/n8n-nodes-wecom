import type { INodeProperties } from 'n8n-workflow';

const showOnlyForDelTagUsers = {
	resource: ['contact'],
	operation: ['delTagUsers'],
};

export const delTagUsersDescription: INodeProperties[] = [
	{
		displayName: '标签ID',
		name: 'tagid',
		type: 'string',
		displayOptions: {
			show: showOnlyForDelTagUsers,
		},
		default: '',
		placeholder: '12',
		description: '标签ID。调用的应用必须是指定标签的创建者；成员属于应用的可见范围。<a href="https://developer.work.weixin.qq.com/document/path/90215" target="_blank">官方文档</a>；可与下方选择二选一',
	},
	{
		displayName: '标签(选择)',
		name: 'tagid_selected',
		type: 'options',
		typeOptions: { loadOptionsMethod: 'getTags' },
		default: '',
		displayOptions: {
			show: showOnlyForDelTagUsers,
		},
		description: '与上方标签 ID 二选一；均填写时以字符串为准',
	},
	{
		displayName: 'UserID列表',
		name: 'userlist',
		type: 'string',
		displayOptions: {
			show: showOnlyForDelTagUsers,
		},
		default: '',
		placeholder: 'user1,user2',
		description:
			'可选。企业成员 ID，逗号分隔；与下方选择合并。userlist、partylist 不能同时为空，单次最多 1000 人。<a href="https://developer.work.weixin.qq.com/document/path/90215" target="_blank">官方文档</a>',
	},
	{
		displayName: '成员(选择)',
		name: 'userlist_selected',
		type: 'multiOptions',
		typeOptions: { loadOptionsMethod: 'getAllUsers' },
		displayOptions: { show: showOnlyForDelTagUsers },
		default: [],
		description: '与上方列表合并去重',
	},
	{
		displayName: '成员列表 JSON',
		name: 'userlistJson',
		type: 'json',
		displayOptions: { show: showOnlyForDelTagUsers },
		default: '[]',
		description:
			'可选。非空数组时与上方列表/选择合并去重。支持 ["userid1"] 或 [{"userid":"userid1"}]',
	},
	{
		displayName: '部门ID列表',
		name: 'partylist',
		type: 'string',
		displayOptions: {
			show: showOnlyForDelTagUsers,
		},
		default: '',
		placeholder: '2,4',
		description:
			'可选。企业部门 ID，逗号分隔；与下方选择合并。userlist、partylist 不能同时为空，单次最多 100 个部门。<a href="https://developer.work.weixin.qq.com/document/path/90215" target="_blank">官方文档</a>',
	},
	{
		displayName: '部门(选择)',
		name: 'partylist_selected',
		type: 'multiOptions',
		typeOptions: { loadOptionsMethod: 'getDepartments' },
		displayOptions: { show: showOnlyForDelTagUsers },
		default: [],
		description: '与上方列表合并去重',
	},
];


