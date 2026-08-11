import type { IExecuteFunctions, INodeExecutionData, IDataObject } from 'n8n-workflow';
import { weComApiRequest } from '../../shared/transport';

export async function executeMsgaudit(
	this: IExecuteFunctions,
	operation: string,
	items: INodeExecutionData[],
): Promise<INodeExecutionData[]> {
	const returnData: INodeExecutionData[] = [];

	for (let i = 0; i < items.length; i++) {
		try {
			let responseData: IDataObject = {};

			if (operation === 'getPermitUserList') {
				// https://developer.work.weixin.qq.com/document/path/91614
				const type = this.getNodeParameter('type', i, 0) as number;
				const body: IDataObject = {};
				if (type) body.type = type;
				responseData = await weComApiRequest.call(
					this,
					'POST',
					'/cgi-bin/msgaudit/get_permit_user_list',
					body,
				);
			} else if (operation === 'checkSingleAgree') {
				// https://developer.work.weixin.qq.com/document/path/91782
				const infoJson = this.getNodeParameter('infoJson', i) as string;
				let info: IDataObject[] = [];
				try {
					info = JSON.parse(infoJson || '[]') as IDataObject[];
				} catch {
					info = [];
				}
				responseData = await weComApiRequest.call(
					this,
					'POST',
					'/cgi-bin/msgaudit/check_single_agree',
					{ info },
				);
			} else if (operation === 'checkRoomAgree') {
				const infoJson = this.getNodeParameter('infoJson', i) as string;
				let body: IDataObject = {};
				try {
					const parsed = JSON.parse(infoJson || '{}');
					body = Array.isArray(parsed) ? { info: parsed } : (parsed as IDataObject);
				} catch {
					body = {};
				}
				responseData = await weComApiRequest.call(
					this,
					'POST',
					'/cgi-bin/msgaudit/check_room_agree',
					body,
				);
			} else if (operation === 'getGroupChat') {
				// https://developer.work.weixin.qq.com/document/path/92951
				const roomid = this.getNodeParameter('roomid', i) as string;
				responseData = await weComApiRequest.call(
					this,
					'POST',
					'/cgi-bin/msgaudit/groupchat/get',
					{ roomid },
				);
			} else if (operation === 'getRobotInfo') {
				const robot_id = this.getNodeParameter('robot_id', i) as string;
				responseData = await weComApiRequest.call(
					this,
					'GET',
					'/cgi-bin/msgaudit/get_robot_info',
					{},
					{ robot_id },
				);
			}

			returnData.push({
				json: responseData,
				pairedItem: { item: i },
			});
		} catch (error) {
			if (this.continueOnFail()) {
				returnData.push({
					json: { error: (error as Error).message },
					pairedItem: { item: i },
				});
				continue;
			}
			throw error;
		}
	}

	return returnData;
}
