import type { IExecuteFunctions, INodeExecutionData, IDataObject } from 'n8n-workflow';
import { NodeOperationError } from 'n8n-workflow';
import { weComApiRequest } from '../../shared/transport';
import { executeExtraHttpOp } from '../../shared/extraHttpOp';
import { wefileExtraHttpOpsById } from './extraHttpOps';

const WEFILE_OPERATIONS = new Set([
	'createSpace', 'deleteSpace', 'renameSpace', 'getSpaceInfo', 'getSpaceInviteLink',
	'spaceSecuritySettings', 'uploadFile', 'downloadFile', 'createFolder', 'deleteFile',
	'moveFile', 'renameFile', 'getFileList', 'getFileInfo', 'addSpaceMembers',
	'removeSpaceMembers', 'addFileMembers', 'removeFileMembers', 'getFilePermissions',
	'fileShareSettings', 'getFileShareLink', 'fileSecuritySettings', 'assignVipAccounts',
	'revokeVipAccounts', 'getVipAccountsList', 'getProInfo', 'getCapacity', 'uploadInit',
	'uploadPart', 'uploadFinish', 'wedriveGetFilePermission',
]);

const LIST_SEPARATOR = /[,，|\n\r]+/;
const MAX_UINT32 = 4294967295;
const TWO_MIB = 2 * 1024 * 1024;

function fail(context: IExecuteFunctions, message: string, itemIndex: number): never {
	throw new NodeOperationError(context.getNode(), message, { itemIndex });
}

function text(
	context: IExecuteFunctions,
	value: unknown,
	label: string,
	itemIndex: number,
	maxLength = 4096,
	required = true,
): string {
	const normalized = String(value ?? '').trim();
	if (required && !normalized) fail(context, `${label}不能为空`, itemIndex);
	if (normalized.length > maxLength) fail(context, `${label}不能超过 ${maxLength} 个字符`, itemIndex);
	return normalized;
}

function integer(
	context: IExecuteFunctions,
	value: unknown,
	label: string,
	itemIndex: number,
	min: number,
	max: number,
): number {
	const normalized = Number(value);
	if (!Number.isSafeInteger(normalized) || normalized < min || normalized > max) {
		fail(context, `${label}必须是 ${min}–${max} 之间的整数`, itemIndex);
	}
	return normalized;
}

function list(
	context: IExecuteFunctions,
	value: unknown,
	label: string,
	itemIndex: number,
	min: number,
	max: number,
): string[] {
	const source = Array.isArray(value) ? value : [value];
	const values = source
		.flatMap((entry) => String(entry ?? '').split(LIST_SEPARATOR))
		.map((entry) => entry.trim())
		.filter(Boolean);
	const unique = [...new Set(values)];
	if (unique.length < min || unique.length > max) {
		fail(context, `${label}数量必须为 ${min}–${max} 个`, itemIndex);
	}
	return unique;
}

function weightedLength(value: string): number {
	return [...value].reduce((length, character) => length + (character.charCodeAt(0) > 127 ? 2 : 1), 0);
}

function fileName(context: IExecuteFunctions, value: unknown, label: string, itemIndex: number): string {
	const normalized = text(context, value, label, itemIndex, 255);
	if (weightedLength(normalized) > 255) {
		fail(context, `${label}换算长度不能超过 255（英文计 1，汉字计 2）`, itemIndex);
	}
	return normalized;
}

function base64Buffer(
	context: IExecuteFunctions,
	value: unknown,
	label: string,
	itemIndex: number,
): Buffer {
	const raw = text(context, value, label, itemIndex, 30_000_000);
	if (raw.startsWith('data:')) fail(context, `${label}只接受纯 Base64 内容，不能包含数据 URL 前缀`, itemIndex);
	const normalized = raw.replace(/\s+/g, '');
	if (!/^[A-Za-z0-9+/]*={0,2}$/.test(normalized) || normalized.length % 4 === 1) {
		fail(context, `${label}不是有效的 Base64 内容`, itemIndex);
	}
	const buffer = Buffer.from(normalized, 'base64');
	if (!buffer.length || buffer.toString('base64').replace(/=+$/, '') !== normalized.replace(/=+$/, '')) {
		fail(context, `${label}不是有效的 Base64 内容`, itemIndex);
	}
	return buffer;
}

