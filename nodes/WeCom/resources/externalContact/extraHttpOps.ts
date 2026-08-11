import type { INodeProperties } from 'n8n-workflow';
import type { ExtraHttpOp } from '../../shared/extraHttpOp';
import { extraHttpOpOptions } from '../../shared/extraHttpOp';

/** 客户联系补全接口（规则组 / 学校通知关注 / 旧版 crm） */
export const externalContactExtraHttpOps: ExtraHttpOp[] = [
	{ id: 'externalcontactAddStrategyTag', name: '[规则组标签] 添加企业客户标签', action: '规则组添加企业客户标签', description: '规则组添加企业客户标签', path: '/cgi-bin/externalcontact/add_strategy_tag', method: 'POST' },
	{ id: 'externalcontactConvertToOpenid', name: '[客户联系] external_userid转openid', action: '外部联系人转OpenID', description: '外部联系人转OpenID', path: '/cgi-bin/externalcontact/convert_to_openid', method: 'POST' },
	{ id: 'externalcontactCustomerStrategyCreate', name: '[客户规则组] 创建规则组', action: '创建客户规则组', description: '创建客户规则组', path: '/cgi-bin/externalcontact/customer_strategy/create', method: 'POST' },
	{ id: 'externalcontactCustomerStrategyDel', name: '[客户规则组] 删除规则组', action: '删除客户规则组', description: '删除客户规则组', path: '/cgi-bin/externalcontact/customer_strategy/del', method: 'POST' },
	{ id: 'externalcontactCustomerStrategyEdit', name: '[客户规则组] 编辑规则组', action: '编辑客户规则组', description: '编辑客户规则组', path: '/cgi-bin/externalcontact/customer_strategy/edit', method: 'POST' },
	{ id: 'externalcontactCustomerStrategyGet', name: '[客户规则组] 获取规则组详情', action: '获取客户规则组详情', description: '获取客户规则组详情', path: '/cgi-bin/externalcontact/customer_strategy/get', method: 'POST' },
	{ id: 'externalcontactCustomerStrategyGetRange', name: '[客户规则组] 获取管理范围', action: '获取规则组管理范围', description: '获取规则组管理范围', path: '/cgi-bin/externalcontact/customer_strategy/get_range', method: 'POST' },
	{ id: 'externalcontactCustomerStrategyList', name: '[客户规则组] 获取规则组列表', action: '获取客户规则组列表', description: '获取客户规则组列表', path: '/cgi-bin/externalcontact/customer_strategy/list', method: 'POST' },
	{ id: 'externalcontactDelStrategyTag', name: '[规则组标签] 删除企业客户标签', action: '规则组删除企业客户标签', description: '规则组删除企业客户标签', path: '/cgi-bin/externalcontact/del_strategy_tag', method: 'POST' },
	{ id: 'externalcontactEditStrategyTag', name: '[规则组标签] 编辑企业客户标签', action: '规则组编辑企业客户标签', description: '规则组编辑企业客户标签', path: '/cgi-bin/externalcontact/edit_strategy_tag', method: 'POST' },
	{ id: 'externalcontactGetGroupMsgResult', name: '[客户联系] 获取群发执行结果(旧)', action: '获取群发执行结果', description: '获取企业群发成员执行结果', path: '/cgi-bin/externalcontact/get_group_msg_result', method: 'POST' },
	{ id: 'externalcontactGetStrategyTagList', name: '[规则组标签] 获取标签列表', action: '获取规则组标签列表', description: '获取规则组标签列表', path: '/cgi-bin/externalcontact/get_strategy_tag_list', method: 'POST' },
	{ id: 'externalcontactGetSubscribeMode', name: '[学校通知] 获取关注模式', action: '获取学校通知关注模式', description: '获取家长关注「学校通知」的模式', path: '/cgi-bin/externalcontact/get_subscribe_mode', method: 'GET' },
	{ id: 'externalcontactGetSubscribeQrCode', name: '[学校通知] 获取关注二维码', action: '获取学校通知二维码', description: '获取学校通知二维码', path: '/cgi-bin/externalcontact/get_subscribe_qr_code', method: 'GET' },
	{ id: 'externalcontactSetSubscribeMode', name: '[学校通知] 设置关注模式', action: '设置学校通知关注模式', description: '设置家长关注「学校通知」的模式', path: '/cgi-bin/externalcontact/set_subscribe_mode', method: 'POST' },
	{ id: 'externalcontactTransfer', name: '[客户联系] 分配在职成员客户(旧)', action: '分配在职成员客户', description: '分配在职成员的客户', path: '/cgi-bin/externalcontact/transfer', method: 'POST' },
	{ id: 'crmAddMsgTemplate', name: '[客户联系(旧)] 创建企业群发', action: '创建企业群发（旧版）', description: '创建企业群发（旧版路径）', path: '/cgi-bin/crm/add_msg_template', method: 'POST' },
	{ id: 'crmGetCustomerContacts', name: '[客户联系(旧)] 获取客户列表', action: '获取客户列表（旧版）', description: '获取客户列表（旧版路径）', path: '/cgi-bin/crm/get_customer_contacts', method: 'POST' },
	{ id: 'crmGetExternalContact', name: '[客户联系(旧)] 获取客户详情', action: '获取客户详情（旧版）', description: '获取客户详情（旧版路径）', path: '/cgi-bin/crm/get_external_contact', method: 'POST' },
	{ id: 'crmGetExternalContactList', name: '[客户联系(旧)] 获取客户列表2', action: '获取客户列表2（旧版）', description: '获取客户列表（旧版路径）', path: '/cgi-bin/crm/get_external_contact_list', method: 'POST' },
	{ id: 'crmGetGroupMsgResult', name: '[客户联系(旧)] 获取群发结果', action: '获取群发结果（旧版）', description: '获取群发结果（旧版路径）', path: '/cgi-bin/crm/get_group_msg_result', method: 'POST' },
	{ id: 'crmGetUnassignedList', name: '[客户联系(旧)] 获取待分配列表', action: '获取待分配列表（旧版）', description: '获取待分配列表（旧版路径）', path: '/cgi-bin/crm/get_unassigned_list', method: 'POST' },
	{ id: 'crmGetUserBehaviorData', name: '[客户联系(旧)] 获取联系客户统计', action: '获取联系客户统计（旧版）', description: '获取联系客户统计（旧版路径）', path: '/cgi-bin/crm/get_user_behavior_data', method: 'POST' },
	{ id: 'crmTransferExternalContact', name: '[客户联系(旧)] 分配客户', action: '分配客户（旧版）', description: '分配客户（旧版路径）', path: '/cgi-bin/crm/transfer_external_contact', method: 'POST' },
];

