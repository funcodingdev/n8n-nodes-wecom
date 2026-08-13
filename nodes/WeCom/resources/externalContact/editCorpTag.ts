import type { INodeProperties } from 'n8n-workflow';

const showOnly = {
	resource: ['externalContact'],
	operation: ['editCorpTag'],
};

export const editCorpTagDescription: INodeProperties[] = [
	{
		displayName: '标签ID',
		name: 'id',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: showOnly,
		},
		description: '标签或标签组的ID，用于指定要编辑的对象。<a href="https://developer.work.weixin.qq.com/document/path/92117" target="_blank">官方文档</a>。标签或标签组的ID',
		placeholder: 'etXXXXXXXXXX',
	},
	{
		displayName: '更新名称',
		name: 'updateName',
		type: 'boolean',
		default: false,
		displayOptions: { show: showOnly },
		description: '开启后发送新名称',
	},
	{
		displayName: '新名称',
		name: 'name',
		type: 'string',
		default: '',
		typeOptions: { maxValue: 30 },
		displayOptions: { show: { ...showOnly, updateName: [true] } },
		description: '新的标签或标签组名称。<a href="https://developer.work.weixin.qq.com/document/path/92117" target="_blank">官方文档</a>。可选。新的标签或标签组名称，最长30个字符',
		placeholder: '重要客户',
	},
	{
		displayName: '更新排序',
		name: 'updateOrder',
		type: 'boolean',
		default: false,
		displayOptions: { show: showOnly },
		description: '开启后发送新排序；可明确设置为 0',
	},
	{
		displayName: '新排序',
		name: 'order',
		type: 'number',
		typeOptions: { minValue: 0, maxValue: 4294967295, numberStepSize: 1 },
		default: 0,
		displayOptions: { show: { ...showOnly, updateOrder: [true] } },
		description: '标签/标签组的次序值，order值大的排序靠前。<a href="https://developer.work.weixin.qq.com/document/path/92117" target="_blank">官方文档</a>。可选。标签/标签组的次序值，值越大排序越靠前',
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
