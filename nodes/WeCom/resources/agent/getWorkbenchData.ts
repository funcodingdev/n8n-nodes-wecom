import type { INodeProperties } from 'n8n-workflow';

const showOnlyGetWorkbenchData = {
	resource: ['agent'],
	operation: ['getWorkbenchData'],
};

export const getWorkbenchDataDescription: INodeProperties[] = [
	{
		displayName: '应用 ID',
		name: 'agentid',
		type: 'number',
		required: true,
		default: 0,
		typeOptions: { minValue: 1, numberStepSize: 1 },
		displayOptions: {
			show: showOnlyGetWorkbenchData,
		},
		description: '企业应用的唯一标识',
	},
	{
		displayName: '用户UserID',
		name: 'userid',
		type: 'string',
		default: '',
		placeholder: 'zhangsan',
		displayOptions: {
			show: showOnlyGetWorkbenchData,
		},
		description:
			'应用可见范围内的成员 UserID。<a href="https://developer.work.weixin.qq.com/document/path/92535" target="_blank">官方文档</a>；可与下方选择二选一',
	},
	{
		displayName: '成员(选择)',
		name: 'userid_selected',
		type: 'options',
		typeOptions: { loadOptionsMethod: 'getAllUsers' },
		default: '',
		displayOptions: {
			show: showOnlyGetWorkbenchData,
		},
		description: '与上方字符串二选一；均填写时以字符串为准',
	},
];
