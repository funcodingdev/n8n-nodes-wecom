import type { IExecuteFunctions, IDataObject } from 'n8n-workflow';
import { getApiDomainIp } from './getApiDomainIp';
import { getCallbackIp } from './getCallbackIp';

/**
 * 执行系统相关操作
 */
export async function executeSystem(
	this: IExecuteFunctions,
	index: number,
): Promise<IDataObject[]> {
	const operation = this.getNodeParameter('operation', index) as string;

	let responseData: IDataObject = {};

	switch (operation) {
		case 'getApiDomainIp':
			responseData = await getApiDomainIp.call(this);
			break;
		case 'getCallbackIp':
			responseData = await getCallbackIp.call(this);
			break;
		default:
			throw new Error(`未知操作: ${operation}`);
	}

	return [responseData];
}

