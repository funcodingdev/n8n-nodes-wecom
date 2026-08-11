import type { IExecuteFunctions, INodeExecutionData, IDataObject } from 'n8n-workflow';
import { openuseridToUserid } from './openuseridToUserid';
import { useridToOpenuserid } from './useridToOpenuserid';
import { fromServiceExternalUserid } from './fromServiceExternalUserid';
import { getNewExternalUserid } from './getNewExternalUserid';
import { getNewExternalUseridGroupchat } from './getNewExternalUseridGroupchat';
import { convertTmpExternalUserid } from './convertTmpExternalUserid';
import { corpidToOpencorpid } from './corpidToOpencorpid';
import { unionidToExternalUserid } from './unionidToExternalUserid';
import { externalUseridToPendingId } from './externalUseridToPendingId';
import { externalTagidToOpenExternalTagid } from './externalTagidToOpenExternalTagid';
import { openKfidToNewOpenKfid } from './openKfidToNewOpenKfid';
import { finishOpenidMigration } from './finishOpenidMigration';
import { opencorpidToCorpid } from './opencorpidToCorpid';

export async function executeAccountId(
	this: IExecuteFunctions,
	operation: string,
	items: INodeExecutionData[],
): Promise<INodeExecutionData[]> {
	const returnData: INodeExecutionData[] = [];

	for (let i = 0; i < items.length; i++) {
		try {
			let responseData: IDataObject = {};

			switch (operation) {
				case 'openuseridToUserid':
					responseData = await openuseridToUserid.call(this, i);
					break;
				case 'useridToOpenuserid':
					responseData = await useridToOpenuserid.call(this, i);
					break;
				case 'fromServiceExternalUserid':
					responseData = await fromServiceExternalUserid.call(this, i);
					break;
				case 'getNewExternalUserid':
					responseData = await getNewExternalUserid.call(this, i);
					break;
				case 'getNewExternalUseridGroupchat':
					responseData = await getNewExternalUseridGroupchat.call(this, i);
					break;
				case 'convertTmpExternalUserid':
					responseData = await convertTmpExternalUserid.call(this, i);
					break;
				case 'corpidToOpencorpid':
					responseData = await corpidToOpencorpid.call(this, i);
					break;
				case 'unionidToExternalUserid':
					responseData = await unionidToExternalUserid.call(this, i);
					break;
				case 'externalUseridToPendingId':
					responseData = await externalUseridToPendingId.call(this, i);
					break;
				case 'externalTagidToOpenExternalTagid':
					responseData = await externalTagidToOpenExternalTagid.call(this, i);
					break;
				case 'openKfidToNewOpenKfid':
					responseData = await openKfidToNewOpenKfid.call(this, i);
					break;
				case 'finishOpenidMigration':
					responseData = await finishOpenidMigration.call(this, i);
					break;
				case 'opencorpidToCorpid':
					responseData = await opencorpidToCorpid.call(this, i);
					break;
				default:
					throw new Error(`未知操作: ${operation}`);
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
				throw error;
			}
		}
	}

	return returnData;
}