function buildAuthInfo(
	context: IExecuteFunctions,
	members: IDataObject[],
	itemIndex: number,
	includeAuth: boolean,
	spaceMembers: boolean,
	allowedAuth?: number[],
	minMembers = 1,
): IDataObject[] {
	if (members.length < minMembers || members.length > 1000) {
		fail(context, `成员或部门数量必须为 ${minMembers}–1000 个`, itemIndex);
	}
	const identities = new Set<string>();
	let adminCount = 0;
	const authInfo = members.map((member) => {
		const type = integer(context, member.type, '成员类型', itemIndex, 1, 2);
		const info: IDataObject = { type };
		let identity: string;
		if (type === 1) {
			const userid = text(context, member.userid, '成员 UserID', itemIndex);
			info.userid = userid;
			identity = `user:${userid}`;
		} else {
			const departmentid = integer(context, member.departmentid, '部门 ID', itemIndex, 0, MAX_UINT32);
			info.departmentid = departmentid;
			identity = `department:${departmentid}`;
		}
		if (identities.has(identity)) fail(context, `成员列表包含重复项 ${identity}`, itemIndex);
		identities.add(identity);
		if (includeAuth) {
			const auth = integer(context, member.auth, '成员权限', itemIndex, 1, 7);
			const allowed = allowedAuth ?? (spaceMembers ? [1, 4, 7] : [1]);
			if (!allowed.includes(auth)) fail(context, `成员权限只能是 ${allowed.join('、')}`, itemIndex);
			if (auth === 7) {
				if (type !== 1) fail(context, '部门不能设置为空间管理员', itemIndex);
				adminCount++;
			}
			info.auth = auth;
		}
		return info;
	});
	if (adminCount > 3) fail(context, '应用空间管理员最多 3 人', itemIndex);
	return authInfo;
}

function mergeAuthMembers(
	context: IExecuteFunctions,
	itemIndex: number,
	collection: IDataObject,
	includeAuth: boolean,
	spaceMembers: boolean,
	allowedAuth?: number[],
	minMembers = 1,
	defaultAuth = 1,
): IDataObject[] {
	const fromForm = Array.isArray(collection.members) ? (collection.members as IDataObject[]) : [];
	const members: IDataObject[] = [...fromForm];
	const userids = list(context, context.getNodeParameter('member_userids', itemIndex, ''), '成员 UserID', itemIndex, 0, 1000);
	const departmentids = list(
		context,
		context.getNodeParameter('member_departmentids', itemIndex, ''),
		'部门 ID',
		itemIndex,
		0,
		1000,
	);
	const listAuth = includeAuth
		? integer(context, context.getNodeParameter('member_list_auth', itemIndex, defaultAuth), '列表默认权限', itemIndex, 1, 7)
		: undefined;
	for (const userid of userids) {
		const entry: IDataObject = { type: 1, userid };
		if (includeAuth) entry.auth = listAuth;
		members.push(entry);
	}
	for (const departmentid of departmentids) {
		const entry: IDataObject = { type: 2, departmentid };
		if (includeAuth) entry.auth = listAuth;
		members.push(entry);
	}
	return buildAuthInfo(context, members, itemIndex, includeAuth, spaceMembers, allowedAuth, minMembers);
}

