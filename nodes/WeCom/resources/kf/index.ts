import type { INodeProperties } from 'n8n-workflow';

// 客服账号管理
import { addKfAccountDescription } from './addKfAccount';
import { delKfAccountDescription } from './delKfAccount';
import { updateKfAccountDescription } from './updateKfAccount';
import { listKfAccountDescription } from './listKfAccount';
import { getKfAccountLinkDescription } from './getKfAccountLink';

// 接待人员管理
import { addServicerDescription } from './addServicer';
import { delServicerDescription } from './delServicer';
import { listServicerDescription } from './listServicer';

// 会话分配与消息收发
import { transServiceStateDescription } from './transServiceState';
import { sendKfMsgDescription } from './sendKfMsg';
import { sendKfEventMsgDescription } from './sendKfEventMsg';
import { setUpgradeServiceDescription } from './setUpgradeService';
import { getCustomerInfoDescription } from './getCustomerInfo';

// 统计管理
import { getCorpStatisticDescription } from './getCorpStatistic';
import { getServicerStatisticDescription } from './getServicerStatistic';

// 机器人管理
import { manageKnowledgeGroupDescription } from './manageKnowledgeGroup';
import { manageKnowledgeIntentDescription } from './manageKnowledgeIntent';

const showOnlyForKf = {
	resource: ['kf'],
};

export const kfDescription: INodeProperties[] = [
	{
		displayName: '操作',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: showOnlyForKf,
		},
		// eslint-disable-next-line n8n-nodes-base/node-param-options-type-unsorted-items
		options: [
			// 客服账号管理
			{
				name: '添加客服账号',
				value: 'addKfAccount',
				action: '添加客服账号',
			},
			{
				name: '删除客服账号',
				value: 'delKfAccount',
				action: '删除客服账号',
			},
			{
				name: '修改客服账号',
				value: 'updateKfAccount',
				action: '修改客服账号',
			},
			{
				name: '获取客服账号列表',
				value: 'listKfAccount',
				action: '获取客服账号列表',
			},
			{
				name: '获取客服账号链接',
				value: 'getKfAccountLink',
				action: '获取客服账号链接',
			},
			// 接待人员管理
			{
				name: '添加接待人员',
				value: 'addServicer',
				action: '添加接待人员',
			},
			{
				name: '删除接待人员',
				value: 'delServicer',
				action: '删除接待人员',
			},
			{
				name: '获取接待人员列表',
				value: 'listServicer',
				action: '获取接待人员列表',
			},
			// 会话分配与消息收发
			{
				name: '分配客服会话',
				value: 'transServiceState',
				action: '分配客服会话',
			},
			{
				name: '发送消息',
				value: 'sendKfMsg',
				action: '发送消息',
			},
			{
				name: '发送事件响应消息',
				value: 'sendKfEventMsg',
				action: '发送事件响应消息',
			},
			{
				name: '设置升级服务配置',
				value: 'setUpgradeService',
				action: '设置升级服务配置',
			},
			{
				name: '获取客户基础信息',
				value: 'getCustomerInfo',
				action: '获取客户基础信息',
			},
			// 统计管理
			{
				name: '获取企业客服数据统计',
				value: 'getCorpStatistic',
				action: '获取企业数据统计',
			},
			{
				name: '获取接待人员数据统计',
				value: 'getServicerStatistic',
				action: '获取接待人员统计',
			},
			// 机器人管理
			{
				name: '管理知识库分组',
				value: 'manageKnowledgeGroup',
				action: '管理知识库分组',
			},
			{
				name: '管理知识库问答',
				value: 'manageKnowledgeIntent',
				action: '管理知识库问答',
			},
		],
		default: 'listKfAccount',
	},
	// 客服账号管理
	...addKfAccountDescription,
	...delKfAccountDescription,
	...updateKfAccountDescription,
	...listKfAccountDescription,
	...getKfAccountLinkDescription,
	// 接待人员管理
	...addServicerDescription,
	...delServicerDescription,
	...listServicerDescription,
	// 会话分配与消息收发
	...transServiceStateDescription,
	...sendKfMsgDescription,
	...sendKfEventMsgDescription,
	...setUpgradeServiceDescription,
	...getCustomerInfoDescription,
	// 统计管理
	...getCorpStatisticDescription,
	...getServicerStatisticDescription,
	// 机器人管理
	...manageKnowledgeGroupDescription,
	...manageKnowledgeIntentDescription,
];

