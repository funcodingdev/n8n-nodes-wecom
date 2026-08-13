import type { INodeProperties } from 'n8n-workflow';

const showOnly = {
	resource: ['externalContact'],
	operation: ['delCorpTag'],
};

export const delCorpTagDescription: INodeProperties[] = [
	{
		displayName: '标签ID',
		name: 'tag_id',
		type: 'string',
		default: '',
		displayOptions: {
			show: showOnly,
		},
		description:
			'要删除的标签ID列表，多个ID用英文逗号分隔；与下方 JSON 合并。<a href="https://developer.work.weixin.qq.com/document/path/92117" target="_blank">官方文档</a>',
		placeholder: 'etXXXXXXXXXX,etYYYYYYYYYY',
	},
	{
		displayName: '标签ID列表 JSON',
		name: 'tagIdJson',
		type: 'json',
		default: '[]',
		displayOptions: { show: showOnly },
		description:
			'可选。非空数组时与上方列表合并去重。支持 ["etxxx"] 或 [{"tag_id":"etxxx"}]',
	},
	{
		displayName: '标签组ID',
		name: 'group_id',
		type: 'string',
		default: '',
		displayOptions: {
			show: showOnly,
		},
		description:
			'要删除的标签组ID列表，多个ID用英文逗号分隔；与下方 JSON 合并；删除标签组会同时删除其下所有标签。<a href="https://developer.work.weixin.qq.com/document/path/92117" target="_blank">官方文档</a>',
		placeholder: 'etXXXXXXXXXX,etYYYYYYYYYY',
	},
	{
		displayName: '标签组ID列表 JSON',
		name: 'groupIdJson',
		type: 'json',
		default: '[]',
		displayOptions: { show: showOnly },
		description:
			'可选。非空数组时与上方列表合并去重。支持 ["etxxx"] 或 [{"group_id":"etxxx"}]',
	},
	{
		displayName: '应用 ID',
		name: 'agentid',
		type: 'number',
		default: 0,
		typeOptions: { minValue: 0, numberStepSize: 1 },
		displayOptions: { show: showOnly },
		description: '仅旧的第三方多应用套件需要填写；0 表示不发送；可与下方选择二选一',
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
