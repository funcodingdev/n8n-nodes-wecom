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
		hint: '外部联系人的userid，注意不是企业成员的帐号',
		description: '外部联系人的userid',
	},
	{
		displayName: 'Cursor',
		name: 'cursor',
		type: 'string',
		default: '',
		displayOptions: {
			show: showOnly,
		},
		hint: '上次请求返回的next_cursor',
		description: '用于分页查询的游标，第一次请求不填，后续请求填写上次返回的next_cursor',
	},
];

