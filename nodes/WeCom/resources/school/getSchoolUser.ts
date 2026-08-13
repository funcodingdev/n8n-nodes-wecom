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
		displayOptions: {
			show: showOnly,
		},
		default: '',
		description: '家校通讯录中学生或家长的 UserID，不区分大小写，长度为 1–64 个 UTF-8 字节；可与下方选择二选一',
	},
	{
		displayName: '成员(选择)',
		name: 'userid_selected',
		type: 'options',
		typeOptions: { loadOptionsMethod: 'getAllUsers' },
		default: '',
		displayOptions: {
			show: showOnly,
		},
		description: '与上方字符串二选一；均填写时以字符串为准',
	},
];
