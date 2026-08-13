import type { INodeProperties } from 'n8n-workflow';

const showOnly = {
	resource: ['externalContact'],
	operation: ['getMomentStrategy'],
};

export const getMomentStrategyDescription: INodeProperties[] = [
	{
		displayName: '规则组ID',
		name: 'strategy_id',
		type: 'number',
		typeOptions: { minValue: 1, numberStepSize: 1 },
		required: true,
		default: 1,
		displayOptions: { show: showOnly },
	},
];
