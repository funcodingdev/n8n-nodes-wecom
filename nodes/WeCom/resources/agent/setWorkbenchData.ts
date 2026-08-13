import type { INodeProperties } from 'n8n-workflow';
import { getWorkbenchFields } from './workbenchFields';

const showOnly = { resource: ['agent'], operation: ['setWorkbenchData'] };

export const setWorkbenchDataDescription: INodeProperties[] = [
	{
		displayName: '应用 ID',
		name: 'agentid',
		type: 'number',
		default: 0,
		typeOptions: { minValue: 0, numberStepSize: 1 },
		displayOptions: { show: showOnly },
		description: '企业应用的唯一标识；可与下方选择二选一',
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
	{
		displayName: '用户UserID',
		name: 'userid',
		type: 'string',
		default: '',
		placeholder: 'zhangsan',
		displayOptions: { show: showOnly },
		description: '应用可见范围内的成员 UserID；可与下方选择二选一',
	},
	{
		displayName: '成员(选择)',
		name: 'userid_selected',
		type: 'options',
		typeOptions: { loadOptionsMethod: 'getAllUsers' },
		default: '',
		displayOptions: { show: showOnly },
		description: '与上方字符串二选一；均填写时以字符串为准',
	},
	...getWorkbenchFields(showOnly),
];
