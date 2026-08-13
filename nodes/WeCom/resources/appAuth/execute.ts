import type { IExecuteFunctions, INodeExecutionData, IDataObject } from 'n8n-workflow';
import { NodeOperationError } from 'n8n-workflow';
import { getSuiteToken } from './getSuiteToken';
import { getPreAuthCode } from './getPreAuthCode';
import { setSessionInfo } from './setSessionInfo';
import { getPermanentCode } from './getPermanentCode';
import { getAuthInfo } from './getAuthInfo';
import { getCorpToken } from './getCorpToken';
import { getAppQrcode } from './getAppQrcode';
import { corpidToOpencorpid } from './corpidToOpencorpid';
import { getPermissions } from './getPermissions';
import { getAdminList } from './getAdminList';
import { getOrderList } from './getOrderList';
import { getOrder } from './getOrder';
import { prolongTry } from './prolongTry';

/**
 * 执行应用授权相关操作
 */
export async function executeAppAuth(
	this: IExecuteFunctions,
	operation: string,
	items: INodeExecutionData[],
): Promise<INodeExecutionData[]> {
	const returnData: INodeExecutionData[] = [];

	for (let i = 0; i < items.length; i++) {
		try {
			let responseData: IDataObject = {};

			switch (operation) {
				case 'getSuiteToken':
					responseData = await getSuiteToken.call(this, i);
					break;
				case 'getPreAuthCode':
					responseData = await getPreAuthCode.call(this, i);
					break;
				case 'setSessionInfo':
					responseData = await setSessionInfo.call(this, i);
					break;
				case 'getPermanentCode':
					responseData = await getPermanentCode.call(this, i);
					break;
				case 'getAuthInfo':
					responseData = await getAuthInfo.call(this, i);
					break;
				case 'getCorpToken':
					responseData = await getCorpToken.call(this, i);
					break;
				case 'getAppQrcode': {
					const result = await getAppQrcode.call(this, i);
					returnData.push({
						...result,
						pairedItem: { item: i },
					});
					continue;
				}
				case 'corpidToOpencorpid':
					responseData = await corpidToOpencorpid.call(this, i);
					break;
				case 'getPermissions':
					responseData = await getPermissions.call(this, i);
					break;
				case 'getAdminList':
					responseData = await getAdminList.call(this, i);
					break;
				case 'getOrderList':
					responseData = await getOrderList.call(this, i);
					break;
				case 'getOrder':
					responseData = await getOrder.call(this, i);
					break;
				case 'prolongTry':
					responseData = await prolongTry.call(this, i);
					break;
				default:
					throw new NodeOperationError(this.getNode(), `未知操作: ${operation}`, {
						itemIndex: i,
					});
			}

			returnData.push({
				json: responseData,
				pairedItem: { item: i },
			});
		} catch (error) {
			if (this.continueOnFail()) {
				returnData.push({
					json: {
						error: (error as Error).message,
						success: false,
					},
					pairedItem: { item: i },
				});
			} else {
				if (error instanceof NodeOperationError) throw error;
				throw new NodeOperationError(this.getNode(), (error as Error).message, {
					itemIndex: i,
				});
			}
		}
	}

	return returnData;
}
