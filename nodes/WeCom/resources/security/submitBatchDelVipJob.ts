import type { INodeProperties } from 'n8n-workflow';

export const submitBatchDelVipJobDescription: INodeProperties[] = [
	{
		displayName: '取消高级功能账号会提交异步任务，请保存返回的任务 ID，并查询最终成功与失败列表。',
		name: 'deleteVipJobNotice',
		type: 'notice',
		displayOptions: {
			show: { resource: ['security'], operation: ['submitBatchDelVipJob'] },
		},
		default: '',
	},
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
		description: '要撤销高级功能的成员 userid，支持逗号、中文逗号、竖线或换行分隔，单次最多 100 个',
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
