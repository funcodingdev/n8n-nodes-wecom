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
): string {
	const text = String(value ?? '').trim();
	if (!text) fail(context, `${label}不能为空`, itemIndex);
	return text;
}

function requireMerchantId(
	context: IExecuteFunctions,
	value: unknown,
	label: string,
	itemIndex: number,
): string {
	const merchantId = requireText(context, value, label, itemIndex);
	if (Buffer.byteLength(merchantId, 'utf8') > 32) {
		fail(context, `${label}不能超过 32 个 UTF-8 字节`, itemIndex);
	}
	return merchantId;
}

function optionalText(value: unknown): string | undefined {
	const text = String(value ?? '').trim();
	return text || undefined;
}

function requireUnixSeconds(
	context: IExecuteFunctions,
	value: unknown,
	label: string,
	itemIndex: number,
): number {
	if (typeof value === 'number') {
		if (!Number.isInteger(value) || value < 0 || value > 4294967295) {
			fail(context, `${label}必须是有效的 Unix 秒`, itemIndex);
		}
		return value;
	}
	const text = requireText(context, value, label, itemIndex);
	const milliseconds = Date.parse(text);
	if (!Number.isFinite(milliseconds)) fail(context, `${label}必须是有效的日期时间`, itemIndex);
	const seconds = Math.floor(milliseconds / 1000);
	if (seconds < 0 || seconds > 4294967295) {
		fail(context, `${label}必须在 Unix 秒可表示的范围内`, itemIndex);
	}
	return seconds;
}

function requireInteger(
	context: IExecuteFunctions,
	value: unknown,
	label: string,
	itemIndex: number,
	minimum: number,
	maximum: number,
): number {
	const number = typeof value === 'number' ? value : Number(value);
	if (!Number.isInteger(number) || number < minimum || number > maximum) {
		fail(context, `${label}必须是 ${minimum}–${maximum} 之间的整数`, itemIndex);
	}
	return number;
}

function splitList(value: unknown): string[] {
	const rawParts: string[] = [];
	const push = (entry: unknown) => {
		if (entry === undefined || entry === null) return;
		if (Array.isArray(entry)) {
			for (const item of entry) push(item);
			return;
		}
		const text = String(entry).trim();
		if (!text) return;
		for (const part of text.split(/[,，|\n\r]+/)) {
			const normalized = part.trim();
			if (normalized) rawParts.push(normalized);
		}
	};
	push(value);
	const seen = new Set<string>();
	return rawParts.filter((entry) => {
		const identity = entry.toLowerCase();
		if (seen.has(identity)) return false;
		seen.add(identity);
		return true;
	});
}

function splitIntegerList(
	context: IExecuteFunctions,
	value: unknown,
	label: string,
	itemIndex: number,
): number[] {
	return splitList(value).map((entry, index) =>
		requireInteger(context, entry, `${label}第 ${index + 1} 项`, itemIndex, 1, 4294967295),
	);
}

function getTimeRange(
	context: IExecuteFunctions,
	itemIndex: number,
	operation: 'getBillList' | 'getFundFlow',
): { beginTime: number; endTime: number } {
	const beginTime = requireUnixSeconds(
		context,
		context.getNodeParameter('begin_time', itemIndex),
		'开始时间',
		itemIndex,
	);
	const endTime = requireUnixSeconds(
		context,
		context.getNodeParameter('end_time', itemIndex),
		'结束时间',
		itemIndex,
	);
	if (endTime < beginTime) fail(context, '结束时间不能早于开始时间', itemIndex);
	if (endTime - beginTime > 31 * 86400) fail(context, '起止时间间隔不能超过 31 天', itemIndex);
	if (operation === 'getFundFlow' && beginTime < Date.UTC(2022, 11, 1) / 1000) {
		fail(context, '资金流水开始时间不能早于 2022-12-01', itemIndex);
	}
	return { beginTime, endTime };
}

