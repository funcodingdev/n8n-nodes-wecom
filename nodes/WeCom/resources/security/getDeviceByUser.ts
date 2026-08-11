import type { INodeProperties } from 'n8n-workflow';

export const getDeviceByUserDescription: INodeProperties[] = [
	{
		displayName: '成员',
		name: 'last_login_userid',
		type: 'options',
		required: true,
		displayOptions: {
			show: {
				resource: ['security'],
				operation: ['getDeviceByUser'],
			},
		},
		description: '选择要查询设备的成员',
		typeOptions: {
			loadOptionsMethod: 'getAllUsers',
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
				operation: ['getDeviceByUser'],
			},
		},
		description: '查询设备类型',
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
];
