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
		placeholder: 'UserID1,UserID2,UserID3',
		description:
			'可选。成员 ID 列表，最多 1000 个；支持逗号、中文逗号、竖线或换行分隔。user、party、tag 三者不能同时为空。<a href="https://developer.work.weixin.qq.com/document/path/90975" target="_blank">官方文档</a>',
	},
	{
		displayName: '成员(选择)',
		name: 'user_selected',
		type: 'multiOptions',
		displayOptions: {
			show: showOnlyForInvite,
		},
		typeOptions: {
			loadOptionsMethod: 'getAllUsers',
		},
		default: [],
		description: '与上方 UserID 列表合并去重，合计最多 1000 个',
	},
	{
		displayName: '部门ID列表',
		name: 'party',
		type: 'string',
		displayOptions: {
			show: showOnlyForInvite,
		},
		default: '',
		placeholder: '1,2,3',
		description:
			'可选。部门 ID 列表，最多 100 个；支持逗号分隔。user、party、tag 三者不能同时为空。<a href="https://developer.work.weixin.qq.com/document/path/90975" target="_blank">官方文档</a>',
	},
	{
		displayName: '部门(选择)',
		name: 'party_selected',
		type: 'multiOptions',
		displayOptions: {
			show: showOnlyForInvite,
		},
		typeOptions: {
			loadOptionsMethod: 'getDepartments',
		},
		default: [],
		description: '与上方部门 ID 列表合并去重，合计最多 100 个',
	},
	{
		displayName: '标签ID列表',
		name: 'tag',
		type: 'string',
		displayOptions: {
			show: showOnlyForInvite,
		},
		default: '',
		placeholder: '101,102,103',
		description:
			'可选。标签 ID 列表，最多 100 个。user、party、tag 三者不能同时为空。<a href="https://developer.work.weixin.qq.com/document/path/90975" target="_blank">官方文档</a>',
	},
];
