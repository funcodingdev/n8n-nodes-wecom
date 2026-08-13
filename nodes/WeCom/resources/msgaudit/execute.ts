import type { IExecuteFunctions, INodeExecutionData, IDataObject } from 'n8n-workflow';
import { NodeOperationError } from 'n8n-workflow';
import { weComApiRequest } from '../../shared/transport';

function fail(context: IExecuteFunctions, message: string, itemIndex: number): never {
	throw new NodeOperationError(context.getNode(), message, { itemIndex });
}

function requireText(
	context: IExecuteFunctions,
	value: unknown,
	label: string,
	itemIndex: number,
	maximumLength = 128,
): string {
	const text = String(value ?? '').trim();
	if (!text) fail(context, `${label}不能为空`, itemIndex);
	if (Array.from(text).length > maximumLength) {
		fail(context, `${label}不能超过 ${maximumLength} 个字符`, itemIndex);
	}
	return text;
}

function normalizeAgreeInfo(
	context: IExecuteFunctions,
	value: unknown,
	itemIndex: number,
): IDataObject[] {
	if (!Array.isArray(value)) fail(context, '单聊会话对必须是 JSON 数组', itemIndex);
	if (value.length === 0 || value.length > 100) {
		fail(context, '单聊会话对数量必须为 1–100 项', itemIndex);
	}
	const result: IDataObject[] = [];
	const seen = new Set<string>();
	for (const [index, rawPair] of value.entries()) {
		if (!rawPair || typeof rawPair !== 'object' || Array.isArray(rawPair)) {
			fail(context, `单聊会话对第 ${index + 1} 项必须是对象`, itemIndex);
		}
		const pair = rawPair as IDataObject;
		const userid = requireText(
			context,
			pair.userid || pair.userid_selected,
			`第 ${index + 1} 项成员 UserID`,
			itemIndex,
			64,
		);
		const exteranalopenid = requireText(
			context,
			pair.exteranalopenid,
			`第 ${index + 1} 项外部联系人 OpenID`,
			itemIndex,
			128,
		);
		const key = `${userid}\u0000${exteranalopenid}`;
		if (!seen.has(key)) {
			seen.add(key);
			result.push({ userid, exteranalopenid });
		}
	}
	return result;
}

function parseAgreeJson(
	context: IExecuteFunctions,
	value: unknown,
	itemIndex: number,
): IDataObject[] {
	let parsed: unknown = value;
	if (typeof value === 'string') {
		try {
			parsed = JSON.parse(value);
		} catch (error) {
			fail(context, `单聊会话对 JSON 解析失败: ${(error as Error).message}`, itemIndex);
		}
	}
	return normalizeAgreeInfo(context, parsed, itemIndex);
}

export async function executeMsgaudit(
	this: IExecuteFunctions,
	operation: string,
	items: INodeExecutionData[],
): Promise<INodeExecutionData[]> {
	const returnData: INodeExecutionData[] = [];

	for (let i = 0; i < items.length; i++) {
		try {
			let responseData: IDataObject = {};

			if (operation === 'getPermitUserList') {
				// https://developer.work.weixin.qq.com/document/path/91614
				const type = Number(this.getNodeParameter('type', i, 0));
				if (!Number.isInteger(type) || ![0, 1, 2, 3].includes(type)) {
					fail(this, '版本类型必须是 0、1、2 或 3', i);
				}
				const body: IDataObject = {};
				if (type) body.type = type;
				responseData = await weComApiRequest.call(
					this,
					'POST',
					'/cgi-bin/msgaudit/get_permit_user_list',
					body,
				);
			} else if (operation === 'checkSingleAgree') {
				// https://developer.work.weixin.qq.com/document/path/91782
				const singleAgreeCollection = this.getNodeParameter(
					'singleAgreeCollection',
					i,
					{},
				) as IDataObject;
				const infoJson = this.getNodeParameter('infoJson', i, '[]');
				const inputMode = String(this.getNodeParameter('singleAgreeInputMode', i, 'form'));
				if (!['form', 'json'].includes(inputMode)) fail(this, '单聊会话对输入方式不受支持', i);
				const formPairs = (singleAgreeCollection?.pairs as IDataObject[]) || [];
				let info: IDataObject[];
				if (inputMode === 'json') {
					info = parseAgreeJson(this, infoJson, i);
				} else if (formPairs.length > 0) {
					info = normalizeAgreeInfo(this, formPairs, i);
				} else {
					// 兼容旧工作流：原节点没有输入方式字段，且 JSON 可直接覆盖空表单。
					let parsedLegacy: unknown;
					try {
						parsedLegacy = typeof infoJson === 'string' ? JSON.parse(infoJson) : infoJson;
					} catch (error) {
						fail(this, `单聊会话对 JSON 解析失败: ${(error as Error).message}`, i);
					}
					info = normalizeAgreeInfo(this, parsedLegacy, i);
				}
				responseData = await weComApiRequest.call(
					this,
					'POST',
					'/cgi-bin/msgaudit/check_single_agree',
					{ info },
				);
			} else if (operation === 'checkRoomAgree') {
				const roomid = requireText(this, this.getNodeParameter('roomid', i), '群 ID', i, 128);
				responseData = await weComApiRequest.call(
					this,
					'POST',
					'/cgi-bin/msgaudit/check_room_agree',
					{ roomid },
				);
			} else if (operation === 'getGroupChat') {
				// https://developer.work.weixin.qq.com/document/path/92951
				const roomid = requireText(this, this.getNodeParameter('roomid', i), '群 ID', i, 128);
				responseData = await weComApiRequest.call(
					this,
					'POST',
					'/cgi-bin/msgaudit/groupchat/get',
					{ roomid },
				);
			} else if (operation === 'getRobotInfo') {
				const robot_id = requireText(this, this.getNodeParameter('robot_id', i), '机器人 ID', i, 128);
				if (!robot_id.startsWith('wb')) fail(this, '机器人 ID 应以 wb 开头', i);
				responseData = await weComApiRequest.call(
					this,
					'GET',
					'/cgi-bin/msgaudit/get_robot_info',
					{},
					{ robot_id },
				);
			} else {
				fail(this, `不支持的会话内容存档操作: ${operation}`, i);
			}

			returnData.push({
				json: responseData,
				pairedItem: { item: i },
			});
		} catch (error) {
			if (this.continueOnFail()) {
				returnData.push({
					json: { error: (error as Error).message },
					pairedItem: { item: i },
				});
				continue;
			}
			throw error;
		}
	}

	return returnData;
}
