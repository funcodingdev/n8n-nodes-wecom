import type { IExecuteFunctions, INodeExecutionData } from 'n8n-workflow';
import { weComApiRequest } from '../../shared/transport';

export async function executeHr(
	this: IExecuteFunctions,
	operation: string,
	items: INodeExecutionData[],
): Promise<INodeExecutionData[]> {
	const returnData: INodeExecutionData[] = [];

	for (let i = 0; i < items.length; i++) {
		try {
			let responseData;

			if (operation === 'getFieldList') {
				// 获取员工字段配置
				// https://developer.work.weixin.qq.com/document/path/99131
				responseData = await weComApiRequest.call(this, 'GET', '/cgi-bin/hr/get_fields', {});
			} else if (operation === 'getStaffInfo') {
				// 获取员工花名册信息
				// https://developer.work.weixin.qq.com/document/path/99132
				const userid = this.getNodeParameter('userid', i) as string;
				responseData = await weComApiRequest.call(this, 'POST', '/cgi-bin/hr/get_staff_info', {
					userid,
				});
			} else if (operation === 'updateStaffInfo') {
				// 更新员工花名册信息
				// https://developer.work.weixin.qq.com/document/path/99133
				const userid = this.getNodeParameter('userid', i) as string;
				const staffData = this.getNodeParameter('staffData', i) as string;

				responseData = await weComApiRequest.call(this, 'POST', '/cgi-bin/hr/update_staff_info', {
					userid,
					...JSON.parse(staffData),
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

