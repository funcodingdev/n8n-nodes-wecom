import type { IExecuteFunctions, IDataObject } from 'n8n-workflow';
import { weComApiRequest } from '../../shared/transport';
import { mergeStringListWithJson } from './utils';

export async function openKfidToNewOpenKfid(
	this: IExecuteFunctions,
	index: number,
): Promise<IDataObject> {
	const openKfidList = mergeStringListWithJson(
		this,
		this.getNodeParameter('openKfidList', index),
		this.getNodeParameter('openKfidListJson', index, '[]'),
		'Open KfID 列表',
		index,
		1000,
		['open_kfid', 'openKfid', 'kfid', 'id'],
	);

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
