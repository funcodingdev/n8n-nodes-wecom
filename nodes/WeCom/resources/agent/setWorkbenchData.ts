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
		displayName: '用户UserID',
		name: 'userid',
		type: 'string',
		required: true,
		default: '',
		placeholder: 'zhangsan',
		displayOptions: { show: showOnly },
		description: '应用可见范围内的成员 UserID',
	},
	...getWorkbenchFields(showOnly),
];
