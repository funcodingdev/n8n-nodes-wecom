import type { INodeProperties } from 'n8n-workflow';

const showOnly = {
	resource: ['externalContact'],
	operation: ['editGroupWelcomeTemplate'],
};

export const editGroupWelcomeTemplateDescription: INodeProperties[] = [
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
		displayName: '消息内容',
		name: 'text',
		type: 'json',
		default: '{}',
		displayOptions: {
			show: showOnly,
		},
		hint: 'JSON格式的消息内容',
		description: '群欢迎语的消息内容',
	},
];

