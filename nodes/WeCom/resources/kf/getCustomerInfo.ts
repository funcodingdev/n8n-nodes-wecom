import type { INodeProperties } from 'n8n-workflow';

const showOnlyForGetCustomerInfo = {
	resource: ['kf'],
	operation: ['getCustomerInfo'],
};

export const getCustomerInfoDescription: INodeProperties[] = [
	{
		displayName: '外部联系人ID列表',
		name: 'external_userid_list',
		type: 'string',
		required: true,
		displayOptions: {
			show: showOnlyForGetCustomerInfo,
		},
		default: '',
		description:
			'客户 external_userid 列表，支持逗号、中文逗号、竖线或换行分隔，自动去重，单次 1–100 个。<a href="https://developer.work.weixin.qq.com/document/path/95159" target="_blank">官方文档</a>',
		placeholder: 'wmxxxxxxxxxxxxxxxxxxxxxx,wmxxxxxxxxxxxxxxxxxxxxxx',
	},
	{
		displayName: '返回进入会话上下文',
		name: 'need_enter_session_context',
		type: 'boolean',
		displayOptions: {
			show: showOnlyForGetCustomerInfo,
		},
		default: false,
		description: '是否返回客户 48 小时内最后一次进入会话的上下文信息（need_enter_session_context）',
	},
];
