import type { INodeProperties } from 'n8n-workflow';

const showOnly = {
	resource: ['externalContact'],
	operation: ['resignedTransferResult'],
};

export const resignedTransferResultDescription: INodeProperties[] = [
	{
		displayName: '原成员UserID',
		name: 'handover_userid',
		type: 'string',
		default: '',
		placeholder: 'zhangsan',
		displayOptions: {
			show: showOnly,
		},
		description: '离职成员的 UserID；可与下方选择二选一',
	},
	{
		displayName: '原成员(选择)',
		name: 'handover_userid_selected',
		type: 'options',
		typeOptions: { loadOptionsMethod: 'getAllUsers' },
		displayOptions: { show: showOnly },
		default: '',
		description: '与上方字符串二选一；均填写时以字符串为准',
	},
	{
		displayName: '接替成员UserID',
		name: 'takeover_userid',
		type: 'string',
		default: '',
		placeholder: 'lisi',
		displayOptions: {
			show: showOnly,
		},
		description: '接替成员的 UserID；可与下方选择二选一',
	},
	{
		displayName: '接替成员(选择)',
		name: 'takeover_userid_selected',
		type: 'options',
		typeOptions: { loadOptionsMethod: 'getAllUsers' },
		displayOptions: { show: showOnly },
		default: '',
		description: '与上方字符串二选一；均填写时以字符串为准',
	},
	{
		displayName: 'Cursor',
		name: 'cursor',
		type: 'string',
		default: '',
		displayOptions: {
			show: showOnly,
		},
		description: '分页游标，首次请求留空',
	},
];
