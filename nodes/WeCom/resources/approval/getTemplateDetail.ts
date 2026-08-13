import type { INodeProperties } from 'n8n-workflow';

const showOnlyForGetTemplateDetail = {
	resource: ['approval'],
	operation: ['getTemplateDetail'],
};

export const getTemplateDetailDescription: INodeProperties[] = [
	{
		displayName: '模板ID',
		name: 'template_id',
		type: 'string',
		required: true,
		displayOptions: {
			show: showOnlyForGetTemplateDetail,
		},
		default: '',
		description:
			'审批模板的唯一标识ID。可在企业微信管理后台的审批应用中查看。<a href="https://developer.work.weixin.qq.com/document/path/91982" target="_blank">官方文档</a>',
		placeholder: '3Tk5RSkUvVYQPcgXXXXXXXXXXX',
	},
];
