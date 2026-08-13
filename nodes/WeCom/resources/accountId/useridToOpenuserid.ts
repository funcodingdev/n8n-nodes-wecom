import type { IExecuteFunctions, IDataObject } from 'n8n-workflow';
import { weComApiRequest } from '../../shared/transport';
import { requireStringList } from './utils';

export async function useridToOpenuserid(
	this: IExecuteFunctions,
	index: number,
): Promise<IDataObject> {
	const useridList = requireStringList(this, this.getNodeParameter('useridList', index), 'UserID 列表', index, 1000);

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
