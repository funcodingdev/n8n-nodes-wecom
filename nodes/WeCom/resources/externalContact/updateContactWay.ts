import type { INodeProperties } from 'n8n-workflow';

const showOnly = {
	resource: ['externalContact'],
	operation: ['updateContactWay'],
};

export const updateContactWayDescription: INodeProperties[] = [
	{
		displayName: '联系方式配置ID',
		name: 'config_id',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: showOnly,
		},
		hint: '联系方式的配置id',
		description: '联系方式的配置ID',
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
		description: '联系方式的备注信息',
	},
	{
		displayName: '无需验证',
		name: 'skip_verify',
		type: 'boolean',
		default: true,
		displayOptions: {
			show: showOnly,
		},
		hint: '外部客户添加时是否无需验证',
		description: 'Whether external customers need verification when adding',
	},
];

