import type { INodeProperties } from 'n8n-workflow';
import { getInvoiceInfoDescription } from './getInvoiceInfo';
import { updateInvoiceStatusDescription } from './updateInvoiceStatus';
import { batchUpdateInvoiceStatusDescription } from './batchUpdateInvoiceStatus';
import { batchGetInvoiceInfoDescription } from './batchGetInvoiceInfo';

const showOnlyForInvoice = {
	resource: ['invoice'],
};

export const invoiceDescription: INodeProperties[] = [
	{
		displayName: '操作',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: showOnlyForInvoice,
		},
		options: [
			{
				name: '[发票查询] 查询电子发票',
				value: 'getInvoiceInfo',
				action: '查询电子发票',
				description: '查询单张电子发票的详细信息。报销方在获得用户选择的电子发票标识参数后，可以通过该接口查询电子发票的结构化信息，并获取发票PDF文件。仅认证的企业微信账号有接口权限',
			},
			{
				name: '[发票查询] 批量查询电子发票',
				value: 'batchGetInvoiceInfo',
				action: '批量查询电子发票',
				description: '批量查询发票类型、金额、开票时间、PDF URL 与报销状态等结构化信息。仅认证且激活人数超过 200 的企业有权限',
			},
			{
				name: '[发票状态] 更新发票状态',
				value: 'updateInvoiceStatus',
				action: '更新发票状态',
				description: '更新单张发票的报销状态。报销企业和报销服务商可以通过该接口对某一张发票进行锁定、解锁和报销操作。锁定：电子发票进入了企业的报销流程时应该执行锁定操作；解锁：当电子发票由于各种原因，无法完成报销流程时，应执行解锁操作；报销：当电子发票报销完成后，应该使用本接口执行报销操作（注意，报销为不可逆操作）。仅认证的企业微信账号有接口权限',
			},
			{
				name: '[发票状态] 批量更新发票状态',
				value: 'batchUpdateInvoiceStatus',
				action: '批量更新发票状态',
				description: '批量更新多张发票的报销状态。发票平台可以通过该接口对某个成员的一批发票进行锁定、解锁和报销操作。注意，报销状态为不可逆状态，请开发者慎重调用。批量更新发票状态接口为事务性操作，如果其中一张发票更新失败，列表中的其它发票状态更新也会无法执行，恢复到接口调用前的状态。仅认证的企业微信账号有接口权限',
			},
		],
		default: 'getInvoiceInfo',
	},
	...getInvoiceInfoDescription,
	...updateInvoiceStatusDescription,
	...batchUpdateInvoiceStatusDescription,
	...batchGetInvoiceInfoDescription,
];
