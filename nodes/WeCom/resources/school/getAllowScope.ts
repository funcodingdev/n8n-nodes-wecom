import type { INodeProperties } from 'n8n-workflow';

const showOnly = {
	resource: ['school'],
	operation: ['getAllowScope'],
};

export const getAllowScopeDescription: INodeProperties[] = [
	{
		displayName: '应用 ID',
		name: 'agentid',
		type: 'number',
		default: 0,
		typeOptions: { minValue: 0, numberStepSize: 1 },
		displayOptions: { show: showOnly },
		description: '要查询家长可使用范围的应用 AgentID。<a href="https://developer.work.weixin.qq.com/document/path/94895" target="_blank">官方文档</a>；可与下方选择二选一',
	},
	{
		displayName: '应用(选择)',
		name: 'agentid_selected',
		type: 'options',
		typeOptions: { loadOptionsMethod: 'getAgents' },
		displayOptions: { show: showOnly },
		default: '',
		description: '与上方数字二选一；均填写时以数字为准',
	},
];
