import type { INodeProperties } from 'n8n-workflow';

const showOnly = {
	resource: ['externalContact'],
	operation: ['updateJoinWay'],
};

export const updateJoinWayDescription: INodeProperties[] = [
	{
		displayName: '配置ID',
		name: 'config_id',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: showOnly,
		},
		hint: '加入群聊的配置id',
		description: '加入群聊的配置ID',
	},
	{
		displayName: '群聊ID列表',
		name: 'chat_id_list',
		type: 'string',
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
];

