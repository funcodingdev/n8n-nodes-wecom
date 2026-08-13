import type { INodeProperties } from 'n8n-workflow';

const showOnlyListAgents = {
	resource: ['agent'],
	operation: ['listAgents'],
};

// 获取应用列表不需要额外参数，只需要 access_token（自动处理）
export const listAgentsDescription: INodeProperties[] = [
	{
		displayName: '获取access_token对应的应用列表。此操作无需额外参数，将返回当前凭证可访问的所有应用列表。<a href="https://developer.work.weixin.qq.com/document/path/90227" target="_blank">官方文档</a>',
		name: 'listAgentsHint',
		type: 'notice',
		displayOptions: {
			show: showOnlyListAgents,
		},
		default: '此操作无需额外参数，将返回当前凭证可访问的所有应用列表。企业仅可获取当前凭证对应的应用；第三方仅可获取被授权的应用。',
	},
];
