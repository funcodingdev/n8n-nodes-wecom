import type { INodeProperties } from 'n8n-workflow';

const showOnly = {
	resource: ['school'],
	operation: ['getSchoolUser'],
};

export const getSchoolUserDescription: INodeProperties[] = [
	{
		displayName: 'UserID',
		name: 'userid',
		type: 'string',
		required: true,
		displayOptions: {
			show: showOnly,
		},
		default: '',
		description: '家校通讯录中学生或家长的 UserID，不区分大小写，长度为 1–64 个 UTF-8 字节',
	},
];
