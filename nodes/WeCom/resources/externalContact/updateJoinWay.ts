import type { INodeProperties } from 'n8n-workflow';

const showOnly = { resource: ['externalContact'], operation: ['updateJoinWay'] };

function showWhen(name: string, value: boolean = true) {
	return { ...showOnly, [name]: [value] };
}

export const updateJoinWayDescription: INodeProperties[] = [
	{
		displayName: '场景和群聊 ID 列表为必填并会覆盖原配置；其他字段仅在开启对应“更新”开关后发送',
		name: 'updateJoinWayNotice',
		type: 'notice',
		default: '',
		displayOptions: { show: showOnly },
	},
	{
		displayName: '配置ID',
		name: 'config_id',
		type: 'string',
		required: true,
		default: '',
		displayOptions: { show: showOnly },
		description: '企业加入群聊方式的配置 ID',
		placeholder: '9ad7fa5cdaa6511298498f979c4722de',
	},
	{
		displayName: '场景',
		name: 'scene',
		type: 'options',
		options: [
			{ name: '群的小程序插件', value: 1 },
			{ name: '群的二维码插件', value: 2 },
		],
		required: true,
		default: 2,
		displayOptions: { show: showOnly },
		description: '1-群的小程序插件；2-群的二维码插件',
	},
	{
		displayName: '群聊ID列表',
		name: 'chat_id_list',
		type: 'string',
		required: true,
		default: '',
		displayOptions: { show: showOnly },
		description: '将覆盖原群聊列表；与下方 JSON 合并；支持逗号、竖线或换行分隔，必须为 1–5 个群',
		placeholder: 'wrOgQhDgAAH2Yy-CTZ6POca8mlBEdaaa,wrOgQhDgAALPUthpRAKvl7mgiQRw_aaa',
	},
	{
		displayName: '群聊ID列表 JSON',
		name: 'chatIdListJson',
		type: 'json',
		default: '[]',
		displayOptions: { show: showOnly },
		description:
			'可选。非空数组时与上方列表合并去重。支持 ["wrxxx"] 或 [{"chat_id":"wrxxx"}]',
	},
	{
		displayName: '更新备注',
		name: 'updateRemark',
		type: 'boolean',
		default: false,
		displayOptions: { show: showOnly },
		description: '开启后覆盖原备注；留空可清空',
	},
	{
		displayName: '备注',
		name: 'remark',
		type: 'string',
		typeOptions: { maxValue: 30 },
		default: '',
		displayOptions: { show: showWhen('updateRemark') },
		description: '最多 30 个字符；留空会发送空字符串',
	},
	{
		displayName: '更新自动建群',
		name: 'updateAutoCreateRoom',
		type: 'boolean',
		default: false,
		displayOptions: { show: showOnly },
		description: '开启后覆盖“群满后自动建群”设置',
	},
	{
		displayName: '自动创建群',
		name: 'auto_create_room',
		type: 'boolean',
		default: true,
		displayOptions: { show: showWhen('updateAutoCreateRoom') },
		description: '当群满后是否自动新建群',
	},
	{
		displayName: '自定义自动建群名称',
		name: 'customRoomNaming',
		type: 'boolean',
		default: false,
		displayOptions: {
			show: { ...showOnly, updateAutoCreateRoom: [true], auto_create_room: [true] },
		},
		description: '开启后同时发送群名前缀和群起始序号',
	},
	{
		displayName: '群名前缀',
		name: 'room_base_name',
		type: 'string',
		typeOptions: { maxValue: 40 },
		required: true,
		default: '',
		displayOptions: {
			show: {
				...showOnly,
				updateAutoCreateRoom: [true],
				auto_create_room: [true],
				customRoomNaming: [true],
			},
		},
		description: '最长 40 个字符',
	},
	{
		displayName: '群起始序号',
		name: 'room_base_id',
		type: 'number',
		typeOptions: { minValue: 1, numberStepSize: 1 },
		default: 1,
		displayOptions: {
			show: {
				...showOnly,
				updateAutoCreateRoom: [true],
				auto_create_room: [true],
				customRoomNaming: [true],
			},
		},
		description: '自动创建的第一个群使用的序号',
	},
	{
		displayName: '更新 State 参数',
		name: 'updateState',
		type: 'boolean',
		default: false,
		displayOptions: { show: showOnly },
		description: '开启后覆盖渠道 State；留空可清空',
	},
	{
		displayName: '自定义State参数',
		name: 'state',
		type: 'string',
		typeOptions: { maxValue: 30 },
		default: '',
		displayOptions: { show: showWhen('updateState') },
		description: '最多 30 个 UTF-8 字符；留空会发送空字符串',
	},
	{
		displayName: '更新客户来源标记',
		name: 'updateMarkSource',
		type: 'boolean',
		default: false,
		displayOptions: { show: showOnly },
		description: '仅营销获客应用且由创建该配置的应用更新时有效',
	},
	{
		displayName: '标记客户来源',
		name: 'mark_source',
		type: 'boolean',
		default: true,
		displayOptions: { show: showWhen('updateMarkSource') },
		description: '是否标记客户添加来源为该应用创建的「加入群聊」',
	},
];
