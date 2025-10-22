import type { INodeProperties } from 'n8n-workflow';

const showOnlyForGetTemplateDetail = {
	resource: ['approval'],
	operation: ['getTemplateDetail'],
};

export const getTemplateDetailDescription: INodeProperties[] = [
	{
		displayName: '模板ID',
		name: 'template_id',
		type: 'string',
		required: true,
		displayOptions: {
			show: showOnlyForGetTemplateDetail,
		},
		default: '',
		description: 'Approval template ID',
		hint: '审批模板ID',
	},
];

