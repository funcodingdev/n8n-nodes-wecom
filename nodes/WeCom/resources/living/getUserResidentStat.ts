import type { INodeProperties } from 'n8n-workflow';

const showOnlyForGetUserResidentStat = {
	resource: ['living'],
	operation: ['getUserResidentStat'],
};

export const getUserResidentStatDescription: INodeProperties[] = [
	{
		displayName: '成员UserID',
		name: 'userid',
		type: 'string',
		required: true,
		displayOptions: {
			show: showOnlyForGetUserResidentStat,
		},
		default: '',
		placeholder: 'zhangsan',
		description:
			'成员的 userid。<a href="https://developer.work.weixin.qq.com/document/path/93516" target="_blank">官方文档</a>',
	},
];
