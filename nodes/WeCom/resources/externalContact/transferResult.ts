import type { INodeProperties } from 'n8n-workflow';

const showOnly = {
	resource: ['externalContact'],
	operation: ['transferResult'],
};

export const transferResultDescription: INodeProperties[] = [
	{
		displayName: '原成员UserID',
		name: 'handover_userid',
		type: 'string',
		required: true,
		default: '',
		placeholder: 'zhangsan',
		displayOptions: {
			show: showOnly,
		},
		description: '原跟进成员的 UserID',
	},
	{
		displayName: '接替成员UserID',
		name: 'takeover_userid',
		type: 'string',
		required: true,
		default: '',
		placeholder: 'lisi',
		displayOptions: {
			show: showOnly,
		},
		description: '接替成员的 UserID',
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
