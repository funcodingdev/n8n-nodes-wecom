import type { INodeProperties } from 'n8n-workflow';

const showOnlyForExport = {
	resource: ['contact'],
	operation: ['exportUser'],
};

export const exportUserDescription: INodeProperties[] = [
	{
		displayName: '编码类型',
		name: 'encoding_aeskey',
		type: 'string',
		displayOptions: {
			show: showOnlyForExport,
		},
		default: '',
		description: 'Base64encode的加密密钥，长度固定为43字节，使用加密需要填写此字段。',
		hint: '加密密钥',
	},
	{
		displayName: '每块数据人员数',
		name: 'block_size',
		type: 'number',
		displayOptions: {
			show: showOnlyForExport,
		},
		default: 100000,
		description: '每块数据的人员数，支持范围[104,106]，默认值为100000。',
		hint: '每块数据人员数',
	},
];

