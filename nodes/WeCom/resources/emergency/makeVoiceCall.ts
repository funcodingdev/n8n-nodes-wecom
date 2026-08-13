import type { INodeProperties } from 'n8n-workflow';

const showOnlyForMakeVoiceCall = {
	resource: ['emergency'],
	operation: ['makeVoiceCall'],
};

export const makeVoiceCallDescription: INodeProperties[] = [
	{
		displayName: '被叫成员UserID列表',
		name: 'callee_userid',
		type: 'string',
		required: true,
		displayOptions: {
			show: showOnlyForMakeVoiceCall,
		},
		default: '',
		placeholder: 'zhangsan, lisi',
		description:
			'需要呼叫的成员 UserID；支持逗号、中文逗号、竖线或换行分隔，将自动去空和去重。<a href="https://developer.work.weixin.qq.com/document/path/91627" target="_blank">官方文档</a>',
	},
];
