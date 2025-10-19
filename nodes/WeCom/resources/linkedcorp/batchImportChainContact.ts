import type { INodeProperties } from 'n8n-workflow';

const showOnlyForBatchImport = {
	resource: ['linkedcorp'],
	operation: ['batchImportChainContact'],
};

export const batchImportChainContactDescription: INodeProperties[] = [
	{
		displayName: '上下游ID',
		name: 'chain_id',
		type: 'string',
		required: true,
		displayOptions: {
			show: showOnlyForBatchImport,
		},
		default: '',
		description: '上下游的唯一ID。',
		hint: '上下游ID',
	},
	{
		displayName: 'Media ID',
		name: 'media_ID',
		type: 'string',
		required: true,
		displayOptions: {
			show: showOnlyForBatchImport,
		},
		default: '',
		description: '上传的csv文件的media_ID，通过素材管理接口上传文件获得。',
		hint: '素材Media ID',
	},
];

