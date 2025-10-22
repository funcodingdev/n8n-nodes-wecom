import type { IExecuteFunctions, INodeExecutionData } from 'n8n-workflow';
import { weComApiRequest } from '../../shared/transport';

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
				const roomData = this.getNodeParameter('roomData', i, '{}') as string;
				const data = JSON.parse(roomData);

				const endpointMap: Record<string, string> = {
					add: '/cgi-bin/oa/meetingroom/add',
					edit: '/cgi-bin/oa/meetingroom/edit',
					delete: '/cgi-bin/oa/meetingroom/del',
					get: '/cgi-bin/oa/meetingroom/get',
					list: '/cgi-bin/oa/meetingroom/list',
				};

				responseData = await weComApiRequest.call(this, 'POST', endpointMap[action], data);
			} else if (operation === 'manageBooking') {
				// 会议室预定管理
				// https://developer.work.weixin.qq.com/document/path/93620
				const action = this.getNodeParameter('action', i) as string;
				const bookingData = this.getNodeParameter('bookingData', i, '{}') as string;
				const data = JSON.parse(bookingData);

				const endpointMap: Record<string, string> = {
					book: '/cgi-bin/oa/meetingroom/book',
					cancel: '/cgi-bin/oa/meetingroom/cancel_book',
					get: '/cgi-bin/oa/meetingroom/get_booking_info',
					list: '/cgi-bin/oa/meetingroom/get_booking_info_by_meetingroom',
				};

				responseData = await weComApiRequest.call(this, 'POST', endpointMap[action], data);
			} else if (operation === 'getApplicationList') {
				// 批量获取申请单ID
				// https://developer.work.weixin.qq.com/document/path/99883
				const starttime = this.getNodeParameter('starttime', i) as number;
				const endtime = this.getNodeParameter('endtime', i) as number;
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

