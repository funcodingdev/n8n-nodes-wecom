import type { INodeProperties } from 'n8n-workflow';

const showOnly = {
	resource: ['externalContact'],
	operation: ['deleteMomentStrategy'],
};

export const deleteMomentStrategyDescription: INodeProperties[] = [
	{
		displayName: '删除提示',
		name: 'deleteMomentStrategyNotice',
		type: 'notice',
		default: '',
		displayOptions: { show: showOnly },
		description: '此操作会删除指定朋友圈规则组，请确认规则组 ID',
	},
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
