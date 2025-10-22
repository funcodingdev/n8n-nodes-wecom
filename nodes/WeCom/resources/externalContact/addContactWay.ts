import type { INodeProperties } from 'n8n-workflow';

const showOnly = {
	resource: ['externalContact'],
	operation: ['addContactWay'],
};

export const addContactWayDescription: INodeProperties[] = [
	{
		displayName: '联系方式类型',
		name: 'type',
		type: 'options',
		options: [
			{
				name: '单人',
				value: 1,
			},
			{
				name: '多人',
				value: 2,
			},
		],
		required: true,
		default: 1,
		displayOptions: {
			show: showOnly,
		},
		hint: '联系方式类型，1-单人，2-多人',
	},
	{
		displayName: '场景',
		name: 'scene',
		type: 'options',
		options: [
			{
				name: '在小程序中联系',
				value: 1,
			},
			{
				name: '通过二维码联系',
				value: 2,
			},
		],
		required: true,
		default: 2,
		displayOptions: {
			show: showOnly,
		},
		hint: '场景，1-在小程序中联系，2-通过二维码联系',
	},
	{
		displayName: '配置的成员列表',
		name: 'user',
		type: 'string',
		default: '',
		displayOptions: {
			show: showOnly,
		},
		hint: '成员的userid列表，用逗号分隔',
		description: '使用该联系方式的用户userID列表',
	},
	{
		displayName: '备注',
		name: 'remark',
		type: 'string',
		default: '',
		displayOptions: {
			show: showOnly,
		},
		hint: '联系方式的备注信息',
		description: '联系方式的备注信息，用于管理员自己识别',
	},
	{
		displayName: '使用次数',
		name: 'skip_verify',
		type: 'boolean',
		default: true,
		displayOptions: {
			show: showOnly,
		},
		hint: '外部客户添加时是否无需验证',
		description: 'Whether external customers need verification when adding',
	},
	{
		displayName: '自动通过好友',
		name: 'conclusions',
		type: 'json',
		default: '{}',
		displayOptions: {
			show: showOnly,
		},
		hint: '结束语，会话结束时自动发送给客户',
		description: '结束语，会话结束时自动发送给客户，可根据需要填写',
	},
];

