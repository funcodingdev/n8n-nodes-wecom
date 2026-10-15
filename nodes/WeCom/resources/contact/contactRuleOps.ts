import type { IDataObject, IExecuteFunctions, INodeProperties, INodePropertyOptions } from 'n8n-workflow';
import { NodeOperationError } from 'n8n-workflow';
import { weComApiRequest } from '../../shared/transport';

const LIST_SEPARATOR = /[,，|\n\r]+/;

export const contactRuleOperationOptions: INodePropertyOptions[] = [
	{ name: '[查看权限] 读取规则列表', value: 'listContactRules', action: '读取通讯录查看权限规则', description: '读取通讯录隐藏/限制查看规则' },
	{ name: '[查看权限] 创建规则', value: 'createContactRules', action: '创建通讯录查看权限规则', description: '批量创建通讯录隐藏/限制查看规则' },
	{ name: '[查看权限] 修改规则', value: 'updateContactRules', action: '修改通讯录查看权限规则', description: '批量修改通讯录隐藏/限制查看规则' },
	{ name: '[查看权限] 删除规则', value: 'deleteContactRules', action: '删除通讯录查看权限规则', description: '按规则 ID 批量删除' },
];

export const CONTACT_RULE_OPERATIONS = contactRuleOperationOptions.map((option) => option.value as string);

const scopeFields = (prefix: string, label: string, description: string): INodeProperties[] => [
	{
		displayName: `${label}成员`,
		name: `${prefix}_userid`,
		type: 'string',
		default: '',
		placeholder: 'zhangsan,lisi',
		description: `${description}的成员 UserID，多个用逗号分隔，最多 1000 个`,
	},
	{
		displayName: `${label}部门`,
		name: `${prefix}_partyid`,
		type: 'string',
		default: '',
		placeholder: '1,2',
		description: `${description}的部门 ID，多个用逗号分隔，最多 100 个`,
	},
	{
		displayName: `${label}标签`,
		name: `${prefix}_tagid`,
		type: 'string',
		default: '',
		placeholder: '3',
		description: `${description}的标签 ID，多个用逗号分隔，最多 100 个`,
	},
];

export const contactRuleDescription: INodeProperties[] = [
	{
		displayName:
			'通讯录查看权限规则只能使用“通讯录同步”Secret 创建的企业微信 API 凭证调用；创建、修改、删除共用频率限制：每分钟 5 次、每小时 10 次、每天 60 次。',
		name: 'contactRuleNotice',
		type: 'notice',
		displayOptions: { show: { resource: ['contact'], operation: CONTACT_RULE_OPERATIONS } },
		default: '',
	},
	{
		displayName: '规则列表',
		name: 'contactRules',
		type: 'fixedCollection',
		typeOptions: { multipleValues: true },
		required: true,
		displayOptions: { show: { resource: ['contact'], operation: ['createContactRules', 'updateContactRules'] } },
		default: {},
		placeholder: '添加规则',
		description: '单次最多 100 条。<a href="https://developer.work.weixin.qq.com/document/path/101536" target="_blank">官方文档</a>',
		options: [
			{
				name: 'rules',
				displayName: '规则',
				values: [
					{
						displayName: '规则ID',
						name: 'rule_id',
						type: 'number',
						required: true,
						displayOptions: { show: { '/operation': ['updateContactRules'] } },
						typeOptions: { minValue: 1, numberStepSize: 1 },
						default: 1,
						description: '要修改的规则 ID，可通过“读取规则列表”获得',
					},
					{
						displayName: '规则类型',
						name: 'rule_type',
						type: 'options',
						options: [
							{ name: '隐藏部门/成员', value: 1 },
							{ name: '限制查看外部门', value: 2 },
							{ name: '限制查看所有人', value: 3 },
						],
						default: 1,
						description: '修改规则时必须与原规则类型一致，不能变更',
					},
					...scopeFields('range', '目标', '被隐藏或受限'),
					...scopeFields('whitelist', '白名单', '允许查看'),
					...scopeFields('exclude', '排除', '不受限制（仅限制查看外部门/所有人时使用）'),
					{
						displayName: '允许搜索',
						name: 'is_allowed_search',
						type: 'options',
						options: [
							{ name: '不设置', value: '' },
							{ name: '允许', value: true },
							{ name: '不允许', value: false },
						],
						default: '',
						description: '仅限制查看外部门/所有人时使用',
					},
					{
						displayName: '允许会话',
						name: 'is_allowed_conversation',
						type: 'options',
						options: [
							{ name: '不设置', value: '' },
							{ name: '允许', value: true },
							{ name: '不允许', value: false },
						],
						default: '',
						description: '仅限制查看外部门/所有人时使用',
					},
				],
			},
		],
	},
	{
		displayName: '规则ID列表',
		name: 'rule_ids',
		type: 'string',
		required: true,
		displayOptions: { show: { resource: ['contact'], operation: ['deleteContactRules'] } },
		default: '',
		placeholder: '10001,10002',
		description: '多个规则 ID 用逗号分隔，最多 100 个',
	},
];

