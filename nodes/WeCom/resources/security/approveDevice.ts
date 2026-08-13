import type { INodeProperties } from 'n8n-workflow';

export const approveDeviceDescription: INodeProperties[] = [
	{
		displayName: '仅能确认状态为 3 或 4 的待管理员确认设备；接口会分别返回成功与失败设备列表。',
		name: 'approveDeviceNotice',
		type: 'notice',
		displayOptions: {
			show: { resource: ['security'], operation: ['approveDevice'] },
		},
		default: '',
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
				operation: ['approveDevice'],
			},
		},
		placeholder: '49nNtYq',
		default: [],
		description: '设备编码列表，仅可确认待管理员通过状态（status为3或4）的设备，每次最多确认100个',
	},
];
