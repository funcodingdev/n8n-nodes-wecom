import type { INodeProperties } from 'n8n-workflow';

const showOnly = { resource: ['wefile'], operation: ['moveFile'] };

export const moveFileDescription: INodeProperties[] = [
	{
		displayName: '文件ID列表',
		name: 'fileIds',
		type: 'string',
		required: true,
		displayOptions: { show: showOnly },
		default: '',
		description: '要移动的文件 ID 列表，可用逗号、中文逗号、竖线或换行分隔；与下方 JSON 合并去重，最多 1000 个',
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
	{
		displayName: '目标文件夹ID',
		name: 'fatherId',
		type: 'string',
		required: true,
		displayOptions: { show: showOnly },
		default: '',
		description: '目标文件夹的ID，根目录时为空间spaceid',
	},
	{
		displayName: '同名时替换',
		name: 'replace',
		type: 'boolean',
		displayOptions: { show: showOnly },
		default: false,
		description: '如果目标位置存在同名文件时，true:覆盖同名文件；false:自动重命名（如xxx(1).txt）',
	},
];
