import type { INodeProperties } from 'n8n-workflow';

const showOnlyGetTagList = {
	resource: ['contact'],
	operation: ['getTagList'],
};

export const getTagListDescription: INodeProperties[] = [
	{
		displayName: '标签类型',
		name: 'tag_type',
		type: 'options',
		options: [
			{
				name: '全部标签',
				value: '',
			},
			{
				name: '个人标签',
				value: 'person',
			},
			{
				name: '部门标签',
				value: 'department',
			},
		],
		default: '',
		displayOptions: {
			show: showOnlyGetTagList,
		},
		description: '标签类型：不填则获取全部标签，person-个人标签，department-部门标签',
	},
];

