import type { INodeProperties } from 'n8n-workflow';

const showOnlyForUpdateDept = {
	resource: ['contact'],
	operation: ['updateDepartment'],
};

export const updateDepartmentDescription: INodeProperties[] = [
	{
		displayName: '部门ID',
		name: 'id',
		type: 'string',
		displayOptions: {
			show: showOnlyForUpdateDept,
		},
		default: '',
		placeholder: '100',
		description: '部门 ID，32位整型。注意：部门的最大层级为15层；部门总数不能超过3万个；每个部门下的节点不能超过3万个；可与下方选择二选一。<a href="https://developer.work.weixin.qq.com/document/path/90206" target="_blank">官方文档</a>',
	},
	{
		displayName: '部门(选择)',
		name: 'id_selected',
		type: 'options',
		typeOptions: { loadOptionsMethod: 'getDepartments' },
		displayOptions: {
			show: showOnlyForUpdateDept,
		},
		default: '',
		description: '与上方字符串二选一；均填写时以字符串为准',
	},
	{
		displayName: '部门名称',
		name: 'name',
		type: 'string',
		displayOptions: {
			show: showOnlyForUpdateDept,
		},
		default: '',
		placeholder: '技术部',
		description: '可选。部门名称。长度限制为1~64个UTF-8字符，字符不能包括\\:*?"<>｜。如果非必须的字段未指定，则不更新该字段。<a href="https://developer.work.weixin.qq.com/document/path/90206" target="_blank">官方文档</a>',
	},
	{
		displayName: '英文名称',
		name: 'name_en',
		type: 'string',
		displayOptions: {
			show: showOnlyForUpdateDept,
		},
		default: '',
		placeholder: 'Technology',
		description: '可选。英文名称，需要在管理后台开启多语言支持才能生效。长度限制为1~64个字符，字符不能包括\\:*?"<>｜。如果非必须的字段未指定，则不更新该字段。<a href="https://developer.work.weixin.qq.com/document/path/90206" target="_blank">官方文档</a>',
	},
	{
		displayName: '父部门ID',
		name: 'parentid',
		type: 'string',
		displayOptions: {
			show: showOnlyForUpdateDept,
		},
		default: '',
		placeholder: '1',
		description: '可选。父部门 ID，32位整型。如若要移动部门，需要有新父部门的管理权限。如果非必须的字段未指定，则不更新该字段；可与下方选择二选一。<a href="https://developer.work.weixin.qq.com/document/path/90206" target="_blank">官方文档</a>',
	},
	{
		displayName: '父部门(选择)',
		name: 'parentid_selected',
		type: 'options',
		typeOptions: { loadOptionsMethod: 'getDepartments' },
		displayOptions: {
			show: showOnlyForUpdateDept,
		},
		default: '',
		description: '与上方字符串二选一；均填写时以字符串为准',
	},
	{
		displayName: '更新次序值',
		name: 'update_order',
		type: 'boolean',
		displayOptions: {
			show: showOnlyForUpdateDept,
		},
		default: false,
		description: '开启后才发送 order，避免仅修改其他字段时意外改变部门次序',
	},
	{
		displayName: '在父部门中的次序值',
		name: 'order',
		type: 'number',
		displayOptions: {
			show: { ...showOnlyForUpdateDept, update_order: [true] },
		},
		default: 1,
		description: '可选。在父部门中的次序值。order值大的排序靠前。有效的值范围是[0, 2^32)。如果非必须的字段未指定，则不更新该字段。<a href="https://developer.work.weixin.qq.com/document/path/90206" target="_blank">官方文档</a>',
	},
];
