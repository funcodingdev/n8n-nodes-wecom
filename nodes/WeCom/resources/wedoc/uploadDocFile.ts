import type { INodeProperties } from 'n8n-workflow';
const showOnly = { resource: ['wedoc'], operation: ['uploadDocFile'] };
export const uploadDocFileDescription: INodeProperties[] = [
	{
		displayName: '文档ID',
		name: 'docid',
		type: 'string',
		required: true,
		displayOptions: { show: showOnly },
		default: '',
		description: '文档ID，通过新建文档接口创建后获得',
		placeholder: 'doc_xxxxxx',
	},
	{
		displayName: '文件名',
		name: 'fileName',
		type: 'string',
		displayOptions: { show: showOnly },
		default: '',
		description: '最多 255 个字符（英文算 1 个，汉字算 2 个）。留空时使用二进制数据中的文件名',
		placeholder: 'report.pdf',
	},
	{
		displayName: '二进制数据属性',
		name: 'binaryProperty',
		type: 'string',
		required: true,
		displayOptions: { show: showOnly },
		default: 'data',
		description:
			'要上传的文件所在的二进制属性名称。不超过 10MB 时直接上传，超过时自动分块上传（最大 20GB）。<a href="https://developer.work.weixin.qq.com/document/path/101870" target="_blank">官方文档</a>',
		placeholder: 'data',
	},
];
