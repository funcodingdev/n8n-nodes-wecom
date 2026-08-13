import type { INodeProperties } from 'n8n-workflow';

const showOnlyForAddServicer = {
	resource: ['kf'],
	operation: ['addServicer'],
};

export const addServicerDescription: INodeProperties[] = [
	{
		displayName: '客服账号',
		name: 'open_kfid',
		type: 'options',
		typeOptions: {
			loadOptionsMethod: 'getKfAccounts',
		},
		required: true,
		displayOptions: {
			show: showOnlyForAddServicer,
		},
		default: '',
		description: '要添加接待人员的客服账号。<a href="https://developer.work.weixin.qq.com/document/path/94646" target="_blank">官方文档</a>',
		placeholder: 'wkxxxxxxxxxxxxxxxxxx',
	},
	{
		displayName: '接待人员列表',
		name: 'userid_list',
		type: 'multiOptions',
		typeOptions: {
			loadOptionsMethod: 'getAllUsers',
		},
		displayOptions: {
			show: showOnlyForAddServicer,
		},
		default: [],
		description: '要添加的接待人员 UserID 列表，最多 100 人；第三方应用使用密文 UserID。与部门列表至少填写一项。<a href="https://developer.work.weixin.qq.com/document/path/94646" target="_blank">官方文档</a>',
	},
	{
		displayName: '接待人员部门列表',
		name: 'department_id_list',
		type: 'multiOptions',
		typeOptions: {
			loadOptionsMethod: 'getDepartments',
		},
		displayOptions: {
			show: showOnlyForAddServicer,
		},
		default: [],
		description: '要添加的接待人员部门列表，最多 20 个。与接待人员列表至少填写一项。<a href="https://developer.work.weixin.qq.com/document/path/94646" target="_blank">官方文档</a>',
	},
];
