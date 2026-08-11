import { executeExtraHttpOp } from '../../shared/extraHttpOp';
import { systemExtraHttpOpsById } from './extraHttpOps';
import type { IExecuteFunctions, IDataObject } from 'n8n-workflow';
import { getApiDomainIp } from './getApiDomainIp';
import { getCallbackIp } from './getCallbackIp';
import { getAccessToken } from './getAccessToken';

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
		case 'getAccessToken':
			responseData = await getAccessToken.call(this);
			break;
		default: {
			if (systemExtraHttpOpsById[operation]) {
				const bodyDefaults: IDataObject = {};
				const qsDefaults: IDataObject = {};
				const sys_code = this.getNodeParameter('sys_code', index, '') as string;
				const sys_userid = this.getNodeParameter('sys_userid', index, '') as string;
				if (sys_code) qsDefaults.code = sys_code;
				if (sys_code && operation === 'miniprogramJscode2session') qsDefaults.js_code = sys_code;
				if (sys_userid) bodyDefaults.userid = sys_userid;
				responseData = await executeExtraHttpOp.call(
					this,
					systemExtraHttpOpsById[operation],
					index,
					bodyDefaults,
					qsDefaults,
				);
				break;
			}
			throw new Error(`未知操作: ${operation}`);
		}
	}

	return [responseData];
}

