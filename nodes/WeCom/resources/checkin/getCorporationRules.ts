import type { INodeProperties } from 'n8n-workflow';

const showOnlyForGetCorporationRules = {
	resource: ['checkin'],
	operation: ['getCorporationRules'],
};

export const getCorporationRulesDescription: INodeProperties[] = [
	{
		displayName:
			'获取企业所有打卡规则，无需额外参数。<a href="https://developer.work.weixin.qq.com/document/path/93384" target="_blank">官方文档</a>',
		name: 'getCorporationRulesNotice',
		type: 'notice',
		default: '',
		displayOptions: {
			show: showOnlyForGetCorporationRules,
		},
	},
];
