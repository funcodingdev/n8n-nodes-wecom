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
	{
		displayName: '部门(选择)', name: 'department_list_selected', type: 'multiOptions',
		typeOptions: { loadOptionsMethod: 'getDepartments' },
		displayOptions: { show: switched('updateDepartmentList') }, default: [],
		description: '与上方部门列表合并去重',
	},
	{
		displayName: '部门列表 JSON',
		name: 'departmentListJson',
		type: 'json',
		displayOptions: { show: switched('updateDepartmentList') },
		default: '[]',
		description:
			'可选。非空数组时与上方列表/选择合并去重。支持 [1,2] 或 [{"partyid":1}]',
	},
	...listUpdate('标签ID列表', 'updateTagList', 'tag_list', true),
	{
		displayName: '标签(选择)', name: 'tag_list_selected', type: 'multiOptions',
		typeOptions: { loadOptionsMethod: 'getTags' },
		displayOptions: { show: switched('updateTagList') }, default: [],
		description: '与上方标签列表合并去重',
	},
	{
		displayName: '标签列表 JSON',
		name: 'tagListJson',
		type: 'json',
		displayOptions: { show: switched('updateTagList') },
		default: '[]',
		description:
			'可选。非空数组时与上方列表/选择合并去重。支持 [1,2] 或 [{"tagid":1}]',
	},
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
	{
		displayName: '允许使用的部门(选择)', name: 'allow_departmentlist_selected', type: 'multiOptions',
		typeOptions: { loadOptionsMethod: 'getDepartments' },
		displayOptions: { show: switched('updateAllowDepartmentList') }, default: [],
		description: '与上方部门列表合并去重',
	},
	{
		displayName: '允许使用的部门 JSON',
		name: 'allowDepartmentListJson',
		type: 'json',
		displayOptions: { show: switched('updateAllowDepartmentList') },
		default: '[]',
		description:
			'可选。非空数组时与上方列表/选择合并去重。支持 [1,2] 或 [{"partyid":1}]',
	},
	...listUpdate('允许使用的标签ID', 'updateAllowTagList', 'allow_taglist', true),
	{
		displayName: '允许使用的标签(选择)', name: 'allow_taglist_selected', type: 'multiOptions',
		typeOptions: { loadOptionsMethod: 'getTags' },
		displayOptions: { show: switched('updateAllowTagList') }, default: [],
		description: '与上方标签列表合并去重',
	},
	{
		displayName: '允许使用的标签 JSON',
		name: 'allowTagListJson',
		type: 'json',
		displayOptions: { show: switched('updateAllowTagList') },
		default: '[]',
		description:
			'可选。非空数组时与上方列表/选择合并去重。支持 [1,2] 或 [{"tagid":1}]',
	},
];

