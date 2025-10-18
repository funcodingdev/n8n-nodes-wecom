import type { INodeProperties } from 'n8n-workflow';
import { getRecipientFields } from './commonFields';

const showOnlySendText = {
	resource: ['message'],
	operation: ['sendText'],
};

export const sendTextDescription: INodeProperties[] = [
	...getRecipientFields('sendText'),
	{
		displayName: '消息内容',
		name: 'content',
		type: 'string',
		typeOptions: {
			rows: 4,
		},
		required: true,
		default: '',
		displayOptions: {
			show: showOnlySendText,
		},
		description: '消息内容，最长不超过2048个字节',
	},
	{
		displayName: '安全保密消息',
		name: 'safe',
		type: 'boolean',
		default: false,
		displayOptions: {
			show: showOnlySendText,
		},
		description: '是否是保密消息，开启后消息不可转发、复制等',
	},
	{
		displayName: '是否开启ID转译',
		name: 'enable_id_trans',
		type: 'boolean',
		default: false,
		displayOptions: {
			show: showOnlySendText,
		},
		description: '是否开启ID转译，开启后会将消息中的userid转为@对应成员',
	},
	{
		displayName: '是否开启重复消息检查',
		name: 'enable_duplicate_check',
		type: 'boolean',
		default: false,
		displayOptions: {
			show: showOnlySendText,
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
				...showOnlySendText,
				enable_duplicate_check: [true],
			},
		},
		description: '表示是否重复消息检查的时间间隔，默认1800s，最大不超过4小时',
	},
];

