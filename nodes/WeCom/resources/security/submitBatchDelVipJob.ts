import type { INodeProperties } from 'n8n-workflow';

export const submitBatchDelVipJobDescription: INodeProperties[] = [
	{
		displayName: '成员UserID列表',
		name: 'vip_userids',
		type: 'string',
		displayOptions: {
			show: {
				resource: ['security'],
				operation: ['submitBatchDelVipJob'],
			},
		},
		default: '',
		placeholder: 'zhangsan,lisi',
		description: '要撤销高级功能的成员 userid，逗号分隔，单次最多 100 个',
	},
	{
		displayName: '成员列表(选择)',
		name: 'userid_list',
		type: 'multiOptions',
		displayOptions: {
			show: {
				resource: ['security'],
				operation: ['submitBatchDelVipJob'],
			},
		},
		typeOptions: {
			loadOptionsMethod: 'getAllUsers',
		},
		default: [],
		description: '与上方列表合并去重；单次最多 100 个',
	},
];
