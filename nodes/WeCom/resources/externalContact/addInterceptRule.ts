import type { INodeProperties } from 'n8n-workflow';

const showOnly = {
	resource: ['externalContact'],
	operation: ['addInterceptRule'],
};

export const addInterceptRuleDescription: INodeProperties[] = [
	{
		displayName: '规则名称',
		name: 'rule_name',
		type: 'string',
		required: true,
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
		required: true,
		default: '',
		displayOptions: {
			show: showOnly,
		},
		hint: '敏感词列表，用逗号分隔',
	},
	{
		displayName: '适用范围',
		name: 'semantics_list',
		type: 'json',
		default: '[]',
		displayOptions: {
			show: showOnly,
		},
		hint: 'JSON数组格式的适用范围',
	},
];

