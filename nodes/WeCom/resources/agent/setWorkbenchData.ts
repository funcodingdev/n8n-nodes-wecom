import type { INodeProperties } from 'n8n-workflow';
import { getWorkbenchFields } from './workbenchFields';

const showOnly = { resource: ['agent'], operation: ['setWorkbenchData'] };

export const setWorkbenchDataDescription: INodeProperties[] = [
	{
		displayName: '应用 ID',
		name: 'agentid',
		type: 'number',
		required: true,
		default: 0,
		typeOptions: { minValue: 1, numberStepSize: 1 },
		displayOptions: { show: showOnly },
	},
	{
		displayName: '用户',
		name: 'userid',
		type: 'options',
		typeOptions: { loadOptionsMethod: 'getAllUsers' },
		required: true,
		default: '',
		displayOptions: { show: showOnly },
		description: '选择应用可见范围内的用户，或使用表达式指定 UserID',
	},
	...getWorkbenchFields(showOnly),
];
