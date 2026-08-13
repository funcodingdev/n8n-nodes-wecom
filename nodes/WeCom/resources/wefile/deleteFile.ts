import type { INodeProperties } from 'n8n-workflow';

const showOnly = { resource: ['wefile'], operation: ['deleteFile'] };

export const deleteFileDescription: INodeProperties[] = [
	{
		displayName: '文件ID列表',
		name: 'fileIds',
		type: 'string',
		required: true,
		displayOptions: { show: showOnly },
		default: '',
		description: '要删除的文件 ID 列表，可用逗号、中文逗号、竖线或换行分隔；与下方 JSON 合并去重，最多 1000 个',
		placeholder: '如: file_001,file_002',
	},
	{
		displayName: '文件ID列表 JSON',
		name: 'fileIdsJson',
		type: 'json',
		displayOptions: { show: showOnly },
		default: '[]',
		description:
			'可选。非空数组时与上方列表合并去重。支持 ["id1"] 或 [{"fileid":"id1"}]',
	},
];
