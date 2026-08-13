import type { INodeProperties } from 'n8n-workflow';

const showOnlyForGetLivingWatchStatV2 = {
	resource: ['school'],
	operation: ['getLivingWatchStatV2'],
};

export const getLivingWatchStatV2Description: INodeProperties[] = [
	{
		displayName: '直播 ID',
		name: 'livingid',
		type: 'string',
		required: true,
		displayOptions: {
			show: showOnlyForGetLivingWatchStatV2,
		},
		default: '',
		placeholder: 'living_001',
	},
	{
		displayName: '分页游标',
		name: 'next_cursor',
		type: 'string',
		displayOptions: {
			show: showOnlyForGetLivingWatchStatV2,
		},
		default: '',
		description: '上次请求返回的 next_cursor，首次可留空或填写 0；根据 has_more 判断是否继续拉取。<a href="https://developer.work.weixin.qq.com/document/path/95793" target="_blank">官方文档</a>',
	},
];
