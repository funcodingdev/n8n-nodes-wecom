import type { INodeProperties } from 'n8n-workflow';

const showOnlyGetWorkbenchData = {
	resource: ['agent'],
	operation: ['getWorkbenchData'],
};

export const getWorkbenchDataDescription: INodeProperties[] = [
	{
		displayName: '应用 ID',
		name: 'agentid',
		type: 'number',
		required: true,
		default: 0,
		typeOptions: { minValue: 1, numberStepSize: 1 },
		displayOptions: {
			show: showOnlyGetWorkbenchData,
		},
		description: '企业应用的唯一标识',
	},
	{
		displayName: '用户',
		name: 'userid',
		type: 'options',
		typeOptions: { loadOptionsMethod: 'getAllUsers' },
		required: true,
		default: '',
		displayOptions: {
			show: showOnlyGetWorkbenchData,
		},
		description: '选择应用可见范围内的用户，或使用表达式指定 UserID。<a href="https://developer.work.weixin.qq.com/document/path/92535" target="_blank">官方文档</a>',
	},
];
