import type { INodeProperties } from 'n8n-workflow';

const showOnlyForCreate = {
	resource: ['contact'],
	operation: ['createUser'],
};

export const createUserDescription: INodeProperties[] = [
	{
		displayName: 'UserID',
		name: 'userid',
		type: 'string',
		required: true,
		displayOptions: {
			show: showOnlyForCreate,
		},
		default: '',
		description: '成员UserID。企业内必须唯一。长度为1~64个字节。只能由数字、字母和"_-@."四种字符组成，且第一个字符必须是字母或数字。',
		hint: '成员UserID',
	},
	{
		displayName: '姓名',
		name: 'name',
		type: 'string',
		required: true,
		displayOptions: {
			show: showOnlyForCreate,
		},
		default: '',
		description: '成员名称。长度为1~64个utf8字符。',
		hint: '成员姓名',
	},
	{
		displayName: '手机号',
		name: 'mobile',
		type: 'string',
		displayOptions: {
			show: showOnlyForCreate,
		},
		default: '',
		description: '手机号码。企业内必须唯一，mobile/email二者不能同时为空。',
		hint: '手机号码',
	},
	{
		displayName: '所属部门',
		name: 'department',
		type: 'string',
		required: true,
		displayOptions: {
			show: showOnlyForCreate,
		},
		default: '',
		description: '成员所属部门id列表，多个部门用逗号分隔。不超过100个。',
		hint: '部门ID列表，用逗号分隔',
	},
	{
		displayName: '职务信息',
		name: 'position',
		type: 'string',
		displayOptions: {
			show: showOnlyForCreate,
		},
		default: '',
		description: '职务信息。长度为0~128个字符。',
		hint: '职务信息',
	},
	{
		displayName: '性别',
		name: 'gender',
		type: 'options',
		displayOptions: {
			show: showOnlyForCreate,
		},
		options: [
			{
				name: '保密',
				value: '0',
			},
			{
				name: '男',
				value: '1',
			},
			{
				name: '女',
				value: '2',
			},
		],
		default: '0',
		description: '性别。0表示未定义，1表示男性，2表示女性。',
		hint: '性别',
	},
	{
		displayName: '邮箱',
		name: 'email',
		type: 'string',
		displayOptions: {
			show: showOnlyForCreate,
		},
		default: '',
		description: '邮箱。长度6~64个字节，且为有效的email格式。企业内必须唯一，mobile/email二者不能同时为空。',
		hint: '邮箱地址',
	},
	{
		displayName: '企业邮箱',
		name: 'biz_mail',
		type: 'string',
		displayOptions: {
			show: showOnlyForCreate,
		},
		default: '',
		description: '企业邮箱，仅对开通企业邮箱的企业有效。长度6~64个字节，且为有效的企业邮箱格式。',
		hint: '企业邮箱',
	},
	{
		displayName: '个数地址',
		name: 'address',
		type: 'string',
		displayOptions: {
			show: showOnlyForCreate,
		},
		default: '',
		description: '地址。长度最大128个字符。',
		hint: '地址',
	},
	{
		displayName: '别名',
		name: 'alias',
		type: 'string',
		displayOptions: {
			show: showOnlyForCreate,
		},
		default: '',
		description: '成员别名。长度1~64个utf8字符。',
		hint: '别名',
	},
	{
		displayName: '座机',
		name: 'telephone',
		type: 'string',
		displayOptions: {
			show: showOnlyForCreate,
		},
		default: '',
		description: '座机。32字节以内，由纯数字、"-"、"+"或","组成。',
		hint: '座机号码',
	},
	{
		displayName: '启用状态',
		name: 'enable',
		type: 'options',
		displayOptions: {
			show: showOnlyForCreate,
		},
		options: [
			{
				name: '启用',
				value: 1,
			},
			{
				name: '禁用',
				value: 0,
			},
		],
		default: 1,
		description: 'Whether to enable this member. 1 to enable, 0 to disable.',
		hint: '启用状态',
	},
	{
		displayName: '头像MediaID',
		name: 'avatar_mediaid',
		type: 'string',
		displayOptions: {
			show: showOnlyForCreate,
		},
		default: '',
		description: '成员头像的mediaid，通过素材管理接口上传图片获得的mediaid。',
		hint: '头像MediaID',
	},
	{
		displayName: '成员对外属性',
		name: 'external_profile',
		type: 'json',
		displayOptions: {
			show: showOnlyForCreate,
		},
		default: '{}',
		description: '成员对外属性，字段详情参见对外属性。',
		hint: '对外属性JSON',
	},
	{
		displayName: '是否邀请该成员使用企业微信',
		name: 'to_invite',
		type: 'boolean',
		displayOptions: {
			show: showOnlyForCreate,
		},
		default: true,
		description: '是否邀请该成员使用企业微信。',
		hint: '是否邀请使用',
	},
];

