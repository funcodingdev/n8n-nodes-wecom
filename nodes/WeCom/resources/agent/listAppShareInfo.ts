import type { INodeProperties } from 'n8n-workflow';

const showOnly = {
	resource: ['agent'],
	operation: ['listAppShareInfo'],
};

export const listAppShareInfoDescription: INodeProperties[] = [
	{
		displayName: '应用 ID',
		name: 'agentid',
		type: 'number',
		default: 0,
		typeOptions: { minValue: 0, numberStepSize: 1 },
		displayOptions: { show: showOnly },
		description: '上级或上游企业应用 ID；可与下方选择二选一',
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
	{
		displayName: '业务类型',
		name: 'business_type',
		type: 'options',
		displayOptions: {
			show: showOnly,
		},
		options: [
			{
				name: '企业互联/局校互联',
				value: 0,
			},
			{
				name: '上下游企业',
				value: 1,
			},
		],
		default: 0,
		description: '0 表示企业互联或局校互联，1 表示上下游企业',
	},
	{
		displayName: '查询方式',
		name: 'shareInfoQueryMode',
		type: 'options',
		options: [
			{ name: '分页获取企业列表', value: 'list' },
			{ name: '指定企业', value: 'corp' },
		],
		default: 'list',
		displayOptions: { show: showOnly },
		description: '分页拉取所有共享企业，或通过 CorpID 查询指定企业',
	},
	{
		displayName: '下级或下游企业 CorpID',
		name: 'corpid',
		type: 'string',
		required: true,
		displayOptions: { show: { ...showOnly, shareInfoQueryMode: ['corp'] } },
		default: '',
		description: '下级/下游企业corpid，若指定该参数则表示拉取该下级/下游企业的应用共享信息',
	},
	{
		displayName: '返回数量',
		name: 'limit',
		type: 'number',
		typeOptions: {
			minValue: 0,
			maxValue: 100,
		},
		displayOptions: { show: { ...showOnly, shareInfoQueryMode: ['list'] } },
		default: 0,
		description: '0 表示拉取全量；分页查询时可设置 1–100',
	},
	{
		displayName: '分页游标',
		name: 'cursor',
		type: 'string',
		displayOptions: { show: { ...showOnly, shareInfoQueryMode: ['list'] } },
		default: '',
		description: '用于分页查询的游标，字符串类型，由上一次调用返回，首次调用可不填',
	},
];
