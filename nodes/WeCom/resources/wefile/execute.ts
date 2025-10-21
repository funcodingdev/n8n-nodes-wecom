import type { IExecuteFunctions, INodeExecutionData } from 'n8n-workflow';
import { weComApiRequest } from '../../shared/transport';

export async function executeWefile(
	this: IExecuteFunctions,
	operation: string,
	items: INodeExecutionData[],
): Promise<INodeExecutionData[]> {
	const returnData: INodeExecutionData[] = [];

	for (let i = 0; i < items.length; i++) {
		try {
			let responseData;

			// 空间管理操作
			if (operation === 'createSpace') {
				const spaceName = this.getNodeParameter('spaceName', i) as string;
				const authInfo = this.getNodeParameter('authInfo', i) as object;

				const body = {
					space_name: spaceName,
					auth_info: authInfo,
				};

				responseData = await weComApiRequest.call(
					this,
					'POST',
					'/cgi-bin/wedrive/space_create',
					body,
				);
			} else if (operation === 'renameSpace') {
				const spaceId = this.getNodeParameter('spaceId', i) as string;
				const spaceName = this.getNodeParameter('spaceName', i) as string;

				const body = {
					spaceid: spaceId,
					space_name: spaceName,
				};

				responseData = await weComApiRequest.call(
					this,
					'POST',
					'/cgi-bin/wedrive/space_rename',
					body,
				);
			} else if (operation === 'deleteSpace') {
				const spaceId = this.getNodeParameter('spaceId', i) as string;

				const body = {
					spaceid: spaceId,
				};

				responseData = await weComApiRequest.call(
					this,
					'POST',
					'/cgi-bin/wedrive/space_dismiss',
					body,
				);
			} else if (operation === 'getSpaceInfo') {
				const spaceId = this.getNodeParameter('spaceId', i) as string;

				const body = {
					spaceid: spaceId,
				};

				responseData = await weComApiRequest.call(
					this,
					'POST',
					'/cgi-bin/wedrive/space_info',
					body,
				);
			}
			// 空间权限管理
			else if (operation === 'addSpaceMembers') {
				const spaceId = this.getNodeParameter('spaceId', i) as string;
				const authInfo = this.getNodeParameter('authInfo', i) as object;

				const body = {
					spaceid: spaceId,
					auth_info: authInfo,
				};

				responseData = await weComApiRequest.call(
					this,
					'POST',
					'/cgi-bin/wedrive/space_acl_add',
					body,
				);
			} else if (operation === 'removeSpaceMembers') {
				const spaceId = this.getNodeParameter('spaceId', i) as string;
				const authInfo = this.getNodeParameter('authInfo', i) as object;

				const body = {
					spaceid: spaceId,
					auth_info: authInfo,
				};

				responseData = await weComApiRequest.call(
					this,
					'POST',
					'/cgi-bin/wedrive/space_acl_del',
					body,
				);
			} else if (operation === 'spaceSecuritySettings') {
				const spaceId = this.getNodeParameter('spaceId', i) as string;
				const enableWatermark = this.getNodeParameter('enableWatermark', i) as boolean;
				const addMemberOnlyAdmin = this.getNodeParameter('addMemberOnlyAdmin', i) as boolean;
				const enableShareUrl = this.getNodeParameter('enableShareUrl', i) as boolean;
				const shareUrlNoApprove = this.getNodeParameter('shareUrlNoApprove', i) as boolean;

				const body = {
					spaceid: spaceId,
					enable_watermark: enableWatermark,
					add_member_only_admin: addMemberOnlyAdmin,
					enable_share_url: enableShareUrl,
					share_url_no_approve: shareUrlNoApprove,
				};

				responseData = await weComApiRequest.call(
					this,
					'POST',
					'/cgi-bin/wedrive/space_setting',
					body,
				);
			} else if (operation === 'getSpaceInviteLink') {
				const spaceId = this.getNodeParameter('spaceId', i) as string;

				const body = {
					spaceid: spaceId,
				};

				responseData = await weComApiRequest.call(
					this,
					'POST',
					'/cgi-bin/wedrive/space_share',
					body,
				);
			}
			// 文件管理操作
			else if (operation === 'getFileList') {
				const spaceId = this.getNodeParameter('spaceId', i) as string;
				const fatherId = this.getNodeParameter('fatherId', i, '') as string;
				const sortType = this.getNodeParameter('sortType', i, 0) as number;
				const start = this.getNodeParameter('start', i, 0) as number;
				const limit = this.getNodeParameter('limit', i, 100) as number;

				const body: {
					spaceid: string;
					sort_type: number;
					start: number;
					limit: number;
					fatherid?: string;
				} = {
					spaceid: spaceId,
					sort_type: sortType,
					start: start,
					limit: limit,
				};

				if (fatherId) {
					body.fatherid = fatherId;
				}

				responseData = await weComApiRequest.call(
					this,
					'POST',
					'/cgi-bin/wedrive/file_list',
					body,
				);
			} else if (operation === 'uploadFile') {
				const spaceId = this.getNodeParameter('spaceId', i) as string;
				const fatherId = this.getNodeParameter('fatherId', i, '') as string;
				const fileName = this.getNodeParameter('fileName', i) as string;
				const binaryPropertyName = this.getNodeParameter('binaryPropertyName', i) as string;

				const dataBuffer = await this.helpers.getBinaryDataBuffer(i, binaryPropertyName);

				const formData = {
					spaceid: spaceId,
					fatherid: fatherId || '',
					file_name: fileName,
					file: {
						value: dataBuffer,
						options: {
							filename: fileName,
							contentType: 'application/octet-stream',
						},
					},
				};

				responseData = await weComApiRequest.call(
					this,
					'POST',
					'/cgi-bin/wedrive/file_upload',
					formData,
					{},
					{ multipart: true },
				);
			} else if (operation === 'downloadFile') {
				const fileId = this.getNodeParameter('fileId', i) as string;

				const body = {
					fileid: fileId,
				};

				responseData = await weComApiRequest.call(
					this,
					'POST',
					'/cgi-bin/wedrive/file_download',
					body,
				);

				// Return download URL info
				// The actual file download can be handled by HTTP Request node using the download_url
			} else if (operation === 'createFolder') {
				const spaceId = this.getNodeParameter('spaceId', i) as string;
				const fatherId = this.getNodeParameter('fatherId', i, '') as string;
				const folderName = this.getNodeParameter('folderName', i) as string;

				const body: {
					spaceid: string;
					file_name: string;
					fatherid?: string;
				} = {
					spaceid: spaceId,
					file_name: folderName,
				};

				if (fatherId) {
					body.fatherid = fatherId;
				}

				responseData = await weComApiRequest.call(
					this,
					'POST',
					'/cgi-bin/wedrive/file_create',
					body,
				);
			} else if (operation === 'renameFile') {
				const fileId = this.getNodeParameter('fileId', i) as string;
				const newName = this.getNodeParameter('newName', i) as string;

				const body = {
					fileid: fileId,
					new_name: newName,
				};

				responseData = await weComApiRequest.call(
					this,
					'POST',
					'/cgi-bin/wedrive/file_rename',
					body,
				);
			} else if (operation === 'moveFile') {
				const fileIds = this.getNodeParameter('fileIds', i) as string[];
				const fatherId = this.getNodeParameter('fatherId', i) as string;
				const replace = this.getNodeParameter('replace', i, false) as boolean;

				const body = {
					fileid: fileIds,
					fatherid: fatherId,
					replace: replace,
				};

				responseData = await weComApiRequest.call(
					this,
					'POST',
					'/cgi-bin/wedrive/file_move',
					body,
				);
			} else if (operation === 'deleteFile') {
				const fileIds = this.getNodeParameter('fileIds', i) as string[];

				const body = {
					fileid: fileIds,
				};

				responseData = await weComApiRequest.call(
					this,
					'POST',
					'/cgi-bin/wedrive/file_delete',
					body,
				);
			} else if (operation === 'getFileInfo') {
				const fileId = this.getNodeParameter('fileId', i) as string;

				const body = {
					fileid: fileId,
				};

				responseData = await weComApiRequest.call(
					this,
					'POST',
					'/cgi-bin/wedrive/file_info',
					body,
				);
			}
			// 文件权限管理
			else if (operation === 'addFileMembers') {
				const fileId = this.getNodeParameter('fileId', i) as string;
				const authInfo = this.getNodeParameter('authInfo', i) as object;

				const body = {
					fileid: fileId,
					auth_info: authInfo,
				};

				responseData = await weComApiRequest.call(
					this,
					'POST',
					'/cgi-bin/wedrive/file_acl_add',
					body,
				);
			} else if (operation === 'removeFileMembers') {
				const fileId = this.getNodeParameter('fileId', i) as string;
				const authInfo = this.getNodeParameter('authInfo', i) as object;

				const body = {
					fileid: fileId,
					auth_info: authInfo,
				};

				responseData = await weComApiRequest.call(
					this,
					'POST',
					'/cgi-bin/wedrive/file_acl_del',
					body,
				);
			} else if (operation === 'fileShareSettings') {
				const fileId = this.getNodeParameter('fileId', i) as string;
				const shareScope = this.getNodeParameter('shareScope', i) as number;
				const authScope = this.getNodeParameter('authScope', i) as number;

				const body = {
					fileid: fileId,
					share_scope: shareScope,
					auth_scope: authScope,
				};

				responseData = await weComApiRequest.call(
					this,
					'POST',
					'/cgi-bin/wedrive/file_setting',
					body,
				);
			} else if (operation === 'getFileShareLink') {
				const fileId = this.getNodeParameter('fileId', i) as string;

				const body = {
					fileid: fileId,
				};

				responseData = await weComApiRequest.call(
					this,
					'POST',
					'/cgi-bin/wedrive/file_share',
					body,
				);
			} else if (operation === 'getFilePermissions') {
				const fileId = this.getNodeParameter('fileId', i) as string;

				const body = {
					fileid: fileId,
				};

				responseData = await weComApiRequest.call(
					this,
					'POST',
					'/cgi-bin/wedrive/file_acl_list',
					body,
				);
			} else if (operation === 'fileSecuritySettings') {
				const fileId = this.getNodeParameter('fileId', i) as string;
				const enableWatermark = this.getNodeParameter('enableWatermark', i) as boolean;
				const addMemberOnlyAdmin = this.getNodeParameter('addMemberOnlyAdmin', i) as boolean;
				const enableShareUrl = this.getNodeParameter('enableShareUrl', i) as boolean;
				const shareUrlNoApprove = this.getNodeParameter('shareUrlNoApprove', i) as boolean;

				const body = {
					fileid: fileId,
					enable_watermark: enableWatermark,
					add_member_only_admin: addMemberOnlyAdmin,
					enable_share_url: enableShareUrl,
					share_url_no_approve: shareUrlNoApprove,
				};

				responseData = await weComApiRequest.call(
					this,
					'POST',
					'/cgi-bin/wedrive/file_secure_setting',
					body,
				);
			}

			if (responseData) {
				returnData.push({
					json: responseData,
					pairedItem: i,
				});
			}
		} catch (error) {
			if (this.continueOnFail()) {
				returnData.push({
					json: { error: (error as Error).message },
					pairedItem: i,
				});
				continue;
			}
			throw error;
		}
	}

	return returnData;
}