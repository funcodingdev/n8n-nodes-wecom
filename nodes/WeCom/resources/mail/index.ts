import type { INodeProperties } from 'n8n-workflow';

// 发送邮件
import { sendMailDescription } from './sendMail';
import { sendScheduleMailDescription } from './sendScheduleMail';
import { sendMeetingMailDescription } from './sendMeetingMail';

// 获取接收的邮件
import { getMailListDescription } from './getMailList';
import { getMailContentDescription } from './getMailContent';

// 管理应用邮箱账号
import { updateAppMailboxDescription } from './updateAppMailbox';
import { getAppMailboxDescription } from './getAppMailbox';

// 管理邮件群组
import { createMailGroupDescription } from './createMailGroup';
import { updateMailGroupDescription } from './updateMailGroup';
import { deleteMailGroupDescription } from './deleteMailGroup';
import { getMailGroupDescription } from './getMailGroup';
import { searchMailGroupDescription } from './searchMailGroup';

// 管理公共邮箱
import { createPublicMailboxDescription } from './createPublicMailbox';
import { updatePublicMailboxDescription } from './updatePublicMailbox';
import { deletePublicMailboxDescription } from './deletePublicMailbox';
import { getPublicMailboxDescription } from './getPublicMailbox';
import { searchPublicMailboxDescription } from './searchPublicMailbox';

// 客户端专用密码
import { getClientPasswordListDescription } from './getClientPasswordList';
import { deleteClientPasswordDescription } from './deleteClientPassword';

// 高级功能账号管理
import { allocateMailAdvancedAccountDescription } from './allocateMailAdvancedAccount';
import { deallocateMailAdvancedAccountDescription } from './deallocateMailAdvancedAccount';
import { getMailAdvancedAccountListDescription } from './getMailAdvancedAccountList';
import { toggleMailboxStatusDescription } from './toggleMailboxStatus';

// 其他邮件客户端登录设置
import { getUserMailAttributeDescription } from './getUserMailAttribute';
import { updateUserMailAttributeDescription } from './updateUserMailAttribute';
import { getMailUnreadCountDescription } from './getMailUnreadCount';

const showOnlyForMail = {
	resource: ['mail'],
};

