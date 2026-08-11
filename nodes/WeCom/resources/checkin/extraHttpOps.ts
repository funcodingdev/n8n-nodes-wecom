import type { INodeProperties } from 'n8n-workflow';
import type { ExtraHttpOp } from '../../shared/extraHttpOp';
import { extraHttpOpOptions } from '../../shared/extraHttpOp';

/** 文档有、此前节点未封装的 checkin 相关 HTTP 接口（一等操作） */
export const checkinExtraHttpOps: ExtraHttpOp[] = [
	{ id: 'clearCheckinOptionArrayField', name: '[打卡补全] checkin/clear_checkin_option_array_field', action: 'checkin/clear_checkin_option_array_field', description: 'POST /cgi-bin/checkin/clear_checkin_option_array_field', path: '/cgi-bin/checkin/clear_checkin_option_array_field', method: 'POST' },
];

export const checkinExtraHttpOpsById: Record<string, ExtraHttpOp> = Object.fromEntries(
	checkinExtraHttpOps.map((o) => [o.id, o]),
);

export const checkinExtraHttpOpsOptionValues = checkinExtraHttpOps.map((o) => o.id);

export function getCheckinExtraHttpOpOptions() {
	return extraHttpOpOptions(checkinExtraHttpOps);
}

export const checkinExtraHttpOpsDescription: INodeProperties[] = [
	{
		displayName: '请求体JSON',
		name: 'requestBody',
		type: 'json',
		displayOptions: {
			show: { resource: ['checkin'], operation: checkinExtraHttpOpsOptionValues },
		},
		default: '{}',
		description: 'POST 请求体，字段与官方文档一致；GET 可留空',
	},
	{
		displayName: 'Query参数JSON',
		name: 'requestQuery',
		type: 'json',
		displayOptions: {
			show: { resource: ['checkin'], operation: checkinExtraHttpOpsOptionValues },
		},
		default: '{}',
		description: '查询参数（access_token 自动附加）；如 code、userid 等',
	},
];
