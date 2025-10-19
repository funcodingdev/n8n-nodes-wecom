import type { INodeProperties } from 'n8n-workflow';
const showOnly = { resource: ['wedoc'], operation: ['uploadDocImage'] };
export const uploadDocImageDescription: INodeProperties[] = [
	{ displayName: '文档ID', name: 'docid', type: 'string', required: true, displayOptions: { show: showOnly }, default: '', description: '文档的docid。', hint: '文档ID' },
	{ displayName: '文件', name: 'file', type: 'string', required: true, displayOptions: { show: showOnly }, default: 'data', description: '要上传的图片文件的二进制属性名称。', hint: '二进制数据属性名' },
	{ displayName: '文件名', name: 'filename', type: 'string', displayOptions: { show: showOnly }, default: '', description: '文件名称。', hint: '文件名' },
];