export const externalContactExtraHttpOpsById: Record<string, ExtraHttpOp> = Object.fromEntries(
	externalContactExtraHttpOps.map((o) => [o.id, o]),
);

export const externalContactExtraHttpOpsOptionValues = externalContactExtraHttpOps.map((o) => o.id);

export function getExternalContactExtraHttpOpOptions() {
	return extraHttpOpOptions(externalContactExtraHttpOps);
}

const needStrategyId = [
	'externalcontactCustomerStrategyDel',
	'externalcontactCustomerStrategyEdit',
	'externalcontactCustomerStrategyGet',
	'externalcontactCustomerStrategyGetRange',
	'externalcontactAddStrategyTag',
	'externalcontactDelStrategyTag',
	'externalcontactGetStrategyTagList',
];

const strategyCreateEdit = [
	'externalcontactCustomerStrategyCreate',
	'externalcontactCustomerStrategyEdit',
];

const rangeNodeValues: INodeProperties[] = [
	{
		displayName: '节点类型',
		name: 'type',
		type: 'options',
		options: [
			{ name: '成员', value: 1 },
			{ name: '部门', value: 2 },
		],
		default: 1,
		description: '1-成员 2-部门',
	},
	{
		displayName: '成员UserID',
		name: 'userid',
		type: 'string',
		default: '',
		description: 'type 为成员时填写',
	},
	{
		displayName: '部门ID',
		name: 'partyid',
		type: 'number',
		default: 0,
		description: 'type 为部门时填写',
	},
];