function fail(context: IExecuteFunctions, message: string, itemIndex: number): never {
	throw new NodeOperationError(context.getNode(), message, { itemIndex });
}

function list(
	context: IExecuteFunctions,
	value: unknown,
	label: string,
	itemIndex: number,
	maximum: number,
	numeric: boolean,
): Array<string | number> {
	const values = [...new Set(String(value ?? '').split(LIST_SEPARATOR).map((v) => v.trim()).filter(Boolean))];
	if (values.length > maximum) fail(context, `${label}最多 ${maximum} 个`, itemIndex);
	if (!numeric) return values;
	return values.map((v) => {
		if (!/^\d+$/.test(v)) fail(context, `${label}必须是正整数，无效值：${v}`, itemIndex);
		return Number(v);
	});
}

function scope(context: IExecuteFunctions, rule: IDataObject, prefix: string, label: string, itemIndex: number): IDataObject | undefined {
	const userid = list(context, rule[`${prefix}_userid`], `${label}成员`, itemIndex, 1000, false);
	const partyid = list(context, rule[`${prefix}_partyid`], `${label}部门`, itemIndex, 100, true);
	const tagid = list(context, rule[`${prefix}_tagid`], `${label}标签`, itemIndex, 100, true);
	if (!userid.length && !partyid.length && !tagid.length) return undefined;
	return { userid, partyid, tagid };
}

/**
 * 通讯录查看权限管理
 * 官方文档：https://developer.work.weixin.qq.com/document/path/101536
 */
export async function executeContactRuleOperation(
	this: IExecuteFunctions,
	operation: string,
	i: number,
): Promise<IDataObject> {
	if (operation === 'listContactRules') {
		return await weComApiRequest.call(this, 'POST', '/cgi-bin/contactrule/list', {});
	}
	if (operation === 'deleteContactRules') {
		const rule_ids = list(this, this.getNodeParameter('rule_ids', i), '规则 ID 列表', i, 100, true);
		if (!rule_ids.length) fail(this, '规则 ID 列表不能为空', i);
		return await weComApiRequest.call(this, 'POST', '/cgi-bin/contactrule/delete', { rule_ids });
	}

	const collection = this.getNodeParameter('contactRules', i, {}) as IDataObject;
	const rawRules = Array.isArray(collection.rules) ? collection.rules as IDataObject[] : [];
	if (!rawRules.length) fail(this, '请至少添加一条规则', i);
	if (rawRules.length > 100) fail(this, '单次最多提交 100 条规则', i);
	const rules = rawRules.map((rule, index) => {
		const range = scope(this, rule, 'range', '目标', i);
		if (!range) fail(this, `第 ${index + 1} 条规则的目标范围不能为空`, i);
		const body: IDataObject = { rule_type: Number(rule.rule_type ?? 1), range };
		if (operation === 'updateContactRules') body.rule_id = Number(rule.rule_id);
		const whitelist = scope(this, rule, 'whitelist', '白名单', i);
		if (whitelist) body.whitelist = whitelist;
		const exclude = scope(this, rule, 'exclude', '排除', i);
		if (exclude) body.exclude = exclude;
		if (typeof rule.is_allowed_search === 'boolean') body.is_allowed_search = rule.is_allowed_search;
		if (typeof rule.is_allowed_conversation === 'boolean') body.is_allowed_conversation = rule.is_allowed_conversation;
		return body;
	});
	return await weComApiRequest.call(
		this,
		'POST',
		operation === 'createContactRules' ? '/cgi-bin/contactrule/create' : '/cgi-bin/contactrule/update',
		{ rules },
	);
}
