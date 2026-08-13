import type { INodeProperties } from 'n8n-workflow';

export const deleteDeviceDescription: INodeProperties[] = [
	{
		displayName: '删除设备会立即移除其当前可信或申请状态，请先确认设备类型和编码列表。',
		name: 'deleteDeviceNotice',
		type: 'notice',
		displayOptions: {
			show: { resource: ['security'], operation: ['deleteDevice'] },
		},
		default: '',
	},
	{
		displayName: '设备类型',
		name: 'type',
		type: 'options',
		required: true,
		displayOptions: {
			show: {
				resource: ['security'],
				operation: ['deleteDevice'],
			},
		},
		description: '删除设备类型',
		options: [
			{
				name: '可信企业设备',
				value: 1,
				description: '企业内可信的设备',
			},
			{
				name: '未知设备',
				value: 2,
				description: '尚未确认的设备',
			},
			{
				name: '可信个人设备',
				value: 3,
				description: '个人可信的设备',
			},
		],
		default: 1,
	},
	{
		displayName: '设备编码列表',
		name: 'device_code_list',
		type: 'string',
		typeOptions: {
			multipleValues: true,
		},
		required: true,
		displayOptions: {
			show: {
				resource: ['security'],
				operation: ['deleteDevice'],
			},
		},
		placeholder: '49nNtYq',
		default: [],
		description: '设备编码列表；与下方 JSON 合并去重，每次最多删除100个设备',
	},
	{
		displayName: '设备编码列表 JSON',
		name: 'deviceCodeListJson',
		type: 'json',
		displayOptions: {
			show: {
				resource: ['security'],
				operation: ['deleteDevice'],
			},
		},
		default: '[]',
		description:
			'可选。非空数组时与上方列表合并去重。支持 ["code1"] 或 [{"device_code":"code1"}]',
	},
];
