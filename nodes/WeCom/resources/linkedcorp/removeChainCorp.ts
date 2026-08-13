import type { INodeProperties } from 'n8n-workflow';

const showOnly = { resource: ['linkedcorp'], operation: ['removeChainCorp'] };

export const removeChainCorpDescription: INodeProperties[] = [
	{ displayName: '上下游 ID', name: 'chain_id', type: 'string', required: true, displayOptions: { show: showOnly }, default: '' },
	{
		displayName: '企业状态', name: 'remove_corp_type', type: 'options', displayOptions: { show: showOnly },
		options: [{ name: '已加入企业', value: 'joined' }, { name: '待加入企业', value: 'pending' }], default: 'joined',
	},
	{ displayName: '企业 CorpID', name: 'corpid', type: 'string', required: true, displayOptions: { show: { ...showOnly, remove_corp_type: ['joined'] } }, default: '' },
	{ displayName: '待加入企业 CorpID', name: 'pending_corpid', type: 'string', required: true, displayOptions: { show: { ...showOnly, remove_corp_type: ['pending'] } }, default: '' },
];
