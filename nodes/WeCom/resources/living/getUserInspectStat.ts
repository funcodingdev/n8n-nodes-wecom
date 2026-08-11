import type { INodeProperties } from 'n8n-workflow';

const showOnlyForGetUserInspectStat = {
	resource: ['living'],
	operation: ['getUserInspectStat'],
};

export const getUserInspectStatDescription: INodeProperties[] = [
	{
		displayName: '成员UserID',
		name: 'userid',
		type: 'string',
		required: true,
		displayOptions: {
			show: showOnlyForGetUserInspectStat,
		},
		default: '',
		placeholder: 'zhangsan',
		description:
			'成员的 userid，须在应用可见范围内。<a href="https://developer.work.weixin.qq.com/document/path/93533" target="_blank">官方文档</a>',
	},
];
