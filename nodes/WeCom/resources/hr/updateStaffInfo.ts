import type { INodeProperties } from 'n8n-workflow';

const showOnly = { resource: ['hr'], operation: ['updateStaffInfo'] };

export const updateStaffInfoDescription: INodeProperties[] = [
	{
		displayName: '成员UserID',
		name: 'userid',
		type: 'string',
		required: true,
		displayOptions: { show: showOnly },
		default: '',
		placeholder: 'zhangsan',
		description: '要更新信息的员工UserID',
	},
	{
		displayName: '更新字段',
		name: 'fieldsCollection',
		type: 'fixedCollection',
		required: true,
		displayOptions: { show: showOnly },
		default: {},
		placeholder: '添加字段',
		typeOptions: { multipleValues: true },
		description: '要更新的字段列表。字段ID可通过获取字段列表接口获取',
		options: [
			{
				displayName: '字段',
				name: 'fields',
				values: [
					{
						displayName: '字段ID',
						name: 'fieldid',
						type: 'string',
						default: '',
						required: true,
						description: '字段的唯一标识ID',
						placeholder: 'field_id_1',
					},
					{
						displayName: '字段值类型',
						name: 'value_type',
						type: 'options',
						default: 'text',
						options: [
							{ name: '文本', value: 'text', description: '文本类型的字段值' },
							{ name: '日期', value: 'date', description: '日期类型的字段值（时间戳）' },
							{ name: '数字', value: 'number', description: '数字类型的字段值' },
						],
						description: '字段值的类型',
					},
					{
						displayName: '文本值',
						name: 'value_text',
						type: 'string',
						default: '',
						displayOptions: { show: { value_type: ['text'] } },
						description: '文本类型的字段值',
						placeholder: '张三',
					},
					{
						displayName: '日期值',
						name: 'value_date',
						type: 'dateTime',
						default: '',
						displayOptions: { show: { value_type: ['date'] } },
						description: '日期类型字段值，转换为 Unix 秒写入 value_uint32',
					},
					{
						displayName: '数字值',
						name: 'value_number',
						type: 'number',
						default: 0,
						displayOptions: { show: { value_type: ['number'] } },
						description: '数字类型的字段值',
					},
				],
			},
		],
	},
];