export async function executeWefile(
	this: IExecuteFunctions,
	operation: string,
	items: INodeExecutionData[],
): Promise<INodeExecutionData[]> {
	const returnData: INodeExecutionData[] = [];

	for (let i = 0; i < items.length; i++) {
		try {
			let responseData!: IDataObject;
			if (!WEFILE_OPERATIONS.has(operation)) fail(this, `不支持的微盘操作: ${operation}`, i);

			// 空间管理操作
			if (operation === 'createSpace') {
				const spaceName = text(this, this.getNodeParameter('spaceName', i), '空间名称', i, 255);
				const authInfoCollection = this.getNodeParameter('authInfoCollection', i, {}) as IDataObject;
				const spaceSubType = integer(this, this.getNodeParameter('spaceSubType', i, 0), '空间类型', i, 0, 0);

				const body: IDataObject = {
					space_name: spaceName,
					space_sub_type: spaceSubType,
				};

				// 处理权限信息：表单选择 + 逗号分隔 UserID/部门
				const authInfo = mergeAuthMembers(this, i, authInfoCollection, true, true, [1, 4, 7], 0);
				if (authInfo.length) body.auth_info = authInfo;

				responseData = await weComApiRequest.call(
					this,
					'POST',
					'/cgi-bin/wedrive/space_create',
					body,
				);
			} else if (operation === 'renameSpace') {
				const spaceId = text(this, this.getNodeParameter('spaceId', i), '空间 ID', i);
				const spaceName = text(this, this.getNodeParameter('spaceName', i), '空间名称', i, 255);

				responseData = await weComApiRequest.call(
					this,
					'POST',
					'/cgi-bin/wedrive/space_rename',
					{ spaceid: spaceId, space_name: spaceName },
				);
			} else if (operation === 'deleteSpace') {
				const spaceId = text(this, this.getNodeParameter('spaceId', i), '空间 ID', i);

				responseData = await weComApiRequest.call(
					this,
					'POST',
					'/cgi-bin/wedrive/space_dismiss',
					{ spaceid: spaceId },
				);
			} else if (operation === 'getSpaceInfo') {
				const spaceId = text(this, this.getNodeParameter('spaceId', i), '空间 ID', i);

				responseData = await weComApiRequest.call(
					this,
					'POST',
					'/cgi-bin/wedrive/space_info',
					{ spaceid: spaceId },
				);
			}
			// 空间权限管理
			else if (operation === 'addSpaceMembers') {
				const spaceId = text(this, this.getNodeParameter('spaceId', i), '空间 ID', i);
				const authInfoCollection = this.getNodeParameter('authInfoCollection', i, {}) as IDataObject;

				const body: IDataObject = { spaceid: spaceId };
				body.auth_info = mergeAuthMembers(this, i, authInfoCollection, true, true, [1, 7], 1);

				responseData = await weComApiRequest.call(
					this,
					'POST',
					'/cgi-bin/wedrive/space_acl_add',
					body,
				);
			} else if (operation === 'removeSpaceMembers') {
				const spaceId = text(this, this.getNodeParameter('spaceId', i), '空间 ID', i);
				const authInfoCollection = this.getNodeParameter('authInfoCollection', i, {}) as IDataObject;

				const body: IDataObject = { spaceid: spaceId };
				body.auth_info = mergeAuthMembers(this, i, authInfoCollection, false, true, undefined, 1);

				responseData = await weComApiRequest.call(
					this,
					'POST',
					'/cgi-bin/wedrive/space_acl_del',
					body,
				);
			} else if (operation === 'spaceSecuritySettings') {
				const spaceId = text(this, this.getNodeParameter('spaceId', i), '空间 ID', i);
				const body: IDataObject = { spaceid: spaceId };
				if (this.getNodeParameter('updateEnableWatermark', i, false) as boolean) {
					body.enable_watermark = this.getNodeParameter('enableWatermark', i, false) as boolean;
				}
				if (this.getNodeParameter('updateConfidentialMode', i, false) as boolean) {
					body.enable_confidential_mode = this.getNodeParameter('enableConfidentialMode', i, false) as boolean;
				}
				if (this.getNodeParameter('updateShareUrlNoApprove', i, false) as boolean) {
					const shareUrlNoApprove = this.getNodeParameter('shareUrlNoApprove', i, false) as boolean;
					body.share_url_no_approve = shareUrlNoApprove;
					if (shareUrlNoApprove) {
						const defaultAuth = integer(this, this.getNodeParameter('shareUrlDefaultAuth', i, 1), '邀请链接默认权限', i, 1, 200);
						if (![1, 2, 4, 5, 200].includes(defaultAuth)) fail(this, '邀请链接默认权限只能是 1、2、4、5 或 200', i);
						body.share_url_no_approve_default_auth = defaultAuth;
					}
				}
				if (this.getNodeParameter('updateDefaultFileScope', i, false) as boolean) {
					body.default_file_scope = integer(this, this.getNodeParameter('defaultFileScope', i, 1), '文件默认可查看范围', i, 1, 2);
				}
				if (this.getNodeParameter('updateBanShareExternal', i, false) as boolean) {
					body.ban_share_external = this.getNodeParameter('banShareExternal', i, false) as boolean;
				}
				if (Object.keys(body).length === 1) fail(this, '请至少开启一项要更新的空间安全设置', i);
				responseData = await weComApiRequest.call(this, 'POST', '/cgi-bin/wedrive/space_setting', body);
			} else if (operation === 'getSpaceInviteLink') {
				const spaceId = text(this, this.getNodeParameter('spaceId', i), '空间 ID', i);

				responseData = await weComApiRequest.call(
					this,
					'POST',
					'/cgi-bin/wedrive/space_share',
					{ spaceid: spaceId },
				);
			}
			// 文件管理操作
			else if (operation === 'getFileList') {
				const spaceId = text(this, this.getNodeParameter('spaceId', i), '空间 ID', i);
				const fatherId = text(this, this.getNodeParameter('fatherId', i, ''), '父目录 ID', i, 4096, false);
				const sortType = integer(this, this.getNodeParameter('sortType', i), '排序方式', i, 1, 6);
				const start = integer(this, this.getNodeParameter('start', i), '起始位置', i, 0, MAX_UINT32);
				const limit = integer(this, this.getNodeParameter('limit', i), '返回数量', i, 1, 1000);

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
				const locationMethod = text(this, this.getNodeParameter('locationMethod', i), '位置选择方式', i);
				if (!['space', 'ticket'].includes(locationMethod)) fail(this, '位置选择方式只能是空间或选择凭证', i);
				const normalizedFileName = fileName(this, this.getNodeParameter('fileName', i), '文件名', i);
				const contentMethod = text(this, this.getNodeParameter('contentMethod', i), '文件内容方式', i);
				if (!['base64', 'binary'].includes(contentMethod)) fail(this, '文件内容方式只能是 Base64 或二进制数据', i);

				let dataBuffer: Buffer;

				// 根据内容方式获取 Base64 编码的文件内容
				if (contentMethod === 'base64') {
					dataBuffer = base64Buffer(this, this.getNodeParameter('base64Content', i), 'Base64 文件内容', i);
				} else {
					const binaryPropertyName = text(this, this.getNodeParameter('binaryPropertyName', i), '二进制属性', i);
					dataBuffer = await this.helpers.getBinaryDataBuffer(i, binaryPropertyName);
					if (!dataBuffer.length) fail(this, '二进制文件内容不能为空', i);
				}

				// 验证文件大小（10MB = 10 * 1024 * 1024 bytes）
				const maxFileSize = 10 * 1024 * 1024;
				if (dataBuffer.length > maxFileSize) {
					fail(this, `文件大小超过限制（最大 10MB）。当前文件大小: ${(dataBuffer.length / 1024 / 1024).toFixed(2)}MB`, i);
				}

				const body: IDataObject = {
					file_name: normalizedFileName,
					file_base64_content: dataBuffer.toString('base64'),
				};

				// 根据位置选择方式设置参数
				if (locationMethod === 'ticket') {
					// 使用 selected_ticket 方式
					const selectedTicket = text(this, this.getNodeParameter('selectedTicket', i), '选择凭证', i);
					body.selected_ticket = selectedTicket;
				} else {
					// 使用 spaceid/fatherid 方式
					const spaceId = text(this, this.getNodeParameter('spaceId', i), '空间 ID', i);
					const fatherId = text(this, this.getNodeParameter('fatherId', i, ''), '父目录 ID', i, 4096, false);

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
				const downloadMethod = text(this, this.getNodeParameter('downloadMethod', i), '下载方式', i);
				if (!['fileId', 'ticket'].includes(downloadMethod)) fail(this, '下载方式只能是文件 ID 或选择凭证', i);
				const body: IDataObject = {};

				// 根据下载方式设置参数
				if (downloadMethod === 'ticket') {
					// 使用 selected_ticket 方式
					const selectedTicket = text(this, this.getNodeParameter('selectedTicket', i), '选择凭证', i);
					body.selected_ticket = selectedTicket;
				} else {
					// 使用 fileid 方式
					const fileId = text(this, this.getNodeParameter('fileId', i), '文件 ID', i);
					body.fileid = fileId;
				}

				responseData = await weComApiRequest.call(
					this,
					'POST',
					'/cgi-bin/wedrive/file_download',
					body,
				);
			} else if (operation === 'createFolder') {
				const spaceId = text(this, this.getNodeParameter('spaceId', i), '空间 ID', i);
				const fatherId = text(this, this.getNodeParameter('fatherId', i, ''), '父目录 ID', i, 4096, false);
				const fileType = integer(this, this.getNodeParameter('fileType', i), '文件类型', i, 1, 4);
				if (![1, 3, 4].includes(fileType)) fail(this, '文件类型只能是文件夹、文档或表格', i);
				const normalizedFileName = fileName(this, this.getNodeParameter('fileName', i), '文件名', i);

				const body: IDataObject = {
					spaceid: spaceId,
					fatherid: fatherId || spaceId,
					file_type: fileType,
					file_name: normalizedFileName,
				};

				responseData = await weComApiRequest.call(
					this,
					'POST',
					'/cgi-bin/wedrive/file_create',
					body,
				);
			} else if (operation === 'renameFile') {
				const fileId = text(this, this.getNodeParameter('fileId', i), '文件 ID', i);
				const newName = fileName(this, this.getNodeParameter('newName', i), '新文件名', i);

				responseData = await weComApiRequest.call(
					this,
					'POST',
					'/cgi-bin/wedrive/file_rename',
					{ fileid: fileId, new_name: newName },
				);
			} else if (operation === 'moveFile') {
				const fileIds = list(this, this.getNodeParameter('fileIds', i), '文件 ID 列表', i, 1, 1000);
				const fatherId = text(this, this.getNodeParameter('fatherId', i), '目标文件夹 ID', i);
				const replace = this.getNodeParameter('replace', i, false) as boolean;

				responseData = await weComApiRequest.call(
					this,
					'POST',
					'/cgi-bin/wedrive/file_move',
					{ fileid: fileIds, fatherid: fatherId, replace },
				);
			} else if (operation === 'deleteFile') {
				const fileIds = list(this, this.getNodeParameter('fileIds', i), '文件 ID 列表', i, 1, 1000);

				responseData = await weComApiRequest.call(
					this,
					'POST',
					'/cgi-bin/wedrive/file_delete',
					{ fileid: fileIds },
				);
			} else if (operation === 'getFileInfo') {
				const fileId = text(this, this.getNodeParameter('fileId', i), '文件 ID', i);

				responseData = await weComApiRequest.call(
					this,
					'POST',
					'/cgi-bin/wedrive/file_info',
					{ fileid: fileId },
				);
			}
			// 文件权限管理
			else if (operation === 'addFileMembers') {
				const fileId = text(this, this.getNodeParameter('fileId', i), '文件 ID', i);
				const authInfoCollection = this.getNodeParameter('authInfoCollection', i, {}) as IDataObject;

				const body: IDataObject = { fileid: fileId };
				body.auth_info = mergeAuthMembers(this, i, authInfoCollection, true, false, [1], 1);

				responseData = await weComApiRequest.call(
					this,
					'POST',
					'/cgi-bin/wedrive/file_acl_add',
					body,
				);
			} else if (operation === 'removeFileMembers') {
				const fileId = text(this, this.getNodeParameter('fileId', i), '文件 ID', i);
				const authInfoCollection = this.getNodeParameter('authInfoCollection', i, {}) as IDataObject;

				const body: IDataObject = { fileid: fileId };
				body.auth_info = mergeAuthMembers(this, i, authInfoCollection, false, false, undefined, 1);

				responseData = await weComApiRequest.call(
					this,
					'POST',
					'/cgi-bin/wedrive/file_acl_del',
					body,
				);
			} else if (operation === 'fileShareSettings') {
				const fileId = text(this, this.getNodeParameter('fileId', i), '文件 ID', i);
				const authScope = integer(this, this.getNodeParameter('authScope', i), '分享范围', i, 1, 5);

				const body: IDataObject = {
					fileid: fileId,
					auth_scope: authScope,
				};

				if (this.getNodeParameter('updateAuth', i, false) as boolean) {
					const auth = integer(this, this.getNodeParameter('auth', i, 1), '分享权限', i, 1, 4);
					if (![1, 4].includes(auth)) fail(this, '分享权限只能是 1 或 4', i);
					body.auth = auth;
				}

				responseData = await weComApiRequest.call(
					this,
					'POST',
					'/cgi-bin/wedrive/file_setting',
					body,
				);
			} else if (operation === 'getFileShareLink') {
				const fileId = text(this, this.getNodeParameter('fileId', i), '文件 ID', i);

				responseData = await weComApiRequest.call(
					this,
					'POST',
					'/cgi-bin/wedrive/file_share',
					{ fileid: fileId },
				);
			} else if (operation === 'getFilePermissions') {
				const fileId = text(this, this.getNodeParameter('fileId', i), '文件 ID', i);

				responseData = await weComApiRequest.call(
					this,
					'POST',
					'/cgi-bin/wedrive/get_file_permission',
					{ fileid: fileId },
				);
			} else if (operation === 'fileSecuritySettings') {
				const fileId = text(this, this.getNodeParameter('fileId', i), '文件 ID', i);
				const watermark: IDataObject = {};
				if (this.getNodeParameter('updateWatermarkText', i, false) as boolean) {
					watermark.text = text(this, this.getNodeParameter('watermarkText', i, ''), '水印文字', i, 255, false);
				}
				if (this.getNodeParameter('updateWatermarkMargin', i, false) as boolean) {
					watermark.margin_type = integer(this, this.getNodeParameter('watermarkMarginType', i, 1), '水印密度', i, 1, 2);
				}
				if (this.getNodeParameter('updateShowVisitorName', i, false) as boolean) {
					watermark.show_visitor_name = this.getNodeParameter('showVisitorName', i, false) as boolean;
				}
				if (this.getNodeParameter('updateShowWatermarkText', i, false) as boolean) {
					watermark.show_text = this.getNodeParameter('showWatermarkText', i, false) as boolean;
				}
				if (!Object.keys(watermark).length) fail(this, '请至少开启一项要更新的文件水印设置', i);
				const body: IDataObject = { fileid: fileId, watermark };

				responseData = await weComApiRequest.call(
					this,
					'POST',
					'/cgi-bin/wedrive/file_secure_setting',
					body,
				);
			} else if (operation === 'assignVipAccounts') {
				const useridListCollection = this.getNodeParameter('useridList', i, {}) as IDataObject;
				const members = Array.isArray(useridListCollection.members)
					? (useridListCollection.members as IDataObject[])
					: [];
				const useridList = list(this, members.map((member) => member.userid), '成员 UserID 列表', i, 1, 100);

				const body: IDataObject = {
					userid_list: useridList,
				};

				responseData = await weComApiRequest.call(
					this,
					'POST',
					'/cgi-bin/wedoc/vip/batch_add',
					body,
				);
			} else if (operation === 'revokeVipAccounts') {
				const useridListCollection = this.getNodeParameter('useridList', i, {}) as IDataObject;
				const members = Array.isArray(useridListCollection.members)
					? (useridListCollection.members as IDataObject[])
					: [];
				const useridList = list(this, members.map((member) => member.userid), '成员 UserID 列表', i, 1, 100);

				const body: IDataObject = {
					userid_list: useridList,
				};

				responseData = await weComApiRequest.call(
					this,
					'POST',
					'/cgi-bin/wedoc/vip/batch_del',
					body,
				);
			} else if (operation === 'getVipAccountsList') {
				const cursor = text(this, this.getNodeParameter('cursor', i, ''), '分页游标', i, 4096, false);
				const limit = integer(this, this.getNodeParameter('limit', i, 100), '每页数量', i, 1, 200);

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
					'/cgi-bin/wedoc/vip/list',
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
				const body: IDataObject = {};
				responseData = await weComApiRequest.call(
					this,
					'POST',
					'/cgi-bin/wedrive/mng_capacity',
					body,
				);
			} else if (operation === 'uploadInit') {
				const normalizedFileName = fileName(this, this.getNodeParameter('fileName', i), '文件名', i);
				const size = integer(this, this.getNodeParameter('fileSize', i), '文件大小', i, 1, 20 * 1024 * 1024 * 1024);
				const blockSha = list(this, this.getNodeParameter('block_sha', i), '分块累积 SHA 列表', i, 1, 10240);
				if (blockSha.length !== Math.ceil(size / TWO_MIB)) {
					fail(this, `分块累积 SHA 数量应为 ${Math.ceil(size / TWO_MIB)} 个`, i);
				}
				for (const sha of blockSha) {
					if (!/^[0-9a-fA-F]{40}$/.test(sha)) fail(this, '分块累积 SHA 必须是 40 位十六进制值', i);
				}
				const skip_push_card = this.getNodeParameter('skip_push_card', i, false) as boolean;
				const locationMethod = text(this, this.getNodeParameter('uploadLocationMethod', i, 'space'), '上传位置方式', i);
				const body: IDataObject = {
					file_name: normalizedFileName,
					size,
					block_sha: blockSha,
					skip_push_card,
				};
				if (locationMethod === 'ticket') {
					body.selected_ticket = text(this, this.getNodeParameter('selectedTicket', i), '选择凭证', i);
				} else if (locationMethod === 'space') {
					const spaceId = text(this, this.getNodeParameter('spaceId', i), '空间 ID', i);
					const fatherId = text(this, this.getNodeParameter('fatherId', i, ''), '父目录 ID', i, 4096, false);
					body.spaceid = spaceId;
					body.fatherid = fatherId || spaceId;
				} else {
					fail(this, '上传位置方式只能是空间或选择凭证', i);
				}
				responseData = await weComApiRequest.call(
					this,
					'POST',
					'/cgi-bin/wedrive/file_upload_init',
					body,
				);
			} else if (operation === 'uploadPart') {
				const upload_key = text(this, this.getNodeParameter('upload_key', i), '上传凭证', i);
				const index = integer(this, this.getNodeParameter('part_index', i), '分块序号', i, 1, 10240);
				const partBuffer = base64Buffer(this, this.getNodeParameter('file_base64_content', i), '分块 Base64 内容', i);
				if (partBuffer.length > TWO_MIB) fail(this, '单个上传分块不能超过 2MiB', i);
				responseData = await weComApiRequest.call(
					this,
					'POST',
					'/cgi-bin/wedrive/file_upload_part',
					{ upload_key, index, file_base64_content: partBuffer.toString('base64') },
				);
			} else if (operation === 'uploadFinish') {
				const upload_key = text(this, this.getNodeParameter('upload_key', i), '上传凭证', i);
				responseData = await weComApiRequest.call(
					this,
					'POST',
					'/cgi-bin/wedrive/file_upload_finish',
					{ upload_key },
				);
			} else if (wefileExtraHttpOpsById[operation]) {
				const bodyDefaults: IDataObject = {};
				const wefile_fileid = text(
					this,
					this.getNodeParameter('wefile_fileid', i, ''),
					'文件 ID',
					i,
					4096,
					false,
				);
				const wefile_spaceid = text(
					this,
					this.getNodeParameter('wefile_spaceid', i, ''),
					'空间 ID',
					i,
					4096,
					false,
				);
				if (operation === 'wedriveGetFilePermission' && !wefile_fileid) {
					fail(this, '文件 ID不能为空', i);
				}
				if (wefile_fileid) bodyDefaults.fileid = wefile_fileid;
				if (wefile_spaceid) bodyDefaults.spaceid = wefile_spaceid;
				responseData = await executeExtraHttpOp.call(
					this,
					wefileExtraHttpOpsById[operation],
					i,
					bodyDefaults,
				);
			}

			returnData.push({
				json: responseData,
				pairedItem: { item: i },
			});
		} catch (error) {
			if (this.continueOnFail()) {
				returnData.push({
					json: { error: error instanceof Error ? error.message : String(error) },
					pairedItem: { item: i },
				});
				continue;
			}
			throw error;
		}
	}

	return returnData;
}
