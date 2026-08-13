import type { INodeProperties } from 'n8n-workflow';

/** 会议布局 / 高级布局 / 背景：结构化表单 */

export const layoutOperationOptions = [
	// 高级布局
	{
		name: '[高级布局] 添加高级布局',
		value: 'advLayoutAdd',
		action: '添加高级布局',
		description: '为会议添加高级布局',
	},
	{
		name: '[高级布局] 修改高级布局',
		value: 'advLayoutUpdate',
		action: '修改高级布局',
		description: '修改会议高级布局',
	},
	{
		name: '[高级布局] 应用高级布局',
		value: 'advLayoutApply',
		action: '应用高级布局',
		description: '将指定布局应用到会议（空布局 ID 表示恢复默认）',
	},
	{
		name: '[高级布局] 获取布局列表',
		value: 'advLayoutList',
		action: '获取高级布局列表',
		description: '获取会议高级布局列表',
	},
	{
		name: '[高级布局] 获取用户布局',
		value: 'advLayoutGetUserLayout',
		action: '获取用户布局',
		description: '获取用户当前高级布局',
	},
	{
		name: '[高级布局] 批量删除布局',
		value: 'advLayoutBatchDelete',
		action: '批量删除高级布局',
		description: '批量删除高级布局（当前应用中的不可删）',
	},
	// 基础布局
	{
		name: '[布局] 添加基础布局',
		value: 'basicLayoutAdd',
		action: '添加基础布局',
		description: '添加会议基础布局',
	},
	{
		name: '[布局] 修改基础布局',
		value: 'basicLayoutUpdate',
		action: '修改基础布局',
		description: '修改会议基础布局',
	},
	// 背景
	{
		name: '[布局] 添加会议背景',
		value: 'layoutAddBackground',
		action: '添加会议背景',
		description: '为会议添加背景图',
	},
	{
		name: '[布局] 设置默认背景',
		value: 'layoutSetDefaultBackground',
		action: '设置默认背景',
		description: '设置会议默认背景（空 ID 恢复黑色背景）',
	},
	{
		name: '[布局] 获取背景列表',
		value: 'layoutListBackground',
		action: '获取背景列表',
		description: '获取会议背景列表',
	},
	{
		name: '[布局] 删除会议背景',
		value: 'layoutDeleteBackground',
		action: '删除会议背景',
		description: '删除指定会议背景',
	},
	{
		name: '[布局] 批量删除背景',
		value: 'layoutBatchDeleteBackground',
		action: '批量删除背景',
		description: '批量删除会议背景',
	},
];

const allLayoutOps = layoutOperationOptions.map((o) => o.value);

const needLayoutIdList = ['advLayoutBatchDelete'];
const needBackgroundIdList = ['layoutBatchDeleteBackground'];
const needLayoutBody = [
	'advLayoutAdd',
	'advLayoutUpdate',
	'basicLayoutAdd',
	'basicLayoutUpdate',
	'layoutAddBackground',
];

