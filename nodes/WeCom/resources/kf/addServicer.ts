import type { INodeProperties } from 'n8n-workflow';

const showOnlyForAddServicer = {
	resource: ['kf'],
	operation: ['addServicer'],
};

export const addServicerDescription: INodeProperties[] = [
	{
		displayName: '客服账号',
		name: 'open_kfid',
		type: 'string',
		displayOptions: { show: showOnlyForAddServicer },
		default: '',
		placeholder: 'wkxxxxxxxxxxxxxxxxxx',
		description: '要添加接待人员的客服账号。<a href="https://developer.work.weixin.qq.com/document/path/94646" target="_blank">官方文档</a>；可与下方选择二选一',
	},
	{
		displayName: '客服账号(选择)',
		name: 'open_kfid_selected',
		type: 'options',
		typeOptions: { loadOptionsMethod: 'getKfAccounts' },
		displayOptions: { show: showOnlyForAddServicer },
		default: '',
		description: '与上方字符串二选一；均填写时以字符串为准',
	},
	{
		displayName: '接待人员UserID列表',
		name: 'userid_list_text',
		type: 'string',
		displayOptions: {
			show: showOnlyForAddServicer,
		},
		default: '',
		placeholder: 'zhangsan,lisi',
		description: '逗号分隔，最多 100 人；与下方选择合并',
	},
	{
		displayName: '接待人员(选择)',
		name: 'userid_list',
		type: 'multiOptions',
		typeOptions: {
			loadOptionsMethod: 'getAllUsers',
		},
		displayOptions: {
			show: showOnlyForAddServicer,
		},
		default: [],
		description: '最多 100 人；第三方应用使用密文 UserID。与部门至少填写一项。<a href="https://developer.work.weixin.qq.com/document/path/94646" target="_blank">官方文档</a>',
	},
	{
		displayName: '接待人员 JSON',
		name: 'useridListJson',
		type: 'json',
		displayOptions: {
			show: showOnlyForAddServicer,
		},
		default: '[]',
		description:
			'可选。非空数组时与上方列表/选择合并去重。支持 ["userid1"] 或 [{"userid":"userid1"}]',
	},
	{
		displayName: '接待部门ID列表',
		name: 'department_id_list_text',
		type: 'string',
		displayOptions: {
			show: showOnlyForAddServicer,
		},
		default: '',
		placeholder: '1,2',
		description: '逗号分隔，最多 20 个；与下方选择合并',
	},
	{
		displayName: '接待部门(选择)',
		name: 'department_id_list',
		type: 'multiOptions',
		typeOptions: {
			loadOptionsMethod: 'getDepartments',
		},
		displayOptions: {
			show: showOnlyForAddServicer,
		},
		default: [],
		description: '最多 20 个。与接待人员至少填写一项。<a href="https://developer.work.weixin.qq.com/document/path/94646" target="_blank">官方文档</a>',
	},
	{
		displayName: '接待部门 JSON',
		name: 'departmentIdListJson',
		type: 'json',
		displayOptions: {
			show: showOnlyForAddServicer,
		},
		default: '[]',
		description:
			'可选。非空数组时与上方列表/选择合并去重。支持 [1,2] 或 [{"partyid":1}] / [{"departmentid":1}]',
	},
];
