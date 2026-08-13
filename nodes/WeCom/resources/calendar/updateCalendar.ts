import type { INodeProperties } from 'n8n-workflow';

const showOnlyForUpdate = {
	resource: ['calendar'],
	operation: ['updateCalendar'],
};

export const updateCalendarDescription: INodeProperties[] = [
	{
		displayName: '日历ID',
		name: 'cal_id',
		type: 'string',
		required: true,
		displayOptions: {
			show: showOnlyForUpdate,
		},
		default: '',
		description: '要更新的日历唯一标识ID',
	},
	{
		displayName: '日历标题',
		name: 'summary',
		type: 'string',
		required: true,
		displayOptions: {
			show: showOnlyForUpdate,
		},
		default: '',
		description: '日历标题。1 ~ 128 字符',
		placeholder: '部门会议日历',
	},
	{
		displayName: '日历描述',
		name: 'description',
		type: 'string',
		displayOptions: {
			show: showOnlyForUpdate,
		},
		default: '',
		description: '日历描述。0 ~ 512 字符',
		placeholder: '用于管理部门日常会议和活动',
	},
	{
		displayName: '日历颜色',
		name: 'color',
		type: 'options',
		required: true,
		displayOptions: {
			show: showOnlyForUpdate,
		},
		default: '#0000FF',
		options: [
			{ name: '默认蓝色 (#0000FF)', value: '#0000FF' },
			{ name: '荔枝红 (#FF0000)', value: '#FF0000' },
			{ name: '石榴红 (#E60023)', value: '#E60023' },
			{ name: '南瓜橙 (#FF6600)', value: '#FF6600' },
			{ name: '柠檬黄 (#FFCC00)', value: '#FFCC00' },
			{ name: '嫩草绿 (#99CC00)', value: '#99CC00' },
			{ name: '葱心绿 (#00CC66)', value: '#00CC66' },
			{ name: '天空蓝 (#00CCFF)', value: '#00CCFF' },
			{ name: '海水蓝 (#0099CC)', value: '#0099CC' },
			{ name: '丁香紫 (#9966FF)', value: '#9966FF' },
			{ name: '芋头紫 (#CC66CC)', value: '#CC66CC' },
			{ name: '灰色 (#999999)', value: '#999999' },
		],
		description: '日历颜色，RGB颜色编码16进制表示，例如："#0000FF" 表示纯蓝色',
	},
	{
		displayName: '管理员UserID列表',
		name: 'admin_userids',
		type: 'string',
		displayOptions: {
			show: showOnlyForUpdate,
		},
		default: '',
		placeholder: 'zhangsan,lisi',
		description: '日历管理员 userid，逗号分隔，最多 3 人；与下方选择合并',
	},
	{
		displayName: '管理员列表(选择)',
		name: 'admins',
		type: 'multiOptions',
		displayOptions: {
			show: showOnlyForUpdate,
		},
		typeOptions: {
			loadOptionsMethod: 'getAllUsers',
		},
		default: [],
		description: '日历的管理员，最多 3 人',
	},
	{
		displayName: '是否不更新可订阅范围',
		name: 'skip_public_range',
		type: 'boolean',
		displayOptions: {
			show: showOnlyForUpdate,
		},
		default: false,
		description: '是否不更新可订阅范围。默认会为否，会更新可订阅范围',
	},
	{
		displayName: '公开成员UserID列表',
		name: 'public_userids',
		type: 'string',
		displayOptions: {
			show: {
				...showOnlyForUpdate,
				skip_public_range: [false],
			},
		},
		default: '',
		placeholder: 'zhangsan,lisi',
		description: '公共日历公开成员，逗号分隔，最多 1000；与下方选择合并',
	},
	{
		displayName: '公开成员(选择)',
		name: 'public_userids_selected',
		type: 'multiOptions',
		typeOptions: { loadOptionsMethod: 'getAllUsers' },
		displayOptions: {
			show: {
				...showOnlyForUpdate,
				skip_public_range: [false],
			},
		},
		default: [],
		description: '与上方公开成员列表合并去重',
	},
	{
		displayName: '公开部门ID列表',
		name: 'public_partyids',
		type: 'string',
		displayOptions: {
			show: {
				...showOnlyForUpdate,
				skip_public_range: [false],
			},
		},
		default: '',
		placeholder: '1,2',
		description: '公共日历公开部门，逗号分隔，最多 100；与下方选择合并',
	},
	{
		displayName: '公开部门(选择)',
		name: 'public_partyids_selected',
		type: 'multiOptions',
		typeOptions: { loadOptionsMethod: 'getDepartments' },
		displayOptions: {
			show: {
				...showOnlyForUpdate,
				skip_public_range: [false],
			},
		},
		default: [],
		description: '与上方公开部门列表合并去重',
	},
	{
		displayName: '公开范围(选择)',
		name: 'publicRange',
		type: 'collection',
		displayOptions: {
			show: {
				...showOnlyForUpdate,
				skip_public_range: [false],
			},
		},
		default: {},
		placeholder: '添加公开范围',
		description: '公开范围。仅当是公共日历时有效；可与上方 ID 列表合并',
		options: [
			{
				displayName: '公开成员列表',
				name: 'userids',
				type: 'multiOptions',
				typeOptions: {
					loadOptionsMethod: 'getAllUsers',
				},
				default: [],
				description: '公开的成员列表范围。最多指定1000个成员',
			},
			{
				displayName: '公开部门列表',
				name: 'partyids',
				type: 'multiOptions',
				typeOptions: {
					loadOptionsMethod: 'getDepartments',
				},
				default: [],
				description: '公开的部门列表范围。最多指定100个部门',
			},
		],
	},
	{
		displayName: '通知范围UserID列表',
		name: 'share_userids',
		type: 'string',
		displayOptions: {
			show: showOnlyForUpdate,
		},
		default: '',
		placeholder: 'zhangsan,lisi',
		description: '通知成员 userid，逗号分隔，最多 2000；默认权限「可查看」；与下方选择/集合合并',
	},
	{
		displayName: '通知范围成员(选择)',
		name: 'share_userids_selected',
		type: 'multiOptions',
		typeOptions: { loadOptionsMethod: 'getAllUsers' },
		displayOptions: {
			show: showOnlyForUpdate,
		},
		default: [],
		description: '与上方列表合并去重；默认权限「可查看」',
	},
	{
		displayName: '日历通知范围(兼容集合)',
		name: 'sharesCollection',
		type: 'fixedCollection',
		displayOptions: {
			show: showOnlyForUpdate,
		},
		default: {},
		placeholder: '添加通知成员',
		typeOptions: {
			multipleValues: true,
		},
		description: '日历通知范围成员列表。最多2000人；可与上方 UserID 列表合并',
		options: [
			{
				displayName: '通知成员',
				name: 'shares',
				values: [
					{
						displayName: '成员UserID',
						name: 'userid',
						type: 'string',
						default: '',
						placeholder: 'zhangsan',
						description: '日历通知范围成员 UserID；可与下方选择二选一',
					},
					{
						displayName: '成员(选择)',
						name: 'userid_selected',
						type: 'options',
						typeOptions: { loadOptionsMethod: 'getAllUsers' },
						default: '',
						description: '与上方字符串二选一；均填写时以字符串为准',
					},
					{
						displayName: '权限',
						name: 'permission',
						type: 'options',
						default: 1,
						options: [
							{ name: '可查看', value: 1 },
							{ name: '仅查看闲忙状态', value: 3 },
						],
						description: '日历通知范围成员权限（不填则默认为「可查看」）',
					},
				],
			},
		],
	},
];
