import type { IExecuteFunctions, INodeExecutionData, IDataObject } from 'n8n-workflow';
import { NodeOperationError } from 'n8n-workflow';
import { createNewOrder } from './createNewOrder';
import { createRenewOrderJob } from './createRenewOrderJob';
import { submitOrderJob } from './submitOrderJob';
import { listOrder } from './listOrder';
import { getOrder } from './getOrder';
import { listOrderAccount } from './listOrderAccount';
import { cancelOrder } from './cancelOrder';
import { createNewOrderJob } from './createNewOrderJob';
import { submitNewOrderJob } from './submitNewOrderJob';
import { newOrderJobResult } from './newOrderJobResult';
import { getUnionOrder } from './getUnionOrder';
import { submitPayJob } from './submitPayJob';
import { payJobResult } from './payJobResult';
import { activeAccount } from './activeAccount';
import { batchActiveAccount } from './batchActiveAccount';
import { activeAccountByType } from './activeAccountByType';
import { getActiveInfoByCode } from './getActiveInfoByCode';
import { batchGetActiveInfoByCode } from './batchGetActiveInfoByCode';
import { listActivedAccount } from './listActivedAccount';
import { getActiveInfoByUser } from './getActiveInfoByUser';
import { batchTransferLicense } from './batchTransferLicense';
import { batchShareActiveCode } from './batchShareActiveCode';
import { getAppLicenseInfo } from './getAppLicenseInfo';
import { setAutoActiveStatus } from './setAutoActiveStatus';
import { getAutoActiveStatus } from './getAutoActiveStatus';
import { getAccountBalance } from './getAccountBalance';
import { supportPolicyQuery } from './supportPolicyQuery';

/**
 * 执行接口调用许可相关操作
 */
export async function executeLicense(
	this: IExecuteFunctions,
	operation: string,
	items: INodeExecutionData[],
): Promise<INodeExecutionData[]> {
	const returnData: INodeExecutionData[] = [];

	for (let i = 0; i < items.length; i++) {
		try {
			let responseData: IDataObject = {};

			switch (operation) {
				case 'createNewOrder':
					responseData = await createNewOrder.call(this, i);
					break;
				case 'createRenewOrderJob':
					responseData = await createRenewOrderJob.call(this, i);
					break;
				case 'submitOrderJob':
					responseData = await submitOrderJob.call(this, i);
					break;
				case 'listOrder':
					responseData = await listOrder.call(this, i);
					break;
				case 'getOrder':
					responseData = await getOrder.call(this, i);
					break;
				case 'listOrderAccount':
					responseData = await listOrderAccount.call(this, i);
					break;
				case 'cancelOrder':
					responseData = await cancelOrder.call(this, i);
					break;
				case 'createNewOrderJob':
					responseData = await createNewOrderJob.call(this, i);
					break;
				case 'submitNewOrderJob':
					responseData = await submitNewOrderJob.call(this, i);
					break;
				case 'newOrderJobResult':
					responseData = await newOrderJobResult.call(this, i);
					break;
				case 'getUnionOrder':
					responseData = await getUnionOrder.call(this, i);
					break;
				case 'submitPayJob':
					responseData = await submitPayJob.call(this, i);
					break;
				case 'payJobResult':
					responseData = await payJobResult.call(this, i);
					break;
				case 'activeAccount':
					responseData = await activeAccount.call(this, i);
					break;
				case 'batchActiveAccount':
					responseData = await batchActiveAccount.call(this, i);
					break;
				case 'activeAccountByType':
					responseData = await activeAccountByType.call(this, i);
					break;
				case 'getActiveInfoByCode':
					responseData = await getActiveInfoByCode.call(this, i);
					break;
				case 'batchGetActiveInfoByCode':
					responseData = await batchGetActiveInfoByCode.call(this, i);
					break;
				case 'listActivedAccount':
					responseData = await listActivedAccount.call(this, i);
					break;
				case 'getActiveInfoByUser':
					responseData = await getActiveInfoByUser.call(this, i);
					break;
				case 'batchTransferLicense':
					responseData = await batchTransferLicense.call(this, i);
					break;
				case 'batchShareActiveCode':
					responseData = await batchShareActiveCode.call(this, i);
					break;
				case 'getAppLicenseInfo':
					responseData = await getAppLicenseInfo.call(this, i);
					break;
				case 'setAutoActiveStatus':
					responseData = await setAutoActiveStatus.call(this, i);
					break;
				case 'getAutoActiveStatus':
					responseData = await getAutoActiveStatus.call(this, i);
					break;
				case 'getAccountBalance':
					responseData = await getAccountBalance.call(this, i);
					break;
				case 'supportPolicyQuery':
					responseData = await supportPolicyQuery.call(this, i);
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
