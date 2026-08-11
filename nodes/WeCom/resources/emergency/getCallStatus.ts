import type { INodeProperties } from 'n8n-workflow';

const showOnlyForGetCallStatus = {
	resource: ['emergency'],
	operation: ['getCallStatus'],
};

export const getCallStatusDescription: INodeProperties[] = [
	{
		displayName: '被叫UserID',
		name: 'callee_userid',
		type: 'string',
		required: true,
		displayOptions: {
			show: showOnlyForGetCallStatus,
		},
		default: '',
		placeholder: 'zhangsan',
		description:
			'被叫成员 userid。<a href="https://developer.work.weixin.qq.com/document/path/91628" target="_blank">官方文档</a>',
	},
	{
		displayName: '通话ID',
		name: 'callid',
		type: 'string',
		required: true,
		displayOptions: {
			show: showOnlyForGetCallStatus,
		},
		default: '',
		placeholder: 'CALL_ID_STRING',
		description: '发起语音电话接口返回的 callid',
	},
];

