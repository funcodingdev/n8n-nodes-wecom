import type { IExecuteFunctions, INodeExecutionData, IDataObject } from 'n8n-workflow';
import { NodeOperationError } from 'n8n-workflow';
import { weComApiRequest } from '../../shared/transport';

export async function executeMeeting(
	this: IExecuteFunctions,
	operation: string,
	items: INodeExecutionData[],
): Promise<INodeExecutionData[]> {
	const returnData: INodeExecutionData[] = [];

	for (let i = 0; i < items.length; i++) {
		try {
			let response: IDataObject;

			// 预约会议基础管理
			if (operation === 'createMeeting') {
				const subject = this.getNodeParameter('subject', i) as string;
				const start_time = this.getNodeParameter('start_time', i) as number;
				const end_time = this.getNodeParameter('end_time', i) as number;
				const type = this.getNodeParameter('type', i) as number;
				const attendees = this.getNodeParameter('attendees', i, '[]') as string;

				const body: IDataObject = {
					subject,
					start_time,
					end_time,
					type,
				};

				if (attendees && attendees !== '[]') {
					try {
						body.attendees = JSON.parse(attendees);
					} catch (error) {
						throw new NodeOperationError(
							this.getNode(),
							`attendees 必须是有效的 JSON: ${error.message}`,
							{ itemIndex: i },
						);
					}
				}

				response = await weComApiRequest.call(this, 'POST', '/cgi-bin/meeting/create', body);
			} else if (operation === 'updateMeeting') {
				const meetingid = this.getNodeParameter('meetingid', i) as string;
				const subject = this.getNodeParameter('subject', i, '') as string;
				const start_time = this.getNodeParameter('start_time', i, 0) as number;
				const end_time = this.getNodeParameter('end_time', i, 0) as number;

				const body: IDataObject = { meetingid };
				if (subject) body.subject = subject;
				if (start_time) body.start_time = start_time;
				if (end_time) body.end_time = end_time;

				response = await weComApiRequest.call(this, 'POST', '/cgi-bin/meeting/update', body);
			} else if (operation === 'cancelMeeting') {
				const meetingid = this.getNodeParameter('meetingid', i) as string;

				response = await weComApiRequest.call(this, 'POST', '/cgi-bin/meeting/cancel', {
					meetingid,
				});
			} else if (operation === 'getMeetingInfo') {
				const meetingid = this.getNodeParameter('meetingid', i) as string;

				response = await weComApiRequest.call(this, 'POST', '/cgi-bin/meeting/get_info', {
					meetingid,
				});
			} else if (operation === 'getUserMeetings') {
				const userid = this.getNodeParameter('userid', i) as string;
				const cursor = this.getNodeParameter('cursor', i, '') as string;
				const limit = this.getNodeParameter('limit', i, 20) as number;

				const body: IDataObject = { userid, limit };
				if (cursor) body.cursor = cursor;

				response = await weComApiRequest.call(this, 'POST', '/cgi-bin/meeting/get_user_meeting_id', body);
			}
			// 会议统计管理
			else if (operation === 'getMeetingRecords') {
				const start_time = this.getNodeParameter('start_time', i) as number;
				const end_time = this.getNodeParameter('end_time', i) as number;
				const userid = this.getNodeParameter('userid', i, '') as string;
				const cursor = this.getNodeParameter('cursor', i, '') as string;
				const limit = this.getNodeParameter('limit', i, 20) as number;

				const body: IDataObject = { start_time, end_time, limit };
				if (userid) body.userid = userid;
				if (cursor) body.cursor = cursor;

				response = await weComApiRequest.call(this, 'POST', '/cgi-bin/meeting/get_user_meeting_list', body);
			}
			// 预约会议高级管理
			else if (operation === 'createAdvancedMeeting') {
				const meeting_info = this.getNodeParameter('meeting_info', i) as string;

				let parsedInfo;
				try {
					parsedInfo = JSON.parse(meeting_info);
				} catch (error) {
					throw new NodeOperationError(
						this.getNode(),
						`meeting_info 必须是有效的 JSON: ${error.message}`,
						{ itemIndex: i },
					);
				}

				response = await weComApiRequest.call(this, 'POST', '/cgi-bin/meeting/create', parsedInfo);
			} else if (operation === 'updateAdvancedMeeting') {
				const meetingid = this.getNodeParameter('meetingid', i) as string;
				const meeting_info = this.getNodeParameter('meeting_info', i) as string;

				let parsedInfo;
				try {
					parsedInfo = JSON.parse(meeting_info);
				} catch (error) {
					throw new NodeOperationError(
						this.getNode(),
						`meeting_info 必须是有效的 JSON: ${error.message}`,
						{ itemIndex: i },
					);
				}

				response = await weComApiRequest.call(this, 'POST', '/cgi-bin/meeting/update', {
					meetingid,
					...parsedInfo,
				});
			} else if (operation === 'getMeetingInvitees') {
				const meetingid = this.getNodeParameter('meetingid', i) as string;
				const cursor = this.getNodeParameter('cursor', i, '') as string;
				const limit = this.getNodeParameter('limit', i, 20) as number;

				const body: IDataObject = { meetingid, limit };
				if (cursor) body.cursor = cursor;

				response = await weComApiRequest.call(this, 'POST', '/cgi-bin/meeting/get_invitees', body);
			} else if (operation === 'updateMeetingInvitees') {
				const meetingid = this.getNodeParameter('meetingid', i) as string;
				const invitees = this.getNodeParameter('invitees', i) as string;

				let parsedInvitees;
				try {
					parsedInvitees = JSON.parse(invitees);
				} catch (error) {
					throw new NodeOperationError(
						this.getNode(),
						`invitees 必须是有效的 JSON: ${error.message}`,
						{ itemIndex: i },
					);
				}

				response = await weComApiRequest.call(this, 'POST', '/cgi-bin/meeting/update_invitees', {
					meetingid,
					invitees: parsedInvitees,
				});
			} else if (operation === 'getLiveParticipants') {
				const meetingid = this.getNodeParameter('meetingid', i) as string;
				const cursor = this.getNodeParameter('cursor', i, '') as string;
				const limit = this.getNodeParameter('limit', i, 20) as number;

				const body: IDataObject = { meetingid, limit };
				if (cursor) body.cursor = cursor;

				response = await weComApiRequest.call(this, 'POST', '/cgi-bin/meeting/get_participants', body);
			} else if (operation === 'getParticipants') {
				const meetingid = this.getNodeParameter('meetingid', i) as string;
				const cursor = this.getNodeParameter('cursor', i, '') as string;
				const limit = this.getNodeParameter('limit', i, 20) as number;

				const body: IDataObject = { meetingid, limit };
				if (cursor) body.cursor = cursor;

				response = await weComApiRequest.call(this, 'POST', '/cgi-bin/meeting/get_user_meeting_list', body);
			}
			// 会中控制管理
			else if (operation === 'muteMember') {
				const meetingid = this.getNodeParameter('meetingid', i) as string;
				const action = this.getNodeParameter('action', i) as string;
				const userids = this.getNodeParameter('userids', i) as string;

				response = await weComApiRequest.call(this, 'POST', '/cgi-bin/meeting/mute', {
					meetingid,
					action,
					userid_list: userids.split(',').map((id) => id.trim()),
				});
			} else if (operation === 'removeMember') {
				const meetingid = this.getNodeParameter('meetingid', i) as string;
				const userids = this.getNodeParameter('userids', i) as string;

				response = await weComApiRequest.call(this, 'POST', '/cgi-bin/meeting/kick_user', {
					meetingid,
					userid_list: userids.split(',').map((id) => id.trim()),
				});
			} else if (operation === 'endMeeting') {
				const meetingid = this.getNodeParameter('meetingid', i) as string;

				response = await weComApiRequest.call(this, 'POST', '/cgi-bin/meeting/dismiss', {
					meetingid,
				});
			}
			// 录制管理
			else if (operation === 'listRecordings') {
				const meetingid = this.getNodeParameter('meetingid', i) as string;

				response = await weComApiRequest.call(this, 'POST', '/cgi-bin/meeting/get_meeting_record_list', {
					meetingid,
				});
			} else if (operation === 'getRecordingAddress') {
				const record_file_id = this.getNodeParameter('record_file_id', i) as string;

				response = await weComApiRequest.call(this, 'POST', '/cgi-bin/meeting/get_meeting_record', {
					record_file_id,
				});
			}
			// 高级功能账号管理
			else if (operation === 'allocateMeetingAdvancedAccount') {
				const userids = this.getNodeParameter('userids', i) as string;

				response = await weComApiRequest.call(this, 'POST', '/cgi-bin/meeting/vip_batch_add', {
					userid_list: userids.split(',').map((id) => id.trim()),
				});
			} else if (operation === 'deallocateMeetingAdvancedAccount') {
				const userids = this.getNodeParameter('userids', i) as string;

				response = await weComApiRequest.call(this, 'POST', '/cgi-bin/meeting/vip_batch_del', {
					userid_list: userids.split(',').map((id) => id.trim()),
				});
			} else if (operation === 'getMeetingAdvancedAccountList') {
				const limit = this.getNodeParameter('limit', i, 100) as number;
				const cursor = this.getNodeParameter('cursor', i, '') as string;

				const body: IDataObject = { limit };
				if (cursor) body.cursor = cursor;

				response = await weComApiRequest.call(this, 'POST', '/cgi-bin/meeting/vip_list', body);
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

