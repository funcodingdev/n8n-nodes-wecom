import type { INodeProperties } from 'n8n-workflow';

const showOnlySendMarkdown = {
	resource: ['message'],
	operation: ['sendMarkdown'],
};

export const sendMarkdownDescription: INodeProperties[] = [
	{
		displayName: '接收人',
		name: 'touser',
		type: 'string',
		default: '',
		displayOptions: {
			show: showOnlySendMarkdown,
		},
		description: '成员ID列表（消息接收者，多个接收者用 | 分隔，最多支持1000个）。特殊情况：指定为 @all，则向该企业应用的全部成员发送',
	},
	{
		displayName: '部门ID',
		name: 'toparty',
		type: 'string',
		default: '',
		displayOptions: {
			show: showOnlySendMarkdown,
		},
		description: '部门ID列表，多个接收者用 | 分隔，最多支持100个。当touser为@all时忽略本参数',
	},
	{
		displayName: '标签ID',
		name: 'totag',
		type: 'string',
		default: '',
		displayOptions: {
			show: showOnlySendMarkdown,
		},
		description: '标签ID列表，多个接收者用 | 分隔，最多支持100个。当touser为@all时忽略本参数',
	},
	{
		displayName: 'Markdown 内容',
		name: 'content',
		type: 'string',
		typeOptions: {
			rows: 6,
		},
		required: true,
		default: '',
		displayOptions: {
			show: showOnlySendMarkdown,
		},
		description: 'Markdown 格式的消息内容，最长不超过2048个字节，必须是utf8编码',
	},
];

