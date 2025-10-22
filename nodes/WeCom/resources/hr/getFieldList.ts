import type { INodeProperties } from 'n8n-workflow';

const showOnlyForGetFieldList = {
	resource: ['hr'],
	operation: ['getFieldList'],
};

export const getFieldListDescription: INodeProperties[] = [
	{
		displayName: '附加字段',
		name: 'additionalFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: {
			show: showOnlyForGetFieldList,
		},
		options: [],
		description: 'Get employee field configuration',
		hint: '获取员工字段配置，无需额外参数',
	},
];