export const mailDescription: INodeProperties[] = [
	{
		displayName: '操作',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: showOnlyForMail,
		},
		// eslint-disable-next-line n8n-nodes-base/node-param-options-type-unsorted-items
		options: [
			// 发送邮件
			{
				name: '发送普通邮件',
				value: 'sendMail',
				action: '发送普通邮件',
			},
			{
				name: '发送日程邮件',
				value: 'sendScheduleMail',
				action: '发送日程邮件',
				description: '发送带日程的邮件',
			},
			{
				name: '发送会议邮件',
				value: 'sendMeetingMail',
				action: '发送会议邮件',
				description: '发送会议邀请邮件',
			},
			// 获取接收的邮件
			{
				name: '获取收件箱邮件列表',
				value: 'getMailList',
				action: '获取邮件列表',
				description: '获取收件箱的邮件列表',
			},
			{
				name: '获取邮件内容',
				value: 'getMailContent',
				action: '获取邮件内容',
				description: '获取邮件的详细内容',
			},
			// 管理应用邮箱账号
			{
				name: '更新应用邮箱账号',
				value: 'updateAppMailbox',
				action: '更新应用邮箱',
				description: '更新应用邮箱账号信息',
			},
			{
				name: '查询应用邮箱账号',
				value: 'getAppMailbox',
				action: '查询应用邮箱',
				description: '查询应用邮箱账号详情',
			},
			// 管理邮件群组
			{
				name: '创建邮件群组',
				value: 'createMailGroup',
				action: '创建邮件群组',
				description: '创建新的邮件群组',
			},
			{
				name: '更新邮件群组',
				value: 'updateMailGroup',
				action: '更新邮件群组',
				description: '更新邮件群组信息',
			},
			{
				name: '删除邮件群组',
				value: 'deleteMailGroup',
				action: '删除邮件群组',
			},
			{
				name: '获取邮件群组详情',
				value: 'getMailGroup',
				action: '获取群组详情',
				description: '获取邮件群组详细信息',
			},
			{
				name: '模糊搜索邮件群组',
				value: 'searchMailGroup',
				action: '搜索邮件群组',
			},
			// 管理公共邮箱
			{
				name: '创建公共邮箱',
				value: 'createPublicMailbox',
				action: '创建公共邮箱',
				description: '创建新的公共邮箱',
			},
			{
				name: '更新公共邮箱',
				value: 'updatePublicMailbox',
				action: '更新公共邮箱',
				description: '更新公共邮箱信息',
			},
			{
				name: '删除公共邮箱',
				value: 'deletePublicMailbox',
				action: '删除公共邮箱',
			},
			{
				name: '获取公共邮箱详情',
				value: 'getPublicMailbox',
				action: '获取公共邮箱详情',
				description: '获取公共邮箱详细信息',
			},
			{
				name: '模糊搜索公共邮箱',
				value: 'searchPublicMailbox',
				action: '搜索公共邮箱',
			},
			// 客户端专用密码
			{
				name: '获取客户端专用密码列表',
				value: 'getClientPasswordList',
				action: '获取专用密码列表',
			},
			{
				name: '删除客户端专用密码',
				value: 'deleteClientPassword',
				action: '删除专用密码',
			},
			// 高级功能账号管理
			{
				name: '分配高级功能账号',
				value: 'allocateMailAdvancedAccount',
				action: '分配高级账号',
				description: '为邮箱分配高级功能账号',
			},
			{
				name: '取消高级功能账号',
				value: 'deallocateMailAdvancedAccount',
				action: '取消高级账号',
				description: '取消邮箱的高级功能账号',
			},
			{
				name: '获取高级功能账号列表',
				value: 'getMailAdvancedAccountList',
				action: '获取高级账号列表',
				description: '获取已分配的高级功能账号列表',
			},
			{
				name: '禁用/启用邮箱账号',
				value: 'toggleMailboxStatus',
				action: '禁用/启用邮箱',
				description: '禁用或启用邮箱账号',
			},
			// 其他邮件客户端登录设置
			{
				name: '获取用户功能属性',
				value: 'getUserMailAttribute',
				action: '获取用户功能属性',
				description: '获取用户的邮件功能属性',
			},
			{
				name: '更改用户功能属性',
				value: 'updateUserMailAttribute',
				action: '更改用户功能属性',
				description: '更改用户的邮件功能属性',
			},
			{
				name: '获取邮件未读数',
				value: 'getMailUnreadCount',
				action: '获取邮件未读数',
				description: '获取邮箱的未读邮件数量',
			},
		],
		default: 'sendMail',
	},
	// 发送邮件
	...sendMailDescription,
	...sendScheduleMailDescription,
	...sendMeetingMailDescription,
	// 获取接收的邮件
	...getMailListDescription,
	...getMailContentDescription,
	// 管理应用邮箱账号
	...updateAppMailboxDescription,
	...getAppMailboxDescription,
	// 管理邮件群组
	...createMailGroupDescription,
	...updateMailGroupDescription,
	...deleteMailGroupDescription,
	...getMailGroupDescription,
	...searchMailGroupDescription,
	// 管理公共邮箱
	...createPublicMailboxDescription,
	...updatePublicMailboxDescription,
	...deletePublicMailboxDescription,
	...getPublicMailboxDescription,
	...searchPublicMailboxDescription,
	// 客户端专用密码
	...getClientPasswordListDescription,
	...deleteClientPasswordDescription,
	// 高级功能账号管理
	...allocateMailAdvancedAccountDescription,
	...deallocateMailAdvancedAccountDescription,
	...getMailAdvancedAccountListDescription,
	...toggleMailboxStatusDescription,
	// 其他邮件客户端登录设置
	...getUserMailAttributeDescription,
	...updateUserMailAttributeDescription,
	...getMailUnreadCountDescription,
];

