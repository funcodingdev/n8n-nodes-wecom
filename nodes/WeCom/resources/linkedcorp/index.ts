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
			{
				name: '获取应用共享信息',
				value: 'getAppShareInfo',
				action: '获取应用共享信息',
				description: '获取应用在互联企业/上下游的共享信息',
			},
			{
				name: '获取下级企业Access Token',
				value: 'getLinkedCorpToken',
				action: '获取下级企业Access Token',
				description: '获取下级/下游企业的access_token',
			},
			{
				name: '获取小程序Session',
				value: 'getMiniProgramSession',
				action: '获取小程序Session',
				description: '获取下级/下游企业小程序session',
			},
			{
				name: '获取上下游关联客户',
				value: 'getLinkedCustomer',
				action: '获取上下游关联客户',
				description: '获取上下游关联的客户信息',
			},
			{
				name: '获取上下游信息',
				value: 'getChainInfo',
				action: '获取上下游信息',
				description: '获取上下游的详细信息',
			},
			{
				name: '批量导入上下游联系人',
				value: 'batchImportChainContact',
				action: '批量导入上下游联系人',
				description: '批量导入上下游的联系人',
			},
			{
				name: '获取上下游异步任务结果',
				value: 'getChainAsyncResult',
				action: '获取上下游异步任务结果',
				description: '获取上下游异步任务的执行结果',
			},
			{
				name: '移除上下游企业',
				value: 'removeChainCorp',
				action: '移除上下游企业',
				description: '从上下游中移除企业',
			},
			{
				name: '查询成员自定义ID',
				value: 'getCustomUserId',
				action: '查询成员自定义ID',
				description: '查询上下游成员的自定义id',
			},
			{
				name: '获取下级企业上下游列表',
				value: 'getSubCorpChainList',
				action: '获取下级企业上下游列表',
				description: '获取下级企业加入的上下游列表',
			},
			{
				name: '获取对接规则列表',
				value: 'getChainRuleList',
				action: '获取对接规则列表',
				description: '获取上下游对接规则id列表',
			},
			{
				name: '删除对接规则',
				value: 'deleteChainRule',
				action: '删除对接规则',
				description: '删除上下游对接规则',
			},
			{
				name: '获取对接规则详情',
				value: 'getChainRuleDetail',
				action: '获取对接规则详情',
				description: '获取上下游对接规则的详细信息',
			},
			{
				name: '新增对接规则',
				value: 'addChainRule',
				action: '新增对接规则',
				description: '新增上下游对接规则',
			},
			{
				name: '更新对接规则',
				value: 'updateChainRule',
				action: '更新对接规则',
				description: '更新上下游对接规则',
			},
		],
		default: 'getAppShareInfo',
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

