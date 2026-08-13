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
		description:
			'获取企业所有打卡规则，此操作无需额外参数。<a href="https://developer.work.weixin.qq.com/document/path/93384" target="_blank">官方文档</a>',
	},
];
