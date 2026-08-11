import type { INodeProperties } from 'n8n-workflow';

export const submitBatchAddVipJobDescription: INodeProperties[] = [
	{
		displayName: '成员列表',
		name: 'userid_list',
		type: 'multiOptions',
		required: true,
		displayOptions: {
			show: {
				resource: ['security'],
				operation: ['submitBatchAddVipJob'],
			},
		},
		typeOptions: {
			loadOptionsMethod: 'getAllUsers',
		},
		default: [],
		description: '要分配高级功能的企业成员，单次操作最多选择100个',
	},
];
