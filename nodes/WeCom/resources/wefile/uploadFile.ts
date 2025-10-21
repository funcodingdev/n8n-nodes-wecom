import type { INodeProperties } from 'n8n-workflow';

export const uploadFileDescription: INodeProperties[] = [
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
				operation: ['uploadFile'],
			},
		},
	},
	{
		displayName: '父文件夹ID',
		name: 'fatherId',
		type: 'string',
		default: '',
		placeholder: 'folder_id_123',
		description: '父文件夹的ID，不填则上传到根目录',
		displayOptions: {
			show: {
				resource: ['wefile'],
				operation: ['uploadFile'],
			},
		},
	},
	{
		displayName: '文件名',
		name: 'fileName',
		type: 'string',
		required: true,
		default: '',
		placeholder: 'document.pdf',
		description: '上传文件的名称',
		displayOptions: {
			show: {
				resource: ['wefile'],
				operation: ['uploadFile'],
			},
		},
	},
	{
		displayName: '二进制数据',
		name: 'binaryPropertyName',
		type: 'string',
		default: 'data',
		required: true,
		description: '包含文件数据的二进制属性名称',
		displayOptions: {
			show: {
				resource: ['wefile'],
				operation: ['uploadFile'],
			},
		},
	},
];