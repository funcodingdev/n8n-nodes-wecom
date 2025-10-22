import type { INodeProperties } from 'n8n-workflow';

const showOnly = {
	resource: ['externalContact'],
	operation: ['getInterceptRuleList'],
};

export const getInterceptRuleListDescription: INodeProperties[] = [
	{
		displayName: '此接口无需额外参数',
		name: 'notice',
		type: 'notice',
		default: '',
		displayOptions: {
			show: showOnly,
		},
	},
];

