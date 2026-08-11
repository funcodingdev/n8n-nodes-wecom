import type { INodeProperties } from 'n8n-workflow';

const showOnlyForSubmitApproval = {
	resource: ['approval'],
	operation: ['submitApproval'],
};

export const submitApprovalDescription: INodeProperties[] = [
	{
		displayName: '申请人UserID',
		name: 'creator_userid',
		type: 'string',
		required: true,
		displayOptions: { show: showOnlyForSubmitApproval },
		default: '',
		description: 'creator_userid，申请人需在应用可见范围内',
	},
	{
		displayName: '审批模板ID',
		name: 'template_id',
		type: 'string',
		required: true,
		displayOptions: { show: showOnlyForSubmitApproval },
		default: '',
		description: 'template_id',
	},
	{
		displayName: '审批人模式',
		name: 'use_template_approver',
		type: 'options',
		required: true,
		displayOptions: { show: showOnlyForSubmitApproval },
		options: [
			{ name: '接口指定审批人/抄送人 (process 必填)', value: 0 },
			{ name: '使用模板后台审批流程', value: 1 },
		],
		default: 1,
		description: 'use_template_approver',
	},
	{
		displayName: '提单部门ID',
		name: 'choose_department',
		type: 'number',
		displayOptions: { show: showOnlyForSubmitApproval },
		default: 0,
		description: 'choose_department，不填默认为主部门',
	},
	{
		displayName: '申请表单数据JSON',
		name: 'apply_data_json',
		type: 'json',
		required: true,
		displayOptions: { show: showOnlyForSubmitApproval },
		default:
			'{\n  "contents": [\n    {\n      "control": "Text",\n      "id": "Text-1",\n      "value": {\n        "text": "填写内容"\n      }\n    }\n  ]\n}',
		description: 'apply_data，控件 id/value 与模板详情一致',
	},
	{
		displayName: '摘要行',
		name: 'summaryLines',
		type: 'fixedCollection',
		displayOptions: { show: showOnlyForSubmitApproval },
		default: {},
		placeholder: '添加摘要行',
		typeOptions: { multipleValues: true },
		description: 'summary_list，最多 3 行，每行不超过 20 字',
		options: [
			{
				displayName: '摘要',
				name: 'lines',
				values: [
					{
						displayName: '摘要文字',
						name: 'text',
						type: 'string',
						default: '',
					},
					{
						displayName: '语言',
						name: 'lang',
						type: 'options',
						options: [
							{ name: '中文 zh_CN', value: 'zh_CN' },
							{ name: '英文 en', value: 'en' },
						],
						default: 'zh_CN',
					},
				],
			},
		],
	},
	{
		displayName: '审批流程节点',
		name: 'processNodeCollection',
		type: 'fixedCollection',
		displayOptions: {
			show: { ...showOnlyForSubmitApproval, use_template_approver: [0] },
		},
		default: {},
		placeholder: '添加节点',
		typeOptions: { multipleValues: true },
		description: 'process.node_list；use_template_approver=0 时必填',
		options: [
			{
				displayName: '节点',
				name: 'nodes',
				values: [
					{
						displayName: '节点类型',
						name: 'type',
						type: 'options',
						options: [
							{ name: '审批人', value: 1 },
							{ name: '抄送人', value: 2 },
							{ name: '办理人', value: 3 },
						],
						default: 1,
					},
					{
						displayName: '多人审批方式',
						name: 'apv_rel',
						type: 'options',
						options: [
							{ name: '会签', value: 1 },
							{ name: '或签', value: 2 },
							{ name: '依次审批', value: 3 },
						],
						default: 1,
						description: 'type 为审批人/办理人时有效',
					},
					{
						displayName: '成员UserID列表',
						name: 'userid_list',
						type: 'string',
						default: '',
						placeholder: 'user1,user2',
						description: '逗号分隔',
					},
				],
			},
		],
	},
	{
		displayName: '扩展请求JSON',
		name: 'approvalExtraJson',
		type: 'json',
		displayOptions: { show: showOnlyForSubmitApproval },
		default: '{}',
		description: '其余字段与上方合并，同名字段以 JSON 为准',
	},
];
