import type { INodeProperties } from 'n8n-workflow';

const showOnly = {
	resource: ['externalContact'],
	operation: ['updateExternalContactRemark'],
};

export const updateExternalContactRemarkDescription: INodeProperties[] = [
	{
		displayName: '成员',
		name: 'userid',
		type: 'options',
		typeOptions: {
			loadOptionsMethod: 'getAllUsers',
		},
		required: true,
		default: '',
		displayOptions: {
			show: showOnly,
		},
		description: '企业成员的UserID。<a href="https://developer.work.weixin.qq.com/document/path/92115" target="_blank">官方文档</a>.。企业成员的userid',
		placeholder: 'zhangsan',
	},
	{
		displayName: '外部联系人UserID',
		name: 'external_userid',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: showOnly,
		},
		description: '外部联系人的UserID，以"wm"开头。<a href="https://developer.work.weixin.qq.com/document/path/92115" target="_blank">官方文档</a>。外部联系人的userid',
		placeholder: 'wmxxxxxxxxxxxxxxxxxx',
	},
	{
		displayName: '备注信息',
		name: 'remark',
		type: 'string',
		default: '',
		displayOptions: {
			show: showOnly,
		},
		description: '此客户的备注信息，用于成员快速识别客户。<a href="https://developer.work.weixin.qq.com/document/path/92115" target="_blank">官方文档</a>。可选。客户备注，最多20个字符',
		placeholder: '重要客户',
	},
	{
		displayName: '描述',
		name: 'description',
		type: 'string',
		typeOptions: {
			rows: 4,
		},
		default: '',
		displayOptions: {
			show: showOnly,
		},
		description: '此客户的详细描述信息。<a href="https://developer.work.weixin.qq.com/document/path/92115" target="_blank">官方文档</a>。可选。客户描述，最多150个字符',
		placeholder: '该客户是...',
	},
	{
		displayName: '备注公司',
		name: 'remark_company',
		type: 'string',
		default: '',
		displayOptions: {
			show: showOnly,
		},
		description: '此客户的公司名称。<a href="https://developer.work.weixin.qq.com/document/path/92115" target="_blank">官方文档</a>。可选。最多20个字符',
		placeholder: 'XX科技有限公司',
	},
	{
		displayName: '清空所有备注手机号',
		name: 'clearRemarkMobiles',
		type: 'boolean',
		default: false,
		displayOptions: {
			show: showOnly,
		},
		description: '开启后发送官方要求的空字符串数组，覆盖并清空已有备注手机号',
	},
	{
		displayName: '备注手机号',
		name: 'remark_mobiles',
		type: 'string',
		default: '',
		displayOptions: {
			show: {
				...showOnly,
				clearRemarkMobiles: [false],
			},
		},
		description: '此客户的手机号列表，多个号码用英文逗号分隔。<a href="https://developer.work.weixin.qq.com/document/path/92115" target="_blank">官方文档</a>。可选。多个手机号用逗号分隔，最多5个',
		placeholder: '13800138000,13900139000',
	},
	{
		displayName: '备注图片MediaID',
		name: 'remark_pic_mediaid',
		type: 'string',
		default: '',
		displayOptions: {
			show: showOnly,
		},
		description: '备注图片的MediaID，可通过素材管理接口上传图片获得。<a href="https://developer.work.weixin.qq.com/document/path/92115" target="_blank">官方文档</a>。可选。通过素材管理接口上传图片获得',
		placeholder: 'MEDIA_ID',
	},
];
