import type { INodeProperties } from 'n8n-workflow';

const showOnlySetAgent = {
	resource: ['agent'],
	operation: ['setAgent'],
};

export const setAgentDescription: INodeProperties[] = [
	{
		displayName: '应用 ID',
		name: 'agentid',
		type: 'number',
		required: true,
		default: 0,
		typeOptions: { minValue: 1, numberStepSize: 1 },
		displayOptions: {
			show: showOnlySetAgent,
		},
		description: '企业应用的唯一标识。<a href="https://developer.work.weixin.qq.com/document/path/90228" target="_blank">官方文档</a>',
	},
	{
		displayName: '应用名称',
		name: 'name',
		type: 'string',
		default: '',
		displayOptions: {
			show: showOnlySetAgent,
		},
		description: '企业应用名称，长度不超过32个utf8字符',
	},
	{
		displayName: '应用详情',
		name: 'description',
		type: 'string',
		typeOptions: {
			rows: 3,
		},
		default: '',
		displayOptions: {
			show: showOnlySetAgent,
		},
		description: '企业应用详情，长度为4至120个utf8字符',
	},
	{
		displayName: '应用头像 Media ID',
		name: 'logo_mediaid',
		type: 'string',
		default: '',
		displayOptions: {
			show: showOnlySetAgent,
		},
		description: '企业应用头像的mediaid，通过素材管理接口上传图片获得mediaid，上传后会自动裁剪成方形和圆形两个头像',
	},
	{
		displayName: '应用主页 URL',
		name: 'home_url',
		type: 'string',
		default: '',
		displayOptions: {
			show: showOnlySetAgent,
		},
		description: '应用主页URL。URL必须以http或者https开头（为了提高安全性，建议使用https）',
	},
	{
		displayName: '可信域名',
		name: 'redirect_domain',
		type: 'string',
		default: '',
		displayOptions: {
			show: showOnlySetAgent,
		},
		description: '企业应用可信域名。注意：域名需通过所有权校验，否则jssdk功能将受限，此时返回错误码85005',
	},
	{
		displayName: '地理位置上报',
		name: 'report_location_flag',
		type: 'options',
		options: [
			{
				name: '不修改',
				value: '',
			},
			{
				name: '不上报',
				value: 0,
			},
			{
				name: '进入会话上报',
				value: 1,
			},
		],
		default: '',
		displayOptions: {
			show: showOnlySetAgent,
		},
		description: '企业应用是否打开地理位置上报',
	},
	{
		displayName: '上报用户进入应用事件',
		name: 'isreportenter',
		type: 'options',
		options: [
			{
				name: '不修改',
				value: '',
			},
			{
				name: '不接收',
				value: 0,
			},
			{
				name: '接收',
				value: 1,
			},
		],
		default: '',
		displayOptions: {
			show: showOnlySetAgent,
		},
		description: '是否上报用户进入应用事件。0：不接收；1：接收',
	},
];
