import type { INodeProperties } from 'n8n-workflow';

const showOnlyForBatchDelete = {
	resource: ['contact'],
	operation: ['batchDeleteUser'],
};

export const batchDeleteUserDescription: INodeProperties[] = [
	{
		displayName: 'UserID列表',
		name: 'useridlist',
		type: 'string',
		displayOptions: {
			show: showOnlyForBatchDelete,
		},
		default: '',
		placeholder: 'zhangsan,lisi',
		description:
			'成员 UserID 列表，对应管理端的账号。支持逗号、中文逗号、竖线或换行分隔，最多 200 个；与下方选择合并。若存在无效 UserID 会直接返回错误，删除后不可恢复。<a href="https://developer.work.weixin.qq.com/document/path/90199" target="_blank">官方文档</a>',
	},
	{
		displayName: '成员(选择)',
		name: 'useridlist_selected',
		type: 'multiOptions',
		displayOptions: {
			show: showOnlyForBatchDelete,
		},
		typeOptions: {
			loadOptionsMethod: 'getAllUsers',
		},
		default: [],
		description: '与上方列表合并去重，合计最多 200 个',
	},
];
