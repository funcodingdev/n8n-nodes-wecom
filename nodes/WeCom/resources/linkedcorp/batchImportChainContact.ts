import type { INodeProperties } from 'n8n-workflow';

const showOnly = { resource: ['linkedcorp'], operation: ['batchImportChainContact'] };

export const batchImportChainContactDescription: INodeProperties[] = [
	{
		displayName: '上下游 ID',
		name: 'chain_id',
		type: 'string',
		required: true,
		displayOptions: { show: showOnly },
		default: '',
	},
	{
		displayName: '输入方式',
		name: 'contact_input_mode',
		type: 'options',
		displayOptions: { show: showOnly },
		options: [
			{ name: '表单', value: 'form' },
			{ name: 'JSON', value: 'json' },
		],
		default: 'form',
	},
	{
		displayName: '上下游企业',
		name: 'contact_list',
		type: 'fixedCollection',
		typeOptions: { multipleValues: true },
		required: true,
		displayOptions: { show: { ...showOnly, contact_input_mode: ['form'] } },
		default: {},
		placeholder: '添加企业',
		options: [
			{
				displayName: '企业',
				name: 'companies',
				values: [
					{
						displayName: '企业名称',
						name: 'corp_name',
						type: 'string',
						required: true,
						default: '',
						description: '1～32 个 UTF-8 字符；支持中文、字母、数字及空格、-_()（）',
					},
					{
						displayName: '分组路径',
						name: 'group_path',
						type: 'string',
						default: '',
						placeholder: '华北区/北京市/海淀区',
					},
					{
						displayName: '企业自定义 ID',
						name: 'custom_id',
						type: 'string',
						default: '',
						description: '可选；最长 64 字节，仅支持字母和数字',
					},
					{
						displayName: '联系人',
						name: 'contact_info_list',
						type: 'fixedCollection',
						typeOptions: { multipleValues: true },
						required: true,
						default: {},
						placeholder: '添加联系人',
						options: [
							{
								displayName: '联系人',
								name: 'contacts',
								values: [
									{ displayName: '姓名', name: 'name', type: 'string', required: true, default: '', description: '1～32 个 UTF-8 字符' },
									{ displayName: '身份', name: 'identity_type', type: 'options', options: [{ name: '成员', value: 1 }, { name: '负责人', value: 2 }], default: 1 },
									{ displayName: '手机号', name: 'mobile', type: 'string', required: true, default: '', placeholder: '+85259123456' },
									{ displayName: '成员自定义 ID', name: 'user_custom_id', type: 'string', default: '', description: '可选；1～2^64-2 的十进制整数，不得有前导 0，且不得为 11 或 13 位' },
								],
							},
						],
					},
				],
			},
		],
	},
	{
		displayName: '联系人列表 JSON',
		name: 'contact_list_json',
		type: 'json',
		required: true,
		displayOptions: { show: { ...showOnly, contact_input_mode: ['json'] } },
		default: '[]',
		description: '填写企业微信 contact_list 数组，不要包含外层 chain_id',
	},
];
