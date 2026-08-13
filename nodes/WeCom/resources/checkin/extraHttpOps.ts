import type { INodeProperties } from 'n8n-workflow';
import type { ExtraHttpOp } from '../../shared/extraHttpOp';
import { extraHttpOpOptions } from '../../shared/extraHttpOp';

export const checkinExtraHttpOps: ExtraHttpOp[] = [
	{
		id: 'clearCheckinOptionArrayField',
		name: '[打卡] 清空规则数组字段',
		action: '清空打卡规则数组字段',
		description: '清空打卡规则数组字段',
		path: '/cgi-bin/checkin/clear_checkin_option_array_field',
		method: 'POST',
	},
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
		displayName: '规则组ID',
		name: 'checkin_groupid',
		type: 'number',
		required: true,
		displayOptions: {
			show: { resource: ['checkin'], operation: checkinExtraHttpOpsOptionValues },
		},
		default: 1,
		typeOptions: { minValue: 1 },
		description: '打卡规则 groupid',
	},
	{
		displayName: '要清空的字段',
		name: 'clear_field_ids',
		type: 'multiOptions',
		required: true,
		displayOptions: {
			show: { resource: ['checkin'], operation: checkinExtraHttpOpsOptionValues },
		},
		options: [
			{ name: '特殊工作日 spe_workdays', value: 1 },
			{ name: '特殊非工作日 spe_offdays', value: 2 },
			{ name: 'WiFi 信息 wifimac_infos', value: 3 },
			{ name: '位置信息 loc_infos', value: 4 },
		],
		default: [],
		description: 'clear_field 标识；WiFi 与位置不可同时清空为空',
	},
	{
		displayName: '立即生效',
		name: 'clear_effective_now',
		type: 'boolean',
		displayOptions: {
			show: { resource: ['checkin'], operation: checkinExtraHttpOpsOptionValues },
		},
		default: false,
		description: 'effective_now，默认 false',
	},
	{
		displayName: '请求体JSON',
		name: 'requestBody',
		type: 'json',
		displayOptions: {
			show: { resource: ['checkin'], operation: checkinExtraHttpOpsOptionValues },
		},
		default: '{}',
		description: '其余字段与 groupid 合并',
	},
	{
		displayName: 'Query参数JSON',
		name: 'requestQuery',
		type: 'json',
		displayOptions: {
			show: { resource: ['checkin'], operation: checkinExtraHttpOpsOptionValues },
		},
		default: '{}',
	},
];
