import type { INodeProperties } from 'n8n-workflow';

const showOnly = {
	resource: ['externalContact'],
	operation: ['delContactWay'],
};

export const delContactWayDescription: INodeProperties[] = [
	{
		displayName: '联系方式配置ID',
		name: 'config_id',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: showOnly,
		},
		description: '联系方式的配置ID，要删除的联系方式的唯一标识。<a href="https://developer.work.weixin.qq.com/document/path/92228" target="_blank">官方文档</a>',
		placeholder: 'xxxxxxxxxxxxxxx',
	},
];

