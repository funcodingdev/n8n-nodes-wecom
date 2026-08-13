import type { IExecuteFunctions, INodeExecutionData, IDataObject } from 'n8n-workflow';
import { NodeOperationError } from 'n8n-workflow';
import { weComApiRequest } from '../../shared/transport';

const LIST_SEPARATOR = /[,，|\n\r]+/;
const MAX_UINT32 = 4294967295;

function fail(context: IExecuteFunctions, message: string, itemIndex: number): never {
	throw new NodeOperationError(context.getNode(), message, { itemIndex });
}

function text(
	context: IExecuteFunctions,
	value: unknown,
	label: string,
	itemIndex: number,
	maxBytes = 4096,
	required = true,
): string {
	const normalized = String(value ?? '').trim();
	if (required && !normalized) fail(context, `${label}不能为空`, itemIndex);
	if (Buffer.byteLength(normalized, 'utf8') > maxBytes) {
		fail(context, `${label}不能超过 ${maxBytes} 字节`, itemIndex);
	}
	return normalized;
}

function textWithLimits(
	context: IExecuteFunctions,
	value: unknown,
	label: string,
	itemIndex: number,
	maxCharacters: number,
	maxBytes: number,
	required = true,
): string {
	const normalized = text(context, value, label, itemIndex, maxBytes, required);
	if ([...normalized].length > maxCharacters) {
		fail(context, `${label}不能超过 ${maxCharacters} 个字符`, itemIndex);
	}
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

function unixTimestamp(
	context: IExecuteFunctions,
	value: unknown,
	label: string,
	itemIndex: number,
): number {
	const raw = String(value ?? '').trim();
	if (!raw) fail(context, `${label}不能为空`, itemIndex);
	const timestamp = /^\d+$/.test(raw) ? Number(raw) : Math.floor(Date.parse(raw) / 1000);
	if (!Number.isSafeInteger(timestamp) || timestamp < 1 || timestamp > MAX_UINT32) {
		fail(context, `${label}不是有效的日期时间`, itemIndex);
	}
	return timestamp;
}

function stringList(
	context: IExecuteFunctions,
	value: unknown,
	label: string,
	itemIndex: number,
	min: number,
	max: number,
): string[] {
	const normalized = [
		...new Set(
			String(value ?? '')
				.split(LIST_SEPARATOR)
				.map((entry) => entry.trim())
				.filter(Boolean),
		),
	];
	if (normalized.length < min || normalized.length > max) {
		fail(context, `${label}数量必须为 ${min}–${max} 个`, itemIndex);
	}
	return normalized;
}

function activityDetail(
	context: IExecuteFunctions,
	descriptionValue: unknown,
	imageListValue: unknown,
	itemIndex: number,
): IDataObject | undefined {
	const description = textWithLimits(
		context,
		descriptionValue,
		'活动详情文字',
		itemIndex,
		300,
		1200,
		false,
	);
	const imageList = stringList(
		context,
		imageListValue,
		'活动详情图片 MediaID',
		itemIndex,
		0,
		5,
	).map((mediaId, imageIndex) =>
		text(context, mediaId, `第 ${imageIndex + 1} 个活动图片 MediaID`, itemIndex, 128),
	);
	if (!description && imageList.length === 0) return undefined;
	const detail: IDataObject = {};
	if (description) detail.description = description;
	if (imageList.length) detail.image_list = imageList;
	return detail;
}

export async function executeLive(
	this: IExecuteFunctions,
	operation: string,
	items: INodeExecutionData[],
): Promise<INodeExecutionData[]> {
	const returnData: INodeExecutionData[] = [];

	for (let i = 0; i < items.length; i++) {
		try {
			let response: IDataObject;

			if (operation === 'createLiving') {
				const livingStart = unixTimestamp(
					this,
					this.getNodeParameter('living_start', i),
					'直播开始时间',
					i,
				);
				if (livingStart <= Math.floor(Date.now() / 1000)) {
					fail(this, '直播开始时间必须晚于当前时间', i);
				}
				const type = integer(this, this.getNodeParameter('type', i, 0), '直播类型', i, 0, 4);
				const body: IDataObject = {
					anchor_userid: text(
						this,
						this.getNodeParameter('anchor_userid', i),
						'主播 UserID',
						i,
						64,
					),
					theme: textWithLimits(this, this.getNodeParameter('theme', i), '直播主题', i, 20, 80),
					living_start: livingStart,
					living_duration: integer(
						this,
						this.getNodeParameter('living_duration', i),
						'直播持续时长',
						i,
						1,
						86400,
					),
					type,
					remind_time: integer(
						this,
						this.getNodeParameter('remind_time', i, 0),
						'开播提醒提前秒数',
						i,
						0,
						MAX_UINT32,
					),
				};
				if (type === 4) {
					const coverMediaId = text(
						this,
						this.getNodeParameter('activity_cover_mediaid', i, ''),
						'直播封面 MediaID',
						i,
						128,
						false,
					);
					const shareMediaId = text(
						this,
						this.getNodeParameter('activity_share_mediaid', i, ''),
						'直播分享封面 MediaID',
						i,
						128,
						false,
					);
					if (coverMediaId) body.activity_cover_mediaid = coverMediaId;
					if (shareMediaId) body.activity_share_mediaid = shareMediaId;
					const detail = activityDetail(
						this,
						this.getNodeParameter('activity_detail_description', i, ''),
						this.getNodeParameter('activity_detail_image_list', i, ''),
						i,
					);
					if (detail) body.activity_detail = detail;
				} else {
					const description = textWithLimits(
						this,
						this.getNodeParameter('description', i, ''),
						'直播简介',
						i,
						100,
						400,
						false,
					);
					if (description) body.description = description;
				}
				const agentId = integer(
					this,
					this.getNodeParameter('agentid', i, 0),
					'应用 AgentId',
					i,
					0,
					MAX_UINT32,
				);
				if (agentId) body.agentid = agentId;
				response = await weComApiRequest.call(this, 'POST', '/cgi-bin/living/create', body);
			} else if (operation === 'modifyLiving') {
				const body: IDataObject = {
					livingid: text(this, this.getNodeParameter('livingid', i), '直播 ID', i, 128),
				};
				const updateTheme = this.getNodeParameter('update_theme', i, false) as boolean;
				const updateStart = this.getNodeParameter('update_living_start', i, false) as boolean;
				const updateDuration = this.getNodeParameter('update_living_duration', i, false) as boolean;
				const updateDescription = this.getNodeParameter('update_description', i, false) as boolean;
				const updateType = this.getNodeParameter('update_type', i, false) as boolean;
				const updateRemindTime = this.getNodeParameter('update_remind_time', i, false) as boolean;
				if (
					![
						updateTheme,
						updateStart,
						updateDuration,
						updateDescription,
						updateType,
						updateRemindTime,
					].some(Boolean)
				) {
					fail(this, '至少选择一项要修改的直播字段', i);
				}
				if (updateTheme) {
					body.theme = text(this, this.getNodeParameter('theme', i, ''), '直播主题', i, 60);
				}
				if (updateStart) {
					const start = unixTimestamp(
						this,
						this.getNodeParameter('living_start', i, ''),
						'直播开始时间',
						i,
					);
					if (start <= Math.floor(Date.now() / 1000)) fail(this, '直播开始时间必须晚于当前时间', i);
					body.living_start = start;
				}
				if (updateDuration) {
					body.living_duration = integer(
						this,
						this.getNodeParameter('living_duration', i, 3600),
						'直播持续时长',
						i,
						1,
						86400,
					);
				}
				if (updateDescription) {
					body.description = text(
						this,
						this.getNodeParameter('description', i, ''),
						'直播简介',
						i,
						300,
						false,
					);
				}
				if (updateType) {
					body.type = integer(this, this.getNodeParameter('type', i, 0), '直播类型', i, 0, 4);
				}
				if (updateRemindTime) {
					body.remind_time = integer(
						this,
						this.getNodeParameter('remind_time', i, 0),
						'开播提醒提前秒数',
						i,
						0,
						MAX_UINT32,
					);
				}
				response = await weComApiRequest.call(this, 'POST', '/cgi-bin/living/modify', body);
			} else if (operation === 'cancelLiving') {
				const livingid = text(this, this.getNodeParameter('livingid', i), '直播 ID', i, 128);
				response = await weComApiRequest.call(this, 'POST', '/cgi-bin/living/cancel', { livingid });
			} else if (operation === 'deleteLivingReplayData') {
				const livingid = text(this, this.getNodeParameter('livingid', i), '直播 ID', i, 128);
				response = await weComApiRequest.call(this, 'POST', '/cgi-bin/living/delete_replay_data', {
					livingid,
				});
			} else if (operation === 'getLivingShareInfo') {
				const wwShareCode = text(
					this,
					this.getNodeParameter('ww_share_code', i),
					'直播分享码',
					i,
					512,
				);
				response = await weComApiRequest.call(
					this,
					'POST',
					'/cgi-bin/living/get_living_share_info',
					{ ww_share_code: wwShareCode },
				);
			} else if (operation === 'getUserAllLivingId') {
				const additionalFields = this.getNodeParameter('additionalFields', i, {}) as IDataObject;
				const body: IDataObject = {
					userid: text(this, this.getNodeParameter('userid', i), '成员 UserID', i, 64),
				};
				const cursor = text(this, additionalFields.cursor, '分页游标', i, 1024, false);
				if (cursor) body.cursor = cursor;
				if (additionalFields.limit !== undefined) {
					body.limit = integer(this, additionalFields.limit, '每页数量', i, 1, 100);
				}
				response = await weComApiRequest.call(
					this,
					'POST',
					'/cgi-bin/living/get_user_all_livingid',
					body,
				);
			} else if (operation === 'getLivingInfo') {
				const livingid = text(this, this.getNodeParameter('livingid', i), '直播 ID', i, 128);
				response = await weComApiRequest.call(
					this,
					'GET',
					'/cgi-bin/living/get_living_info',
					{},
					{
						livingid,
					},
				);
			} else if (operation === 'getLivingWatchStat') {
				const body: IDataObject = {
					livingid: text(this, this.getNodeParameter('livingid', i), '直播 ID', i, 128),
				};
				const nextKey = text(
					this,
					this.getNodeParameter('next_key', i, ''),
					'下一页 Key',
					i,
					1024,
					false,
				);
				if (nextKey) body.next_key = nextKey;
				response = await weComApiRequest.call(this, 'POST', '/cgi-bin/living/get_watch_stat', body);
			} else if (operation === 'getLivingCode') {
				response = await weComApiRequest.call(this, 'POST', '/cgi-bin/living/get_living_code', {
					openid: text(this, this.getNodeParameter('openid', i), '微信用户 OpenID', i, 128),
					livingid: text(this, this.getNodeParameter('livingid', i), '直播 ID', i, 128),
				});
			} else {
				fail(this, `不支持的直播操作：${operation}`, i);
			}

			const executionData = this.helpers.constructExecutionMetaData(
				this.helpers.returnJsonArray(response),
				{ itemData: { item: i } },
			);
			returnData.push(...executionData);
		} catch (error) {
			const message = error instanceof Error ? error.message : String(error);
			if (this.continueOnFail()) {
				const executionData = this.helpers.constructExecutionMetaData(
					this.helpers.returnJsonArray({ error: message }),
					{ itemData: { item: i } },
				);
				returnData.push(...executionData);
				continue;
			}
			if (error instanceof NodeOperationError) throw error;
			throw new NodeOperationError(this.getNode(), message, { itemIndex: i });
		}
	}

	return returnData;
}
