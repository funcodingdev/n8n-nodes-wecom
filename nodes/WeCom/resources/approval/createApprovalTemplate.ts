import type { INodeProperties } from 'n8n-workflow';

const showOnlyForCreateApprovalTemplate = {
	resource: ['approval'],
	operation: ['createApprovalTemplate'],
};

export const createApprovalTemplateDescription: INodeProperties[] = [
	{
		displayName: '模板数据',
		name: 'templateData',
		type: 'json',
		required: true,
		displayOptions: {
			show: showOnlyForCreateApprovalTemplate,
		},
		default: '{}',
		description: 'Template data in JSON format',
		hint: '模板数据，包含template_id、template_name等字段',
	},
];

