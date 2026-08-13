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
		displayOptions: {
			show: showOnlyForMakeVoiceCall,
		},
		default: '',
		placeholder: 'zhangsan, lisi',
		description:
			'需要呼叫的成员 UserID；与下方选择合并；支持逗号、中文逗号、竖线或换行分隔，将自动去空和去重。<a href="https://developer.work.weixin.qq.com/document/path/91627" target="_blank">官方文档</a>',
	},
	{
		displayName: '被叫成员(选择)',
		name: 'callee_userid_selected',
		type: 'multiOptions',
		typeOptions: { loadOptionsMethod: 'getAllUsers' },
		displayOptions: {
			show: showOnlyForMakeVoiceCall,
		},
		default: [],
		description: '与上方列表合并去重',
	},
	{
		displayName: '被叫成员 JSON',
		name: 'calleeUseridsJson',
		type: 'json',
		displayOptions: {
			show: showOnlyForMakeVoiceCall,
		},
		default: '[]',
		description:
			'可选。非空数组时与上方列表/选择合并去重。支持 ["userid1"] 或 [{"userid":"userid1"}]',
	},
];
