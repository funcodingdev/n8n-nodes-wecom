import type { INodeProperties } from 'n8n-workflow';

const showOnlyForGetCheckinData = {
	resource: ['checkin'],
	operation: ['getCheckinData'],
};

export const getCheckinDataDescription: INodeProperties[] = [
	{
		displayName: '开始时间',
		name: 'starttime',
		type: 'dateTime',
		required: true,
		displayOptions: {
			show: showOnlyForGetCheckinData,
		},
		default: '',
		description:
			'获取打卡数据的起始时间，秒级Unix时间戳。时间跨度不超过30天。<a href="https://developer.work.weixin.qq.com/document/path/90262" target="_blank">官方文档</a>',
	},
	{
		displayName: '结束时间',
		name: 'endtime',
		type: 'dateTime',
		required: true,
		displayOptions: {
			show: showOnlyForGetCheckinData,
		},
		default: '',
		description:
			'获取打卡数据的结束时间，秒级Unix时间戳。必须大于开始时间，时间跨度不超过30天。<a href="https://developer.work.weixin.qq.com/document/path/90262" target="_blank">官方文档</a>',
	},
	{
		displayName: '成员UserID列表',
		name: 'useridlist',
		type: 'string',
		displayOptions: {
			show: showOnlyForGetCheckinData,
		},
		default: '',
		description:
			'需要获取打卡数据的成员 UserID，逗号分隔，最多 100 个；与下方选择合并。<a href="https://developer.work.weixin.qq.com/document/path/90262" target="_blank">官方文档</a>',
		placeholder: 'zhangsan,lisi,wangwu',
	},
	{
		displayName: '成员(选择)',
		name: 'useridlist_selected',
		type: 'multiOptions',
		typeOptions: { loadOptionsMethod: 'getAllUsers' },
		displayOptions: { show: showOnlyForGetCheckinData },
		default: [],
		description: '与上方列表合并去重，合计最多 100 个',
	},
	{
		displayName: '成员列表 JSON',
		name: 'useridlistJson',
		type: 'json',
		displayOptions: { show: showOnlyForGetCheckinData },
		default: '[]',
		description:
			'可选。非空数组时与上方列表/选择合并去重。支持 ["userid1"] 或 [{"userid":"userid1"}]',
	},
	{
		displayName: '打卡类型',
		name: 'opencheckindatatype',
		type: 'options',
		displayOptions: {
			show: showOnlyForGetCheckinData,
		},
		options: [
			{ name: '全部打卡', value: 3, description: '获取所有类型的打卡记录' },
			{ name: '上下班打卡', value: 1, description: '仅获取上下班打卡记录' },
			{ name: '外出打卡', value: 2, description: '仅获取外出打卡记录' },
		],
		default: 3,
		description:
			'打卡类型。<a href="https://developer.work.weixin.qq.com/document/path/90262" target="_blank">官方文档</a>',
	},
];
