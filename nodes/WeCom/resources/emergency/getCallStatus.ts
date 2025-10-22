import type { INodeProperties } from 'n8n-workflow';

const showOnlyForGetCallStatus = {
	resource: ['emergency'],
	operation: ['getCallStatus'],
};

export const getCallStatusDescription: INodeProperties[] = [
	{
		displayName: '通话ID',
		name: 'callid',
		type: 'string',
		required: true,
		displayOptions: {
			show: showOnlyForGetCallStatus,
		},
		default: '',
		description: 'Call ID returned from makeVoiceCall',
		hint: '通话ID（由发起语音电话接口返回）',
	},
];

