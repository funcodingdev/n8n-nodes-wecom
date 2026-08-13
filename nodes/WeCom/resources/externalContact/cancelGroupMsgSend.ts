import type { INodeProperties } from 'n8n-workflow';

const showOnly = {
	resource: ['externalContact'],
	operation: ['cancelGroupMsgSend'],
};

export const cancelGroupMsgSendDescription: INodeProperties[] = [
	{
		displayName: '停止限制',
		name: 'cancelGroupMessageNotice',
		type: 'notice',
		default: '',
		displayOptions: { show: showOnly },
		description: '停止群发只能阻止尚未发送的任务，无法撤回已经群发给客户的消息',
	},
	{
		displayName: '群发消息ID',
		name: 'msgid',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: showOnly,
		},
		description: '群发消息的ID，由创建企业群发返回。群发消息的ID',
	},
];
