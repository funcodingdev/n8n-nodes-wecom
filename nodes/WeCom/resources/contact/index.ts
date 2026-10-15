import type { INodeProperties } from 'n8n-workflow';
import { contactRuleDescription, contactRuleOperationOptions } from './contactRuleOps';
import { getUserDescription } from './getUser';
import { createUserDescription } from './createUser';
import { updateUserDescription } from './updateUser';
import { deleteUserDescription } from './deleteUser';
import { batchDeleteUserDescription } from './batchDeleteUser';
import { listUsersDescription } from './listUsers';
import { listUsersDetailDescription } from './listUsersDetail';
import { listUserIdsDescription } from './listUserIds';
import { getUserIdByMobileDescription } from './getUserIdByMobile';
import { getUserIdByEmailDescription } from './getUserIdByEmail';
import { inviteUserDescription } from './inviteUser';
import { getJoinQrCodeDescription } from './getJoinQrCode';
import { getDepartmentDescription } from './getDepartment';
import { getDepartmentDetailDescription } from './getDepartmentDetail';
import { getSubDepartmentIdsDescription } from './getSubDepartmentIds';
import { createDepartmentDescription } from './createDepartment';
import { updateDepartmentDescription } from './updateDepartment';
import { deleteDepartmentDescription } from './deleteDepartment';
import { convertToOpenidDescription } from './convertToOpenid';
import { convertToUseridDescription } from './convertToUserid';
import { convertTmpExternalUserIdDescription } from './convertTmpExternalUserId';
import { authSuccDescription } from './authSucc';
import { getTagListDescription } from './getTagList';
import { getTagDescription } from './getTag';
import { createTagDescription } from './createTag';
import { updateTagDescription } from './updateTag';
import { deleteTagDescription } from './deleteTag';
import { addTagUsersDescription } from './addTagUsers';
import { delTagUsersDescription } from './delTagUsers';
import { batchSyncUserDescription } from './batchSyncUser';
import { batchReplaceUserDescription } from './batchReplaceUser';
import { batchReplaceDepartmentDescription } from './batchReplaceDepartment';
import { getAsyncResultDescription } from './getAsyncResult';
import { exportSimpleUserDescription } from './exportSimpleUser';
import { exportUserDescription } from './exportUser';
import { exportDepartmentDescription } from './exportDepartment';
import { exportTagUserDescription } from './exportTagUser';
import { getExportResultDescription } from './getExportResult';

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
			// 成员管理
			{
				name: '[成员管理] 创建成员',
				value: 'createUser',
				action: '创建成员',
				description: '创建企业成员',
			},
			{
				name: '[成员管理] 读取成员',
				value: 'getUser',
				action: '获取成员信息',
				description: '读取成员详细信息',
			},
			{
				name: '[成员管理] 更新成员',
				value: 'updateUser',
				action: '更新成员',
				description: '更新企业成员信息',
			},
			{
				name: '[成员管理] 删除成员',
				value: 'deleteUser',
				action: '删除成员',
				description: '删除企业成员',
			},
			{
				name: '[成员管理] 批量删除成员',
				value: 'batchDeleteUser',
				action: '批量删除成员',
				description: '批量删除企业成员',
			},
			{
				name: '[成员管理] 获取部门成员',
				value: 'listUsers',
				action: '获取部门成员列表',
				description: '获取部门成员列表（仅包含基本信息）',
			},
			{
				name: '[成员管理] 获取部门成员详情',
				value: 'listUsersDetail',
				action: '获取部门成员详情列表',
				description: '获取部门成员列表（包含完整信息）',
			},
			{
				name: '[成员管理] UserID转OpenID',
				value: 'convertToOpenid',
				action: 'Userid 转 openid',
				description: '将企业成员的 userid 转换为 openid',
			},
			{
				name: '[成员管理] OpenID转UserID',
				value: 'convertToUserid',
				action: 'Openid 转 userid',
				description: '将 openid 转换为企业成员的 userid',
			},
			{
				name: '[成员管理] 登录二次验证',
				value: 'authSucc',
				action: '验证成员成功加入企业',
				description: '验证成员成功加入企业（登录二次验证）',
			},
			{
				name: '[成员管理] 邀请成员',
				value: 'inviteUser',
				action: '邀请成员',
				description: '邀请成员关注企业微信',
			},
			{
				name: '[成员管理] 获取加入企业二维码',
				value: 'getJoinQrCode',
				action: '获取加入企业二维码',
				description: '获取企业加入二维码',
			},
			{
				name: '[成员管理] 手机号获取userid',
				value: 'getUserIdByMobile',
				action: '手机号获取 User ID',
				description: '通过手机号获取成员UserID',
			},
			{
				name: '[成员管理] 邮箱获取userid',
				value: 'getUserIdByEmail',
				action: '邮箱获取 User ID',
				description: '通过邮箱获取成员UserID',
			},
			{
				name: '[成员管理] 获取成员ID列表',
				value: 'listUserIds',
				action: '获取成员ID列表',
				description: '获取企业所有成员的UserID列表，支持分页',
			},
			{
				name: '[成员管理] 临时外部联系人ID转换',
				value: 'convertTmpExternalUserId',
				action: '临时外部联系人ID转换',
				description: '将临时外部联系人ID转换为正式外部联系人ID',
			},
			// 部门管理
			{
				name: '[部门管理] 创建部门',
				value: 'createDepartment',
				action: '创建部门',
				description: '创建企业部门',
			},
			{
				name: '[部门管理] 更新部门',
				value: 'updateDepartment',
				action: '更新部门',
				description: '更新部门信息',
			},
			{
				name: '[部门管理] 删除部门',
				value: 'deleteDepartment',
				action: '删除部门',
				description: '删除企业部门',
			},
			{
				name: '[部门管理] 获取部门列表',
				value: 'getDepartment',
				action: '获取部门列表',
				description: '获取企业部门列表',
			},
			{
				name: '[部门管理] 获取子部门ID列表',
				value: 'getSubDepartmentIds',
				action: '获取子部门ID列表',
				description: '获取指定部门的所有子部门ID',
			},
			{
				name: '[部门管理] 获取单个部门详情',
				value: 'getDepartmentDetail',
				action: '获取单个部门详情',
				description: '获取指定部门的详细信息',
			},
			// 标签管理
			{
				name: '[标签管理] 创建标签',
				value: 'createTag',
				action: '创建标签',
				description: '创建企业标签',
			},
			{
				name: '[标签管理] 更新标签名字',
				value: 'updateTag',
				action: '更新标签名字',
				description: '更新标签名称',
			},
			{
				name: '[标签管理] 删除标签',
				value: 'deleteTag',
				action: '删除标签',
				description: '删除企业标签',
			},
			{
				name: '[标签管理] 获取标签成员',
				value: 'getTag',
				action: '获取标签成员',
				description: '获取标签成员列表',
			},
			{
				name: '[标签管理] 增加标签成员',
				value: 'addTagUsers',
				action: '增加标签成员',
				description: '为标签添加成员',
			},
			{
				name: '[标签管理] 删除标签成员',
				value: 'delTagUsers',
				action: '删除标签成员',
				description: '从标签中移除成员',
			},
			{
				name: '[标签管理] 获取标签列表',
				value: 'getTagList',
				action: '获取标签列表',
				description: '获取企业标签列表',
			},
			// 异步导入接口
			{
				name: '[异步导入] 增量更新成员',
				value: 'batchSyncUser',
				action: '增量更新成员',
				description: '异步增量更新成员',
			},
			{
				name: '[异步导入] 全量覆盖成员',
				value: 'batchReplaceUser',
				action: '全量覆盖成员',
				description: '异步全量覆盖成员',
			},
			{
				name: '[异步导入] 全量覆盖部门',
				value: 'batchReplaceDepartment',
				action: '全量覆盖部门',
				description: '异步全量覆盖部门',
			},
			{
				name: '[异步导入] 获取异步任务结果',
				value: 'getAsyncResult',
				action: '获取异步任务结果',
				description: '获取异步任务执行结果',
			},
			// 异步导出接口
			{
				name: '[异步导出] 导出成员',
				value: 'exportSimpleUser',
				action: '导出成员',
				description: '异步导出成员列表（简略信息）',
			},
			{
				name: '[异步导出] 导出成员详情',
				value: 'exportUser',
				action: '导出成员详情',
				description: '异步导出成员列表（完整信息）',
			},
			{
				name: '[异步导出] 导出部门',
				value: 'exportDepartment',
				action: '导出部门',
				description: '异步导出部门列表',
			},
			{
				name: '[异步导出] 导出标签成员',
				value: 'exportTagUser',
				action: '导出标签成员',
				description: '异步导出标签成员列表',
			},
			{
				name: '[异步导出] 获取导出结果',
				value: 'getExportResult',
				action: '获取导出结果',
				description: '获取异步导出任务结果',
			},
			...contactRuleOperationOptions,
		],
		default: 'getUser',
	},
	...getUserDescription,
	...contactRuleDescription,
	...createUserDescription,
	...updateUserDescription,
	...deleteUserDescription,
	...batchDeleteUserDescription,
	...listUsersDescription,
	...listUsersDetailDescription,
	...listUserIdsDescription,
	...getUserIdByMobileDescription,
	...getUserIdByEmailDescription,
	...inviteUserDescription,
	...getJoinQrCodeDescription,
	...getDepartmentDescription,
	...getDepartmentDetailDescription,
	...getSubDepartmentIdsDescription,
	...createDepartmentDescription,
	...updateDepartmentDescription,
	...deleteDepartmentDescription,
	...convertToOpenidDescription,
	...convertToUseridDescription,
	...convertTmpExternalUserIdDescription,
	...authSuccDescription,
	...getTagListDescription,
	...getTagDescription,
	...createTagDescription,
	...updateTagDescription,
	...deleteTagDescription,
	...addTagUsersDescription,
	...delTagUsersDescription,
	...batchSyncUserDescription,
	...batchReplaceUserDescription,
	...batchReplaceDepartmentDescription,
	...getAsyncResultDescription,
	...exportSimpleUserDescription,
	...exportUserDescription,
	...exportDepartmentDescription,
	...exportTagUserDescription,
	...getExportResultDescription,
];

