import type { INodeProperties } from 'n8n-workflow';

export const importDeviceDescription: INodeProperties[] = [
	{
		displayName: '设备列表',
		name: 'device_list',
		type: 'fixedCollection',
		required: true,
		displayOptions: {
			show: {
				resource: ['security'],
				operation: ['importDevice'],
			},
		},
		typeOptions: {
			multipleValues: true,
		},
		description: '要导入的可信企业设备列表，每次最多导入100条',
		default: {},
		options: [
			{
				displayName: '设备',
				name: 'device',
				placeholder: '添加设备',
				type: 'collection',
				default: {},
				values: [
					{
						displayName: '系统类型',
						name: 'system',
						type: 'options',

						description: '设备的类型',
						options: [
							{
								name: 'Windows',
								value: 'Windows',
								description: 'Windows操作系统',
							},
							{
								name: 'Mac',
								value: 'Mac',
								description: 'Mac操作系统',
							},
						],
						default: 'Windows',
					},
					{
						displayName: 'MAC地址列表',
						name: 'mac_addr',
						type: 'string',
						typeOptions: {
							multipleValues: true,
						},
						required: true,
						placeholder: '50:81:40:29:33:CA',
						description: '设备MAC地址列表，Windows设备必填；与下方 JSON 合并，每个设备最多100个',
						default: [],
						displayOptions: {
							show: {
								system: ['Windows'],
							},
						},
					},
					{
						displayName: 'MAC地址列表',
						name: 'mac_addr',
						type: 'string',
						typeOptions: {
							multipleValues: true,
						},
						placeholder: '81:40:50:29:33:DB',
						description: '设备MAC地址列表，Mac设备选填；与下方 JSON 合并，每个设备最多100个',
						default: [],
						displayOptions: {
							show: {
								system: ['Mac'],
							},
						},
					},
					{
						displayName: 'MAC地址列表 JSON',
						name: 'mac_addr_json',
						type: 'json',
						default: '[]',
						description:
							'可选。非空数组时与上方 MAC 列表合并去重。支持 ["50:81:40:29:33:CA"] 或 [{"mac":"..."}]',
					},
					{
						displayName: '主板UUID',
						name: 'motherboard_uuid',
						type: 'string',

						placeholder: 'MB_UUID',
						description: '主板UUID，Windows设备可选填',
						default: '',
						displayOptions: {
							show: {
								system: ['Windows'],
							},
						},
					},
					{
						displayName: '硬盘序列号列表',
						name: 'harddisk_uuid',
						type: 'string',
						typeOptions: {
							multipleValues: true,
						},
						placeholder: 'HD_UUID1',
						description: '硬盘序列号列表，Windows设备可选填；与下方 JSON 合并，每个设备最多100个',
						default: [],
						displayOptions: {
							show: {
								system: ['Windows'],
							},
						},
					},
					{
						displayName: '硬盘序列号列表 JSON',
						name: 'harddisk_uuid_json',
						type: 'json',
						default: '[]',
						displayOptions: {
							show: {
								system: ['Windows'],
							},
						},
						description:
							'可选。非空数组时与上方列表合并去重。支持 ["HD1"] 或 [{"uuid":"HD1"}]',
					},
					{
						displayName: 'Windows域名',
						name: 'domain',
						type: 'string',

						placeholder: 'WINDOWS_DOMAIN',
						description: 'Windows域名，Windows设备可选填',
						default: '',
						displayOptions: {
							show: {
								system: ['Windows'],
							},
						},
					},
					{
						displayName: '计算机名',
						name: 'pc_name',
						type: 'string',

						placeholder: 'PC_001',
						description: 'Windows计算机名，Windows设备可选填',
						default: '',
						displayOptions: {
							show: {
								system: ['Windows'],
							},
						},
					},
					{
						displayName: 'Mac序列号',
						name: 'seq_no',
						type: 'string',
						required: true,
						placeholder: 'SEQ_NO',
						description: 'Mac序列号，Mac设备必填',
						default: '',
						displayOptions: {
							show: {
								system: ['Mac'],
							},
						},
					},
				],
			},
		],
	},
	{
		displayName: '设备列表 JSON',
		name: 'deviceListJson',
		type: 'json',
		default: '[]',
		displayOptions: {
			show: {
				resource: ['security'],
				operation: ['importDevice'],
			},
		},
		description:
			'可选。非空数组时覆盖上方设备表单。支持 [{"system":"Windows","mac_addr":["50:81:40:29:33:CA"],"motherboard_uuid":"...","harddisk_uuid":["..."],"domain":"...","pc_name":"..."}] 或 Mac 设备 [{"system":"Mac","seq_no":"...","mac_addr":["..."]}]，1–100 条',
	},
];
