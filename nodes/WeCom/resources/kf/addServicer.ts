import type { INodeProperties } from 'n8n-workflow';

const showOnlyForAddServicer = {
	resource: ['kf'],
	operation: ['addServicer'],
};

export const addServicerDescription: INodeProperties[] = [
	{
		displayName: '客服账号 Name or ID',
		name: 'open_kfid',
		type: 'options',
		typeOptions: {
			loadOptionsMethod: 'getKfAccounts',
		},
		required: true,
		displayOptions: {
			show: showOnlyForAddServicer,
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
			show: showOnlyForAddServicer,
		},
		default: '',
		hint: '接待人员userid列表，用逗号分隔',
	},
];

