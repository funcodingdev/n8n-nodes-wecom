import type { INodeProperties } from 'n8n-workflow';

const showOnly = {
	resource: ['externalContact'],
	operation: ['delGroupWelcomeTemplate'],
};

export const delGroupWelcomeTemplateDescription: INodeProperties[] = [
	{
		displayName: '删除提示',
		name: 'deleteGroupWelcomeTemplateNotice',
		type: 'notice',
		default: '',
		displayOptions: { show: showOnly },
		description: '此操作会从企业入群欢迎语素材库删除指定模板，请确认模板 ID',
	},
	{
		displayName: '模板ID',
		name: 'template_id',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: showOnly,
		},
		description: '群欢迎语的模板ID。群欢迎语的模板ID',
	},
	{
		displayName: '应用ID',
		name: 'agentid',
		type: 'number',
		typeOptions: { minValue: 0, numberStepSize: 1 },
		default: 0,
		displayOptions: {
			show: showOnly,
		},
		description: '授权方安装的应用agentid',
	},
];
