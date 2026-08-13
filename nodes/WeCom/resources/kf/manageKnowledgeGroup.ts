import type { INodeProperties } from 'n8n-workflow';

const showOnly = { resource: ['kf'], operation: ['manageKnowledgeGroup'] };

export const manageKnowledgeGroupDescription: INodeProperties[] = [
	{
		displayName: '权限与数量限制',
		name: 'knowledgeGroupNotice',
		type: 'notice',
		displayOptions: { show: showOnly },
		default: '',
		description: '仅企业内部开发支持知识库管理；第三方及代开发应用暂不支持。分组名不可重复，全部分组最多 100 个。<a href="https://developer.work.weixin.qq.com/document/path/95971" target="_blank">官方文档</a>',
	},
	{
		displayName: '操作类型',
		name: 'action_type',
		type: 'options',
		required: true,
		displayOptions: { show: showOnly },
		options: [
			{ name: '新增分组', value: 'add', description: '创建新的知识库分组' },
			{ name: '删除分组', value: 'del', description: '删除已存在的知识库分组' },
			{ name: '修改分组', value: 'mod', description: '修改知识库分组的名称' },
			{ name: '获取分组列表', value: 'list', description: '查询所有知识库分组' },
		],
		default: 'list',
		description: '选择对知识库分组进行的管理操作',
	},
	// 新增分组参数
	{
		displayName: '分组名称',
		name: 'group_name',
		type: 'string',
		required: true,
		displayOptions: { show: { ...showOnly, action_type: ['add'] } },
		default: '',
		typeOptions: { maxLength: 12 },
		description: '知识库分组名称，不超过 12 个字且不可与现有分组重复',
		placeholder: '产品问题',
	},
	// 删除/修改分组参数
	{
		displayName: '分组 ID',
		name: 'group_id',
		type: 'string',
		required: true,
		displayOptions: { show: { ...showOnly, action_type: ['del', 'mod'] } },
		default: '',
		description: '知识库分组的唯一ID',
	},
	{
		displayName: '默认分组限制',
		name: 'defaultGroupMutationNotice',
		type: 'notice',
		displayOptions: { show: { ...showOnly, action_type: ['del', 'mod'] } },
		default: '',
		description: '系统自动创建的默认分组不可修改或删除；请先通过列表响应中的 is_default 判断。',
	},
	// 修改分组参数
	{
		displayName: '新分组名称',
		name: 'new_group_name',
		type: 'string',
		required: true,
		displayOptions: { show: { ...showOnly, action_type: ['mod'] } },
		default: '',
		typeOptions: { maxLength: 12 },
		description: '新的分组名称，不超过 12 个字且不可与现有分组重复',
	},
	{
		displayName: '分组 ID 筛选',
		name: 'list_group_id',
		type: 'string',
		displayOptions: { show: { ...showOnly, action_type: ['list'] } },
		default: '',
		description: '可选，指定后仅拉取该知识库分组',
	},
	// 列表查询参数
	{
		displayName: '分页游标',
		name: 'cursor',
		type: 'string',
		displayOptions: { show: { ...showOnly, action_type: ['list'] } },
		default: '',
		description: '分页游标，首次请求留空',
	},
	{
		displayName: '每页数量',
		name: 'limit',
		type: 'number',
		displayOptions: { show: { ...showOnly, action_type: ['list'] } },
		default: 500,
		description: '每次拉取的数据量，默认 500，最大 1000',
		typeOptions: { minValue: 1, maxValue: 1000, numberStepSize: 1 },
	},
];
