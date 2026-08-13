import type { INodeProperties } from 'n8n-workflow';

const showOnly = { resource: ['mail'], operation: ['createMailGroup'] };
const custom = { ...showOnly, allow_type: [3] };
const separators = '可用逗号、中文逗号、竖线或换行分隔';

export const createMailGroupDescription: INodeProperties[] = [
	{
		displayName: '群组地址', name: 'groupid', type: 'string', required: true,
		displayOptions: { show: showOnly }, default: '', placeholder: 'group@example.com',
		description: '邮件群组 ID，必须是邮箱格式',
	},
	{
		displayName: '群组名称', name: 'groupname', type: 'string', required: true,
		displayOptions: { show: showOnly }, default: '', description: '最长 200 字节',
	},
	{
		displayName: '成员邮箱列表', name: 'email_list', type: 'string',
		displayOptions: { show: showOnly }, default: '', description: separators,
	},
	{
		displayName: '群组邮箱列表', name: 'group_list', type: 'string',
		displayOptions: { show: showOnly }, default: '', description: separators,
	},
	{
		displayName: '部门ID列表', name: 'department_list', type: 'string',
		displayOptions: { show: showOnly }, default: '', description: separators,
	},
	{
		displayName: '标签ID列表', name: 'tag_list', type: 'string',
		displayOptions: { show: showOnly }, default: '', description: `四类群成员至少填一类；${separators}`,
	},
	{
		displayName: '群组使用权限', name: 'allow_type', type: 'options',
		displayOptions: { show: showOnly }, default: 0,
		options: [
			{ name: '企业成员', value: 0 }, { name: '任何人', value: 1 },
			{ name: '组内成员', value: 2 }, { name: '自定义成员', value: 3 },
		],
	},
	{
		displayName: '允许使用的成员邮箱', name: 'allow_emaillist', type: 'string',
		displayOptions: { show: custom }, default: '', description: separators,
	},
	{
		displayName: '允许使用的部门ID', name: 'allow_departmentlist', type: 'string',
		displayOptions: { show: custom }, default: '', description: separators,
	},
	{
		displayName: '允许使用的标签ID', name: 'allow_taglist', type: 'string',
		displayOptions: { show: custom }, default: '', description: `自定义权限时三类范围至少填一类；${separators}`,
	},
];
