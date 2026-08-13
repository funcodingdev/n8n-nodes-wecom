import type { INodeProperties } from 'n8n-workflow';

const showOnly = { resource: ['meeting'], operation: ['removeMember'] };

export const removeMemberDescription: INodeProperties[] = [
	{
		displayName: '会议ID',
		name: 'meetingid',
		type: 'string',
		required: true,
		displayOptions: { show: showOnly },
		default: '',
		description:
			'会议 ID。<a href="https://developer.work.weixin.qq.com/document/path/98181" target="_blank">官方文档</a>',
	},
	{
		displayName: '允许再次入会',
		name: 'allow_rejoin',
		type: 'boolean',
		displayOptions: { show: showOnly },
		default: true,
		description: 'allow_rejoin',
	},
	{
		displayName: '被操作用户',
		name: 'membersCollection',
		type: 'fixedCollection',
		required: true,
		displayOptions: { show: showOnly },
		default: {},
		placeholder: '添加要移除的成员',
		typeOptions: { multipleValues: true },
		description: 'operated_users：tmp_openid + instance_id；下方 JSON 非空时覆盖表单',
		options: [
			{
				displayName: '成员',
				name: 'members',
				values: [
					{
						displayName: '临时OpenID',
						name: 'tmp_openid',
						type: 'string',
						default: '',
						required: true,
						description: 'tmp_openid，会中临时 ID',
					},
					{
						displayName: '设备实例ID',
						name: 'instance_id',
						type: 'number',
						default: 1,
						description: 'instance_id，需与入会设备类型一致',
					},
				],
			},
		],
	},
	{
		displayName: '被操作用户 JSON',
		name: 'membersJson',
		type: 'json',
		displayOptions: { show: showOnly },
		default: '[]',
		description:
			'可选。非空数组时覆盖上方表单，1–100 项。支持 [{"tmp_openid":"...","instance_id":1}]',
	},
];
