import type { INodeProperties } from 'n8n-workflow';

const showOnlyForAuthSucc = {
	resource: ['contact'],
	operation: ['authSucc'],
};

export const authSuccDescription: INodeProperties[] = [
	{
		displayName: '成员',
		name: 'userid',
		type: 'options',
		typeOptions: {
			loadOptionsMethod: 'getAllUsers',
		},
		required: true,
		default: '',
		displayOptions: {
			show: showOnlyForAuthSucc,
		},
		description: '从列表中选择成员，或使用表达式指定 UserID。此接口可以满足安全性要求高的企业进行成员验证。开启二次验证后，当且仅当成员登录时，需跳转至企业自定义的页面进行验证。如果成员是首次加入企业，企业获取到userid，并验证了成员信息后，调用此接口即可让成员成功加入企业。<a href="https://developer.work.weixin.qq.com/document/path/90203" target="_blank">官方文档</a>。Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>',
	},
];
