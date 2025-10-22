import type { INodeProperties } from 'n8n-workflow';

const showOnly = {
	resource: ['externalContact'],
	operation: ['addJoinWay'],
};

export const addJoinWayDescription: INodeProperties[] = [
	{
		displayName: '场景',
		name: 'scene',
		type: 'options',
		options: [
			{
				name: '群的小程序插件',
				value: 1,
			},
			{
				name: '群的二维码插件',
				value: 2,
			},
		],
		required: true,
		default: 2,
		displayOptions: {
			show: showOnly,
		},
		hint: '场景。1 - 群的小程序插件 2 - 群的二维码插件',
	},
	{
		displayName: '群聊ID列表',
		name: 'chat_id_list',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: showOnly,
		},
		hint: '客户群ID列表，用逗号分隔',
		description: '客户群ID列表',
	},
	{
		displayName: '自动创建群',
		name: 'auto_create_room',
		type: 'boolean',
		default: false,
		displayOptions: {
			show: showOnly,
		},
		hint: '当群满了后，是否自动新建群',
		description: 'Whether to automatically create a new group when the group is full',
	},
	{
		displayName: '群名称',
		name: 'room_base_name',
		type: 'string',
		default: '',
		displayOptions: {
			show: showOnly,
		},
		hint: '自动创建的群名前缀',
		description: '自动创建的群名前缀',
	},
	{
		displayName: '群ID',
		name: 'room_base_id',
		type: 'number',
		default: 1,
		displayOptions: {
			show: showOnly,
		},
		hint: '自动创建的群起始序号',
		description: '自动创建的群起始序号',
	},
];

