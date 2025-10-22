import type { INodeProperties } from 'n8n-workflow';

const showOnly = {
	resource: ['externalContact'],
	operation: ['delGroupWelcomeTemplate'],
};

export const delGroupWelcomeTemplateDescription: INodeProperties[] = [
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
	{
		displayName: '应用ID',
		name: 'agentid',
		type: 'number',
		default: 0,
		displayOptions: {
			show: showOnly,
		},
		hint: '授权方安装的应用agentid',
		description: '授权方安装的应用agentid',
	},
];

