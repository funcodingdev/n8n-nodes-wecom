import type { IExecuteFunctions, INodeExecutionData, IDataObject } from 'n8n-workflow';
import { NodeOperationError } from 'n8n-workflow';
import { weComApiRequest } from '../../shared/transport';

// 辅助函数：将dateTime转换为Unix时间戳（秒级）
function dateTimeToUnixTimestamp(dateTime: string | number): number {
	if (typeof dateTime === 'number') {
		return dateTime;
	}
	if (!dateTime || dateTime === '') {
		return 0;
	}
	return Math.floor(new Date(dateTime).getTime() / 1000);
}

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
				const admins = this.getNodeParameter('admins', i) as string[];
				const description = this.getNodeParameter('description', i, '') as string;
				const isCorpCalendar = this.getNodeParameter('isCorpCalendar', i, false) as boolean;
				const advancedSettings = this.getNodeParameter('advancedSettings', i, {}) as IDataObject;
				const sharesCollection = this.getNodeParameter('sharesCollection', i, {}) as IDataObject;

				const calendar: IDataObject = {
					summary,
					admins,
				};

				// 全员日历设置
				if (isCorpCalendar) {
					calendar.is_corp_calendar = 1; // 设置为全员日历
				}

				// 日历描述
				if (description) {
					calendar.description = description;
				}

				// 全员日历不支持颜色
				if (!isCorpCalendar) {
					const color = this.getNodeParameter('color', i, '') as string;
					if (color) {
						calendar.color = color;
					}
				}

				// 公开范围
				const publicRange = advancedSettings.publicRange as IDataObject | undefined;
				
				// 创建全员日历时必须指定公开范围
				if (isCorpCalendar) {
					const hasUserids = publicRange?.userids && (publicRange.userids as string[]).length > 0;
					const hasPartyids = publicRange?.partyids && (publicRange.partyids as string[]).length > 0;
					if (!hasUserids && !hasPartyids) {
						throw new NodeOperationError(
							this.getNode(),
							'创建全员日历时必须指定公开范围，请至少选择公开成员列表或公开部门列表中的一个',
							{ itemIndex: i },
						);
					}
				}

				if (publicRange) {
					const rangeObj: IDataObject = {};
					if (publicRange.userids && (publicRange.userids as string[]).length > 0) {
						rangeObj.userids = publicRange.userids as string[];
					}
					if (publicRange.partyids && (publicRange.partyids as string[]).length > 0) {
						rangeObj.partyids = publicRange.partyids as string[];
					}
					if (Object.keys(rangeObj).length > 0) {
						calendar.public_range = rangeObj;
					}
				}

				// 构建共享范围
				const shares: IDataObject[] = [];
				if (sharesCollection.shares) {
					const sharesList = sharesCollection.shares as IDataObject[];
					sharesList.forEach((s) => {
						const share: IDataObject = { userid: s.userid as string };
						if (s.permission) {
							share.permission = s.permission as number;
						}
						shares.push(share);
					});
					calendar.shares = shares;
				}

				// 验证管理员必须在通知范围成员列表中（创建日历时管理员是必填的，必须提供通知范围）
				if (admins && admins.length > 0) {
					if (!sharesCollection.shares || shares.length === 0) {
						throw new NodeOperationError(
							this.getNode(),
							'创建日历时，管理员必须在通知范围成员的列表中，请提供日历通知范围',
							{ itemIndex: i },
						);
					}
					const shareUserids = shares.map((s) => s.userid as string);
					const missingAdmins = admins.filter((admin) => !shareUserids.includes(admin));
					if (missingAdmins.length > 0) {
						throw new NodeOperationError(
							this.getNode(),
							`管理员必须在通知范围成员的列表中。以下管理员不在通知范围中：${missingAdmins.join(', ')}`,
							{ itemIndex: i },
						);
					}
				}

				const body: IDataObject = { calendar };
				if (advancedSettings.agentid) {
					body.agentid = advancedSettings.agentid as number;
				}

				response = await weComApiRequest.call(this, 'POST', '/cgi-bin/oa/calendar/add', body);
			} else if (operation === 'updateCalendar') {
				const cal_id = this.getNodeParameter('cal_id', i) as string;
				const summary = this.getNodeParameter('summary', i) as string;
				const description = this.getNodeParameter('description', i, '') as string;
				const color = this.getNodeParameter('color', i) as string;
				const admins = this.getNodeParameter('admins', i, []) as string[];
				const skipPublicRange = this.getNodeParameter('skip_public_range', i, false) as boolean;
				const publicRange = this.getNodeParameter('publicRange', i, {}) as IDataObject;
				const sharesCollection = this.getNodeParameter('sharesCollection', i, {}) as IDataObject;

				const calendar: IDataObject = {
					cal_id,
					summary,
					color,
				};

				// 日历描述（可选）
				if (description) {
					calendar.description = description;
				}

				// 管理员列表（可选，最多3人）
				if (admins && admins.length > 0) {
					calendar.admins = admins;
				}

				// 日历通知范围（可选）
				if (sharesCollection.shares) {
					const sharesList = sharesCollection.shares as IDataObject[];
					const shares: IDataObject[] = sharesList.map((s) => {
						const share: IDataObject = { userid: s.userid as string };
						if (s.permission) {
							share.permission = s.permission as number;
						}
						return share;
					});
					if (shares.length > 0) {
						calendar.shares = shares;
					}
				}

				// 公开范围（可选，仅当是公共日历时有效）
				if (!skipPublicRange && publicRange && Object.keys(publicRange).length > 0) {
					const rangeObj: IDataObject = {};
					if (publicRange.userids && (publicRange.userids as string[]).length > 0) {
						rangeObj.userids = publicRange.userids as string[];
					}
					if (publicRange.partyids && (publicRange.partyids as string[]).length > 0) {
						rangeObj.partyids = publicRange.partyids as string[];
					}
					if (Object.keys(rangeObj).length > 0) {
						calendar.public_range = rangeObj;
					}
				}

				const body: IDataObject = { calendar };
				if (skipPublicRange) {
					body.skip_public_range = 1;
				} else {
					body.skip_public_range = 0;
				}

				response = await weComApiRequest.call(this, 'POST', '/cgi-bin/oa/calendar/update', body);
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
				const summary = this.getNodeParameter('summary', i, '') as string;
				const admins = this.getNodeParameter('admins', i, []) as string[];
				const start_time = dateTimeToUnixTimestamp(this.getNodeParameter('start_time', i) as string | number);
				const end_time = dateTimeToUnixTimestamp(this.getNodeParameter('end_time', i) as string | number);
				const is_whole_day = this.getNodeParameter('is_whole_day', i, false) as boolean;
				const attendees = this.getNodeParameter('attendees', i, []) as string[];
				const description = this.getNodeParameter('description', i, '') as string;
				const location = this.getNodeParameter('location', i, '') as string;
				const remindersCollection = this.getNodeParameter('remindersCollection', i, {}) as IDataObject;
				const advancedSettings = this.getNodeParameter('advancedSettings', i, {}) as IDataObject;
				const cal_id = (advancedSettings.cal_id as string) || '';
				const agentid = (advancedSettings.agentid as number) || 0;

				const schedule: IDataObject = {
					start_time,
					end_time,
				};

				// 日程主题（可选）
				if (summary) {
					schedule.summary = summary;
				}

				// 构建参与者列表（可选，最多1000人）
				// 使用 Set 来去重，确保管理员也在参与者列表中
				const attendeesSet = new Set<string>();
				if (attendees && attendees.length > 0) {
					if (attendees.length > 1000) {
						throw new NodeOperationError(
							this.getNode(),
							'日程参与者最多支持1000人',
							{ itemIndex: i },
						);
					}
					attendees.forEach((userid) => {
						if (userid) {
							attendeesSet.add(userid);
						}
					});
				}

				// 日程管理员（可选，最多3人）
				// 注意：管理员必须在参与者列表中，所以需要先将管理员添加到参与者列表
				if (admins && admins.length > 0) {
					if (admins.length > 3) {
						throw new NodeOperationError(
							this.getNode(),
							'日程管理员最多指定3人',
							{ itemIndex: i },
						);
					}
					// 将管理员添加到参与者列表中（如果还没有的话）
					admins.forEach((admin) => {
						if (admin) {
							attendeesSet.add(admin);
						}
					});
					schedule.admins = admins;
				}

				// 设置参与者列表
				if (attendeesSet.size > 0) {
					schedule.attendees = Array.from(attendeesSet).map((userid) => ({ userid }));
				}

				// 是否全天日程
				if (is_whole_day) {
					schedule.is_whole_day = 1;
				}

				if (description) schedule.description = description;
				if (location) schedule.location = location;
				if (cal_id) schedule.cal_id = cal_id;

				// 构建提醒设置
				if (remindersCollection.reminders) {
					const remindersData = remindersCollection.reminders as IDataObject;
					const reminders: IDataObject = {};

					// 是否提醒
					if (remindersData.is_remind !== undefined) {
						reminders.is_remind = remindersData.is_remind ? 1 : 0;
					}

					// 提醒时间差列表（multiOptions数组）
					// 注意：该字段与remind_before_event_secs仅一个字段会生效，当该字段有传值且列表不为空时，优先以该字段为准
					if (remindersData.remind_time_diffs && Array.isArray(remindersData.remind_time_diffs) && remindersData.remind_time_diffs.length > 0) {
						reminders.remind_time_diffs = (remindersData.remind_time_diffs as number[]).map((val) => Number(val));
					} else {
						// 只有当remind_time_diffs不存在或为空时，才使用remind_before_event_secs
						if (remindersData.remind_before_event_secs !== undefined) {
							reminders.remind_before_event_secs = remindersData.remind_before_event_secs;
						}
					}

					// 是否重复
					if (remindersData.is_repeat !== undefined) {
						reminders.is_repeat = remindersData.is_repeat ? 1 : 0;
					}

					// 重复类型
					if (remindersData.repeat_type !== undefined) {
						reminders.repeat_type = remindersData.repeat_type;
					}

					// 重复结束时间
					if (remindersData.repeat_until !== undefined && remindersData.repeat_until !== '' && remindersData.repeat_until !== 0) {
						reminders.repeat_until = dateTimeToUnixTimestamp(remindersData.repeat_until as string | number);
					}

					// 是否自定义重复
					if (remindersData.is_custom_repeat !== undefined) {
						reminders.is_custom_repeat = remindersData.is_custom_repeat ? 1 : 0;
					}

					// 重复间隔
					if (remindersData.repeat_interval !== undefined) {
						reminders.repeat_interval = remindersData.repeat_interval;
					}

					// 每周重复日期（multiOptions数组）
					if (remindersData.repeat_day_of_week && Array.isArray(remindersData.repeat_day_of_week) && remindersData.repeat_day_of_week.length > 0) {
						reminders.repeat_day_of_week = (remindersData.repeat_day_of_week as number[])
							.map((val) => Number(val))
							.filter((val) => !isNaN(val) && val >= 1 && val <= 7);
					}

					// 每月重复日期（multiOptions数组）
					if (remindersData.repeat_day_of_month && Array.isArray(remindersData.repeat_day_of_month) && remindersData.repeat_day_of_month.length > 0) {
						reminders.repeat_day_of_month = (remindersData.repeat_day_of_month as number[])
							.map((val) => Number(val))
							.filter((val) => !isNaN(val) && val >= 1 && val <= 31);
					}

					// 时区
					if (remindersData.timezone !== undefined) {
						reminders.timezone = remindersData.timezone;
					}

					// 只有当 reminders 对象不为空时才添加到 schedule 中
					if (Object.keys(reminders).length > 0) {
						schedule.reminders = reminders;
					}
				}

				const body: IDataObject = { schedule };
				if (agentid && agentid > 0) {
					body.agentid = agentid;
				}

				response = await weComApiRequest.call(this, 'POST', '/cgi-bin/oa/schedule/add', body);
			} else if (operation === 'updateSchedule') {
				const schedule_id = this.getNodeParameter('schedule_id', i) as string;
				const summary = this.getNodeParameter('summary', i, '') as string;
				const admins = this.getNodeParameter('admins', i, []) as string[];
				const start_time = dateTimeToUnixTimestamp(this.getNodeParameter('start_time', i) as string | number);
				const end_time = dateTimeToUnixTimestamp(this.getNodeParameter('end_time', i) as string | number);
				const is_whole_day = this.getNodeParameter('is_whole_day', i, false) as boolean;
				const attendees = this.getNodeParameter('attendees', i, []) as string[];
				const description = this.getNodeParameter('description', i, '') as string;
				const location = this.getNodeParameter('location', i, '') as string;
				const remindersCollection = this.getNodeParameter('remindersCollection', i, {}) as IDataObject;
				const skip_attendees = this.getNodeParameter('skip_attendees', i, false) as boolean;
				const op_mode = this.getNodeParameter('op_mode', i, 0) as number;
				const op_start_time_raw = this.getNodeParameter('op_start_time', i, '') as string | number;
				const op_start_time = op_start_time_raw ? dateTimeToUnixTimestamp(op_start_time_raw) : 0;

				const schedule: IDataObject = {
					schedule_id,
					start_time,
					end_time,
				};

				// 日程主题（可选）
				if (summary) {
					schedule.summary = summary;
				}

				// 构建参与者列表（可选，最多1000人）
				// 使用 Set 来去重，确保管理员也在参与者列表中
				const attendeesSet = new Set<string>();
				if (attendees && attendees.length > 0) {
					if (attendees.length > 1000) {
						throw new NodeOperationError(
							this.getNode(),
							'日程参与者最多支持1000人',
							{ itemIndex: i },
						);
					}
					attendees.forEach((userid) => {
						if (userid) {
							attendeesSet.add(userid);
						}
					});
				}

				// 日程管理员（可选，最多3人）
				// 注意：管理员必须在参与者列表中，所以需要先将管理员添加到参与者列表
				if (admins && admins.length > 0) {
					if (admins.length > 3) {
						throw new NodeOperationError(
							this.getNode(),
							'日程管理员最多指定3人',
							{ itemIndex: i },
						);
					}
					// 将管理员添加到参与者列表中（如果还没有的话）
					admins.forEach((admin) => {
						if (admin) {
							attendeesSet.add(admin);
						}
					});
					schedule.admins = admins;
				}

				// 设置参与者列表（如果 skip_attendees 为 false）
				if (!skip_attendees && attendeesSet.size > 0) {
					schedule.attendees = Array.from(attendeesSet).map((userid) => ({ userid }));
				}

				// 是否全天日程
				if (is_whole_day) {
					schedule.is_whole_day = 1;
				}

				if (description) schedule.description = description;
				if (location) schedule.location = location;

				// 构建提醒设置
				if (remindersCollection.reminders) {
					const remindersData = remindersCollection.reminders as IDataObject;
					const reminders: IDataObject = {};

					// 是否提醒
					if (remindersData.is_remind !== undefined) {
						reminders.is_remind = remindersData.is_remind ? 1 : 0;
					}

					// 提醒时间差列表（multiOptions数组）
					// 注意：该字段与remind_before_event_secs仅一个字段会生效，当该字段有传值且列表不为空时，优先以该字段为准
					if (remindersData.remind_time_diffs && Array.isArray(remindersData.remind_time_diffs) && remindersData.remind_time_diffs.length > 0) {
						reminders.remind_time_diffs = (remindersData.remind_time_diffs as number[]).map((val) => Number(val));
					} else {
						// 只有当remind_time_diffs不存在或为空时，才使用remind_before_event_secs
						if (remindersData.remind_before_event_secs !== undefined) {
							reminders.remind_before_event_secs = remindersData.remind_before_event_secs;
						}
					}

					// 是否重复
					if (remindersData.is_repeat !== undefined) {
						reminders.is_repeat = remindersData.is_repeat ? 1 : 0;
					}

					// 重复类型
					if (remindersData.repeat_type !== undefined) {
						reminders.repeat_type = remindersData.repeat_type;
					}

					// 重复结束时间
					if (remindersData.repeat_until !== undefined && remindersData.repeat_until !== '' && remindersData.repeat_until !== 0) {
						reminders.repeat_until = dateTimeToUnixTimestamp(remindersData.repeat_until as string | number);
					}

					// 是否自定义重复
					if (remindersData.is_custom_repeat !== undefined) {
						reminders.is_custom_repeat = remindersData.is_custom_repeat ? 1 : 0;
					}

					// 重复间隔
					if (remindersData.repeat_interval !== undefined) {
						reminders.repeat_interval = remindersData.repeat_interval;
					}

					// 每周重复日期（multiOptions数组）
					if (remindersData.repeat_day_of_week && Array.isArray(remindersData.repeat_day_of_week) && remindersData.repeat_day_of_week.length > 0) {
						reminders.repeat_day_of_week = (remindersData.repeat_day_of_week as number[])
							.map((val) => Number(val))
							.filter((val) => !isNaN(val) && val >= 1 && val <= 7);
					}

					// 每月重复日期（multiOptions数组）
					if (remindersData.repeat_day_of_month && Array.isArray(remindersData.repeat_day_of_month) && remindersData.repeat_day_of_month.length > 0) {
						reminders.repeat_day_of_month = (remindersData.repeat_day_of_month as number[])
							.map((val) => Number(val))
							.filter((val) => !isNaN(val) && val >= 1 && val <= 31);
					}

					// 时区
					if (remindersData.timezone !== undefined) {
						reminders.timezone = remindersData.timezone;
					}

					// 只有当 reminders 对象不为空时才添加到 schedule 中
					if (Object.keys(reminders).length > 0) {
						schedule.reminders = reminders;
					}
				}

				const body: IDataObject = { schedule };

				if (skip_attendees) {
					body.skip_attendees = skip_attendees ? 1 : 0;
				}
				if (op_mode !== 0) {
					body.op_mode = op_mode;
				}
				if (op_start_time > 0 && (op_mode === 1 || op_mode === 2)) {
					body.op_start_time = op_start_time;
				}

				response = await weComApiRequest.call(this, 'POST', '/cgi-bin/oa/schedule/update', body);
			} else if (operation === 'updateRecurringSchedule') {
				const schedule_id = this.getNodeParameter('schedule_id', i) as string;
				const schedule_summary = this.getNodeParameter('schedule_summary', i, '') as string;
				const schedule_description = this.getNodeParameter('schedule_description', i, '') as string;
				const schedule_start_time = dateTimeToUnixTimestamp(
					this.getNodeParameter('schedule_start_time', i, '') as string | number,
				);
				const schedule_end_time = dateTimeToUnixTimestamp(
					this.getNodeParameter('schedule_end_time', i, '') as string | number,
				);
				const schedule_location = this.getNodeParameter('schedule_location', i, '') as string;
				const schedule = this.getNodeParameter('schedule', i, '{}') as string;
				const skip_attendees = this.getNodeParameter('skip_attendees', i, false) as boolean;
				const op_mode = this.getNodeParameter('op_mode', i, 1) as number;
				const op_start_time_raw = this.getNodeParameter('op_start_time', i, '') as string | number;
				const op_start_time = op_start_time_raw ? dateTimeToUnixTimestamp(op_start_time_raw) : 0;

				const scheduleBody: IDataObject = { schedule_id };
				if (schedule_summary) scheduleBody.summary = schedule_summary;
				if (schedule_description) scheduleBody.description = schedule_description;
				if (schedule_start_time) scheduleBody.start_time = schedule_start_time;
				if (schedule_end_time) scheduleBody.end_time = schedule_end_time;
				if (schedule_location) scheduleBody.location = schedule_location;

				try {
					const parsedSchedule = JSON.parse(schedule || '{}') as IDataObject;
					if (parsedSchedule && typeof parsedSchedule === 'object') {
						Object.assign(scheduleBody, parsedSchedule);
						scheduleBody.schedule_id = schedule_id;
					}
				} catch (error) {
					throw new NodeOperationError(
						this.getNode(),
						`日程扩展JSON 必须是有效的 JSON: ${(error as Error).message}`,
						{ itemIndex: i },
					);
				}

				const body: IDataObject = { schedule: scheduleBody };

				if (skip_attendees) {
					body.skip_attendees = skip_attendees ? 1 : 0;
				}
				if (op_mode !== 0) {
					body.op_mode = op_mode;
				}
				if (op_start_time > 0 && (op_mode === 1 || op_mode === 2)) {
					body.op_start_time = op_start_time;
				}

				// 更新重复日程使用相同的接口，通过op_mode和op_start_time控制
				response = await weComApiRequest.call(this, 'POST', '/cgi-bin/oa/schedule/update', body);
			} else if (operation === 'addScheduleAttendees') {
				const schedule_id = this.getNodeParameter('schedule_id', i) as string;
				const attendeesCollection = this.getNodeParameter('attendeesCollection', i, {}) as IDataObject;

				const attendees: IDataObject[] = [];
				if (attendeesCollection.attendees) {
					const attendeesList = attendeesCollection.attendees as IDataObject[];
					if (attendeesList.length === 0) {
						throw new NodeOperationError(
							this.getNode(),
							'至少需要添加一个参与者',
							{ itemIndex: i },
						);
					}
					attendeesList.forEach((a) => {
						if (a.userid) {
							attendees.push({ userid: a.userid });
						}
					});
				}

				if (attendees.length === 0) {
					throw new NodeOperationError(
						this.getNode(),
						'至少需要添加一个参与者',
						{ itemIndex: i },
					);
				}

				response = await weComApiRequest.call(this, 'POST', '/cgi-bin/oa/schedule/add_attendees', {
					schedule_id,
					attendees,
				});
			} else if (operation === 'deleteScheduleAttendees') {
				const schedule_id = this.getNodeParameter('schedule_id', i) as string;
				const attendeesCollection = this.getNodeParameter('attendeesCollection', i, {}) as IDataObject;

				const attendees: IDataObject[] = [];
				if (attendeesCollection.attendees) {
					const attendeesList = attendeesCollection.attendees as IDataObject[];
					if (attendeesList.length === 0) {
						throw new NodeOperationError(
							this.getNode(),
							'至少需要删除一个参与者',
							{ itemIndex: i },
						);
					}
					attendeesList.forEach((a) => {
						if (a.userid) {
							attendees.push({ userid: a.userid });
						}
					});
				}

				if (attendees.length === 0) {
					throw new NodeOperationError(
						this.getNode(),
						'至少需要删除一个参与者',
						{ itemIndex: i },
					);
				}

				response = await weComApiRequest.call(this, 'POST', '/cgi-bin/oa/schedule/del_attendees', {
					schedule_id,
					attendees,
				});
			} else if (operation === 'listCalendarSchedules') {
				const cal_id = this.getNodeParameter('cal_id', i) as string;
				const offset = this.getNodeParameter('offset', i, 0) as number;
				const limit = this.getNodeParameter('limit', i, 500) as number;

				response = await weComApiRequest.call(this, 'POST', '/cgi-bin/oa/schedule/get_by_calendar', {
					cal_id,
					offset,
					limit,
				});
			} else if (operation === 'getSchedule') {
				const schedule_id_list = this.getNodeParameter('schedule_id_list', i) as string;

				const scheduleIds = schedule_id_list.split(',').map((id) => id.trim()).filter((id) => id.length > 0);

				if (scheduleIds.length === 0) {
					throw new NodeOperationError(
						this.getNode(),
						'至少需要提供一个日程ID',
						{ itemIndex: i },
					);
				}

				if (scheduleIds.length > 1000) {
					throw new NodeOperationError(
						this.getNode(),
						'一次最多拉取1000条日程',
						{ itemIndex: i },
					);
				}

				response = await weComApiRequest.call(this, 'POST', '/cgi-bin/oa/schedule/get', {
					schedule_id_list: scheduleIds,
				});
			} else if (operation === 'cancelSchedule') {
				const schedule_id = this.getNodeParameter('schedule_id', i) as string;
				const op_mode = this.getNodeParameter('op_mode', i, 0) as number;
				const op_start_time_raw = this.getNodeParameter('op_start_time', i, '') as string | number;
				const op_start_time = op_start_time_raw ? dateTimeToUnixTimestamp(op_start_time_raw) : 0;

				const body: IDataObject = {
					schedule_id,
				};

				if (op_mode !== 0) {
					body.op_mode = op_mode;
				}
				if (op_start_time > 0 && (op_mode === 1 || op_mode === 2)) {
					body.op_start_time = op_start_time;
				}

				response = await weComApiRequest.call(this, 'POST', '/cgi-bin/oa/schedule/del', body);
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

