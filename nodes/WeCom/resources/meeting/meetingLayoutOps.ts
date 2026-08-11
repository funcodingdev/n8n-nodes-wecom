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

const needLayoutId = ['advLayoutApply', 'advLayoutUpdate', 'basicLayoutUpdate'];
const needLayoutIdList = ['advLayoutBatchDelete'];
const needBackgroundId = ['layoutDeleteBackground', 'layoutSetDefaultBackground'];
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
		displayOptions: { show: { resource: ['meeting'], operation: needLayoutId } },
		default: '',
		description: '布局 ID；应用布局时传空字符串可恢复默认布局',
	},
	{
		displayName: '布局ID列表',
		name: 'layout_id_list',
		type: 'string',
		displayOptions: { show: { resource: ['meeting'], operation: needLayoutIdList } },
		default: '',
		placeholder: 'id1,id2',
		description: '要删除的布局 ID，逗号分隔，最多 20 个',
	},
	{
		displayName: '背景ID',
		name: 'background_id',
		type: 'string',
		displayOptions: { show: { resource: ['meeting'], operation: needBackgroundId } },
		default: '',
		description: '背景 ID；设置默认背景时传空可恢复默认黑色背景',
	},
	{
		displayName: '背景ID列表',
		name: 'background_id_list',
		type: 'string',
		displayOptions: { show: { resource: ['meeting'], operation: needBackgroundIdList } },
		default: '',
		placeholder: 'id1,id2',
		description: '要删除的背景 ID，逗号分隔',
	},
	{
		displayName: '用户UserID',
		name: 'layout_userid',
		type: 'string',
		displayOptions: {
			show: { resource: ['meeting'], operation: ['advLayoutGetUserLayout'] },
		},
		default: '',
		description: '查询目标用户的 userid（按官方文档需要时填写）',
	},
	{
		displayName: '背景图片列表',
		name: 'layoutBackgroundImages',
		type: 'fixedCollection',
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
						default: '',
					},
					{
						displayName: '图片URL',
						name: 'image_url',
						type: 'string',
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
		description: 'default_image_order，从 1 开始',
	},
	{
		displayName: '布局/背景配置JSON',
		name: 'layoutConfigJson',
		type: 'json',
		displayOptions: { show: { resource: ['meeting'], operation: needLayoutBody } },
		default: '{}',
		description:
			'布局或背景的详细配置（如 page_list）；添加背景时也可覆盖 image_list',
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
