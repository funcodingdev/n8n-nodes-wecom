import type { IDataObject, IExecuteFunctions, INodeExecutionData } from 'n8n-workflow';
import { NodeOperationError } from 'n8n-workflow';
import { weComApiRequest } from '../../shared/transport';

const LIST_SEPARATOR = /[,，|\n\r]+/;
const MAX_UINT32 = 4294967295;
const EQUIPMENT_TYPES = new Set([1, 2, 3, 4, 5]);

function fail(context: IExecuteFunctions, message: string, itemIndex: number): never {
	throw new NodeOperationError(context.getNode(), message, { itemIndex });
}

function text(
	context: IExecuteFunctions,
	value: unknown,
	label: string,
	itemIndex: number,
	maxBytes = 4096,
	required = true,
): string {
	const normalized = String(value ?? '').trim();
	if (required && !normalized) fail(context, `${label}不能为空`, itemIndex);
	if (Buffer.byteLength(normalized, 'utf8') > maxBytes) {
		fail(context, `${label}不能超过 ${maxBytes} 字节`, itemIndex);
	}
	return normalized;
}

function name(
	context: IExecuteFunctions,
	value: unknown,
	label: string,
	itemIndex: number,
): string {
	const normalized = text(context, value, label, itemIndex, 120);
	if ([...normalized].length > 30) fail(context, `${label}不能超过 30 个字符`, itemIndex);
	return normalized;
}

function integer(
	context: IExecuteFunctions,
	value: unknown,
	label: string,
	itemIndex: number,
	min: number,
	max: number,
): number {
	const normalized = Number(value);
	if (!Number.isSafeInteger(normalized) || normalized < min || normalized > max) {
		fail(context, `${label}必须是 ${min}–${max} 之间的整数`, itemIndex);
	}
	return normalized;
}

function unixTimestamp(
	context: IExecuteFunctions,
	value: unknown,
	label: string,
	itemIndex: number,
	required = true,
): number {
	if (value === undefined || value === null || String(value).trim() === '') {
		if (required) fail(context, `${label}不能为空`, itemIndex);
		return 0;
	}
	const raw = String(value).trim();
	const normalized = /^\d+$/.test(raw) ? Number(raw) : Math.floor(Date.parse(raw) / 1000);
	if (!Number.isSafeInteger(normalized) || normalized < 1 || normalized > MAX_UINT32) {
		fail(context, `${label}不是有效的日期时间`, itemIndex);
	}
	return normalized;
}

function listValues(value: unknown): string[] {
	if (Array.isArray(value)) {
		return value.flatMap((entry) => listValues(entry));
	}
	return String(value ?? '')
		.split(LIST_SEPARATOR)
		.map((entry) => entry.trim())
		.filter(Boolean);
}

function stringList(
	context: IExecuteFunctions,
	value: unknown,
	label: string,
	itemIndex: number,
	max: number,
): string[] {
	const unique = [...new Set(listValues(value))];
	if (unique.length > max) fail(context, `${label}最多支持 ${max} 个`, itemIndex);
	return unique;
}

function equipmentList(
	context: IExecuteFunctions,
	value: unknown,
	label: string,
	itemIndex: number,
): number[] {
	const raw = Array.isArray(value) ? value : [];
	const values = [...new Set(raw.map(Number))];
	if (values.some((entry) => !EQUIPMENT_TYPES.has(entry))) {
		fail(context, `${label}包含不支持的设备类型`, itemIndex);
	}
	return values;
}

function coordinate(
	context: IExecuteFunctions,
	latitudeValue: unknown,
	longitudeValue: unknown,
	itemIndex: number,
): IDataObject {
	const latitude = text(context, latitudeValue, '纬度', itemIndex, 32);
	const longitude = text(context, longitudeValue, '经度', itemIndex, 32);
	const latitudeNumber = Number(latitude);
	const longitudeNumber = Number(longitude);
	if (!Number.isFinite(latitudeNumber) || latitudeNumber < -90 || latitudeNumber > 90) {
		fail(context, '纬度必须是 -90–90 之间的数字', itemIndex);
	}
	if (!Number.isFinite(longitudeNumber) || longitudeNumber < -180 || longitudeNumber > 180) {
		fail(context, '经度必须是 -180–180 之间的数字', itemIndex);
	}
	return { latitude, longitude };
}

