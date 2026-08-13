import type { INodeProperties } from 'n8n-workflow';

const showOnly = {
	resource: ['school'],
	operation: ['getAllowScope'],
};

export const getAllowScopeDescription: INodeProperties[] = [
	{
		displayName: '应用 AgentID',
		name: 'agentid',
		type: 'number',
		required: true,
		displayOptions: {
			show: showOnly,
		},
		default: 0,
		typeOptions: { minValue: 1, maxValue: 4294967295, numberStepSize: 1 },
		description: '要查询家长可使用范围的应用 AgentID。<a href="https://developer.work.weixin.qq.com/document/path/94895" target="_blank">官方文档</a>',
	},
];
