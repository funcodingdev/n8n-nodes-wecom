import type { INodeProperties } from 'n8n-workflow';

const showOnly = {
	resource: ['mail'],
	operation: ['deletePublicMailbox'],
};

export const deletePublicMailboxDescription: INodeProperties[] = [
	{
		displayName: '公共邮箱ID',
		name: 'id',
		type: 'number',
		required: true,
		displayOptions: { show: showOnly },
		default: 0,
		description:
			'要删除的公共邮箱 ID。<a href="https://developer.work.weixin.qq.com/document/path/98001" target="_blank">官方文档</a>',
	},
];
