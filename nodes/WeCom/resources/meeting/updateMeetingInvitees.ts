import type { INodeProperties } from 'n8n-workflow';

const showOnly = { resource: ['meeting'], operation: ['updateMeetingInvitees'] };

export const updateMeetingInviteesDescription: INodeProperties[] = [
	{
		displayName: '说明',
		name: 'updateInviteesNotice',
		type: 'notice',
		displayOptions: { show: showOnly },
		default: '',
		description:
			'官方接口 set_invitees 为覆盖式设置完整受邀列表（非增量）。管理员须在列表中。<a href="https://developer.work.weixin.qq.com/document/path/98162" target="_blank">官方文档</a>',
	},
	{
		displayName: '会议ID',
		name: 'meetingid',
		type: 'string',
		required: true,
		displayOptions: { show: showOnly },
		default: '',
	},
	{
		displayName: '受邀成员UserID列表',
		name: 'invitee_userids',
		type: 'string',
		displayOptions: { show: showOnly },
		default: '',
		placeholder: 'admin,lisi,wangwu',
		description: 'invitees 完整列表，逗号分隔，最多 2000',
	},
	{
		displayName: '受邀成员',
		name: 'inviteesCollection',
		type: 'fixedCollection',
		displayOptions: { show: showOnly },
		default: {},
		placeholder: '添加成员',
		typeOptions: { multipleValues: true },
		description: '与上方列表合并去重',
		options: [
			{
				displayName: '成员',
				name: 'invitees',
				values: [
					{
						displayName: '用户ID',
						name: 'userid',
						type: 'string',
						default: '',
					},
				],
			},
		],
	},
];
