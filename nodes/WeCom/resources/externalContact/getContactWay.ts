import type { INodeProperties } from 'n8n-workflow';

const showOnly = {
	resource: ['externalContact'],
	operation: ['getContactWay'],
};

export const getContactWayDescription: INodeProperties[] = [
	{
		displayName: '联系方式配置ID',
		name: 'config_id',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: showOnly,
		},
		description: '联系方式的配置ID，通过"配置客户联系「联系我」方式"接口返回。<a href="https://developer.work.weixin.qq.com/document/path/92228" target="_blank">官方文档</a>',
		placeholder: 'xxxxxxxxxxxxxxx',
	},
];

