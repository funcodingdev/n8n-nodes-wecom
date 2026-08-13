import type { IExecuteFunctions, IDataObject } from 'n8n-workflow';
import { weComApiRequest } from '../../shared/transport';
import { requireStringList } from './utils';

export async function externalTagidToOpenExternalTagid(
	this: IExecuteFunctions,
	index: number,
): Promise<IDataObject> {
	const externalTagidList = requireStringList(this, this.getNodeParameter('externalTagidList', index), 'External TagID 列表', index, 1000);

	const body: IDataObject = {
		external_tagid_list: externalTagidList,
	};

	const responseData = await weComApiRequest.call(
		this,
		'POST',
		'/cgi-bin/idconvert/external_tagid',
		body,
	);

	return responseData;
}
