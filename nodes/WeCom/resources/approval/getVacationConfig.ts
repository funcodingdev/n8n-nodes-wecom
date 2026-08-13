import type { INodeProperties } from 'n8n-workflow';

const showOnlyForGetVacationConfig = {
	resource: ['approval'],
	operation: ['getVacationConfig'],
};

export const getVacationConfigDescription: INodeProperties[] = [
	{
		displayName: '附加字段',
		name: 'additionalFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: {
			show: showOnlyForGetVacationConfig,
		},
		options: [],
		description: '获取企业假期管理配置信息，此操作无需额外参数',
	},
];