function range(
	context: IExecuteFunctions,
	userValue: unknown,
	departmentValue: unknown,
	itemIndex: number,
): IDataObject {
	const userList = stringList(context, userValue, '可用成员', itemIndex, 1000).map((userid) =>
		text(context, userid, '成员 UserID', itemIndex, 64),
	);
	const departmentList = stringList(
		context,
		departmentValue,
		'可用部门',
		itemIndex,
		1000,
	).map((departmentId) =>
		integer(context, departmentId, '部门 ID', itemIndex, 1, MAX_UINT32),
	);
	const result: IDataObject = {};
	if (userList.length) result.user_list = userList;
	if (departmentList.length) result.department_list = departmentList;
	return result;
}

function optionalLocation(
	context: IExecuteFunctions,
	cityValue: unknown,
	buildingValue: unknown,
	floorValue: unknown,
	itemIndex: number,
	allOrNothing: boolean,
): IDataObject {
	const city = text(context, cityValue, '城市', itemIndex, 128, false);
	const building = text(context, buildingValue, '楼宇', itemIndex, 128, false);
	const floor = text(context, floorValue, '楼层', itemIndex, 128, false);
	if (allOrNothing) {
		const filled = [city, building, floor].filter(Boolean).length;
		if (filled !== 0 && filled !== 3) fail(context, '城市、楼宇和楼层必须同时填写', itemIndex);
	} else {
		if (building && !city) fail(context, '按楼宇筛选时必须同时填写城市', itemIndex);
		if (floor && (!city || !building)) {
			fail(context, '按楼层筛选时必须同时填写城市和楼宇', itemIndex);
		}
	}
	const result: IDataObject = {};
	if (city) result.city = city;
	if (building) result.building = building;
	if (floor) result.floor = floor;
	return result;
}

