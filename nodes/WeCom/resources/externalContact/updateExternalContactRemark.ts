import type { INodeProperties } from 'n8n-workflow';

const showOnly = {
	resource: ['externalContact'],
	operation: ['updateExternalContactRemark'],
};

export const updateExternalContactRemarkDescription: INodeProperties[] = [
	{
		displayName: '成员UserID',
		name: 'userid',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: showOnly,
		},
		hint: '企业成员的userid',
		description: '企业成员的userid',
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
		hint: '外部联系人userid',
	},
	{
		displayName: '备注信息',
		name: 'remark',
		type: 'string',
		default: '',
		displayOptions: {
			show: showOnly,
		},
		hint: '客户备注，最多20个字符',
		description: '此客户的备注信息',
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
		hint: '客户描述，最多150个字符',
		description: '此客户的描述',
	},
	{
		displayName: '备注公司',
		name: 'remark_company',
		type: 'string',
		default: '',
		displayOptions: {
			show: showOnly,
		},
		hint: '最多20个字符',
		description: '此客户的公司名',
	},
	{
		displayName: '备注手机号',
		name: 'remark_mobiles',
		type: 'string',
		default: '',
		displayOptions: {
			show: showOnly,
		},
		hint: '多个手机号用逗号分隔，最多5个',
		description: '此客户的手机号列表，用逗号分隔',
	},
	{
		displayName: '备注图片MediaID',
		name: 'remark_pic_mediaid',
		type: 'string',
		default: '',
		displayOptions: {
			show: showOnly,
		},
		hint: '通过素材管理接口上传图片获得',
		description: '备注图片的mediaid',
	},
];

