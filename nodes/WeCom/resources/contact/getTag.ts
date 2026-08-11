import type { INodeProperties } from 'n8n-workflow';

const showOnlyGetTag = {
	resource: ['contact'],
	operation: ['getTag'],
};

export const getTagDescription: INodeProperties[] = [
	{
		displayName: '标签',
		name: 'tagid',
		type: 'options',
		typeOptions: {
			loadOptionsMethod: 'getTags',
		},
		required: true,
		default: '',
		displayOptions: {
			show: showOnlyGetTag,
		},
		description: '从列表中选择标签，或使用表达式指定标签 ID。无限制，但返回列表仅包含应用可见范围的成员；第三方可获取自己创建的标签及应用可见范围内的标签详情。返回的成员名称字段（name）根据应用类型和权限有所不同：代开发自建应用需要管理员授权才返回该字段；第三方应用从2019年12月30日起，对新创建第三方应用不再返回，2020年6月30日起，对所有历史第三方应用不再返回，后续第三方仅通讯录应用可获取，未返回名称的情况需要通过通讯录展示组件来展示名字。<a href="https://developer.work.weixin.qq.com/document/path/90213" target="_blank">官方文档</a>。Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>',
	},
];

