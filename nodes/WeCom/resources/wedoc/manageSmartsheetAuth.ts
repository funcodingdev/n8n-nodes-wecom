import type { INodeProperties } from 'n8n-workflow';

const showOnly = { resource: ['wedoc'], operation: ['manageSmartsheetAuth'] };

/**
 * 简化版「更新全员权限下某个子表的内容权限」。
 * 完整字段级/额外成员规则请用「更新子表内容权限」「创建额外权限规则」等操作。
 * 官方：https://developer.work.weixin.qq.com/document/path/99935
 */
export const manageSmartsheetAuthDescription: INodeProperties[] = [
	{
		displayName: '本操作对应 update_sheet_priv 的简化场景（默认改全员权限下单子表）。细粒度字段/记录规则请使用「更新子表内容权限」。',
		name: 'manageAuthNotice',
		type: 'notice',
		displayOptions: { show: showOnly },
		default: '',
	},
	{
		displayName: '文档ID',
		name: 'docid',
		type: 'string',
		required: true,
		displayOptions: { show: showOnly },
		default: '',
		description: '智能表格 docid',
	},
	{
		displayName: '子表ID',
		name: 'sheet_id',
		type: 'string',
		required: true,
		displayOptions: { show: showOnly },
		default: '',
		description: '子表 sheet_id',
	},
	{
		displayName: '权限规则类型',
		name: 'manage_priv_type',
		type: 'options',
		displayOptions: { show: showOnly },
		options: [
			{ name: '全员权限', value: 1 },
			{ name: '额外权限', value: 2 },
		],
		default: 1,
		description: 'type：1 全员，2 额外（额外时需填规则 ID）',
	},
	{
		displayName: '规则ID',
		name: 'manage_rule_id',
		type: 'number',
		displayOptions: {
			show: { ...showOnly, manage_priv_type: [2] },
		},
		default: 0,
		description: '额外权限 rule_id',
	},
	{
		displayName: '子表权限级别',
		name: 'sheet_priv_level',
		type: 'options',
		displayOptions: { show: showOnly },
		options: [
			{ name: '全部权限', value: 1 },
			{ name: '可编辑', value: 2 },
			{ name: '仅浏览', value: 3 },
			{ name: '无权限', value: 4 },
		],
		default: 2,
		description: 'priv_list[].priv',
	},
	{
		displayName: '可新增记录',
		name: 'can_insert_record',
		type: 'boolean',
		displayOptions: {
			show: { ...showOnly, sheet_priv_level: [2] },
		},
		default: true,
	},
	{
		displayName: '可删除记录',
		name: 'can_delete_record',
		type: 'boolean',
		displayOptions: {
			show: { ...showOnly, sheet_priv_level: [2] },
		},
		default: true,
	},
	{
		displayName: '可增删改视图',
		name: 'can_create_modify_delete_view',
		type: 'boolean',
		displayOptions: {
			show: { ...showOnly, sheet_priv_level: [1, 2, 3] },
		},
		default: true,
	},
	{
		displayName: '记录生效范围',
		name: 'record_range_type',
		type: 'options',
		displayOptions: {
			show: { ...showOnly, sheet_priv_level: [2, 3] },
		},
		options: [
			{ name: '全部记录', value: 1 },
			{ name: '满足任意条件', value: 2 },
			{ name: '满足全部条件', value: 3 },
		],
		default: 1,
		description: 'record_priv.record_range_type',
	},
	{
		displayName: '扩展JSON',
		name: 'manageAuthExtraJson',
		type: 'json',
		displayOptions: { show: showOnly },
		default: '{}',
		description:
			'其余 update_sheet_priv 字段，与上方合并（JSON 优先）；最终请求仍会校验子表权限与记录生效范围',
	},
];
