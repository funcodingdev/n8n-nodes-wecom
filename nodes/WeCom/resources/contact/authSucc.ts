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
		required: true,
		default: '',
		displayOptions: {
			show: showOnlyForAuthSucc,
		},
		description:
			'成员 UserID。开启二次验证后，验证成员信息通过再调用本接口，成员即可成功加入企业。<a href="https://developer.work.weixin.qq.com/document/path/90203" target="_blank">官方文档</a>',
	},
];
