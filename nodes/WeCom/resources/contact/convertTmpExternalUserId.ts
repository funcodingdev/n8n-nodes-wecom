import type { INodeProperties } from 'n8n-workflow';

const showOnlyForConvertTmp = {
	resource: ['contact'],
	operation: ['convertTmpExternalUserId'],
};

export const convertTmpExternalUserIdDescription: INodeProperties[] = [
	{
		displayName: '临时外部联系人ID',
		name: 'tmp_external_userid',
		type: 'string',
		required: true,
		displayOptions: {
			show: showOnlyForConvertTmp,
		},
		default: '',
		description: '临时外部联系人的userid，由用户在微信上使用客户联系功能产生。',
		hint: '临时外部联系人ID',
	},
];

