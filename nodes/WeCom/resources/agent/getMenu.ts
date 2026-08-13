import type { INodeProperties } from 'n8n-workflow';

const showOnlyGetMenu = {
	resource: ['agent'],
	operation: ['getMenu'],
};

export const getMenuDescription: INodeProperties[] = [
	{
		displayName: '应用 ID',
		name: 'agentid',
		type: 'number',
		required: true,
		default: 0,
		typeOptions: { minValue: 1, numberStepSize: 1 },
		displayOptions: {
			show: showOnlyGetMenu,
		},
		description: '企业应用的唯一标识。<a href="https://developer.work.weixin.qq.com/document/path/90232" target="_blank">官方文档</a>',
	},
];
