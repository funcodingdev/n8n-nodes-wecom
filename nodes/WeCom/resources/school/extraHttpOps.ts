import type { INodeProperties } from 'n8n-workflow';
import type { ExtraHttpOp } from '../../shared/extraHttpOp';
import { extraHttpOpOptions } from '../../shared/extraHttpOp';

/** 家校补全接口（部门 / 学生家长 / 直播 / 模式设置） */
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
		displayName: '部门ID',
		name: 'school_department_id',
		type: 'number',
		displayOptions: {
			show: {
				resource: ['school'],
				operation: [
					'departmentDelete',
					'departmentUpdate',
					'departmentList',
					'userList',
					'userListParent',
				],
			},
		},
		default: 0,
		description: '部门 ID；列表类接口可作筛选',
	},
	{
		displayName: '部门名称',
		name: 'school_department_name',
		type: 'string',
		displayOptions: {
			show: { resource: ['school'], operation: ['departmentCreate', 'departmentUpdate'] },
		},
		default: '',
	},
	{
		displayName: '部门类型',
		name: 'school_department_type',
		type: 'number',
		displayOptions: {
			show: { resource: ['school'], operation: ['departmentCreate', 'departmentUpdate'] },
		},
		default: 1,
		description: '部门类型，见家校部门文档（如标准年级/自定义等）',
	},
	{
		displayName: '父部门ID',
		name: 'school_parentid',
		type: 'number',
		displayOptions: {
			show: { resource: ['school'], operation: ['departmentCreate', 'departmentUpdate'] },
		},
		default: 0,
	},
	{
		displayName: 'OAuth Code',
		name: 'school_code',
		type: 'string',
		displayOptions: {
			show: { resource: ['school'], operation: ['getuserinfo'] },
		},
		default: '',
		description: '网页授权回调 code',
	},
	{
		displayName: '直播ID',
		name: 'school_livingid',
		type: 'string',
		displayOptions: {
			show: {
				resource: ['school'],
				operation: ['livingGetLivingInfo', 'livingGetUnwatchStat', 'livingGetWatchStat'],
			},
		},
		default: '',
	},
	{
		displayName: '分页next_key',
		name: 'school_next_key',
		type: 'string',
		displayOptions: {
			show: {
				resource: ['school'],
				operation: ['livingGetUnwatchStat', 'livingGetWatchStat'],
			},
		},
		default: '',
		description: '上次返回的 next_key，首次可不填',
	},
	{
		displayName: '模式值',
		name: 'school_mode',
		type: 'number',
		displayOptions: {
			show: {
				resource: ['school'],
				operation: ['setArchSyncMode', 'setChatCreateMode'],
			},
		},
		default: 0,
		description: '同步/建群模式枚举，见官方文档',
	},
	{
		displayName: '请求体JSON',
		name: 'requestBody',
		type: 'json',
		displayOptions: {
			show: { resource: ['school'], operation: schoolExtraHttpOpsOptionValues },
		},
		default: '{}',
		description: '其余字段与上方合并，JSON 优先',
	},
	{
		displayName: 'Query参数JSON',
		name: 'requestQuery',
		type: 'json',
		displayOptions: {
			show: { resource: ['school'], operation: schoolExtraHttpOpsOptionValues },
		},
		default: '{}',
		description: 'URL 查询参数（GET 接口常用；访问凭证自动附加）',
	},
];
