import type { INodeProperties } from 'n8n-workflow';

const showOnly = {
	resource: ['externalContact'],
	operation: ['getCorpTagList'],
};

export const getCorpTagListDescription: INodeProperties[] = [
	{
		displayName: '标签ID',
		name: 'tag_id',
		type: 'string',
		default: '',
		displayOptions: {
			show: showOnly,
		},
		description: '要查询的标签ID列表，多个ID用英文逗号分隔，为空则返回所有标签。<a href="https://developer.work.weixin.qq.com/document/path/92117" target="_blank">官方文档</a>',
		placeholder: 'etXXXXXXXXXX,etYYYYYYYYYY',
	},
	{
		displayName: '标签组ID',
		name: 'group_id',
		type: 'string',
		default: '',
		displayOptions: {
			show: showOnly,
		},
		description: '要查询的标签组ID列表，多个ID用英文逗号分隔，返回该标签组及其下属标签。<a href="https://developer.work.weixin.qq.com/document/path/92117" target="_blank">官方文档</a>',
		placeholder: 'etXXXXXXXXXX,etYYYYYYYYYY',
	},
];

