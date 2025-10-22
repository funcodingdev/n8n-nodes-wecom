import type { INodeProperties } from 'n8n-workflow';

const showOnlyForAddServicer = {
	resource: ['kf'],
	operation: ['addServicer'],
};

export const addServicerDescription: INodeProperties[] = [
	{
		displayName: '客服账号ID',
		name: 'open_kfid',
		type: 'string',
		required: true,
		displayOptions: {
			show: showOnlyForAddServicer,
		},
		default: '',
		hint: '客服账号ID',
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

