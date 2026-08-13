import type { INodeProperties } from 'n8n-workflow';

const showOnly = {
	resource: ['externalContact'],
	operation: ['deleteInterceptRule'],
};

export const deleteInterceptRuleDescription: INodeProperties[] = [
	{
		displayName: '删除后无法恢复。应用只能删除由自己创建的敏感词规则。',
		name: 'deleteNotice',
		type: 'notice',
		default: '',
		displayOptions: { show: showOnly },
	},
	{
		displayName: '规则ID',
		name: 'rule_id',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: showOnly,
		},
	},
];
