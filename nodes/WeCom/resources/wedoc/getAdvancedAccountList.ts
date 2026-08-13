import type { INodeProperties } from 'n8n-workflow';
const showOnly = { resource: ['wedoc'], operation: ['getAdvancedAccountList'] };
export const getAdvancedAccountListDescription: INodeProperties[] = [
	{
		displayName: '每页数量',
		name: 'limit',
		type: 'number',
		typeOptions: {
			minValue: 1,
			maxValue: 200,
		},
		displayOptions: { show: showOnly },
		default: 50,
		description: '每页返回的数量，默认100，最大200。每页数量',
	},
	{
		displayName: '游标',
		name: 'cursor',
		type: 'string',
		displayOptions: { show: showOnly },
		default: '',
		description: '分页游标，从上一次请求返回结果中获取，首次请求不填。分页游标',
	},
];
