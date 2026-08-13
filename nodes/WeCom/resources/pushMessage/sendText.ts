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
		description: '文本消息内容，最长不超过2048个字节。支持换行符，支持通过\\n换行。<a href="https://developer.work.weixin.qq.com/document/path/99110#%E6%96%87%E6%9C%AC%E7%B1%BB%E5%9E%8B" target="_blank">官方文档</a>',
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
		description: 'Userid 列表，提醒群中的指定成员。多个成员可用逗号、竖线或换行分隔，@all 表示提醒所有人；与下方选择合并。<a href="https://developer.work.weixin.qq.com/document/path/99110#%E6%96%87%E6%9C%AC%E7%B1%BB%E5%9E%8B" target="_blank">官方文档</a>',
	},
	{
		displayName: '@ 成员(选择)',
		name: 'mentionedList_selected',
		type: 'multiOptions',
		typeOptions: {
			loadOptionsMethod: 'getAllUsersWithAllOption',
		},
		displayOptions: {
			show: showOnlyForSendText,
		},
		default: [],
		description: '与上方列表合并去重；含「所有人」选项（@all）',
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
		description: '手机号列表，提醒手机号对应的群成员。多个手机号可用逗号、竖线或换行分隔，@all 表示提醒所有人。示例：13800001111,13900002222 或 @all。<a href="https://developer.work.weixin.qq.com/document/path/99110#%E6%96%87%E6%9C%AC%E7%B1%BB%E5%9E%8B" target="_blank">官方文档</a>',
	},
];
