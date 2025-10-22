import type { IExecuteFunctions, INodeExecutionData } from 'n8n-workflow';
import { weComApiRequest } from '../../shared/transport';

export async function executeEmergency(
	this: IExecuteFunctions,
	operation: string,
	items: INodeExecutionData[],
): Promise<INodeExecutionData[]> {
	const returnData: INodeExecutionData[] = [];

	for (let i = 0; i < items.length; i++) {
		try {
			let responseData;

			if (operation === 'makeVoiceCall') {
				// 发起语音电话
				// https://developer.work.weixin.qq.com/document/path/91627
				const callee_userid = this.getNodeParameter('callee_userid', i) as string;
				const text = this.getNodeParameter('text', i) as string;

				responseData = await weComApiRequest.call(this, 'POST', '/cgi-bin/pstncc/call', {
					callee_userid,
					text,
				});
			} else if (operation === 'getCallStatus') {
				// 获取接听状态
				// https://developer.work.weixin.qq.com/document/path/91628
				const callid = this.getNodeParameter('callid', i) as string;

				responseData = await weComApiRequest.call(this, 'POST', '/cgi-bin/pstncc/getstatus', {
					callid,
				});
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

