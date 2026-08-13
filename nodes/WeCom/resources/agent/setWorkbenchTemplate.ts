import type { INodeProperties } from 'n8n-workflow';
import { getWorkbenchFields } from './workbenchFields';

const showOnly = { resource: ['agent'], operation: ['setWorkbenchTemplate'] };

export const setWorkbenchTemplateDescription: INodeProperties[] = [
	{
		displayName: '应用 ID',
		name: 'agentid',
		type: 'number',
		required: true,
		default: 0,
		typeOptions: { minValue: 1, numberStepSize: 1 },
		displayOptions: { show: showOnly },
		description: '当前凭证对应的企业应用 ID',
	},
	...getWorkbenchFields(showOnly, {
		allowNormal: true,
		optionalTemplateData: true,
		includeReplaceUserData: true,
	}),
];
