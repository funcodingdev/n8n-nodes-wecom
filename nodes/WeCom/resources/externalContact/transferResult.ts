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
		displayOptions: {
			show: showOnly,
		},
		hint: '原跟进成员的userid',
		description: '原跟进成员的userid',
	},
	{
		displayName: '接替成员UserID',
		name: 'takeover_userid',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: showOnly,
		},
		hint: '接替成员的userid',
		description: '接替成员的userid',
	},
	{
		displayName: 'Cursor',
		name: 'cursor',
		type: 'string',
		default: '',
		displayOptions: {
			show: showOnly,
		},
		hint: '分页查询的cursor',
		description: '分页查询的cursor，第一次不填',
	},
];

