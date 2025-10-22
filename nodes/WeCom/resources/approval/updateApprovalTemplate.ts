import type { INodeProperties } from 'n8n-workflow';

const showOnlyForUpdateApprovalTemplate = {
	resource: ['approval'],
	operation: ['updateApprovalTemplate'],
};

export const updateApprovalTemplateDescription: INodeProperties[] = [
	{
		displayName: '模板ID',
		name: 'template_id',
		type: 'string',
		required: true,
		displayOptions: {
			show: showOnlyForUpdateApprovalTemplate,
		},
		default: '',
		description: 'Template ID to update',
		hint: '要更新的模板ID',
	},
	{
		displayName: '模板数据',
		name: 'templateData',
		type: 'json',
		required: true,
		displayOptions: {
			show: showOnlyForUpdateApprovalTemplate,
		},
		default: '{}',
		description: 'Updated template data in JSON format',
		hint: '更新的模板数据，包含template_name等字段',
	},
];

