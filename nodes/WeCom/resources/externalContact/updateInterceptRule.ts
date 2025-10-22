import type { INodeProperties } from 'n8n-workflow';

const showOnly = {
	resource: ['externalContact'],
	operation: ['updateInterceptRule'],
};

export const updateInterceptRuleDescription: INodeProperties[] = [
	{
		displayName: '规则ID',
		name: 'rule_id',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: showOnly,
		},
		hint: '规则id',
	},
	{
		displayName: '规则名称',
		name: 'rule_name',
		type: 'string',
		default: '',
		displayOptions: {
			show: showOnly,
		},
		hint: '规则名称',
	},
	{
		displayName: '敏感词列表',
		name: 'word_list',
		type: 'string',
		default: '',
		displayOptions: {
			show: showOnly,
		},
		hint: '敏感词列表，用逗号分隔',
	},
];

