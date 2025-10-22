import type { IExecuteFunctions, INodeExecutionData } from 'n8n-workflow';
import { weComApiRequest } from '../../shared/transport';

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
				// https://developer.work.weixin.qq.com/document/path/90263
				const userid = this.getNodeParameter('userid', i) as string;
				responseData = await weComApiRequest.call(this, 'POST', '/cgi-bin/checkin/getcheckinoption', {
					userid_list: [userid],
				});
			} else if (operation === 'getCheckinData') {
				// 获取打卡记录数据
				// https://developer.work.weixin.qq.com/document/path/90262
				const starttime = this.getNodeParameter('starttime', i) as number;
				const endtime = this.getNodeParameter('endtime', i) as number;
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
				const starttime = this.getNodeParameter('starttime', i) as number;
				const endtime = this.getNodeParameter('endtime', i) as number;
				const useridlist = this.getNodeParameter('useridlist', i) as string;

				responseData = await weComApiRequest.call(this, 'POST', '/cgi-bin/checkin/getcheckin_daydata', {
					starttime,
					endtime,
					useridlist: useridlist.split(',').map((id) => id.trim()),
				});
			} else if (operation === 'getMonthlyReport') {
				// 获取打卡月报数据
				// https://developer.work.weixin.qq.com/document/path/93387
				const month = this.getNodeParameter('month', i) as number;
				const useridlist = this.getNodeParameter('useridlist', i) as string;

				responseData = await weComApiRequest.call(this, 'POST', '/cgi-bin/checkin/getcheckin_monthdata', {
					month,
					useridlist: useridlist.split(',').map((id) => id.trim()),
				});
			} else if (operation === 'getScheduleList') {
				// 获取打卡人员排班信息
				// https://developer.work.weixin.qq.com/document/path/93380
				const starttime = this.getNodeParameter('starttime', i) as number;
				const endtime = this.getNodeParameter('endtime', i) as number;
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
				const items = this.getNodeParameter('items', i) as string;
				const yearmonth = this.getNodeParameter('yearmonth', i) as number;

				responseData = await weComApiRequest.call(this, 'POST', '/cgi-bin/checkin/setcheckinschedulist', {
					groupid: 0,
					items: JSON.parse(items),
					yearmonth,
				});
			} else if (operation === 'addCheckin') {
				// 为打卡人员补卡
				// https://developer.work.weixin.qq.com/document/path/95803
				const userid = this.getNodeParameter('userid', i) as string;
				const checkintime = this.getNodeParameter('checkintime', i) as number;
				const checkintype = this.getNodeParameter('checkintype', i) as string;

				responseData = await weComApiRequest.call(this, 'POST', '/cgi-bin/checkin/add_checkin_userface', {
					userid,
					checkintime,
					checkintype,
				});
			} else if (operation === 'addCheckinRecord') {
				// 添加打卡记录
				// https://developer.work.weixin.qq.com/document/path/99647
				const record = this.getNodeParameter('record', i) as string;

				responseData = await weComApiRequest.call(this, 'POST', '/cgi-bin/checkin/addcheckin', {
					...JSON.parse(record),
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
				const starttime = this.getNodeParameter('starttime', i) as number;
				const endtime = this.getNodeParameter('endtime', i) as number;
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
				const ruleInfo = this.getNodeParameter('ruleInfo', i) as string;

				const endpoint =
					action === 'create'
						? '/cgi-bin/checkin/add_checkin_option'
						: action === 'update'
							? '/cgi-bin/checkin/update_checkin_option'
							: '/cgi-bin/checkin/del_checkin_option';

				responseData = await weComApiRequest.call(this, 'POST', endpoint, JSON.parse(ruleInfo));
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

