import type { INodeProperties } from 'n8n-workflow';

export const getScreenOperRecordDescription: INodeProperties[] = [
	{
		displayName: '开始时间',
		name: 'start_time',
		type: 'dateTime',
		required: true,
		displayOptions: {
			show: {
				resource: ['security'],
				operation: ['getScreenOperRecord'],
			},
		},
		default: '',
		description: '开始时间（Unix时间戳，秒）',
	},
	{
		displayName: '结束时间',
		name: 'end_time',
		type: 'dateTime',
		required: true,
		displayOptions: {
			show: {
				resource: ['security'],
				operation: ['getScreenOperRecord'],
			},
		},
		default: '',
		description: '结束时间（Unix时间戳，秒），开始时间到结束时间的范围不能超过14天',
	},
	{
		displayName: '用户UserID列表',
		name: 'userid_list_text',
		type: 'string',
		displayOptions: {
			show: {
				resource: ['security'],
				operation: ['getScreenOperRecord'],
			},
		},
		default: '',
		placeholder: 'zhangsan,lisi',
		description: '逗号分隔；与下方选择合并，单次最多 100 个；需在应用可见范围内',
	},
	{
		displayName: '用户(选择)',
		name: 'userid_list',
		type: 'multiOptions',
		displayOptions: {
			show: {
				resource: ['security'],
				operation: ['getScreenOperRecord'],
			},
		},
		typeOptions: {
			loadOptionsMethod: 'getAllUsers',
		},
		default: [],
		description: '截屏操作者，与上方列表合并，单次最多 100 个',
	},
	{
		displayName: '部门ID列表',
		name: 'department_id_list',
		type: 'string',
		displayOptions: {
			show: {
				resource: ['security'],
				operation: ['getScreenOperRecord'],
			},
		},
		default: '',
		placeholder: '1,2,3',
		description: '逗号分隔 department_id，单次最多 100 个；需在应用可见范围内',
	},
	{
		displayName: '截屏内容类型',
		name: 'screen_shot_type',
		type: 'options',

		displayOptions: {
			show: {
				resource: ['security'],
				operation: ['getScreenOperRecord'],
			},
		},
		description: '截屏内容的类型，不设置默认为全部',
		options: [
			{ name: '全部', value: 0 },
			{ name: '聊天', value: 1 },
			{ name: '通讯录', value: 2 },
			{ name: '邮件', value: 3 },
			{ name: '文件', value: 4 },
			{ name: '日程', value: 5 },
			{ name: '其他', value: 6 },
		],
		default: 0,
	},
	{
		displayName: '游标',
		name: 'cursor',
		type: 'string',

		displayOptions: {
			show: {
				resource: ['security'],
				operation: ['getScreenOperRecord'],
			},
		},
		default: '',
		description: '由企业微信后台返回，第一次调用可不填。用于分页查询',
	},
	{
		displayName: '限制条数',
		name: 'limit',
		type: 'number',

		displayOptions: {
			show: {
				resource: ['security'],
				operation: ['getScreenOperRecord'],
			},
		},
		default: 100,
		description: '限制返回的条数，最多设置为1000',
		typeOptions: {
			minValue: 1,
			maxValue: 1000,
		},
	},
];
