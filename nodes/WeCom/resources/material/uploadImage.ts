import type { INodeProperties } from 'n8n-workflow';

const showOnlyForUploadImage = {
	resource: ['material'],
	operation: ['uploadImage'],
};

export const uploadImageDescription: INodeProperties[] = [
	{
		displayName: '文件',
		name: 'file',
		type: 'string',
		required: true,
		displayOptions: {
			show: showOnlyForUploadImage,
		},
		default: 'data',
		description: '要上传的文件的二进制属性名称',
		hint: '二进制数据属性名',
	},
	{
		displayName: '文件名',
		name: 'filename',
		type: 'string',
		displayOptions: {
			show: showOnlyForUploadImage,
		},
		default: '',
		description: '文件名称',
		hint: '文件名',
	},
];

