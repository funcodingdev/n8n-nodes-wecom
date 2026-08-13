import type { INodeProperties } from 'n8n-workflow';

const showOnlyForSendSchoolMessageMpNews = {
	resource: ['externalContact'],
	operation: ['sendSchoolMessage'],
	msgtype: ['mpnews'],
};

export const sendSchoolMessageMpNewsDescription: INodeProperties[] = [
	{
		displayName: '图文列表',
		name: 'articles',
		type: 'fixedCollection',
		typeOptions: {
			multipleValues: true,
		},
		displayOptions: {
			show: showOnlyForSendSchoolMessageMpNews,
		},
		default: {},
		placeholder: '添加图文',
		required: true,
		description: '图文消息，一个图文消息支持1到8条图文',
		options: [
			{
				name: 'article',
				displayName: '图文',
				values: [
					{
						displayName: '标题',
						name: 'title',
						type: 'string',
						default: '',
						placeholder: '地球一小时',
						required: true,
						description: '标题，不超过128个字节，超过会自动截断（支持ID转译）。必填。标题，不超过128个字节，超过会自动截断，支持ID转译',
					},
					{
						displayName: '缩略图 Media ID',
						name: 'thumb_media_id',
						type: 'string',
						default: '',
						placeholder: 'MEDIA_ID',
						required: true,
						description:
							'图文消息缩略图的media_id，可以通过素材管理接口获得。此处thumb_media_id即上传接口返回的media_id。必填。图文消息缩略图的media_id，可以通过素材管理接口获得。此处thumb_media_id即上传接口返回的media_id',
					},
					{
						displayName: '内容',
						name: 'content',
						type: 'string',
						typeOptions: {
							rows: 5,
						},
						default: '',
						placeholder: '图文消息的内容，支持html标签',
						required: true,
						description: '图文消息的内容，支持html标签，不超过666K个字节（支持ID转译）。必填。图文消息的内容，支持html标签，不超过666K个字节，支持ID转译',
					},
					{
						displayName: '作者',
						name: 'author',
						type: 'string',
						default: '',
						placeholder: 'Author',
						description: '可选。图文消息的作者，不超过64个字节。可选。图文消息的作者，不超过64个字节',
					},
					{
						displayName: '阅读原文链接',
						name: 'content_source_url',
						type: 'string',
						default: '',
						placeholder: 'https://work.weixin.qq.com',
						description: '可选。图文消息点击"阅读原文"之后的页面链接。可选。图文消息点击"阅读原文"之后的页面链接',
					},
					{
						displayName: '摘要',
						name: 'digest',
						type: 'string',
						typeOptions: {
							rows: 2,
						},
						default: '',
						placeholder: '图文消息的描述',
						description: '可选。图文消息的描述，不超过512个字节，超过会自动截断（支持ID转译）。可选。图文消息的描述，不超过512个字节，超过会自动截断，支持ID转译',
					},
				],
			},
		],
	},
	{
		displayName: '开启ID转译',
		name: 'enable_id_trans',
		type: 'boolean',
		displayOptions: {
			show: showOnlyForSendSchoolMessageMpNews,
		},
		default: false,
		description: '可选。表示是否开启ID转译，默认否。开启后可以将userid/部门ID转成对应的企业通讯录内部的用户名/部门名',
	},

	{
		displayName: '图文列表 JSON',
		name: 'articlesJson',
		type: 'json',
		displayOptions: { show: showOnlyForSendSchoolMessageMpNews },
		default: '[]',
		description:
			'可选。非空数组时覆盖上方图文表单。支持 [{"title":"...","thumb_media_id":"...","content":"..."}]，1–8 条',
	},
];
