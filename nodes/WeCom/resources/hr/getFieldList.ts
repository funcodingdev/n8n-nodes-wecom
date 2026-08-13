import type { INodeProperties } from 'n8n-workflow';

const showOnlyForGetFieldList = {
	resource: ['hr'],
	operation: ['getFieldList'],
};

export const getFieldListDescription: INodeProperties[] = [
	{
		displayName: '附加字段',
		name: 'additionalFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: {
			show: showOnlyForGetFieldList,
		},
		options: [],
		description:
			'获取人事助手中员工花名册的字段配置信息，包括字段ID、字段名称、字段类型等。无需额外参数。<a href="https://developer.work.weixin.qq.com/document/path/99130" target="_blank">更多信息</a>',
	},
];
