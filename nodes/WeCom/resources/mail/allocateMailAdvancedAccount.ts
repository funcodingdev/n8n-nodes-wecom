import type { INodeProperties } from 'n8n-workflow';

const showOnly = {
	resource: ['mail'],
	operation: ['allocateMailAdvancedAccount'],
};

export const allocateMailAdvancedAccountDescription: INodeProperties[] = [
	{
		displayName: '成员UserID列表',
		name: 'userid_list',
		type: 'string',
		required: true,
		displayOptions: { show: showOnly },
		default: '',
		placeholder: 'zhangsan,lisi,wangwu',
		description:
			'要分配高级功能的企业成员 userid 列表，可用逗号、中文逗号、竖线或换行分隔，单次最多 100 个。<a href="https://developer.work.weixin.qq.com/document/path/99316" target="_blank">官方文档</a>',
	},
];
