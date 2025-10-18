import type { INodeProperties } from 'n8n-workflow';
import { getRecipientFields } from './commonFields';

const showOnlySendMiniprogramNotice = {
	resource: ['message'],
	operation: ['sendMiniprogramNotice'],
};

export const sendMiniprogramNoticeDescription: INodeProperties[] = [
	...getRecipientFields('sendMiniprogramNotice'),
	{
		displayName: '小程序Appid',
		name: 'appid',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: showOnlySendMiniprogramNotice,
		},
		description: '小程序appid，必须是与当前应用关联的小程序',
	},
	{
		displayName: '小程序Page路径',
		name: 'page',
		type: 'string',
		default: '',
		displayOptions: {
			show: showOnlySendMiniprogramNotice,
		},
		description: '点击消息卡片后的小程序页面，最长1024字节，仅限本小程序内的页面。该字段不填则消息点击后不跳转。',
	},
	{
		displayName: '消息标题',
		name: 'title',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: showOnlySendMiniprogramNotice,
		},
		description: '消息标题，长度限制4-12个汉字（支持ID转译）',
	},
	{
		displayName: '消息描述',
		name: 'description',
		type: 'string',
		typeOptions: {
			rows: 2,
		},
		default: '',
		displayOptions: {
			show: showOnlySendMiniprogramNotice,
		},
		description: '消息描述，长度限制4-12个汉字（支持ID转译）',
	},
	{
		displayName: '是否放大第一个Content_item',
		name: 'emphasis_first_item',
		type: 'boolean',
		default: false,
		displayOptions: {
			show: showOnlySendMiniprogramNotice,
		},
		description: '是否放大第一个内容项',
	},
	{
		displayName: '消息内容键值对',
		name: 'content_items',
		type: 'fixedCollection',
		typeOptions: {
			multipleValues: true,
		},
		required: true,
		default: {},
		placeholder: '添加内容项',
		displayOptions: {
			show: showOnlySendMiniprogramNotice,
		},
		description: '消息内容键值对，最多允许10个item',
		options: [
			{
				displayName: '内容项',
				name: 'item',
				values: [
					{
						displayName: '长度10个汉字以内',
						name: 'key',
						type: 'string',
						required: true,
						default: '',
					},
					{
						displayName: '长度30个汉字以内',
						name: 'value',
						type: 'string',
						required: true,
						default: '',
						description: '长度30个汉字以内（支持ID转译）',
					},
				],
			},
		],
	},
	{
		displayName: '是否开启ID转译',
		name: 'enable_id_trans',
		type: 'boolean',
		default: false,
		displayOptions: {
			show: showOnlySendMiniprogramNotice,
		},
		description: '是否开启ID转译，开启后会将消息中的userid转为@对应成员',
	},
	{
		displayName: '是否开启重复消息检查',
		name: 'enable_duplicate_check',
		type: 'boolean',
		default: false,
		displayOptions: {
			show: showOnlySendMiniprogramNotice,
		},
		description: '是否开启重复消息检查，开启后在时间间隔内相同内容的消息不会重复发送',
	},
	{
		displayName: '重复消息检查时间',
		name: 'duplicate_check_interval',
		type: 'number',
		default: 1800,
		displayOptions: {
			show: {
				...showOnlySendMiniprogramNotice,
				enable_duplicate_check: [true],
			},
		},
		description: '表示是否重复消息检查的时间间隔，默认1800s，最大不超过4小时',
	},
];

