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
		// eslint-disable-next-line n8n-nodes-base/node-param-options-type-unsorted-items
		options: [
			{
				name: '获取员工字段配置',
				value: 'getFieldList',
				action: '获取员工字段配置',
				description: 'Get employee field configuration',
			},
			{
				name: '获取员工花名册信息',
				value: 'getStaffInfo',
				action: '获取员工花名册信息',
				description: 'Get employee roster information',
			},
			{
				name: '更新员工花名册信息',
				value: 'updateStaffInfo',
				action: '更新员工花名册信息',
				description: 'Update employee roster information',
			},
		],
		default: 'getStaffInfo',
	},
	...getFieldListDescription,
	...getStaffInfoDescription,
	...updateStaffInfoDescription,
];

