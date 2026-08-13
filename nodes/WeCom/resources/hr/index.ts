import type { INodeProperties } from 'n8n-workflow';

import { getFieldListDescription } from './getFieldList';
import { getStaffInfoDescription } from './getStaffInfo';
import { updateStaffInfoDescription } from './updateStaffInfo';

const showOnlyForHr = {
	resource: ['hr'],
};

export const hrDescription: INodeProperties[] = [
	{
		displayName: '操作',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: showOnlyForHr,
		},
		options: [
			{
				name: '[人事助手] 获取员工字段配置',
				value: 'getFieldList',
				action: '获取员工字段配置',
				description: '获取员工花名册的字段配置信息',
			},
			{
				name: '[人事助手] 获取员工花名册信息',
				value: 'getStaffInfo',
				action: '获取员工花名册信息',
				description: '获取指定员工的花名册详细信息',
			},
			{
				name: '[人事助手] 更新员工花名册信息',
				value: 'updateStaffInfo',
				action: '更新员工花名册信息',
				description: '更新指定员工的花名册信息',
			},
		],
		default: 'getStaffInfo',
	},
	...getFieldListDescription,
	...getStaffInfoDescription,
	...updateStaffInfoDescription,
];
