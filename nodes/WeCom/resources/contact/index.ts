import type { INodeProperties } from 'n8n-workflow';
import { getUserDescription } from './getUser';
import { listUsersDescription } from './listUsers';
import { listUsersDetailDescription } from './listUsersDetail';
import { getDepartmentDescription } from './getDepartment';
import { convertToOpenidDescription } from './convertToOpenid';
import { convertToUseridDescription } from './convertToUserid';
import { getJoinQrcodeDescription } from './getJoinQrcode';
import { getActiveStatDescription } from './getActiveStat';
import { getTagListDescription } from './getTagList';
import { getTagDescription } from './getTag';

const showOnlyForContact = {
	resource: ['contact'],
};

export const contactDescription: INodeProperties[] = [
	{
		displayName: '操作',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: showOnlyForContact,
		},
		options: [
			{
				name: '获取成员信息',
				value: 'getUser',
				action: '获取成员信息',
				description: '读取成员详细信息',
			},
			{
				name: '获取部门成员（简化版）',
				value: 'listUsers',
				action: '获取部门成员列表',
				description: '获取部门成员列表（仅包含基本信息）',
			},
			{
				name: '获取部门成员（详细版）',
				value: 'listUsersDetail',
				action: '获取部门成员详情列表',
				description: '获取部门成员列表（包含完整信息）',
			},
			{
				name: '获取部门信息',
				value: 'getDepartment',
				action: '获取部门信息',
				description: '获取部门列表',
			},
			{
				name: 'UserID转OpenID',
				value: 'convertToOpenid',
				action: 'UserID转OpenID',
				description: '将企业成员的 userid 转换为 openid',
			},
			{
				name: 'OpenID转UserID',
				value: 'convertToUserid',
				action: 'OpenID转UserID',
				description: '将 openid 转换为企业成员的 userid',
			},
			{
				name: '获取加入企业二维码',
				value: 'getJoinQrcode',
				action: '获取加入企业二维码',
				description: '获取企业的加入二维码',
			},
			{
				name: '获取企业活跃成员数',
				value: 'getActiveStat',
				action: '获取企业活跃成员数',
				description: '获取企业指定日期的活跃成员数',
			},
			{
				name: '获取标签列表',
				value: 'getTagList',
				action: '获取标签列表',
				description: '获取企业标签列表',
			},
			{
				name: '获取标签成员',
				value: 'getTag',
				action: '获取标签成员',
				description: '获取标签成员列表',
			},
		],
		default: 'getUser',
	},
	...getUserDescription,
	...listUsersDescription,
	...listUsersDetailDescription,
	...getDepartmentDescription,
	...convertToOpenidDescription,
	...convertToUseridDescription,
	...getJoinQrcodeDescription,
	...getActiveStatDescription,
	...getTagListDescription,
	...getTagDescription,
];

