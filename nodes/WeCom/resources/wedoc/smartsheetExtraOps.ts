import type { INodeProperties } from 'n8n-workflow';

const show = (ops: string[]) => ({
	show: { resource: ['wedoc'], operation: ops },
});

/** 智能表格 content_priv + 字段编组 */
export const smartsheetExtraOpsDescription: INodeProperties[] = [
	{
		displayName: '文档ID',
		name: 'docid',
		type: 'string',
		required: true,
		displayOptions: show([
			'getSheetPriv',
			'createPrivRule',
			'deletePrivRule',
			'modPrivRuleMember',
			'addFieldGroup',
			'updateFieldGroup',
			'deleteFieldGroups',
			'getFieldGroups',
		]),
		default: '',
	},
	{
		displayName: '权限类型',
		name: 'priv_type',
		type: 'options',
		required: true,
		displayOptions: show(['getSheetPriv']),
		options: [
			{ name: '全员权限', value: 1 },
			{ name: '额外权限', value: 2 },
		],
		default: 1,
		description: 'type：1 全员，2 额外',
	},
	{
		displayName: '规则ID列表',
		name: 'rule_id_list',
		type: 'string',
		displayOptions: show(['getSheetPriv', 'deletePrivRule']),
		default: '',
		description: '逗号分隔 rule_id，查询额外权限或删除时使用',
	},
	{
		displayName: '规则名称',
		name: 'rule_name',
		type: 'string',
		displayOptions: show(['createPrivRule']),
		default: '',
		description: 'create_rule 的 name',
	},
	{
		displayName: '规则扩展JSON',
		name: 'privRuleJson',
		type: 'json',
		displayOptions: show(['createPrivRule', 'modPrivRuleMember', 'updateSheetPrivFull']),
		default: '{}',
		description: '额外请求字段，按文档填写（如成员、权限明细等）',
	},
	{
		displayName: '子表ID',
		name: 'sheet_id',
		type: 'string',
		required: true,
		displayOptions: show(['addFieldGroup', 'updateFieldGroup', 'deleteFieldGroups', 'getFieldGroups']),
		default: '',
	},
	{
		displayName: '编组名称',
		name: 'group_name',
		type: 'string',
		displayOptions: show(['addFieldGroup', 'updateFieldGroup']),
		default: '',
	},
	{
		displayName: '编组ID',
		name: 'group_id',
		type: 'string',
		displayOptions: show(['updateFieldGroup', 'deleteFieldGroups']),
		default: '',
		description: 'update 时必填；delete 可填多个逗号分隔',
	},
	{
		displayName: '字段ID列表',
		name: 'field_ids',
		type: 'string',
		displayOptions: show(['addFieldGroup', 'updateFieldGroup']),
		default: '',
		description: 'children.field_id，逗号分隔',
	},
];
