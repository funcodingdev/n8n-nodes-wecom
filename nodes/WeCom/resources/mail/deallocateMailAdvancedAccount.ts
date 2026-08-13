import type { INodeProperties } from 'n8n-workflow';

const showOnly = {
	resource: ['mail'],
	operation: ['deallocateMailAdvancedAccount'],
};

export const deallocateMailAdvancedAccountDescription: INodeProperties[] = [
	{
		displayName: '成员UserID列表',
		name: 'userid_list',
		type: 'string',
		displayOptions: { show: showOnly },
		default: '',
		placeholder: 'zhangsan,lisi,wangwu',
		description:
			'要取消高级功能的企业成员 UserID，逗号/竖线/换行分隔；与下方选择合并，单次最多 100 个。<a href="https://developer.work.weixin.qq.com/document/path/99317" target="_blank">官方文档</a>',
	},
	{
		displayName: '成员(选择)',
		name: 'userid_list_selected',
		type: 'multiOptions',
		typeOptions: { loadOptionsMethod: 'getAllUsers' },
		displayOptions: { show: showOnly },
		default: [],
		description: '与上方列表合并去重，合计最多 100 个',
	},
];
