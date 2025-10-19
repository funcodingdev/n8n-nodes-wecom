import type { INodeProperties } from 'n8n-workflow';

const showOnlyForExportDept = {
	resource: ['contact'],
	operation: ['exportDepartment'],
};

export const exportDepartmentDescription: INodeProperties[] = [
	{
		displayName: '编码类型',
		name: 'encoding_aeskey',
		type: 'string',
		displayOptions: {
			show: showOnlyForExportDept,
		},
		default: '',
		description: 'Base64encode的加密密钥，长度固定为43字节，使用加密需要填写此字段。',
		hint: '加密密钥',
	},
	{
		displayName: '每块数据部门数',
		name: 'block_size',
		type: 'number',
		displayOptions: {
			show: showOnlyForExportDept,
		},
		default: 100000,
		description: '每块数据的部门数，支持范围[104,106]，默认值为100000。',
		hint: '每块数据部门数',
	},
];