function localCalendarDay(timestamp: number): string {
	const date = new Date(timestamp * 1000);
	return `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;
}

export async function executeMeetingroom(
	this: IExecuteFunctions,
	operation: string,
	items: INodeExecutionData[],
): Promise<INodeExecutionData[]> {
	const returnData: INodeExecutionData[] = [];

	for (let i = 0; i < items.length; i++) {
		try {
			let endpoint: string;
			let body: IDataObject;

			if (operation === 'manageMeetingroom') {
				const action = this.getNodeParameter('action', i) as string;
				if (action === 'list') {
					endpoint = '/cgi-bin/oa/meetingroom/list';
					body = optionalLocation(
						this,
						this.getNodeParameter('city', i, ''),
						this.getNodeParameter('building', i, ''),
						this.getNodeParameter('floor', i, ''),
						i,
						false,
					);
					const equipment = equipmentList(
						this,
						this.getNodeParameter('equipment', i, []),
						'设备筛选',
						i,
					);
					if (equipment.length) body.equipment = equipment;
				} else if (action === 'add') {
					endpoint = '/cgi-bin/oa/meetingroom/add';
					body = {
						name: name(this, this.getNodeParameter('name', i), '会议室名称', i),
						capacity: integer(
							this,
							this.getNodeParameter('capacity', i),
							'容纳人数',
							i,
							1,
							MAX_UINT32,
						),
						...optionalLocation(
							this,
							this.getNodeParameter('city_add', i, ''),
							this.getNodeParameter('building_add', i, ''),
							this.getNodeParameter('floor_add', i, ''),
							i,
							true,
						),
					};
					const equipment = equipmentList(
						this,
						this.getNodeParameter('equipment_add', i, []),
						'设备列表',
						i,
					);
					if (equipment.length) body.equipment = equipment;
					if (this.getNodeParameter('set_coordinate', i, false) as boolean) {
						body.coordinate = coordinate(
							this,
							this.getNodeParameter('latitude', i),
							this.getNodeParameter('longitude', i),
							i,
						);
					}
					if (this.getNodeParameter('set_range', i, false) as boolean) {
						body.range = range(
							this,
							this.getNodeParameter('range_user_list', i, ''),
							this.getNodeParameter('range_department_list', i, ''),
							i,
						);
					}
				} else if (action === 'edit') {
					endpoint = '/cgi-bin/oa/meetingroom/edit';
					body = {
						meetingroom_id: integer(
							this,
							this.getNodeParameter('meetingroom_id', i),
							'会议室 ID',
							i,
							1,
							MAX_UINT32,
						),
					};
					let updateCount = 0;
					if (this.getNodeParameter('update_name', i, false) as boolean) {
						body.name = name(this, this.getNodeParameter('name_edit', i), '会议室名称', i);
						updateCount++;
					}
					if (this.getNodeParameter('update_capacity', i, false) as boolean) {
						body.capacity = integer(
							this,
							this.getNodeParameter('capacity_edit', i),
							'容纳人数',
							i,
							1,
							MAX_UINT32,
						);
						updateCount++;
					}
					if (this.getNodeParameter('update_location', i, false) as boolean) {
						Object.assign(
							body,
							optionalLocation(
								this,
								this.getNodeParameter('city_edit', i),
								this.getNodeParameter('building_edit', i),
								this.getNodeParameter('floor_edit', i),
								i,
								true,
							),
						);
						updateCount++;
					}
					if (this.getNodeParameter('update_equipment', i, false) as boolean) {
						body.equipment = equipmentList(
							this,
							this.getNodeParameter('equipment_edit', i, []),
							'设备列表',
							i,
						);
						updateCount++;
					}
					if (this.getNodeParameter('update_coordinate', i, false) as boolean) {
						body.coordinate = coordinate(
							this,
							this.getNodeParameter('latitude_edit', i),
							this.getNodeParameter('longitude_edit', i),
							i,
						);
						updateCount++;
					}
					if (this.getNodeParameter('update_range', i, false) as boolean) {
						body.range = range(
							this,
							this.getNodeParameter('range_user_list_edit', i, ''),
							this.getNodeParameter('range_department_list_edit', i, ''),
							i,
						);
						updateCount++;
					}
					if (!updateCount) fail(this, '编辑会议室时至少选择一项要修改的内容', i);
				} else if (action === 'delete') {
					endpoint = '/cgi-bin/oa/meetingroom/del';
					body = {
						meetingroom_id: integer(
							this,
							this.getNodeParameter('meetingroom_id', i),
							'会议室 ID',
							i,
							1,
							MAX_UINT32,
						),
					};
				} else {
					fail(this, `不支持的会议室管理操作：${action}`, i);
				}
			} else if (operation === 'manageBooking') {
				const action = this.getNodeParameter('action', i) as string;
				if (action === 'list') {
					endpoint = '/cgi-bin/oa/meetingroom/get_booking_info';
					body = optionalLocation(
						this,
						this.getNodeParameter('city', i, ''),
						this.getNodeParameter('building', i, ''),
						this.getNodeParameter('floor', i, ''),
						i,
						false,
					);
					if (this.getNodeParameter('filter_by_meetingroom', i, false) as boolean) {
						body.meetingroom_id = integer(
							this,
							this.getNodeParameter('meetingroom_id', i),
							'会议室 ID',
							i,
							1,
							MAX_UINT32,
						);
					}
					if (this.getNodeParameter('filter_by_time', i, false) as boolean) {
						const startTime = unixTimestamp(
							this,
							this.getNodeParameter('list_start_time', i),
							'查询开始时间',
							i,
						);
						const endTime = unixTimestamp(
							this,
							this.getNodeParameter('list_end_time', i),
							'查询结束时间',
							i,
						);
						if (endTime <= startTime) fail(this, '查询结束时间必须晚于开始时间', i);
						if (localCalendarDay(startTime) !== localCalendarDay(endTime)) {
							fail(this, '会议室预定信息不支持跨天查询', i);
						}
						body.start_time = startTime;
						body.end_time = endTime;
					}
				} else if (action === 'get') {
					endpoint = '/cgi-bin/oa/meetingroom/bookinfo/get';
					body = {
						meetingroom_id: integer(
							this,
							this.getNodeParameter('meetingroom_id_get', i),
							'会议室 ID',
							i,
							1,
							MAX_UINT32,
						),
						booking_id: text(this, this.getNodeParameter('booking_id', i), '预定 ID', i, 128),
					};
				} else if (action === 'book') {
					endpoint = '/cgi-bin/oa/meetingroom/book';
					const startTime = unixTimestamp(
						this,
						this.getNodeParameter('book_start_time', i),
						'开始时间',
						i,
					);
					const endTime = unixTimestamp(
						this,
						this.getNodeParameter('book_end_time', i),
						'结束时间',
						i,
					);
					if (endTime <= startTime) fail(this, '结束时间必须晚于开始时间', i);
					if (endTime - startTime < 1800) fail(this, '会议室最小预定时长为 30 分钟', i);
					body = {
						meetingroom_id: integer(
							this,
							this.getNodeParameter('meetingroom_id_book', i),
							'会议室 ID',
							i,
							1,
							MAX_UINT32,
						),
						start_time: startTime,
						end_time: endTime,
						booker: text(
							this,
							this.getNodeParameter('booker', i, '') ||
								this.getNodeParameter('booker_selected', i, ''),
							'预定人 UserID',
							i,
							64,
						),
					};
					const subject = text(
						this,
						this.getNodeParameter('subject', i, ''),
						'会议主题',
						i,
						4096,
						false,
					);
					if (subject) body.subject = subject;
					const attendees = stringList(
						this,
						[
							this.getNodeParameter('attendees', i, ''),
							this.getNodeParameter('attendees_selected', i, []),
						],
						'参会人员',
						i,
						1000,
					).map((userid) => text(this, userid, '参会人员 UserID', i, 64));
					if (attendees.length) body.attendees = attendees;
				} else if (action === 'bookBySchedule') {
					endpoint = '/cgi-bin/oa/meetingroom/book_by_schedule';
					body = {
						meetingroom_id: integer(
							this,
							this.getNodeParameter('meetingroom_id_book', i),
							'会议室 ID',
							i,
							1,
							MAX_UINT32,
						),
						schedule_id: text(this, this.getNodeParameter('schedule_id', i), '日程 ID', i, 128),
						booker: text(
							this,
							this.getNodeParameter('booker', i, '') ||
								this.getNodeParameter('booker_selected', i, ''),
							'预定人 UserID',
							i,
							64,
						),
					};
				} else if (action === 'bookByMeeting') {
					endpoint = '/cgi-bin/oa/meetingroom/book_by_meeting';
					body = {
						meetingroom_id: integer(
							this,
							this.getNodeParameter('meetingroom_id_book', i),
							'会议室 ID',
							i,
							1,
							MAX_UINT32,
						),
						meetingid: text(this, this.getNodeParameter('meetingid', i), '会议 ID', i, 128),
						booker: text(
							this,
							this.getNodeParameter('booker', i, '') ||
								this.getNodeParameter('booker_selected', i, ''),
							'预定人 UserID',
							i,
							64,
						),
					};
				} else if (action === 'cancel') {
					endpoint = '/cgi-bin/oa/meetingroom/cancel_book';
					body = {
						booking_id: text(this, this.getNodeParameter('booking_id', i), '预定 ID', i, 128),
						keep_schedule: integer(
							this,
							this.getNodeParameter('keep_schedule', i, 0),
							'是否保留日程',
							i,
							0,
							1,
						),
					};
					const cancelDate = unixTimestamp(
						this,
						this.getNodeParameter('cancel_date', i, ''),
						'取消日期',
						i,
						false,
					);
					if (cancelDate) body.cancel_date = cancelDate;
				} else {
					fail(this, `不支持的会议室预定操作：${action}`, i);
				}
			} else {
				fail(this, `不支持的会议室操作：${operation}`, i);
			}

			const response = await weComApiRequest.call(this, 'POST', endpoint, body);
			returnData.push({ json: response || {}, pairedItem: { item: i } });
		} catch (error) {
			if (this.continueOnFail()) {
				returnData.push({
					json: { error: error instanceof Error ? error.message : String(error) },
					pairedItem: { item: i },
				});
				continue;
			}
			throw error;
		}
	}

	return returnData;
}