/** 可配置权限（基础权限固定为 true，不在表单中展示） */
const privilegeBooleanDefs: Array<{ name: string; displayName: string }> = [
	{ name: 'priv_share_customer', displayName: '允许分享客户给其他成员' },
	{ name: 'priv_oper_resign_customer', displayName: '允许分配离职成员客户' },
	{ name: 'priv_oper_resign_group', displayName: '允许分配离职成员客户群' },
	{ name: 'priv_send_customer_msg', displayName: '允许给企业客户发送消息' },
	{ name: 'priv_edit_welcome_msg', displayName: '允许配置欢迎语' },
	{ name: 'priv_view_behavior_data', displayName: '允许查看成员联系客户统计' },
	{ name: 'priv_view_room_data', displayName: '允许查看群聊数据统计' },
	{ name: 'priv_send_group_msg', displayName: '允许发送消息到企业的客户群' },
	{ name: 'priv_room_deduplication', displayName: '允许对企业客户群去重' },
	{ name: 'priv_rapid_reply', displayName: '允许配置快捷回复' },
	{ name: 'priv_onjob_customer_transfer', displayName: '允许转接在职成员客户' },
	{ name: 'priv_edit_anti_spam_rule', displayName: '允许编辑防骚扰规则' },
	{ name: 'priv_export_customer_list', displayName: '允许导出客户列表' },
	{ name: 'priv_export_customer_data', displayName: '允许导出成员客户统计' },
	{ name: 'priv_export_customer_group_list', displayName: '允许导出客户群列表' },
	{ name: 'priv_manage_customer_tag', displayName: '允许配置企业客户标签' },
];

