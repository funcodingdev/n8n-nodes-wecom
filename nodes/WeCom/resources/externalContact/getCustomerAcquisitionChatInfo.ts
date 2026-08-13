import type { INodeProperties } from 'n8n-workflow';

const showOnly = {
	resource: ['externalContact'],
	operation: ['getCustomerAcquisitionChatInfo'],
};

export const getCustomerAcquisitionChatInfoDescription: INodeProperties[] = [
	{
		displayName: '会话信息凭据',
		name: 'chat_key',
		type: 'string',
		required: true,
		default: '',
		displayOptions: { show: showOnly },
		description: '“成员多次收消息”事件回调中的 ChatKey，回调后仅 30 分钟内有效，请及时调用',
		placeholder: 'CHAT_KEY',
	},
];
