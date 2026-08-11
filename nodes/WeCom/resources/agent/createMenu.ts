import type { INodeProperties } from 'n8n-workflow';

const showOnlyCreateMenu = {
	resource: ['agent'],
	operation: ['createMenu'],
};

const menuItemFields: INodeProperties[] = [
	{
		displayName: '菜单名称',
		name: 'name',
		type: 'string',
		default: '',
		description: '一级不超过 16 字节，二级不超过 40 字节',
	},
	{
		displayName: '类型',
		name: 'type',
		type: 'options',
		options: [
			{ name: '含子菜单', value: 'sub' },
			{ name: 'click 点击推事件', value: 'click' },
			{ name: 'view 跳转网页', value: 'view' },
			{ name: 'scancode_push 扫码推事件', value: 'scancode_push' },
			{ name: 'scancode_waitmsg 扫码带提示', value: 'scancode_waitmsg' },
			{ name: 'pic_sysphoto 系统拍照', value: 'pic_sysphoto' },
			{ name: 'pic_photo_or_album 拍照或相册', value: 'pic_photo_or_album' },
			{ name: 'pic_weixin 微信相册', value: 'pic_weixin' },
			{ name: 'location_select 地理位置', value: 'location_select' },
			{ name: 'view_miniprogram 小程序', value: 'view_miniprogram' },
		],
		default: 'click',
	},
	{
		displayName: 'Key',
		name: 'key',
		type: 'string',
		default: '',
		description: 'click 等点击类必填',
	},
	{
		displayName: 'URL',
		name: 'url',
		type: 'string',
		default: '',
		description: 'view 类型必填',
	},
	{
		displayName: '小程序AppID',
		name: 'appid',
		type: 'string',
		default: '',
		description: 'view_miniprogram 必填',
	},
	{
		displayName: '小程序页面路径',
		name: 'pagepath',
		type: 'string',
		default: '',
		description: 'view_miniprogram 必填',
	},
	{
		displayName: '子菜单',
		name: 'subButtonsCollection',
		type: 'fixedCollection',
		displayOptions: { show: { type: ['sub'] } },
		default: {},
		placeholder: '添加子菜单',
		typeOptions: { multipleValues: true },
		description: '二级菜单 1~5 个',
		options: [
			{
				displayName: '子菜单项',
				name: 'items',
				values: [
					{
						displayName: '名称',
						name: 'name',
						type: 'string',
						default: '',
					},
					{
						displayName: '类型',
						name: 'type',
						type: 'options',
						options: [
							{ name: 'click', value: 'click' },
							{ name: 'view', value: 'view' },
							{ name: 'scancode_push', value: 'scancode_push' },
							{ name: 'scancode_waitmsg', value: 'scancode_waitmsg' },
							{ name: 'pic_sysphoto', value: 'pic_sysphoto' },
							{ name: 'pic_photo_or_album', value: 'pic_photo_or_album' },
							{ name: 'pic_weixin', value: 'pic_weixin' },
							{ name: 'location_select', value: 'location_select' },
							{ name: 'view_miniprogram', value: 'view_miniprogram' },
						],
						default: 'click',
					},
					{ displayName: 'Key', name: 'key', type: 'string', default: '' },
					{ displayName: 'URL', name: 'url', type: 'string', default: '' },
					{ displayName: '小程序AppID', name: 'appid', type: 'string', default: '' },
					{ displayName: '小程序路径', name: 'pagepath', type: 'string', default: '' },
				],
			},
		],
	},
	{
		displayName: '子菜单扩展JSON',
		name: 'sub_button_json',
		type: 'json',
		displayOptions: { show: { type: ['sub'] } },
		default: '[]',
		description: '非空数组时覆盖上方子菜单表单',
	},
];

export const createMenuDescription: INodeProperties[] = [
	{
		displayName: '应用ID',
		name: 'agentid',
		type: 'number',
		required: true,
		default: 0,
		displayOptions: { show: showOnlyCreateMenu },
		description: '企业应用 agentid',
	},
	{
		displayName: '菜单配置方式',
		name: 'menuConfigMode',
		type: 'options',
		displayOptions: { show: showOnlyCreateMenu },
		options: [
			{ name: '表单配置', value: 'form' },
			{ name: '完整 JSON', value: 'json' },
		],
		default: 'form',
	},
	{
		displayName: '一级菜单',
		name: 'menuButtonCollection',
		type: 'fixedCollection',
		displayOptions: { show: { ...showOnlyCreateMenu, menuConfigMode: ['form'] } },
		default: {},
		placeholder: '添加一级菜单',
		typeOptions: { multipleValues: true },
		description: '1~3 个一级菜单',
		options: [
			{
				displayName: '菜单项',
				name: 'buttons',
				values: menuItemFields,
			},
		],
	},
	{
		displayName: '菜单配置JSON',
		name: 'button',
		type: 'json',
		typeOptions: { rows: 10 },
		displayOptions: { show: { ...showOnlyCreateMenu, menuConfigMode: ['json'] } },
		default: `[
  {
    "type": "click",
    "name": "今日歌曲",
    "key": "V1001_TODAY_MUSIC"
  }
]`,
		description: 'button 数组，一级菜单 1~3 个',
	},
];
