import type { INodeProperties } from 'n8n-workflow';
import type { ExtraHttpOp } from '../../shared/extraHttpOp';
import { extraHttpOpOptions } from '../../shared/extraHttpOp';

/** 文档有、此前节点未封装的 wefile 相关 HTTP 接口（一等操作） */
export const wefileExtraHttpOps: ExtraHttpOp[] = [
	{ id: 'wedriveGetFilePermission', name: '[微盘补全] wedrive/get_file_permission', action: 'wedrive/get_file_permission', description: 'wedrive/get_file_permission', path: '/cgi-bin/wedrive/get_file_permission', method: 'POST' },
];

export const wefileExtraHttpOpsById: Record<string, ExtraHttpOp> = Object.fromEntries(
	wefileExtraHttpOps.map((o) => [o.id, o]),
);

export const wefileExtraHttpOpsOptionValues = wefileExtraHttpOps.map((o) => o.id);

export function getWefileExtraHttpOpOptions() {
	return extraHttpOpOptions(wefileExtraHttpOps);
}

export const wefileExtraHttpOpsDescription: INodeProperties[] = [
	{
		displayName: '请求体JSON',
		name: 'requestBody',
		type: 'json',
		displayOptions: {
			show: { resource: ['wefile'], operation: wefileExtraHttpOpsOptionValues },
		},
		default: '{}',
		description: '请求体 JSON，字段名与企业微信接口文档保持一致；GET 请求可留空',
	},
	{
		displayName: 'Query参数JSON',
		name: 'requestQuery',
		type: 'json',
		displayOptions: {
			show: { resource: ['wefile'], operation: wefileExtraHttpOpsOptionValues },
		},
		default: '{}',
		description: 'URL 查询参数（访问凭证会自动附加，无需填写）',
	},
];
