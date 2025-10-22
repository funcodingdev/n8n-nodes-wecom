import type { INodeProperties } from 'n8n-workflow';

const showOnly = {
	resource: ['externalContact'],
	operation: ['getGroupWelcomeTemplate'],
};

export const getGroupWelcomeTemplateDescription: INodeProperties[] = [
	{
		displayName: '模板ID',
		name: 'template_id',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: showOnly,
		},
		hint: '群欢迎语的模板id',
		description: '群欢迎语的模板ID',
	},
];

