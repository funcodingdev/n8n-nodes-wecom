import type { INodeProperties } from 'n8n-workflow';
import type { ExtraHttpOp } from '../../shared/extraHttpOp';
import { extraHttpOpOptions } from '../../shared/extraHttpOp';

/** 文档有、此前节点未封装的 school 相关 HTTP 接口（一等操作） */
export const schoolExtraHttpOps: ExtraHttpOp[] = [
	{ id: 'departmentCreate', name: '[家校部门] 创建部门', action: '创建部门', description: 'POST /cgi-bin/school/department/create', path: '/cgi-bin/school/department/create', method: 'POST' },
	{ id: 'departmentDelete', name: '[家校部门] 删除部门', action: '删除部门', description: 'POST /cgi-bin/school/department/delete', path: '/cgi-bin/school/department/delete', method: 'POST' },
	{ id: 'departmentList', name: '[家校部门] 获取部门列表', action: '获取部门列表', description: 'GET /cgi-bin/school/department/list', path: '/cgi-bin/school/department/list', method: 'GET' },
	{ id: 'departmentUpdate', name: '[家校部门] 更新部门', action: '更新部门', description: 'POST /cgi-bin/school/department/update', path: '/cgi-bin/school/department/update', method: 'POST' },
	{ id: 'getChatCreateMode', name: '[家校补全] school/get_chat_create_mode', action: 'school/get_chat_create_mode', description: 'POST /cgi-bin/school/get_chat_create_mode', path: '/cgi-bin/school/get_chat_create_mode', method: 'POST' },
	{ id: 'getuserinfo', name: '[家校学生家长] school/getuserinfo', action: 'school/getuserinfo', description: 'GET /cgi-bin/school/getuserinfo', path: '/cgi-bin/school/getuserinfo', method: 'GET' },
	{ id: 'livingGetLivingInfo', name: '[家校直播] living/get_living_info', action: 'living/get_living_info', description: 'POST /cgi-bin/school/living/get_living_info', path: '/cgi-bin/school/living/get_living_info', method: 'POST' },
	{ id: 'livingGetUnwatchStat', name: '[家校直播] living/get_unwatch_stat', action: 'living/get_unwatch_stat', description: 'POST /cgi-bin/school/living/get_unwatch_stat', path: '/cgi-bin/school/living/get_unwatch_stat', method: 'POST' },
	{ id: 'livingGetWatchStat', name: '[家校直播] living/get_watch_stat', action: 'living/get_watch_stat', description: 'POST /cgi-bin/school/living/get_watch_stat', path: '/cgi-bin/school/living/get_watch_stat', method: 'POST' },
	{ id: 'setArchSyncMode', name: '[家校补全] school/set_arch_sync_mode', action: 'school/set_arch_sync_mode', description: 'POST /cgi-bin/school/set_arch_sync_mode', path: '/cgi-bin/school/set_arch_sync_mode', method: 'POST' },
	{ id: 'setChatCreateMode', name: '[家校补全] school/set_chat_create_mode', action: 'school/set_chat_create_mode', description: 'POST /cgi-bin/school/set_chat_create_mode', path: '/cgi-bin/school/set_chat_create_mode', method: 'POST' },
	{ id: 'setUpgradeInfo', name: '[家校补全] school/set_upgrade_info', action: 'school/set_upgrade_info', description: 'POST /cgi-bin/school/set_upgrade_info', path: '/cgi-bin/school/set_upgrade_info', method: 'POST' },
	{ id: 'userList', name: '[家校学生家长] 获取学生列表', action: '获取学生列表', description: 'GET /cgi-bin/school/user/list', path: '/cgi-bin/school/user/list', method: 'GET' },
	{ id: 'userListParent', name: '[家校学生家长] 获取家长列表', action: '获取家长列表', description: 'GET /cgi-bin/school/user/list_parent', path: '/cgi-bin/school/user/list_parent', method: 'GET' },
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
