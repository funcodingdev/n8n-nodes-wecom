import type { INodeProperties } from 'n8n-workflow';

const showOnly = { resource: ['meeting'], operation: ['muteMember'] };

export const muteMemberDescription: INodeProperties[] = [
	{
		displayName: '会议ID',
		name: 'meetingid',
		type: 'string',
		required: true,
		displayOptions: { show: showOnly },
		default: '',
		description: '会议唯一标识ID。<a href="https://developer.work.weixin.qq.com/document/path/98184" target="_blank">官方文档</a>',
	},
	{
		displayName: '操作类型',
		name: 'mute_action',
		type: 'options',
		required: true,
		displayOptions: { show: showOnly },
		options: [
			{ name: '静音', value: 1, description: '将成员设为静音状态' },
			{ name: '取消静音', value: 2, description: '取消成员的静音状态' },
		],
		default: 1,
		description: '静音操作类型',
	},
	{
		displayName: '目标成员',
		name: 'membersCollection',
		type: 'fixedCollection',
		required: true,
		displayOptions: { show: showOnly },
		default: {},
		placeholder: '添加成员',
		typeOptions: { multipleValues: true },
		description: '要操作的成员列表',
		options: [
			{
				displayName: '成员',
				name: 'members',
				values: [
					{
						displayName: '用户ID',
						name: 'userid',
						type: 'string',
						default: '',
						required: true,
						description: '成员的企业微信UserID',
					},
				],
			},
		],
	},
];
