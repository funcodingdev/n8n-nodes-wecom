import type { INodeProperties } from 'n8n-workflow';
import { getAppShareInfoDescription } from './getAppShareInfo';
import { getLinkedCorpTokenDescription } from './getLinkedCorpToken';
import { getMiniProgramSessionDescription } from './getMiniProgramSession';
import { getLinkedCustomerDescription } from './getLinkedCustomer';
import { getChainInfoDescription } from './getChainInfo';
import { batchImportChainContactDescription } from './batchImportChainContact';
import { getChainAsyncResultDescription } from './getChainAsyncResult';
import { removeChainCorpDescription } from './removeChainCorp';
import { getCustomUserIdDescription } from './getCustomUserId';
import { getSubCorpChainListDescription } from './getSubCorpChainList';
import { getChainRuleListDescription } from './getChainRuleList';
import { deleteChainRuleDescription } from './deleteChainRule';
import { getChainRuleDetailDescription } from './getChainRuleDetail';
import { addChainRuleDescription } from './addChainRule';
import { updateChainRuleDescription } from './updateChainRule';

const showOnlyForLinkedcorp = {
	resource: ['linkedcorp'],
};

export const linkedcorpDescription: INodeProperties[] = [
	{
		displayName: '操作',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: showOnlyForLinkedcorp,
		},
		options: [
			],
		default: '',
	},
	...getAppShareInfoDescription,
	...getLinkedCorpTokenDescription,
	...getMiniProgramSessionDescription,
	...getLinkedCustomerDescription,
	...getChainInfoDescription,
	...batchImportChainContactDescription,
	...getChainAsyncResultDescription,
	...removeChainCorpDescription,
	...getCustomUserIdDescription,
	...getSubCorpChainListDescription,
	...getChainRuleListDescription,
	...deleteChainRuleDescription,
	...getChainRuleDetailDescription,
	...addChainRuleDescription,
	...updateChainRuleDescription,
];
