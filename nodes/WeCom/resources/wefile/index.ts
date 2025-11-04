import type { INodeProperties } from 'n8n-workflow';
import { createSpaceDescription } from './createSpace';
import { renameSpaceDescription } from './renameSpace';
import { deleteSpaceDescription } from './deleteSpace';
import { getSpaceInfoDescription } from './getSpaceInfo';
import { addSpaceMembersDescription } from './addSpaceMembers';
import { removeSpaceMembersDescription } from './removeSpaceMembers';
import { spaceSecuritySettingsDescription } from './spaceSecuritySettings';
import { getSpaceInviteLinkDescription } from './getSpaceInviteLink';
import { getFileListDescription } from './getFileList';
import { uploadFileDescription } from './uploadFile';
import { downloadFileDescription } from './downloadFile';
import { createFolderDescription } from './createFolder';
import { renameFileDescription } from './renameFile';
import { moveFileDescription } from './moveFile';
import { deleteFileDescription } from './deleteFile';
import { getFileInfoDescription } from './getFileInfo';
import { addFileMembersDescription } from './addFileMembers';
import { removeFileMembersDescription } from './removeFileMembers';
import { fileShareSettingsDescription } from './fileShareSettings';
import { getFileShareLinkDescription } from './getFileShareLink';
import { getFilePermissionsDescription } from './getFilePermissions';
import { fileSecuritySettingsDescription } from './fileSecuritySettings';

const showOnlyForWefile = {
	resource: ['wefile'],
};

export const wefileDescription: INodeProperties[] = [
	{
		displayName: '操作',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: showOnlyForWefile,
		},
		options: [
		{
			name: '创建空间',
			value: 'createSpace',
			description: '创建一个新的微盘空间',
			action: '创建空间',
		},
		{
			name: '创建文件夹',
			value: 'createFolder',
			description: '在微盘空间中创建文件夹',
			action: '创建文件夹',
		},
		{
			name: '获取空间信息',
			value: 'getSpaceInfo',
			description: '获取微盘空间的详细信息',
			action: '获取空间信息',
		},
		{
			name: '获取空间邀请链接',
			value: 'getSpaceInviteLink',
			description: '获取空间的邀请链接',
			action: '获取空间邀请链接',
		},
		{
			name: '获取文件分享链接',
			value: 'getFileShareLink',
			description: '获取文件的分享链接',
			action: '获取文件分享链接',
		},
		{
			name: '获取文件列表',
			value: 'getFileList',
			description: '获取空间或文件夹中的文件列表',
			action: '获取文件列表',
		},
		{
			name: '获取文件权限信息',
			value: 'getFilePermissions',
			description: '获取文件的权限信息',
			action: '获取文件权限信息',
		},
		{
			name: '获取文件信息',
			value: 'getFileInfo',
			description: '获取文件或文件夹的详细信息',
			action: '获取文件信息',
		},
		{
			name: '空间安全设置',
			value: 'spaceSecuritySettings',
			description: '设置空间的安全配置',
			action: '空间安全设置',
		},
		{
			name: '删除空间',
			value: 'deleteSpace',
			description: '解散并删除微盘空间',
			action: '删除空间',
		},
		{
			name: '删除文件',
			value: 'deleteFile',
			description: '删除文件或文件夹',
			action: '删除文件',
		},
		{
			name: '上传文件',
			value: 'uploadFile',
			description: '上传文件到微盘空间',
			action: '上传文件',
		},
		{
			name: '添加空间成员',
			value: 'addSpaceMembers',
			description: '向空间添加成员或部门',
			action: '添加空间成员',
		},
		{
			name: '添加文件成员',
			value: 'addFileMembers',
			description: '向文件添加成员权限',
			action: '添加文件成员',
		},
		{
			name: '文件安全设置',
			value: 'fileSecuritySettings',
			description: '修改文件的安全设置',
			action: '文件安全设置',
		},
		{
			name: '文件分享设置',
			value: 'fileShareSettings',
			description: '设置文件的分享配置',
			action: '文件分享设置',
		},
		{
			name: '下载文件',
			value: 'downloadFile',
			description: '从微盘下载文件',
			action: '下载文件',
		},
		{
			name: '移除空间成员',
			value: 'removeSpaceMembers',
			description: '从空间移除成员或部门',
			action: '移除空间成员',
		},
		{
			name: '移除文件成员',
			value: 'removeFileMembers',
			description: '移除文件的成员权限',
			action: '移除文件成员',
		},
		{
			name: '移动文件',
			value: 'moveFile',
			description: '移动文件或文件夹到其他位置',
			action: '移动文件',
		},
		{
			name: '重命名空间',
			value: 'renameSpace',
			description: '重命名已有的微盘空间',
			action: '重命名空间',
		},
		{
			name: '重命名文件',
			value: 'renameFile',
			description: '重命名文件或文件夹',
			action: '重命名文件',
		},
	],
		default: 'getFileList',
	},
	...createSpaceDescription,
	...renameSpaceDescription,
	...deleteSpaceDescription,
	...getSpaceInfoDescription,
	...addSpaceMembersDescription,
	...removeSpaceMembersDescription,
	...spaceSecuritySettingsDescription,
	...getSpaceInviteLinkDescription,
	...getFileListDescription,
	...uploadFileDescription,
	...downloadFileDescription,
	...createFolderDescription,
	...renameFileDescription,
	...moveFileDescription,
	...deleteFileDescription,
	...getFileInfoDescription,
	...addFileMembersDescription,
	...removeFileMembersDescription,
	...fileShareSettingsDescription,
	...getFileShareLinkDescription,
	...getFilePermissionsDescription,
	...fileSecuritySettingsDescription,
];