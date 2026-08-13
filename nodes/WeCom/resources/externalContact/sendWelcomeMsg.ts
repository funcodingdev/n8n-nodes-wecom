import type { INodeProperties } from 'n8n-workflow';

const showOnly = { resource: ['externalContact'], operation: ['sendWelcomeMsg'] };

export const sendWelcomeMsgDescription: INodeProperties[] = [
	{
		displayName: 'welcome_code 仅在添加外部联系人回调后 20 秒内有效，请让工作流尽快执行此节点',
		name: 'welcomeCodeExpiryNotice',
		type: 'notice',
		default: '',
		displayOptions: { show: showOnly },
	},
	{
		displayName: '欢迎语Code',
		name: 'welcome_code',
		type: 'string',
		required: true,
		default: '',
		displayOptions: { show: showOnly },
		description: '通过添加外部联系人事件推送获取的welcome_code，该code有效期为20秒',
		placeholder: 'CALLBACK_CODE',
	},
	// 文本内容
	{
		displayName: '文本消息内容',
		name: 'text_content',
		type: 'string',
		default: '',
		displayOptions: { show: showOnly },
		typeOptions: { rows: 4 },
		description: '消息文本内容，最长为4000字节。text和attachments不能同时为空',
		placeholder: '你好，欢迎关注！',
	},
	// 附件
	{
		displayName: '添加附件',
		name: 'enableAttachments',
		type: 'boolean',
		default: false,
		displayOptions: { show: showOnly },
		description: '是否添加附件，最多可添加9个附件。text与附件信息可以同时发送，将以多条消息触达客户',
	},
	{
		displayName: '附件列表',
		name: 'attachments',
		type: 'fixedCollection',
		typeOptions: {
			multipleValues: true,
		},
		default: {},
		displayOptions: { show: { ...showOnly, enableAttachments: [true] } },
		placeholder: '添加附件',
		description: '最多可添加9个附件，可以是图片、链接、小程序、视频或文件；下方 JSON 非空时覆盖表单',
		options: [
			{
				displayName: '图片附件',
				name: 'images',
				values: [
					{
						displayName: '图片Media ID',
						name: 'media_id',
						type: 'string',
						default: '',
						description: '图片的media_id，可通过素材管理接口获得。media_id和pic_url只需填写一个',
					},
					{
						displayName: '图片URL',
						name: 'pic_url',
						type: 'string',
						default: '',
						description: '图片的链接，仅可使用上传图片接口得到的链接。media_id和pic_url只需填写一个',
					},
				],
			},
			{
				displayName: '链接附件',
				name: 'links',
				values: [
					{
						displayName: '标题（必填）',
						name: 'title',
						type: 'string',
						default: '',
						required: true,
						description: '图文消息标题，最长为128字节',
					},
					{
						displayName: '封面URL',
						name: 'picurl',
						type: 'string',
						default: '',
						description: '图文消息封面的URL',
					},
					{
						displayName: '描述',
						name: 'desc',
						type: 'string',
						default: '',
						description: '图文消息的描述，最长为512字节',
					},
					{
						displayName: '链接URL（必填）',
						name: 'url',
						type: 'string',
						default: '',
						required: true,
						description: '图文消息的链接',
					},
				],
			},
			{
				displayName: '小程序附件',
				name: 'miniprograms',
				values: [
					{
						displayName: '标题（必填）',
						name: 'title',
						type: 'string',
						default: '',
						required: true,
						description: '小程序消息标题，最长为64字节',
					},
					{
						displayName: '封面Media ID（必填）',
						name: 'pic_media_id',
						type: 'string',
						default: '',
						required: true,
						description: '小程序消息封面的mediaid，封面图建议尺寸为520*416',
					},
					{
						displayName: 'AppID（必填）',
						name: 'appid',
						type: 'string',
						default: '',
						required: true,
						description: '小程序appid，必须是关联到企业的小程序应用',
					},
					{
						displayName: '页面路径（必填）',
						name: 'page',
						type: 'string',
						default: '',
						required: true,
						description: '小程序page路径',
						placeholder: '/path/index.html',
					},
				],
			},
			{
				displayName: '视频附件',
				name: 'videos',
				values: [
					{
						displayName: '视频Media ID（必填）',
						name: 'media_id',
						type: 'string',
						default: '',
						required: true,
						description: '视频的media_id，可通过素材管理接口获得',
					},
				],
			},
			{
				displayName: '文件附件',
				name: 'files',
				values: [
					{
						displayName: '文件Media ID（必填）',
						name: 'media_id',
						type: 'string',
						default: '',
						required: true,
						description: '文件的media_id，可通过素材管理接口获得',
					},
				],
			},
		],
	},
	{
		displayName: '附件列表 JSON',
		name: 'attachmentsJson',
		type: 'json',
		displayOptions: { show: { ...showOnly, enableAttachments: [true] } },
		default: '[]',
		description:
			'可选。非空数组时覆盖上方附件表单。支持官方 attachments 结构，例如 [{"msgtype":"image","image":{"media_id":"..."}}]',
	},
];
