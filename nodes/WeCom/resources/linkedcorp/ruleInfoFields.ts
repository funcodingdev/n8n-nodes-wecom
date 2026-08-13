import type { INodeProperties } from 'n8n-workflow';

export function ruleInfoFields(
	operation: 'addChainRule' | 'updateChainRule',
): INodeProperties[] {
	const showOnly = { resource: ['linkedcorp'], operation: [operation] };
	return [
		{
			displayName: '规则输入方式',
			name: 'rule_info_input_mode',
			type: 'options',
			displayOptions: { show: showOnly },
			options: [
				{ name: '表单', value: 'form' },
				{ name: 'JSON', value: 'json' },
			],
			default: 'form',
		},
		{
			displayName: '上游部门 ID 列表',
			name: 'owner_departmentids',
			type: 'string',
			displayOptions: { show: { ...showOnly, rule_info_input_mode: ['form'] } },
			default: '',
			description: '与上游成员 ID 列表至少填写一项；与下方选择合并；支持逗号、竖线或换行分隔',
		},
		{
			displayName: '上游部门(选择)',
			name: 'owner_departmentids_selected',
			type: 'multiOptions',
			typeOptions: { loadOptionsMethod: 'getDepartments' },
			displayOptions: { show: { ...showOnly, rule_info_input_mode: ['form'] } },
			default: [],
			description: '与上方上游部门列表合并去重',
		},
		{
			displayName: '上游成员 ID 列表',
			name: 'owner_userids',
			type: 'string',
			displayOptions: { show: { ...showOnly, rule_info_input_mode: ['form'] } },
			default: '',
			description: '与上游部门 ID 列表至少填写一项；与下方选择合并；支持逗号、竖线或换行分隔',
		},
		{
			displayName: '上游成员(选择)',
			name: 'owner_userids_selected',
			type: 'multiOptions',
			typeOptions: { loadOptionsMethod: 'getAllUsers' },
			displayOptions: { show: { ...showOnly, rule_info_input_mode: ['form'] } },
			default: [],
			description: '与上方上游成员列表合并去重',
		},
		{
			displayName: '上游成员 JSON',
			name: 'ownerUseridsJson',
			type: 'json',
			displayOptions: { show: { ...showOnly, rule_info_input_mode: ['form'] } },
			default: '[]',
			description:
				'可选。非空数组时与上方列表/选择合并去重。支持 ["userid1"] 或 [{"userid":"userid1"}]',
		},
		{
			displayName: '下游分组 ID 列表',
			name: 'member_groupids',
			type: 'string',
			displayOptions: { show: { ...showOnly, rule_info_input_mode: ['form'] } },
			default: '',
			description: '与下游企业 CorpID 列表至少填写一项；支持逗号、竖线或换行分隔',
		},
		{
			displayName: '下游企业 CorpID 列表',
			name: 'member_corpids',
			type: 'string',
			displayOptions: { show: { ...showOnly, rule_info_input_mode: ['form'] } },
			default: '',
			description: '与下游分组 ID 列表至少填写一项；支持逗号、竖线或换行分隔',
		},
		{
			displayName: '规则详情 JSON',
			name: 'rule_info_json',
			type: 'json',
			required: true,
			displayOptions: { show: { ...showOnly, rule_info_input_mode: ['json'] } },
			default: '{}',
			description: '填写企业微信 rule_info 对象',
		},
	];
}
