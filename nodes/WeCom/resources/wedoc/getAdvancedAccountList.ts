import type { INodeProperties } from 'n8n-workflow';
const showOnly = { resource: ['wedoc'], operation: ['getAdvancedAccountList'] };
export const getAdvancedAccountListDescription: INodeProperties[] = [
	{ displayName: '限制数量', name: 'limit', type: 'number',
		typeOptions: {
			minValue: 1,
		}, displayOptions: { show: showOnly }, default: 50, description: 'Max number of results to return', hint: '限制数量' },
	{ displayName: '游标', name: 'cursor', type: 'string', displayOptions: { show: showOnly }, default: '', description: '分页游标，用于获取下一页。', hint: '游标' },
];
