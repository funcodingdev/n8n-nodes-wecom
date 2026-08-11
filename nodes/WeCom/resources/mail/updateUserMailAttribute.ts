import type { INodeProperties } from 'n8n-workflow';

const showOnly = { resource: ['mail'], operation: ['updateUserMailAttribute'] };

export const updateUserMailAttributeDescription: INodeProperties[] = [
	{
		displayName: '成员UserID',
		name: 'userid',
		type: 'string',
		required: true,
		displayOptions: { show: showOnly },
		default: '',
		placeholder: 'zhangsan',
		description:
			'用户 userid。<a href="https://developer.work.weixin.qq.com/document/path/98008" target="_blank">官方文档</a>',
	},
	{
		displayName: '功能属性列表',
		name: 'optionList',
		type: 'fixedCollection',
		displayOptions: { show: showOnly },
		default: {},
		placeholder: '添加属性',
		typeOptions: { multipleValues: true },
		description: 'option.list：type + value（1 启用 / 0 关闭）',
		options: [
			{
				displayName: '属性',
				name: 'options',
				values: [
					{
						displayName: '类型',
						name: 'type',
						type: 'options',
						default: 2,
						options: [
							{ name: '强制启用安全登录', value: 1 },
							{ name: 'IMAP/SMTP服务', value: 2 },
							{ name: 'POP/SMTP服务', value: 3 },
							{ name: '是否启用安全登录', value: 4 },
						],
					},
					{
						displayName: '值',
						name: 'value',
						type: 'options',
						default: '1',
						options: [
							{ name: '启用', value: '1' },
							{ name: '关闭', value: '0' },
						],
					},
				],
			},
		],
	},
	{
		displayName: 'IMAP/SMTP快捷设置',
		name: 'imapSmtpSettings',
		type: 'collection',
		displayOptions: { show: showOnly },
		default: {},
		placeholder: '快捷配置',
		description: '快捷映射到 type=2/3（可选，与功能属性列表合并）',
		options: [
			{
				displayName: '启用IMAP/SMTP',
				name: 'enable_imap',
				type: 'boolean',
				default: false,
				description: '映射 type=2',
			},
			{
				displayName: '启用POP/SMTP',
				name: 'enable_smtp',
				type: 'boolean',
				default: false,
				description: '映射 type=3',
			},
		],
	},
];
