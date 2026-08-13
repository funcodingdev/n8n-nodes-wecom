import type { INodeProperties } from 'n8n-workflow';

const showOnly = { resource: ['hr'], operation: ['updateStaffInfo'] };

export const updateStaffInfoDescription: INodeProperties[] = [
	{
		displayName: '成员UserID',
		name: 'userid',
		type: 'string',
		displayOptions: { show: showOnly },
		default: '',
		placeholder: 'zhangsan',
		description: '要更新信息的员工 UserID；可与下方选择二选一',
	},
	{
		displayName: '成员(选择)',
		name: 'userid_selected',
		type: 'options',
		typeOptions: { loadOptionsMethod: 'getAllUsers' },
		displayOptions: { show: showOnly },
		default: '',
		description: '与上方字符串二选一；均填写时以字符串为准',
	},
	{
		displayName: '更新字段',
		name: 'fieldsCollection',
		type: 'fixedCollection',
		displayOptions: { show: showOnly },
		default: {},
		placeholder: '添加字段',
		typeOptions: { multipleValues: true },
		description: 'update_items；支持更新、增加或清空单个字段',
		options: [
			{
				displayName: '字段',
				name: 'fields',
				values: [
					{
						displayName: '字段ID',
						name: 'fieldid',
						type: 'number',
						required: true,
						default: 1,
						typeOptions: { minValue: 1 },
					},
					{
						displayName: '可重复组下标',
						name: 'sub_idx',
						type: 'number',
						default: 0,
						typeOptions: { minValue: 0 },
					},
					{
						displayName: '清空字段值',
						name: 'clear_value',
						type: 'boolean',
						default: false,
						description: '开启后仅发送 fieldid 和 sub_idx，由接口清空该字段',
					},
					{
						displayName: '字段值类型',
						name: 'value_type',
						type: 'options',
						displayOptions: { show: { clear_value: [false] } },
						options: [
							{ name: '字符串', value: 'string' },
							{ name: '64位非负整数', value: 'uint64' },
							{ name: '32位非负整数/选项', value: 'uint32' },
							{ name: '64位整数', value: 'int64' },
							{ name: '日期时间（写入64位非负整数）', value: 'date' },
							{ name: '电话号码', value: 'mobile' },
						],
						default: 'string',
					},
					{
						displayName: '字符串值',
						name: 'value_text',
						type: 'string',
						displayOptions: { show: { clear_value: [false], value_type: ['string'] } },
						default: '',
					},
					{
						displayName: '整数值',
						name: 'value_number',
						type: 'number',
						displayOptions: {
							show: { clear_value: [false], value_type: ['uint64', 'uint32', 'int64'] },
						},
						default: 0,
					},
					{
						displayName: '日期时间值',
						name: 'value_date',
						type: 'dateTime',
						required: true,
						displayOptions: { show: { clear_value: [false], value_type: ['date'] } },
						default: '',
					},
					{
						displayName: '电话区号',
						name: 'value_country_code',
						type: 'string',
						displayOptions: { show: { clear_value: [false], value_type: ['mobile'] } },
						default: '+86',
					},
					{
						displayName: '电话号码',
						name: 'value_mobile',
						type: 'string',
						displayOptions: { show: { clear_value: [false], value_type: ['mobile'] } },
						default: '',
						description: '留空可清空整个电话号码字段',
					},
				],
			},
		],
	},
	{
		displayName: '删除可重复字段组',
		name: 'removeItemsCollection',
		type: 'fixedCollection',
		displayOptions: { show: showOnly },
		default: {},
		placeholder: '添加要删除的字段组',
		typeOptions: { multipleValues: true },
		description:
			'remove_items；可删除教育经历、工作经历、家庭成员、紧急联系人或合同信息中的整组数据',
		options: [
			{
				displayName: '字段组',
				name: 'items',
				values: [
					{
						displayName: '字段组类型',
						name: 'group_type',
						type: 'options',
						options: [
							{ name: '教育经历', value: 1 },
							{ name: '工作经历', value: 2 },
							{ name: '家庭成员', value: 3 },
							{ name: '紧急联系人', value: 4 },
							{ name: '合同信息', value: 5 },
						],
						default: 1,
					},
					{
						displayName: '字段组下标',
						name: 'sub_idx',
						type: 'number',
						required: true,
						default: 0,
						typeOptions: { minValue: 0 },
					},
				],
			},
		],
	},
	{
		displayName: '插入字段组JSON',
		name: 'insertItemsJson',
		type: 'json',
		displayOptions: { show: showOnly },
		default: '[]',
		description:
			'insert_items 数组。每项包含 group_type 和 item 字段；item 内字段结构与 update_items 相同',
	},
	{
		displayName: '完整请求体JSON',
		name: 'requestBody',
		type: 'json',
		displayOptions: { show: showOnly },
		default: '{}',
		description:
			'复杂更新可填写完整请求体；同名的 update_items、remove_items、insert_items 会覆盖上方表单，成员 UserID 始终使用顶部字段',
	},
];
