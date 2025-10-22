import type { INodeProperties } from 'n8n-workflow';

const showOnlyForDelServicer = {
	resource: ['kf'],
	operation: ['delServicer'],
};

export const delServicerDescription: INodeProperties[] = [
	{
		displayName: '客服账号ID',
		name: 'open_kfid',
		type: 'string',
		required: true,
		displayOptions: {
			show: showOnlyForDelServicer,
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
			show: showOnlyForDelServicer,
		},
		default: '',
		hint: '要删除的接待人员userid列表，用逗号分隔',
	},
];

