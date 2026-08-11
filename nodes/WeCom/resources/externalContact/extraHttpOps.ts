import type { INodeProperties } from 'n8n-workflow';
import type { ExtraHttpOp } from '../../shared/extraHttpOp';
import { extraHttpOpOptions } from '../../shared/extraHttpOp';

/** 客户联系补全接口（规则组 / 订阅号 / 旧版 crm） */
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
	{ id: 'externalcontactGetSubscribeMode', name: '[订阅号] 获取「联系我」方式', action: '获取联系我方式', description: '获取「联系我」方式', path: '/cgi-bin/externalcontact/get_subscribe_mode', method: 'POST' },
	{ id: 'externalcontactGetSubscribeQrCode', name: '[订阅号] 获取「联系我」二维码', action: '获取联系我二维码', description: '获取「联系我」二维码', path: '/cgi-bin/externalcontact/get_subscribe_qr_code', method: 'POST' },
	{ id: 'externalcontactSetSubscribeMode', name: '[订阅号] 配置「联系我」方式', action: '配置联系我方式', description: '配置「联系我」方式', path: '/cgi-bin/externalcontact/set_subscribe_mode', method: 'POST' },
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
	'externalcontactEditStrategyTag',
	'externalcontactGetStrategyTagList',
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
		description: '企业成员 userid',
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
		displayName: '请求体JSON',
		name: 'requestBody',
		type: 'json',
		displayOptions: {
			show: { resource: ['externalContact'], operation: externalContactExtraHttpOpsOptionValues },
		},
		default: '{}',
		description: '其余字段与上方合并，JSON 优先；规则组详情、标签结构等写在这里',
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
