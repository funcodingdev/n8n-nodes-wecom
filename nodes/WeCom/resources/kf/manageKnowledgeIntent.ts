import type { INodeProperties } from 'n8n-workflow';

const showOnlyForManageKnowledgeIntent = {
	resource: ['kf'],
	operation: ['manageKnowledgeIntent'],
};

export const manageKnowledgeIntentDescription: INodeProperties[] = [
	{
		displayName: '操作类型',
		name: 'action_type',
		type: 'options',
		required: true,
		displayOptions: {
			show: showOnlyForManageKnowledgeIntent,
		},
		options: [
			{
				name: '新增问答',
				value: 'add',
			},
			{
				name: '删除问答',
				value: 'del',
			},
			{
				name: '修改问答',
				value: 'mod',
			},
			{
				name: '获取问答列表',
				value: 'list',
			},
		],
		default: 'list',
		hint: '知识库问答管理操作类型',
	},
	{
		displayName: '操作参数',
		name: 'params',
		type: 'json',
		displayOptions: {
			show: showOnlyForManageKnowledgeIntent,
		},
		default: '{}',
		hint: '操作参数JSON，根据action_type不同而不同',
	},
];

