import type { IDataObject, IExecuteFunctions, INodeExecutionData } from 'n8n-workflow';
import { NodeOperationError } from 'n8n-workflow';
import { weComApiRequest } from '../../shared/transport';

const MAX_UINT32 = 4294967295;
const THIRTY_DAYS = 30 * 24 * 60 * 60;

function fail(context: IExecuteFunctions, message: string, itemIndex: number): never {
	throw new NodeOperationError(context.getNode(), message, { itemIndex });
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
	if (value === undefined || value === null || String(value).trim() === '') return 0;
	const raw = String(value).trim();
	const normalized = /^\d+$/.test(raw) ? Number(raw) : Math.floor(Date.parse(raw) / 1000);
	if (!Number.isSafeInteger(normalized) || normalized < 1 || normalized > MAX_UINT32) {
		fail(context, `${label}不是有效的日期时间`, itemIndex);
	}
	return normalized;
}

export async function executePhone(
	this: IExecuteFunctions,
	operation: string,
	items: INodeExecutionData[],
): Promise<INodeExecutionData[]> {
	const returnData: INodeExecutionData[] = [];

	for (let i = 0; i < items.length; i++) {
		try {
			if (operation !== 'getDialRecord') fail(this, `不支持的公费电话操作：${operation}`, i);
			const startTime = unixTimestamp(
				this,
				this.getNodeParameter('start_time', i, ''),
				'开始时间',
				i,
			);
			const endTime = unixTimestamp(
				this,
				this.getNodeParameter('end_time', i, ''),
				'结束时间',
				i,
			);
			if (startTime && endTime) {
				if (endTime < startTime) fail(this, '结束时间不能早于开始时间', i);
				if (endTime - startTime > THIRTY_DAYS) fail(this, '查询时间跨度不能超过 30 天', i);
			}

			const body: IDataObject = {
				offset: integer(this, this.getNodeParameter('offset', i, 0), '分页偏移量', i, 0, MAX_UINT32),
				limit: integer(this, this.getNodeParameter('limit', i, 100), '每页数量', i, 1, 100),
			};
			if (startTime) body.start_time = startTime;
			if (endTime) body.end_time = endTime;

			const response = await weComApiRequest.call(
				this,
				'POST',
				'/cgi-bin/dial/get_dial_record',
				body,
			);
			returnData.push({ json: response || {}, pairedItem: { item: i } });
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
