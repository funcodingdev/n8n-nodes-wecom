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
					'departmentCreate',
					'departmentDelete',
					'departmentUpdate',
					'departmentList',
					'userList',
					'userListParent',
				],
			},
		},
		default: 0,
		description: '创建时可指定 id（>1）；更新/删除必填；列表接口可作筛选',
	},
	{
		displayName: '部门名称',
		name: 'school_department_name',
		type: 'string',
		displayOptions: {
			show: { resource: ['school'], operation: ['departmentCreate', 'departmentUpdate'] },
		},
		default: '',
		description: '1~32 字符；标准年级创建时名称会被忽略',
	},
	{
		displayName: '部门类型',
		name: 'school_department_type',
		type: 'options',
		displayOptions: {
			show: { resource: ['school'], operation: ['departmentCreate'] },
		},
		options: [
			{ name: '班级', value: 1 },
			{ name: '年级', value: 2 },
			{ name: '学段', value: 3 },
			{ name: '校区', value: 4 },
		],
		default: 1,
		description: '班级的父部门必须是年级',
	},
	{
		displayName: '父部门ID',
		name: 'school_parentid',
		type: 'number',
		displayOptions: {
			show: { resource: ['school'], operation: ['departmentCreate', 'departmentUpdate'] },
		},
		default: 0,
		description: '创建时必填',
	},
	{
		displayName: '新部门ID',
		name: 'school_new_id',
		type: 'number',
		displayOptions: {
			show: { resource: ['school'], operation: ['departmentUpdate'] },
		},
		default: 0,
		description: '将部门 id 修改为新的 id（new_id）',
	},
	{
		displayName: '入学年份',
		name: 'register_year',
		type: 'number',
		displayOptions: {
			show: { resource: ['school'], operation: ['departmentCreate', 'departmentUpdate'] },
		},
		default: 0,
		description: 'YYYY，1970～2100；仅年级类型生效',
	},
	{
		displayName: '标准年级',
		name: 'standard_grade',
		type: 'number',
		displayOptions: {
			show: { resource: ['school'], operation: ['departmentCreate', 'departmentUpdate'] },
		},
		default: 0,
		description: '标准年级代码；更新时传 0 表示转为非标准年级',
	},
	{
		displayName: '排序次序',
		name: 'school_department_order',
		type: 'number',
		displayOptions: {
			show: { resource: ['school'], operation: ['departmentCreate', 'departmentUpdate'] },
		},
		default: 0,
		description: '在父部门中的次序，越大越靠前',
	},
	{
		displayName: '部门管理员',
		name: 'departmentAdminsCollection',
		type: 'fixedCollection',
		displayOptions: {
			show: { resource: ['school'], operation: ['departmentCreate', 'departmentUpdate'] },
		},
		default: {},
		placeholder: '添加管理员',
		typeOptions: { multipleValues: true },
		options: [
			{
				displayName: '管理员',
				name: 'admins',
				values: [
					{
						displayName: '操作',
						name: 'op',
						type: 'options',
						options: [
							{ name: '新增或更新', value: 0 },
							{ name: '删除', value: 1 },
						],
						default: 0,
						description: '更新部门时有效；创建时忽略',
					},
					{
						displayName: '成员UserID',
						name: 'userid',
						type: 'string',
						default: '',
					},
					{
						displayName: '管理员类型',
						name: 'type',
						type: 'options',
						options: [
							{ name: '校区负责人', value: 1 },
							{ name: '年级负责人', value: 2 },
							{ name: '班主任', value: 3 },
							{ name: '任课老师', value: 4 },
							{ name: '学段负责人', value: 5 },
						],
						default: 3,
					},
					{
						displayName: '科目',
						name: 'subject',
						type: 'string',
						default: '',
						description: '仅班主任/任课老师，最多 15 字符',
					},
				],
			},
		],
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
		displayName: '自动升年级时间',
		name: 'upgrade_time',
		type: 'number',
		displayOptions: {
			show: { resource: ['school'], operation: ['setUpgradeInfo'] },
		},
		default: 0,
		description: '自动升年级时间戳，仅月日有效；0 表示 1 月 1 日',
	},
	{
		displayName: '自动升年级开关',
		name: 'upgrade_switch',
		type: 'options',
		displayOptions: {
			show: { resource: ['school'], operation: ['setUpgradeInfo'] },
		},
		options: [
			{ name: '关闭', value: 0 },
			{ name: '开启', value: 1 },
		],
		default: 0,
		description: '0 关闭，1 开启；其他值视为关闭',
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
