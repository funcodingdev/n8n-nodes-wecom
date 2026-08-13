import type { INodeProperties } from 'n8n-workflow';

const showOnly = { resource: ['calendar'], operation: ['deleteScheduleAttendees'] };

export const deleteScheduleAttendeesDescription: INodeProperties[] = [
	{
		displayName: '日程ID',
		name: 'schedule_id',
		type: 'string',
		required: true,
		displayOptions: { show: showOnly },
		default: '',
		description: '日程ID。创建日程时返回的ID',
		placeholder: '17c7d2bd9f20d652840f72f59e796AAA',
	},
	{
		displayName: '参与者UserID列表',
		name: 'attendee_userids',
		type: 'string',
		displayOptions: { show: showOnly },
		default: '',
		placeholder: 'zhangsan,lisi',
		description: '要删除的参与者 userid，逗号分隔；与下方选择/集合合并，最多 1000 人',
	},
	{
		displayName: '参与者(选择)',
		name: 'attendee_userids_selected',
		type: 'multiOptions',
		typeOptions: { loadOptionsMethod: 'getAllUsers' },
		displayOptions: { show: showOnly },
		default: [],
		description: '与上方列表合并去重',
	},
	{
		displayName: '参与者(兼容集合)',
		name: 'attendeesCollection',
		type: 'fixedCollection',
		displayOptions: { show: showOnly },
		default: {},
		placeholder: '添加要删除的参与者',
		typeOptions: { multipleValues: true },
		description: '兼容旧表单；推荐用逗号列表或上方选择器。接口为增量式',
		options: [
			{
				displayName: '参与者',
				name: 'attendees',
				values: [
					{
						displayName: '成员UserID',
						name: 'userid',
						type: 'string',
						default: '',
						required: true,
						placeholder: 'zhangsan',
						description: '参与者的 UserID，不多于 64 字节',
					},
				],
			},
		],
	},
];
