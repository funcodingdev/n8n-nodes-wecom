import type { INodeProperties } from 'n8n-workflow';

const showOnlyForGetLivingInfo = {
	resource: ['school'],
	operation: ['getLivingInfo'],
};

export const getLivingInfoDescription: INodeProperties[] = [
	{
		displayName: '直播 ID',
		name: 'livingid',
		type: 'string',
		required: true,
		displayOptions: {
			show: showOnlyForGetLivingInfo,
		},
		default: '',
		placeholder: 'living_001',
		description: '只能获取本应用创建的直播。<a href="https://developer.work.weixin.qq.com/document/path/93740" target="_blank">官方文档</a>',
	},
];
