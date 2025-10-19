import type { INodeProperties } from 'n8n-workflow';
const showOnly = { resource: ['wedoc'], operation: ['getFormAnswer'] };
export const getFormAnswerDescription: INodeProperties[] = [
	{ displayName: '收集表ID', name: 'formid', type: 'string', required: true, displayOptions: { show: showOnly }, default: '', description: '收集表的formid。', hint: '收集表ID' },
	{ displayName: '限制数量', name: 'limit', type: 'number',
		typeOptions: {
			minValue: 1,
		}, displayOptions: { show: showOnly }, default: 50, description: 'Max number of results to return', hint: '限制数量' },
	{ displayName: '偏移量', name: 'offset', type: 'number', displayOptions: { show: showOnly }, default: 0, description: '数据偏移量，用于分页，默认0。', hint: '偏移量' },
];
