import type { IExecuteFunctions, IDataObject } from 'n8n-workflow';
import { weComApiRequest } from '../../shared/transport';
import { mergeStringListWithJson } from './utils';

export async function useridToOpenuserid(
	this: IExecuteFunctions,
	index: number,
): Promise<IDataObject> {
	const useridList = mergeStringListWithJson(
		this,
		this.getNodeParameter('useridList', index),
		this.getNodeParameter('useridListJson', index, '[]'),
		'UserID 列表',
		index,
		1000,
		['userid', 'user_id', 'id'],
	);

	const body: IDataObject = {
		userid_list: useridList,
	};

	const responseData = await weComApiRequest.call(
		this,
		'POST',
		'/cgi-bin/batch/userid_to_openuserid',
		body,
	);

	return responseData;
}
