import type { INodeProperties } from 'n8n-workflow';

const showOnly = { resource: ['externalContact'], operation: ['addCorpTag'] };

export const addCorpTagDescription: INodeProperties[] = [
	{
		displayName: '标签组ID',
		name: 'group_id',
		type: 'string',
		default: '',
		displayOptions: { show: showOnly },
		description: '标签组ID，如果不填则自动创建新的标签组',
		placeholder: 'etXXXXXXXXXX',
	},
	{
		displayName: '标签组名称',
		name: 'group_name',
		type: 'string',
		typeOptions: { maxValue: 30 },
		default: '',
		displayOptions: { show: showOnly },
		description: '标签组名称，如果填写了group_id则忽略此参数',
		placeholder: '客户类型',
	},
	{
		displayName: '标签列表',
		name: 'tagCollection',
		type: 'fixedCollection',
		required: true,
		displayOptions: { show: showOnly },
		default: {},
		placeholder: '添加标签',
		typeOptions: { multipleValues: true },
		description: '要添加的标签列表',
		options: [
			{
				displayName: '标签',
				name: 'tags',
				values: [
					{
						displayName: '标签名称',
						name: 'name',
						type: 'string',
						typeOptions: { maxValue: 30 },
						default: '',
						required: true,

						placeholder: '重要客户',
					},
					{
						displayName: '排序',
						name: 'order',
						type: 'number',
						typeOptions: { minValue: 0, maxValue: 4294967295, numberStepSize: 1 },
						default: 0,
						description: '标签排序值，值越大排序越靠前',
					},
				],
			},
		],
	},
	{
		displayName: '标签组排序',
		name: 'order',
		type: 'number',
		typeOptions: { minValue: 0, maxValue: 4294967295, numberStepSize: 1 },
		default: 0,
		displayOptions: { show: showOnly },
		description: '标签组次序值，order值越大排序越靠前',
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
