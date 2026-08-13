import type { INodeProperties } from 'n8n-workflow';

const showOnly = { resource: ['hr'], operation: ['getStaffInfo'] };

export const getStaffInfoDescription: INodeProperties[] = [
	{
		displayName: '成员UserID',
		name: 'userid',
		type: 'string',
		displayOptions: { show: showOnly },
		default: '',
		placeholder: 'zhangsan',
		description: '要查询的员工 UserID，该员工须在应用可见范围内；可与下方选择二选一',
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
		displayName: '获取全部字段',
		name: 'get_all',
		type: 'boolean',
		displayOptions: { show: showOnly },
		default: true,
		description: '开启时获取全部可读取字段；关闭时必须在下方指定字段及可重复组下标',
	},
	{
		displayName: '指定字段',
		name: 'fieldidsCollection',
		type: 'fixedCollection',
		required: true,
		displayOptions: { show: { ...showOnly, get_all: [false] } },
		default: {},
		placeholder: '添加字段',
		typeOptions: { multipleValues: true },
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
						required: true,
						default: 0,
						typeOptions: { minValue: 0 },
						description:
							'非可重复字段填 0；教育、工作、家庭、紧急联系人、合同等可重复组按实际下标填写',
					},
				],
			},
		],
	},
];
