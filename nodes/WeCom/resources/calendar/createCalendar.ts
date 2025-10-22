import type { INodeProperties } from 'n8n-workflow';

const showOnlyForCreate = {
	resource: ['calendar'],
	operation: ['createCalendar'],
};

export const createCalendarDescription: INodeProperties[] = [
	{
		displayName: '日历标题',
		name: 'summary',
		type: 'string',
		required: true,
		displayOptions: {
			show: showOnlyForCreate,
		},
		default: '',
		description: 'Calendar summary, supports Chinese, English, numbers and some special characters',
		hint: '日历标题',
	},
	{
		displayName: '管理员列表',
		name: 'admins',
		type: 'string',
		required: true,
		displayOptions: {
			show: showOnlyForCreate,
		},
		default: '',
		description: 'Administrator UserID list, separated by commas. The first one is the organizer',
		hint: '管理员UserID列表，用逗号分隔，第一个为组织者',
	},
	{
		displayName: '日历描述',
		name: 'description',
		type: 'string',
		displayOptions: {
			show: showOnlyForCreate,
		},
		default: '',
		description: 'Calendar description, supports Chinese, English, numbers and some special characters',
		hint: '日历描述',
	},
	{
		displayName: '颜色',
		name: 'color',
		type: 'options',
		displayOptions: {
			show: showOnlyForCreate,
		},
		options: [
			{ name: '默认蓝色', value: 0 },
			{ name: '荔枝红', value: 1 },
			{ name: '石榴红', value: 2 },
			{ name: '南瓜橙', value: 3 },
			{ name: '柠檬黄', value: 4 },
			{ name: '嫩草绿', value: 5 },
			{ name: '葱心绿', value: 6 },
			{ name: '天空蓝', value: 7 },
			{ name: '海水蓝', value: 8 },
			{ name: '丁香紫', value: 9 },
			{ name: '芋头紫', value: 10 },
			{ name: '灰', value: 11 },
		],
		default: 0,
		description: 'Calendar color',
		hint: '日历颜色',
	},
	{
		displayName: '共享范围',
		name: 'shares',
		type: 'json',
		displayOptions: {
			show: showOnlyForCreate,
		},
		default: '',
		description: 'Share scope, JSON format array. Example: [{"userid":"userid1"}]',
		hint: '共享范围，JSON格式数组',
	},
];

