import type { INodeProperties } from 'n8n-workflow';

const showOnlyForGetCorporationRules = {
	resource: ['checkin'],
	operation: ['getCorporationRules'],
};

export const getCorporationRulesDescription: INodeProperties[] = [
	{
		displayName: '附加字段',
		name: 'additionalFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: {
			show: showOnlyForGetCorporationRules,
		},
		options: [],
		description: 'Get all check-in rules of the corporation',
		hint: '获取企业所有打卡规则，无需额外参数',
	},
];

