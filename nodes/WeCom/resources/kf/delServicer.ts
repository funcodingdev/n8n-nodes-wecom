import type { INodeProperties } from 'n8n-workflow';

const showOnlyForDelServicer = {
	resource: ['kf'],
	operation: ['delServicer'],
};

export const delServicerDescription: INodeProperties[] = [
	{
		displayName: '客服账号',
		name: 'open_kfid',
		type: 'options',
		typeOptions: {
			loadOptionsMethod: 'getKfAccounts',
		},
		required: true,
		displayOptions: {
			show: showOnlyForDelServicer,
		},
		default: '',
		description: '客服账号的唯一标识ID。<a href="https://developer.work.weixin.qq.com/document/path/94647" target="_blank">官方文档</a>.',
		placeholder: 'wkxxxxxxxxxxxxxxxxxx',
	},
	{
		displayName: '接待人员列表',
		name: 'userid_list',
		type: 'string',
		displayOptions: {
			show: showOnlyForDelServicer,
		},
		default: '',
		description: '要删除的接待人员UserID列表，多个用英文逗号分隔，最多100个。与部门列表至少填其中一个。<a href="https://developer.work.weixin.qq.com/document/path/94647" target="_blank">官方文档</a>',
		placeholder: 'zhangsan,lisi',
	},
	{
		displayName: '接待人员部门列表',
		name: 'department_id_list',
		type: 'string',
		displayOptions: {
			show: showOnlyForDelServicer,
		},
		default: '',
		description: '接待人员部门ID列表，多个用英文逗号分隔，最多100个。与接待人员列表至少填其中一个。<a href="https://developer.work.weixin.qq.com/document/path/94647" target="_blank">官方文档</a>',
		placeholder: '2,4',
	},
];

