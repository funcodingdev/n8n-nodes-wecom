import type { INodeProperties } from 'n8n-workflow';

const showOnlyForManageKnowledgeGroup = {
	resource: ['kf'],
	operation: ['manageKnowledgeGroup'],
};

export const manageKnowledgeGroupDescription: INodeProperties[] = [
	{
		displayName: '操作类型',
		name: 'action_type',
		type: 'options',
		required: true,
		displayOptions: {
			show: showOnlyForManageKnowledgeGroup,
		},
		options: [
			{
				name: '新增分组',
				value: 'add',
			},
			{
				name: '删除分组',
				value: 'del',
			},
			{
				name: '修改分组',
				value: 'mod',
			},
			{
				name: '获取分组列表',
				value: 'list',
			},
		],
		default: 'list',
		hint: '知识库分组管理操作类型',
	},
	{
		displayName: '操作参数',
		name: 'params',
		type: 'json',
		displayOptions: {
			show: showOnlyForManageKnowledgeGroup,
		},
		default: '{}',
		hint: '操作参数JSON，根据action_type不同而不同',
	},
];

