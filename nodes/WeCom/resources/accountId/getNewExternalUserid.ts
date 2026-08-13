import type { IExecuteFunctions, IDataObject } from 'n8n-workflow';
import { weComApiRequest } from '../../shared/transport';
import { requireStringList } from './utils';

export async function getNewExternalUserid(
	this: IExecuteFunctions,
	index: number,
): Promise<IDataObject> {
	const externalUseridList = requireStringList(this, this.getNodeParameter('externalUseridList', index), 'External UserID 列表', index, 1000);

	const body: IDataObject = {
		external_userid_list: externalUseridList,
	};

	const responseData = await weComApiRequest.call(
		this,
		'POST',
		'/cgi-bin/externalcontact/get_new_external_userid',
		body,
	);

	return responseData;
}
