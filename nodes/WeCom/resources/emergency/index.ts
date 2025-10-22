import type { INodeProperties } from 'n8n-workflow';

import { makeVoiceCallDescription } from './makeVoiceCall';
import { getCallStatusDescription } from './getCallStatus';

const showOnlyForEmergency = {
	resource: ['emergency'],
};

export const emergencyDescription: INodeProperties[] = [
	{
		displayName: '操作',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: showOnlyForEmergency,
		},
		options: [
			{
				name: '发起语音电话',
				value: 'makeVoiceCall',
				action: '发起语音电话',
				description: 'Make emergency voice call',
			},
			{
				name: '获取接听状态',
				value: 'getCallStatus',
				action: '获取接听状态',
				description: 'Get call status',
			},
		],
		default: 'makeVoiceCall',
	},
	...makeVoiceCallDescription,
	...getCallStatusDescription,
];

