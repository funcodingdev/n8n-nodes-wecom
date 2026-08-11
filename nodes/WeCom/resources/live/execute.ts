import type { IExecuteFunctions, INodeExecutionData, IDataObject } from 'n8n-workflow';
import { weComApiRequest } from '../../shared/transport';

function dateTimeToUnixTimestamp(dateTime: string | number): number {
	if (typeof dateTime === 'number') {
		return dateTime;
	}
	if (!dateTime || dateTime === '') {
		return 0;
	}
	return Math.floor(new Date(dateTime).getTime() / 1000);
}

function buildActivityDetail(fields: IDataObject): IDataObject | undefined {
	const detail: IDataObject = {};

	if (fields.activity_detail_description) {
		detail.description = fields.activity_detail_description as string;
	}

	if (fields.activity_detail_image_list) {
		const images = String(fields.activity_detail_image_list)
			.split(',')
			.map((url) => url.trim())
			.filter((url) => url)
			.slice(0, 3);

		if (images.length > 0) {
			detail.image_list = images;
		}
	}

	return Object.keys(detail).length > 0 ? detail : undefined;
}

function pickFirstString(...values: Array<string | undefined>): string {
	for (const v of values) {
		if (v !== undefined && v !== '') return v;
	}
	return '';
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
				const anchor_userid = this.getNodeParameter('anchor_userid', i) as string;
				const theme = this.getNodeParameter('theme', i) as string;
				const living_start = dateTimeToUnixTimestamp(
					this.getNodeParameter('living_start', i) as string | number,
				);
				const living_duration = this.getNodeParameter('living_duration', i) as number;
				const additionalFields = this.getNodeParameter('additionalFields', i, {}) as IDataObject;

				const description = pickFirstString(
					this.getNodeParameter('description', i, '') as string,
					additionalFields.description as string | undefined,
				);
				const type =
					this.getNodeParameter('type', i, 0) ?? (additionalFields.type as number | undefined) ?? 0;
				const remind_time =
					this.getNodeParameter('remind_time', i, 60) ??
					(additionalFields.remind_time as number | undefined) ??
					60;
				const activity_cover_mediaid = pickFirstString(
					this.getNodeParameter('activity_cover_mediaid', i, '') as string,
					additionalFields.activity_cover_mediaid as string | undefined,
				);
				const activity_share_mediaid = pickFirstString(
					this.getNodeParameter('activity_share_mediaid', i, '') as string,
					additionalFields.activity_share_mediaid as string | undefined,
				);
				const agentid =
					(this.getNodeParameter('agentid', i, 0) as number) ||
					(additionalFields.agentid as number | undefined) ||
					0;
				const activityFields: IDataObject = {
					activity_detail_description: pickFirstString(
						this.getNodeParameter('activity_detail_description', i, '') as string,
						additionalFields.activity_detail_description as string | undefined,
					),
					activity_detail_image_list: pickFirstString(
						this.getNodeParameter('activity_detail_image_list', i, '') as string,
						additionalFields.activity_detail_image_list as string | undefined,
					),
				};

				const body: IDataObject = {
					anchor_userid,
					theme,
					living_start,
					living_duration,
					type,
					remind_time,
				};

				if (description) body.description = description;
				if (agentid) body.agentid = agentid;
				if (activity_cover_mediaid) body.activity_cover_mediaid = activity_cover_mediaid;
				if (activity_share_mediaid) body.activity_share_mediaid = activity_share_mediaid;

				const activityDetail = buildActivityDetail(activityFields);
				if (activityDetail) body.activity_detail = activityDetail;

				response = await weComApiRequest.call(this, 'POST', '/cgi-bin/living/create', body);
			} else if (operation === 'modifyLiving') {
				const livingid = this.getNodeParameter('livingid', i) as string;
				const additionalFields = this.getNodeParameter('additionalFields', i, {}) as IDataObject;

				const body: IDataObject = { livingid };

				const theme = pickFirstString(
					this.getNodeParameter('theme', i, '') as string,
					additionalFields.theme as string | undefined,
				);
				if (theme) body.theme = theme;

				const living_start = dateTimeToUnixTimestamp(
					this.getNodeParameter('living_start', i, '') as string | number,
				);
				const legacyStart = Number(additionalFields.living_start || 0);
				if (living_start > 0) body.living_start = living_start;
				else if (legacyStart > 0) body.living_start = legacyStart;

				const living_duration = this.getNodeParameter('living_duration', i, 0) as number;
				const legacyDuration = Number(additionalFields.living_duration || 0);
				if (living_duration > 0) body.living_duration = living_duration;
				else if (legacyDuration > 0) body.living_duration = legacyDuration;

				const description = pickFirstString(
					this.getNodeParameter('description', i, '') as string,
					additionalFields.description as string | undefined,
				);
				if (description) body.description = description;

				const type = this.getNodeParameter('type', i, -1) as number;
				if (type !== -1) body.type = type;
				else if (additionalFields.type !== undefined) body.type = additionalFields.type;

				const remind_time = this.getNodeParameter('remind_time', i, -1) as number;
				if (remind_time !== -1) body.remind_time = remind_time;
				else if (additionalFields.remind_time !== undefined) {
					body.remind_time = additionalFields.remind_time;
				}

				const activity_cover_mediaid = pickFirstString(
					this.getNodeParameter('activity_cover_mediaid', i, '') as string,
					additionalFields.activity_cover_mediaid as string | undefined,
				);
				const activity_share_mediaid = pickFirstString(
					this.getNodeParameter('activity_share_mediaid', i, '') as string,
					additionalFields.activity_share_mediaid as string | undefined,
				);
				if (activity_cover_mediaid) body.activity_cover_mediaid = activity_cover_mediaid;
				if (activity_share_mediaid) body.activity_share_mediaid = activity_share_mediaid;

				const activityFields: IDataObject = {
					activity_detail_description: pickFirstString(
						this.getNodeParameter('activity_detail_description', i, '') as string,
						additionalFields.activity_detail_description as string | undefined,
					),
					activity_detail_image_list: pickFirstString(
						this.getNodeParameter('activity_detail_image_list', i, '') as string,
						additionalFields.activity_detail_image_list as string | undefined,
					),
				};
				const activityDetail = buildActivityDetail(activityFields);
				if (activityDetail) body.activity_detail = activityDetail;

				response = await weComApiRequest.call(this, 'POST', '/cgi-bin/living/modify', body);
			} else if (operation === 'cancelLiving') {
				const livingid = this.getNodeParameter('livingid', i) as string;

				response = await weComApiRequest.call(this, 'POST', '/cgi-bin/living/cancel', { livingid });
			} else if (operation === 'deleteLivingReplayData') {
				const livingid = this.getNodeParameter('livingid', i) as string;

				response = await weComApiRequest.call(
					this,
					'POST',
					'/cgi-bin/living/delete_replay_data',
					{ livingid },
				);
			} else if (operation === 'getLivingShareInfo') {
				const livingid = this.getNodeParameter('livingid', i) as string;
				const wwshare = this.getNodeParameter('wwshare', i) as number;

				response = await weComApiRequest.call(
					this,
					'POST',
					'/cgi-bin/living/get_living_share_info',
					{ livingid, wwshare },
				);
			} else if (operation === 'getUserAllLivingId') {
				const userid = this.getNodeParameter('userid', i) as string;
				const additionalFields = this.getNodeParameter('additionalFields', i, {}) as IDataObject;

				const body: IDataObject = { userid };
				if (additionalFields.cursor) body.cursor = additionalFields.cursor;
				if (additionalFields.limit !== undefined) body.limit = additionalFields.limit;

				response = await weComApiRequest.call(
					this,
					'POST',
					'/cgi-bin/living/get_user_all_livingid',
					body,
				);
			} else if (operation === 'getLivingInfo') {
				const livingid = this.getNodeParameter('livingid', i) as string;

				response = await weComApiRequest.call(this, 'GET', '/cgi-bin/living/get_living_info', {}, {
					livingid,
				});
			} else if (operation === 'getLivingWatchStat') {
				const livingid = this.getNodeParameter('livingid', i) as string;
				const next_key = this.getNodeParameter('next_key', i, '') as string;

				const body: IDataObject = { livingid };
				if (next_key) body.next_key = next_key;

				response = await weComApiRequest.call(this, 'POST', '/cgi-bin/living/get_watch_stat', body);
			} else if (operation === 'getLivingCode') {
				const openid = this.getNodeParameter('openid', i) as string;
				const livingid = this.getNodeParameter('livingid', i) as string;

				response = await weComApiRequest.call(this, 'POST', '/cgi-bin/living/get_living_code', {
					openid,
					livingid,
				});
			} else {
				throw new Error(`Unknown live operation: ${operation}`);
			}

			const executionData = this.helpers.constructExecutionMetaData(
				this.helpers.returnJsonArray(response),
				{ itemData: { item: i } },
			);
			returnData.push(...executionData);
		} catch (error) {
			if (this.continueOnFail()) {
				const executionData = this.helpers.constructExecutionMetaData(
					this.helpers.returnJsonArray({ error: (error as Error).message }),
					{ itemData: { item: i } },
				);
				returnData.push(...executionData);
				continue;
			}
			throw error;
		}
	}

	return returnData;
}
