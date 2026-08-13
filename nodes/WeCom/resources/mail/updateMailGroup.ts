import type { INodeProperties } from 'n8n-workflow';

const showOnly = { resource: ['mail'], operation: ['updateMailGroup'] };
const switched = (name: string, extra: Record<string, unknown> = {}) => ({ ...showOnly, [name]: [true], ...extra });
const separators = '可用逗号、中文逗号、竖线或换行分隔；留空可清空';

const listUpdate = (label: string, switchName: string, name: string, numeric = false): INodeProperties[] => [
	{
		displayName: `更新${label}`, name: switchName, type: 'boolean',
		displayOptions: { show: showOnly }, default: false,
		description: '关闭时保持不变，开启后发送列表',
	},
	{
		displayName: label, name, type: 'string',
		displayOptions: { show: switched(switchName) }, default: '',
		description: `${separators}${numeric ? '，仅允许正整数 ID' : ''}`,
	},
];

export const updateMailGroupDescription: INodeProperties[] = [
	{
		displayName: '群组地址', name: 'groupid', type: 'string', required: true,
		displayOptions: { show: showOnly }, default: '', placeholder: 'group@example.com',
	},
	{
		displayName: '更新群组名称', name: 'updateGroupName', type: 'boolean',
		displayOptions: { show: showOnly }, default: false,
	},
	{
		displayName: '群组名称', name: 'groupname', type: 'string', required: true,
		displayOptions: { show: switched('updateGroupName') }, default: '', description: '最长 200 字节',
	},
	...listUpdate('成员邮箱列表', 'updateEmailList', 'email_list'),
	...listUpdate('群组邮箱列表', 'updateGroupList', 'group_list'),
	...listUpdate('部门ID列表', 'updateDepartmentList', 'department_list', true),
	...listUpdate('标签ID列表', 'updateTagList', 'tag_list', true),
	{
		displayName: '更新群组使用权限', name: 'updateAllowType', type: 'boolean',
		displayOptions: { show: showOnly }, default: false,
	},
	{
		displayName: '群组使用权限', name: 'allow_type', type: 'options',
		displayOptions: { show: switched('updateAllowType') }, default: 0,
		options: [
			{ name: '企业成员', value: 0 }, { name: '任何人', value: 1 },
			{ name: '组内成员', value: 2 }, { name: '自定义成员', value: 3 },
		],
	},
	...listUpdate('允许使用的成员邮箱', 'updateAllowEmailList', 'allow_emaillist'),
	...listUpdate('允许使用的部门ID', 'updateAllowDepartmentList', 'allow_departmentlist', true),
	...listUpdate('允许使用的标签ID', 'updateAllowTagList', 'allow_taglist', true),
];
