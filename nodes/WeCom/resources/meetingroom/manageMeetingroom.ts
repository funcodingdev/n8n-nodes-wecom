import type { INodeProperties } from 'n8n-workflow';

const showOnlyForManageMeetingroom = {
	resource: ['meetingroom'],
	operation: ['manageMeetingroom'],
};

export const manageMeetingroomDescription: INodeProperties[] = [
	{
		displayName: '操作类型',
		name: 'action',
		type: 'options',
		required: true,
		displayOptions: {
			show: showOnlyForManageMeetingroom,
		},
		options: [
			{ name: '添加会议室', value: 'add' },
			{ name: '编辑会议室', value: 'edit' },
			{ name: '删除会议室', value: 'delete' },
			{ name: '查询会议室', value: 'get' },
			{ name: '查询会议室列表', value: 'list' },
		],
		default: 'list',
		description: 'Meeting room management action',
		hint: '会议室管理操作类型',
	},
	{
		displayName: '会议室数据',
		name: 'roomData',
		type: 'json',
		displayOptions: {
			show: showOnlyForManageMeetingroom,
		},
		default: '{}',
		description: 'Meeting room data in JSON format',
		hint: '会议室数据，JSON格式',
	},
];

