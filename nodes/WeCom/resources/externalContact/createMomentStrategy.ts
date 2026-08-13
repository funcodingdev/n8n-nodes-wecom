import type { INodeProperties } from 'n8n-workflow';

const showOnly = {
	resource: ['externalContact'],
	operation: ['createMomentStrategy'],
};

export const createMomentStrategyDescription: INodeProperties[] = [
	{
		displayName: '规则组名称',
		name: 'strategy_name',
		type: 'string',
		required: true,
		default: '',
		displayOptions: { show: showOnly },
	},
	{
		displayName: '父规则组ID',
		name: 'parent_id',
		type: 'number',
		typeOptions: { minValue: 0, numberStepSize: 1 },
		default: 0,
		displayOptions: { show: showOnly },
		description: '父规则组ID，如果不指定父规则组则为0',
	},
	{
		displayName: '父规则组继承提示',
		name: 'parentMomentStrategyNotice',
		type: 'notice',
		default: '',
		displayOptions: { show: { ...showOnly, parent_id: [{ _cnd: { gt: 0 } }] } },
		description: '存在父规则组时，管理范围必须是父规则组的子集，权限会完全继承父组且本节点不会发送权限配置',
	},
	{
		displayName: '管理员列表',
		name: 'admin_list',
		type: 'string',
		required: true,
		default: '',
		displayOptions: { show: showOnly },
		description: '规则组管理员userid列表，多个用逗号分隔，不可配置超级管理员，每个规则组最多可配置20个负责人',
		placeholder: 'zhangsan,lisi',
	},
	{
		displayName: '允许查看成员的全部客户朋友圈发表',
		name: 'privilege_view_moment_list',
		type: 'boolean',
		default: true,
		displayOptions: { show: { ...showOnly, parent_id: [0] } },
	},
	{
		displayName: '允许成员发表客户朋友圈',
		name: 'privilege_send_moment',
		type: 'boolean',
		default: true,
		displayOptions: { show: { ...showOnly, parent_id: [0] } },
		description: '允许成员发表客户朋友圈，默认为true',
	},
	{
		displayName: '允许配置封面和签名',
		name: 'privilege_manage_moment_cover_and_sign',
		type: 'boolean',
		default: true,
		displayOptions: { show: { ...showOnly, parent_id: [0] } },
		description: '配置封面和签名，默认为true',
	},
	{
		displayName: '管理范围',
		name: 'rangeCollection',
		type: 'fixedCollection',
		required: true,
		displayOptions: { show: showOnly },
		default: {},
		placeholder: '添加管理范围节点',
		typeOptions: { multipleValues: true },
		description: '规则组管理范围，每个管理组的管理范围内最多支持3000个节点',
		options: [
			{
				displayName: '范围节点',
				name: 'ranges',
				values: [
					{
						displayName: '节点类型',
						name: 'type',
						type: 'options',
						options: [
							{ name: '成员', value: 1 },
							{ name: '部门', value: 2 },
						],
						default: 1,
						description: '规则组管理范围节点类型，1-成员 2-部门',
					},
					{
						displayName: '成员UserID',
						name: 'userid',
						type: 'string',
						default: '',
						displayOptions: { show: { type: [1] } },
						description: '规则组的管理成员ID（type为1时填写）',
					},
					{
						displayName: '部门ID',
						name: 'partyid',
						type: 'number',
						typeOptions: { minValue: 1, numberStepSize: 1 },
						default: 0,
						displayOptions: { show: { type: [2] } },
						description: '规则组的管理部门ID（type为2时填写）',
					},
				],
			},
		],
	},
];
