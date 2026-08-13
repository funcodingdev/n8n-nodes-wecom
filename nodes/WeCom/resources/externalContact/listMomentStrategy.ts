import type { INodeProperties } from 'n8n-workflow';

const showOnly = {
	resource: ['externalContact'],
	operation: ['listMomentStrategy'],
};

export const listMomentStrategyDescription: INodeProperties[] = [
	{
		displayName: '分页游标',
		name: 'cursor',
		type: 'string',
		default: '',
		displayOptions: { show: showOnly },
		description: '分页查询游标，首次调用可不填',
	},
	{
		displayName: '每页数量',
		name: 'limit',
		type: 'number',
		typeOptions: { minValue: 1, maxValue: 1000, numberStepSize: 1 },
		default: 1000,
		displayOptions: { show: showOnly },
		description: '分页大小，默认为1000，最大不超过1000',
	},
];
