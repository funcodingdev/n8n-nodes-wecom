import type { INodeProperties } from 'n8n-workflow';

const showOnlyForReplyMarkdown = {
	resource: ['aibotPassiveReply'],
	operation: ['activeReply'],
	replyType: ['markdown'],
};

export const replyMarkdownDescription: INodeProperties[] = [
	{
		displayName: 'Markdown 内容',
		name: 'content',
		type: 'string',
		typeOptions: {
			rows: 10,
		},
		displayOptions: {
			show: showOnlyForReplyMarkdown,
		},
		default: '',
		placeholder: '# 标题\n## 二级标题\n**加粗**\n*斜体*',
		required: true,
		description: 'Markdown 消息内容，最长 20480 字节，必须是 UTF-8 编码；支持标题、字体、列表、引用、链接、图片、分割线、代码与表格',
	},
	{
		displayName: '反馈 ID',
		name: 'feedback_id',
		type: 'string',
		displayOptions: {
			show: showOnlyForReplyMarkdown,
		},
		default: '',
		placeholder: '例如：feedback_markdown_001',
		description: '非空时用户反馈会触发回调，最长 256 字节（UTF-8）',
	},
];
