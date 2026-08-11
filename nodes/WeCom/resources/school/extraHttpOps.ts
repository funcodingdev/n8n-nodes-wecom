import type { INodeProperties } from 'n8n-workflow';
import type { ExtraHttpOp } from '../../shared/extraHttpOp';
import { extraHttpOpOptions } from '../../shared/extraHttpOp';

/** 文档有、此前节点未封装的 school 相关 HTTP 接口（一等操作） */
export const schoolExtraHttpOps: ExtraHttpOp[] = [
	{ id: 'departmentCreate', name: '[家校部门] 创建部门', action: '创建家校部门', description: '创建家校部门', path: '/cgi-bin/school/department/create', method: 'POST' },
	{ id: 'departmentDelete', name: '[家校部门] 删除部门', action: '删除家校部门', description: '删除家校部门', path: '/cgi-bin/school/department/delete', method: 'POST' },
	{ id: 'departmentList', name: '[家校部门] 获取部门列表', action: '获取家校部门列表', description: '获取家校部门列表', path: '/cgi-bin/school/department/list', method: 'GET' },
	{ id: 'departmentUpdate', name: '[家校部门] 更新部门', action: '更新家校部门', description: '更新家校部门', path: '/cgi-bin/school/department/update', method: 'POST' },
	{ id: 'getChatCreateMode', name: '[家校] 获取群创建模式', action: '获取家校群创建模式', description: '获取家校群创建模式', path: '/cgi-bin/school/get_chat_create_mode', method: 'POST' },
	{ id: 'getuserinfo', name: '[家校] 获取访问用户身份', action: '获取家校访问用户身份', description: '获取家校访问用户身份', path: '/cgi-bin/school/getuserinfo', method: 'GET' },
	{ id: 'livingGetLivingInfo', name: '[家校直播] 获取直播详情', action: '获取家校直播详情', description: '获取家校直播详情', path: '/cgi-bin/school/living/get_living_info', method: 'POST' },
	{ id: 'livingGetUnwatchStat', name: '[家校直播] 获取未观看统计', action: '获取家校直播未观看统计', description: '获取家校直播未观看统计', path: '/cgi-bin/school/living/get_unwatch_stat', method: 'POST' },
	{ id: 'livingGetWatchStat', name: '[家校直播] 获取观看统计', action: '获取家校直播观看统计', description: '获取家校直播观看统计', path: '/cgi-bin/school/living/get_watch_stat', method: 'POST' },
	{ id: 'setArchSyncMode', name: '[家校] 设置通讯录同步模式', action: '设置家校通讯录同步模式', description: '设置家校通讯录同步模式', path: '/cgi-bin/school/set_arch_sync_mode', method: 'POST' },
	{ id: 'setChatCreateMode', name: '[家校] 设置群创建模式', action: '设置家校群创建模式', description: '设置家校群创建模式', path: '/cgi-bin/school/set_chat_create_mode', method: 'POST' },
	{ id: 'setUpgradeInfo', name: '[家校] 设置升级信息', action: '设置家校升级信息', description: '设置家校升级信息', path: '/cgi-bin/school/set_upgrade_info', method: 'POST' },
	{ id: 'userList', name: '[家校学生] 获取学生列表', action: '获取学生列表', description: '获取学生列表', path: '/cgi-bin/school/user/list', method: 'GET' },
	{ id: 'userListParent', name: '[家校家长] 获取家长列表', action: '获取家长列表', description: '获取家长列表', path: '/cgi-bin/school/user/list_parent', method: 'GET' },
];

export const schoolExtraHttpOpsById: Record<string, ExtraHttpOp> = Object.fromEntries(
	schoolExtraHttpOps.map((o) => [o.id, o]),
);

export const schoolExtraHttpOpsOptionValues = schoolExtraHttpOps.map((o) => o.id);

export function getSchoolExtraHttpOpOptions() {
	return extraHttpOpOptions(schoolExtraHttpOps);
}

export const schoolExtraHttpOpsDescription: INodeProperties[] = [
	{
		displayName: '请求体JSON',
		name: 'requestBody',
		type: 'json',
		displayOptions: {
			show: { resource: ['school'], operation: schoolExtraHttpOpsOptionValues },
		},
		default: '{}',
		description: '请求体 JSON，字段名与企业微信接口文档保持一致；GET 请求可留空',
	},
	{
		displayName: 'Query参数JSON',
		name: 'requestQuery',
		type: 'json',
		displayOptions: {
			show: { resource: ['school'], operation: schoolExtraHttpOpsOptionValues },
		},
		default: '{}',
		description: 'URL 查询参数（访问凭证会自动附加，无需填写）',
	},
];
