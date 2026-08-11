import type { INodeProperties } from 'n8n-workflow';
// 资源 value=living 为历史命名；业务为政民沟通（/cgi-bin/report/*），不是直播 live
import { addGridDescription } from './addGrid';
import { updateGridDescription } from './updateGrid';
import { deleteGridDescription } from './deleteGrid';
import { getGridListDescription } from './getGridList';
import { getUserGridListDescription } from './getUserGridList';
import { addEventCategoryDescription } from './addEventCategory';
import { updateEventCategoryDescription } from './updateEventCategory';
import { deleteEventCategoryDescription } from './deleteEventCategory';
import { getEventCategoryListDescription } from './getEventCategoryList';
import { getInspectGridInfoDescription } from './getInspectGridInfo';
import { getCorpInspectStatDescription } from './getCorpInspectStat';
import { getUserInspectStatDescription } from './getUserInspectStat';
import { getInspectCategoryStatDescription } from './getInspectCategoryStat';
import { getInspectEventListDescription } from './getInspectEventList';
import { getInspectEventDetailDescription } from './getInspectEventDetail';
import { getResidentGridInfoDescription } from './getResidentGridInfo';
import { getCorpResidentStatDescription } from './getCorpResidentStat';
import { getUserResidentStatDescription } from './getUserResidentStat';
import { getResidentCategoryStatDescription } from './getResidentCategoryStat';
import { getResidentEventListDescription } from './getResidentEventList';
import { getResidentEventDetailDescription } from './getResidentEventDetail';

// 资源 value=living 为历史命名；业务为政民沟通（report/*），不是直播 live
const showOnlyForLiving = {
	resource: ['living'],
};

export const livingDescription: INodeProperties[] = [
	{
		displayName: '操作',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: showOnlyForLiving,
		},
		options: [
			// 网格管理
			{
				name: '[网格管理] 添加网格',
				value: 'addGrid',
				description: '新增网格结构节点',
				action: '添加网格',
			},
			{
				name: '[网格管理] 编辑网格',
				value: 'updateGrid',
				description: '更新网格结构信息',
				action: '编辑网格',
			},
			{
				name: '[网格管理] 删除网格',
				value: 'deleteGrid',
				description: '删除网格结构节点',
				action: '删除网格',
			},
			{
				name: '[网格管理] 获取网格列表',
				value: 'getGridList',
				description: '获取网格结构列表',
				action: '获取网格列表',
			},
			{
				name: '[网格管理] 获取用户网格列表',
				value: 'getUserGridList',
				description: '获取成员负责及参与的网格列表',
				action: '获取用户网格列表',
			},
			// 事件类别管理
			{
				name: '[事件类别] 添加事件类别',
				value: 'addEventCategory',
				description: '新增事件类别',
				action: '添加事件类别',
			},
			{
				name: '[事件类别] 修改事件类别',
				value: 'updateEventCategory',
				description: '更新事件类别信息',
				action: '修改事件类别',
			},
			{
				name: '[事件类别] 删除事件类别',
				value: 'deleteEventCategory',
				description: '删除事件类别',
				action: '删除事件类别',
			},
			{
				name: '[事件类别] 获取事件类别列表',
				value: 'getEventCategoryList',
				description: '获取事件类别树',
				action: '获取事件类别列表',
			},
			// 巡查上报
			{
				name: '[巡查上报] 获取巡查网格负责人信息',
				value: 'getInspectGridInfo',
				description: '获取配置的巡查网格及负责人',
				action: '获取巡查网格负责人信息',
			},
			{
				name: '[巡查上报] 获取单位巡查上报统计',
				value: 'getCorpInspectStat',
				description: '获取单位巡查上报数据统计',
				action: '获取单位巡查上报统计',
			},
			{
				name: '[巡查上报] 获取个人巡查上报统计',
				value: 'getUserInspectStat',
				description: '获取个人巡查上报数据统计',
				action: '获取个人巡查上报统计',
			},
			{
				name: '[巡查上报] 获取巡查上报分类统计',
				value: 'getInspectCategoryStat',
				description: '获取巡查上报分类统计',
				action: '获取巡查上报分类统计',
			},
			{
				name: '[巡查上报] 获取巡查上报事件列表',
				value: 'getInspectEventList',
				description: '获取巡查上报事件列表',
				action: '获取巡查上报事件列表',
			},
			{
				name: '[巡查上报] 获取巡查上报事件详情',
				value: 'getInspectEventDetail',
				description: '获取巡查上报事件详情',
				action: '获取巡查上报事件详情',
			},
			// 居民上报
			{
				name: '[居民上报] 获取居民网格负责人信息',
				value: 'getResidentGridInfo',
				description: '获取配置的居民网格及负责人',
				action: '获取居民网格负责人信息',
			},
			{
				name: '[居民上报] 获取单位居民上报统计',
				value: 'getCorpResidentStat',
				description: '获取单位居民上报数据统计',
				action: '获取单位居民上报统计',
			},
			{
				name: '[居民上报] 获取个人居民上报统计',
				value: 'getUserResidentStat',
				description: '获取个人居民上报数据统计',
				action: '获取个人居民上报统计',
			},
			{
				name: '[居民上报] 获取居民上报分类统计',
				value: 'getResidentCategoryStat',
				description: '获取居民上报分类统计',
				action: '获取居民上报分类统计',
			},
			{
				name: '[居民上报] 获取居民上报事件列表',
				value: 'getResidentEventList',
				description: '获取居民上报事件列表',
				action: '获取居民上报事件列表',
			},
			{
				name: '[居民上报] 获取居民上报事件详情',
				value: 'getResidentEventDetail',
				description: '获取居民上报事件详情',
				action: '获取居民上报事件详情',
			},
		],
		default: 'getGridList',
	},
	...addGridDescription,
	...updateGridDescription,
	...deleteGridDescription,
	...getGridListDescription,
	...getUserGridListDescription,
	...addEventCategoryDescription,
	...updateEventCategoryDescription,
	...deleteEventCategoryDescription,
	...getEventCategoryListDescription,
	...getInspectGridInfoDescription,
	...getCorpInspectStatDescription,
	...getUserInspectStatDescription,
	...getInspectCategoryStatDescription,
	...getInspectEventListDescription,
	...getInspectEventDetailDescription,
	...getResidentGridInfoDescription,
	...getCorpResidentStatDescription,
	...getUserResidentStatDescription,
	...getResidentCategoryStatDescription,
	...getResidentEventListDescription,
	...getResidentEventDetailDescription,
];
