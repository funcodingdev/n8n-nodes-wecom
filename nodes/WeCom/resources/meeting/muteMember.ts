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
		description:
			'会议 ID。<a href="https://developer.work.weixin.qq.com/document/path/98184" target="_blank">官方文档</a>',
	},
	{
		displayName: '操作类型',
		name: 'mute_action',
		type: 'options',
		required: true,
		displayOptions: { show: showOnly },
		options: [
			{ name: '静音', value: 1, description: 'option=true' },
			{ name: '取消静音', value: 2, description: 'option=false' },
		],
		default: 1,
		description: '映射为 option 布尔值',
	},
	{
		displayName: '被操作用户',
		name: 'membersCollection',
		type: 'fixedCollection',
		required: true,
		displayOptions: { show: showOnly },
		default: {},
		placeholder: '添加成员',
		typeOptions: { multipleValues: true },
		description: 'operated_user：会中临时 ID + 设备类型',
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
						description:
							'instance_id：0 PSTN / 1 PC / 2 Mac / 3 Android / 4 iOS / 5 Web 等',
					},
				],
			},
		],
	},
];
