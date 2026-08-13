import type { INodeProperties } from 'n8n-workflow';
import type { ExtraHttpOp } from '../../shared/extraHttpOp';
import { extraHttpOpOptions } from '../../shared/extraHttpOp';

export const wefileExtraHttpOps: ExtraHttpOp[] = [
	{ id: 'wedriveGetFilePermission', name: '[微盘] 获取文件权限（JSON 兼容入口）', action: '通过 JSON 获取微盘文件权限', description: '与标准表单入口调用同一官方接口，支持合并额外 JSON 字段', path: '/cgi-bin/wedrive/get_file_permission', method: 'POST' },
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
		displayName: '空间ID',
		name: 'wefile_spaceid',
		type: 'string',
		displayOptions: {
			show: { resource: ['wefile'], operation: wefileExtraHttpOpsOptionValues },
		},
		default: '',
		description: '微盘 spaceid（若接口需要）',
	},
	{
		displayName: '文件ID',
		name: 'wefile_fileid',
		type: 'string',
		displayOptions: {
			show: { resource: ['wefile'], operation: wefileExtraHttpOpsOptionValues },
		},
		default: '',
		description: '微盘 fileid',
	},
	{
		displayName: '请求体JSON',
		name: 'requestBody',
		type: 'json',
		displayOptions: {
			show: { resource: ['wefile'], operation: wefileExtraHttpOpsOptionValues },
		},
		default: '{}',
		description: '其余字段与 fileid 合并',
	},
	{
		displayName: 'Query参数JSON',
		name: 'requestQuery',
		type: 'json',
		displayOptions: {
			show: { resource: ['wefile'], operation: wefileExtraHttpOpsOptionValues },
		},
		default: '{}',
	},
];
