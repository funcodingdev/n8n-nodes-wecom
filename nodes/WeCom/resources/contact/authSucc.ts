import type { INodeProperties } from 'n8n-workflow';

const showOnlyForAuthSucc = {
	resource: ['contact'],
	operation: ['authSucc'],
};

export const authSuccDescription: INodeProperties[] = [
	{
		displayName: '成员UserID',
		name: 'userid',
		type: 'string',
		placeholder: 'zhangsan',
		default: '',
		displayOptions: {
			show: showOnlyForAuthSucc,
		},
		description:
			'成员 UserID。开启二次验证后，验证成员信息通过再调用本接口，成员即可成功加入企业。<a href="https://developer.work.weixin.qq.com/document/path/90203" target="_blank">官方文档</a>；可与下方选择二选一',
	},
	{
		displayName: '成员(选择)',
		name: 'userid_selected',
		type: 'options',
		typeOptions: { loadOptionsMethod: 'getAllUsers' },
		default: '',
		displayOptions: {
			show: showOnlyForAuthSucc,
		},
		description: '与上方字符串二选一；均填写时以字符串为准',
	},
];
