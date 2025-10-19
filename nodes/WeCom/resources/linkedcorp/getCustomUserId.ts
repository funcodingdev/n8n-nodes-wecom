import type { INodeProperties } from 'n8n-workflow';

const showOnlyForGetCustomId = {
	resource: ['linkedcorp'],
	operation: ['getCustomUserId'],
};

export const getCustomUserIdDescription: INodeProperties[] = [
	{
		displayName: '上下游ID',
		name: 'chain_id',
		type: 'string',
		required: true,
		displayOptions: {
			show: showOnlyForGetCustomId,
		},
		default: '',
		description: '上下游的唯一ID。',
		hint: '上下游ID',
	},
	{
		displayName: '成员UserID列表',
		name: 'userid_list',
		type: 'string',
		required: true,
		displayOptions: {
			show: showOnlyForGetCustomId,
		},
		default: '',
		description: '成员UserID列表，多个用逗号分隔，最多支持100个。',
		hint: 'UserID列表，用逗号分隔',
	},
];