export const externalContactExtraHttpOpsDescription: INodeProperties[] = [
	{
		displayName: '规则组ID',
		name: 'strategy_id',
		type: 'number',
		displayOptions: {
			show: { resource: ['externalContact'], operation: needStrategyId },
		},
		default: 0,
		description: '客户规则组 strategy_id',
	},
	{
		displayName: '外部联系人ID',
		name: 'ec_external_userid',
		type: 'string',
		displayOptions: {
			show: {
				resource: ['externalContact'],
				operation: [
					'externalcontactConvertToOpenid',
					'crmGetExternalContact',
					'externalcontactTransfer',
					'crmTransferExternalContact',
				],
			},
		},
		default: '',
		description: 'external_userid',
	},
	{
		displayName: '成员UserID',
		name: 'ec_userid',
		type: 'string',
		displayOptions: {
			show: {
				resource: ['externalContact'],
				operation: [
					'crmGetCustomerContacts',
					'crmGetExternalContactList',
					'crmGetUserBehaviorData',
					'externalcontactTransfer',
					'crmTransferExternalContact',
				],
			},
		},
		default: '',
		description: '企业成员 userid；统计接口可逗号分隔多人',
	},
	{
		displayName: '游标',
		name: 'ec_cursor',
		type: 'string',
		displayOptions: {
			show: {
				resource: ['externalContact'],
				operation: [
					'externalcontactCustomerStrategyList',
					'externalcontactCustomerStrategyGetRange',
					'crmGetUnassignedList',
				],
			},
		},
		default: '',
	},
	{
		displayName: '条数限制',
		name: 'ec_limit',
		type: 'number',
		displayOptions: {
			show: {
				resource: ['externalContact'],
				operation: [
					'externalcontactCustomerStrategyList',
					'externalcontactCustomerStrategyGetRange',
					'crmGetUnassignedList',
				],
			},
		},
		default: 100,
	},
	{
		displayName: '规则组名称',
		name: 'strategy_name',
		type: 'string',
		displayOptions: {
			show: { resource: ['externalContact'], operation: strategyCreateEdit },
		},
		default: '',
	},
	{
		displayName: '父规则组ID',
		name: 'parent_id',
		type: 'number',
		displayOptions: {
			show: {
				resource: ['externalContact'],
				operation: ['externalcontactCustomerStrategyCreate'],
			},
		},
		default: 0,
		description: '顶级填 0；有父规则组时权限配置会被忽略并继承父组',
	},
	{
		displayName: '管理员UserID列表',
		name: 'admin_list',
		type: 'string',
		displayOptions: {
			show: { resource: ['externalContact'], operation: strategyCreateEdit },
		},
		default: '',
		placeholder: 'zhangsan,lisi',
		description: '逗号分隔，最多 20 个，不可配置超级管理员',
	},
	{
		displayName: '管理范围',
		name: 'rangeCollection',
		type: 'fixedCollection',
		displayOptions: {
			show: {
				resource: ['externalContact'],
				operation: ['externalcontactCustomerStrategyCreate'],
			},
		},
		default: {},
		placeholder: '添加管理范围节点',
		typeOptions: { multipleValues: true },
		description: '创建时的管理范围，单次最多 100 个节点',
		options: [{ displayName: '范围节点', name: 'ranges', values: rangeNodeValues }],
	},
	{
		displayName: '添加管理范围',
		name: 'rangeAddCollection',
		type: 'fixedCollection',
		displayOptions: {
			show: {
				resource: ['externalContact'],
				operation: ['externalcontactCustomerStrategyEdit'],
			},
		},
		default: {},
		placeholder: '添加节点',
		typeOptions: { multipleValues: true },
		description: '向管理范围追加的节点',
		options: [{ displayName: '范围节点', name: 'ranges', values: rangeNodeValues }],
	},
	{
		displayName: '删除管理范围',
		name: 'rangeDelCollection',
		type: 'fixedCollection',
		displayOptions: {
			show: {
				resource: ['externalContact'],
				operation: ['externalcontactCustomerStrategyEdit'],
			},
		},
		default: {},
		placeholder: '删除节点',
		typeOptions: { multipleValues: true },
		description: '从管理范围移除的节点',
		options: [{ displayName: '范围节点', name: 'ranges', values: rangeNodeValues }],
	},
	{
		displayName: '更新权限配置',
		name: 'updatePrivilege',
		type: 'boolean',
		displayOptions: {
			show: {
				resource: ['externalContact'],
				operation: ['externalcontactCustomerStrategyEdit'],
			},
		},
		default: false,
		description: '开启后覆盖旧权限；有父规则组时权限配置会被忽略',
	},
	// create 始终展示；edit 仅在 updatePrivilege=true 时展示
	...privilegeBooleanDefs.flatMap((p): INodeProperties[] => [
		{
			displayName: p.displayName,
			name: p.name,
			type: 'boolean',
			default: true,
			displayOptions: {
				show: {
					resource: ['externalContact'],
					operation: ['externalcontactCustomerStrategyCreate'],
				},
			},
		},
		{
			displayName: p.displayName,
			name: p.name,
			type: 'boolean',
			default: true,
			displayOptions: {
				show: {
					resource: ['externalContact'],
					operation: ['externalcontactCustomerStrategyEdit'],
					updatePrivilege: [true],
				},
			},
		},
	]),
	{
		displayName: '标签组ID',
		name: 'tag_group_id',
		type: 'string',
		displayOptions: {
			show: {
				resource: ['externalContact'],
				operation: ['externalcontactAddStrategyTag'],
			},
		},
		default: '',
		description: '已有标签组 group_id；填写后忽略名称与次序',
	},
	{
		displayName: '标签组名称',
		name: 'tag_group_name',
		type: 'string',
		displayOptions: {
			show: {
				resource: ['externalContact'],
				operation: ['externalcontactAddStrategyTag'],
			},
		},
		default: '',
		description: '新建标签组名称，最长 30 字符',
	},
	{
		displayName: '标签组次序',
		name: 'tag_group_order',
		type: 'number',
		displayOptions: {
			show: {
				resource: ['externalContact'],
				operation: ['externalcontactAddStrategyTag'],
			},
		},
		default: 0,
		description: 'order 越大越靠前',
	},
	{
		displayName: '标签列表',
		name: 'strategyTagCollection',
		type: 'fixedCollection',
		displayOptions: {
			show: {
				resource: ['externalContact'],
				operation: ['externalcontactAddStrategyTag'],
			},
		},
		default: {},
		placeholder: '添加标签',
		typeOptions: { multipleValues: true },
		description: '要添加的标签，不可创建空标签组',
		options: [
			{
				displayName: '标签',
				name: 'tags',
				values: [
					{
						displayName: '标签名称',
						name: 'name',
						type: 'string',
						default: '',
						description: '最长 30 字符',
					},
					{
						displayName: '次序',
						name: 'order',
						type: 'number',
						default: 0,
					},
				],
			},
		],
	},
	{
		displayName: '标签/标签组ID',
		name: 'strategy_tag_id',
		type: 'string',
		displayOptions: {
			show: {
				resource: ['externalContact'],
				operation: ['externalcontactEditStrategyTag'],
			},
		},
		default: '',
		description: '要编辑的标签或标签组 id',
	},
	{
		displayName: '新名称',
		name: 'strategy_tag_name',
		type: 'string',
		displayOptions: {
			show: {
				resource: ['externalContact'],
				operation: ['externalcontactEditStrategyTag'],
			},
		},
		default: '',
		description: '新的标签或标签组名称，最长 30 字符',
	},
	{
		displayName: '新次序',
		name: 'strategy_tag_order',
		type: 'number',
		displayOptions: {
			show: {
				resource: ['externalContact'],
				operation: ['externalcontactEditStrategyTag'],
			},
		},
		default: 0,
		description: 'order 越大越靠前；0 表示不修改',
	},
	{
		displayName: '标签ID列表',
		name: 'strategy_tag_ids',
		type: 'string',
		displayOptions: {
			show: {
				resource: ['externalContact'],
				operation: ['externalcontactGetStrategyTagList', 'externalcontactDelStrategyTag'],
			},
		},
		default: '',
		placeholder: 'etXXX,etYYY',
		description: '逗号分隔的标签 id',
	},
	{
		displayName: '标签组ID列表',
		name: 'strategy_group_ids',
		type: 'string',
		displayOptions: {
			show: {
				resource: ['externalContact'],
				operation: ['externalcontactGetStrategyTagList', 'externalcontactDelStrategyTag'],
			},
		},
		default: '',
		placeholder: 'etZZZ,etWWW',
		description: '逗号分隔的标签组 id；删除时与标签 id 不可同时为空',
	},
	{
		displayName: '关注模式',
		name: 'subscribe_mode',
		type: 'options',
		displayOptions: {
			show: {
				resource: ['externalContact'],
				operation: ['externalcontactSetSubscribeMode'],
			},
		},
		options: [
			{ name: '可扫码填写资料加入', value: 1 },
			{ name: '禁止扫码填写资料加入', value: 2 },
		],
		default: 1,
		description: '家长关注「学校通知」的模式',
	},
	{
		displayName: '企业群发消息ID',
		name: 'msgid',
		type: 'string',
		displayOptions: {
			show: {
				resource: ['externalContact'],
				operation: ['externalcontactGetGroupMsgResult', 'crmGetGroupMsgResult'],
			},
		},
		default: '',
	},
	{
		displayName: '统计开始时间',
		name: 'behavior_start_time',
		type: 'number',
		displayOptions: {
			show: {
				resource: ['externalContact'],
				operation: ['crmGetUserBehaviorData'],
			},
		},
		default: 0,
		description: '开始时间戳（秒）',
	},
	{
		displayName: '统计结束时间',
		name: 'behavior_end_time',
		type: 'number',
		displayOptions: {
			show: {
				resource: ['externalContact'],
				operation: ['crmGetUserBehaviorData'],
			},
		},
		default: 0,
		description: '结束时间戳（秒）',
	},
	{
		displayName: '原添加成员UserID',
		name: 'handover_userid',
		type: 'string',
		displayOptions: {
			show: {
				resource: ['externalContact'],
				operation: ['externalcontactTransfer', 'crmTransferExternalContact'],
			},
		},
		default: '',
		description: '原跟进成员 userid',
	},
	{
		displayName: '接替成员UserID',
		name: 'takeover_userid',
		type: 'string',
		displayOptions: {
			show: {
				resource: ['externalContact'],
				operation: ['externalcontactTransfer', 'crmTransferExternalContact'],
			},
		},
		default: '',
		description: '客户接替成员 userid',
	},
	{
		displayName: '请求体JSON',
		name: 'requestBody',
		type: 'json',
		displayOptions: {
			show: { resource: ['externalContact'], operation: externalContactExtraHttpOpsOptionValues },
		},
		default: '{}',
		description: '其余字段与上方合并，同名字段以 JSON 为准',
	},
	{
		displayName: 'Query参数JSON',
		name: 'requestQuery',
		type: 'json',
		displayOptions: {
			show: { resource: ['externalContact'], operation: externalContactExtraHttpOpsOptionValues },
		},
		default: '{}',
		description: 'URL 查询参数（访问凭证自动附加）',
	},
];
