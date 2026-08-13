import type { INodeProperties } from 'n8n-workflow';

export const getDeviceByUserDescription: INodeProperties[] = [
	{
		displayName: '成员UserID',
		name: 'last_login_userid',
		type: 'string',
				displayOptions: {
			show: {
				resource: ['security'],
				operation: ['getDeviceByUser'],
			},
		},
		description: '要查询设备的成员 UserID；可与下方选择二选一',
		placeholder: 'zhangsan',
		default: '',
	},
	{
		displayName: '成员(选择)',
		name: 'last_login_userid_selected',
		type: 'options',
		typeOptions: { loadOptionsMethod: 'getAllUsers' },
		default: '',
		displayOptions: {
			show: {
				resource: ['security'],
				operation: ['getDeviceByUser'],
			},
		},
		description: '与上方字符串二选一；均填写时以字符串为准',
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
