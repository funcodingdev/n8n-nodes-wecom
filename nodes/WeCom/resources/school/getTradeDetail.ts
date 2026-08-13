import type { INodeProperties } from 'n8n-workflow';

const showOnlyForGetTradeDetail = {
	resource: ['school'],
	operation: ['getTradeDetail'],
};

export const getTradeDetailDescription: INodeProperties[] = [
	{
		displayName: '收款项目 ID',
		name: 'payment_id',
		type: 'string',
		required: true,
		displayOptions: {
			show: showOnlyForGetTradeDetail,
		},
		default: '',
		placeholder: 'payment_001',
		description: '由应用发起班级收款接口返回；只能查询当前应用创建的收款项目',
	},
	{
		displayName: '订单号',
		name: 'trade_no',
		type: 'string',
		required: true,
		displayOptions: {
			show: showOnlyForGetTradeDetail,
		},
		default: '',
		placeholder: 'trade_001',
		description: '由“获取学生付款结果”接口返回。<a href="https://developer.work.weixin.qq.com/document/path/94471" target="_blank">官方文档</a>',
	},
];
