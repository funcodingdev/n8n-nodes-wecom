import type { IExecuteFunctions, INodeExecutionData, IDataObject } from 'n8n-workflow';
import { NodeOperationError } from 'n8n-workflow';
import { weComApiRequest } from '../../shared/transport';

export async function executeCalendar(
	this: IExecuteFunctions,
	operation: string,
	items: INodeExecutionData[],
): Promise<INodeExecutionData[]> {
	const returnData: INodeExecutionData[] = [];

	for (let i = 0; i < items.length; i++) {
		try {
			let response: IDataObject;

			// 管理日历
			if (operation === 'createCalendar') {
				const summary = this.getNodeParameter('summary', i) as string;
				const admins = this.getNodeParameter('admins', i) as string;
				const description = this.getNodeParameter('description', i, '') as string;
				const color = this.getNodeParameter('color', i, 0) as number;
				const shares = this.getNodeParameter('shares', i, '') as string;

				const body: IDataObject = {
					calendar: {
						summary,
						admins: admins.split(',').map((id) => ({ userid: id.trim() })),
					},
				};

				if (description) {
					(body.calendar as IDataObject).description = description;
				}

				if (color) {
					(body.calendar as IDataObject).color = color;
				}

				if (shares) {
					(body.calendar as IDataObject).shares = JSON.parse(shares);
				}

				response = await weComApiRequest.call(this, 'POST', '/cgi-bin/oa/calendar/add', body);
			} else if (operation === 'updateCalendar') {
				const cal_id = this.getNodeParameter('cal_id', i) as string;
				const summary = this.getNodeParameter('summary', i, '') as string;
				const description = this.getNodeParameter('description', i, '') as string;
				const color = this.getNodeParameter('color', i, -1) as number;
				const shares = this.getNodeParameter('shares', i, '') as string;

				const calendar: IDataObject = { cal_id };

				if (summary) calendar.summary = summary;
				if (description) calendar.description = description;
				if (color >= 0) calendar.color = color;
				if (shares) calendar.shares = JSON.parse(shares);

				response = await weComApiRequest.call(this, 'POST', '/cgi-bin/oa/calendar/update', {
					calendar,
				});
			} else if (operation === 'getCalendar') {
				const cal_id_list = this.getNodeParameter('cal_id_list', i) as string;

				response = await weComApiRequest.call(this, 'POST', '/cgi-bin/oa/calendar/get', {
					cal_id_list: cal_id_list.split(',').map((id) => id.trim()),
				});
			} else if (operation === 'deleteCalendar') {
				const cal_id = this.getNodeParameter('cal_id', i) as string;

				response = await weComApiRequest.call(this, 'POST', '/cgi-bin/oa/calendar/del', {
					cal_id,
				});
			}
			// 管理日程
			else if (operation === 'createSchedule') {
				const schedule = this.getNodeParameter('schedule', i) as string;
				const agentid = this.getNodeParameter('agentid', i, 0) as number;

				let parsedSchedule;
				try {
					parsedSchedule = JSON.parse(schedule);
				} catch (error) {
					throw new NodeOperationError(
						this.getNode(),
						`schedule 必须是有效的 JSON: ${error.message}`,
						{ itemIndex: i },
					);
				}

				const body: IDataObject = { schedule: parsedSchedule };
				if (agentid) body.agentid = agentid;

				response = await weComApiRequest.call(this, 'POST', '/cgi-bin/oa/schedule/add', body);
			} else if (operation === 'updateSchedule') {
				const schedule_id = this.getNodeParameter('schedule_id', i) as string;
				const schedule = this.getNodeParameter('schedule', i) as string;

				let parsedSchedule;
				try {
					parsedSchedule = JSON.parse(schedule);
				} catch (error) {
					throw new NodeOperationError(
						this.getNode(),
						`schedule 必须是有效的 JSON: ${error.message}`,
						{ itemIndex: i },
					);
				}

				response = await weComApiRequest.call(this, 'POST', '/cgi-bin/oa/schedule/update', {
					schedule: {
						schedule_id,
						...parsedSchedule,
					},
				});
			} else if (operation === 'updateRecurringSchedule') {
				const schedule_id = this.getNodeParameter('schedule_id', i) as string;
				const schedule = this.getNodeParameter('schedule', i) as string;

				let parsedSchedule;
				try {
					parsedSchedule = JSON.parse(schedule);
				} catch (error) {
					throw new NodeOperationError(
						this.getNode(),
						`schedule 必须是有效的 JSON: ${error.message}`,
						{ itemIndex: i },
					);
				}

				response = await weComApiRequest.call(
					this,
					'POST',
					'/cgi-bin/oa/schedule/update_by_meetingid',
					{
						schedule: {
							schedule_id,
							...parsedSchedule,
						},
					},
				);
			} else if (operation === 'addScheduleAttendees') {
				const schedule_id = this.getNodeParameter('schedule_id', i) as string;
				const attendees = this.getNodeParameter('attendees', i) as string;

				let parsedAttendees;
				try {
					parsedAttendees = JSON.parse(attendees);
				} catch (error) {
					throw new NodeOperationError(
						this.getNode(),
						`attendees 必须是有效的 JSON: ${error.message}`,
						{ itemIndex: i },
					);
				}

				response = await weComApiRequest.call(this, 'POST', '/cgi-bin/oa/schedule/add_attendees', {
					schedule_id,
					attendees: parsedAttendees,
				});
			} else if (operation === 'deleteScheduleAttendees') {
				const schedule_id = this.getNodeParameter('schedule_id', i) as string;
				const attendees = this.getNodeParameter('attendees', i) as string;

				let parsedAttendees;
				try {
					parsedAttendees = JSON.parse(attendees);
				} catch (error) {
					throw new NodeOperationError(
						this.getNode(),
						`attendees 必须是有效的 JSON: ${error.message}`,
						{ itemIndex: i },
					);
				}

				response = await weComApiRequest.call(this, 'POST', '/cgi-bin/oa/schedule/del_attendees', {
					schedule_id,
					attendees: parsedAttendees,
				});
			} else if (operation === 'listCalendarSchedules') {
				const cal_id = this.getNodeParameter('cal_id', i) as string;
				const offset = this.getNodeParameter('offset', i, 0) as number;
				const limit = this.getNodeParameter('limit', i, 100) as number;

				response = await weComApiRequest.call(this, 'POST', '/cgi-bin/oa/schedule/get_by_calendar', {
					cal_id,
					offset,
					limit,
				});
			} else if (operation === 'getSchedule') {
				const schedule_id_list = this.getNodeParameter('schedule_id_list', i) as string;

				response = await weComApiRequest.call(this, 'POST', '/cgi-bin/oa/schedule/get', {
					schedule_id_list: schedule_id_list.split(',').map((id) => id.trim()),
				});
			} else if (operation === 'cancelSchedule') {
				const schedule_id = this.getNodeParameter('schedule_id', i) as string;

				response = await weComApiRequest.call(this, 'POST', '/cgi-bin/oa/schedule/del', {
					schedule_id,
				});
			} else {
				response = {};
			}

			returnData.push({
				json: response,
				pairedItem: { item: i },
			});
		} catch (error) {
			if (this.continueOnFail()) {
				returnData.push({
					json: {
						error: error.message,
					},
					pairedItem: { item: i },
				});
				continue;
			}
			throw error;
		}
	}

	return returnData;
}

