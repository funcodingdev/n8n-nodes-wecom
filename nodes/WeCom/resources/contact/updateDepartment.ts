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
		required: true,
		displayOptions: {
			show: showOnlyForUpdateDept,
		},
		default: '',
		description: '部门ID，32位整型。',
		hint: '部门ID',
	},
	{
		displayName: '部门名称',
		name: 'name',
		type: 'string',
		displayOptions: {
			show: showOnlyForUpdateDept,
		},
		default: '',
		description: '部门名称。长度限制为1~64个utf8字符，字符不能包括\\:*?"&lt;&gt;|。',
		hint: '部门名称',
	},
	{
		displayName: '英文名称',
		name: 'name_en',
		type: 'string',
		displayOptions: {
			show: showOnlyForUpdateDept,
		},
		default: '',
		description: '英文名称。长度限制为1~64个字符，字符不能包括\\:*?"&lt;&gt;|。',
		hint: '英文名称',
	},
	{
		displayName: '父部门ID',
		name: 'parentid',
		type: 'string',
		displayOptions: {
			show: showOnlyForUpdateDept,
		},
		default: '',
		description: '父部门ID，32位整型。',
		hint: '父部门ID',
	},
	{
		displayName: '在父部门中的次序值',
		name: 'order',
		type: 'number',
		displayOptions: {
			show: showOnlyForUpdateDept,
		},
		default: 1,
		description: '在父部门中的次序值。order值大的排序靠前。有效的值范围是[0, 2^32)。',
		hint: '排序值',
	},
];

