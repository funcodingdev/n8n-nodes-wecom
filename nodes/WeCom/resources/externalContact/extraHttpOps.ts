import type { INodeProperties } from 'n8n-workflow';
import type { ExtraHttpOp } from '../../shared/extraHttpOp';
import { extraHttpOpOptions } from '../../shared/extraHttpOp';

/** 文档有、此前节点未封装的 externalContact 相关 HTTP 接口（一等操作） */
export const externalContactExtraHttpOps: ExtraHttpOp[] = [
	{ id: 'externalcontactAddStrategyTag', name: '[规则组/策略] 规则组添加企业客户标签', action: '规则组添加企业客户标签', description: '规则组添加企业客户标签', path: '/cgi-bin/externalcontact/add_strategy_tag', method: 'POST' },
	{ id: 'externalcontactConvertToOpenid', name: '[客户联系补全] external_userid转openid', action: 'external_userid转openid', description: 'external_userid转openid', path: '/cgi-bin/externalcontact/convert_to_openid', method: 'POST' },
	{ id: 'externalcontactCustomerStrategyCreate', name: '[规则组/策略] 创建客户规则组', action: '创建客户规则组', description: '创建客户规则组', path: '/cgi-bin/externalcontact/customer_strategy/create', method: 'POST' },
	{ id: 'externalcontactCustomerStrategyDel', name: '[规则组/策略] 删除客户规则组', action: '删除客户规则组', description: '删除客户规则组', path: '/cgi-bin/externalcontact/customer_strategy/del', method: 'POST' },
	{ id: 'externalcontactCustomerStrategyEdit', name: '[规则组/策略] 编辑客户规则组', action: '编辑客户规则组', description: '编辑客户规则组', path: '/cgi-bin/externalcontact/customer_strategy/edit', method: 'POST' },
	{ id: 'externalcontactCustomerStrategyGet', name: '[规则组/策略] 获取客户规则组详情', action: '获取客户规则组详情', description: '获取客户规则组详情', path: '/cgi-bin/externalcontact/customer_strategy/get', method: 'POST' },
	{ id: 'externalcontactCustomerStrategyGetRange', name: '[规则组/策略] 获取规则组管理范围', action: '获取规则组管理范围', description: '获取规则组管理范围', path: '/cgi-bin/externalcontact/customer_strategy/get_range', method: 'POST' },
	{ id: 'externalcontactCustomerStrategyList', name: '[规则组/策略] 获取客户规则组列表', action: '获取客户规则组列表', description: '获取客户规则组列表', path: '/cgi-bin/externalcontact/customer_strategy/list', method: 'POST' },
	{ id: 'externalcontactDelStrategyTag', name: '[规则组/策略] 规则组删除企业客户标签', action: '规则组删除企业客户标签', description: '规则组删除企业客户标签', path: '/cgi-bin/externalcontact/del_strategy_tag', method: 'POST' },
	{ id: 'externalcontactEditStrategyTag', name: '[规则组/策略] 规则组编辑企业客户标签', action: '规则组编辑企业客户标签', description: '规则组编辑企业客户标签', path: '/cgi-bin/externalcontact/edit_strategy_tag', method: 'POST' },
	{ id: 'externalcontactGetGroupMsgResult', name: '[客户联系补全] 获取企业群发成员执行结果(旧)', action: '获取企业群发成员执行结果(旧)', description: '获取企业群发成员执行结果(旧)', path: '/cgi-bin/externalcontact/get_group_msg_result', method: 'POST' },
	{ id: 'externalcontactGetStrategyTagList', name: '[规则组/策略] 获取规则组标签列表', action: '获取规则组标签列表', description: '获取规则组标签列表', path: '/cgi-bin/externalcontact/get_strategy_tag_list', method: 'POST' },
	{ id: 'externalcontactGetSubscribeMode', name: '[订阅号] 获取「联系我」方式', action: '获取「联系我」方式', description: '获取「联系我」方式', path: '/cgi-bin/externalcontact/get_subscribe_mode', method: 'POST' },
	{ id: 'externalcontactGetSubscribeQrCode', name: '[订阅号] 获取「联系我」二维码', action: '获取「联系我」二维码', description: '获取「联系我」二维码', path: '/cgi-bin/externalcontact/get_subscribe_qr_code', method: 'POST' },
	{ id: 'externalcontactSetSubscribeMode', name: '[订阅号] 配置「联系我」方式', action: '配置「联系我」方式', description: '配置「联系我」方式', path: '/cgi-bin/externalcontact/set_subscribe_mode', method: 'POST' },
	{ id: 'externalcontactTransfer', name: '[客户联系补全] 分配在职成员的客户(旧)', action: '分配在职成员的客户(旧)', description: '分配在职成员的客户(旧)', path: '/cgi-bin/externalcontact/transfer', method: 'POST' },
	{ id: 'crmAddMsgTemplate', name: '[客户联系(旧crm)] crm/add_msg_template', action: 'crm/add_msg_template', description: 'crm/add_msg_template', path: '/cgi-bin/crm/add_msg_template', method: 'POST' },
	{ id: 'crmGetCustomerContacts', name: '[客户联系(旧crm)] crm/get_customer_contacts', action: 'crm/get_customer_contacts', description: 'crm/get_customer_contacts', path: '/cgi-bin/crm/get_customer_contacts', method: 'POST' },
	{ id: 'crmGetExternalContact', name: '[客户联系(旧crm)] crm/get_external_contact', action: 'crm/get_external_contact', description: 'crm/get_external_contact', path: '/cgi-bin/crm/get_external_contact', method: 'POST' },
	{ id: 'crmGetExternalContactList', name: '[客户联系(旧crm)] crm/get_external_contact_list', action: 'crm/get_external_contact_list', description: 'crm/get_external_contact_list', path: '/cgi-bin/crm/get_external_contact_list', method: 'POST' },
	{ id: 'crmGetGroupMsgResult', name: '[客户联系(旧crm)] crm/get_group_msg_result', action: 'crm/get_group_msg_result', description: 'crm/get_group_msg_result', path: '/cgi-bin/crm/get_group_msg_result', method: 'POST' },
	{ id: 'crmGetUnassignedList', name: '[客户联系(旧crm)] crm/get_unassigned_list', action: 'crm/get_unassigned_list', description: 'crm/get_unassigned_list', path: '/cgi-bin/crm/get_unassigned_list', method: 'POST' },
	{ id: 'crmGetUserBehaviorData', name: '[客户联系(旧crm)] crm/get_user_behavior_data', action: 'crm/get_user_behavior_data', description: 'crm/get_user_behavior_data', path: '/cgi-bin/crm/get_user_behavior_data', method: 'POST' },
	{ id: 'crmTransferExternalContact', name: '[客户联系(旧crm)] crm/transfer_external_contact', action: 'crm/transfer_external_contact', description: 'crm/transfer_external_contact', path: '/cgi-bin/crm/transfer_external_contact', method: 'POST' },
];

export const externalContactExtraHttpOpsById: Record<string, ExtraHttpOp> = Object.fromEntries(
	externalContactExtraHttpOps.map((o) => [o.id, o]),
);

export const externalContactExtraHttpOpsOptionValues = externalContactExtraHttpOps.map((o) => o.id);

export function getExternalContactExtraHttpOpOptions() {
	return extraHttpOpOptions(externalContactExtraHttpOps);
}

export const externalContactExtraHttpOpsDescription: INodeProperties[] = [
	{
		displayName: '请求体JSON',
		name: 'requestBody',
		type: 'json',
		displayOptions: {
			show: { resource: ['externalContact'], operation: externalContactExtraHttpOpsOptionValues },
		},
		default: '{}',
		description: '请求体 JSON，字段名与企业微信接口文档保持一致；GET 请求可留空',
	},
	{
		displayName: 'Query参数JSON',
		name: 'requestQuery',
		type: 'json',
		displayOptions: {
			show: { resource: ['externalContact'], operation: externalContactExtraHttpOpsOptionValues },
		},
		default: '{}',
		description: 'URL 查询参数（访问凭证会自动附加，无需填写）',
	},
];
