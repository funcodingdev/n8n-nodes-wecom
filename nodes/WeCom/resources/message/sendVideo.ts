import type { INodeProperties} from 'n8n-workflow';
import { getRecipientFields } from './commonFields';

const showOnlySendVideo = {
	resource: ['message'],
	operation: ['sendVideo'],
};

export const sendVideoDescription: INodeProperties[] = [
	...getRecipientFields('sendVideo'),
	{
		displayName: '视频来源',
		name: 'videoSource',
		type: 'options',
		options: [
			{
				name: '使用已有Media ID',
				value: 'mediaId',
			},
			{
				name: '上传视频文件',
				value: 'upload',
			},
		],
		default: 'upload',
		displayOptions: {
			show: showOnlySendVideo,
		},
		description: '选择视频来源方式',
	},
	{
		displayName: 'Media ID',
		name: 'media_id',
		type: 'string',
		default: '',
		required: true,
		displayOptions: {
			show: {
				...showOnlySendVideo,
				videoSource: ['mediaId'],
			},
		},
		description: '视频文件的media_id，可以调用上传临时素材接口获取',
	},
	{
		displayName: '二进制属性名',
		name: 'binaryPropertyName',
		type: 'string',
		default: 'data',
		required: true,
		displayOptions: {
			show: {
				...showOnlySendVideo,
				videoSource: ['upload'],
			},
		},
		description: '包含视频文件的输入字段名称',
	},
	{
		displayName: '视频标题',
		name: 'title',
		type: 'string',
		default: '',
		displayOptions: {
			show: showOnlySendVideo,
		},
		description: '视频消息的标题，不超过128个字节，超过会自动截断',
	},
	{
		displayName: '视频描述',
		name: 'description',
		type: 'string',
		typeOptions: {
			rows: 2,
		},
		default: '',
		displayOptions: {
			show: showOnlySendVideo,
		},
		description: '视频消息的描述，不超过512个字节，超过会自动截断',
	},
	{
		displayName: '安全保密消息',
		name: 'safe',
		type: 'boolean',
		default: false,
		displayOptions: {
			show: showOnlySendVideo,
		},
		hint: '保密消息，开启后消息不可转发、复制等',
		description: 'Whether this is a confidential message',
	},
	{
		displayName: '是否开启ID转译',
		name: 'enable_id_trans',
		type: 'boolean',
		default: false,
		displayOptions: {
			show: showOnlySendVideo,
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
			show: showOnlySendVideo,
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
				...showOnlySendVideo,
				enable_duplicate_check: [true],
			},
		},
		description: '表示是否重复消息检查的时间间隔，默认1800s，最大不超过4小时',
	},
];