export async function executeExternalpay(
	this: IExecuteFunctions,
	operation: string,
	items: INodeExecutionData[],
): Promise<INodeExecutionData[]> {
	const returnData: INodeExecutionData[] = [];

	for (let i = 0; i < items.length; i++) {
		try {
			let responseData: IDataObject;

			if (operation === 'getMerchant') {
				responseData = await weComApiRequest.call(
					this,
					'POST',
					'/cgi-bin/externalpay/getmerchant',
					{ mch_id: requireMerchantId(this, this.getNodeParameter('mch_id', i), '商户号', i) },
				);
			} else if (operation === 'setMchUseScope') {
				const allowUseScope: IDataObject = {};
				const users = splitList([
					this.getNodeParameter('scope_users', i, ''),
					this.getNodeParameter('scope_users_selected', i, []),
					...(() => {
						const raw = this.getNodeParameter('scopeUsersJson', i, '[]');
						if (raw === undefined || raw === null || String(raw).trim() === '') return [] as string[];
						let parsed: unknown = raw;
						if (typeof raw === 'string') {
							try {
								parsed = JSON.parse(raw);
							} catch {
								fail(this, '使用范围成员 JSON 不是有效的 JSON', i);
							}
						}
						if (!Array.isArray(parsed)) fail(this, '使用范围成员 JSON 必须是数组', i);
						return splitList(
							(parsed as unknown[]).map((entry) => {
								if (typeof entry === 'string' || typeof entry === 'number') return entry;
								if (entry && typeof entry === 'object' && !Array.isArray(entry)) {
									const row = entry as IDataObject;
									return row.userid ?? row.userid_selected ?? row.user_id ?? '';
								}
								return '';
							}),
						);
					})(),
				]);
				const partyIds = splitIntegerList(
					this,
					[
						this.getNodeParameter('scope_partyids', i, ''),
						this.getNodeParameter('scope_partyids_selected', i, []),
						...(() => {
							const raw = this.getNodeParameter('scopePartyidsJson', i, '[]');
							if (raw === undefined || raw === null || String(raw).trim() === '') return [] as string[];
							let parsed: unknown = raw;
							if (typeof raw === 'string') {
								try {
									parsed = JSON.parse(raw);
								} catch {
									fail(this, '使用范围部门 JSON 不是有效的 JSON', i);
								}
							}
							if (!Array.isArray(parsed)) fail(this, '使用范围部门 JSON 必须是数组', i);
							return splitList(
								(parsed as unknown[]).map((entry) => {
									if (typeof entry === 'string' || typeof entry === 'number') return entry;
									if (entry && typeof entry === 'object' && !Array.isArray(entry)) {
										const row = entry as IDataObject;
										return row.partyid ?? row.party_id ?? row.departmentid ?? row.id ?? '';
									}
									return '';
								}),
							);
						})(),
					],
					'部门 ID 列表',
					i,
				);
				const tagIds = splitIntegerList(
					this,
					[
						this.getNodeParameter('scope_tagids', i, ''),
						this.getNodeParameter('scope_tagids_selected', i, []),
						...(() => {
							const raw = this.getNodeParameter('scopeTagidsJson', i, '[]');
							if (raw === undefined || raw === null || String(raw).trim() === '') return [] as string[];
							let parsed: unknown = raw;
							if (typeof raw === 'string') {
								try {
									parsed = JSON.parse(raw);
								} catch {
									fail(this, '使用范围标签 JSON 不是有效的 JSON', i);
								}
							}
							if (!Array.isArray(parsed)) fail(this, '使用范围标签 JSON 必须是数组', i);
							return splitList(
								(parsed as unknown[]).map((entry) => {
									if (typeof entry === 'string' || typeof entry === 'number') return entry;
									if (entry && typeof entry === 'object' && !Array.isArray(entry)) {
										const row = entry as IDataObject;
										return row.tagid ?? row.tag_id ?? row.id ?? '';
									}
									return '';
								}),
							);
						})(),
					],
					'标签 ID 列表',
					i,
				);
				if (users.length > 0) allowUseScope.user = users;
				if (partyIds.length > 0) allowUseScope.partyid = partyIds;
				if (tagIds.length > 0) allowUseScope.tagid = tagIds;
				responseData = await weComApiRequest.call(
					this,
					'POST',
					'/cgi-bin/externalpay/set_mch_use_scope',
					{
						mch_id: requireMerchantId(this, this.getNodeParameter('mch_id', i), '商户号', i),
						allow_use_scope: allowUseScope,
					},
				);
			} else if (operation === 'getBillList' || operation === 'getFundFlow') {
				const { beginTime, endTime } = getTimeRange(this, i, operation);
				const maximumLimit = operation === 'getBillList' ? 1000 : 200;
				const defaultLimit = operation === 'getBillList' ? 10 : 100;
				const body: IDataObject = {
					begin_time: beginTime,
					end_time: endTime,
					limit: requireInteger(
						this,
						this.getNodeParameter('limit', i, defaultLimit),
						'返回数量',
						i,
						1,
						maximumLimit,
					),
				};
				const cursor = optionalText(this.getNodeParameter('cursor', i, ''));
				if (cursor !== undefined) body.cursor = cursor;
				if (operation === 'getBillList') {
					const payeeUserid = optionalText(
						this.getNodeParameter('payee_userid', i, '') ||
							this.getNodeParameter('payee_userid_selected', i, ''),
					);
					if (payeeUserid !== undefined) body.payee_userid = payeeUserid;
					responseData = await weComApiRequest.call(
						this,
						'POST',
						'/cgi-bin/externalpay/get_bill_list',
						body,
					);
				} else {
					const merchantId = optionalText(this.getNodeParameter('mch_id', i, ''));
					if (merchantId !== undefined) {
						body.mch_id = requireMerchantId(this, merchantId, '商户号', i);
					}
					responseData = await weComApiRequest.call(
						this,
						'POST',
						'/cgi-bin/externalpay/get_fund_flow',
						body,
					);
				}
			} else if (operation === 'getPaymentInfo') {
				responseData = await weComApiRequest.call(
					this,
					'POST',
					'/cgi-bin/externalpay/get_payment_info',
					{
						payment_id: requireText(
							this,
							this.getNodeParameter('payment_id', i),
							'收款项目单号',
							i,
						),
					},
				);
			} else {
				fail(this, `不支持的对外收款操作: ${operation}`, i);
			}

			returnData.push({ json: responseData, pairedItem: { item: i } });
		} catch (error) {
			if (this.continueOnFail()) {
				returnData.push({ json: { error: (error as Error).message }, pairedItem: { item: i } });
				continue;
			}
			throw error;
		}
	}

	return returnData;
}