export const meetingLayoutOpsDescription: INodeProperties[] = [
	{
		displayName: '会议ID',
		name: 'layout_meetingid',
		type: 'string',
		required: true,
		displayOptions: { show: { resource: ['meeting'], operation: allLayoutOps } },
		default: '',
		description: '会议 ID',
	},
	{
		displayName: '布局ID',
		name: 'layout_id',
		type: 'string',
		required: true,
		displayOptions: {
			show: { resource: ['meeting'], operation: ['advLayoutUpdate', 'basicLayoutUpdate'] },
		},
		default: '',
		description: '要修改的布局 ID',
	},
	{
		displayName: '布局ID',
		name: 'layout_id',
		type: 'string',
		displayOptions: { show: { resource: ['meeting'], operation: ['advLayoutApply'] } },
		default: '',
		description: '要应用的布局 ID；留空恢复当前会议的默认布局',
	},
	{
		displayName: '布局ID列表',
		name: 'layout_id_list',
		type: 'string',
		required: true,
		displayOptions: { show: { resource: ['meeting'], operation: needLayoutIdList } },
		default: '',
		placeholder: 'id1,id2',
		description: '要删除的布局 ID，逗号分隔，最多 20 个',
	},
	{
		displayName: '背景ID',
		name: 'background_id',
		type: 'string',
		required: true,
		displayOptions: { show: { resource: ['meeting'], operation: ['layoutDeleteBackground'] } },
		default: '',
		description: '要删除的背景 ID',
	},
	{
		displayName: '背景ID',
		name: 'background_id',
		type: 'string',
		displayOptions: {
			show: { resource: ['meeting'], operation: ['layoutSetDefaultBackground'] },
		},
		default: '',
		description: '要应用的背景 ID；留空恢复会议默认黑色背景',
	},
	{
		displayName: '背景ID列表',
		name: 'background_id_list',
		type: 'string',
		required: true,
		displayOptions: { show: { resource: ['meeting'], operation: needBackgroundIdList } },
		default: '',
		placeholder: 'id1,id2',
		description: '要删除的背景 ID，逗号分隔',
	},
	{
		displayName: '用户临时OpenID列表',
		name: 'layout_apply_tmp_openids',
		type: 'string',
		displayOptions: { show: { resource: ['meeting'], operation: ['advLayoutApply'] } },
		default: '',
		placeholder: 'tmp_openid1,tmp_openid2',
		description: '只为指定用户设置个性布局；留空则为整个会议设置。最多 20 个',
	},
	{
		displayName: '用户临时OpenID',
		name: 'layout_tmp_openid',
		type: 'string',
		required: true,
		displayOptions: {
			show: { resource: ['meeting'], operation: ['advLayoutGetUserLayout'] },
		},
		default: '',
		description: '被查询用户在本场会议中的临时 OpenID',
	},
	{
		displayName: '设备实例ID',
		name: 'layout_instance_id',
		type: 'number',
		required: true,
		displayOptions: {
			show: { resource: ['meeting'], operation: ['advLayoutGetUserLayout'] },
		},
		default: 1,
		description: '被查询用户的终端设备类型 ID',
	},
	{
		displayName: '设为会议当前布局',
		name: 'enable_set_default',
		type: 'boolean',
		displayOptions: {
			show: { resource: ['meeting'], operation: ['basicLayoutUpdate'] },
		},
		default: false,
		description: 'enable_set_default：同时将修改后的基础布局设为会议当前布局',
	},
	{
		displayName: '背景图片列表',
		name: 'layoutBackgroundImages',
		type: 'fixedCollection',
		required: true,
		displayOptions: {
			show: { resource: ['meeting'], operation: ['layoutAddBackground'] },
		},
		default: {},
		placeholder: '添加图片',
		typeOptions: { multipleValues: true },
		description: 'image_list',
		options: [
			{
				displayName: '图片',
				name: 'images',
				values: [
					{
						displayName: '图片MD5',
						name: 'image_md5',
						type: 'string',
						required: true,
						default: '',
					},
					{
						displayName: '图片URL',
						name: 'image_url',
						type: 'string',
						required: true,
						default: '',
					},
				],
			},
		],
	},
	{
		displayName: '默认图片序号',
		name: 'default_image_order',
		type: 'number',
		displayOptions: {
			show: { resource: ['meeting'], operation: ['layoutAddBackground'] },
		},
		default: 1,
		typeOptions: { minValue: 1 },
		description: 'default_image_order，从 1 开始',
	},
	{
		displayName: '布局名称',
		name: 'layout_name',
		type: 'string',
		displayOptions: {
			show: {
				resource: ['meeting'],
				operation: ['advLayoutAdd', 'advLayoutUpdate'],
			},
		},
		default: '',
		description: '高级布局名称',
	},
	{
		displayName: '默认布局序号',
		name: 'default_layout_order',
		type: 'number',
		displayOptions: {
			show: {
				resource: ['meeting'],
				operation: ['basicLayoutAdd'],
			},
		},
		default: 1,
		typeOptions: { minValue: 1 },
		description: 'default_layout_order，从 1 开始',
	},
	{
		displayName: '布局页面',
		name: 'layoutPagesCollection',
		type: 'fixedCollection',
		required: true,
		displayOptions: {
			show: {
				resource: ['meeting'],
				operation: ['advLayoutAdd', 'advLayoutUpdate', 'basicLayoutAdd', 'basicLayoutUpdate'],
			},
		},
		default: {},
		placeholder: '添加页面',
		typeOptions: { multipleValues: true },
		description: 'page_list：模板与座次',
		options: [
			{
				displayName: '页面',
				name: 'pages',
				values: [
					{
						displayName: '布局模板ID',
						name: 'layout_template_id',
						type: 'string',
						required: true,
						default: '',
						description: 'layout_template_id',
					},
					{
						displayName: '开启轮询',
						name: 'enable_polling',
						type: 'boolean',
						default: false,
					},
					{
						displayName: '轮询间隔单位',
						name: 'polling_interval_unit',
						type: 'options',
						options: [
							{ name: '秒', value: 1 },
							{ name: '分钟', value: 2 },
						],
						default: 1,
						displayOptions: { show: { enable_polling: [true] } },
					},
					{
						displayName: '轮询间隔',
						name: 'polling_interval',
						type: 'number',
						default: 10,
						typeOptions: { minValue: 1, maxValue: 999999 },
						displayOptions: { show: { enable_polling: [true] } },
					},
					{
						displayName: '忽略未开视频成员',
						name: 'ignore_user_novideo',
						type: 'boolean',
						default: false,
						displayOptions: { show: { enable_polling: [true] } },
					},
					{
						displayName: '忽略未入会成员',
						name: 'ignore_user_absence',
						type: 'boolean',
						default: false,
						displayOptions: { show: { enable_polling: [true] } },
					},
					{
						displayName: '座次列表',
						name: 'userSeats',
						type: 'fixedCollection',
						typeOptions: { multipleValues: true },
						default: {},
						placeholder: '添加座次',
						options: [
							{
								displayName: '座次',
								name: 'seats',
								values: [
									{
										displayName: '宫格ID',
										name: 'grid_id',
										type: 'string',
										required: true,
										default: '1',
									},
									{
										displayName: '宫格类型',
										name: 'grid_type',
										type: 'options',
										required: true,
										options: [
											{ name: '视频画面', value: 1 },
											{ name: '共享画面', value: 2 },
											{ name: '拓展应用', value: 3 },
										],
										default: 1,
									},
									{
										displayName: '成员UserID',
										name: 'userid',
										type: 'string',
										default: '',
									},
									{
										displayName: '临时OpenID',
										name: 'tmp_openid',
										type: 'string',
										default: '',
									},
									{
										displayName: '昵称/昵称Base64',
										name: 'nick_name',
										type: 'string',
										default: '',
										description:
											'基础布局视频画面填写普通昵称；高级布局指定人员填写 Base64 编码昵称',
									},
									{
										displayName: '拓展应用ID',
										name: 'tool_sdkid',
										type: 'string',
										default: '',
									},
								],
							},
						],
					},
				],
			},
		],
	},
	{
		displayName: '布局/背景配置JSON',
		name: 'layoutConfigJson',
		type: 'json',
		displayOptions: { show: { resource: ['meeting'], operation: needLayoutBody } },
		default: '{}',
		description: '高级输入：添加接口可提供完整 layout_list，修改接口可提供完整 page_list',
	},
	{
		displayName: '扩展请求JSON',
		name: 'layoutExtraJson',
		type: 'json',
		displayOptions: {
			show: {
				resource: ['meeting'],
				operation: [
					'advLayoutApply',
					'advLayoutList',
					'advLayoutGetUserLayout',
					'advLayoutBatchDelete',
					'layoutListBackground',
					'layoutSetDefaultBackground',
					'layoutDeleteBackground',
					'layoutBatchDeleteBackground',
				],
			},
		},
		default: '{}',
		description: '其余可选字段，与上方字段合并（JSON 优先）',
	},
];
