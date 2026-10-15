import type { INodeProperties } from 'n8n-workflow';

const showOnly = {
	resource: ['externalContact'],
	operation: ['getExternalContact'],
};

export const getExternalContactDescription: INodeProperties[] = [
	{
		displayName: '外部联系人UserID',
		name: 'external_userid',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: showOnly,
		},
		description: '外部联系人的UserID，格式为wmxxxx开头的字符串，注意不是企业成员的UserID。可从添加外部联系人事件、批量获取客户列表等接口中获取。<a href="https://developer.work.weixin.qq.com/document/path/92114" target="_blank">官方文档</a>',
		placeholder: 'wmxxxxxxxxxxxxxxxxxx',
	},
	{
		displayName: '分页游标',
		name: 'cursor',
		type: 'string',
		default: '',
		displayOptions: {
			show: showOnly,
		},
		description: '用于分页查询的游标，首次请求留空，后续请求传入上次返回的next_cursor值。当外部联系人在多个成员处时，使用游标进行分页查询。<a href="https://developer.work.weixin.qq.com/document/path/92114" target="_blank">官方文档</a>',
		placeholder: '',
	},
];

