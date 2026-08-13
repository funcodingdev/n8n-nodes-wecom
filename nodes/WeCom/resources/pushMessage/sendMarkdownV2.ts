import type { INodeProperties } from 'n8n-workflow';

const showOnlyForSendMarkdownV2 = {
	resource: ['pushMessage'],
	operation: ['sendMarkdownV2'],
};

export const sendMarkdownV2Description: INodeProperties[] = [
	{
		displayName: 'Markdown 内容',
		name: 'content',
		type: 'string',
		typeOptions: {
			rows: 8,
		},
		displayOptions: {
			show: showOnlyForSendMarkdownV2,
		},
		default: '',
		required: true,
		placeholder: '# 标题\n\n**加粗**\n\n> 引用文本\n\n| 列一 | 列二 |\n| --- | --- |',
		description: 'Markdown V2 格式的消息内容，最长不超过4096个字节。该类型支持表格等扩展语法，但不支持字体颜色和 @ 成员。<a href="https://developer.work.weixin.qq.com/document/path/99110#markdown-v2%E7%B1%BB%E5%9E%8B" target="_blank">官方文档</a>',
	},
];
