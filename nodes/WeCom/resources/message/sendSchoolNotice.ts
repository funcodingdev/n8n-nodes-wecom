import type { INodeProperties } from 'n8n-workflow';

const showOnlyForSchoolNotice = {
	resource: ['message'],
	operation: ['sendSchoolNotice'],
};

export const sendSchoolNoticeDescription: INodeProperties[] = [
	{
		displayName: '接收对象',
		name: 'touser',
		type: 'string',
		displayOptions: {
			show: showOnlyForSchoolNotice,
		},
		default: '',
		description: '指定接收消息的成员，成员ID列表（多个接收者用|分隔，最多支持1000个）。特殊情况：指定为@all，则向该企业应用的全部成员发送。',
		hint: '成员ID列表，用|分隔',
	},
	{
		displayName: '接收部门',
		name: 'toparty',
		type: 'string',
		displayOptions: {
			show: showOnlyForSchoolNotice,
		},
		default: '',
		description: '指定接收消息的部门，部门ID列表，多个接收者用|分隔，最多支持100个。当touser为@all时忽略本参数。',
		hint: '部门ID列表，用|分隔',
	},
	{
		displayName: '接收标签',
		name: 'totag',
		type: 'string',
		displayOptions: {
			show: showOnlyForSchoolNotice,
		},
		default: '',
		description: '指定接收消息的标签，标签ID列表，多个接收者用|分隔，最多支持100个。当touser为@all时忽略本参数。',
		hint: '标签ID列表，用|分隔',
	},
	{
		displayName: '标题',
		name: 'title',
		type: 'string',
		required: true,
		displayOptions: {
			show: showOnlyForSchoolNotice,
		},
		default: '',
		description: '消息标题，最多64个字节。',
		hint: '通知标题',
	},
	{
		displayName: '消息内容',
		name: 'description',
		type: 'string',
		required: true,
		displayOptions: {
			show: showOnlyForSchoolNotice,
		},
		default: '',
		description: '消息内容，最多600个字节。',
		hint: '通知内容',
	},
	{
		displayName: '点击后跳转的链接',
		name: 'url',
		type: 'string',
		displayOptions: {
			show: showOnlyForSchoolNotice,
		},
		default: '',
		description: '点击后跳转的链接。',
		hint: '跳转链接',
	},
	{
		displayName: '是否放大第一个Card',
		name: 'emphasis_first_item',
		type: 'boolean',
		displayOptions: {
			show: showOnlyForSchoolNotice,
		},
		default: false,
		description: '是否放大第一个card样式。',
		hint: '是否放大第一项',
	},
	{
		displayName: '内容区域',
		name: 'content_item',
		type: 'json',
		displayOptions: {
			show: showOnlyForSchoolNotice,
		},
		default: '[]',
		description: '内容区，card_action和content_item至少要有一个。',
		hint: '内容项JSON数组',
	},
];

