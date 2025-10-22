import type { INodeProperties } from 'n8n-workflow';

const showOnly = {
	resource: ['externalContact'],
	operation: ['cancelGroupMsgSend'],
};

export const cancelGroupMsgSendDescription: INodeProperties[] = [
	{
		displayName: '群发消息ID',
		name: 'msgid',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: showOnly,
		},
		hint: '群发消息的id',
		description: '群发消息的ID，由创建企业群发返回',
	},
];

