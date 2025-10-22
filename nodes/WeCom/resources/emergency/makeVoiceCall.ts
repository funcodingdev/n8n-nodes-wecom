import type { INodeProperties } from 'n8n-workflow';

const showOnlyForMakeVoiceCall = {
	resource: ['emergency'],
	operation: ['makeVoiceCall'],
};

export const makeVoiceCallDescription: INodeProperties[] = [
	{
		displayName: '被叫用户UserID',
		name: 'callee_userid',
		type: 'string',
		required: true,
		displayOptions: {
			show: showOnlyForMakeVoiceCall,
		},
		default: '',
		description: 'Callee user ID',
		hint: '被叫用户的UserID',
	},
	{
		displayName: '语音内容',
		name: 'text',
		type: 'string',
		required: true,
		displayOptions: {
			show: showOnlyForMakeVoiceCall,
		},
		default: '',
		description: 'Voice call content',
		hint: '语音通话内容',
	},
];

