import type { INodeProperties } from 'n8n-workflow';

// 管理日历
import { createCalendarDescription } from './createCalendar';
import { updateCalendarDescription } from './updateCalendar';
import { getCalendarDescription } from './getCalendar';
import { deleteCalendarDescription } from './deleteCalendar';

// 管理日程
import { createScheduleDescription } from './createSchedule';
import { updateScheduleDescription } from './updateSchedule';
import { updateRecurringScheduleDescription } from './updateRecurringSchedule';
import { addScheduleAttendeesDescription } from './addScheduleAttendees';
import { deleteScheduleAttendeesDescription } from './deleteScheduleAttendees';
import { listCalendarSchedulesDescription } from './listCalendarSchedules';
import { getScheduleDescription } from './getSchedule';
import { cancelScheduleDescription } from './cancelSchedule';

const showOnlyForCalendar = {
	resource: ['calendar'],
};

export const calendarDescription: INodeProperties[] = [
	{
		displayName: '操作',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: showOnlyForCalendar,
		},
		// eslint-disable-next-line n8n-nodes-base/node-param-options-type-unsorted-items
		options: [
			{
				name: '创建日历',
				value: 'createCalendar',
				action: '创建日历',
				description: 'Create a new calendar',
			},
			{
				name: '更新日历',
				value: 'updateCalendar',
				action: '更新日历',
				description: 'Update calendar details',
			},
			{
				name: '获取日历详情',
				value: 'getCalendar',
				action: '获取日历详情',
				description: 'Get calendar details',
			},
			{
				name: '删除日历',
				value: 'deleteCalendar',
				action: '删除日历',
				description: 'Delete a calendar',
			},
			{
				name: '创建日程',
				value: 'createSchedule',
				action: '创建日程',
				description: 'Create a new schedule',
			},
			{
				name: '更新日程',
				value: 'updateSchedule',
				action: '更新日程',
				description: 'Update schedule details',
			},
			{
				name: '更新重复日程',
				value: 'updateRecurringSchedule',
				action: '更新重复日程',
				description: 'Update recurring schedule details',
			},
			{
				name: '新增日程参与者',
				value: 'addScheduleAttendees',
				action: '新增日程参与者',
				description: 'Add attendees to schedule',
			},
			{
				name: '删除日程参与者',
				value: 'deleteScheduleAttendees',
				action: '删除日程参与者',
				description: 'Delete attendees from schedule',
			},
			{
				name: '获取日历下的日程列表',
				value: 'listCalendarSchedules',
				action: '获取日程列表',
				description: 'Get schedule list under calendar',
			},
			{
				name: '获取日程详情',
				value: 'getSchedule',
				action: '获取日程详情',
				description: 'Get schedule details',
			},
			{
				name: '取消日程',
				value: 'cancelSchedule',
				action: '取消日程',
				description: 'Cancel a schedule',
			},
		],
		default: 'createCalendar',
	},
	...createCalendarDescription,
	...updateCalendarDescription,
	...getCalendarDescription,
	...deleteCalendarDescription,
	...createScheduleDescription,
	...updateScheduleDescription,
	...updateRecurringScheduleDescription,
	...addScheduleAttendeesDescription,
	...deleteScheduleAttendeesDescription,
	...listCalendarSchedulesDescription,
	...getScheduleDescription,
	...cancelScheduleDescription,
];

