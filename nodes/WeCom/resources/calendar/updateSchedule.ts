import type { INodeProperties } from 'n8n-workflow';

const showOnlyForUpdate = {
	resource: ['calendar'],
	operation: ['updateSchedule'],
};

export const updateScheduleDescription: INodeProperties[] = [
	{
		displayName: '日程ID',
		name: 'schedule_id',
		type: 'string',
		required: true,
		displayOptions: {
			show: showOnlyForUpdate,
		},
		default: '',
		description: '日程ID。创建日程时返回的ID',
		placeholder: '17c7d2bd9f20d652840f72f59e796AAA',
	},
	{
		displayName: '开始时间',
		name: 'start_time',
		type: 'dateTime',
		required: true,
		displayOptions: { show: showOnlyForUpdate },
		default: '',
		description:
			'日程开始时间。注意：如果操作模式是"仅修改此日程"或"修改将来的所有日程"，start_time和end_time必须是op_start_time当天或之后的时间',
	},
	{
		displayName: '结束时间',
		name: 'end_time',
		type: 'dateTime',
		required: true,
		displayOptions: { show: showOnlyForUpdate },
		default: '',
		description:
			'日程结束时间。注意：如果操作模式是"仅修改此日程"或"修改将来的所有日程"，start_time和end_time必须是op_start_time当天或之后的时间',
	},
	{
		displayName: '是否全天日程',
		name: 'is_whole_day',
		type: 'boolean',
		displayOptions: { show: showOnlyForUpdate },
		default: false,
		description:
			'是否更新成全天日程。注意：若修改字段跟会议室有关联，已预约会议室的日程无法通过此接口进行更新',
	},
	{
		displayName: '日程主题',
		name: 'summary',
		type: 'string',
		displayOptions: { show: showOnlyForUpdate },
		default: '',
		description: '日程标题。0 ~ 128 字符',
		placeholder: 'test_summary',
	},
	{
		displayName: '日程描述',
		name: 'description',
		type: 'string',
		displayOptions: { show: showOnlyForUpdate },
		default: '',
		typeOptions: { rows: 3 },
		description: '日程描述。不多于1000个字符',
		placeholder: 'test_description',
	},
	{
		displayName: '日程地点',
		name: 'location',
		type: 'string',
		displayOptions: { show: showOnlyForUpdate },
		default: '',
		description: '日程地址。不多于128个字符',
		placeholder: 'test_place',
	},
	{
		displayName: '参与者UserID列表',
		name: 'attendee_userids',
		type: 'string',
		displayOptions: { show: showOnlyForUpdate },
		default: '',
		placeholder: 'zhangsan,lisi',
		description:
			'参与者 userid，逗号分隔，最多 1000；与下方选择合并。更新为覆盖式，增量请用新增/删除参与者接口',
	},
	{
		displayName: '参与者(选择)',
		name: 'attendees',
		type: 'multiOptions',
		displayOptions: { show: showOnlyForUpdate },
		typeOptions: {
			loadOptionsMethod: 'getAllUsers',
		},
		default: [],
		description:
			'日程参与者列表。最多支持1000人。注意：更新操作是覆盖式，如果需要增量式更新成员，可使用"新增日程参与者"与"删除日程参与者"接口',
	},
	{
		displayName: '参与者列表 JSON',
		name: 'attendeesJson',
		type: 'json',
		displayOptions: { show: showOnlyForUpdate },
		default: '[]',
		description:
			'可选。非空数组时与上方列表/选择合并去重。支持 ["userid1"] 或 [{"userid":"userid1"}]',
	},
	{
		displayName: '管理员UserID列表',
		name: 'admin_userids',
		type: 'string',
		displayOptions: { show: showOnlyForUpdate },
		default: '',
		placeholder: 'zhangsan',
		description: '管理员 userid，逗号分隔，最多 3 人；须在参与者中；与下方选择合并',
	},
	{
		displayName: '日程管理员(选择)',
		name: 'admins',
		type: 'multiOptions',
		displayOptions: { show: showOnlyForUpdate },
		typeOptions: {
			loadOptionsMethod: 'getAllUsers',
		},
		default: [],
		description: '日程管理员，最多 3 人；须在参与者中',
	},
	{
		displayName: '管理员列表 JSON',
		name: 'adminsJson',
		type: 'json',
		displayOptions: { show: showOnlyForUpdate },
		default: '[]',
		description:
			'可选。非空数组时与上方列表/选择合并去重，最多 3 人。支持 ["userid1"] 或 [{"userid":"userid1"}]',
	},
	{
		displayName: '跳过参与者更新',
		name: 'skip_attendees',
		type: 'boolean',
		default: false,
		displayOptions: {
			show: showOnlyForUpdate,
		},
		description:
			'是否不更新参与人。默认为否。注意：更新操作是覆盖式，如果需要增量式更新成员，可使用"新增日程参与者"与"删除日程参与者"接口',
	},
	{
		displayName: '操作模式',
		name: 'op_mode',
		type: 'options',
		options: [
			{
				name: '全部修改',
				value: 0,
				description: '默认全部修改',
			},
			{
				name: '仅修改此日程',
				value: 1,
				description: '仅修改此日程',
			},
			{
				name: '修改将来的所有日程',
				value: 2,
				description: '修改将来的所有日程',
			},
		],
		default: 0,
		displayOptions: {
			show: showOnlyForUpdate,
		},
		description: '操作模式。是重复日程时有效',
	},
	{
		displayName: '操作起始时间',
		name: 'op_start_time',
		type: 'dateTime',
		required: true,
		displayOptions: {
			show: {
				...showOnlyForUpdate,
				op_mode: [1, 2],
			},
		},
		default: '',
		description:
			'操作起始时间。仅当操作模式是"仅修改此日程"或"修改将来的所有日程"时有效。该时间必须是重复日程的某一次开始时间。注意：如果操作模式是"仅修改此日程"或"修改将来的所有日程"，start_time和end_time必须是op_start_time当天或之后的时间',
	},
	{
		displayName: '提醒设置',
		name: 'remindersCollection',
		type: 'fixedCollection',
		displayOptions: { show: showOnlyForUpdate },
		default: {},
		placeholder: '添加提醒设置',
		description:
			'提醒相关信息。注意：若修改字段跟会议室有关联，已预约会议室的日程无法通过此接口进行更新。跟会议室关联的字段有：start_time、end_time、is_whole_day、is_repeat、repeat_type、repeat_until、is_custom_repeat、repeat_interval、repeat_day_of_week、repeat_day_of_month、timezone',
		options: [
			{
				displayName: '提醒设置',
				name: 'reminders',
				values: [
					{
						displayName: '是否提醒',
						name: 'is_remind',
						type: 'boolean',
						default: false,
						description: '是否需要提醒',
					},
					{
						displayName: '提前提醒时间',
						name: 'remind_before_event_secs',
						type: 'options',
						default: 3600,
						displayOptions: {
							show: {
								is_remind: [true],
							},
						},
						description:
							'日程开始（start_time）前多少秒提醒，当需要提醒时有效。该字段与remind_time_diffs仅一个字段会生效，当remind_time_diffs有传值且列表不为空时，优先以remind_time_diffs为准',
						options: [
							{ name: '事件开始时', value: 0 },
							{ name: '事件开始前5分钟', value: 300 },
							{ name: '事件开始前15分钟', value: 900 },
							{ name: '事件开始前1小时', value: 3600 },
							{ name: '事件开始前1天', value: 86400 },
						],
					},
					{
						displayName: '提醒时间差列表',
						name: 'remind_time_diffs',
						type: 'multiOptions',
						default: [],
						displayOptions: {
							show: {
								is_remind: [true],
							},
						},
						description:
							'提醒时间与日程开始时间（start_time）的差值，当需要提醒时有效，可以指定多个提醒时间。当是全天日程时，还支持更多选项。该字段与remind_before_event_secs仅一个字段会生效，当该字段有传值且列表不为空时，优先以该字段为准',
						options: [
							{ name: '事件开始时', value: 0 },
							{ name: '事件开始前5分钟', value: -300 },
							{ name: '事件开始前15分钟', value: -900 },
							{ name: '事件开始前1小时', value: -3600 },
							{ name: '事件开始前1天', value: -86400 },
							{ name: '事件开始当天（09：00）[全天日程]', value: 32400 },
							{ name: '事件开始前两天[全天日程]', value: -172800 },
							{ name: '事件开始前1周[全天日程]', value: -604800 },
						],
					},
					{
						displayName: '是否重复',
						name: 'is_repeat',
						type: 'boolean',
						default: false,
						description:
							'是否重复日程。注意：若修改字段跟会议室有关联，已预约会议室的日程无法通过此接口进行更新',
					},
					{
						displayName: '重复类型',
						name: 'repeat_type',
						type: 'options',
						default: 0,
						displayOptions: {
							show: {
								is_repeat: [true],
							},
						},
						description:
							'重复类型，当是重复日程时有效。目前支持如下类型：每日、每周、每月、每年、工作日',
						options: [
							{ name: '每日', value: 0 },
							{ name: '每周', value: 1 },
							{ name: '每月', value: 2 },
							{ name: '每年', value: 5 },
							{ name: '工作日', value: 7 },
						],
					},
					{
						displayName: '重复结束时间',
						name: 'repeat_until',
						type: 'dateTime',
						default: '',
						displayOptions: {
							show: {
								is_repeat: [true],
							},
						},
						description: '重复结束时刻，当是重复日程时有效。不填表示一直重复',
					},
					{
						displayName: '是否自定义重复',
						name: 'is_custom_repeat',
						type: 'boolean',
						default: false,
						displayOptions: {
							show: {
								is_repeat: [true],
							},
						},
						description:
							'是否自定义重复。当是重复日程时有效。如果为否，系统会根据start_time和repeat_type自动计算下一次重复的时间；如果为是，可以配合repeat_day_of_week或repeat_day_of_month特别指定周几或几号重复，且可以使用repeat_interval指定重复间隔',
					},
					{
						displayName: '重复间隔',
						name: 'repeat_interval',
						type: 'number',
						default: 1,
						displayOptions: {
							show: {
								is_repeat: [true],
								is_custom_repeat: [true],
							},
						},
						typeOptions: {
							minValue: 1,
						},
						description:
							'重复间隔。仅当指定为自定义重复时有效。该字段随repeat_type不同而含义不同。例如：repeat_interval指定为2，repeat_type指定为每周重复，那么每2周重复一次；repeat_interval指定为2，repeat_type指定为每月重复，那么每2个月重复一次',
					},
					{
						displayName: '每周重复日期',
						name: 'repeat_day_of_week',
						type: 'multiOptions',
						default: [],
						displayOptions: {
							show: {
								is_repeat: [true],
								is_custom_repeat: [true],
								repeat_type: [1],
							},
						},
						description:
							'每周周几重复。仅当指定为自定义重复且重复类型为每周时有效。取值范围：1 ~ 7',
						options: [
							{ name: '周一', value: 1 },
							{ name: '周二', value: 2 },
							{ name: '周三', value: 3 },
							{ name: '周四', value: 4 },
							{ name: '周五', value: 5 },
							{ name: '周六', value: 6 },
							{ name: '周日', value: 7 },
						],
					},
					{
						displayName: '每月重复日期',
						name: 'repeat_day_of_month',
						type: 'multiOptions',
						default: [],
						displayOptions: {
							show: {
								is_repeat: [true],
								is_custom_repeat: [true],
								repeat_type: [2],
							},
						},
						description:
							'每月哪几天重复。仅当指定为自定义重复且重复类型为每月时有效。取值范围：1 ~ 31',
						options: Array.from({ length: 31 }, (_, i) => ({
							name: `${i + 1}号`,
							value: i + 1,
						})),
					},
					{
						displayName: '时区',
						name: 'timezone',
						type: 'number',
						default: 8,
						displayOptions: {
							show: {
								is_repeat: [true],
							},
						},
						typeOptions: {
							minValue: -12,
							maxValue: 12,
						},
						description:
							'时区。UTC偏移量表示(即偏离零时区的小时数)，东区为正数，西区为负数。例如：+8 表示北京时间东八区。默认为北京时间东八区。取值范围：-12 ~ +12',
					},
				],
			},
		],
	},
	{
		displayName: '提醒设置 JSON',
		name: 'remindersJson',
		type: 'json',
		displayOptions: { show: showOnlyForUpdate },
		default: '{}',
		description:
			'可选。非空对象时覆盖上方提醒表单。支持 {"is_remind":true,"remind_before_event_secs":3600,"is_repeat":false,...}',
	},
];
