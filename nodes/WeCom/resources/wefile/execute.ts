import type { IExecuteFunctions, INodeExecutionData, IDataObject } from 'n8n-workflow';
import { weComApiRequest } from '../../shared/transport';
import { executeExtraHttpOp } from '../../shared/extraHttpOp';
import { wefileExtraHttpOpsById } from './extraHttpOps';

// 辅助函数：构建成员信息
function buildAuthInfo(members: IDataObject[]): IDataObject[] {
	return members.map((member) => {
		const info: IDataObject = { type: member.type };
		if (member.type === 1) {
			// 个人类型，userid 已经是字符串
			info.userid = member.userid;
		} else if (member.type === 2) {
			// 部门类型，departmentid 可能是字符串（从下拉列表获取）或数字
			const deptId = member.departmentid;
			info.departmentid = typeof deptId === 'string' ? parseInt(deptId, 10) : deptId;
		}
		if (member.auth !== undefined) {
			info.auth = member.auth;
		}
		return info;
	});
}

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
				const authInfoCollection = this.getNodeParameter('authInfoCollection', i, {}) as IDataObject;
				const spaceSubType = this.getNodeParameter('spaceSubType', i, 0) as number;

				const body: IDataObject = {
					space_name: spaceName,
					space_sub_type: spaceSubType,
				};

				// 处理权限信息（使用成员数组）
				if (authInfoCollection.members && Array.isArray(authInfoCollection.members)) {
					body.auth_info = buildAuthInfo(authInfoCollection.members as IDataObject[]);
				}

				responseData = await weComApiRequest.call(
					this,
					'POST',
					'/cgi-bin/wedrive/space_create',
					body,
				);
			} else if (operation === 'renameSpace') {
				const spaceId = this.getNodeParameter('spaceId', i) as string;
				const spaceName = this.getNodeParameter('spaceName', i) as string;

				responseData = await weComApiRequest.call(
					this,
					'POST',
					'/cgi-bin/wedrive/space_rename',
					{ spaceid: spaceId, space_name: spaceName },
				);
			} else if (operation === 'deleteSpace') {
				const spaceId = this.getNodeParameter('spaceId', i) as string;

				responseData = await weComApiRequest.call(
					this,
					'POST',
					'/cgi-bin/wedrive/space_dismiss',
					{ spaceid: spaceId },
				);
			} else if (operation === 'getSpaceInfo') {
				const spaceId = this.getNodeParameter('spaceId', i) as string;

				responseData = await weComApiRequest.call(
					this,
					'POST',
					'/cgi-bin/wedrive/space_info',
					{ spaceid: spaceId },
				);
			}
			// 空间权限管理
			else if (operation === 'addSpaceMembers') {
				const spaceId = this.getNodeParameter('spaceId', i) as string;
				const authInfoCollection = this.getNodeParameter('authInfoCollection', i, {}) as IDataObject;

				const body: IDataObject = { spaceid: spaceId };

				if (authInfoCollection.members && Array.isArray(authInfoCollection.members)) {
					body.auth_info = buildAuthInfo(authInfoCollection.members as IDataObject[]);
				}

				responseData = await weComApiRequest.call(
					this,
					'POST',
					'/cgi-bin/wedrive/space_acl_add',
					body,
				);
			} else if (operation === 'removeSpaceMembers') {
				const spaceId = this.getNodeParameter('spaceId', i) as string;
				const authInfoCollection = this.getNodeParameter('authInfoCollection', i, {}) as IDataObject;

				const body: IDataObject = { spaceid: spaceId };

				if (authInfoCollection.members && Array.isArray(authInfoCollection.members)) {
					body.auth_info = buildAuthInfo(authInfoCollection.members as IDataObject[]);
				}

				responseData = await weComApiRequest.call(
					this,
					'POST',
					'/cgi-bin/wedrive/space_acl_del',
					body,
				);
			} else if (operation === 'spaceSecuritySettings') {
				const spaceId = this.getNodeParameter('spaceId', i) as string;
				const enableWatermark = this.getNodeParameter('enableWatermark', i, false) as boolean;
				const addMemberOnlyAdmin = this.getNodeParameter('addMemberOnlyAdmin', i, false) as boolean;
				const enableShareUrl = this.getNodeParameter('enableShareUrl', i, true) as boolean;
				const shareUrlNoApprove = this.getNodeParameter('shareUrlNoApprove', i, false) as boolean;

				responseData = await weComApiRequest.call(
					this,
					'POST',
					'/cgi-bin/wedrive/space_setting',
					{
						spaceid: spaceId,
						enable_watermark: enableWatermark,
						add_member_only_admin: addMemberOnlyAdmin,
						enable_share_url: enableShareUrl,
						share_url_no_approve: shareUrlNoApprove,
					},
				);
			} else if (operation === 'getSpaceInviteLink') {
				const spaceId = this.getNodeParameter('spaceId', i) as string;

				responseData = await weComApiRequest.call(
					this,
					'POST',
					'/cgi-bin/wedrive/space_share',
					{ spaceid: spaceId },
				);
			}
			// 文件管理操作
			else if (operation === 'getFileList') {
				const spaceId = this.getNodeParameter('spaceId', i) as string;
				const fatherId = this.getNodeParameter('fatherId', i) as string;
				const sortType = this.getNodeParameter('sortType', i) as number;
				const start = this.getNodeParameter('start', i) as number;
				const limit = this.getNodeParameter('limit', i) as number;

				const body: IDataObject = {
					spaceid: spaceId,
					fatherid: fatherId || spaceId,
					sort_type: sortType,
					start,
					limit,
				};

				responseData = await weComApiRequest.call(
					this,
					'POST',
					'/cgi-bin/wedrive/file_list',
					body,
				);
			} else if (operation === 'uploadFile') {
				const locationMethod = this.getNodeParameter('locationMethod', i) as string;
				const fileName = this.getNodeParameter('fileName', i) as string;
				const contentMethod = this.getNodeParameter('contentMethod', i) as string;

				let base64Content = '';

				// 根据内容方式获取 Base64 编码的文件内容
				if (contentMethod === 'base64') {
					// 直接使用用户提供的 Base64 内容
					base64Content = this.getNodeParameter('base64Content', i) as string;
				} else {
					// 从二进制数据属性获取并转换为 Base64
					const binaryPropertyName = this.getNodeParameter('binaryPropertyName', i) as string;
					const dataBuffer = await this.helpers.getBinaryDataBuffer(i, binaryPropertyName);
					base64Content = dataBuffer.toString('base64');
				}

				// 验证文件大小（10MB = 10 * 1024 * 1024 bytes）
				const bufferSize = Buffer.from(base64Content, 'base64').length;
				const maxFileSize = 10 * 1024 * 1024;
				if (bufferSize > maxFileSize) {
					throw new Error(
						`文件大小超过限制（最大 10MB）。当前文件大小: ${(bufferSize / 1024 / 1024).toFixed(2)}MB`,
					);
				}

				const body: IDataObject = {
					file_name: fileName,
					file_base64_content: base64Content,
				};

				// 根据位置选择方式设置参数
				if (locationMethod === 'ticket') {
					// 使用 selected_ticket 方式
					const selectedTicket = this.getNodeParameter('selectedTicket', i) as string;
					body.selected_ticket = selectedTicket;
				} else {
					// 使用 spaceid/fatherid 方式
					const spaceId = this.getNodeParameter('spaceId', i) as string;
					const fatherId = this.getNodeParameter('fatherId', i, '') as string;

					body.spaceid = spaceId;
					body.fatherid = fatherId || spaceId; // 如果未指定 fatherId，使用 spaceId
				}

				responseData = await weComApiRequest.call(
					this,
					'POST',
					'/cgi-bin/wedrive/file_upload',
					body,
				);
			} else if (operation === 'downloadFile') {
				const downloadMethod = this.getNodeParameter('downloadMethod', i) as string;
				const body: IDataObject = {};

				// 根据下载方式设置参数
				if (downloadMethod === 'ticket') {
					// 使用 selected_ticket 方式
					const selectedTicket = this.getNodeParameter('selectedTicket', i) as string;
					body.selected_ticket = selectedTicket;
				} else {
					// 使用 fileid 方式
					const fileId = this.getNodeParameter('fileId', i) as string;
					body.fileid = fileId;
				}

				responseData = await weComApiRequest.call(
					this,
					'POST',
					'/cgi-bin/wedrive/file_download',
					body,
				);
			} else if (operation === 'createFolder') {
				const spaceId = this.getNodeParameter('spaceId', i) as string;
				const fatherId = this.getNodeParameter('fatherId', i, '') as string;
				const fileType = this.getNodeParameter('fileType', i) as number;
				const fileName = this.getNodeParameter('fileName', i) as string;

				const body: IDataObject = {
					spaceid: spaceId,
					fatherid: fatherId || spaceId,
					file_type: fileType,
					file_name: fileName,
				};

				responseData = await weComApiRequest.call(
					this,
					'POST',
					'/cgi-bin/wedrive/file_create',
					body,
				);
			} else if (operation === 'renameFile') {
				const fileId = this.getNodeParameter('fileId', i) as string;
				const newName = this.getNodeParameter('newName', i) as string;

				responseData = await weComApiRequest.call(
					this,
					'POST',
					'/cgi-bin/wedrive/file_rename',
					{ fileid: fileId, new_name: newName },
				);
			} else if (operation === 'moveFile') {
				const fileIdsStr = this.getNodeParameter('fileIds', i) as string;
				const fatherId = this.getNodeParameter('fatherId', i) as string;
				const replace = this.getNodeParameter('replace', i, false) as boolean;

				const fileIds = fileIdsStr.split(',').map((id) => id.trim()).filter((id) => id);

				responseData = await weComApiRequest.call(
					this,
					'POST',
					'/cgi-bin/wedrive/file_move',
					{ fileid: fileIds, fatherid: fatherId, replace },
				);
			} else if (operation === 'deleteFile') {
				const fileIdsStr = this.getNodeParameter('fileIds', i) as string;

				const fileIds = fileIdsStr.split(',').map((id) => id.trim()).filter((id) => id);

				responseData = await weComApiRequest.call(
					this,
					'POST',
					'/cgi-bin/wedrive/file_delete',
					{ fileid: fileIds },
				);
			} else if (operation === 'getFileInfo') {
				const fileId = this.getNodeParameter('fileId', i) as string;

				responseData = await weComApiRequest.call(
					this,
					'POST',
					'/cgi-bin/wedrive/file_info',
					{ fileid: fileId },
				);
			}
			// 文件权限管理
			else if (operation === 'addFileMembers') {
				const fileId = this.getNodeParameter('fileId', i) as string;
				const authInfoCollection = this.getNodeParameter('authInfoCollection', i, {}) as IDataObject;

				const body: IDataObject = { fileid: fileId };

				if (authInfoCollection.members && Array.isArray(authInfoCollection.members)) {
					body.auth_info = buildAuthInfo(authInfoCollection.members as IDataObject[]);
				}

				responseData = await weComApiRequest.call(
					this,
					'POST',
					'/cgi-bin/wedrive/file_acl_add',
					body,
				);
			} else if (operation === 'removeFileMembers') {
				const fileId = this.getNodeParameter('fileId', i) as string;
				const authInfoCollection = this.getNodeParameter('authInfoCollection', i, {}) as IDataObject;

				const body: IDataObject = { fileid: fileId };

				if (authInfoCollection.members && Array.isArray(authInfoCollection.members)) {
					body.auth_info = buildAuthInfo(authInfoCollection.members as IDataObject[]);
				}

				responseData = await weComApiRequest.call(
					this,
					'POST',
					'/cgi-bin/wedrive/file_acl_del',
					body,
				);
			} else if (operation === 'fileShareSettings') {
				const fileId = this.getNodeParameter('fileId', i) as string;
				const authScope = this.getNodeParameter('authScope', i) as number;
				const auth = this.getNodeParameter('auth', i, 0) as number;

				const body: IDataObject = {
					fileid: fileId,
					auth_scope: authScope,
				};

				// 只有当auth有值时才添加到body（保持原有权限状态）
				if (auth !== 0) {
					body.auth = auth;
				}

				responseData = await weComApiRequest.call(
					this,
					'POST',
					'/cgi-bin/wedrive/file_setting',
					body,
				);
			} else if (operation === 'getFileShareLink') {
				const fileId = this.getNodeParameter('fileId', i) as string;

				responseData = await weComApiRequest.call(
					this,
					'POST',
					'/cgi-bin/wedrive/file_share',
					{ fileid: fileId },
				);
			} else if (operation === 'getFilePermissions') {
				const fileId = this.getNodeParameter('fileId', i) as string;

				responseData = await weComApiRequest.call(
					this,
					'POST',
					'/cgi-bin/wedrive/file_acl_list',
					{ fileid: fileId },
				);
			} else if (operation === 'fileSecuritySettings') {
				const fileId = this.getNodeParameter('fileId', i) as string;
				const watermarkCollection = this.getNodeParameter('watermarkCollection', i, {}) as IDataObject;

				const body: IDataObject = {
					fileid: fileId,
				};

				// 处理水印设置
				if (watermarkCollection.watermark) {
					const watermark = watermarkCollection.watermark as IDataObject;
					const watermarkInfo: IDataObject = {};

					// 只有当字段有值时才添加到watermark对象
					if (watermark.text !== undefined && watermark.text !== '') {
						watermarkInfo.text = watermark.text;
					}
					if (watermark.marginType !== undefined) {
						watermarkInfo.margin_type = watermark.marginType;
					}
					if (watermark.showVisitorName !== undefined) {
						watermarkInfo.show_visitor_name = watermark.showVisitorName;
					}
					if (watermark.showText !== undefined) {
						watermarkInfo.show_text = watermark.showText;
					}

					// 只有当watermarkInfo有内容时才添加到body
					if (Object.keys(watermarkInfo).length > 0) {
						body.watermark = watermarkInfo;
					}
				}

				responseData = await weComApiRequest.call(
					this,
					'POST',
					'/cgi-bin/wedrive/file_secure_setting',
					body,
				);
			} else if (operation === 'assignVipAccounts') {
				const useridListCollection = this.getNodeParameter('useridList', i, {}) as IDataObject;

				// 提取成员列表
				let useridList: string[] = [];
				if (useridListCollection.members && Array.isArray(useridListCollection.members)) {
					useridList = (useridListCollection.members as IDataObject[]).map((member) => member.userid as string);
				}

				// 验证成员数量限制
				if (useridList.length > 100) {
					throw new Error(`单次操作最多支持100个成员，当前选择了${useridList.length}个成员`);
				}

				const body: IDataObject = {
					userid_list: useridList,
				};

				responseData = await weComApiRequest.call(
					this,
					'POST',
					'/cgi-bin/wedrive/vip/batch_add',
					body,
				);
			} else if (operation === 'revokeVipAccounts') {
				const useridListCollection = this.getNodeParameter('useridList', i, {}) as IDataObject;

				// 提取成员列表
				let useridList: string[] = [];
				if (useridListCollection.members && Array.isArray(useridListCollection.members)) {
					useridList = (useridListCollection.members as IDataObject[]).map((member) => member.userid as string);
				}

				// 验证成员数量限制
				if (useridList.length > 100) {
					throw new Error(`单次操作最多支持100个成员，当前选择了${useridList.length}个成员`);
				}

				const body: IDataObject = {
					userid_list: useridList,
				};

				responseData = await weComApiRequest.call(
					this,
					'POST',
					'/cgi-bin/wedrive/vip/batch_del',
					body,
				);
			} else if (operation === 'getVipAccountsList') {
				const cursor = this.getNodeParameter('cursor', i, '') as string;
				const limit = this.getNodeParameter('limit', i, 100) as number;

				const body: IDataObject = {
					limit,
				};

				// 只有当cursor有值时才添加到body
				if (cursor !== '') {
					body.cursor = cursor;
				}

				responseData = await weComApiRequest.call(
					this,
					'POST',
					'/cgi-bin/wedrive/vip/list',
					body,
				);
			} else if (operation === 'getProInfo') {
				responseData = await weComApiRequest.call(
					this,
					'POST',
					'/cgi-bin/wedrive/mng_pro_info',
					{},
				);
			} else if (operation === 'getCapacity') {
				// https://developer.work.weixin.qq.com/document/path/97880
				const spaceid = this.getNodeParameter('spaceId', i, '') as string;
				const body: IDataObject = {};
				if (spaceid) body.spaceid = spaceid;
				responseData = await weComApiRequest.call(
					this,
					'POST',
					'/cgi-bin/wedrive/mng_capacity',
					body,
				);
			} else if (operation === 'uploadInit') {
				const file_name = this.getNodeParameter('fileName', i) as string;
				const size = this.getNodeParameter('fileSize', i) as number;
				const block_sha_raw = this.getNodeParameter('block_sha', i) as string;
				const skip_push_card = this.getNodeParameter('skip_push_card', i, false) as boolean;
				const selectedTicket = this.getNodeParameter('selectedTicket', i, '') as string;
				const spaceId = this.getNodeParameter('spaceId', i, '') as string;
				const fatherId = this.getNodeParameter('fatherId', i, '') as string;
				const body: IDataObject = {
					file_name,
					size,
					block_sha: block_sha_raw
						.split(',')
						.map((s) => s.trim())
						.filter(Boolean),
					skip_push_card,
				};
				if (selectedTicket) {
					body.selected_ticket = selectedTicket;
				} else {
					body.spaceid = spaceId;
					body.fatherid = fatherId || spaceId;
				}
				responseData = await weComApiRequest.call(
					this,
					'POST',
					'/cgi-bin/wedrive/file_upload_init',
					body,
				);
			} else if (operation === 'uploadPart') {
				const upload_key = this.getNodeParameter('upload_key', i) as string;
				const index = this.getNodeParameter('part_index', i) as number;
				const file_base64_content = this.getNodeParameter('file_base64_content', i) as string;
				responseData = await weComApiRequest.call(
					this,
					'POST',
					'/cgi-bin/wedrive/file_upload_part',
					{ upload_key, index, file_base64_content },
				);
			} else if (operation === 'uploadFinish') {
				const upload_key = this.getNodeParameter('upload_key', i) as string;
				responseData = await weComApiRequest.call(
					this,
					'POST',
					'/cgi-bin/wedrive/file_upload_finish',
					{ upload_key },
				);
			} else if (wefileExtraHttpOpsById[operation]) {
				const bodyDefaults: IDataObject = {};
				const wefile_fileid = this.getNodeParameter('wefile_fileid', i, '') as string;
				const wefile_spaceid = this.getNodeParameter('wefile_spaceid', i, '') as string;
				if (wefile_fileid) bodyDefaults.fileid = wefile_fileid;
				if (wefile_spaceid) bodyDefaults.spaceid = wefile_spaceid;
				responseData = await executeExtraHttpOp.call(
					this,
					wefileExtraHttpOpsById[operation],
					i,
					bodyDefaults,
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
