import type { INodeProperties } from 'n8n-workflow';

const showOnlyForDelServicer = {
	resource: ['kf'],
	operation: ['delServicer'],
};

export const delServicerDescription: INodeProperties[] = [
	{
		displayName: '客服账号 Name or ID',
		name: 'open_kfid',
		type: 'options',
		typeOptions: {
			loadOptionsMethod: 'getKfAccounts',
		},
		required: true,
		displayOptions: {
			show: showOnlyForDelServicer,
		},
		default: '',
		description:
			'Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>',
		hint: '客服账号',
	},
	{
		displayName: '接待人员列表',
		name: 'userid_list',
		type: 'string',
		required: true,
		displayOptions: {
			show: showOnlyForDelServicer,
		},
		default: '',
		hint: '要删除的接待人员userid列表，用逗号分隔',
	},
];

