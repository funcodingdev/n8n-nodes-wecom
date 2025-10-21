import type { INodeProperties } from 'n8n-workflow';

export const getFileListDescription: INodeProperties[] = [
	{
		displayName: '空间ID',
		name: 'spaceId',
		type: 'string',
		required: true,
		default: '',
		placeholder: 'space_id_123',
		description: '微盘空间的ID',
		displayOptions: {
			show: {
				resource: ['wefile'],
				operation: ['getFileList'],
			},
		},
	},
	{
		displayName: '父文件夹ID',
		name: 'fatherId',
		type: 'string',
		default: '',
		placeholder: 'folder_id_123',
		description: '父文件夹的ID，不填则获取根目录文件列表',
		displayOptions: {
			show: {
				resource: ['wefile'],
				operation: ['getFileList'],
			},
		},
	},
	{
		displayName: '排序方式',
		name: 'sortType',
		type: 'options',
		default: 0,
		options: [
			{
				name: '默认排序',
				value: 0,
			},
			{
				name: '文件名升序',
				value: 1,
			},
			{
				name: '文件名降序',
				value: 2,
			},
			{
				name: '修改时间升序',
				value: 3,
			},
			{
				name: '修改时间降序',
				value: 4,
			},
		],
		description: '文件列表的排序方式',
		displayOptions: {
			show: {
				resource: ['wefile'],
				operation: ['getFileList'],
			},
		},
	},
	{
		displayName: '起始位置',
		name: 'start',
		type: 'number',
		default: 0,
		description: '分页起始位置',
		displayOptions: {
			show: {
				resource: ['wefile'],
				operation: ['getFileList'],
			},
		},
	},
	{
		displayName: '返回数量',
		name: 'limit',
		type: 'number',
		typeOptions: {
			minValue: 1,
		},
		default: 50,
		description: 'Max number of results to return',
		displayOptions: {
			show: {
				resource: ['wefile'],
				operation: ['getFileList'],
			},
		},
	},
];