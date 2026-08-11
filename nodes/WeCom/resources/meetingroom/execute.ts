import type { IExecuteFunctions, INodeExecutionData, IDataObject } from 'n8n-workflow';
import { weComApiRequest } from '../../shared/transport';

function dateTimeToUnixTimestamp(dateTime: string | number): number {
	if (typeof dateTime === 'number') {
		return dateTime;
	}
	if (!dateTime || dateTime === '') {
		return 0;
	}
	return Math.floor(new Date(dateTime).getTime() / 1000);
}

export async function executeMeetingroom(
	this: IExecuteFunctions,
	operation: string,
	items: INodeExecutionData[],
): Promise<INodeExecutionData[]> {
	const returnData: INodeExecutionData[] = [];

	for (let i = 0; i < items.length; i++) {
		try {
			let responseData;

			if (operation === 'manageMeetingroom') {
				// 会议室管理
				// https://developer.work.weixin.qq.com/document/path/93619
				const action = this.getNodeParameter('action', i) as string;
				let body: IDataObject = {};
				let endpoint = '';

				if (action === 'list') {
					endpoint = '/cgi-bin/oa/meetingroom/list';
					const city = this.getNodeParameter('city', i, '') as string;
					const building = this.getNodeParameter('building', i, '') as string;
					const floor = this.getNodeParameter('floor', i, '') as string;
					const equipment = this.getNodeParameter('equipment', i, []) as number[];
					if (city) body.city = city;
					if (building) body.building = building;
					if (floor) body.floor = floor;
					if (equipment && equipment.length > 0) body.equipment = equipment;
				} else if (action === 'get') {
					// 官方 list/get 通过 list 过滤；无单独 get 接口时按 id 查询列表后由调用方筛选
					// 兼容：若文档支持 get，使用 list 并传 meetingroom_id
					endpoint = '/cgi-bin/oa/meetingroom/list';
					const meetingroom_id = this.getNodeParameter('meetingroom_id', i) as string;
					if (meetingroom_id) body.meetingroom_id = Number(meetingroom_id) || meetingroom_id;
				} else if (action === 'add') {
					endpoint = '/cgi-bin/oa/meetingroom/add';
					const name = this.getNodeParameter('name', i) as string;
					const capacity = this.getNodeParameter('capacity', i) as number;
					const city_add = this.getNodeParameter('city_add', i, '') as string;
					const building_add = this.getNodeParameter('building_add', i, '') as string;
					const floor_add = this.getNodeParameter('floor_add', i, '') as string;
					const equipment_add = this.getNodeParameter('equipment_add', i, []) as number[];
					body = { name, capacity };
					if (city_add) body.city = city_add;
					if (building_add) body.building = building_add;
					if (floor_add) body.floor = floor_add;
					if (equipment_add && equipment_add.length > 0) body.equipment = equipment_add;
				} else if (action === 'edit') {
					endpoint = '/cgi-bin/oa/meetingroom/edit';
					const meetingroom_id = this.getNodeParameter('meetingroom_id', i) as string;
					const name_edit = this.getNodeParameter('name_edit', i, '') as string;
					const capacity_edit = this.getNodeParameter('capacity_edit', i, 0) as number;
					const city_add = this.getNodeParameter('city_add', i, '') as string;
					const building_add = this.getNodeParameter('building_add', i, '') as string;
					const floor_add = this.getNodeParameter('floor_add', i, '') as string;
					const equipment_add = this.getNodeParameter('equipment_add', i, []) as number[];
					body = { meetingroom_id: Number(meetingroom_id) || meetingroom_id };
					if (name_edit) body.name = name_edit;
					if (capacity_edit) body.capacity = capacity_edit;
					if (city_add) body.city = city_add;
					if (building_add) body.building = building_add;
					if (floor_add) body.floor = floor_add;
					if (equipment_add && equipment_add.length > 0) body.equipment = equipment_add;
				} else if (action === 'delete') {
					endpoint = '/cgi-bin/oa/meetingroom/del';
					const meetingroom_id = this.getNodeParameter('meetingroom_id', i) as string;
					body = { meetingroom_id: Number(meetingroom_id) || meetingroom_id };
				}

				responseData = await weComApiRequest.call(this, 'POST', endpoint, body);
			} else if (operation === 'manageBooking') {
				// 会议室预定管理
				// https://developer.work.weixin.qq.com/document/path/93620
				const action = this.getNodeParameter('action', i) as string;
				let body: IDataObject = {};
				let endpoint = '';

				if (action === 'list') {
					// 查询会议室的预定信息
					endpoint = '/cgi-bin/oa/meetingroom/get_booking_info';
					const meetingroom_id = this.getNodeParameter('meetingroom_id', i, 0) as number;
					const start_time = dateTimeToUnixTimestamp(
						this.getNodeParameter('start_time', i, '') as string | number,
					);
					const end_time = dateTimeToUnixTimestamp(
						this.getNodeParameter('end_time', i, '') as string | number,
					);
					const city = this.getNodeParameter('city', i, '') as string;
					const building = this.getNodeParameter('building', i, '') as string;
					const floor = this.getNodeParameter('floor', i, '') as string;
					if (meetingroom_id) body.meetingroom_id = meetingroom_id;
					if (start_time) body.start_time = start_time;
					if (end_time) body.end_time = end_time;
					if (city) body.city = city;
					if (building) body.building = building;
					if (floor) body.floor = floor;
				} else if (action === 'get') {
					// 根据预定ID查询预定详情
					endpoint = '/cgi-bin/oa/meetingroom/bookinfo/get';
					const meetingroom_id = this.getNodeParameter('meetingroom_id_get', i) as number;
					const booking_id = this.getNodeParameter('booking_id', i) as string;
					body = { meetingroom_id, booking_id };
				} else if (action === 'book') {
					endpoint = '/cgi-bin/oa/meetingroom/book';
					const meetingroom_id = this.getNodeParameter('meetingroom_id_book', i) as number;
					const start_time = dateTimeToUnixTimestamp(
						this.getNodeParameter('start_time', i) as string | number,
					);
					const end_time = dateTimeToUnixTimestamp(
						this.getNodeParameter('end_time', i) as string | number,
					);
					const booker = this.getNodeParameter('booker', i) as string;
					const subject = this.getNodeParameter('subject', i, '') as string;
					const attendeesRaw = this.getNodeParameter('attendees', i, '') as string;
					body = { meetingroom_id, start_time, end_time, booker };
					if (subject) body.subject = subject;
					if (attendeesRaw) {
						body.attendees = attendeesRaw
							.split(',')
							.map((id) => id.trim())
							.filter(Boolean);
					}
				} else if (action === 'bookBySchedule') {
					endpoint = '/cgi-bin/oa/meetingroom/book_by_schedule';
					const meetingroom_id = this.getNodeParameter('meetingroom_id_book', i) as number;
					const schedule_id = this.getNodeParameter('schedule_id', i) as string;
					const booker = this.getNodeParameter('booker', i) as string;
					body = { meetingroom_id, schedule_id, booker };
				} else if (action === 'bookByMeeting') {
					endpoint = '/cgi-bin/oa/meetingroom/book_by_meeting';
					const meetingroom_id = this.getNodeParameter('meetingroom_id_book', i) as number;
					const meetingid = this.getNodeParameter('meetingid', i) as string;
					const booker = this.getNodeParameter('booker', i) as string;
					body = { meetingroom_id, meetingid, booker };
				} else if (action === 'cancel') {
					endpoint = '/cgi-bin/oa/meetingroom/cancel_book';
					const booking_id = this.getNodeParameter('booking_id', i) as string;
					const keep_schedule = this.getNodeParameter('keep_schedule', i, 0) as number;
					const cancel_date = dateTimeToUnixTimestamp(
						this.getNodeParameter('cancel_date', i, '') as string | number,
					);
					body = { booking_id };
					if (keep_schedule === 0 || keep_schedule === 1) body.keep_schedule = keep_schedule;
					if (cancel_date) body.cancel_date = cancel_date;
				}

				responseData = await weComApiRequest.call(this, 'POST', endpoint, body);
			} else if (operation === 'getApplicationList') {
				// 批量获取申请单ID
				// https://developer.work.weixin.qq.com/document/path/99883
				const starttime = dateTimeToUnixTimestamp(
					this.getNodeParameter('starttime', i) as string | number,
				);
				const endtime = dateTimeToUnixTimestamp(
					this.getNodeParameter('endtime', i) as string | number,
				);
				const cursor = this.getNodeParameter('cursor', i, '') as string;
				const limit = this.getNodeParameter('limit', i, 50) as number;

				responseData = await weComApiRequest.call(
					this,
					'POST',
					'/cgi-bin/oa/meetingroom/get_meetingroom_list',
					{
						starttime,
						endtime,
						...(cursor && { cursor }),
						limit,
					},
				);
			} else if (operation === 'getApplicationDetail') {
				// 获取申请单详细信息
				// https://developer.work.weixin.qq.com/document/path/99885
				const meeting_id_list = this.getNodeParameter('meeting_id_list', i) as string;

				responseData = await weComApiRequest.call(
					this,
					'POST',
					'/cgi-bin/oa/meetingroom/get_meetingroom_book_info',
					{
						meeting_id_list: meeting_id_list.split(',').map((id) => id.trim()),
					},
				);
			} else if (operation === 'setApprovalInfo') {
				// 设置审批单审批信息
				// https://developer.work.weixin.qq.com/document/path/99880
				const meeting_id = this.getNodeParameter('meeting_id', i) as string;
				const approve_status = this.getNodeParameter('approve_status', i) as number;
				const approve_info = this.getNodeParameter('approve_info', i, '') as string;

				responseData = await weComApiRequest.call(
					this,
					'POST',
					'/cgi-bin/oa/meetingroom/set_approval_info',
					{
						meeting_id,
						approve_status,
						...(approve_info && { approve_info }),
					},
				);
			}

			returnData.push({
				json: responseData || {},
				pairedItem: { item: i },
			});
		} catch (error) {
			if (this.continueOnFail()) {
				returnData.push({
					json: { error: error.message },
					pairedItem: { item: i },
				});
				continue;
			}
			throw error;
		}
	}

	return returnData;
}
