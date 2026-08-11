import type { INodeProperties } from 'n8n-workflow';

const showOnly = {
	resource: ['mail'],
	operation: ['updatePublicMailbox'],
};

export const updatePublicMailboxDescription: INodeProperties[] = [
	{
		displayName: '公共邮箱ID',
		name: 'id',
		type: 'number',
		required: true,
		displayOptions: { show: showOnly },
		default: 0,
		description:
			'公共邮箱 ID。<a href="https://developer.work.weixin.qq.com/document/path/98000" target="_blank">官方文档</a>',
	},
	{
		displayName: '公共邮箱名称',
		name: 'name',
		type: 'string',
		displayOptions: { show: showOnly },
		default: '',
		description: '新名称，不传则不变',
	},
	{
		displayName: '成员UserID列表',
		name: 'userid_list',
		type: 'string',
		displayOptions: { show: showOnly },
		default: '',
		placeholder: 'zhangsan,lisi',
		description: '成员 userid 列表，逗号分隔；不传不变，传空串请用接口语义注意清空规则',
	},
	{
		displayName: '部门ID列表',
		name: 'department_list',
		type: 'string',
		displayOptions: { show: showOnly },
		default: '',
		placeholder: '1,2',
	},
	{
		displayName: '标签ID列表',
		name: 'tag_list',
		type: 'string',
		displayOptions: { show: showOnly },
		default: '',
		placeholder: '1,2',
	},
];
