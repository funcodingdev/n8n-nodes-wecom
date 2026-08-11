import type { INodeProperties } from 'n8n-workflow';

const showOnly = { resource: ['meetingroom'], operation: ['manageBooking'] };

export const manageBookingDescription: INodeProperties[] = [
	{
		displayName: '操作类型',
		name: 'action',
		type: 'options',
		required: true,
		displayOptions: { show: showOnly },
		options: [
			{ name: '查询预定信息', value: 'list' },
			{ name: '按预定ID查询详情', value: 'get' },
			{ name: '预定会议室', value: 'book' },
			{ name: '通过日程预定', value: 'bookBySchedule' },
			{ name: '通过会议预定', value: 'bookByMeeting' },
			{ name: '取消预定', value: 'cancel' },
		],
		default: 'list',
		description:
			'会议室预定管理。<a href="https://developer.work.weixin.qq.com/document/path/93620" target="_blank">官方文档</a>',
	},
	// 查询预定信息
	{
		displayName: '会议室ID',
		name: 'meetingroom_id',
		type: 'number',
		displayOptions: { show: { ...showOnly, action: ['list'] } },
		default: 0,
		description: '会议室 id（可选，不填则按位置/时间范围查询）',
	},
	{
		displayName: '开始时间',
		name: 'start_time',
		type: 'number',
		displayOptions: { show: { ...showOnly, action: ['list', 'book'] } },
		default: 0,
		description: '开始时间 Unix 时间戳（秒）；list 时可选，book 时必填',
	},
	{
		displayName: '结束时间',
		name: 'end_time',
		type: 'number',
		displayOptions: { show: { ...showOnly, action: ['list', 'book'] } },
		default: 0,
		description: '结束时间 Unix 时间戳（秒）；list 时可选，book 时必填',
	},
	{
		displayName: '城市',
		name: 'city',
		type: 'string',
		displayOptions: { show: { ...showOnly, action: ['list'] } },
		default: '',
		description: '会议室所在城市（可选）',
	},
	{
		displayName: '楼宇',
		name: 'building',
		type: 'string',
		displayOptions: { show: { ...showOnly, action: ['list'] } },
		default: '',
		description: '会议室所在楼宇（可选，需同时填城市）',
	},
	{
		displayName: '楼层',
		name: 'floor',
		type: 'string',
		displayOptions: { show: { ...showOnly, action: ['list'] } },
		default: '',
		description: '会议室所在楼层（可选）',
	},
	// 按预定ID查询 / 取消
	{
		displayName: '预定ID',
		name: 'booking_id',
		type: 'string',
		required: true,
		displayOptions: { show: { ...showOnly, action: ['get', 'cancel'] } },
		default: '',
		description: '会议室预定 id（booking_id）',
	},
	{
		displayName: '会议室ID',
		name: 'meetingroom_id_get',
		type: 'number',
		required: true,
		displayOptions: { show: { ...showOnly, action: ['get'] } },
		default: 0,
		description: '会议室 id（bookinfo/get 必填）',
	},
	// 预定会议室
	{
		displayName: '会议室ID',
		name: 'meetingroom_id_book',
		type: 'number',
		required: true,
		displayOptions: {
			show: { ...showOnly, action: ['book', 'bookBySchedule', 'bookByMeeting'] },
		},
		default: 0,
		description: '要预定的会议室 id',
	},
	{
		displayName: '会议主题',
		name: 'subject',
		type: 'string',
		displayOptions: { show: { ...showOnly, action: ['book'] } },
		default: '',
	},
	{
		displayName: '预定人UserID',
		name: 'booker',
		type: 'string',
		required: true,
		displayOptions: {
			show: { ...showOnly, action: ['book', 'bookBySchedule', 'bookByMeeting'] },
		},
		default: '',
		description: '预定人的 userid',
	},
	{
		displayName: '参会人员',
		name: 'attendees',
		type: 'string',
		displayOptions: { show: { ...showOnly, action: ['book'] } },
		default: '',
		description: '参会人员 userid 列表，多个用逗号分隔',
	},
	// 通过日程预定
	{
		displayName: '日程ID',
		name: 'schedule_id',
		type: 'string',
		required: true,
		displayOptions: { show: { ...showOnly, action: ['bookBySchedule'] } },
		default: '',
		description: '日程 id，仅可使用同应用创建的日程',
	},
	// 通过会议预定
	{
		displayName: '会议ID',
		name: 'meetingid',
		type: 'string',
		required: true,
		displayOptions: { show: { ...showOnly, action: ['bookByMeeting'] } },
		default: '',
		description: '会议 id（meetingid），仅可使用同应用创建的会议',
	},
	// 取消预定
	{
		displayName: '保留日程',
		name: 'keep_schedule',
		type: 'options',
		displayOptions: { show: { ...showOnly, action: ['cancel'] } },
		options: [
			{ name: '同步删除日程', value: 0 },
			{ name: '保留日程', value: 1 },
		],
		default: 0,
		description: '是否保留日程（仅对非重复日程有效）',
	},
	{
		displayName: '取消日期',
		name: 'cancel_date',
		type: 'number',
		displayOptions: { show: { ...showOnly, action: ['cancel'] } },
		default: 0,
		description: '重复日程时，取消对应日期当天的预定（当天 0 点时间戳）；0 表示不传则取消全部',
	},
];
