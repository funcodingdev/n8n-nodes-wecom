import type { INodeProperties } from 'n8n-workflow';

const showOnly = { resource: ['mail'], operation: ['updatePublicMailbox'] };
const switched = (name: string) => ({ ...showOnly, [name]: [true] });
const separators = '可用逗号、中文逗号、竖线或换行分隔；留空可清空';

const listUpdate = (label: string, switchName: string, name: string): INodeProperties[] => [
	{
		displayName: `更新${label}`, name: switchName, type: 'boolean',
		displayOptions: { show: showOnly }, default: false,
	},
	{
		displayName: label, name, type: 'string',
		displayOptions: { show: switched(switchName) }, default: '', description: separators,
	},
];

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
	...listUpdate('成员UserID列表', 'updateUseridList', 'userid_list'),
	...listUpdate('部门ID列表', 'updateDepartmentList', 'department_list'),
	...listUpdate('标签ID列表', 'updateTagList', 'tag_list'),
	...listUpdate('邮箱别名列表', 'updateAliasList', 'alias_list'),
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
