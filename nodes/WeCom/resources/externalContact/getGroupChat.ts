import type { INodeProperties } from 'n8n-workflow';

const showOnly = {
	resource: ['externalContact'],
	operation: ['getGroupChat'],
};

export const getGroupChatDescription: INodeProperties[] = [
	{
		displayName: '客户群ID',
		name: 'chat_id',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: showOnly,
		},
		description: '客户群ID，可以通过"获取客户群列表"接口获取。<a href="https://developer.work.weixin.qq.com/document/path/92122" target="_blank">官方文档</a>。客户群ID',
		placeholder: 'wrXXXXXXXXXXXXXXXXXXXXXXXX',
	},
	{
		displayName: '是否需要返回群成员的名字',
		name: 'need_name',
		type: 'boolean',
		default: false,
		displayOptions: {
			show: showOnly,
		},
		description: '是否需要返回群成员名字；官方默认不返回，按需开启可减少响应数据量',
	},
];
