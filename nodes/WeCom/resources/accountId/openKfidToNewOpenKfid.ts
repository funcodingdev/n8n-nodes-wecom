import type { IExecuteFunctions, IDataObject } from 'n8n-workflow';
import { weComApiRequest } from '../../shared/transport';
import { requireStringList } from './utils';

export async function openKfidToNewOpenKfid(
	this: IExecuteFunctions,
	index: number,
): Promise<IDataObject> {
	const openKfidList = requireStringList(this, this.getNodeParameter('openKfidList', index), 'Open KfID 列表', index, 1000);

	const body: IDataObject = {
		open_kfid_list: openKfidList,
	};

	const responseData = await weComApiRequest.call(
		this,
		'POST',
		'/cgi-bin/idconvert/open_kfid',
		body,
	);

	return responseData;
}
