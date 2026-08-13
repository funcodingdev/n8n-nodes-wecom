import type { INodeProperties } from 'n8n-workflow';
import { getRecipientFields } from './commonFields';

const showOnlySendTaskCard = {
	resource: ['message'],
	operation: ['sendTaskCard'],
};

export const sendTaskCardDescription: INodeProperties[] = [
	...getRecipientFields('sendTaskCard'),
	{
		displayName: '输入方式',
		name: 'taskcard_input_mode',
		type: 'options',
		options: [
			{ name: '表单输入', value: 'form' },
			{ name: 'JSON输入', value: 'json' },
		],
		default: 'form',
		displayOptions: {
			show: showOnlySendTaskCard,
		},
		description: '选择任务卡片的输入方式',
	},
	{
		displayName: '互动任务卡片（JSON）',
		name: 'taskcard_json',
		type: 'json',
		typeOptions: {
			rows: 4,
		},
		default: '{}',
		placeholder: '{"title":"待处理","description":"请审批","task_id":"task_001","url":"https://example.com","btn":[{"key":"agree","name":"同意"}]}',
		displayOptions: {
			show: {
				...showOnlySendTaskCard,
				taskcard_input_mode: ['json'],
			},
		},

		description:
			'使用 JSON 直接输入 interactive_taskcard 对象。<a href="https://developer.work.weixin.qq.com/document/path/90236#任务卡片消息" target="_blank">官方文档</a>',
	},
	{
		displayName: '标题',
		name: 'title',
		type: 'string',
		required: true,
		default: '',
		placeholder: '请输入标题',
		displayOptions: {
			show: {
				...showOnlySendTaskCard,
				taskcard_input_mode: ['form'],
			},
		},
		description:
			'标题，不超过128个字节，超过会自动截断（支持ID转译）。<a href="https://developer.work.weixin.qq.com/document/path/90236#任务卡片消息" target="_blank">官方文档</a>',
	},
	{
		displayName: '描述',
		name: 'description',
		type: 'string',
		typeOptions: {
			rows: 4,
		},
		default: '',
		placeholder: '请输入描述',
		displayOptions: {
			show: {
				...showOnlySendTaskCard,
				taskcard_input_mode: ['form'],
			},
		},
		description:
			'描述，不超过512个字节，超过会自动截断（支持ID转译）。<a href="https://developer.work.weixin.qq.com/document/path/90236#任务卡片消息" target="_blank">官方文档</a>',
	},
	{
		displayName: '跳转链接',
		name: 'url',
		type: 'string',
		default: '',
		placeholder: 'https://example.com',
		displayOptions: {
			show: {
				...showOnlySendTaskCard,
				taskcard_input_mode: ['form'],
			},
		},
		description:
			'可选。点击后跳转的链接，最长 2048 字节，必须包含 http 或 https 协议头。<a href="https://developer.work.weixin.qq.com/document/path/90236#任务卡片消息" target="_blank">官方文档</a>',
	},
	{
		displayName: '任务ID',
		name: 'task_id',
		type: 'string',
		required: true,
		default: '',
		placeholder: 'task_001',
		displayOptions: {
			show: {
				...showOnlySendTaskCard,
				taskcard_input_mode: ['form'],
			},
		},
		description:
			'任务 ID，同一个应用发送的任务卡片消息的任务 ID 不能重复。只能由数字、字母和"_-@"组成，最长128字节。<a href="https://developer.work.weixin.qq.com/document/path/90236#任务卡片消息" target="_blank">官方文档</a>',
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
			show: {
				...showOnlySendTaskCard,
				taskcard_input_mode: ['form'],
			},
		},
		description:
			'按钮列表，按钮个数为1~2个。<a href="https://developer.work.weixin.qq.com/document/path/90236#任务卡片消息" target="_blank">官方文档</a>',
		options: [
			{
				displayName: '按钮',
				name: 'button',
				values: [
					{
						displayName: '按钮Key值',
						name: 'key',
						type: 'string',
						required: true,
						default: '',
						placeholder: 'btn_agree',
						description:
							'按钮key值，用户点击后，会产生任务卡片回调事件，回调事件会将本参数作为EventKey返回。只能由数字、字母和\'_-@\'组成，最长128字节。<a href="https://developer.work.weixin.qq.com/document/path/90236#任务卡片消息" target="_blank">官方文档</a>',
					},
					{
						displayName: '按钮名称',
						name: 'name',
						type: 'string',
						required: true,
						default: '',
						placeholder: '同意',
						description:
							'按钮显示的名称。<a href="https://developer.work.weixin.qq.com/document/path/90236#任务卡片消息" target="_blank">官方文档</a>',
					},
					{
						displayName: '按钮字体是否加粗',
						name: 'is_bold',
						type: 'boolean',
						default: false,
						description:
							'可选。按钮字体是否加粗，默认为否。<a href="https://developer.work.weixin.qq.com/document/path/90236#任务卡片消息" target="_blank">官方文档</a>',
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
						description:
							'可选。按钮字体颜色，可选red或者blue，默认为blue。<a href="https://developer.work.weixin.qq.com/document/path/90236#任务卡片消息" target="_blank">官方文档</a>',
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
			show: {
				...showOnlySendTaskCard,
			},
		},
		description:
			'可选。表示是否开启ID转译，0表示否，1表示是，默认0。开启后，消息中的userid会转译为@对应成员。<a href="https://developer.work.weixin.qq.com/document/path/90236#任务卡片消息" target="_blank">官方文档</a>',
	},
	{
		displayName: '是否开启重复消息检查',
		name: 'enable_duplicate_check',
		type: 'boolean',
		default: false,
		displayOptions: {
			show: {
				...showOnlySendTaskCard,
			},
		},
		description:
			'可选。表示是否开启重复消息检查，0表示否，1表示是，默认0。开启后在时间间隔内相同内容的消息不会重复发送。<a href="https://developer.work.weixin.qq.com/document/path/90236#任务卡片消息" target="_blank">官方文档</a>',
	},
	{
		displayName: '重复消息检查时间间隔',
		name: 'duplicate_check_interval',
		type: 'number',
		default: 1800,
		displayOptions: {
			show: {
				...showOnlySendTaskCard,
				enable_duplicate_check: [true],
			},
		},
		typeOptions: {
			minValue: 0,
			maxValue: 14400,
		},
		description:
			'可选。表示是否重复消息检查的时间间隔，默认1800秒，最大不超过4小时（14400秒）。<a href="https://developer.work.weixin.qq.com/document/path/90236#任务卡片消息" target="_blank">官方文档</a>',
	},
];
