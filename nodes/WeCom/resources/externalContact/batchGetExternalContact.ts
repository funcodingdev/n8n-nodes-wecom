import type { INodeProperties } from 'n8n-workflow';

const showOnly = {
	resource: ['externalContact'],
	operation: ['batchGetExternalContact'],
};

export const batchGetExternalContactDescription: INodeProperties[] = [
	{
		displayName: '成员',
		name: 'userid',
		type: 'multiOptions',
		typeOptions: {
			loadOptionsMethod: 'getAllUsers',
		},
		required: true,
		default: [],
		displayOptions: {
			show: showOnly,
		},
		description: '企业成员的 UserID 列表，最多 100 个。可从列表多选，或使用表达式传入逗号、竖线或换行分隔的 UserID',
	},
	{
		displayName: 'Cursor',
		name: 'cursor',
		type: 'string',
		default: '',
		displayOptions: {
			show: showOnly,
		},
		description: '用于分页查询的游标，首次请求留空，后续请求传入上次返回的next_cursor值。<a href="https://developer.work.weixin.qq.com/document/path/92994" target="_blank">官方文档</a>。可选。上次请求返回的next_cursor',
		placeholder: '',
	},
	{
		displayName: 'Limit',
		name: 'limit',
		type: 'number',
		typeOptions: {
			minValue: 1,
			maxValue: 100,
			numberStepSize: 1,
		},
		default: 50,
		displayOptions: {
			show: showOnly,
		},
		description: '每页返回的记录数量，默认50，最大100。<a href="https://developer.work.weixin.qq.com/document/path/92994" target="_blank">官方文档</a>。可选。返回的最大记录数，取值范围1~100',
	},
];
