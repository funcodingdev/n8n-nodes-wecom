import type { INodeProperties } from 'n8n-workflow';
import { getAgentDescription } from './getAgent';
import { listAgentsDescription } from './listAgents';
import { setAgentDescription } from './setAgent';
import { createMenuDescription } from './createMenu';
import { getMenuDescription } from './getMenu';
import { deleteMenuDescription } from './deleteMenu';
import { setWorkbenchTemplateDescription } from './setWorkbenchTemplate';
import { getWorkbenchTemplateDescription } from './getWorkbenchTemplate';
import { setWorkbenchDataDescription } from './setWorkbenchData';
import { batchSetWorkbenchDataDescription } from './batchSetWorkbenchData';
import { getWorkbenchDataDescription } from './getWorkbenchData';
import { listAppShareInfoDescription } from './listAppShareInfo';

const showOnlyForAgent = {
	resource: ['agent'],
};

export const agentDescription: INodeProperties[] = [
	{
		displayName: '操作',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: showOnlyForAgent,
		},
		options: [
			{
				name: '[应用管理] 获取应用',
				value: 'getAgent',
				action: '获取应用',
				description: '获取指定的应用详情，包括应用名称、可见范围、可信域名等信息',
			},
			{
				name: '[应用管理] 获取应用列表',
				value: 'listAgents',
				action: '获取应用列表',
				description: '获取当前凭证可访问的应用列表',
			},
			{
				name: '[应用管理] 设置应用',
				value: 'setAgent',
				action: '设置应用',
				description: '设置应用的基本信息，包括应用名称、详情、头像、主页URL、可信域名等。仅企业可调用，可设置当前凭证对应的应用；第三方以及代开发自建应用不可调用',
			},
			{
				name: '[应用管理] 创建菜单',
				value: 'createMenu',
				action: '创建菜单',
				description: '创建应用自定义菜单，支持多种按钮类型（点击推事件、跳转URL、扫码、发图、地理位置、小程序等）。仅企业可调用；第三方不可调用',
			},
			{
				name: '[应用管理] 获取菜单',
				value: 'getMenu',
				action: '获取菜单',
				description: '获取应用的菜单配置，返回结果与菜单创建接口相同。仅企业可调用；第三方不可调用',
			},
			{
				name: '[应用管理] 删除菜单',
				value: 'deleteMenu',
				action: '删除菜单',
				description: '删除应用的菜单配置。仅企业可调用；第三方不可调用',
			},
			{
				name: '[应用管理] 设置工作台模版',
				value: 'setWorkbenchTemplate',
				action: '设置工作台模版',
				description: '设置应用在工作台展示的模版类型和默认数据',
			},
			{
				name: '[应用管理] 获取工作台模版',
				value: 'getWorkbenchTemplate',
				action: '获取工作台模版',
				description: '获取应用在工作台展示的模版配置',
			},
			{
				name: '[应用管理] 设置用户工作台数据',
				value: 'setWorkbenchData',
				action: '设置用户工作台数据',
				description: '设置应用在用户工作台展示的数据',
			},
			{
				name: '[应用管理] 批量设置用户工作台数据',
				value: 'batchSetWorkbenchData',
				action: '批量设置用户工作台数据',
				description: '批量设置应用在用户工作台展示的数据',
			},
			{
				name: '[应用管理] 获取用户工作台数据',
				value: 'getWorkbenchData',
				action: '获取用户工作台数据',
				description: '获取应用在用户工作台展示的数据',
			},
			{
				name: '[应用管理] 获取应用共享信息',
				value: 'listAppShareInfo',
				action: '获取应用共享信息',
				description: '局校互联中的局端或者上下游中的上游企业通过该接口可以获取某个应用分享给的所有企业列表',
			},
		],
		default: 'getAgent',
	},
	...getAgentDescription,
	...listAgentsDescription,
	...setAgentDescription,
	...createMenuDescription,
	...getMenuDescription,
	...deleteMenuDescription,
	...setWorkbenchTemplateDescription,
	...getWorkbenchTemplateDescription,
	...setWorkbenchDataDescription,
	...batchSetWorkbenchDataDescription,
	...getWorkbenchDataDescription,
	...listAppShareInfoDescription,
];
