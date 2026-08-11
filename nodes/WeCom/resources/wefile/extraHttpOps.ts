import type { INodeProperties } from 'n8n-workflow';
import type { ExtraHttpOp } from '../../shared/extraHttpOp';
import { extraHttpOpOptions } from '../../shared/extraHttpOp';

export const wefileExtraHttpOps: ExtraHttpOp[] = [
	{ id: 'wedriveGetFilePermission', name: '[微盘] 获取文件权限', action: '获取微盘文件权限', description: '获取微盘文件权限', path: '/cgi-bin/wedrive/get_file_permission', method: 'POST' },
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
