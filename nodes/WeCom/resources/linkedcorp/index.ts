import type { INodeProperties } from 'n8n-workflow';
import {
	getLinkedcorpExtraHttpOpOptions,
	linkedcorpExtraHttpOpsDescription,
} from './extraHttpOps';
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
		// 官方文档：企业互联/上下游 https://developer.work.weixin.qq.com/document/path/93403
		options: [
			// 上下游基础信息
			{ name: '[基础信息] 获取上下游信息', value: 'getChainInfo', action: '获取上下游信息', description: '获取上下游企业的详细信息' },
			{ name: '[基础信息] 获取下级企业加入的上下游', value: 'getSubCorpChainList', action: '获取下级企业加入的上下游', description: '获取下级企业所加入的上下游列表' },
			// 认证与访问
			{ name: '[认证与访问] 获取下级/下游企业的Access_token', value: 'getLinkedCorpToken', action: '获取下级 / 下游企业的 Access token', description: '获取下级或下游企业的访问令牌' },
			{ name: '[认证与访问] 获取下级/下游企业小程序Session', value: 'getMiniProgramSession', action: '获取下级 / 下游企业小程序 Session', description: '获取下级或下游企业的小程序会话' },
			{ name: '[认证与访问] 获取应用共享信息', value: 'getAppShareInfo', action: '获取应用共享信息', description: '获取应用在上下游企业间的共享信息' },
			// 客户管理
			{ name: '[客户管理] 上下游关联客户信息-已添加客户', value: 'getLinkedCustomer', action: '上下游关联客户信息 - 已添加客户', description: '获取上下游企业已添加的客户列表' },
			{ name: '[客户管理] 批量导入上下游联系人', value: 'batchImportChainContact', action: '批量导入上下游联系人', description: '批量导入上下游企业的联系人' },
			{ name: '[客户管理] 获取异步任务结果', value: 'getChainAsyncResult', action: '获取异步任务结果', description: '获取上下游异步任务的执行结果' },
			// 对接规则管理
			{ name: '[对接规则] 获取对接规则ID列表', value: 'getChainRuleList', action: '获取对接规则 ID 列表', description: '获取所有对接规则的ID列表' },
			{ name: '[对接规则] 获取对接规则详情', value: 'getChainRuleDetail', action: '获取对接规则详情', description: '获取指定对接规则的详细信息' },
			{ name: '[对接规则] 新增对接规则', value: 'addChainRule', action: '新增对接规则', description: '创建新的上下游对接规则' },
			{ name: '[对接规则] 更新对接规则', value: 'updateChainRule', action: '更新对接规则', description: '更新已有的上下游对接规则' },
			{ name: '[对接规则] 删除对接规则', value: 'deleteChainRule', action: '删除对接规则', description: '删除指定的上下游对接规则' },
			// 其他操作
			{ name: '[其他操作] 查询成员自定义ID', value: 'getCustomUserId', action: '查询成员自定义 ID', description: '查询成员在上下游企业中的自定义ID' },
			{ name: '[其他操作] 移除企业', value: 'removeChainCorp', action: '移除企业', description: '从上下游关系中移除企业' },
					...getLinkedcorpExtraHttpOpOptions(),
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
	...linkedcorpExtraHttpOpsDescription,
];
