import type { INodeProperties } from 'n8n-workflow';

const showOnlyForGetTradeResult = {
	resource: ['school'],
	operation: ['getTradeResult'],
};

export const getTradeResultDescription: INodeProperties[] = [
	{
		displayName: '收款项目 ID',
		name: 'payment_id',
		type: 'string',
		required: true,
		displayOptions: {
			show: showOnlyForGetTradeResult,
		},
		default: '',
		placeholder: 'payment_001',
		description: '由应用发起班级收款接口返回；只能查询当前应用创建的收款项目。<a href="https://developer.work.weixin.qq.com/document/path/94470" target="_blank">官方文档</a>',
	},
];
