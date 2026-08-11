import type { INodeProperties } from 'n8n-workflow';

const showOnlyForGetInspectEventList = {
	resource: ['living'],
	operation: ['getInspectEventList'],
};

export const getInspectEventListDescription: INodeProperties[] = [
	{
		displayName: '创建时间起点',
		name: 'begin_create_time',
		type: 'dateTime',
		displayOptions: {
			show: showOnlyForGetInspectEventList,
		},
		default: '',
		description:
			'可选。筛选 begin_create_time 之后新创建的上报。<a href="https://developer.work.weixin.qq.com/document/path/93536" target="_blank">官方文档</a>',
	},
	{
		displayName: '修改时间起点',
		name: 'begin_modify_time',
		type: 'dateTime',
		displayOptions: {
			show: showOnlyForGetInspectEventList,
		},
		default: '',
		description:
			'可选。筛选 begin_modify_time 之后新修改的上报。<a href="https://developer.work.weixin.qq.com/document/path/93536" target="_blank">官方文档</a>',
	},
	{
		displayName: '翻页游标',
		name: 'cursor',
		type: 'string',
		displayOptions: {
			show: showOnlyForGetInspectEventList,
		},
		default: '',
		description:
			'可选。翻页参数，首次查询为空；查询条件变更时需置空。<a href="https://developer.work.weixin.qq.com/document/path/93536" target="_blank">官方文档</a>',
	},
	{
		displayName: '每页条数',
		name: 'limit',
		type: 'number',
		typeOptions: {
			minValue: 1,
			maxValue: 50,
		},
		displayOptions: {
			show: showOnlyForGetInspectEventList,
		},
		default: 20,
		description:
			'可选。单页条数，默认20，最大50。<a href="https://developer.work.weixin.qq.com/document/path/93536" target="_blank">官方文档</a>',
	},
];
