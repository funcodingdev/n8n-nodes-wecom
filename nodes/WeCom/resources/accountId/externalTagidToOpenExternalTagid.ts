import type { IExecuteFunctions, IDataObject } from 'n8n-workflow';
import { weComApiRequest } from '../../shared/transport';
import { mergeStringListWithJson } from './utils';

export async function externalTagidToOpenExternalTagid(
	this: IExecuteFunctions,
	index: number,
): Promise<IDataObject> {
	const externalTagidList = mergeStringListWithJson(
		this,
		this.getNodeParameter('externalTagidList', index),
		this.getNodeParameter('externalTagidListJson', index, '[]'),
		'External TagID 列表',
		index,
		1000,
		['external_tagid', 'tagid', 'tag_id', 'id'],
	);

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
