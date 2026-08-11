import type { INodeProperties } from 'n8n-workflow';

const showOnly = { resource: ['calendar'], operation: ['addScheduleAttendees'] };

export const addScheduleAttendeesDescription: INodeProperties[] = [
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
		displayName: '参与者',
		name: 'attendeesCollection',
		type: 'fixedCollection',
		displayOptions: { show: showOnly },
		default: {},
		placeholder: '添加参与者',
		typeOptions: { multipleValues: true },
		description: '要添加的参与者列表。注意：该接口是增量式，累计最多支持1000人',
		options: [
			{
				displayName: '参与者',
				name: 'attendees',
				values: [
					{
						displayName: '成员',
						name: 'userid',
						type: 'options',
						default: '',
						required: true,
						typeOptions: {
							loadOptionsMethod: 'getAllUsers',
						},
						description: '参与者的UserID，不多于64字节。可从列表选择或手动输入UserID',
					},
				],
			},
		],
	},
];
