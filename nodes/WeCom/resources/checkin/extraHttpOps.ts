import type { INodeProperties } from 'n8n-workflow';
import type { ExtraHttpOp } from '../../shared/extraHttpOp';
import { extraHttpOpOptions } from '../../shared/extraHttpOp';

export const checkinExtraHttpOps: ExtraHttpOp[] = [
	{ id: 'clearCheckinOptionArrayField', name: '[打卡] 清空规则数组字段', action: '清空打卡规则数组字段', description: '清空打卡规则数组字段', path: '/cgi-bin/checkin/clear_checkin_option_array_field', method: 'POST' },
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
		displayOptions: {
			show: { resource: ['checkin'], operation: checkinExtraHttpOpsOptionValues },
		},
		default: 0,
		description: '打卡规则 groupid',
	},
	{
		displayName: '要清空的字段名',
		name: 'clear_field_names',
		type: 'string',
		displayOptions: {
			show: { resource: ['checkin'], operation: checkinExtraHttpOpsOptionValues },
		},
		default: '',
		placeholder: 'field1,field2',
		description: '规则中需清空的数组字段名，逗号分隔',
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
