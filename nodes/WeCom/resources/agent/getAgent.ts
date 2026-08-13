import type { INodeProperties } from 'n8n-workflow';

const showOnlyGetAgent = {
	resource: ['agent'],
	operation: ['getAgent'],
};

export const getAgentDescription: INodeProperties[] = [
	{
		displayName: '应用 ID',
		name: 'agentid',
		type: 'number',
		default: 0,
		typeOptions: { minValue: 0, numberStepSize: 1 },
		displayOptions: { show: showOnlyGetAgent },
		description: '企业应用的唯一标识。<a href="https://developer.work.weixin.qq.com/document/path/90227" target="_blank">官方文档</a>；可与下方选择二选一',
	},
	{
		displayName: '应用(选择)',
		name: 'agentid_selected',
		type: 'options',
		typeOptions: { loadOptionsMethod: 'getAgents' },
		displayOptions: { show: showOnlyGetAgent },
		default: '',
		description: '与上方数字二选一；均填写时以数字为准',
	},
];
