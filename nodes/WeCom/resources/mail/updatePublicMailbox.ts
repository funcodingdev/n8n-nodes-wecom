import type { INodeProperties } from 'n8n-workflow';

const showOnly = { resource: ['mail'], operation: ['updatePublicMailbox'] };
const switched = (name: string) => ({ ...showOnly, [name]: [true] });
const separators = '可用逗号、中文逗号、竖线或换行分隔；留空可清空';

export const updatePublicMailboxDescription: INodeProperties[] = [
	{
		displayName: '公共邮箱ID', name: 'id', type: 'number', required: true,
		typeOptions: { minValue: 1 }, displayOptions: { show: showOnly }, default: 1,
	},
	{
		displayName: '更新公共邮箱名称', name: 'updateName', type: 'boolean',
		displayOptions: { show: showOnly }, default: false,
	},
	{
		displayName: '公共邮箱名称', name: 'name', type: 'string', required: true,
		displayOptions: { show: switched('updateName') }, default: '', description: '最长 64 字节（汉字通常占 2 字节）',
	},
	{
		displayName: '更新成员UserID列表', name: 'updateUseridList', type: 'boolean',
		displayOptions: { show: showOnly }, default: false,
	},
	{
		displayName: '成员UserID列表', name: 'userid_list', type: 'string',
		displayOptions: { show: switched('updateUseridList') }, default: '', description: separators,
	},
	{
		displayName: '成员(选择)', name: 'userid_list_selected', type: 'multiOptions',
		typeOptions: { loadOptionsMethod: 'getAllUsers' },
		displayOptions: { show: switched('updateUseridList') }, default: [],
		description: '与上方列表合并去重',
	},
	{
		displayName: '更新部门ID列表', name: 'updateDepartmentList', type: 'boolean',
		displayOptions: { show: showOnly }, default: false,
	},
	{
		displayName: '部门ID列表', name: 'department_list', type: 'string',
		displayOptions: { show: switched('updateDepartmentList') }, default: '', description: separators,
	},
	{
		displayName: '部门(选择)', name: 'department_list_selected', type: 'multiOptions',
		typeOptions: { loadOptionsMethod: 'getDepartments' },
		displayOptions: { show: switched('updateDepartmentList') }, default: [],
		description: '与上方列表合并去重',
	},
	{
		displayName: '更新标签ID列表', name: 'updateTagList', type: 'boolean',
		displayOptions: { show: showOnly }, default: false,
	},
	{
		displayName: '标签ID列表', name: 'tag_list', type: 'string',
		displayOptions: { show: switched('updateTagList') }, default: '',
		description: `与下方选择合并；${separators}`,
	},
	{
		displayName: '标签(选择)', name: 'tag_list_selected', type: 'multiOptions',
		typeOptions: { loadOptionsMethod: 'getTags' },
		displayOptions: { show: switched('updateTagList') }, default: [], description: '与上方标签列表合并去重',
	},
	{
		displayName: '更新邮箱别名列表', name: 'updateAliasList', type: 'boolean',
		displayOptions: { show: showOnly }, default: false,
	},
	{
		displayName: '邮箱别名列表', name: 'alias_list', type: 'string',
		displayOptions: { show: switched('updateAliasList') }, default: '', description: separators,
	},
	{
		displayName: '创建新客户端专用密码', name: 'create_auth_code', type: 'boolean',
		displayOptions: { show: showOnly }, default: false,
		description: '开启后请立即安全保存返回的一次性密码',
	},
	{
		displayName: '专用密码备注', name: 'auth_code_remark', type: 'string',
		displayOptions: { show: switched('create_auth_code') }, default: '', description: '最长 128 字节',
	},
];
