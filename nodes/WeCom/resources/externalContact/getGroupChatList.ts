import type { INodeProperties } from 'n8n-workflow';

const showOnly = {
	resource: ['externalContact'],
	operation: ['getGroupChatList'],
};

export const getGroupChatListDescription: INodeProperties[] = [
	{
		displayName: '状态过滤',
		name: 'status_filter',
		type: 'options',
		options: [
			{ name: '所有列表（不过滤）', value: 0 },
			{ name: '离职待继承', value: 1 },
			{ name: '离职继承中', value: 2 },
			{ name: '离职继承完成', value: 3 },
		],
		default: 0,
		displayOptions: { show: showOnly },
		description: '客户群跟进状态过滤，默认为0（不过滤）',
	},
	{
		displayName: '群主UserID列表',
		name: 'owner_filter',
		type: 'string',
		default: '',
		displayOptions: { show: showOnly },
		description: '群主过滤，指定群主的userid列表，多个用逗号分隔，最多100个。如果不填，表示获取应用可见范围内全部群主的数据（不建议，超过1000人会报错81017）',
		placeholder: 'zhangsan,lisi',
	},
	{
		displayName: '每页数量（必填）',
		name: 'limit',
		type: 'number',
		required: true,
		typeOptions: {
			minValue: 1,
			maxValue: 1000,
			numberStepSize: 1,
		},
		default: 100,
		displayOptions: { show: showOnly },
		description: '分页，预期请求的数据量，取值范围1~1000',
	},
	{
		displayName: '分页游标',
		name: 'cursor',
		type: 'string',
		default: '',
		displayOptions: { show: showOnly },
		description: '用于分页查询的游标，由上一次调用返回，首次调用不填',
	},
];
