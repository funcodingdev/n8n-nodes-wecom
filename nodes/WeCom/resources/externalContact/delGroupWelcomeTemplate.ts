import type { INodeProperties } from 'n8n-workflow';

const showOnly = {
	resource: ['externalContact'],
	operation: ['delGroupWelcomeTemplate'],
};

export const delGroupWelcomeTemplateDescription: INodeProperties[] = [
	{
		displayName: '此操作会从企业入群欢迎语素材库删除指定模板，请确认模板 ID',
		name: 'deleteGroupWelcomeTemplateNotice',
		type: 'notice',
		default: '',
		displayOptions: { show: showOnly },
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
		displayName: '应用 ID',
		name: 'agentid',
		type: 'number',
		default: 0,
		typeOptions: { minValue: 0, numberStepSize: 1 },
		displayOptions: { show: showOnly },
		description: '授权方安装的应用agentid；可与下方选择二选一',
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
];
