import type { INodeProperties } from 'n8n-workflow';
import { getRecipientFields } from './commonFields';

const showOnlySendTaskCard = {
	resource: ['message'],
	operation: ['sendTaskCard'],
};

export const sendTaskCardDescription: INodeProperties[] = [
	...getRecipientFields('sendTaskCard'),
	{
		displayName: '标题',
		name: 'title',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: showOnlySendTaskCard,
		},
		description: '标题，不超过128个字节，超过会自动截断（支持ID转译）',
	},
	{
		displayName: '描述',
		name: 'description',
		type: 'string',
		typeOptions: {
			rows: 4,
		},
		required: true,
		default: '',
		displayOptions: {
			show: showOnlySendTaskCard,
		},
		description: '描述，不超过512个字节，超过会自动截断（支持ID转译）',
	},
	{
		displayName: '跳转链接',
		name: 'url',
		type: 'string',
		default: '',
		displayOptions: {
			show: showOnlySendTaskCard,
		},
		description: '点击后跳转的链接。最长2048字节，请确保包含了协议头(http/https)，小程序或者URL必须填写一个',
	},
	{
		displayName: '任务ID',
		name: 'task_id',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: showOnlySendTaskCard,
		},
		description: '任务 ID，同一个应用发送的任务卡片消息的任务 ID 不能重复，只能由数字、字母和"_-@"组成，最长支持128字节',
	},
	{
		displayName: '按钮列表',
		name: 'buttons',
		type: 'fixedCollection',
		typeOptions: {
			multipleValues: true,
		},
		required: true,
		default: {},
		placeholder: '添加按钮',
		displayOptions: {
			show: showOnlySendTaskCard,
		},
		description: '按钮列表，按钮个数为1~2个',
		options: [
			{
				displayName: '按钮',
				name: 'button',
				values: [
					{
						displayName: '按钮名称',
						name: 'name',
						type: 'string',
							required:	true,
						default: '',
					},
					{
						displayName: '按钮字体是否加粗',
						name: 'is_bold',
						type: 'boolean',
						default: false,
							hint:	'按钮字体加粗，默认为否',
						description: 'Whether the button font is bold',
					},
					{
						displayName: '按钮字体颜色',
						name: 'color',
						type: 'options',
						options: [
							{
								name: '红色',
								value: 'red',
							},
							{
								name: '蓝色',
								value: 'blue',
							},
						],
						default: 'blue',
						description: '按钮字体颜色，可选red或者blue，默认为blue',
					},
					{
						displayName: '按钮Key值',
						name: 'key',
						type: 'string',
							required:	true,
						default: '',
						description: '按钮key值，用户点击后，会产生任务卡片回调事件，回调事件会将本参数作为EventKey返回，只能由数字、字母和\'_-@\'组成，最长支持128字节',
					},
					{
						displayName: '点击按钮后替换文案',
						name: 'replace_name',
						type: 'string',
						default: '',
						description: '点击按钮后显示的名称，默认为\'已处理\'',
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
			show: showOnlySendTaskCard,
		},
		hint: '开启后会将消息中的userid转为@对应成员',
		description: 'Whether to enable ID translation',
	},
	{
		displayName: '是否开启重复消息检查',
		name: 'enable_duplicate_check',
		type: 'boolean',
		default: false,
		displayOptions: {
			show: showOnlySendTaskCard,
		},
		hint: '开启后在时间间隔内相同内容的消息不会重复发送',
		description: 'Whether to enable duplicate message check',
	},
	{
		displayName: '重复消息检查时间',
		name: 'duplicate_check_interval',
		type: 'number',
		default: 1800,
		displayOptions: {
			show: {
				...showOnlySendTaskCard,
				enable_duplicate_check: [true],
			},
		},
		description: '表示是否重复消息检查的时间间隔，默认1800s，最大不超过4小时',
	},
];

