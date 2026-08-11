import type { IExecuteFunctions, INodeExecutionData, IDataObject } from 'n8n-workflow';
import { weComApiRequest } from '../../shared/transport';
import { executeExtraHttpOp } from '../../shared/extraHttpOp';
import { checkinExtraHttpOpsById } from './extraHttpOps';

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

export async function executeCheckin(
	this: IExecuteFunctions,
	operation: string,
	items: INodeExecutionData[],
): Promise<INodeExecutionData[]> {
	const returnData: INodeExecutionData[] = [];

	for (let i = 0; i < items.length; i++) {
		try {
			let responseData;

			if (operation === 'getCorporationRules') {
				// 获取企业所有打卡规则
				// https://developer.work.weixin.qq.com/document/path/93384
				responseData = await weComApiRequest.call(this, 'POST', '/cgi-bin/checkin/getcorpcheckinoption', {});
			} else if (operation === 'getUserRules') {
				// 获取员工打卡规则
				// https://developer.work.weixin.qq.com/document/path/94204
				const datetime = this.getNodeParameter('datetime', i) as number;
				const useridlist = this.getNodeParameter('useridlist', i) as string;
				responseData = await weComApiRequest.call(this, 'POST', '/cgi-bin/checkin/getcheckinoption', {
					datetime,
					useridlist: useridlist.split(',').map((id) => id.trim()),
				});
			} else if (operation === 'getCheckinData') {
				// 获取打卡记录数据
				// https://developer.work.weixin.qq.com/document/path/90262
				const starttime = dateTimeToUnixTimestamp(this.getNodeParameter('starttime', i) as string | number);
				const endtime = dateTimeToUnixTimestamp(this.getNodeParameter('endtime', i) as string | number);
				const useridlist = this.getNodeParameter('useridlist', i) as string;
				const opencheckindatatype = this.getNodeParameter('opencheckindatatype', i) as number;

				responseData = await weComApiRequest.call(this, 'POST', '/cgi-bin/checkin/getcheckindata', {
					opencheckindatatype,
					starttime,
					endtime,
					useridlist: useridlist.split(',').map((id) => id.trim()),
				});
			} else if (operation === 'getDailyReport') {
				// 获取打卡日报数据
				// https://developer.work.weixin.qq.com/document/path/93374
				const starttime = dateTimeToUnixTimestamp(this.getNodeParameter('starttime', i) as string | number);
				const endtime = dateTimeToUnixTimestamp(this.getNodeParameter('endtime', i) as string | number);
				const useridlist = this.getNodeParameter('useridlist', i) as string;

				responseData = await weComApiRequest.call(this, 'POST', '/cgi-bin/checkin/getcheckin_daydata', {
					starttime,
					endtime,
					useridlist: useridlist.split(',').map((id) => id.trim()),
				});
			} else if (operation === 'getMonthlyReport') {
				// 获取打卡月报数据
				// https://developer.work.weixin.qq.com/document/path/94207
				const starttime = dateTimeToUnixTimestamp(this.getNodeParameter('starttime', i) as string | number);
				const endtime = dateTimeToUnixTimestamp(this.getNodeParameter('endtime', i) as string | number);
				const useridlist = this.getNodeParameter('useridlist', i) as string;

				responseData = await weComApiRequest.call(this, 'POST', '/cgi-bin/checkin/getcheckin_monthdata', {
					starttime,
					endtime,
					useridlist: useridlist.split(',').map((id) => id.trim()),
				});
			} else if (operation === 'getScheduleList') {
				// 获取打卡人员排班信息
				// https://developer.work.weixin.qq.com/document/path/93380
				const starttime = dateTimeToUnixTimestamp(this.getNodeParameter('starttime', i) as string | number);
				const endtime = dateTimeToUnixTimestamp(this.getNodeParameter('endtime', i) as string | number);
				const useridlist = this.getNodeParameter('useridlist', i) as string;

				responseData = await weComApiRequest.call(
					this,
					'POST',
					'/cgi-bin/checkin/getcheckinschedulist',
					{
						starttime,
						endtime,
						useridlist: useridlist.split(',').map((id) => id.trim()),
					},
				);
			} else if (operation === 'setScheduleList') {
				// 为打卡人员排班
				// https://developer.work.weixin.qq.com/document/path/93385
				const groupid = this.getNodeParameter('groupid', i) as number;
				const yearmonth = this.getNodeParameter('yearmonth', i) as number;
				const scheduleCollection = this.getNodeParameter('scheduleCollection', i, {}) as { schedules?: Array<{ userid: string; day: number; schedule_id: number }> };

				const items: Array<{ userid: string; day: number; schedule_id: number }> = [];
				if (scheduleCollection.schedules) {
					scheduleCollection.schedules.forEach((s) => {
						items.push({
							userid: s.userid,
							day: s.day,
							schedule_id: s.schedule_id,
						});
					});
				}

				responseData = await weComApiRequest.call(this, 'POST', '/cgi-bin/checkin/setcheckinschedulist', {
					groupid,
					items,
					yearmonth,
				});
			} else if (operation === 'addCheckin') {
				// 为打卡人员补卡
				// https://developer.work.weixin.qq.com/document/path/95803
				// 官方路径：/cgi-bin/checkin/punch_correction
				const userid = this.getNodeParameter('userid', i) as string;
				const schedule_date_time = dateTimeToUnixTimestamp(
					this.getNodeParameter('schedule_date_time', i) as string | number,
				);
				const checkin_time = dateTimeToUnixTimestamp(
					this.getNodeParameter('checkin_time', i) as string | number,
				);
				const schedule_checkin_time = this.getNodeParameter('schedule_checkin_time', i, 0) as number;
				const remark = this.getNodeParameter('remark', i, '') as string;

				const body: IDataObject = {
					userid,
					schedule_date_time,
					checkin_time,
				};
				if (schedule_checkin_time) body.schedule_checkin_time = schedule_checkin_time;
				if (remark) body.remark = remark;

				responseData = await weComApiRequest.call(this, 'POST', '/cgi-bin/checkin/punch_correction', body);
			} else if (operation === 'addCheckinRecord') {
				// 添加打卡记录
				// https://developer.work.weixin.qq.com/document/path/99647
				// 官方路径：/cgi-bin/checkin/add_checkin_record，请求体为 records 数组
				const userid = this.getNodeParameter('userid', i) as string;
				const checkin_time = dateTimeToUnixTimestamp(
					this.getNodeParameter('checkin_time', i) as string | number,
				);
				const location_title = this.getNodeParameter('location_title', i) as string;
				const location_detail = this.getNodeParameter('location_detail', i) as string;
				const notes = this.getNodeParameter('notes', i, '') as string;
				const lng = this.getNodeParameter('lng', i, 0) as number;
				const lat = this.getNodeParameter('lat', i, 0) as number;
				const device_type = this.getNodeParameter('device_type', i, 0) as number;
				const device_detail = this.getNodeParameter('device_detail', i, '') as string;
				const wifiname = this.getNodeParameter('wifiname', i, '') as string;
				const wifimac = this.getNodeParameter('wifimac', i, '') as string;
				const mediaidsRaw = this.getNodeParameter('mediaids', i, '') as string;

				const record: IDataObject = {
					userid,
					checkin_time,
					location_title,
					location_detail,
				};
				if (notes) record.notes = notes;
				if (lng) record.lng = lng;
				if (lat) record.lat = lat;
				if (device_type) record.device_type = device_type;
				if (device_detail) record.device_detail = device_detail;
				if (wifiname) record.wifiname = wifiname;
				if (wifimac) record.wifimac = wifimac;
				if (mediaidsRaw) {
					record.mediaids = mediaidsRaw
						.split(',')
						.map((id) => id.trim())
						.filter(Boolean);
				}

				responseData = await weComApiRequest.call(this, 'POST', '/cgi-bin/checkin/add_checkin_record', {
					records: [record],
				});
			} else if (operation === 'addFaceInfo') {
				// 录入打卡人员人脸信息
				// https://developer.work.weixin.qq.com/document/path/93378
				const userid = this.getNodeParameter('userid', i) as string;
				const mediaid = this.getNodeParameter('mediaid', i) as string;

				responseData = await weComApiRequest.call(this, 'POST', '/cgi-bin/checkin/addcheckinuserface', {
					userid,
					userface: mediaid,
				});
			} else if (operation === 'getDeviceCheckinData') {
				// 获取设备打卡数据
				// https://developer.work.weixin.qq.com/document/path/94126
				const starttime = dateTimeToUnixTimestamp(this.getNodeParameter('starttime', i) as string | number);
				const endtime = dateTimeToUnixTimestamp(this.getNodeParameter('endtime', i) as string | number);
				const useridlist = this.getNodeParameter('useridlist', i) as string;

				responseData = await weComApiRequest.call(
					this,
					'POST',
					'/cgi-bin/hardware/get_hardware_checkin_data',
					{
						starttime,
						endtime,
						useridlist: useridlist.split(',').map((id) => id.trim()),
					},
				);
			} else if (operation === 'manageRules') {
				// 管理打卡规则
				// https://developer.work.weixin.qq.com/document/path/98041
				// 官方结构：{ effective_now, group: { ... } }
				const action = this.getNodeParameter('action', i) as string;
				const effective_now = this.getNodeParameter('effective_now', i, false) as boolean;

				const endpoint =
					action === 'create'
						? '/cgi-bin/checkin/add_checkin_option'
						: action === 'update'
							? '/cgi-bin/checkin/update_checkin_option'
							: '/cgi-bin/checkin/del_checkin_option';

				let body: IDataObject = {};

				if (action === 'delete') {
					const groupid = this.getNodeParameter('groupid', i) as number;
					body = { groupid };
					if (effective_now) body.effective_now = true;
				} else {
					const group: IDataObject = {};
					const groupname = this.getNodeParameter('groupname', i, '') as string;
					const useAdvancedConfig = this.getNodeParameter('useAdvancedConfig', i, false) as boolean;
					const checkin_type = this.getNodeParameter('checkin_type', i, 0) as number;
					const range_userids = this.getNodeParameter('range_userids', i, '') as string;
					const range_partyids = this.getNodeParameter('range_partyids', i, '') as string;
					const range_tagids = this.getNodeParameter('range_tagids', i, '') as string;
					const white_users = this.getNodeParameter('white_users', i, '') as string;
					const sync_holidays = this.getNodeParameter('sync_holidays', i, true) as boolean;
					const need_photo = this.getNodeParameter('need_photo', i, false) as boolean;
					const note_can_use_local_pic = this.getNodeParameter(
						'note_can_use_local_pic',
						i,
						false,
					) as boolean;
					const allow_checkin_offworkday = this.getNodeParameter(
						'allow_checkin_offworkday',
						i,
						false,
					) as boolean;
					const allow_apply_offworkday = this.getNodeParameter(
						'allow_apply_offworkday',
						i,
						false,
					) as boolean;
					const use_face_detect = this.getNodeParameter('use_face_detect', i, false) as boolean;
					const open_face_live_detect = this.getNodeParameter(
						'open_face_live_detect',
						i,
						false,
					) as boolean;
					const sync_out_checkin = this.getNodeParameter('sync_out_checkin', i, false) as boolean;
					const checkin_method_type = this.getNodeParameter('checkin_method_type', i, 0) as number;
					const workdaysRaw = this.getNodeParameter('workdays', i, '1,2,3,4,5') as string;
					const work_sec = this.getNodeParameter('work_sec', i, 32400) as number;
					const off_work_sec = this.getNodeParameter('off_work_sec', i, 64800) as number;

					if (action === 'update') {
						const groupid = this.getNodeParameter('groupid', i) as number;
						group.groupid = groupid;
					}
					if (action === 'create') {
						const grouptype = this.getNodeParameter('grouptype', i, 1) as number;
						group.grouptype = grouptype;
					}
					if (groupname) group.groupname = groupname;
					group.type = checkin_type;
					group.sync_holidays = sync_holidays;
					group.need_photo = need_photo;
					group.note_can_use_local_pic = note_can_use_local_pic;
					group.allow_checkin_offworkday = allow_checkin_offworkday;
					group.allow_apply_offworkday = allow_apply_offworkday;
					group.use_face_detect = use_face_detect;
					group.open_face_live_detect = open_face_live_detect;
					group.sync_out_checkin = sync_out_checkin;
					group.checkin_method_type = checkin_method_type;

					const range: IDataObject = {};
					const userids = range_userids.split(',').map((s) => s.trim()).filter(Boolean);
					const partyids = range_partyids
						.split(',')
						.map((s) => s.trim())
						.filter(Boolean)
						.map((n) => Number(n));
					const tagids = range_tagids
						.split(',')
						.map((s) => s.trim())
						.filter(Boolean)
						.map((n) => Number(n));
					if (userids.length) range.userid = userids;
					if (partyids.length) range.party_id = partyids;
					if (tagids.length) range.tagid = tagids;
					if (Object.keys(range).length) group.range = range;

					const whiteUsers = white_users.split(',').map((s) => s.trim()).filter(Boolean);
					if (whiteUsers.length) group.white_users = whiteUsers;

					const workdays = workdaysRaw
						.split(',')
						.map((s) => Number(s.trim()))
						.filter((n) => n >= 1 && n <= 7);
					if (workdays.length && work_sec && off_work_sec) {
						group.checkindate = [
							{
								workdays,
								checkintime: [
									{
										time_id: 1,
										work_sec,
										off_work_sec,
										remind_work_sec: Math.max(0, work_sec - 600),
										remind_off_work_sec: off_work_sec,
									},
								],
							},
						];
					}

					const locCollection = this.getNodeParameter('locInfosCollection', i, {}) as IDataObject;
					const locs = ((locCollection?.locs as IDataObject[]) || [])
						.filter((l) => l.lat || l.lng)
						.map((l) => ({
							lat: l.lat,
							lng: l.lng,
							loc_title: l.loc_title || '',
							loc_detail: l.loc_detail || '',
							distance: l.distance || 300,
						}));
					if (locs.length) group.loc_infos = locs;

					const wifiCollection = this.getNodeParameter('wifiInfosCollection', i, {}) as IDataObject;
					const wifis = ((wifiCollection?.wifis as IDataObject[]) || [])
						.filter((w) => w.wifimac)
						.map((w) => ({
							wifiname: w.wifiname || '',
							wifimac: w.wifimac,
						}));
					if (wifis.length) group.wifimac_infos = wifis;

					if (useAdvancedConfig) {
						const advancedConfig = this.getNodeParameter('advancedConfig', i, '{}') as string;
						try {
							const config = JSON.parse(advancedConfig) as IDataObject;
							// 允许 advanced 直接给完整 group，或只给 group 内字段
							if (config.group && typeof config.group === 'object') {
								Object.assign(group, config.group as IDataObject);
							} else {
								Object.assign(group, config);
							}
						} catch {
							// 忽略 JSON 解析错误
						}
					}

					body = { group };
					if (effective_now) body.effective_now = true;
				}

				responseData = await weComApiRequest.call(this, 'POST', endpoint, body);
			} else if (checkinExtraHttpOpsById[operation]) {
				const bodyDefaults: IDataObject = {};
				const checkin_groupid = this.getNodeParameter('checkin_groupid', i, 0) as number;
				const clear_field_ids = this.getNodeParameter('clear_field_ids', i, []) as number[];
				const clear_effective_now = this.getNodeParameter('clear_effective_now', i, false) as boolean;
				if (checkin_groupid) bodyDefaults.groupid = checkin_groupid;
				if (Array.isArray(clear_field_ids) && clear_field_ids.length) {
					bodyDefaults.clear_field = clear_field_ids.map((n) => Number(n));
				}
				if (clear_effective_now) bodyDefaults.effective_now = true;
				responseData = await executeExtraHttpOp.call(
					this,
					checkinExtraHttpOpsById[operation],
					i,
					bodyDefaults,
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

