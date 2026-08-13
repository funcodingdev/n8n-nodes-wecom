import type { INodeProperties } from 'n8n-workflow';
import { getWorkbenchFields } from './workbenchFields';

const showOnly = { resource: ['agent'], operation: ['batchSetWorkbenchData'] };

export const batchSetWorkbenchDataDescription: INodeProperties[] = [
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
		displayName: '选择用户',
		name: 'userid_list_selected',
		type: 'multiOptions',
		typeOptions: { loadOptionsMethod: 'getAllUsers' },
		default: [],
		displayOptions: { show: showOnly },
		description: '从通讯录选择用户，将与下方手动输入合并、去重',
	},
	{
		displayName: '用户 ID 列表（手动）',
		name: 'userid_list',
		type: 'string',
		default: '',
		placeholder: 'zhangsan,lisi',
		displayOptions: { show: showOnly },
		description: '使用逗号、竖线或换行分隔；合并后至少 1 人、最多 1000 人',
	},
	...getWorkbenchFields(showOnly),
];
