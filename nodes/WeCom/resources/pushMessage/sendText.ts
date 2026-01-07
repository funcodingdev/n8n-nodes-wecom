import type { INodeProperties } from 'n8n-workflow';

const showOnlyForSendText = {
	resource: ['pushMessage'],
	operation: ['sendText'],
};

export const sendTextDescription: INodeProperties[] = [
	{
		displayName: '消息内容',
		name: 'content',
		type: 'string',
		typeOptions: {
			rows: 4,
		},
		displayOptions: {
			show: showOnlyForSendText,
		},
		default: '',
		required: true,
		placeholder: '请输入文本消息内容...',
		description: '文本消息内容，最长不超过2048个字节。<a href="https://developer.work.weixin.qq.com/document/path/99110#%E6%96%87%E6%9C%AC%E7%B1%BB%E5%9E%8B" target="_blank">官方文档</a>',
		hint: '支持换行符，支持通过\\n换行',
	},
	{
		displayName: '@ 成员（UserID）',
		name: 'mentionedList',
		type: 'string',
		displayOptions: {
			show: showOnlyForSendText,
		},
		default: '',
		placeholder: 'wangqing,zhangsan 或 @all',
		description: 'Userid 列表，提醒群中的指定成员。多个成员用逗号分隔，@all 表示提醒所有人。<a href="https://developer.work.weixin.qq.com/document/path/99110#%E6%96%87%E6%9C%AC%E7%B1%BB%E5%9E%8B" target="_blank">官方文档</a>',
		hint: '示例：wangqing,zhangsan 或 @all',
	},
	{
		displayName: '@ 成员（手机号）',
		name: 'mentionedMobileList',
		type: 'string',
		displayOptions: {
			show: showOnlyForSendText,
		},
		default: '',
		placeholder: '13800001111,13900002222 或 @all',
		description: '手机号列表，提醒手机号对应的群成员。多个手机号用逗号分隔，@all 表示提醒所有人。<a href="https://developer.work.weixin.qq.com/document/path/99110#%E6%96%87%E6%9C%AC%E7%B1%BB%E5%9E%8B" target="_blank">官方文档</a>',
		hint: '示例：13800001111,13900002222 或 @all',
	},
];

