import type { INodeProperties } from 'n8n-workflow';

export const submitBatchAddVipJobDescription: INodeProperties[] = [
	{
		displayName: '提交后会返回异步任务 ID，请再使用“查询分配高级功能账号结果”获取最终成功与失败列表。',
		name: 'addVipJobNotice',
		type: 'notice',
		displayOptions: {
			show: { resource: ['security'], operation: ['submitBatchAddVipJob'] },
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
				operation: ['submitBatchAddVipJob'],
			},
		},
		default: '',
		placeholder: 'zhangsan,lisi',
		description: '要分配高级功能的成员 userid，支持逗号、中文逗号、竖线或换行分隔，单次最多 100 个',
	},
	{
		displayName: '成员列表(选择)',
		name: 'userid_list',
		type: 'multiOptions',
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
		description: '与上方列表合并去重；单次最多 100 个',
	},
];
