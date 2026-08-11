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
				const action = this.getNodeParameter('action', i) as string;

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
				} else {
					const groupname = this.getNodeParameter('groupname', i, '') as string;
					const useAdvancedConfig = this.getNodeParameter('useAdvancedConfig', i, false) as boolean;

					if (action === 'update') {
						const groupid = this.getNodeParameter('groupid', i) as number;
						body.groupid = groupid;
					}
					if (action === 'create') {
						const grouptype = this.getNodeParameter('grouptype', i, 1) as number;
						body.grouptype = grouptype;
					}
					if (groupname) body.groupname = groupname;

					// 构建成员列表
					const memberCollection = this.getNodeParameter('memberCollection', i, {}) as { members?: Array<{ userid: string }> };
					if (memberCollection.members && memberCollection.members.length > 0) {
						body.range = {
							userid: memberCollection.members.map((m) => m.userid),
						};
					}

					// 高级配置
					if (useAdvancedConfig) {
						const advancedConfig = this.getNodeParameter('advancedConfig', i, '{}') as string;
						try {
							const config = JSON.parse(advancedConfig) as IDataObject;
							body = { ...body, ...config };
					} catch {
						// 忽略JSON解析错误
					}
					}
				}

				responseData = await weComApiRequest.call(this, 'POST', endpoint, body);
			} else if (checkinExtraHttpOpsById[operation]) {
				responseData = await executeExtraHttpOp.call(
					this,
					checkinExtraHttpOpsById[operation],
					i,
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

